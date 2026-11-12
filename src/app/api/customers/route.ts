import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AccountStatus, TransactionType } from "@prisma/client";
import { hashPassword } from "@/lib/crypto";
import { customerOnboardSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const where: any = {};

    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: "insensitive" } },
        { ownerName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search } },
        { id: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category && category !== "all") {
      where.businessCategory = category;
    }

    if (status && status !== "all") {
      where.accountStatus = status === "active" ? AccountStatus.ACTIVE : AccountStatus.SUSPENDED;
    }

    const customers = await prisma.customerProfile.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            campaigns: true,
            contacts: true,
            senderHeaders: true,
          },
        },
      },
    });

    const formatted = customers.map((c) => ({
      id: c.id,
      businessName: c.businessName,
      ownerName: c.ownerName,
      email: c.email,
      mobile: c.mobile,
      businessCategory: c.businessCategory,
      city: c.city,
      state: c.state,
      gstin: c.gstin || undefined,
      dltEntityId: c.dltEntityId,
      walletBalance: Number(c.walletBalance),
      totalMessages: c.totalMessages,
      accountStatus: c.accountStatus.toLowerCase() as "active" | "suspended" | "pending",
      registrationDate: c.createdAt.toISOString().split("T")[0],
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("GET /api/customers error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = customerOnboardSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const {
      businessName,
      ownerName,
      email,
      mobile,
      password,
      businessCategory,
      city,
      state,
      gstin,
      dltEntityId,
      initialWallet = 500,
    } = parsed.data;

    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile.replace(/\D/g, "").slice(-10);

    // Check existing customer
    const existing = await prisma.customerProfile.findFirst({
      where: {
        OR: [{ email: cleanEmail }, { mobile: cleanMobile }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "A customer with this email or mobile number already exists." },
        { status: 409 }
      );
    }

    const rawPassword =
      password && password.trim().length >= 6
        ? password.trim()
        : `Client@${Math.floor(100 + Math.random() * 900)}`;

    const secureHashedPassword = hashPassword(rawPassword);
    const assignedDlt = dltEntityId?.trim() || `17011${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const balanceNum = typeof initialWallet === "number" ? initialWallet : parseFloat(initialWallet) || 0;

    // Execute atomic transaction: create User + create CustomerProfile + initial wallet transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Provision or update User authentication record
      let user = await tx.user.findUnique({ where: { email: cleanEmail } });
      if (user) {
        user = await tx.user.update({
          where: { id: user.id },
          data: {
            passwordHash: secureHashedPassword,
            name: ownerName.trim(),
            role: "CLIENT",
          },
        });
      } else {
        user = await tx.user.create({
          data: {
            email: cleanEmail,
            name: ownerName.trim(),
            passwordHash: secureHashedPassword,
            role: "CLIENT",
          },
        });
      }

      // 2. Provision CustomerProfile linked to userId
      const customer = await tx.customerProfile.create({
        data: {
          userId: user.id,
          businessName: businessName.trim(),
          ownerName: ownerName.trim(),
          email: cleanEmail,
          mobile: cleanMobile,
          businessCategory: businessCategory || "Retail & Apparel",
          city: city?.trim() || "Mumbai",
          state: state?.trim() || "Maharashtra",
          gstin: gstin?.trim() || null,
          dltEntityId: assignedDlt,
          walletBalance: balanceNum,
          totalMessages: 0,
          accountStatus: AccountStatus.ACTIVE,
        },
      });

      // 3. Welcome credit
      if (balanceNum > 0) {
        await tx.walletTransaction.create({
          data: {
            customerId: customer.id,
            type: TransactionType.MANUAL_CREDIT,
            amount: balanceNum,
            previousBalance: 0,
            newBalance: balanceNum,
            reference: `ONBOARD-${Date.now().toString().slice(-6)}`,
            description: "Welcome Promotional Credits granted upon account provisioning",
          },
        });
      }

      // 4. Create default contact group
      await tx.contactGroup.create({
        data: {
          customerId: customer.id,
          name: "General Customers",
          description: "Default customer audience group",
        },
      });

      return { customer, user, password: rawPassword };
    });

    return NextResponse.json({
      success: true,
      message: `Customer ${result.customer.businessName} onboarded successfully with portal access`,
      data: {
        id: result.customer.id,
        userId: result.user.id,
        businessName: result.customer.businessName,
        ownerName: result.customer.ownerName,
        email: result.customer.email,
        mobile: result.customer.mobile,
        businessCategory: result.customer.businessCategory,
        city: result.customer.city,
        state: result.customer.state,
        gstin: result.customer.gstin || undefined,
        dltEntityId: result.customer.dltEntityId,
        walletBalance: Number(result.customer.walletBalance),
        totalMessages: result.customer.totalMessages,
        accountStatus: "active",
        registrationDate: result.customer.createdAt.toISOString().split("T")[0],
      },
      credentials: {
        email: result.user.email,
        password: result.password,
        loginUrl: "/login",
        mobile: result.customer.mobile,
      },
    });
  } catch (error: any) {
    console.error("POST /api/customers error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

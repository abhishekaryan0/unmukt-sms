import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AccountStatus, TransactionType } from "@prisma/client";

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
    const {
      businessName,
      ownerName,
      email,
      mobile,
      businessCategory,
      city,
      state,
      gstin,
      dltEntityId,
      initialWallet = 500,
    } = body;

    if (!businessName || !ownerName || !email || !mobile) {
      return NextResponse.json(
        { success: false, error: "Business name, owner name, email, and mobile are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile.replace(/\D/g, "").slice(-10);

    // Check existing
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

    const assignedDlt = dltEntityId?.trim() || `17011${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const balanceNum = parseFloat(initialWallet) || 0;

    // Execute atomic transaction: create customer + initial wallet transaction
    const result = await prisma.$transaction(async (tx) => {
      const customer = await tx.customerProfile.create({
        data: {
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

      // Create default contact group
      await tx.contactGroup.create({
        data: {
          customerId: customer.id,
          name: "General Customers",
          description: "Default customer audience group",
        },
      });

      return customer;
    });

    return NextResponse.json({
      success: true,
      message: `Customer ${result.businessName} onboarded successfully`,
      data: {
        id: result.id,
        businessName: result.businessName,
        ownerName: result.ownerName,
        email: result.email,
        mobile: result.mobile,
        businessCategory: result.businessCategory,
        city: result.city,
        state: result.state,
        gstin: result.gstin || undefined,
        dltEntityId: result.dltEntityId,
        walletBalance: Number(result.walletBalance),
        totalMessages: result.totalMessages,
        accountStatus: "active",
        registrationDate: result.createdAt.toISOString().split("T")[0],
      },
    });
  } catch (error: any) {
    console.error("POST /api/customers error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

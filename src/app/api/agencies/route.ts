import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const agencies = await prisma.agencyProfile.findMany({
      orderBy: { createdAt: "desc" },
    });

    const customers = await prisma.customerProfile.findMany({
      select: { id: true },
      take: 10,
    });

    const formatted = agencies.map((a) => {
      const discount = Number(a.pricingDiscount || 10);
      return {
        id: a.id,
        agencyName: a.agencyName,
        ownerName: a.ownerName,
        email: a.email,
        phone: a.phone,
        mobile: a.phone,
        city: a.city,
        state: a.state,
        walletBalance: Number(a.walletBalance),
        clientCount: a.clientCount,
        clientsManaged: a.clientCount,
        pricingDiscount: discount,
        accountStatus: a.accountStatus.toLowerCase() as any,
        joinedDate: a.createdAt.toISOString().split("T")[0],
        customPricing: {
          smsPromo: Number((0.22 * (1 - discount / 100)).toFixed(2)) || 0.18,
          smsTrans: Number((0.25 * (1 - discount / 100)).toFixed(2)) || 0.20,
          whatsappMarketing: Number((1.10 * (1 - discount / 100)).toFixed(2)) || 0.95,
        },
        managedClientIds: customers.slice(0, Math.min(3, a.clientCount || 2)).map((c) => c.id),
      };
    });

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("GET /api/agencies error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agencyName, ownerName, email, mobile, phone, city, state, initialWallet, discount } = body;

    if (!agencyName || !ownerName || !email) {
      return NextResponse.json(
        { success: false, error: "Agency name, owner name, and email are required" },
        { status: 400 }
      );
    }

    const created = await prisma.agencyProfile.create({
      data: {
        agencyName,
        ownerName,
        email,
        phone: mobile || phone || "9800000000",
        city: city || "Mumbai",
        state: state || "Maharashtra",
        walletBalance: parseFloat(initialWallet) || 1000,
        pricingDiscount: parseFloat(discount) || 10,
        clientCount: 0,
        accountStatus: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Agency partner '${created.agencyName}' registered successfully`,
      data: {
        id: created.id,
        agencyName: created.agencyName,
        ownerName: created.ownerName,
        email: created.email,
        phone: created.phone,
        mobile: created.phone,
        city: created.city,
        state: created.state,
        walletBalance: Number(created.walletBalance),
        clientsManaged: 0,
        customPricing: {
          smsPromo: 0.18,
          smsTrans: 0.20,
          whatsappMarketing: 0.95,
        },
        accountStatus: "active",
        joinedDate: created.createdAt.toISOString().split("T")[0],
        managedClientIds: [],
      },
    });
  } catch (error: any) {
    console.error("POST /api/agencies error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, accountStatus, walletAdjustment, note } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Agency ID required" }, { status: 400 });
    }

    const existing = await prisma.agencyProfile.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Agency not found" }, { status: 404 });
    }

    let updatedBalance = Number(existing.walletBalance);
    if (walletAdjustment && typeof walletAdjustment.amount === "number") {
      const delta = walletAdjustment.type === "debit" ? -walletAdjustment.amount : walletAdjustment.amount;
      updatedBalance = Math.max(0, updatedBalance + delta);
    }

    const updated = await prisma.agencyProfile.update({
      where: { id },
      data: {
        ...(accountStatus && { accountStatus: accountStatus.toUpperCase() }),
        walletBalance: updatedBalance,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Agency '${updated.agencyName}' updated successfully`,
      data: {
        id: updated.id,
        agencyName: updated.agencyName,
        walletBalance: Number(updated.walletBalance),
        accountStatus: updated.accountStatus.toLowerCase(),
      },
    });
  } catch (error: any) {
    console.error("PATCH /api/agencies error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AccountStatus, TransactionType } from "@prisma/client";
import { resolveTenantId, requireAdmin } from "@/lib/server-auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tenant = resolveTenantId(request, params.id);
    if (!tenant.authorized) {
      return tenant.errorResponse || NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (tenant.session?.role === "client" && tenant.customerId !== params.id) {
      return NextResponse.json({ success: false, error: "Unauthorized access to customer profile" }, { status: 403 });
    }

    const customer = await prisma.customerProfile.findUnique({
      where: { id: params.id },
      include: {
        campaigns: { orderBy: { createdAt: "desc" }, take: 10 },
        transactions: { orderBy: { createdAt: "desc" }, take: 15 },
        senderHeaders: true,
        whatsappProfile: true,
        contactGroups: true,
        _count: {
          select: {
            contacts: true,
            campaigns: true,
            transactions: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...customer,
        walletBalance: Number(customer.walletBalance),
        accountStatus: customer.accountStatus.toLowerCase(),
        registrationDate: customer.createdAt.toISOString().split("T")[0],
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Only Admin can adjust wallet or alter customer status
    const adminAuth = requireAdmin(request);
    if (!adminAuth.authorized) {
      return adminAuth.errorResponse || NextResponse.json({ success: false, error: "Super Admin authorization required" }, { status: 403 });
    }

    const body = await request.json();
    const { action, status, amount, type, note } = body;

    const customer = await prisma.customerProfile.findUnique({
      where: { id: params.id },
    });

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
    }

    // Toggle Account Status
    if (action === "toggle_status" || status) {
      const newStatus =
        status === "suspended" ? AccountStatus.SUSPENDED : AccountStatus.ACTIVE;

      const updated = await prisma.customerProfile.update({
        where: { id: customer.id },
        data: { accountStatus: newStatus },
      });

      return NextResponse.json({
        success: true,
        message: `Customer ${customer.businessName} status changed to ${newStatus.toLowerCase()}`,
        data: {
          ...updated,
          walletBalance: Number(updated.walletBalance),
          accountStatus: updated.accountStatus.toLowerCase(),
        },
      });
    }

    // Manual Wallet Credit / Debit (Atomic)
    if (action === "adjust_wallet") {
      const adjAmount = parseFloat(amount);
      if (!adjAmount || adjAmount <= 0) {
        return NextResponse.json(
          { success: false, error: "Valid positive adjustment amount required" },
          { status: 400 }
        );
      }

      const prevBal = Number(customer.walletBalance);
      const isCredit = type === "credit";

      if (!isCredit && prevBal < adjAmount) {
        return NextResponse.json(
          { success: false, error: `Insufficient customer balance. Available: ₹${prevBal.toFixed(2)}` },
          { status: 400 }
        );
      }

      const updated = await prisma.$transaction(async (tx) => {
        // Atomic balance update
        const c = isCredit
          ? await tx.customerProfile.update({
              where: { id: customer.id },
              data: { walletBalance: { increment: adjAmount } },
            })
          : await tx.customerProfile.update({
              where: {
                id: customer.id,
                walletBalance: { gte: adjAmount },
              },
              data: { walletBalance: { decrement: adjAmount } },
            });

        const newBal = Number(c.walletBalance);

        await tx.walletTransaction.create({
          data: {
            customerId: customer.id,
            type: isCredit ? TransactionType.MANUAL_CREDIT : TransactionType.MANUAL_DEBIT,
            amount: adjAmount,
            previousBalance: prevBal,
            newBalance: newBal,
            reference: `MANUAL-${Date.now().toString().slice(-6)}`,
            description: note || `Admin balance adjustment (${type})`,
          },
        });

        return c;
      });

      return NextResponse.json({
        success: true,
        message: `Wallet ${isCredit ? "credited" : "debited"} with ₹${adjAmount}`,
        data: {
          ...updated,
          walletBalance: Number(updated.walletBalance),
          accountStatus: updated.accountStatus.toLowerCase(),
        },
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("PATCH /api/customers/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

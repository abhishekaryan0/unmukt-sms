import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { resolveTenantId, requireAdmin } from "@/lib/server-auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedCustomerId = searchParams.get("customerId");

    const { customerId, session } = resolveTenantId(request, requestedCustomerId);

    const where: any = {};
    if (session?.role === "super_admin") {
      if (requestedCustomerId && requestedCustomerId !== "all") {
        where.customerId = requestedCustomerId;
      }
    } else {
      where.customerId = customerId;
    }

    const txs = await prisma.walletTransaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: { businessName: true },
        },
      },
    });

    const formatted = txs.map((t) => ({
      id: t.id,
      customerId: t.customerId,
      customerName: t.customer?.businessName,
      type: t.type.toLowerCase() as any,
      amount: Number(t.amount),
      previousBalance: Number(t.previousBalance),
      newBalance: Number(t.newBalance),
      reference: t.reference,
      date: t.createdAt.toISOString(),
      description: t.description || undefined,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST endpoint for Super Admin manual adjustment / refunds
export async function POST(request: Request) {
  try {
    const { authorized, errorResponse } = requireAdmin(request);
    if (!authorized) return errorResponse!;

    const body = await request.json();
    const { customerId, amount, type = "manual_credit", note, reference } = body;

    const delta = parseFloat(amount);
    if (!customerId || isNaN(delta) || delta <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid customer ID and positive amount required." },
        { status: 400 }
      );
    }

    const isCredit = type === "manual_credit" || type === "refund" || type === "recharge";
    const txnType: TransactionType =
      type === "refund"
        ? TransactionType.REFUND
        : isCredit
        ? TransactionType.MANUAL_CREDIT
        : TransactionType.MANUAL_DEBIT;

    const result = await prisma.$transaction(async (tx) => {
      const cust = await tx.customerProfile.findUnique({ where: { id: customerId } });
      if (!cust) throw new Error("Customer profile not found");

      const prevBal = Number(cust.walletBalance);
      if (!isCredit && prevBal < delta) {
        throw new Error(`Insufficient customer balance (Available: ₹${prevBal.toFixed(2)})`);
      }

      const newBal = isCredit ? prevBal + delta : prevBal - delta;

      await tx.customerProfile.update({
        where: { id: customerId },
        data: {
          walletBalance: isCredit ? { increment: delta } : { decrement: delta },
        },
      });

      const txnRef = reference || `ADJ-${isCredit ? "CR" : "DR"}-${Date.now().toString().slice(-6)}`;

      const transaction = await tx.walletTransaction.create({
        data: {
          customerId,
          type: txnType,
          amount: delta,
          previousBalance: prevBal,
          newBalance: newBal,
          reference: txnRef,
          description: note || `Administrative ${isCredit ? "Credit" : "Debit"} Adjustment`,
        },
      });

      return { transaction, newBalance: newBal };
    });

    return NextResponse.json({
      success: true,
      message: `Wallet adjustment of ₹${delta.toFixed(2)} applied successfully`,
      newBalance: result.newBalance,
      data: {
        id: result.transaction.id,
        customerId: result.transaction.customerId,
        type: result.transaction.type.toLowerCase(),
        amount: Number(result.transaction.amount),
        previousBalance: Number(result.transaction.previousBalance),
        newBalance: Number(result.transaction.newBalance),
        reference: result.transaction.reference,
        date: result.transaction.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("POST /api/wallet/transactions error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

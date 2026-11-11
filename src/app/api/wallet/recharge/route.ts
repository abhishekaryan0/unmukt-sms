import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { rechargeSchema } from "@/lib/validations";
import { resolveTenantId } from "@/lib/server-auth";

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const parsed = rechargeSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid recharge payload" },
        { status: 400 }
      );
    }

    const { customerId: requestedId, amount, paymentMethod = "UPI", idempotencyKey } = parsed.data;
    const { customerId: targetCustomerId } = resolveTenantId(request, requestedId);
    const rechargeAmount = Number(amount.toFixed(2));

    // 1. Idempotency Check
    const txnRef =
      idempotencyKey ||
      `TXN-${paymentMethod.toUpperCase().replace(/\s+/g, "")}-${Date.now().toString().slice(-8)}`;

    const existingTx = await prisma.walletTransaction.findFirst({
      where: {
        customerId: targetCustomerId,
        reference: txnRef,
      },
    });

    if (existingTx) {
      const existingInv = await prisma.invoice.findFirst({
        where: { transactionReference: txnRef },
      });

      return NextResponse.json({
        success: true,
        message: `Transaction already processed (Idempotent response)`,
        newBalance: Number(existingTx.newBalance),
        transaction: {
          id: existingTx.id,
          customerId: existingTx.customerId,
          type: "recharge",
          amount: Number(existingTx.amount),
          previousBalance: Number(existingTx.previousBalance),
          newBalance: Number(existingTx.newBalance),
          reference: existingTx.reference,
          date: existingTx.createdAt.toISOString(),
        },
        invoice: existingInv
          ? {
              id: existingInv.id,
              invoiceNumber: existingInv.invoiceNumber,
              totalAmount: Number(existingInv.totalAmount),
            }
          : null,
      });
    }

    // 2. 18% GST breakdown (Base Amount + 18% GST = Total Recharge Amount)
    const baseAmount = Number((rechargeAmount / 1.18).toFixed(2));
    const gstAmount = Number((rechargeAmount - baseAmount).toFixed(2));
    const invoiceNum = `INV/${new Date().getFullYear()}-${(new Date().getFullYear() + 1)
      .toString()
      .slice(-2)}/${Math.floor(10000 + Math.random() * 90000)}`;

    // 3. Atomic Transaction: Atomic Increment on CustomerProfile, Ledger Insert, and Tax Invoice Generation
    const result = await prisma.$transaction(async (tx) => {
      // Find current customer inside transaction
      const cust = await tx.customerProfile.findUnique({
        where: { id: targetCustomerId },
      });

      if (!cust) {
        throw new Error("Customer profile not found");
      }

      const prevBal = Number(cust.walletBalance);
      const newBal = Number((prevBal + rechargeAmount).toFixed(2));

      // Atomic balance increment
      await tx.customerProfile.update({
        where: { id: targetCustomerId },
        data: {
          walletBalance: { increment: rechargeAmount },
        },
      });

      // Create Ledger Transaction
      const transaction = await tx.walletTransaction.create({
        data: {
          customerId: targetCustomerId,
          type: TransactionType.RECHARGE,
          amount: rechargeAmount,
          previousBalance: prevBal,
          newBalance: newBal,
          reference: txnRef,
          description: `Prepaid wallet top-up via ${paymentMethod} (Base: ₹${baseAmount.toFixed(
            2
          )} + 18% GST: ₹${gstAmount.toFixed(2)})`,
        },
      });

      // Create Tax Invoice
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber: invoiceNum,
          customerId: targetCustomerId,
          businessName: cust.businessName,
          ownerName: cust.ownerName,
          gstin: cust.gstin || "07AAAAA0000A1Z5",
          billingAddress: `${cust.city}, ${cust.state} - India`,
          amount: baseAmount,
          gst: gstAmount,
          totalAmount: rechargeAmount,
          paymentStatus: "paid",
          description: "Prepaid Bulk SMS & WhatsApp Messaging Credits Top-up (CGST 9% + SGST 9%)",
          transactionReference: txnRef,
        },
      });

      return { transaction, invoice, newBalance: newBal };
    });

    return NextResponse.json({
      success: true,
      message: `Wallet recharged with ₹${rechargeAmount.toFixed(2)} via ${paymentMethod}`,
      newBalance: result.newBalance,
      transaction: {
        id: result.transaction.id,
        customerId: result.transaction.customerId,
        type: "recharge",
        amount: Number(result.transaction.amount),
        previousBalance: Number(result.transaction.previousBalance),
        newBalance: Number(result.transaction.newBalance),
        reference: result.transaction.reference,
        date: result.transaction.createdAt.toISOString(),
      },
      invoice: {
        id: result.invoice.id,
        invoiceNumber: result.invoice.invoiceNumber,
        customerId: result.invoice.customerId,
        businessName: result.invoice.businessName,
        ownerName: result.invoice.ownerName,
        gstin: result.invoice.gstin,
        billingAddress: result.invoice.billingAddress,
        amount: Number(result.invoice.amount),
        gst: Number(result.invoice.gst),
        totalAmount: Number(result.invoice.totalAmount),
        paymentStatus: result.invoice.paymentStatus as any,
        invoiceDate: result.invoice.createdAt.toISOString().split("T")[0],
        description: result.invoice.description,
        transactionReference: result.invoice.transactionReference,
      },
    });
  } catch (error: any) {
    console.error("POST /api/wallet/recharge error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

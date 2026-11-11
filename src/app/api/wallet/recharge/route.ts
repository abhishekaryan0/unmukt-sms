import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, amount, paymentMethod = "UPI" } = body;

    const rechargeAmount = parseFloat(amount);
    if (!rechargeAmount || rechargeAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid positive recharge amount." },
        { status: 400 }
      );
    }

    // Find customer
    const customer = await prisma.customerProfile.findFirst({
      where: customerId ? { id: customerId } : { id: "cust-01" },
    });

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
    }

    const prevBalance = Number(customer.walletBalance);
    const newBalance = prevBalance + rechargeAmount;

    // 18% GST breakdown (Base Amount + 18% GST = Total)
    const baseAmount = Number((rechargeAmount / 1.18).toFixed(2));
    const gstAmount = Number((rechargeAmount - baseAmount).toFixed(2));
    const invoiceNum = `INV/${new Date().getFullYear()}-${(new Date().getFullYear() + 1)
      .toString()
      .slice(-2)}/${Math.floor(10000 + Math.random() * 90000)}`;
    const txnRef = `TXN-${paymentMethod.toUpperCase().replace(/\s+/g, "")}-${Date.now()
      .toString()
      .slice(-8)}`;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update customer wallet
      await tx.customerProfile.update({
        where: { id: customer.id },
        data: { walletBalance: newBalance },
      });

      // 2. Create Ledger Transaction
      const transaction = await tx.walletTransaction.create({
        data: {
          customerId: customer.id,
          type: TransactionType.RECHARGE,
          amount: rechargeAmount,
          previousBalance: prevBalance,
          newBalance: newBalance,
          reference: txnRef,
          description: `Prepaid wallet top-up via ${paymentMethod} (Includes 18% GST)`,
        },
      });

      // 3. Create Tax Invoice
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber: invoiceNum,
          customerId: customer.id,
          businessName: customer.businessName,
          ownerName: customer.ownerName,
          gstin: customer.gstin || "07AAAAA0000A1Z5",
          billingAddress: `${customer.city}, ${customer.state} - India`,
          amount: baseAmount,
          gst: gstAmount,
          totalAmount: rechargeAmount,
          paymentStatus: "paid",
          description: "Prepaid Bulk SMS & WhatsApp Messaging Credits Recharge",
          transactionReference: txnRef,
        },
      });

      return { transaction, invoice };
    });

    return NextResponse.json({
      success: true,
      message: `Wallet recharged with ₹${rechargeAmount.toFixed(2)} via ${paymentMethod}`,
      newBalance,
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

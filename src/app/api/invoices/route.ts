import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");

    const where: any = {};
    if (customerId && customerId !== "all") where.customerId = customerId;

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const formatted = invoices.map((inv) => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      customerId: inv.customerId,
      businessName: inv.businessName,
      ownerName: inv.ownerName,
      gstin: inv.gstin,
      billingAddress: inv.billingAddress,
      amount: Number(inv.amount),
      gst: Number(inv.gst),
      totalAmount: Number(inv.totalAmount),
      paymentStatus: inv.paymentStatus as any,
      invoiceDate: inv.createdAt.toISOString().split("T")[0],
      description: inv.description,
      transactionReference: inv.transactionReference,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveTenantId } from "@/lib/server-auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedCustomer = searchParams.get("customerId");

    const tenant = resolveTenantId(request, requestedCustomer);
    if (!tenant.authorized) {
      return tenant.errorResponse || NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const where: any = {};
    if (tenant.session?.role === "client") {
      where.customerId = tenant.customerId;
    } else if (requestedCustomer && requestedCustomer !== "all") {
      where.customerId = requestedCustomer;
    }

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

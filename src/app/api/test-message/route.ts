import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveTenantId } from "@/lib/server-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mobile, channel = "sms", content, customerId: reqCustomerId } = body;

    const tenant = resolveTenantId(request, reqCustomerId);
    if (!tenant.authorized) {
      return tenant.errorResponse || NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const cleanMobile = mobile?.replace(/\D/g, "").slice(-10);
    if (!cleanMobile || cleanMobile.length !== 10) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    const customer = await prisma.customerProfile.findUnique({
      where: { id: tenant.customerId },
    });

    // Record in MessageLog
    const log = await prisma.messageLog.create({
      data: {
        customerId: customer?.id || tenant.customerId,
        customerName: customer?.businessName || tenant.session?.name || "Test Sender",
        channel,
        senderId: channel === "sms" ? "SHRFSH" : "+91 80009 12345",
        recipient: `+91 ${cleanMobile}`,
        route: channel === "sms" ? "EJOIN-TEST-SANDBOX" : "META-TEST-DIRECT",
        cost: 0.0, // Free test dispatch
        supplierCost: 0.0,
        status: "delivered",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Test ${channel.toUpperCase()} message dispatched to +91 ${cleanMobile}`,
      logId: log.id,
      timestamp: log.timestamp,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

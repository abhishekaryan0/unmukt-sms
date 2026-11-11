import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mobile, channel = "sms", content, customerId = "cust-01" } = body;

    const cleanMobile = mobile?.replace(/\D/g, "").slice(-10);
    if (!cleanMobile || cleanMobile.length !== 10) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    const customer = await prisma.customerProfile.findFirst({
      where: { id: customerId },
    });

    // Record in MessageLog
    const log = await prisma.messageLog.create({
      data: {
        customerId: customer?.id || "cust-01",
        customerName: customer?.businessName || "Sharma Fashion Store",
        channel,
        senderId: channel === "sms" ? "SHRFSH" : "+91 80009 12345",
        recipient: `+91 ${cleanMobile}`,
        route: channel === "sms" ? "EJOIN-TEST-SANDBOX" : "META-TEST-DIRECT",
        cost: channel === "sms" ? 0.0 : 0.0, // Free test dispatch
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

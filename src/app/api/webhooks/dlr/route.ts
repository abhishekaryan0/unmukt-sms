import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Carrier Upstream Delivery Report (DLR) Webhook Handler.
 * Supports standard telecom callbacks (Airtel / Jio / Vi / Meta WABA).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { searchParams } = new URL(request.url);

    // Extract common carrier telemetry fields
    const messageId = body.messageId || body.msgId || body.id || searchParams.get("id");
    const status = (body.status || body.deliveryStatus || searchParams.get("status") || "delivered").toLowerCase();
    const recipient = body.recipient || body.phone || body.mobile || searchParams.get("to");
    const reason = body.reason || body.errorCode || body.errorMessage || null;

    if (!messageId && !recipient) {
      return NextResponse.json(
        { success: false, error: "Missing messageId or recipient identifier in carrier payload" },
        { status: 400 }
      );
    }

    // Map carrier status to standard internal enum
    const normalizedStatus =
      status === "delivrd" || status === "delivered" || status === "sent" || status === "read"
        ? "delivered"
        : status === "undeliv" || status === "failed" || status === "rejected" || status === "expired"
        ? "failed"
        : "pending";

    // 1. Locate message log
    const log = messageId
      ? await prisma.messageLog.findUnique({ where: { id: messageId } })
      : await prisma.messageLog.findFirst({
          where: { recipient: recipient.startsWith("+91") ? recipient : `+91 ${recipient.slice(-10)}` },
          orderBy: { timestamp: "desc" },
        });

    if (log) {
      await prisma.messageLog.update({
        where: { id: log.id },
        data: { status: normalizedStatus },
      });

      // 2. If part of a campaign, update campaign metrics
      const campaign = await prisma.campaign.findFirst({
        where: { customerId: log.customerId },
        orderBy: { createdAt: "desc" },
      });

      if (campaign && campaign.status === "RUNNING") {
        if (normalizedStatus === "delivered") {
          await prisma.campaign.update({
            where: { id: campaign.id },
            data: {
              delivered: { increment: 1 },
              pending: { decrement: campaign.pending > 0 ? 1 : 0 },
            },
          });
        } else if (normalizedStatus === "failed") {
          await prisma.campaign.update({
            where: { id: campaign.id },
            data: {
              failed: { increment: 1 },
              pending: { decrement: campaign.pending > 0 ? 1 : 0 },
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      acknowledged: true,
      status: normalizedStatus,
      matchedLogId: log?.id || null,
    });
  } catch (error: any) {
    console.error("DLR Webhook error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  // Support GET callbacks used by some legacy SMPP / HTTP aggregators
  return POST(request);
}

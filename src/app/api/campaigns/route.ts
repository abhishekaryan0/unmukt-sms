import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CampaignStatus, TransactionType } from "@prisma/client";
import { campaignSchema } from "@/lib/validations";
import { resolveTenantId } from "@/lib/server-auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedCustomerId = searchParams.get("customerId");
    const channel = searchParams.get("channel");

    // Enforce multi-tenant authorization
    const { customerId, session } = resolveTenantId(request, requestedCustomerId);

    const where: any = {};
    if (session?.role === "super_admin") {
      if (requestedCustomerId && requestedCustomerId !== "all") {
        where.customerId = requestedCustomerId;
      }
    } else {
      where.customerId = customerId;
    }

    if (channel && channel !== "all") where.channel = channel;

    const campaigns = await prisma.campaign.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const formatted = campaigns.map((c) => ({
      id: c.id,
      customerId: c.customerId,
      customerName: c.customerName,
      campaignName: c.campaignName,
      channel: c.channel as "sms" | "whatsapp",
      messageType: c.messageType as any,
      senderId: c.senderId || undefined,
      templateId: c.templateId || undefined,
      templateName: c.templateName || undefined,
      messageContent: c.messageContent,
      mediaUrl: c.mediaUrl || undefined,
      totalRecipients: c.totalRecipients,
      delivered: c.delivered,
      failed: c.failed,
      pending: c.pending,
      cost: Number(c.cost),
      status: c.status.toLowerCase() as any,
      createdDate: c.createdAt.toISOString(),
      scheduledDate: c.scheduledDate ? c.scheduledDate.toISOString() : undefined,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("GET /api/campaigns error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const parsed = campaignSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid campaign payload" },
        { status: 400 }
      );
    }

    const {
      customerId: requestedId,
      campaignName,
      channel,
      messageType,
      totalRecipients,
      cost,
      status = "completed",
      scheduledDate,
      messageContent,
      senderId,
      templateId,
      templateName,
      mediaUrl,
    } = parsed.data;

    // Multi-tenant check
    const { customerId: targetCustomerId } = resolveTenantId(request, requestedId);

    const costNum = Number(cost.toFixed(2));
    const recipientsNum = totalRecipients;

    // 1. Resolve Dynamic Carrier Supplier & Routing
    const routingRule = await prisma.routingRule.findFirst({
      where: {
        channel,
        status: "active",
      },
      orderBy: { priority: "asc" },
    });

    const selectedGateway =
      routingRule?.primarySupplier || (channel === "sms" ? "EJOIN EIMS" : "Meta WhatsApp BSP");

    const supplier = await prisma.supplier.findFirst({
      where: { name: selectedGateway },
    });

    const unitSupplierCost = supplier ? Number(supplier.costPerMessage) : channel === "sms" ? 0.09 : 0.65;
    const totalSupplierExpense = Number((unitSupplierCost * recipientsNum).toFixed(4));

    // 2. Atomic Transaction: Decrement Wallet with balance guarantee, create Ledger, create Campaign & CDR Logs
    const result = await prisma.$transaction(async (tx) => {
      // Find customer inside transaction to read current balance for ledger
      const cust = await tx.customerProfile.findUnique({
        where: { id: targetCustomerId },
      });

      if (!cust) {
        throw new Error("Customer profile not found");
      }

      const prevBal = Number(cust.walletBalance);
      if (prevBal < costNum) {
        throw new Error(
          `Insufficient balance. Available: ₹${prevBal.toFixed(2)}, Required: ₹${costNum.toFixed(2)}.`
        );
      }

      // Race-condition immune atomic decrement
      const updated = await tx.customerProfile.updateMany({
        where: {
          id: targetCustomerId,
          walletBalance: { gte: costNum },
        },
        data: {
          walletBalance: { decrement: costNum },
          totalMessages: { increment: recipientsNum },
        },
      });

      if (updated.count === 0) {
        throw new Error("Insufficient wallet balance or concurrent transaction conflict. Please retry.");
      }

      const newBal = Number((prevBal - costNum).toFixed(2));

      // Create Ledger Entry
      const isSms = channel === "sms";
      const txnRef = `CMP-${isSms ? "SMS" : "WA"}-${Date.now().toString().slice(-6)}`;

      await tx.walletTransaction.create({
        data: {
          customerId: targetCustomerId,
          type: isSms ? TransactionType.SMS_DEDUCTION : TransactionType.WHATSAPP_DEDUCTION,
          amount: costNum,
          previousBalance: prevBal,
          newBalance: newBal,
          reference: txnRef,
          description: `Broadcast charge for ${recipientsNum} ${channel.toUpperCase()} messages ("${campaignName}") via ${selectedGateway}`,
          channel,
        },
      });

      // Create Campaign Record
      const deliveredCount = status === "scheduled" ? 0 : Math.round(recipientsNum * 0.994);
      const failedCount = status === "scheduled" ? 0 : recipientsNum - deliveredCount;

      const campaign = await tx.campaign.create({
        data: {
          customerId: targetCustomerId,
          customerName: cust.businessName,
          campaignName,
          channel,
          messageType,
          senderId: senderId || (channel === "sms" ? "SHRFSH" : null),
          templateId,
          templateName,
          messageContent: messageContent || "",
          mediaUrl: mediaUrl || null,
          totalRecipients: recipientsNum,
          delivered: deliveredCount,
          failed: failedCount,
          pending: status === "scheduled" ? recipientsNum : 0,
          cost: costNum,
          status: status === "scheduled" ? CampaignStatus.SCHEDULED : CampaignStatus.COMPLETED,
          scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        },
      });

      // Create CDR Message Log Entry
      if (status !== "scheduled") {
        await tx.messageLog.create({
          data: {
            customerId: targetCustomerId,
            customerName: cust.businessName,
            channel,
            senderId: senderId || (channel === "sms" ? "SHRFSH" : "+91 80009 12345"),
            recipient: `Batch: ${recipientsNum} recipients`,
            route: `${selectedGateway} (Priority Rule #${routingRule?.priority || 1})`,
            cost: costNum,
            supplierCost: totalSupplierExpense,
            status: "delivered",
          },
        });

        // Update supplier stats
        if (supplier) {
          await tx.supplier.update({
            where: { id: supplier.id },
            data: {
              totalMessages: { increment: recipientsNum },
            },
          });
        }
      }

      return { campaign, newBalance: newBal };
    });

    return NextResponse.json({
      success: true,
      message: `Campaign "${campaignName}" dispatched successfully via ${selectedGateway}`,
      data: {
        id: result.campaign.id,
        customerId: result.campaign.customerId,
        customerName: result.campaign.customerName,
        campaignName: result.campaign.campaignName,
        channel: result.campaign.channel as any,
        messageType: result.campaign.messageType as any,
        senderId: result.campaign.senderId || undefined,
        templateName: result.campaign.templateName || undefined,
        messageContent: result.campaign.messageContent,
        totalRecipients: result.campaign.totalRecipients,
        delivered: result.campaign.delivered,
        failed: result.campaign.failed,
        cost: Number(result.campaign.cost),
        status: result.campaign.status.toLowerCase() as any,
        createdDate: result.campaign.createdAt.toISOString(),
      },
      newBalance: result.newBalance,
    });
  } catch (error: any) {
    console.error("POST /api/campaigns error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

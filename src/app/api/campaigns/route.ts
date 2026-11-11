import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CampaignStatus, TransactionType } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const channel = searchParams.get("channel");

    const where: any = {};
    if (customerId && customerId !== "all") where.customerId = customerId;
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
    const body = await request.json();
    const {
      customerId,
      customerName,
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
    } = body;

    if (!campaignName || !channel || !totalRecipients || cost === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required campaign parameters" },
        { status: 400 }
      );
    }

    const costNum = parseFloat(cost) || 0;
    const recipientsNum = parseInt(totalRecipients, 10) || 1;

    // Find customer to check wallet balance
    const targetCustomer = await prisma.customerProfile.findFirst({
      where: customerId ? { id: customerId } : { id: "cust-01" },
    });

    if (!targetCustomer) {
      return NextResponse.json({ success: false, error: "Customer profile not found" }, { status: 404 });
    }

    const availableBal = Number(targetCustomer.walletBalance);
    if (availableBal < costNum) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient wallet balance. Available: ₹${availableBal.toFixed(
            2
          )}, Required: ₹${costNum.toFixed(2)}. Please recharge your wallet.`,
        },
        { status: 400 }
      );
    }

    // Atomic execution via Prisma Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Deduct wallet balance
      const newBal = availableBal - costNum;
      await tx.customerProfile.update({
        where: { id: targetCustomer.id },
        data: {
          walletBalance: newBal,
          totalMessages: { increment: recipientsNum },
        },
      });

      // 2. Record ledger transaction
      const isSms = channel === "sms";
      await tx.walletTransaction.create({
        data: {
          customerId: targetCustomer.id,
          type: isSms ? TransactionType.SMS_DEDUCTION : TransactionType.WHATSAPP_DEDUCTION,
          amount: costNum,
          previousBalance: availableBal,
          newBalance: newBal,
          reference: `CMP-${isSms ? "SMS" : "WA"}-${Date.now().toString().slice(-6)}`,
          description: `Broadcast charge for ${recipientsNum} ${channel.toUpperCase()} messages ("${campaignName}")`,
          channel,
        },
      });

      // 3. Create Campaign
      const deliveredCount = status === "scheduled" ? 0 : Math.round(recipientsNum * 0.994);
      const failedCount = status === "scheduled" ? 0 : recipientsNum - deliveredCount;

      const campaign = await tx.campaign.create({
        data: {
          customerId: targetCustomer.id,
          customerName: customerName || targetCustomer.businessName,
          campaignName,
          channel,
          messageType,
          senderId: senderId || (channel === "sms" ? "SHRFSH" : null),
          templateId,
          templateName,
          messageContent: messageContent || "",
          mediaUrl,
          totalRecipients: recipientsNum,
          delivered: deliveredCount,
          failed: failedCount,
          pending: status === "scheduled" ? recipientsNum : 0,
          cost: costNum,
          status: status === "scheduled" ? CampaignStatus.SCHEDULED : CampaignStatus.COMPLETED,
          scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        },
      });

      return { campaign, newBalance: newBal };
    });

    return NextResponse.json({
      success: true,
      message: `Campaign "${campaignName}" dispatched successfully`,
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

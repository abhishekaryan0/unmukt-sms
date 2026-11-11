import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const profile = await prisma.whatsAppProfile.findFirst();
    if (!profile) {
      return NextResponse.json({
        success: true,
        data: {
          displayName: "Sharma Fashion Store",
          phoneNumber: "+91 80009 12345",
          qualityRating: "High",
          messagingTier: "Tier 2 (10,000 conversations / 24h)",
          tierLimit: "Tier 2 (10,000 conversations / 24h)",
          wabaId: "waba_781290348123",
          verifiedBadge: true,
          webhookStatus: "active",
          about: "Official WhatsApp Business API Channel",
          category: "Retail",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: profile.id,
        displayName: profile.displayName,
        phoneNumber: profile.phoneNumber,
        qualityRating: profile.qualityRating,
        messagingTier: profile.messagingTier,
        tierLimit: profile.messagingTier,
        wabaId: profile.wabaId,
        verifiedBadge: profile.verifiedBadge,
        webhookStatus: profile.webhookStatus,
        about: profile.about || "",
        category: profile.category || "",
      },
    });
  } catch (error: any) {
    console.error("GET /api/whatsapp/profile error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { displayName, about, category, customerId = "cust-01" } = body;

    const existing = await prisma.whatsAppProfile.findFirst();
    let updated;

    if (existing) {
      updated = await prisma.whatsAppProfile.update({
        where: { id: existing.id },
        data: {
          ...(displayName && { displayName }),
          ...(about !== undefined && { about }),
          ...(category && { category }),
        },
      });
    } else {
      updated = await prisma.whatsAppProfile.create({
        data: {
          customerId,
          displayName: displayName || "Sharma Fashion Store",
          phoneNumber: "+91 80009 12345",
          wabaId: "waba_781290348123",
          about: about || "",
          category: category || "Retail",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Meta WhatsApp Business profile updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("PATCH /api/whatsapp/profile error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

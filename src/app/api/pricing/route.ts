import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const configs = await prisma.pricingConfig.findMany();
    const formatted = configs.map((c) => ({
      channel: c.channel as "sms" | "whatsapp",
      type: c.type,
      supplierCost: Number(c.supplierCost),
      sellingPrice: Number(c.sellingPrice),
      grossMargin: Number(c.grossMargin),
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("GET /api/pricing error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { type, sellingPrice } = body;

    if (!type || sellingPrice === undefined) {
      return NextResponse.json({ success: false, error: "Type and selling price are required" }, { status: 400 });
    }

    const priceNum = parseFloat(sellingPrice);

    // Find existing config
    const existing = await prisma.pricingConfig.findFirst({
      where: { type },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Pricing tier not found" }, { status: 404 });
    }

    const supplierCost = Number(existing.supplierCost);
    const newMargin = Number((priceNum - supplierCost).toFixed(4));

    const updated = await prisma.pricingConfig.update({
      where: { id: existing.id },
      data: {
        sellingPrice: priceNum,
        grossMargin: newMargin,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Pricing for ${type} updated to ₹${priceNum.toFixed(2)} / unit`,
      data: {
        channel: updated.channel,
        type: updated.type,
        supplierCost: Number(updated.supplierCost),
        sellingPrice: Number(updated.sellingPrice),
        grossMargin: Number(updated.grossMargin),
      },
    });
  } catch (error: any) {
    console.error("PATCH /api/pricing error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

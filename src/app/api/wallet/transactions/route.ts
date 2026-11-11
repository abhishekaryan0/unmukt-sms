import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");

    const where: any = {};
    if (customerId && customerId !== "all") where.customerId = customerId;

    const txs = await prisma.walletTransaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: { businessName: true },
        },
      },
    });

    const formatted = txs.map((t) => ({
      id: t.id,
      customerId: t.customerId,
      customerName: t.customer?.businessName,
      type: t.type.toLowerCase() as any,
      amount: Number(t.amount),
      previousBalance: Number(t.previousBalance),
      newBalance: Number(t.newBalance),
      reference: t.reference,
      date: t.createdAt.toISOString(),
      description: t.description || undefined,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

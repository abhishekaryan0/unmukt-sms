import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { createdAt: "desc" },
    });

    const formatted = suppliers.map((s) => ({
      id: s.id,
      name: s.name,
      channel: s.channel as "sms" | "whatsapp",
      status: s.status as "connected" | "degraded" | "offline",
      costPerMessage: Number(s.costPerMessage),
      totalMessages: s.totalMessages,
      successRate: Number(s.successRate),
      failedCount: s.failedCount,
      apiEndpoint: s.apiEndpoint,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("GET /api/suppliers error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const adminAuth = requireAdmin(request);
    if (!adminAuth.authorized) {
      return adminAuth.errorResponse || NextResponse.json({ success: false, error: "Super Admin authorization required" }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, status, costPerMessage, apiEndpoint } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Supplier ID required" }, { status: 400 });
    }

    const updated = await prisma.supplier.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(status && { status }),
        ...(costPerMessage !== undefined && { costPerMessage: parseFloat(costPerMessage) }),
        ...(apiEndpoint && { apiEndpoint: apiEndpoint.trim() }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Carrier gateway '${updated.name}' configuration saved`,
      data: {
        id: updated.id,
        name: updated.name,
        channel: updated.channel,
        status: updated.status,
        costPerMessage: Number(updated.costPerMessage),
        totalMessages: updated.totalMessages,
        successRate: Number(updated.successRate),
        failedCount: updated.failedCount,
        apiEndpoint: updated.apiEndpoint,
      },
    });
  } catch (error: any) {
    console.error("PATCH /api/suppliers error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

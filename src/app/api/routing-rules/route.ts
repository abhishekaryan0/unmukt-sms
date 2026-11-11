import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";
import { routingRuleSchema } from "@/lib/validations";

export async function GET() {
  try {
    const rules = await prisma.routingRule.findMany({
      orderBy: { priority: "asc" },
    });

    const formatted = rules.map((r) => ({
      id: r.id,
      name: r.name,
      channel: r.channel as "sms" | "whatsapp",
      messageType: r.messageType as any,
      primarySupplier: r.primarySupplier,
      fallbackSupplier: r.fallbackSupplier,
      priority: r.priority,
      ratePerMsg: Number(r.ratePerMsg),
      status: r.status as "active" | "inactive",
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("GET /api/routing-rules error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const adminAuth = requireAdmin(request);
    if (!adminAuth.authorized) {
      return adminAuth.errorResponse || NextResponse.json({ success: false, error: "Super Admin authorization required" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = routingRuleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message || "Invalid routing rule data" }, { status: 400 });
    }

    const { name, channel, messageType, primarySupplier, fallbackSupplier, priority, ratePerMsg, status = "active" } = parsed.data;

    const created = await prisma.routingRule.create({
      data: {
        name,
        channel,
        messageType: messageType || "promotional",
        primarySupplier,
        fallbackSupplier: fallbackSupplier || primarySupplier,
        priority: priority ?? 1,
        ratePerMsg: ratePerMsg ?? 0.12,
        status: status || "active",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Carrier routing rule '${created.name}' created`,
      data: {
        ...created,
        ratePerMsg: Number(created.ratePerMsg),
      },
    });
  } catch (error: any) {
    console.error("POST /api/routing-rules error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const adminAuth = requireAdmin(request);
    if (!adminAuth.authorized) {
      return adminAuth.errorResponse || NextResponse.json({ success: false, error: "Super Admin authorization required" }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, channel, messageType, primarySupplier, fallbackSupplier, priority, ratePerMsg, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Rule ID required" }, { status: 400 });
    }

    const updated = await prisma.routingRule.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(channel && { channel }),
        ...(messageType && { messageType }),
        ...(primarySupplier && { primarySupplier }),
        ...(fallbackSupplier && { fallbackSupplier }),
        ...(priority !== undefined && { priority: parseInt(priority, 10) }),
        ...(ratePerMsg !== undefined && { ratePerMsg: parseFloat(ratePerMsg) }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Carrier routing rule '${updated.name}' updated`,
      data: {
        ...updated,
        ratePerMsg: Number(updated.ratePerMsg),
      },
    });
  } catch (error: any) {
    console.error("PUT /api/routing-rules error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const adminAuth = requireAdmin(request);
    if (!adminAuth.authorized) {
      return adminAuth.errorResponse || NextResponse.json({ success: false, error: "Super Admin authorization required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Rule ID required" }, { status: 400 });
    }

    await prisma.routingRule.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Carrier routing rule deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/routing-rules error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

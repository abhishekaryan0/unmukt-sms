import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const channel = searchParams.get("channel");
    const status = searchParams.get("status");

    const where: any = {};
    if (channel && channel !== "all") where.channel = channel;
    if (status && status !== "all") where.approvalStatus = status;

    const templates = await prisma.template.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const formatted = templates.map((t) => ({
      id: t.id,
      name: t.name,
      channel: t.channel as "sms" | "whatsapp",
      category: t.category as any,
      language: t.language,
      content: t.content,
      dltTemplateId: t.dltTemplateId || undefined,
      metaTemplateId: t.metaTemplateId || undefined,
      senderHeader: t.senderHeader || undefined,
      approvalStatus: t.approvalStatus as "approved" | "pending" | "rejected",
      createdDate: t.createdAt.toISOString().split("T")[0],
      variables: t.variables,
      buttons: (t.buttons as any) || undefined,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("GET /api/templates error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      channel,
      category,
      language = "English",
      content,
      dltTemplateId,
      metaTemplateId,
      senderHeader,
      variables = [],
      buttons,
    } = body;

    if (!name || !channel || !category || !content) {
      return NextResponse.json(
        { success: false, error: "Name, channel, category, and content are required" },
        { status: 400 }
      );
    }

    const template = await prisma.template.create({
      data: {
        name: name.trim(),
        channel: channel.toLowerCase(),
        category: category.toLowerCase(),
        language,
        content: content.trim(),
        dltTemplateId: dltTemplateId || (channel === "sms" ? `1407${Math.floor(100000000000 + Math.random() * 900000000000)}` : null),
        metaTemplateId: metaTemplateId || (channel === "whatsapp" ? `waba_${Date.now().toString().slice(-8)}` : null),
        senderHeader: senderHeader || (channel === "sms" ? "SHRFSH" : null),
        approvalStatus: "pending",
        variables: Array.isArray(variables) ? variables : [],
        buttons: buttons || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Template '${template.name}' submitted for TRAI / Meta compliance review`,
      data: {
        id: template.id,
        name: template.name,
        channel: template.channel,
        category: template.category,
        language: template.language,
        content: template.content,
        dltTemplateId: template.dltTemplateId || undefined,
        metaTemplateId: template.metaTemplateId || undefined,
        senderHeader: template.senderHeader || undefined,
        approvalStatus: template.approvalStatus,
        createdDate: template.createdAt.toISOString().split("T")[0],
        variables: template.variables,
        buttons: (template.buttons as any) || undefined,
      },
    });
  } catch (error: any) {
    console.error("POST /api/templates error:", error);
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
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Template ID and status are required" }, { status: 400 });
    }

    const updated = await prisma.template.update({
      where: { id },
      data: { approvalStatus: status.toLowerCase() },
    });

    return NextResponse.json({
      success: true,
      message: `Template '${updated.name}' status updated to ${status.toUpperCase()}`,
      data: updated,
    });
  } catch (error: any) {
    console.error("PATCH /api/templates error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

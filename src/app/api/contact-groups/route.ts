import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveTenantId } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedCustomer = searchParams.get("customerId");

    const tenant = resolveTenantId(request, requestedCustomer);
    if (!tenant.authorized) {
      return tenant.errorResponse || NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const where: any = {};
    if (tenant.session?.role === "client") {
      where.customerId = tenant.customerId;
    } else if (requestedCustomer && requestedCustomer !== "all") {
      where.customerId = requestedCustomer;
    }

    const groups = await prisma.contactGroup.findMany({
      where,
      include: {
        _count: {
          select: { contacts: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = groups.map((g) => ({
      id: g.id,
      name: g.name,
      contactCount: g._count.contacts,
      description: g.description || "",
      createdDate: g.createdAt.toISOString().split("T")[0],
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("GET /api/contact-groups error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, customerId: reqCustomerId } = body;

    const tenant = resolveTenantId(request, reqCustomerId);
    if (!tenant.authorized) {
      return tenant.errorResponse || NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Group name is required" }, { status: 400 });
    }

    const group = await prisma.contactGroup.create({
      data: {
        customerId: tenant.customerId,
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Audience group '${group.name}' created successfully`,
      data: {
        id: group.id,
        name: group.name,
        contactCount: 0,
        description: group.description || "",
        createdDate: group.createdAt.toISOString().split("T")[0],
      },
    });
  } catch (error: any) {
    console.error("POST /api/contact-groups error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Group ID is required" }, { status: 400 });
    }

    const existingGroup = await prisma.contactGroup.findUnique({
      where: { id },
    });

    if (!existingGroup) {
      return NextResponse.json({ success: false, error: "Contact group not found" }, { status: 404 });
    }

    const tenant = resolveTenantId(request, existingGroup.customerId);
    if (!tenant.authorized) {
      return tenant.errorResponse || NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (tenant.session?.role === "client" && existingGroup.customerId !== tenant.customerId) {
      return NextResponse.json({ success: false, error: "Unauthorized access to this group" }, { status: 403 });
    }

    await prisma.contactGroup.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Contact group deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/contact-groups error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

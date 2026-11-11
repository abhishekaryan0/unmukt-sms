import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const groups = await prisma.contactGroup.findMany({
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
    const { name, description, customerId = "cust-01" } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Group name is required" }, { status: 400 });
    }

    const group = await prisma.contactGroup.create({
      data: {
        customerId,
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

    // Unassign or delete group
    await prisma.contactGroup.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Contact group deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/contact-groups error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

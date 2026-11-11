import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HeaderStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");

    const where: any = {};
    if (customerId && customerId !== "all") where.customerId = customerId;

    const headers = await prisma.senderHeader.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const formatted = headers.map((h) => ({
      id: h.id,
      customerId: h.customerId,
      customerName: h.customerName,
      header: h.header,
      category: h.category as "promotional" | "transactional",
      dltEntityId: h.dltEntityId,
      dltOperator: h.dltOperator,
      operator: h.dltOperator,
      description: h.description || undefined,
      status: h.status.toLowerCase() as "approved" | "pending" | "rejected",
      createdDate: h.createdAt.toISOString().split("T")[0],
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, header, category, dltEntityId, dltOperator, description } = body;

    const cleanHeader = header?.trim().toUpperCase();
    if (!cleanHeader || cleanHeader.length !== 6 || !/^[A-Z0-9]{6}$/.test(cleanHeader)) {
      return NextResponse.json(
        { success: false, error: "TRAI DLT headers must be exactly 6 uppercase alphanumeric characters." },
        { status: 400 }
      );
    }

    const customer = await prisma.customerProfile.findFirst({
      where: customerId ? { id: customerId } : { id: "cust-01" },
    });

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer profile not found" }, { status: 404 });
    }

    // Check duplicate
    const existing = await prisma.senderHeader.findFirst({
      where: { customerId: customer.id, header: cleanHeader },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `Header "${cleanHeader}" already exists for this business account.` },
        { status: 409 }
      );
    }

    const created = await prisma.senderHeader.create({
      data: {
        customerId: customer.id,
        customerName: customer.businessName,
        header: cleanHeader,
        category: category || "promotional",
        dltEntityId: dltEntityId || customer.dltEntityId,
        dltOperator: dltOperator || "Reliance Jio DLT",
        description: description || "Brand identity header",
        status: HeaderStatus.PENDING,
      },
    });

    return NextResponse.json({
      success: true,
      message: `DLT Header "${cleanHeader}" submitted for approval`,
      data: {
        id: created.id,
        customerId: created.customerId,
        customerName: created.customerName,
        header: created.header,
        category: created.category as any,
        dltEntityId: created.dltEntityId,
        dltOperator: created.dltOperator,
        operator: created.dltOperator,
        status: "pending",
        createdDate: created.createdAt.toISOString().split("T")[0],
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Header ID and status are required" }, { status: 400 });
    }

    const newStatus =
      status === "approved"
        ? HeaderStatus.APPROVED
        : status === "rejected"
        ? HeaderStatus.REJECTED
        : HeaderStatus.PENDING;

    const updated = await prisma.senderHeader.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json({
      success: true,
      message: `Header "${updated.header}" marked as ${status}`,
      data: {
        id: updated.id,
        customerId: updated.customerId,
        customerName: updated.customerName,
        header: updated.header,
        category: updated.category as any,
        dltEntityId: updated.dltEntityId,
        dltOperator: updated.dltOperator,
        status,
        createdDate: updated.createdAt.toISOString().split("T")[0],
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

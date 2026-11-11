import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");

    const where: any = {};
    if (customerId && customerId !== "all") where.customerId = customerId;

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formatted = tickets.map((t) => ({
      id: t.id,
      customerId: t.customerId,
      customerName: t.customerName,
      subject: t.subject,
      category: t.category as any,
      priority: t.priority as any,
      status: t.status as any,
      createdDate: t.createdAt.toISOString().split("T")[0],
      updatedDate: t.updatedAt.toISOString().split("T")[0],
      messages: t.messages.map((m) => ({
        sender: m.sender as any,
        senderName: m.senderName,
        message: m.message,
        timestamp: m.createdAt.toISOString(),
      })),
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("GET /api/tickets error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, customerName, subject, category, priority = "medium", message } = body;

    if (!subject || !category || !message) {
      return NextResponse.json({ success: false, error: "Subject, category, and message are required" }, { status: 400 });
    }

    const custId = customerId || "cust-01";
    let custName = customerName;
    if (!custName) {
      const cust = await prisma.customerProfile.findUnique({ where: { id: custId } });
      custName = cust ? cust.businessName : "Valued Customer";
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        customerId: custId,
        customerName: custName,
        subject,
        category,
        priority,
        status: "open",
        messages: {
          create: {
            sender: "customer",
            senderName: custName,
            message,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Support ticket #${ticket.id.slice(-6).toUpperCase()} created`,
      data: {
        id: ticket.id,
        customerId: ticket.customerId,
        customerName: ticket.customerName,
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        createdDate: ticket.createdAt.toISOString().split("T")[0],
        updatedDate: ticket.updatedAt.toISOString().split("T")[0],
        messages: ticket.messages.map((m) => ({
          sender: m.sender,
          senderName: m.senderName,
          message: m.message,
          timestamp: m.createdAt.toISOString(),
        })),
      },
    });
  } catch (error: any) {
    console.error("POST /api/tickets error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { ticketId, message, sender = "customer", senderName = "User", status } = body;

    if (!ticketId) {
      return NextResponse.json({ success: false, error: "Ticket ID required" }, { status: 400 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (message) {
        await tx.ticketMessage.create({
          data: {
            ticketId,
            sender,
            senderName,
            message,
          },
        });
      }

      const tkt = await tx.supportTicket.update({
        where: { id: ticketId },
        data: {
          ...(status && { status }),
          updatedAt: new Date(),
        },
        include: {
          messages: { orderBy: { createdAt: "asc" } },
        },
      });

      return tkt;
    });

    return NextResponse.json({
      success: true,
      message: message ? "Message sent" : `Ticket status updated to ${status}`,
      data: {
        id: updated.id,
        customerId: updated.customerId,
        customerName: updated.customerName,
        subject: updated.subject,
        category: updated.category,
        priority: updated.priority,
        status: updated.status,
        createdDate: updated.createdAt.toISOString().split("T")[0],
        updatedDate: updated.updatedAt.toISOString().split("T")[0],
        messages: updated.messages.map((m) => ({
          sender: m.sender,
          senderName: m.senderName,
          message: m.message,
          timestamp: m.createdAt.toISOString(),
        })),
      },
    });
  } catch (error: any) {
    console.error("PATCH /api/tickets error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

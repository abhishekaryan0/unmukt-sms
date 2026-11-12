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
    const { customerId: reqCustomerId, customerName: reqCustomerName, subject, category, priority = "medium", message } = body;

    const tenant = resolveTenantId(request, reqCustomerId);
    if (!tenant.authorized) {
      return tenant.errorResponse || NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!subject || !category || !message) {
      return NextResponse.json({ success: false, error: "Subject, category, and message are required" }, { status: 400 });
    }

    const custId = tenant.customerId;
    let custName = reqCustomerName;
    if (!custName || tenant.session?.role === "client") {
      const cust = await prisma.customerProfile.findUnique({ where: { id: custId } });
      custName = cust ? cust.businessName : tenant.session?.name || "Valued Customer";
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        customerId: custId,
        customerName: custName,
        subject: subject.trim(),
        category,
        priority,
        status: "open",
        messages: {
          create: {
            sender: "customer",
            senderName: custName,
            message: message.trim(),
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

    const existingTicket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!existingTicket) {
      return NextResponse.json({ success: false, error: "Ticket not found" }, { status: 404 });
    }

    const tenant = resolveTenantId(request, existingTicket.customerId);
    if (!tenant.authorized) {
      return tenant.errorResponse || NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Verify tenant ownership if client
    if (tenant.session?.role === "client" && existingTicket.customerId !== tenant.customerId) {
      return NextResponse.json({ success: false, error: "Unauthorized access to this ticket" }, { status: 403 });
    }

    const actualSender = tenant.session?.role === "super_admin" ? (sender === "support" ? "support" : "customer") : "customer";
    const actualSenderName = tenant.session?.name || senderName || "User";

    const updated = await prisma.$transaction(async (tx) => {
      if (message) {
        await tx.ticketMessage.create({
          data: {
            ticketId,
            sender: actualSender,
            senderName: actualSenderName,
            message: message.trim(),
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

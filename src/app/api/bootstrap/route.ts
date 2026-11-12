import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveTenantId } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedCustomer = searchParams.get("customerId");

    const tenant = resolveTenantId(request, requestedCustomer);

    // If client session is active, strictly scope client-private collections
    const isClient = tenant.session?.role === "client";
    const clientFilter = isClient
      ? { customerId: tenant.customerId }
      : requestedCustomer && requestedCustomer !== "all"
      ? { customerId: requestedCustomer }
      : {};

    const [
      customers,
      agencies,
      campaigns,
      suppliers,
      routingRules,
      pricing,
      transactions,
      templates,
      contactGroups,
      contacts,
      supportTickets,
      invoices,
      messageLogs,
      senderHeaders,
      whatsappProfiles,
    ] = await Promise.all([
      // Customers: If client, fetch their own profile; if admin, fetch all
      prisma.customerProfile.findMany({
        where: isClient ? { id: tenant.customerId } : requestedCustomer && requestedCustomer !== "all" ? { id: requestedCustomer } : {},
        orderBy: { createdAt: "desc" },
      }),
      // Agencies: Admin only or public overview
      prisma.agencyProfile.findMany({ orderBy: { createdAt: "desc" } }),
      // Campaigns: Filtered by tenant
      prisma.campaign.findMany({
        where: clientFilter,
        orderBy: { createdAt: "desc" },
      }),
      prisma.supplier.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.routingRule.findMany({ orderBy: { priority: "asc" } }),
      prisma.pricingConfig.findMany({}),
      // Transactions: Filtered by tenant
      prisma.walletTransaction.findMany({
        where: clientFilter,
        orderBy: { createdAt: "desc" },
      }),
      prisma.template.findMany({ orderBy: { createdAt: "desc" } }),
      // Contact Groups: Filtered by tenant
      prisma.contactGroup.findMany({
        where: clientFilter,
        include: { _count: { select: { contacts: true } } },
        orderBy: { createdAt: "desc" },
      }),
      // Contacts: Filtered by tenant
      prisma.contact.findMany({
        where: clientFilter,
        orderBy: { createdAt: "desc" },
      }),
      // Tickets: Filtered by tenant
      prisma.supportTicket.findMany({
        where: clientFilter,
        include: { messages: { orderBy: { createdAt: "asc" } } },
        orderBy: { updatedAt: "desc" },
      }),
      // Invoices: Filtered by tenant
      prisma.invoice.findMany({
        where: clientFilter,
        orderBy: { createdAt: "desc" },
      }),
      // Message Logs: Filtered by tenant
      prisma.messageLog.findMany({
        where: clientFilter,
        orderBy: { timestamp: "desc" },
        take: isClient ? 100 : 500,
      }),
      // Sender Headers: Filtered by tenant
      prisma.senderHeader.findMany({
        where: clientFilter,
        orderBy: { createdAt: "desc" },
      }),
      // WhatsApp Profiles
      prisma.whatsAppProfile.findMany({
        where: clientFilter,
      }),
    ]);

    const formattedCustomers = customers.map((c) => ({
      id: c.id,
      businessName: c.businessName,
      ownerName: c.ownerName,
      email: c.email,
      mobile: c.mobile,
      businessCategory: c.businessCategory,
      city: c.city,
      state: c.state,
      gstin: c.gstin || undefined,
      dltEntityId: c.dltEntityId,
      walletBalance: Number(c.walletBalance),
      totalMessages: c.totalMessages,
      accountStatus: c.accountStatus.toLowerCase() as any,
      registrationDate: c.createdAt.toISOString().split("T")[0],
    }));

    const formattedAgencies = agencies.map((a) => {
      const discount = Number(a.pricingDiscount || 10);
      return {
        id: a.id,
        agencyName: a.agencyName,
        ownerName: a.ownerName,
        email: a.email,
        phone: a.phone,
        mobile: a.phone,
        city: a.city,
        state: a.state,
        walletBalance: Number(a.walletBalance),
        clientCount: a.clientCount,
        clientsManaged: a.clientCount,
        pricingDiscount: discount,
        accountStatus: a.accountStatus.toLowerCase() as any,
        joinedDate: a.createdAt.toISOString().split("T")[0],
        customPricing: {
          smsPromo: Number((0.22 * (1 - discount / 100)).toFixed(2)) || 0.18,
          smsTrans: Number((0.25 * (1 - discount / 100)).toFixed(2)) || 0.20,
          whatsappMarketing: Number((1.10 * (1 - discount / 100)).toFixed(2)) || 0.95,
        },
        managedClientIds: customers.slice(0, Math.min(3, a.clientCount || 2)).map((c) => c.id),
      };
    });

    const formattedCampaigns = campaigns.map((c) => ({
      id: c.id,
      customerId: c.customerId,
      customerName: c.customerName,
      campaignName: c.campaignName,
      channel: c.channel as any,
      messageType: c.messageType as any,
      senderId: c.senderId || undefined,
      templateId: c.templateId || undefined,
      templateName: c.templateName || undefined,
      messageContent: c.messageContent,
      mediaUrl: c.mediaUrl || undefined,
      totalRecipients: c.totalRecipients,
      delivered: c.delivered,
      failed: c.failed,
      pending: c.pending,
      cost: Number(c.cost),
      status: c.status.toLowerCase() as any,
      createdDate: c.createdAt.toISOString().split("T")[0],
      scheduledDate: c.scheduledDate ? c.scheduledDate.toISOString().split("T")[0] : undefined,
    }));

    const formattedSuppliers = suppliers.map((s) => ({
      id: s.id,
      name: s.name,
      channel: s.channel as any,
      status: s.status as any,
      costPerMessage: Number(s.costPerMessage),
      totalMessages: s.totalMessages,
      successRate: Number(s.successRate),
      failedCount: s.failedCount,
      apiEndpoint: s.apiEndpoint,
    }));

    const formattedRules = routingRules.map((r) => ({
      id: r.id,
      name: r.name,
      channel: r.channel as any,
      messageType: r.messageType as any,
      primarySupplier: r.primarySupplier,
      fallbackSupplier: r.fallbackSupplier,
      priority: r.priority,
      ratePerMsg: Number(r.ratePerMsg),
      status: r.status as any,
    }));

    const formattedPricing = pricing.map((p) => ({
      channel: p.channel as any,
      type: p.type,
      supplierCost: Number(p.supplierCost),
      sellingPrice: Number(p.sellingPrice),
      grossContribution: Number(p.grossMargin),
      marginPercent: Number(((Number(p.grossMargin) / (Number(p.sellingPrice) || 1)) * 100).toFixed(1)),
      description: `${p.type.replace(/_/g, " ")} rate`,
    }));

    const formattedTransactions = transactions.map((t) => ({
      id: t.id,
      customerId: t.customerId,
      customerName: customers.find((c) => c.id === t.customerId)?.businessName || "Customer",
      type: t.type.toLowerCase() as any,
      amount: Number(t.amount),
      previousBalance: Number(t.previousBalance),
      newBalance: Number(t.newBalance),
      reference: t.reference,
      date: t.createdAt.toISOString(),
      channel: (t.channel as any) || undefined,
      paymentMethod: (t.description?.includes("UPI") ? "UPI" : "Net Banking") as any,
    }));

    const formattedTemplates = templates.map((t) => ({
      id: t.id,
      name: t.name,
      channel: t.channel as any,
      category: t.category as any,
      language: t.language,
      content: t.content,
      dltTemplateId: t.dltTemplateId || undefined,
      metaTemplateId: t.metaTemplateId || undefined,
      senderHeader: t.senderHeader || undefined,
      approvalStatus: t.approvalStatus as any,
      createdDate: t.createdAt.toISOString().split("T")[0],
      variables: t.variables,
      buttons: (t.buttons as any) || undefined,
    }));

    const formattedGroups = contactGroups.map((g) => ({
      id: g.id,
      customerId: g.customerId,
      name: g.name,
      contactCount: g._count.contacts,
      description: g.description || "",
      createdDate: g.createdAt.toISOString().split("T")[0],
    }));

    const formattedContacts = contacts.map((c) => ({
      id: c.id,
      customerId: c.customerId,
      name: c.name,
      mobile: c.mobile,
      email: c.email || "",
      group: c.groupName,
      tags: c.tags,
      smsConsent: c.smsConsent,
      whatsappConsent: c.whatsappConsent,
      isDnd: c.isDnd,
      dateAdded: c.createdAt.toISOString().split("T")[0],
    }));

    const formattedTickets = supportTickets.map((t) => ({
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

    const formattedInvoices = invoices.map((inv) => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      customerId: inv.customerId,
      businessName: inv.businessName,
      ownerName: inv.ownerName,
      gstin: inv.gstin,
      billingAddress: inv.billingAddress,
      amount: Number(inv.amount),
      gst: Number(inv.gst),
      totalAmount: Number(inv.totalAmount),
      paymentStatus: inv.paymentStatus as any,
      invoiceDate: inv.createdAt.toISOString().split("T")[0],
      description: inv.description,
      transactionReference: inv.transactionReference,
    }));

    const formattedLogs = messageLogs.map((l) => ({
      id: l.id,
      customerId: l.customerId,
      customerName: l.customerName,
      channel: l.channel as any,
      senderId: l.senderId,
      recipient: l.recipient,
      route: l.route,
      cost: Number(l.cost),
      supplierCost: Number(l.supplierCost),
      status: l.status as any,
      timestamp: l.timestamp.toISOString(),
    }));

    const formattedHeaders = senderHeaders.map((h) => ({
      id: h.id,
      customerId: h.customerId,
      customerName: h.customerName,
      header: h.header,
      category: h.category as any,
      dltEntityId: h.dltEntityId,
      dltOperator: h.dltOperator,
      operator: h.dltOperator,
      description: h.description || undefined,
      status: h.status.toLowerCase() as any,
      createdDate: h.createdAt.toISOString().split("T")[0],
    }));

    const activeProfile = whatsappProfiles[0] || null;
    const formattedWaProfile = activeProfile
      ? {
          displayName: activeProfile.displayName,
          phoneNumber: activeProfile.phoneNumber,
          qualityRating: activeProfile.qualityRating,
          messagingTier: activeProfile.messagingTier,
          tierLimit: activeProfile.messagingTier,
          wabaId: activeProfile.wabaId,
          verifiedBadge: activeProfile.verifiedBadge,
          webhookStatus: activeProfile.webhookStatus,
          about: activeProfile.about || "",
          category: activeProfile.category || "",
        }
      : null;

    return NextResponse.json({
      success: true,
      activeCustomerId: tenant.session?.role === "client" ? tenant.customerId : undefined,
      activeCustomer: formattedCustomers.find((c) => c.id === tenant.customerId) || (isClient ? formattedCustomers[0] : undefined),
      data: {
        customers: formattedCustomers,
        agencies: formattedAgencies,
        campaigns: formattedCampaigns,
        suppliers: formattedSuppliers,
        routingRules: formattedRules,
        pricing: formattedPricing,
        transactions: formattedTransactions,
        templates: formattedTemplates,
        contactGroups: formattedGroups,
        contacts: formattedContacts,
        supportTickets: formattedTickets,
        invoices: formattedInvoices,
        messageLogs: formattedLogs,
        senderHeaders: formattedHeaders,
        whatsappProfile: formattedWaProfile,
      },
    });
  } catch (error: any) {
    console.error("Bootstrap API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

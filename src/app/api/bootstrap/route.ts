import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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
      prisma.customerProfile.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.agencyProfile.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.campaign.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.supplier.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.routingRule.findMany({ orderBy: { priority: "asc" } }),
      prisma.pricingConfig.findMany({}),
      prisma.walletTransaction.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.template.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.contactGroup.findMany({
        include: { _count: { select: { contacts: true } } },
      }),
      prisma.contact.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.supportTicket.findMany({
        include: { messages: { orderBy: { createdAt: "asc" } } },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.invoice.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.messageLog.findMany({ orderBy: { timestamp: "desc" } }),
      prisma.senderHeader.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.whatsAppProfile.findMany({}),
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
      createdDate: c.createdAt.toISOString(),
      scheduledDate: c.scheduledDate ? c.scheduledDate.toISOString() : undefined,
    }));

    const formattedSuppliers = suppliers.map((s) => ({
      id: s.id,
      name: s.name,
      channel: s.channel as any,
      status: s.status as any,
      costPerMessage: Number(s.costPerMessage),
      totalMessages: s.totalMessages,
      successRate: Number(s.successRate),
      failedMessages: s.failedCount,
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
      grossMargin: Number(p.grossMargin),
    }));

    const formattedTransactions = transactions.map((t) => ({
      id: t.id,
      customerId: t.customerId,
      type: t.type.toLowerCase() as any,
      amount: Number(t.amount),
      previousBalance: Number(t.previousBalance),
      newBalance: Number(t.newBalance),
      reference: t.reference,
      date: t.createdAt.toISOString(),
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
      name: g.name,
      contactCount: g._count.contacts,
      description: g.description || "",
      createdDate: g.createdAt.toISOString().split("T")[0],
    }));

    const formattedContacts = contacts.map((c) => ({
      id: c.id,
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

    const primaryWa = whatsappProfiles[0] || {
      displayName: "Sharma Fashion Store",
      phoneNumber: "+91 80009 12345",
      qualityRating: "High" as const,
      messagingTier: "Tier 2 (10,000 conversations / 24h)",
      verifiedBadge: true,
      webhookStatus: "active" as const,
      about: "Official WhatsApp Business API Channel",
      category: "Retail",
    };

    return NextResponse.json({
      success: true,
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
        whatsappProfile: {
          displayName: primaryWa.displayName,
          phoneNumber: primaryWa.phoneNumber,
          qualityRating: primaryWa.qualityRating as any,
          messagingTier: primaryWa.messagingTier,
          tierLimit: primaryWa.messagingTier,
          wabaId: (primaryWa as any).wabaId || "waba_781290348123",
          verifiedBadge: primaryWa.verifiedBadge,
          webhookStatus: primaryWa.webhookStatus as any,
          about: primaryWa.about || "",
          category: primaryWa.category || "",
        },
      },
    });
  } catch (error: any) {
    console.error("GET /api/bootstrap error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

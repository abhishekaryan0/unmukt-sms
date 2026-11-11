"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  Customer,
  Agency,
  Campaign,
  Supplier,
  RoutingRule,
  Transaction,
  PricingConfig,
  Template,
  Contact,
  ContactGroup,
  SupportTicket,
  Invoice,
  MessageLog,
  SenderHeader,
  WhatsAppProfile,
} from "@/types";
import {
  INITIAL_CUSTOMERS,
  INITIAL_AGENCIES,
  INITIAL_CAMPAIGNS,
  INITIAL_SUPPLIERS,
  INITIAL_ROUTING_RULES,
  INITIAL_PRICING,
  INITIAL_TRANSACTIONS,
  INITIAL_TEMPLATES,
  INITIAL_CONTACT_GROUPS,
  INITIAL_CONTACTS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_INVOICES,
  INITIAL_MESSAGE_LOGS,
  INITIAL_SENDER_HEADERS,
  INITIAL_WHATSAPP_PROFILE,
} from "./mock-data";
import { getClientSession, impersonateCustomer, stopImpersonation } from "./auth";

interface AppContextType {
  customers: Customer[];
  agencies: Agency[];
  campaigns: Campaign[];
  suppliers: Supplier[];
  routingRules: RoutingRule[];
  pricing: PricingConfig[];
  transactions: Transaction[];
  templates: Template[];
  contactGroups: ContactGroup[];
  contacts: Contact[];
  supportTickets: SupportTicket[];
  invoices: Invoice[];
  messageLogs: MessageLog[];
  senderHeaders: SenderHeader[];
  whatsappProfile: WhatsAppProfile;

  // Active client context (supports Super Admin impersonation)
  activeCustomerId: string;
  activeCustomer: Customer;
  clientWalletBalance: number;
  switchActiveCustomer: (customerId: string) => void;
  exitImpersonation: () => void;

  // Actions
  rechargeWallet: (amount: number, method: "UPI" | "Net Banking" | "Credit Card" | "Debit Card") => {
    success: boolean;
    newBalance: number;
    transaction: Transaction;
    invoice: Invoice;
  };
  createCampaign: (campaign: Omit<Campaign, "id" | "createdDate" | "delivered" | "failed" | "pending">) => {
    success: boolean;
    error?: string;
    campaign?: Campaign;
  };
  addCustomer: (customer: Omit<Customer, "id" | "totalMessages" | "registrationDate">) => Customer;
  addContact: (contact: Omit<Contact, "id" | "dateAdded">) => void;
  importContacts: (newContacts: Omit<Contact, "id" | "dateAdded">[]) => number;
  updateContact: (contact: Contact) => void;
  deleteContact: (id: string) => void;
  addGroup: (group: Omit<ContactGroup, "id" | "createdDate" | "contactCount">) => void;
  deleteGroup: (id: string) => void;
  addTemplate: (template: Omit<Template, "id" | "createdDate">) => void;
  updateTemplateStatus: (id: string, status: "approved" | "pending" | "rejected") => void;
  addSenderHeader: (header: Omit<SenderHeader, "id" | "createdDate" | "status">) => SenderHeader;
  updateSenderHeaderStatus: (id: string, status: "approved" | "pending" | "rejected") => void;
  addRoutingRule: (rule: Omit<RoutingRule, "id">) => void;
  updateRoutingRule: (rule: RoutingRule) => void;
  deleteRoutingRule: (id: string) => void;
  updatePricing: (type: string, sellingPrice: number) => void;
  updateWhatsAppProfile: (profile: Partial<WhatsAppProfile>) => void;
  createSupportTicket: (ticket: {
    subject: string;
    category: SupportTicket["category"];
    message: string;
    priority?: SupportTicket["priority"];
  }) => SupportTicket;
  replyToTicket: (ticketId: string, message: string, sender: "customer" | "support", senderName: string) => void;
  updateSupplier: (supplier: Supplier) => void;
  updateCustomerStatus: (customerId: string, status: Customer["accountStatus"]) => void;
  manualCustomerWalletAdjustment: (customerId: string, amount: number, type: "credit" | "debit", note: string) => void;
  sendTestMessage: (mobile: string, channel: "sms" | "whatsapp", content: string) => { success: boolean; message: string };
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [agencies, setAgencies] = useState<Agency[]>(INITIAL_AGENCIES);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [routingRules, setRoutingRules] = useState<RoutingRule[]>(INITIAL_ROUTING_RULES);
  const [pricing, setPricing] = useState<PricingConfig[]>(INITIAL_PRICING);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);
  const [contactGroups, setContactGroups] = useState<ContactGroup[]>(INITIAL_CONTACT_GROUPS);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [messageLogs, setMessageLogs] = useState<MessageLog[]>(INITIAL_MESSAGE_LOGS);
  const [senderHeaders, setSenderHeaders] = useState<SenderHeader[]>(INITIAL_SENDER_HEADERS);
  const [whatsappProfile, setWhatsappProfile] = useState<WhatsAppProfile>(INITIAL_WHATSAPP_PROFILE);
  const [activeCustomerId, setActiveCustomerId] = useState<string>("cust-01");

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedCust = localStorage.getItem("smsunmukt_customers");
      if (storedCust) setCustomers(JSON.parse(storedCust));

      const storedCamp = localStorage.getItem("smsunmukt_campaigns");
      if (storedCamp) setCampaigns(JSON.parse(storedCamp));

      const storedSupp = localStorage.getItem("smsunmukt_suppliers");
      if (storedSupp) setSuppliers(JSON.parse(storedSupp));

      const storedRules = localStorage.getItem("smsunmukt_routing_rules");
      if (storedRules) setRoutingRules(JSON.parse(storedRules));

      const storedPricing = localStorage.getItem("smsunmukt_pricing");
      if (storedPricing) setPricing(JSON.parse(storedPricing));

      const storedTx = localStorage.getItem("smsunmukt_transactions");
      if (storedTx) setTransactions(JSON.parse(storedTx));

      const storedTpl = localStorage.getItem("smsunmukt_templates");
      if (storedTpl) setTemplates(JSON.parse(storedTpl));

      const storedGroups = localStorage.getItem("smsunmukt_contact_groups");
      if (storedGroups) setContactGroups(JSON.parse(storedGroups));

      const storedContacts = localStorage.getItem("smsunmukt_contacts");
      if (storedContacts) setContacts(JSON.parse(storedContacts));

      const storedTickets = localStorage.getItem("smsunmukt_tickets");
      if (storedTickets) setSupportTickets(JSON.parse(storedTickets));

      const storedInvoices = localStorage.getItem("smsunmukt_invoices");
      if (storedInvoices) setInvoices(JSON.parse(storedInvoices));

      const storedLogs = localStorage.getItem("smsunmukt_message_logs");
      if (storedLogs) setMessageLogs(JSON.parse(storedLogs));

      const storedHeaders = localStorage.getItem("smsunmukt_sender_headers");
      if (storedHeaders) setSenderHeaders(JSON.parse(storedHeaders));

      const storedWaProfile = localStorage.getItem("smsunmukt_wa_profile");
      if (storedWaProfile) setWhatsappProfile(JSON.parse(storedWaProfile));

      // Active customer from session
      const clientSession = getClientSession();
      if (clientSession && clientSession.id) {
        setActiveCustomerId(clientSession.id);
      }
    } catch (e) {
      console.error("Failed to parse localStorage data", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage whenever state changes after initial load
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("smsunmukt_customers", JSON.stringify(customers));
      localStorage.setItem("smsunmukt_campaigns", JSON.stringify(campaigns));
      localStorage.setItem("smsunmukt_suppliers", JSON.stringify(suppliers));
      localStorage.setItem("smsunmukt_routing_rules", JSON.stringify(routingRules));
      localStorage.setItem("smsunmukt_pricing", JSON.stringify(pricing));
      localStorage.setItem("smsunmukt_transactions", JSON.stringify(transactions));
      localStorage.setItem("smsunmukt_templates", JSON.stringify(templates));
      localStorage.setItem("smsunmukt_contact_groups", JSON.stringify(contactGroups));
      localStorage.setItem("smsunmukt_contacts", JSON.stringify(contacts));
      localStorage.setItem("smsunmukt_tickets", JSON.stringify(supportTickets));
      localStorage.setItem("smsunmukt_invoices", JSON.stringify(invoices));
      localStorage.setItem("smsunmukt_message_logs", JSON.stringify(messageLogs));
      localStorage.setItem("smsunmukt_sender_headers", JSON.stringify(senderHeaders));
      localStorage.setItem("smsunmukt_wa_profile", JSON.stringify(whatsappProfile));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, [
    isLoaded,
    customers,
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
    whatsappProfile,
  ]);

  // Active customer object
  const activeCustomer = useMemo(() => {
    return customers.find((c) => c.id === activeCustomerId) || customers[0] || INITIAL_CUSTOMERS[0];
  }, [customers, activeCustomerId]);

  const clientWalletBalance = activeCustomer.walletBalance;

  // Switch active customer (Impersonation by Super Admin)
  const switchActiveCustomer = (customerId: string) => {
    const target = customers.find((c) => c.id === customerId);
    if (!target) return;
    setActiveCustomerId(customerId);
    impersonateCustomer(target);
  };

  const exitImpersonation = () => {
    stopImpersonation();
    setActiveCustomerId("cust-01");
  };

  // Add new customer (Super Admin onboarding)
  const addCustomer = (customerData: Omit<Customer, "id" | "totalMessages" | "registrationDate">) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now().toString().slice(-4)}`,
      totalMessages: 0,
      registrationDate: new Date().toISOString().split("T")[0],
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  // Recharge client wallet
  const rechargeWallet = (amount: number, method: "UPI" | "Net Banking" | "Credit Card" | "Debit Card") => {
    const prevBalance = clientWalletBalance;
    const newBalance = Number((prevBalance + amount).toFixed(2));

    const newTx: Transaction = {
      id: `tx-${Date.now().toString().slice(-6)}`,
      customerId: activeCustomer.id,
      customerName: activeCustomer.businessName,
      type: "recharge",
      amount,
      previousBalance: prevBalance,
      newBalance,
      reference: `${method.toUpperCase()}/${Date.now().toString().slice(-8)}/SUCCESS`,
      date: new Date().toISOString(),
      paymentMethod: method,
    };

    // Calculate GST breakdown: amount is total paid, base is amount / 1.18
    const baseAmount = Number((amount / 1.18).toFixed(2));
    const gstAmount = Number((amount - baseAmount).toFixed(2));

    const newInvoice: Invoice = {
      id: `inv-2026-${Date.now().toString().slice(-4)}`,
      invoiceNumber: `UNM/2026-27/${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: activeCustomer.id,
      businessName: activeCustomer.businessName,
      ownerName: activeCustomer.ownerName,
      gstin: activeCustomer.gstin || "07AAAAA0000A1Z5",
      billingAddress: `${activeCustomer.city}, ${activeCustomer.state}`,
      amount: baseAmount,
      gst: gstAmount,
      totalAmount: amount,
      paymentStatus: "paid",
      invoiceDate: new Date().toISOString().split("T")[0],
      description: `Wallet Prepaid Balance Top-Up (${method})`,
      transactionReference: newTx.reference,
    };

    setCustomers((prev) =>
      prev.map((c) => (c.id === activeCustomer.id ? { ...c, walletBalance: newBalance } : c))
    );
    setTransactions((prev) => [newTx, ...prev]);
    setInvoices((prev) => [newInvoice, ...prev]);

    return {
      success: true,
      newBalance,
      transaction: newTx,
      invoice: newInvoice,
    };
  };

  // Create Campaign
  const createCampaign = (campaignData: Omit<Campaign, "id" | "createdDate" | "delivered" | "failed" | "pending">) => {
    if (clientWalletBalance < campaignData.cost) {
      return {
        success: false,
        error: `Insufficient wallet balance. Campaign cost is ₹${campaignData.cost.toFixed(
          2
        )}, but your balance is ₹${clientWalletBalance.toFixed(2)}. Please recharge your wallet.`,
      };
    }

    const totalRecipients = campaignData.totalRecipients || 1;
    const delivered = Math.floor(totalRecipients * 0.985);
    const failed = totalRecipients - delivered;

    const newCampaign: Campaign = {
      ...campaignData,
      id: `cmp-${Date.now().toString().slice(-6)}`,
      customerId: activeCustomer.id,
      customerName: activeCustomer.businessName,
      createdDate: new Date().toISOString(),
      delivered,
      failed,
      pending: 0,
    };

    setCampaigns((prev) => [newCampaign, ...prev]);

    // Deduct from wallet
    const prevBal = clientWalletBalance;
    const newBal = Number((prevBal - campaignData.cost).toFixed(2));

    const tx: Transaction = {
      id: `tx-${Date.now().toString().slice(-6)}`,
      customerId: activeCustomer.id,
      customerName: activeCustomer.businessName,
      type: campaignData.channel === "sms" ? "sms_deduction" : "whatsapp_deduction",
      amount: campaignData.cost,
      previousBalance: prevBal,
      newBalance: newBal,
      reference: `${newCampaign.id} (${newCampaign.campaignName})`,
      date: new Date().toISOString(),
      channel: campaignData.channel,
    };

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === activeCustomer.id
          ? {
              ...c,
              walletBalance: newBal,
              totalMessages: c.totalMessages + totalRecipients,
            }
          : c
      )
    );
    setTransactions((prev) => [tx, ...prev]);

    const sampleLog: MessageLog = {
      id: `msg-${Date.now().toString().slice(-5)}`,
      customerId: activeCustomer.id,
      customerName: activeCustomer.businessName,
      channel: campaignData.channel,
      type: campaignData.messageType,
      recipient: "+91 98101 23456 (and batch)",
      senderId: campaignData.senderId || "+91 80009 12345",
      route: campaignData.channel === "sms" ? "EJOIN EIMS" : "Meta Cloud API",
      cost: campaignData.cost,
      supplierCost: Number((campaignData.cost * 0.6).toFixed(2)),
      status: "delivered",
      timestamp: new Date().toISOString(),
    };
    setMessageLogs((prev) => [sampleLog, ...prev]);

    return {
      success: true,
      campaign: newCampaign,
    };
  };

  // Contacts
  const addContact = (contactData: Omit<Contact, "id" | "dateAdded">) => {
    const newContact: Contact = {
      ...contactData,
      id: `cnt-${Date.now().toString().slice(-5)}`,
      dateAdded: new Date().toISOString().split("T")[0],
    };
    setContacts((prev) => [newContact, ...prev]);
    setContactGroups((prev) =>
      prev.map((g) => (g.name === contactData.group ? { ...g, contactCount: g.contactCount + 1 } : g))
    );
  };

  const importContacts = (newContactsData: Omit<Contact, "id" | "dateAdded">[]) => {
    const today = new Date().toISOString().split("T")[0];
    const createdContacts: Contact[] = newContactsData.map((c, idx) => ({
      ...c,
      id: `cnt-${Date.now().toString().slice(-4)}-${idx}`,
      dateAdded: today,
    }));

    setContacts((prev) => [...createdContacts, ...prev]);

    // Update group counts
    const countsByGroup: Record<string, number> = {};
    createdContacts.forEach((c) => {
      countsByGroup[c.group] = (countsByGroup[c.group] || 0) + 1;
    });

    setContactGroups((prev) =>
      prev.map((g) => {
        const added = countsByGroup[g.name] || 0;
        return added ? { ...g, contactCount: g.contactCount + added } : g;
      })
    );

    return createdContacts.length;
  };

  const updateContact = (contact: Contact) => {
    setContacts((prev) => prev.map((c) => (c.id === contact.id ? contact : c)));
  };

  const deleteContact = (id: string) => {
    const target = contacts.find((c) => c.id === id);
    if (target) {
      setContactGroups((prev) =>
        prev.map((g) => (g.name === target.group ? { ...g, contactCount: Math.max(0, g.contactCount - 1) } : g))
      );
    }
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // Contact Groups
  const addGroup = (groupData: Omit<ContactGroup, "id" | "createdDate" | "contactCount">) => {
    const newGroup: ContactGroup = {
      ...groupData,
      id: `grp-${Date.now().toString().slice(-4)}`,
      contactCount: 0,
      createdDate: new Date().toISOString().split("T")[0],
    };
    setContactGroups((prev) => [...prev, newGroup]);
  };

  const deleteGroup = (id: string) => {
    setContactGroups((prev) => prev.filter((g) => g.id !== id));
  };

  // Templates
  const addTemplate = (templateData: Omit<Template, "id" | "createdDate">) => {
    const newTemplate: Template = {
      ...templateData,
      id: `tpl-${Date.now().toString().slice(-4)}`,
      createdDate: new Date().toISOString().split("T")[0],
    };
    setTemplates((prev) => [newTemplate, ...prev]);
  };

  const updateTemplateStatus = (id: string, status: "approved" | "pending" | "rejected") => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, approvalStatus: status } : t)));
  };

  // Sender Headers (DLT)
  const addSenderHeader = (headerData: Omit<SenderHeader, "id" | "createdDate" | "status">) => {
    const newHeader: SenderHeader = {
      ...headerData,
      id: `hdr-${Date.now().toString().slice(-4)}`,
      status: "pending",
      createdDate: new Date().toISOString().split("T")[0],
    };
    setSenderHeaders((prev) => [newHeader, ...prev]);
    return newHeader;
  };

  const updateSenderHeaderStatus = (id: string, status: "approved" | "pending" | "rejected") => {
    setSenderHeaders((prev) => prev.map((h) => (h.id === id ? { ...h, status } : h)));
  };

  // Routing
  const addRoutingRule = (ruleData: Omit<RoutingRule, "id">) => {
    const newRule: RoutingRule = {
      ...ruleData,
      id: `rule-${Date.now().toString().slice(-4)}`,
    };
    setRoutingRules((prev) => [...prev, newRule]);
  };

  const updateRoutingRule = (rule: RoutingRule) => {
    setRoutingRules((prev) => prev.map((r) => (r.id === rule.id ? rule : r)));
  };

  const deleteRoutingRule = (id: string) => {
    setRoutingRules((prev) => prev.filter((r) => r.id !== id));
  };

  // Pricing
  const updatePricing = (type: string, sellingPrice: number) => {
    setPricing((prev) =>
      prev.map((p) => {
        if (p.type === type) {
          const grossContribution = Number((sellingPrice - p.supplierCost).toFixed(2));
          const marginPercent = Number(((grossContribution / sellingPrice) * 100).toFixed(1));
          return {
            ...p,
            sellingPrice,
            grossContribution,
            marginPercent,
          };
        }
        return p;
      })
    );
  };

  const updateWhatsAppProfile = (profile: Partial<WhatsAppProfile>) => {
    setWhatsappProfile((prev) => ({ ...prev, ...profile }));
  };

  // Support Tickets
  const createSupportTicket = (ticketData: {
    subject: string;
    category: SupportTicket["category"];
    message: string;
    priority?: SupportTicket["priority"];
  }) => {
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now().toString().slice(-4)}`,
      customerId: activeCustomer.id,
      customerName: activeCustomer.businessName,
      subject: ticketData.subject,
      category: ticketData.category,
      priority: ticketData.priority || "medium",
      status: "open",
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      messages: [
        {
          sender: "customer",
          senderName: activeCustomer.ownerName,
          message: ticketData.message,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  const replyToTicket = (ticketId: string, message: string, sender: "customer" | "support", senderName: string) => {
    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            updatedDate: new Date().toISOString(),
            status: sender === "support" ? "in_progress" : t.status,
            messages: [
              ...t.messages,
              {
                sender,
                senderName,
                message,
                timestamp: new Date().toISOString(),
              },
            ],
          };
        }
        return t;
      })
    );
  };

  // Supplier
  const updateSupplier = (supplier: Supplier) => {
    setSuppliers((prev) => prev.map((s) => (s.id === supplier.id ? supplier : s)));
  };

  // Customer status
  const updateCustomerStatus = (customerId: string, status: Customer["accountStatus"]) => {
    setCustomers((prev) => prev.map((c) => (c.id === customerId ? { ...c, accountStatus: status } : c)));
  };

  // Manual Customer Wallet Adjustment (Super Admin)
  const manualCustomerWalletAdjustment = (
    customerId: string,
    amount: number,
    type: "credit" | "debit",
    note: string
  ) => {
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return;

    const prevBal = cust.walletBalance;
    const newBal = type === "credit" ? prevBal + amount : Math.max(0, prevBal - amount);

    setCustomers((prev) => prev.map((c) => (c.id === customerId ? { ...c, walletBalance: newBal } : c)));

    const tx: Transaction = {
      id: `tx-${Date.now().toString().slice(-6)}`,
      customerId,
      customerName: cust.businessName,
      type: type === "credit" ? "manual_credit" : "manual_debit",
      amount,
      previousBalance: prevBal,
      newBalance: newBal,
      reference: `ADMIN/${note.toUpperCase()}`,
      date: new Date().toISOString(),
      paymentMethod: "System Adjustment",
    };

    setTransactions((prev) => [tx, ...prev]);
  };

  // Test message dispatcher
  const sendTestMessage = (mobile: string, channel: "sms" | "whatsapp", content: string) => {
    const testLog: MessageLog = {
      id: `test-${Date.now().toString().slice(-5)}`,
      customerId: activeCustomer.id,
      customerName: activeCustomer.businessName,
      channel,
      type: "test_broadcast",
      recipient: mobile,
      senderId: channel === "sms" ? "SHRFSH" : "+91 80009 12345",
      route: channel === "sms" ? "EJOIN EIMS (Test Node)" : "Meta Cloud Sandbox",
      cost: 0,
      supplierCost: 0,
      status: "delivered",
      timestamp: new Date().toISOString(),
    };
    setMessageLogs((prev) => [testLog, ...prev]);

    return {
      success: true,
      message: `Simulated test ${channel.toUpperCase()} delivered to ${mobile}. Handset received 100% OK.`,
    };
  };

  const resetAllData = () => {
    localStorage.clear();
    setCustomers(INITIAL_CUSTOMERS);
    setAgencies(INITIAL_AGENCIES);
    setCampaigns(INITIAL_CAMPAIGNS);
    setSuppliers(INITIAL_SUPPLIERS);
    setRoutingRules(INITIAL_ROUTING_RULES);
    setPricing(INITIAL_PRICING);
    setTransactions(INITIAL_TRANSACTIONS);
    setTemplates(INITIAL_TEMPLATES);
    setContactGroups(INITIAL_CONTACT_GROUPS);
    setContacts(INITIAL_CONTACTS);
    setSupportTickets(INITIAL_SUPPORT_TICKETS);
    setInvoices(INITIAL_INVOICES);
    setMessageLogs(INITIAL_MESSAGE_LOGS);
    setSenderHeaders(INITIAL_SENDER_HEADERS);
    setWhatsappProfile(INITIAL_WHATSAPP_PROFILE);
    setActiveCustomerId("cust-01");
  };

  return (
    <AppContext.Provider
      value={{
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
        whatsappProfile,
        activeCustomerId,
        activeCustomer,
        clientWalletBalance,
        switchActiveCustomer,
        exitImpersonation,
        rechargeWallet,
        createCampaign,
        addCustomer,
        addContact,
        importContacts,
        updateContact,
        deleteContact,
        addGroup,
        deleteGroup,
        addTemplate,
        updateTemplateStatus,
        addSenderHeader,
        updateSenderHeaderStatus,
        addRoutingRule,
        updateRoutingRule,
        deleteRoutingRule,
        updatePricing,
        updateWhatsAppProfile,
        createSupportTicket,
        replyToTicket,
        updateSupplier,
        updateCustomerStatus,
        manualCustomerWalletAdjustment,
        sendTestMessage,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}

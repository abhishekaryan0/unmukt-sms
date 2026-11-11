"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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
} from "./mock-data";

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
  clientWalletBalance: number;

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
  addContact: (contact: Omit<Contact, "id" | "dateAdded">) => void;
  updateContact: (contact: Contact) => void;
  deleteContact: (id: string) => void;
  addGroup: (group: Omit<ContactGroup, "id" | "createdDate" | "contactCount">) => void;
  deleteGroup: (id: string) => void;
  addTemplate: (template: Omit<Template, "id" | "createdDate">) => void;
  updateTemplateStatus: (id: string, status: "approved" | "pending" | "rejected") => void;
  addRoutingRule: (rule: Omit<RoutingRule, "id">) => void;
  updateRoutingRule: (rule: RoutingRule) => void;
  deleteRoutingRule: (id: string) => void;
  updatePricing: (type: string, sellingPrice: number) => void;
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
  const [clientWalletBalance, setClientWalletBalance] = useState<number>(4850.5);

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

      const storedBalance = localStorage.getItem("smsunmukt_client_wallet");
      if (storedBalance !== null) setClientWalletBalance(parseFloat(storedBalance));
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
      localStorage.setItem("smsunmukt_client_wallet", clientWalletBalance.toString());
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
    clientWalletBalance,
  ]);

  // Recharge client wallet
  const rechargeWallet = (amount: number, method: "UPI" | "Net Banking" | "Credit Card" | "Debit Card") => {
    const prevBalance = clientWalletBalance;
    const newBalance = Number((prevBalance + amount).toFixed(2));

    const newTx: Transaction = {
      id: `tx-${Date.now().toString().slice(-6)}`,
      customerId: "cust-01",
      customerName: "Sharma Fashion Store",
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
      customerId: "cust-01",
      businessName: "Sharma Fashion Store",
      ownerName: "Rajesh Sharma",
      gstin: "07AAAAA0000A1Z5",
      billingAddress: "Shop 14, Main Cloth Market, Chandni Chowk, Central Delhi - 110006",
      amount: baseAmount,
      gst: gstAmount,
      totalAmount: amount,
      paymentStatus: "paid",
      invoiceDate: new Date().toISOString().split("T")[0],
      description: `Wallet Prepaid Balance Top-Up (${method})`,
      transactionReference: newTx.reference,
    };

    setClientWalletBalance(newBalance);
    setTransactions((prev) => [newTx, ...prev]);
    setInvoices((prev) => [newInvoice, ...prev]);

    // Also update Sharma Fashion Store in customers list
    setCustomers((prev) =>
      prev.map((c) => (c.id === "cust-01" ? { ...c, walletBalance: newBalance } : c))
    );

    return {
      success: true,
      newBalance,
      transaction: newTx,
      invoice: newInvoice,
    };
  };

  // Create Campaign
  const createCampaign = (campaignData: Omit<Campaign, "id" | "createdDate" | "delivered" | "failed" | "pending">) => {
    // If client is sending, check wallet balance
    if (campaignData.customerId === "cust-01") {
      if (clientWalletBalance < campaignData.cost) {
        return {
          success: false,
          error: `Insufficient wallet balance. Campaign cost is ₹${campaignData.cost.toFixed(
            2
          )}, but your balance is ₹${clientWalletBalance.toFixed(2)}. Please recharge your wallet.`,
        };
      }
    }

    const totalRecipients = campaignData.totalRecipients || 1;
    // Calculate realistic delivered & failed numbers (approx 98.2% deliverability)
    const delivered = Math.floor(totalRecipients * 0.982);
    const failed = totalRecipients - delivered;

    const newCampaign: Campaign = {
      ...campaignData,
      id: `cmp-${Date.now().toString().slice(-6)}`,
      createdDate: new Date().toISOString(),
      delivered,
      failed,
      pending: 0,
    };

    setCampaigns((prev) => [newCampaign, ...prev]);

    // If client, deduct from wallet
    if (campaignData.customerId === "cust-01") {
      const prevBal = clientWalletBalance;
      const newBal = Number((prevBal - campaignData.cost).toFixed(2));
      setClientWalletBalance(newBal);

      const tx: Transaction = {
        id: `tx-${Date.now().toString().slice(-6)}`,
        customerId: "cust-01",
        customerName: "Sharma Fashion Store",
        type: campaignData.channel === "sms" ? "sms_deduction" : "whatsapp_deduction",
        amount: campaignData.cost,
        previousBalance: prevBal,
        newBalance: newBal,
        reference: `${newCampaign.id} (${newCampaign.campaignName})`,
        date: new Date().toISOString(),
        channel: campaignData.channel,
      };

      setTransactions((prev) => [tx, ...prev]);

      setCustomers((prev) =>
        prev.map((c) =>
          c.id === "cust-01"
            ? {
                ...c,
                walletBalance: newBal,
                totalMessages: c.totalMessages + totalRecipients,
              }
            : c
        )
      );
    }

    // Add log entries
    const sampleLog: MessageLog = {
      id: `msg-${Date.now().toString().slice(-5)}`,
      customerId: campaignData.customerId,
      customerName: campaignData.customerName,
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
    // update group count
    setContactGroups((prev) =>
      prev.map((g) => (g.name === contactData.group ? { ...g, contactCount: g.contactCount + 1 } : g))
    );
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

  // Support Tickets
  const createSupportTicket = (ticketData: {
    subject: string;
    category: SupportTicket["category"];
    message: string;
    priority?: SupportTicket["priority"];
  }) => {
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now().toString().slice(-4)}`,
      customerId: "cust-01",
      customerName: "Sharma Fashion Store",
      subject: ticketData.subject,
      category: ticketData.category,
      priority: ticketData.priority || "medium",
      status: "open",
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      messages: [
        {
          sender: "customer",
          senderName: "Rajesh Sharma",
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

    if (customerId === "cust-01") {
      setClientWalletBalance(newBal);
    }

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
    setClientWalletBalance(4850.5);
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
        clientWalletBalance,
        rechargeWallet,
        createCampaign,
        addContact,
        updateContact,
        deleteContact,
        addGroup,
        deleteGroup,
        addTemplate,
        updateTemplateStatus,
        addRoutingRule,
        updateRoutingRule,
        deleteRoutingRule,
        updatePricing,
        createSupportTicket,
        replyToTicket,
        updateSupplier,
        updateCustomerStatus,
        manualCustomerWalletAdjustment,
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

"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
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
  ConnectedChannel,
  Conversation,
  ChatMessage,
  SavedReply,
  TeamMember,
  SocialChannelType,
  BroadcastCampaign,
  BroadcastStatus,
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
  INITIAL_CONNECTED_CHANNELS,
  INITIAL_CONVERSATIONS,
  INITIAL_SAVED_REPLIES,
  INITIAL_TEAM_MEMBERS,
  INITIAL_BROADCAST_CAMPAIGNS,
} from "./mock-data";
import { getClientSession, impersonateCustomer, stopImpersonation } from "./auth";
import { useToast } from "@/components/ui/ToastContext";

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

  // Social Media Messaging Platform State
  connectedChannels: ConnectedChannel[];
  conversations: Conversation[];
  savedReplies: SavedReply[];
  teamMembers: TeamMember[];
  broadcastCampaigns: BroadcastCampaign[];

  // Social Messaging Actions
  connectChannel: (channel: Omit<ConnectedChannel, "id" | "connectedAt" | "lastSyncAt" | "unreadCount" | "totalConversations">) => ConnectedChannel;
  disconnectChannel: (channelId: string) => void;
  reconnectChannel: (channelId: string) => void;
  sendConversationMessage: (
    conversationId: string,
    content: string,
    isInternalNote?: boolean,
    attachments?: { type: "image" | "file"; url: string; name: string }[]
  ) => ChatMessage;
  markConversationStatus: (conversationId: string, status: "open" | "resolved") => void;
  assignConversation: (conversationId: string, agentName: string, agentId?: string) => void;
  addTagToConversation: (conversationId: string, tag: string) => void;
  removeTagFromConversation: (conversationId: string, tag: string) => void;
  addInternalNote: (conversationId: string, note: string, author?: string) => void;
  addSavedReply: (reply: Omit<SavedReply, "id">) => SavedReply;
  deleteSavedReply: (id: string) => void;
  addTeamMember: (member: Omit<TeamMember, "id" | "activeChats">) => TeamMember;
  updateTeamMemberStatus: (id: string, status: TeamMember["status"]) => void;

  // Broadcast Actions (SaleSmartly inspired)
  createBroadcastCampaign: (
    campaign: Omit<
      BroadcastCampaign,
      "id" | "createdDate" | "sent" | "delivered" | "read" | "failed" | "queued" | "deliveryRate" | "timeline"
    >
  ) => BroadcastCampaign;
  pauseBroadcastCampaign: (id: string) => void;
  resumeBroadcastCampaign: (id: string) => void;
  deleteBroadcastCampaign: (id: string) => void;
  duplicateBroadcastCampaign: (id: string) => BroadcastCampaign;

  // Active client context (supports Super Admin impersonation)
  activeCustomerId: string;
  activeCustomer: Customer;
  clientWalletBalance: number;
  switchActiveCustomer: (customerId: string) => void;
  exitImpersonation: () => void;

  // Real-time synchronization
  refreshFromDatabase: () => Promise<void>;
  isDbConnected: boolean;

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
  addCustomer: (customer: Omit<Customer, "id" | "totalMessages" | "registrationDate"> & { password?: string }) => Promise<{
    success: boolean;
    customer: Customer;
    credentials?: { email: string; password: string; loginUrl: string; mobile: string };
    error?: string;
  }>;
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
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(true);

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
  const [connectedChannels, setConnectedChannels] = useState<ConnectedChannel[]>(INITIAL_CONNECTED_CHANNELS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [savedReplies, setSavedReplies] = useState<SavedReply[]>(INITIAL_SAVED_REPLIES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [broadcastCampaigns, setBroadcastCampaigns] = useState<BroadcastCampaign[]>(INITIAL_BROADCAST_CAMPAIGNS);
  const [activeCustomerId, setActiveCustomerId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const session = getClientSession();
      if (session?.id) return session.id;
    }
    return "cust-01";
  });

  // Synchronize state from PostgreSQL mind-tree database
  const refreshFromDatabase = useCallback(async () => {
    try {
      const session = getClientSession();
      const queryParam = session?.id ? `?customerId=${encodeURIComponent(session.id)}` : "";
      const res = await fetch(`/api/bootstrap${queryParam}`);
      if (!res.ok) throw new Error("Bootstrap endpoint responded with status " + res.status);
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        if (d.customers !== undefined) setCustomers(d.customers);
        if (d.agencies !== undefined) setAgencies(d.agencies);
        if (d.campaigns !== undefined) setCampaigns(d.campaigns);
        if (d.suppliers !== undefined) setSuppliers(d.suppliers);
        if (d.routingRules !== undefined) setRoutingRules(d.routingRules);
        if (d.pricing !== undefined) setPricing(d.pricing);
        if (d.transactions !== undefined) setTransactions(d.transactions);
        if (d.templates !== undefined) setTemplates(d.templates);
        if (d.contactGroups !== undefined) setContactGroups(d.contactGroups);
        if (d.contacts !== undefined) setContacts(d.contacts);
        if (d.supportTickets !== undefined) setSupportTickets(d.supportTickets);
        if (d.invoices !== undefined) setInvoices(d.invoices);
        if (d.messageLogs !== undefined) setMessageLogs(d.messageLogs);
        if (d.senderHeaders !== undefined) setSenderHeaders(d.senderHeaders);
        if (d.whatsappProfile) setWhatsappProfile(d.whatsappProfile);
        setIsDbConnected(true);
      }
    } catch (err) {
      console.warn("Using local cache, database syncing will retry:", err);
      setIsDbConnected(false);
    }
  }, []);

  // Listen for login/session change events dynamically
  useEffect(() => {
    const handleAuthChange = () => {
      const session = getClientSession();
      if (session?.id) {
        setActiveCustomerId(session.id);
        refreshFromDatabase();
      }
    };
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("smsunmukt_auth_changed", handleAuthChange);
    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("smsunmukt_auth_changed", handleAuthChange);
    };
  }, [refreshFromDatabase]);

  // Initial load: fast local storage hydration + background PostgreSQL synchronization
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

      const storedChannels = localStorage.getItem("smsunmukt_connected_channels");
      if (storedChannels) setConnectedChannels(JSON.parse(storedChannels));

      const storedConvs = localStorage.getItem("smsunmukt_conversations");
      if (storedConvs) setConversations(JSON.parse(storedConvs));

      const storedReplies = localStorage.getItem("smsunmukt_saved_replies");
      if (storedReplies) setSavedReplies(JSON.parse(storedReplies));

      const storedTeam = localStorage.getItem("smsunmukt_team_members");
      if (storedTeam) setTeamMembers(JSON.parse(storedTeam));

      const storedBroadcasts = localStorage.getItem("smsunmukt_broadcast_campaigns");
      if (storedBroadcasts) setBroadcastCampaigns(JSON.parse(storedBroadcasts));

      const clientSession = getClientSession();
      if (clientSession && clientSession.id) {
        setActiveCustomerId(clientSession.id);
      }
    } catch (e) {
      console.error("Failed to parse localStorage data", e);
    } finally {
      setIsLoaded(true);
      refreshFromDatabase();
    }
  }, [refreshFromDatabase]);

  // Persist state changes to localStorage
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
      localStorage.setItem("smsunmukt_connected_channels", JSON.stringify(connectedChannels));
      localStorage.setItem("smsunmukt_conversations", JSON.stringify(conversations));
      localStorage.setItem("smsunmukt_saved_replies", JSON.stringify(savedReplies));
      localStorage.setItem("smsunmukt_team_members", JSON.stringify(teamMembers));
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
    connectedChannels,
    conversations,
    savedReplies,
    teamMembers,
  ]);

  // Active customer object
  const activeCustomer = useMemo(() => {
    const found = customers.find((c) => c.id === activeCustomerId);
    if (found) return found;

    // Synthesize profile directly from authenticated client session immediately
    const session = getClientSession();
    if (session && (session.id === activeCustomerId || !activeCustomerId)) {
      return {
        id: session.id,
        businessName: session.businessName || "Business Account",
        ownerName: session.name || "Business Owner",
        email: session.email || "",
        mobile: session.phone || "",
        businessCategory: session.category || "Enterprise",
        city: "Mumbai",
        state: "Maharashtra",
        dltEntityId: "DLT-PENDING",
        walletBalance: 100.0,
        totalMessages: 0,
        accountStatus: "active" as const,
        registrationDate: new Date().toISOString(),
      };
    }

    return customers[0] || INITIAL_CUSTOMERS[0];
  }, [customers, activeCustomerId]);

  const clientWalletBalance = activeCustomer.walletBalance;

  // Switch active customer (Super Admin impersonation)
  const switchActiveCustomer = (customerId: string) => {
    const target = customers.find((c) => c.id === customerId);
    if (!target) return;
    setActiveCustomerId(customerId);
    impersonateCustomer(target);
    toast({
      title: "Switched Account",
      message: `Now viewing dashboard as ${target.businessName}`,
      type: "info",
    });
  };

  const exitImpersonation = () => {
    stopImpersonation();
    setActiveCustomerId("cust-01");
    toast({
      title: "Exit Impersonation",
      message: "Returned to default Super Admin context",
      type: "info",
    });
  };

  // Add new customer (Super Admin onboarding with auth credentials)
  const addCustomer = async (
    customerData: Omit<Customer, "id" | "totalMessages" | "registrationDate"> & { password?: string }
  ) => {
    const newId = `cust-${Date.now().toString().slice(-4)}`;
    const tempCustomer: Customer = {
      id: newId,
      businessName: customerData.businessName,
      ownerName: customerData.ownerName,
      email: customerData.email,
      mobile: customerData.mobile,
      businessCategory: customerData.businessCategory,
      city: customerData.city,
      state: customerData.state,
      gstin: customerData.gstin,
      dltEntityId: customerData.dltEntityId,
      walletBalance: customerData.walletBalance,
      totalMessages: 0,
      accountStatus: "active",
      registrationDate: new Date().toISOString().split("T")[0],
    };

    setCustomers((prev) => [tempCustomer, ...prev]);

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const persistedCustomer: Customer = {
          ...tempCustomer,
          id: data.data.id,
          dltEntityId: data.data.dltEntityId,
          walletBalance: data.data.walletBalance,
        };
        setCustomers((prev) => prev.map((c) => (c.id === newId ? persistedCustomer : c)));
        toast({
          title: "Customer Provisioned",
          message: `${customerData.businessName} saved to database with login credentials.`,
          type: "success",
        });
        return {
          success: true,
          customer: persistedCustomer,
          credentials: data.credentials,
        };
      } else {
        toast({
          title: "Notice",
          message: data.error || "Customer saved locally",
          type: "info",
        });
        return {
          success: true,
          customer: tempCustomer,
          credentials: {
            email: customerData.email,
            password: customerData.password || "Client@123",
            loginUrl: "/login",
            mobile: customerData.mobile,
          },
        };
      }
    } catch (err: any) {
      console.error("API /api/customers error:", err);
      return {
        success: true,
        customer: tempCustomer,
        credentials: {
          email: customerData.email,
          password: customerData.password || "Client@123",
          loginUrl: "/login",
          mobile: customerData.mobile,
        },
      };
    }
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

    // Dynamic PostgreSQL Atomic Transaction
    fetch("/api/wallet/recharge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: activeCustomer.id,
        amount,
        paymentMethod: method,
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          toast({
            title: "Wallet Recharged",
            message: `₹${amount.toFixed(2)} credited via ${method}. GST Invoice ${resData.invoice?.invoiceNumber || ""} issued.`,
            type: "success",
          });
        }
      })
      .catch((err) => {
        console.error("Recharge API sync error:", err);
      });

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
      toast({
        title: "Insufficient Balance",
        message: `Campaign requires ₹${campaignData.cost.toFixed(2)}, available ₹${clientWalletBalance.toFixed(2)}. Please recharge.`,
        type: "error",
      });
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

    // Deduct from wallet optimistically
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

    // Dynamic PostgreSQL Atomic Transaction
    fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...campaignData,
        customerId: activeCustomer.id,
        customerName: activeCustomer.businessName,
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          toast({
            title: "Campaign Broadcast Dispatched",
            message: `'${campaignData.campaignName}' successfully queued for ${totalRecipients.toLocaleString("en-IN")} recipients.`,
            type: "success",
          });
        } else {
          toast({
            title: "Database Sync Alert",
            message: resData.error || "Failed to persist campaign record",
            type: "error",
          });
        }
      })
      .catch((err) => {
        console.error("Campaign API sync error:", err);
      });

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
      customerId: activeCustomer.id,
      dateAdded: new Date().toISOString().split("T")[0],
    };
    setContacts((prev) => [newContact, ...prev]);
    setContactGroups((prev) =>
      prev.map((g) => (g.name === contactData.group ? { ...g, contactCount: g.contactCount + 1 } : g))
    );

    fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: activeCustomer.id,
        contact: {
          ...contactData,
          customerId: activeCustomer.id,
        },
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          toast({
            title: "Contact Saved to DB",
            message: `${contactData.name} (${contactData.mobile}) registered.`,
            type: "success",
          });
        }
      })
      .catch((e) => console.error("Contact add API error:", e));
  };

  const importContacts = (newContactsData: Omit<Contact, "id" | "dateAdded">[]) => {
    const today = new Date().toISOString().split("T")[0];
    const createdContacts: Contact[] = newContactsData.map((c, idx) => ({
      ...c,
      id: `cnt-${Date.now().toString().slice(-4)}-${idx}`,
      customerId: activeCustomer.id,
      dateAdded: today,
    }));

    setContacts((prev) => [...createdContacts, ...prev]);

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

    fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: activeCustomer.id,
        contacts: newContactsData.map((c) => ({
          ...c,
          customerId: activeCustomer.id,
        })),
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          toast({
            title: "PostgreSQL Import Complete",
            message: `${newContactsData.length} contacts written to database.`,
            type: "success",
          });
        }
      })
      .catch((e) => console.error("Contacts batch API error:", e));

    return createdContacts.length;
  };

  const updateContact = (contact: Contact) => {
    setContacts((prev) => prev.map((c) => (c.id === contact.id ? contact : c)));
    fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: activeCustomer.id,
        contact: {
          ...contact,
          customerId: activeCustomer.id,
        },
      }),
    }).catch((e) => console.error("Update contact API error:", e));
  };

  const deleteContact = (id: string) => {
    const target = contacts.find((c) => c.id === id);
    if (target) {
      setContactGroups((prev) =>
        prev.map((g) => (g.name === target.group ? { ...g, contactCount: Math.max(0, g.contactCount - 1) } : g))
      );
    }
    setContacts((prev) => prev.filter((c) => c.id !== id));

    fetch(`/api/contacts?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch((e) => console.error("Delete contact API error:", e));
  };

  // Contact Groups
  const addGroup = (groupData: Omit<ContactGroup, "id" | "createdDate" | "contactCount">) => {
    const newGroup: ContactGroup = {
      ...groupData,
      id: `grp-${Date.now().toString().slice(-4)}`,
      customerId: activeCustomer.id,
      contactCount: 0,
      createdDate: new Date().toISOString().split("T")[0],
    };
    setContactGroups((prev) => [...prev, newGroup]);

    fetch("/api/contact-groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...groupData,
        customerId: activeCustomer.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast({
            title: "Group Created in DB",
            message: `'${groupData.name}' stored in PostgreSQL.`,
            type: "success",
          });
        }
      })
      .catch((e) => console.error("Group API error:", e));
  };

  const deleteGroup = (id: string) => {
    setContactGroups((prev) => prev.filter((g) => g.id !== id));
    fetch(`/api/contact-groups?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch((e) => console.error("Delete group API error:", e));
  };

  // Templates
  const addTemplate = (templateData: Omit<Template, "id" | "createdDate">) => {
    const newTemplate: Template = {
      ...templateData,
      id: `tpl-${Date.now().toString().slice(-4)}`,
      createdDate: new Date().toISOString().split("T")[0],
    };
    setTemplates((prev) => [newTemplate, ...prev]);

    fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(templateData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast({
            title: "Template Registered",
            message: `'${templateData.name}' submitted for TRAI / Meta compliance review.`,
            type: "success",
          });
        }
      })
      .catch((e) => console.error("Template API error:", e));
  };

  const updateTemplateStatus = (id: string, status: "approved" | "pending" | "rejected") => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, approvalStatus: status } : t)));

    fetch("/api/templates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast({
            title: "Template Status Updated",
            message: `Status updated to ${status.toUpperCase()} in database.`,
            type: "info",
          });
        }
      })
      .catch((e) => console.error("Update template API error:", e));
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

    fetch("/api/sms/headers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(headerData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast({
            title: "DLT Header Applied",
            message: `Header '${headerData.header}' submitted to telecom portal.`,
            type: "success",
          });
        }
      })
      .catch((e) => console.error("Header API error:", e));

    return newHeader;
  };

  const updateSenderHeaderStatus = (id: string, status: "approved" | "pending" | "rejected") => {
    setSenderHeaders((prev) => prev.map((h) => (h.id === id ? { ...h, status } : h)));

    fetch("/api/sms/headers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast({
            title: "DLT Header Status Updated",
            message: `Header status set to ${status.toUpperCase()}.`,
            type: "info",
          });
        }
      })
      .catch((e) => console.error("Update header API error:", e));
  };

  // Routing
  const addRoutingRule = (ruleData: Omit<RoutingRule, "id">) => {
    const newRule: RoutingRule = {
      ...ruleData,
      id: `rule-${Date.now().toString().slice(-4)}`,
    };
    setRoutingRules((prev) => [...prev, newRule]);

    fetch("/api/routing-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ruleData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast({
            title: "Carrier Route Added",
            message: `Rule '${ruleData.name}' stored in database.`,
            type: "success",
          });
        }
      })
      .catch((e) => console.error("Routing rule API error:", e));
  };

  const updateRoutingRule = (rule: RoutingRule) => {
    setRoutingRules((prev) => prev.map((r) => (r.id === rule.id ? rule : r)));

    fetch("/api/routing-rules", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rule),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast({
            title: "Carrier Route Saved",
            message: `Route '${rule.name}' updated.`,
            type: "success",
          });
        }
      })
      .catch((e) => console.error("Update rule API error:", e));
  };

  const deleteRoutingRule = (id: string) => {
    setRoutingRules((prev) => prev.filter((r) => r.id !== id));

    fetch(`/api/routing-rules?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch((e) => console.error("Delete rule API error:", e));
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

    fetch("/api/pricing", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, sellingPrice }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast({
            title: "Pricing Updated in DB",
            message: `${type} set to ₹${sellingPrice.toFixed(2)}/unit.`,
            type: "success",
          });
        }
      })
      .catch((e) => console.error("Pricing API error:", e));
  };

  const updateWhatsAppProfile = (profile: Partial<WhatsAppProfile>) => {
    setWhatsappProfile((prev) => ({ ...prev, ...profile }));

    fetch("/api/whatsapp/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast({
            title: "Meta Profile Synced",
            message: "WhatsApp Business profile updated.",
            type: "success",
          });
        }
      })
      .catch((e) => console.error("WA Profile API error:", e));
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

    fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...ticketData,
        customerId: activeCustomer.id,
        customerName: activeCustomer.businessName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast({
            title: "Support Ticket Logged",
            message: "Our telecom desk will respond within 2 business hours.",
            type: "success",
          });
        }
      })
      .catch((e) => console.error("Ticket API error:", e));

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

    fetch("/api/tickets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId, message, sender, senderName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast({
            title: "Message Delivered",
            message: "Response appended to ticket history.",
            type: "info",
          });
        }
      })
      .catch((e) => console.error("Reply ticket API error:", e));
  };

  // Supplier
  const updateSupplier = (supplier: Supplier) => {
    setSuppliers((prev) => prev.map((s) => (s.id === supplier.id ? supplier : s)));

    fetch("/api/suppliers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(supplier),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast({
            title: "Gateway Configuration Saved",
            message: `Carrier ${supplier.name} updated.`,
            type: "success",
          });
        }
      })
      .catch((e) => console.error("Supplier API error:", e));
  };

  // Customer status
  const updateCustomerStatus = (customerId: string, status: Customer["accountStatus"]) => {
    setCustomers((prev) => prev.map((c) => (c.id === customerId ? { ...c, accountStatus: status } : c)));

    fetch(`/api/customers/${encodeURIComponent(customerId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast({
            title: "Account Status Updated",
            message: `Customer status is now ${status.toUpperCase()}.`,
            type: "info",
          });
        }
      })
      .catch((e) => console.error("Customer status API error:", e));
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

    fetch(`/api/customers/${encodeURIComponent(customerId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "adjust_wallet",
        amount,
        type,
        note,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast({
            title: "Wallet Manually Adjusted",
            message: `${type === "credit" ? "Credited" : "Debited"} ₹${amount.toFixed(2)}: ${note}`,
            type: "success",
          });
        }
      })
      .catch((e) => console.error("Wallet adjustment API error:", e));
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

    fetch("/api/test-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: activeCustomer.id,
        mobile,
        channel,
        content,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast({
            title: "Test Handset Delivery OK",
            message: `Carrier ACK received for ${mobile}. Message ID: ${data.messageId}`,
            type: "success",
          });
        }
      })
      .catch((e) => console.error("Test message API error:", e));

    return {
      success: true,
      message: `Simulated test ${channel.toUpperCase()} delivered to ${mobile}. Handset received 100% OK.`,
    };
  };

  // Social Messaging Actions
  const connectChannel = useCallback(
    (channel: Omit<ConnectedChannel, "id" | "connectedAt" | "lastSyncAt" | "unreadCount" | "totalConversations">): ConnectedChannel => {
      const newChan: ConnectedChannel = {
        ...channel,
        id: `chan-${Date.now()}`,
        customerId: channel.customerId || activeCustomerId,
        status: "connected",
        connectedAt: new Date().toISOString().split("T")[0],
        lastSyncAt: "Just now",
        unreadCount: 0,
        totalConversations: 0,
        webhookStatus: "healthy",
      };
      setConnectedChannels((prev) => [newChan, ...prev]);
      toast({
        title: "Channel Connected",
        message: `${newChan.name} (${newChan.identifier}) is now active.`,
        type: "success",
      });
      return newChan;
    },
    [activeCustomerId, toast]
  );

  const disconnectChannel = useCallback(
    (channelId: string) => {
      setConnectedChannels((prev) =>
        prev.map((c) => (c.id === channelId ? { ...c, status: "disconnected" } : c))
      );
      toast({
        title: "Channel Disconnected",
        message: "Channel has been paused. Inbound webhooks will be ignored.",
        type: "info",
      });
    },
    [toast]
  );

  const reconnectChannel = useCallback(
    (channelId: string) => {
      setConnectedChannels((prev) =>
        prev.map((c) =>
          c.id === channelId
            ? { ...c, status: "connected", lastSyncAt: "Just now", webhookStatus: "healthy" }
            : c
        )
      );
      toast({
        title: "Channel Reconnected",
        message: "Credentials verified and webhook sync restored successfully.",
        type: "success",
      });
    },
    [toast]
  );

  const sendConversationMessage = useCallback(
    (
      conversationId: string,
      content: string,
      isInternalNote: boolean = false,
      attachments?: { type: "image" | "file"; url: string; name: string }[]
    ): ChatMessage => {
      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId,
        sender: "agent",
        senderName: activeCustomer.ownerName || "Support Agent",
        content,
        timestamp: timeStr,
        status: "sent",
        channelType: "whatsapp",
        isInternalNote,
        attachments,
      };

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== conversationId) return conv;
          newMsg.channelType = conv.channelType;

          if (isInternalNote) {
            const noteObj = {
              id: `note-${Date.now()}`,
              author: activeCustomer.ownerName || "Support Agent",
              content,
              createdAt: timeStr,
            };
            return {
              ...conv,
              internalNotes: [...(conv.internalNotes || []), noteObj],
            };
          }

          return {
            ...conv,
            lastMessage: content,
            lastMessageTime: timeStr,
            lastMessageSender: "agent",
            unreadCount: 0,
            messages: [...conv.messages, newMsg],
          };
        })
      );

      return newMsg;
    },
    [activeCustomer.ownerName]
  );

  const markConversationStatus = useCallback(
    (conversationId: string, status: "open" | "resolved") => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, status, unreadCount: status === "resolved" ? 0 : c.unreadCount }
            : c
        )
      );
      toast({
        title: status === "resolved" ? "Conversation Resolved" : "Conversation Reopened",
        message: `Conversation marked as ${status}.`,
        type: "info",
      });
    },
    [toast]
  );

  const assignConversation = useCallback(
    (conversationId: string, agentName: string, agentId?: string) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, assignedToName: agentName, assignedTo: agentId || c.assignedTo } : c
        )
      );
      toast({
        title: "Conversation Assigned",
        message: `Assigned to ${agentName}.`,
        type: "success",
      });
    },
    [toast]
  );

  const addTagToConversation = useCallback((conversationId: string, tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        if (c.tags.includes(trimmed)) return c;
        return { ...c, tags: [...c.tags, trimmed] };
      })
    );
  }, []);

  const removeTagFromConversation = useCallback((conversationId: string, tag: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        return { ...c, tags: c.tags.filter((t) => t !== tag) };
      })
    );
  }, []);

  const addInternalNote = useCallback(
    (conversationId: string, note: string, author?: string) => {
      const trimmed = note.trim();
      if (!trimmed) return;
      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const noteObj = {
        id: `note-${Date.now()}`,
        author: author || activeCustomer.ownerName || "Support Team",
        content: trimmed,
        createdAt: timeStr,
      };
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;
          return {
            ...c,
            internalNotes: [...(c.internalNotes || []), noteObj],
          };
        })
      );
      toast({
        title: "Note Added",
        message: "Internal note saved to conversation.",
        type: "success",
      });
    },
    [activeCustomer.ownerName, toast]
  );

  const addSavedReply = useCallback(
    (reply: Omit<SavedReply, "id">): SavedReply => {
      const newReply: SavedReply = {
        ...reply,
        id: `reply-${Date.now()}`,
        customerId: reply.customerId || activeCustomerId,
      };
      setSavedReplies((prev) => [newReply, ...prev]);
      toast({
        title: "Saved Reply Added",
        message: `Shortcut "${newReply.shortcut}" is ready to use.`,
        type: "success",
      });
      return newReply;
    },
    [activeCustomerId, toast]
  );

  const deleteSavedReply = useCallback(
    (id: string) => {
      setSavedReplies((prev) => prev.filter((r) => r.id !== id));
      toast({
        title: "Reply Deleted",
        message: "Saved response removed.",
        type: "info",
      });
    },
    [toast]
  );

  const addTeamMember = useCallback(
    (member: Omit<TeamMember, "id" | "activeChats">): TeamMember => {
      const newMember: TeamMember = {
        ...member,
        id: `team-${Date.now()}`,
        customerId: member.customerId || activeCustomerId,
        activeChats: 0,
      };
      setTeamMembers((prev) => [...prev, newMember]);
      toast({
        title: "Team Member Added",
        message: `${newMember.name} has been added.`,
        type: "success",
      });
      return newMember;
    },
    [activeCustomerId, toast]
  );

  const updateTeamMemberStatus = useCallback((id: string, status: TeamMember["status"]) => {
    setTeamMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  }, []);

  // Broadcast Actions (SaleSmartly inspired)
  const createBroadcastCampaign = useCallback(
    (
      campaignData: Omit<
        BroadcastCampaign,
        "id" | "createdDate" | "sent" | "delivered" | "read" | "failed" | "queued" | "deliveryRate" | "timeline"
      >
    ): BroadcastCampaign => {
      const nowStr = new Date().toISOString();
      const isNow = campaignData.deliveryType === "now";
      const target = campaignData.targetCount || 100;

      const initialChannelStats: Partial<
        Record<SocialChannelType, { sent: number; delivered: number; read: number; failed: number }>
      > = {};
      const chCount = campaignData.channels.length || 1;
      campaignData.channels.forEach((ch) => {
        const share = Math.round(target / chCount);
        initialChannelStats[ch] = isNow
          ? {
              sent: Math.round(share * 0.4),
              delivered: Math.round(share * 0.38),
              read: Math.round(share * 0.25),
              failed: Math.round(share * 0.02),
            }
          : { sent: 0, delivered: 0, read: 0, failed: 0 };
      });

      const initialSent = isNow ? Math.round(target * 0.4) : 0;
      const initialDelivered = isNow ? Math.round(target * 0.38) : 0;
      const initialRead = isNow ? Math.round(target * 0.25) : 0;
      const initialFailed = isNow ? Math.round(target * 0.02) : 0;
      const initialQueued = isNow ? target - initialSent : target;
      const initialRate = initialSent > 0 ? Number(((initialDelivered / initialSent) * 100).toFixed(1)) : 0;

      const newCampaign: BroadcastCampaign = {
        ...campaignData,
        id: `bc-${Date.now().toString().slice(-4)}`,
        customerId: campaignData.customerId || activeCustomerId,
        customerName: campaignData.customerName || activeCustomer.businessName,
        status: isNow ? "sending" : "scheduled",
        createdDate: nowStr,
        startedDate: isNow ? nowStr : undefined,
        sent: initialSent,
        delivered: initialDelivered,
        read: initialRead,
        failed: initialFailed,
        queued: initialQueued,
        deliveryRate: initialRate,
        channelStats: initialChannelStats,
        timeline: [
          {
            id: `evt-${Date.now()}-1`,
            timestamp: "Just now",
            event: isNow ? "Broadcast Dispatched" : "Broadcast Scheduled",
            details: isNow
              ? `Dispatching to ${target.toLocaleString()} recipients across ${campaignData.channels.join(", ")}.`
              : `Scheduled for auto-dispatch at ${campaignData.scheduledTime || "selected time"}.`,
            type: "info",
          },
        ],
      };

      setBroadcastCampaigns((prev) => {
        const updated = [newCampaign, ...prev];
        try {
          localStorage.setItem("smsunmukt_broadcast_campaigns", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      toast({
        title: isNow ? "Broadcast Launched!" : "Campaign Scheduled!",
        message: `'${campaignData.campaignName}' is queued for ${target.toLocaleString()} contacts.`,
        type: "success",
      });

      return newCampaign;
    },
    [activeCustomerId, activeCustomer.businessName, toast]
  );

  const pauseBroadcastCampaign = useCallback(
    (id: string) => {
      setBroadcastCampaigns((prev) => {
        const updated = prev.map((c) => {
          if (c.id !== id) return c;
          const newStatus: BroadcastStatus = "paused";
          return {
            ...c,
            status: newStatus,
            timeline: [
              {
                id: `evt-${Date.now()}`,
                timestamp: "Just now",
                event: "Campaign Paused",
                details: "Live dispatch throttled and paused by user.",
                type: "warning" as const,
              },
              ...c.timeline,
            ],
          };
        });
        try {
          localStorage.setItem("smsunmukt_broadcast_campaigns", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      toast({
        title: "Broadcast Paused",
        message: "Message dispatching paused. You can resume at any time.",
        type: "info",
      });
    },
    [toast]
  );

  const resumeBroadcastCampaign = useCallback(
    (id: string) => {
      setBroadcastCampaigns((prev) => {
        const updated = prev.map((c) => {
          if (c.id !== id) return c;
          const newStatus: BroadcastStatus = "sending";
          return {
            ...c,
            status: newStatus,
            timeline: [
              {
                id: `evt-${Date.now()}`,
                timestamp: "Just now",
                event: "Campaign Resumed",
                details: "Live dispatch queue resumed.",
                type: "info" as const,
              },
              ...c.timeline,
            ],
          };
        });
        try {
          localStorage.setItem("smsunmukt_broadcast_campaigns", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      toast({
        title: "Broadcast Resumed",
        message: "Message queue is active and sending.",
        type: "success",
      });
    },
    [toast]
  );

  const deleteBroadcastCampaign = useCallback(
    (id: string) => {
      setBroadcastCampaigns((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        try {
          localStorage.setItem("smsunmukt_broadcast_campaigns", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      toast({
        title: "Broadcast Removed",
        message: "Campaign and delivery metrics deleted.",
        type: "info",
      });
    },
    [toast]
  );

  const duplicateBroadcastCampaign = useCallback(
    (id: string): BroadcastCampaign => {
      const orig = broadcastCampaigns.find((c) => c.id === id);
      const newCampaign: BroadcastCampaign = orig
        ? {
            ...orig,
            id: `bc-${Date.now().toString().slice(-4)}`,
            campaignName: `${orig.campaignName} (Copy)`,
            status: "draft",
            sent: 0,
            delivered: 0,
            read: 0,
            failed: 0,
            queued: orig.targetCount,
            deliveryRate: 0,
            createdDate: new Date().toISOString(),
            timeline: [
              {
                id: `evt-${Date.now()}`,
                timestamp: "Just now",
                event: "Draft Duplicated",
                details: `Duplicated from campaign ${orig.campaignName}.`,
                type: "info",
              },
            ],
          }
        : {
            id: `bc-${Date.now().toString().slice(-4)}`,
            customerId: activeCustomerId,
            customerName: activeCustomer.businessName,
            campaignName: "Duplicated Broadcast",
            channels: ["whatsapp"],
            selectedChannelIds: ["chan-01"],
            audienceType: "all",
            targetCount: 100,
            excludedCount: 0,
            messageContent: "New broadcast message",
            deliveryType: "now",
            sendingSpeed: "normal",
            batchSize: 50,
            batchIntervalSeconds: 10,
            respect24hWindow: false,
            status: "draft",
            sent: 0,
            delivered: 0,
            read: 0,
            failed: 0,
            queued: 100,
            deliveryRate: 0,
            createdDate: new Date().toISOString(),
            timeline: [],
          };

      setBroadcastCampaigns((prev) => {
        const updated = [newCampaign, ...prev];
        try {
          localStorage.setItem("smsunmukt_broadcast_campaigns", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      toast({
        title: "Broadcast Duplicated",
        message: `'${newCampaign.campaignName}' is ready to review.`,
        type: "success",
      });

      return newCampaign;
    },
    [broadcastCampaigns, activeCustomerId, activeCustomer.businessName, toast]
  );

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
    setConnectedChannels(INITIAL_CONNECTED_CHANNELS);
    setConversations(INITIAL_CONVERSATIONS);
    setSavedReplies(INITIAL_SAVED_REPLIES);
    setTeamMembers(INITIAL_TEAM_MEMBERS);
    setBroadcastCampaigns(INITIAL_BROADCAST_CAMPAIGNS);
    setActiveCustomerId("cust-01");
    refreshFromDatabase();
    toast({
      title: "Data Reset",
      message: "Restored seed state from PostgreSQL database.",
      type: "info",
    });
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
        connectedChannels,
        conversations,
        savedReplies,
        teamMembers,
        broadcastCampaigns,
        connectChannel,
        disconnectChannel,
        reconnectChannel,
        sendConversationMessage,
        markConversationStatus,
        assignConversation,
        addTagToConversation,
        removeTagFromConversation,
        addInternalNote,
        addSavedReply,
        deleteSavedReply,
        addTeamMember,
        updateTeamMemberStatus,
        createBroadcastCampaign,
        pauseBroadcastCampaign,
        resumeBroadcastCampaign,
        deleteBroadcastCampaign,
        duplicateBroadcastCampaign,
        activeCustomerId,
        activeCustomer,
        clientWalletBalance,
        switchActiveCustomer,
        exitImpersonation,
        refreshFromDatabase,
        isDbConnected,
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

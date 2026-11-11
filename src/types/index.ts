export type Role = "super_admin" | "client";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: Role;
  businessName?: string;
  category?: string;
  phone?: string;
  avatar?: string;
  token?: string;
}

export type Channel = "sms" | "whatsapp";
export type SMSType = "promotional" | "transactional" | "otp";
export type WhatsAppType = "marketing" | "utility" | "authentication";
export type MessageStatus = "delivered" | "failed" | "pending" | "submitted";
export type CampaignStatus = "completed" | "processing" | "scheduled" | "draft" | "failed";
export type AccountStatus = "active" | "suspended" | "pending_verification";

export interface Customer {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  mobile: string;
  businessCategory: string;
  walletBalance: number;
  totalMessages: number;
  accountStatus: AccountStatus;
  registrationDate: string;
  city: string;
  state: string;
  gstin?: string;
  dltEntityId?: string;
}

export interface Agency {
  id: string;
  agencyName: string;
  ownerName: string;
  email: string;
  mobile: string;
  clientsManaged: number;
  walletBalance: number;
  customPricing: {
    smsPromo: number;
    smsTrans: number;
    whatsappMarketing: number;
  };
  accountStatus: AccountStatus;
  joinedDate: string;
  managedClientIds: string[];
}

export interface Campaign {
  id: string;
  campaignName: string;
  customerId: string;
  customerName: string;
  channel: Channel;
  messageType: SMSType | WhatsAppType;
  totalRecipients: number;
  delivered: number;
  failed: number;
  pending: number;
  cost: number;
  status: CampaignStatus;
  createdDate: string;
  scheduledDate?: string;
  messageContent: string;
  senderId?: string;
  templateId?: string;
  templateName?: string;
  mediaUrl?: string;
}

export interface MessageLog {
  id: string;
  customerId: string;
  customerName: string;
  channel: Channel;
  type: string;
  recipient: string;
  senderId: string;
  route: string;
  cost: number;
  supplierCost: number;
  status: MessageStatus;
  timestamp: string;
  errorCode?: string;
}

export interface Supplier {
  id: string;
  name: string;
  channel: Channel | "both";
  connectionStatus: "connected" | "degraded" | "offline";
  costPerMessage: {
    smsPromo: number;
    smsTrans: number;
    whatsappMarketing?: number;
    whatsappUtility?: number;
  };
  messageVolume: number;
  successRate: number;
  failedMessages: number;
  apiEndpoint: string;
  tps: number; // Transactions per second
}

export interface RoutingRule {
  id: string;
  name: string;
  channel: Channel;
  messageType: string;
  supplierId: string;
  supplierName: string;
  priority: number;
  cost: number;
  status: "active" | "inactive";
  fallbackSupplierId?: string;
  condition: string;
}

export type TransactionType =
  | "recharge"
  | "sms_deduction"
  | "whatsapp_deduction"
  | "refund"
  | "manual_credit"
  | "manual_debit";

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  type: TransactionType;
  amount: number;
  previousBalance: number;
  newBalance: number;
  reference: string;
  date: string;
  channel?: Channel;
  paymentMethod?: "UPI" | "Net Banking" | "Credit Card" | "Debit Card" | "System Adjustment";
}

export interface PricingConfig {
  channel: Channel;
  type: string;
  supplierCost: number;
  sellingPrice: number;
  grossContribution: number;
  marginPercent: number;
  description: string;
}

export interface Template {
  id: string;
  name: string;
  channel: Channel;
  category: "promotional" | "transactional" | "marketing" | "utility" | "authentication";
  language: string;
  approvalStatus: "approved" | "pending" | "rejected";
  createdDate: string;
  content: string;
  senderId?: string;
  dltTemplateId?: string;
  metaTemplateId?: string;
  buttons?: { label: string; url?: string; phone?: string; type: "URL" | "PHONE" | "QUICK_REPLY" }[];
  mediaType?: "IMAGE" | "DOCUMENT" | "VIDEO" | "NONE";
}

export interface Contact {
  id: string;
  name: string;
  mobile: string;
  email: string;
  group: string;
  tags: string[];
  smsConsent: boolean;
  whatsappConsent: boolean;
  dateAdded: string;
}

export interface ContactGroup {
  id: string;
  name: string;
  contactCount: number;
  description: string;
  createdDate: string;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  category: "DLT Approval" | "WhatsApp Template" | "Wallet/Billing" | "Delivery Issue" | "Technical" | "General";
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdDate: string;
  updatedDate: string;
  messages: {
    sender: "customer" | "support";
    senderName: string;
    message: string;
    timestamp: string;
  }[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  businessName: string;
  ownerName: string;
  gstin: string;
  billingAddress: string;
  amount: number;
  gst: number; // 18% GST (CGST 9% + SGST 9%)
  totalAmount: number;
  paymentStatus: "paid" | "pending";
  invoiceDate: string;
  description: string;
  transactionReference: string;
}

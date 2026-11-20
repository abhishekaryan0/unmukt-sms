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
  isImpersonated?: boolean;
  impersonatedBy?: string;
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
  customerId?: string;
  name: string;
  mobile: string;
  email: string;
  group: string;
  tags: string[];
  smsConsent: boolean;
  whatsappConsent: boolean;
  dateAdded: string;
  isDnd?: boolean;
}

export interface ContactGroup {
  id: string;
  customerId?: string;
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

export interface SenderHeader {
  id: string;
  customerId: string;
  customerName: string;
  header: string; // 6-character alpha header, e.g. SHRFSH, GUPTAE
  category: "promotional" | "transactional";
  dltEntityId: string;
  dltOperator: string;
  operator?: string;
  description?: string;
  status: "approved" | "pending" | "rejected";
  createdDate: string;
}

export interface WhatsAppProfile {
  displayName: string;
  phoneNumber: string;
  qualityRating: "High" | "Medium" | "Low";
  messagingTier: string;
  tierLimit?: string;
  verifiedBadge: boolean;
  webhookStatus: "active" | "degraded";
  wabaId?: string;
  about: string;
  category: string;
}

// -------------------------------------------------------------
// Social Media Messaging Platform Types
// -------------------------------------------------------------

export type SocialChannelType = "whatsapp" | "messenger" | "instagram" | "telegram";

export type ChannelConnectionStatus = "connected" | "disconnected" | "reconnect_required" | "syncing";

export interface ConnectedChannel {
  id: string;
  customerId?: string;
  channelType: SocialChannelType;
  name: string;
  identifier: string; // Phone number, handle, or page name
  status: ChannelConnectionStatus;
  connectedAt: string;
  lastSyncAt: string;
  avatarUrl?: string;
  unreadCount: number;
  totalConversations: number;
  webhookStatus: "healthy" | "delayed" | "failing";
  autoReplyEnabled?: boolean;
}

export interface ChatAttachment {
  type: "image" | "file";
  url: string;
  name: string;
  size?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: "customer" | "agent" | "system";
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read" | "failed";
  channelType: SocialChannelType;
  isInternalNote?: boolean;
  attachments?: ChatAttachment[];
}

export interface ConversationInternalNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  customerId?: string;
  channelType: SocialChannelType;
  channelId: string;
  customerName: string;
  customerAvatar?: string;
  customerIdentifier: string; // e.g. "+91 98112 34567" or "@rohan_v"
  customerEmail?: string;
  customerCity?: string;
  status: "open" | "unread" | "resolved";
  priority: "low" | "medium" | "high";
  assignedTo?: string; // Team member ID
  assignedToName?: string; // Team member Name
  tags: string[];
  lastMessage: string;
  lastMessageTime: string;
  lastMessageSender: "customer" | "agent" | "system";
  unreadCount: number;
  internalNotes?: ConversationInternalNote[];
  messages: ChatMessage[];
  createdAt: string;
}

export interface SavedReply {
  id: string;
  customerId?: string;
  title: string;
  shortcut: string; // e.g. "/greet", "/hours"
  content: string;
  category: "Greeting" | "Support" | "Billing" | "Sales" | "FAQ";
}

export interface TeamMember {
  id: string;
  customerId?: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "agent";
  status: "online" | "away" | "offline";
  avatar?: string;
  activeChats: number;
  channels: SocialChannelType[];
}

// -------------------------------------------------------------
// Social Media Broadcast / Campaign Types (SaleSmartly-style)
// -------------------------------------------------------------

export type BroadcastStatus = "draft" | "scheduled" | "sending" | "completed" | "paused" | "failed";

export interface BroadcastTimelineEvent {
  id: string;
  timestamp: string;
  event: string;
  details: string;
  type: "info" | "success" | "warning" | "error";
}

export interface BroadcastChannelStats {
  sent: number;
  delivered: number;
  read: number;
  failed: number;
}

export interface BroadcastCampaign {
  id: string;
  customerId: string;
  customerName?: string;
  campaignName: string;
  description?: string;
  channels: SocialChannelType[];
  selectedChannelIds: string[];
  audienceType: "all" | "filtered" | "manual";
  targetCount: number;
  excludedCount: number;
  audienceFilter?: {
    tags: string[];
    groups: string[];
    channels: SocialChannelType[];
    customerStatus: string[];
    excludeUnsubscribed: boolean;
    excludeOutside24hWindow: boolean;
  };
  selectedContactIds?: string[];
  messageContent: string;
  fallbackValues?: Record<string, string>;
  attachments?: {
    type: "image" | "file";
    url: string;
    name: string;
    size?: string;
  }[];
  deliveryType: "now" | "scheduled";
  scheduledTime?: string;
  sendingSpeed: "safe" | "normal" | "fast";
  batchIntervalSeconds: number;
  batchSize: number;
  respect24hWindow: boolean;
  status: BroadcastStatus;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  queued: number;
  deliveryRate: number; // percentage, e.g. 98.4
  createdDate: string;
  startedDate?: string;
  completedDate?: string;
  channelStats?: Partial<Record<SocialChannelType, BroadcastChannelStats>>;
  timeline: BroadcastTimelineEvent[];
}


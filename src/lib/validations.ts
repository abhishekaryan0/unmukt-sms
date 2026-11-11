import { z } from "zod";

/**
 * Validate 10-digit Indian Mobile number (starts with 6-9)
 */
export const indianMobileRegex = /^[6-9]\d{9}$/;

export const loginSchema = z.object({
  email: z.string().min(1, "Email or phone number is required").max(100),
  password: z.string().min(1, "Password is required").max(100),
  portal: z.enum(["admin", "client"]).default("client"),
});

export const customerOnboardSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters").max(100),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters").max(100),
  email: z.string().email("Valid email address required"),
  mobile: z.string().refine((val) => {
    const clean = val.replace(/\D/g, "").slice(-10);
    return indianMobileRegex.test(clean);
  }, "Enter a valid 10-digit Indian mobile number"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  businessCategory: z.string().default("Retail & Apparel"),
  city: z.string().max(50).default("Mumbai"),
  state: z.string().max(50).default("Maharashtra"),
  gstin: z.string().max(15).optional(),
  dltEntityId: z.string().max(30).optional(),
  initialWallet: z.union([z.number(), z.string()]).transform((v) => Math.max(0, parseFloat(String(v)) || 0)),
});

export const campaignSchema = z.object({
  campaignName: z.string().min(2, "Campaign name required").max(100),
  channel: z.enum(["sms", "whatsapp"]),
  messageType: z.string().min(2),
  totalRecipients: z.number().int().positive("Recipients count must be positive"),
  cost: z.number().nonnegative("Cost cannot be negative"),
  messageContent: z.string().min(1, "Message content cannot be empty").max(2000),
  senderId: z.string().optional(),
  templateId: z.string().optional(),
  templateName: z.string().optional(),
  mediaUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["completed", "scheduled", "draft"]).default("completed"),
  scheduledDate: z.string().optional(),
  customerId: z.string().optional(),
  idempotencyKey: z.string().max(100).optional(),
});

export const rechargeSchema = z.object({
  amount: z.number().min(100, "Minimum recharge amount is ₹100").max(1000000, "Maximum recharge is ₹10,00,000"),
  paymentMethod: z.enum(["UPI", "Net Banking", "Credit Card", "Debit Card"]).default("UPI"),
  customerId: z.string().optional(),
  idempotencyKey: z.string().max(100).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Contact name required").max(100),
  mobile: z.string().refine((val) => {
    const clean = val.replace(/\D/g, "").slice(-10);
    return indianMobileRegex.test(clean);
  }, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email().optional().or(z.literal("")),
  group: z.string().default("Regular Customers"),
  tags: z.array(z.string()).default([]),
  smsConsent: z.boolean().default(true),
  whatsappConsent: z.boolean().default(true),
  isDnd: z.boolean().default(false),
});

export const routingRuleSchema = z.object({
  name: z.string().min(2, "Rule name required").max(100),
  channel: z.enum(["sms", "whatsapp"]),
  messageType: z.string().min(2),
  primarySupplier: z.string().min(2),
  fallbackSupplier: z.string().min(2),
  priority: z.number().int().min(1).max(10).default(1),
  ratePerMsg: z.number().nonnegative().default(0.2),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const pricingConfigSchema = z.object({
  type: z.string().min(2),
  sellingPrice: z.number().positive("Selling price must be greater than zero"),
});

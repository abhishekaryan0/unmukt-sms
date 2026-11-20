"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { formatINR, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  CreditCard,
  Sparkles,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Zap,
  ArrowRight,
  Download,
  AlertCircle,
  Clock,
  Radio,
  Users,
  MessageSquare,
  ChevronRight,
  Check,
} from "lucide-react";

export default function SubscriptionPage() {
  const { connectedChannels, teamMembers, invoices, activeCustomer } = useAppStore();
  const { toast } = useToast();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [currentTier, setCurrentTier] = useState<"starter" | "pro" | "enterprise">("pro");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<"starter" | "pro" | "enterprise">("enterprise");

  // Usage stats
  const activeChannelsCount = connectedChannels.filter((c) => c.status === "connected").length;
  const channelLimit = currentTier === "starter" ? 2 : currentTier === "pro" ? 5 : 999;
  const teamSeatsCount = teamMembers.length;
  const seatLimit = currentTier === "starter" ? 2 : currentTier === "pro" ? 5 : 999;

  const plans = [
    {
      id: "starter",
      name: "Starter",
      tagline: "For small retailers and individual shop owners starting social commerce.",
      monthlyPrice: 1499,
      annualPrice: 14990,
      channels: "Up to 2 Social Channels",
      seats: "2 Team Member Seats",
      conversations: "5,000 inquiries / month",
      features: [
        "WhatsApp Business API Cloud",
        "Instagram Direct Messaging",
        "Standard Unified Inbox (3-pane)",
        "Quick Canned Responses",
        "Standard Email Support (24h SLA)",
      ],
    },
    {
      id: "pro",
      name: "Professional",
      popular: true,
      tagline: "For growing Indian brands scaling multi-channel customer sales and care.",
      monthlyPrice: 3499,
      annualPrice: 34990,
      channels: "Up to 5 Social Channels",
      seats: "5 Team Member Seats",
      conversations: "Unlimited Monthly Inquiries",
      features: [
        "WhatsApp Business + Instagram + Messenger + Telegram",
        "Unlimited Customer Conversations",
        "Real-Time Team Assignment & Routing",
        "Private Internal Team Notes",
        "Saved Canned Replies & Slash Shortcuts",
        "Conversation Tagging & Customer CRM",
        "Priority 24/7 SLA Support (< 15 mins)",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise & Agency",
      tagline: "For high-volume retail chains, multi-brand agencies and D2C enterprises.",
      monthlyPrice: 7999,
      annualPrice: 79990,
      channels: "Unlimited Social Channels",
      seats: "Unlimited Team Seats",
      conversations: "Unlimited Volume & High TPS",
      features: [
        "Unlimited Connected Accounts across all channels",
        "Unlimited Agent & Manager Seats",
        "Multi-Tenant Agency Dashboard",
        "Dedicated Account Success Manager",
        "Custom API Webhooks & Webhook Re-dispatch",
        "99.99% Guaranteed Handshake Uptime",
        "Custom Onboarding & Agent Training",
      ],
    },
  ];

  const handlePlanChange = (planId: "starter" | "pro" | "enterprise") => {
    setSelectedUpgradePlan(planId);
    setShowUpgradeModal(true);
  };

  const confirmPlanChange = () => {
    setCurrentTier(selectedUpgradePlan);
    setShowUpgradeModal(false);
    toast({
      title: "Subscription Updated",
      message: `Your account has been switched to ${
        selectedUpgradePlan === "pro"
          ? "Professional"
          : selectedUpgradePlan === "enterprise"
          ? "Enterprise"
          : "Starter"
      } plan (${billingCycle}).`,
      type: "success",
    });
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <CreditCard className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Subscription & Plans
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Manage your social messaging platform subscription tier, team seats, and invoices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-subtle">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Pro Plan • Active</span>
            </span>
          </div>
        </div>

        {/* Active Plan Summary Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  Current Active Plan
                </span>
                <span className="text-xs text-slate-400 font-medium">• Auto-renews on Dec 12, 2026</span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-2">
                {currentTier === "pro"
                  ? "Professional Plan"
                  : currentTier === "enterprise"
                  ? "Enterprise Plan"
                  : "Starter Plan"}
              </h2>

              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                Unlimited customer conversations across WhatsApp, Instagram, Messenger, and Telegram with team collaboration and canned replies.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-slate-600">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Billed Amount</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {billingCycle === "monthly" ? "₹3,499 / month" : "₹34,990 / year"}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Payment Method</span>
                  <span className="font-medium text-slate-900 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                    <span>Visa ending in 4242</span>
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Next Invoice</span>
                  <span className="font-medium text-slate-900">Dec 12, 2026</span>
                </div>
              </div>
            </div>

            {/* Plan Usage Progress Meters */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 w-full lg:w-80 space-y-3.5 shrink-0">
              <div className="text-xs font-bold text-slate-900">Plan Allocation Usage</div>

              {/* Channels Meter */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Connected Channels</span>
                  <span className="font-bold text-slate-900">
                    {activeChannelsCount} / {channelLimit === 999 ? "∞" : channelLimit}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${Math.min(100, (activeChannelsCount / (channelLimit === 999 ? 10 : channelLimit)) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Seats Meter */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Team Member Seats</span>
                  <span className="font-bold text-slate-900">
                    {teamSeatsCount} / {seatLimit === 999 ? "∞" : seatLimit}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (teamSeatsCount / (seatLimit === 999 ? 10 : seatLimit)) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Conversations Meter */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Monthly Inquiries</span>
                  <span className="font-bold text-emerald-600 font-semibold">Unlimited</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans Comparison Grid */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Available Subscription Plans</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Switch plans anytime as your customer conversation volume grows.
              </p>
            </div>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  billingCycle === "monthly"
                    ? "bg-white text-slate-900 shadow-subtle"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  billingCycle === "annual"
                    ? "bg-white text-slate-900 shadow-subtle"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Annual Billing</span>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan) => {
              const isCurrent = currentTier === plan.id;
              const price = billingCycle === "monthly" ? plan.monthlyPrice : Math.round(plan.annualPrice / 12);

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                    isCurrent
                      ? "border-blue-600 shadow-md ring-1 ring-blue-600"
                      : plan.popular
                      ? "border-slate-300 shadow-subtle"
                      : "border-slate-200/90 shadow-subtle"
                  }`}
                >
                  <div>
                    {plan.popular && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 mb-3">
                        Most Popular
                      </span>
                    )}

                    <div className="flex items-baseline justify-between">
                      <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                      {isCurrent && (
                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Active Plan
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mt-1 min-h-[2.5rem] leading-relaxed">
                      {plan.tagline}
                    </p>

                    <div className="my-5 pb-5 border-b border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-slate-900">
                          ₹{price.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">/ month</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        {billingCycle === "annual"
                          ? `Billed annually at ₹${plan.annualPrice.toLocaleString()} + GST`
                          : "Billed monthly + 18% GST"}
                      </span>
                    </div>

                    {/* Features list */}
                    <div className="space-y-2.5 text-xs text-slate-700">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <Radio className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{plan.channels}</span>
                      </div>
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{plan.seats}</span>
                      </div>
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{plan.conversations}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        {plan.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-slate-600">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    {isCurrent ? (
                      <Button
                        variant="outline"
                        disabled
                        className="w-full text-xs font-semibold bg-slate-50 border-slate-200 text-slate-500"
                      >
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handlePlanChange(plan.id as any)}
                        className={`w-full text-xs font-semibold ${
                          plan.id === "enterprise"
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-subtle"
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                      >
                        {plan.id === "enterprise" ? "Upgrade to Enterprise" : "Switch to Starter"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoices & Receipts History */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Subscription Invoices</h3>
              <p className="text-xs text-slate-500">Download GST tax receipts for tax and accounting</p>
            </div>
            <Link href="/invoices" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              View all invoices →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {invoices.slice(0, 4).map((inv) => (
              <div
                key={inv.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/60 transition-colors text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{inv.invoiceNumber}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Professional Plan Monthly Subscription • {inv.invoiceDate}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{formatINR(inv.totalAmount)}</div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Paid
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      toast({
                        title: "Receipt Downloaded",
                        message: `Tax Invoice ${inv.invoiceNumber} PDF downloaded.`,
                        type: "success",
                      });
                    }}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Download Receipt"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plan Upgrade / Switch Confirmation Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Confirm Plan Change"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              You are switching your workspace subscription to the{" "}
              <strong>
                {selectedUpgradePlan === "enterprise"
                  ? "Enterprise & Agency Plan"
                  : selectedUpgradePlan === "pro"
                  ? "Professional Plan"
                  : "Starter Plan"}
              </strong>{" "}
              billed {billingCycle}.
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">New Plan:</span>
              <span className="font-bold text-slate-900 capitalize">{selectedUpgradePlan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Billing Cycle:</span>
              <span className="font-bold text-slate-900 capitalize">{billingCycle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Card:</span>
              <span className="font-bold text-slate-900">Visa ending in 4242</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
              <span>Immediate Charge:</span>
              <span>
                {selectedUpgradePlan === "enterprise"
                  ? "₹7,999 + GST"
                  : selectedUpgradePlan === "pro"
                  ? "₹3,499 + GST"
                  : "₹1,499 + GST"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>
              Cancel
            </Button>
            <Button onClick={confirmPlanChange} className="bg-blue-600 hover:bg-blue-700 text-white">
              Confirm & Switch Plan
            </Button>
          </div>
        </div>
      </Modal>
    </ClientLayout>
  );
}

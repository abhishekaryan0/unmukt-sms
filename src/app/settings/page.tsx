"use client";

import React, { useState } from "react";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useToast } from "@/components/ui/ToastContext";
import { useAppStore } from "@/lib/store";
import { DEMO_CLIENT } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  Building2,
  User,
  ShieldCheck,
  Bell,
  Lock,
  CheckCircle2,
  Store,
  MessageCircle,
  Copy,
  Check,
  Palette,
  Sun,
  Moon,
  Laptop,
  Radio,
  Sparkles,
  Volume2,
} from "lucide-react";

export default function ClientSettingsPage() {
  const { toast } = useToast();
  const { activeCustomer, whatsappProfile, connectedChannels } = useAppStore();

  // Business identity state
  const [businessName, setBusinessName] = useState(
    activeCustomer?.businessName || DEMO_CLIENT.user.businessName
  );
  const [category, setCategory] = useState(
    activeCustomer?.businessCategory || DEMO_CLIENT.user.category
  );
  const [gstin, setGstin] = useState(activeCustomer?.gstin || "07AAAAA0000A1Z5");
  const [address, setAddress] = useState(
    "Shop 14, Main Cloth Market, Chandni Chowk, Central Delhi - 110006"
  );

  // Owner contact state
  const [ownerName, setOwnerName] = useState(
    activeCustomer?.ownerName || DEMO_CLIENT.user.name
  );
  const [ownerEmail, setOwnerEmail] = useState(
    activeCustomer?.email || DEMO_CLIENT.email
  );
  const [ownerMobile, setOwnerMobile] = useState(
    activeCustomer?.mobile || "9811234567"
  );

  // Notification preferences
  const [chatSoundAlert, setChatSoundAlert] = useState(true);
  const [assignmentAlert, setAssignmentAlert] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);

  // Password state
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // Webhook copied state
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const webhookUrl = "https://unmukt.social/api/webhooks/social";
  const webhookToken = "unmukt_meta_verify_token_9812";

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
    toast({
      title: "Webhook Copied",
      message: "Callback URL copied to clipboard.",
      type: "success",
    });
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(webhookToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
    toast({
      title: "Verify Token Copied",
      message: "Webhook token copied to clipboard.",
      type: "success",
    });
  };

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings Saved",
      message: "Company details and preferences updated successfully.",
      type: "success",
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass) {
      toast({
        title: "Current Password Required",
        message: "Please enter your current password.",
        type: "error",
      });
      return;
    }

    if (!newPass || newPass.length < 6) {
      toast({
        title: "Password Too Short",
        message: "New password must be at least 6 characters.",
        type: "error",
      });
      return;
    }

    if (newPass !== confirmPass) {
      toast({
        title: "Passwords Do Not Match",
        message: "Please ensure your new passwords match.",
        type: "error",
      });
      return;
    }

    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
    toast({
      title: "Password Updated",
      message: "Your login password has been changed securely.",
      type: "success",
    });
  };

  return (
    <ClientLayout>
      <div className="space-y-6 max-w-6xl mx-auto pb-16">
        {/* Header */}
        <div className="pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Workspace & Account Settings
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Settings Hub
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your company profile, appearance theme, social channels, and notification alerts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. APPEARANCE & THEME CARD */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-card space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Appearance & Platform Theme
                    </h2>
                    <p className="text-xs text-slate-500">
                      Choose between light and dark modes across your unified messaging workspace.
                    </p>
                  </div>
                </div>

                <ThemeToggle variant="pill" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Light Mode Preview */}
                <div
                  onClick={() => {
                    const el = document.documentElement;
                    el.classList.remove("dark");
                    localStorage.setItem("unmukt_theme", "light");
                    window.dispatchEvent(new CustomEvent("unmukt_theme_changed", { detail: "light" }));
                  }}
                  className="p-3.5 rounded-xl border-2 border-blue-500 bg-white shadow-sm cursor-pointer hover:border-blue-600 transition-all flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-500">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Light Theme</span>
                      <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.2 rounded">
                        Active
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Crisp white surfaces with slate contrast, optimized for daylight work.
                    </p>
                  </div>
                </div>

                {/* Dark Mode Preview */}
                <div
                  onClick={() => {
                    const el = document.documentElement;
                    el.classList.add("dark");
                    localStorage.setItem("unmukt_theme", "dark");
                    window.dispatchEvent(new CustomEvent("unmukt_theme_changed", { detail: "dark" }));
                  }}
                  className="p-3.5 rounded-xl border border-slate-700 bg-slate-900 text-white shadow-sm cursor-pointer hover:border-slate-500 transition-all flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-slate-800 text-blue-400">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Dark Theme</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Deep midnight navy surfaces that reduce eye fatigue during late-night shifts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. BUSINESS PROFILE & INVOICING DETAILS */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Business Profile & Tax Information
                  </h2>
                  <p className="text-xs text-slate-500">
                    Your company identification and billing address used on tax invoices
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveBusiness} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Business / Store Name *
                    </label>
                    <Input
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Sharma Fashion Store"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Industry Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    >
                      <option value="Retail & Apparel">Retail & Apparel</option>
                      <option value="Consumer Electronics">Consumer Electronics</option>
                      <option value="Jewellery & Gems">Jewellery & Gems</option>
                      <option value="Healthcare & Labs">Healthcare & Labs</option>
                      <option value="Education & EdTech">Education & EdTech</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Hospitality & Dining">Hospitality & Dining</option>
                      <option value="Financial Services">Financial Services</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Goods & Services Tax Identification Number (GSTIN)
                    </label>
                    <Input
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      placeholder="07AAAAA0000A1Z5"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Used for generating valid GST input credit receipts
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Registered Owner Name
                    </label>
                    <Input
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Rajesh Sharma"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registered Billing & Store Address
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" size="sm" className="bg-slate-900 text-white">
                    Save Business Details
                  </Button>
                </div>
              </form>
            </div>

            {/* 3. SOCIAL WEBHOOKS & META CLOUD API CONFIG */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Social Messaging Webhooks & Meta API
                  </h2>
                  <p className="text-xs text-slate-500">
                    Callback endpoints and verification credentials for real-time customer messaging
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {/* Webhook Callback URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Inbound Webhook Callback URL
                  </label>
                  <div className="flex items-center gap-2">
                    <Input value={webhookUrl} readOnly className="font-mono bg-slate-50 text-slate-700" />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCopyWebhook}
                      className="shrink-0 gap-1.5"
                    >
                      {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedWebhook ? "Copied" : "Copy"}</span>
                    </Button>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Paste this into your Meta Developer App / Telegram Bot webhook configuration.
                  </span>
                </div>

                {/* Verify Token */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Webhook Verification Token
                  </label>
                  <div className="flex items-center gap-2">
                    <Input value={webhookToken} readOnly className="font-mono bg-slate-50 text-slate-700" />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCopyToken}
                      className="shrink-0 gap-1.5"
                    >
                      {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedToken ? "Copied" : "Copy"}</span>
                    </Button>
                  </div>
                </div>

                {/* Meta Telemetry Badge */}
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-start gap-2.5 mt-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-emerald-800 leading-relaxed">
                    <strong>Meta Cloud API Status: Healthy (v21.0)</strong>
                    <br />
                    Quality rating: <strong>High</strong> • Webhook Latency: <strong>68ms</strong> • Active verified channels: <strong>{connectedChannels.length} Accounts</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): Notifications & Security */}
          <div className="space-y-6">
            {/* Notification & Sound Alerts */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-card space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Bell className="w-4 h-4 text-slate-700" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Notification Alerts
                </h2>
              </div>

              <div className="space-y-3 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chatSoundAlert}
                    onChange={(e) => setChatSoundAlert(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Incoming Chat Audio Chime</span>
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Play audio alert when a new customer sends an inbound message.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={assignmentAlert}
                    onChange={(e) => setAssignmentAlert(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <span className="font-semibold text-slate-800">
                      Chat Assignment Notifications
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Notify assigned team members when a conversation is assigned to them.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dailySummary}
                    onChange={(e) => setDailySummary(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <span className="font-semibold text-slate-800">
                      Daily Broadcast Report
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Email daily dispatch metrics and open rate telemetry every evening.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Security & Password */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-card space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Lock className="w-4 h-4 text-slate-700" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Update Password
                </h2>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    New Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                  />
                </div>

                <Button type="submit" size="sm" variant="outline" className="w-full">
                  Change Password
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

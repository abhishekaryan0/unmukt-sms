"use client";

import React, { useState } from "react";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useToast } from "@/components/ui/ToastContext";
import { useAppStore } from "@/lib/store";
import { DEMO_CLIENT } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import {
  Building2,
  User,
  ShieldCheck,
  Bell,
  Lock,
  CheckCircle2,
  KeyRound,
  Store,
  Plus,
  MessageCircle,
  Smartphone,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export default function ClientSettingsPage() {
  const { toast } = useToast();
  const {
    activeCustomer,
    senderHeaders,
    addSenderHeader,
    whatsappProfile,
  } = useAppStore();

  // Business state
  const [businessName, setBusinessName] = useState(
    activeCustomer?.businessName || DEMO_CLIENT.user.businessName
  );
  const [category, setCategory] = useState(
    activeCustomer?.businessCategory || DEMO_CLIENT.user.category
  );
  const [gstin, setGstin] = useState(activeCustomer?.gstin || "07AAAAA0000A1Z5");
  const [dltEntityId, setDltEntityId] = useState(
    activeCustomer?.dltEntityId || "110145892300001"
  );
  const [address, setAddress] = useState(
    "Shop 14, Main Cloth Market, Chandni Chowk, Central Delhi - 110006"
  );

  // Owner state
  const [ownerName, setOwnerName] = useState(
    activeCustomer?.ownerName || DEMO_CLIENT.user.name
  );
  const [ownerEmail, setOwnerEmail] = useState(
    activeCustomer?.email || DEMO_CLIENT.email
  );
  const [ownerMobile, setOwnerMobile] = useState(
    activeCustomer?.mobile || "9811234567"
  );

  // Notifications
  const [lowBalanceAlert, setLowBalanceAlert] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState("500");
  const [dailySummary, setDailySummary] = useState(true);

  // Password
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");

  // New Header Modal
  const [showHeaderModal, setShowHeaderModal] = useState(false);
  const [headerCode, setHeaderCode] = useState("");
  const [headerCategory, setHeaderCategory] = useState<"promotional" | "transactional">(
    "promotional"
  );
  const [headerOperator, setHeaderOperator] = useState("Jio DLT");
  const [headerDescription, setHeaderDescription] = useState("");

  // Filter sender headers for this business (or show all matching customer or default)
  const myHeaders = senderHeaders.filter(
    (h) => h.customerId === activeCustomer?.id || h.customerId === "cust-01"
  );

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Business Details Updated",
      message: "Company profile and DLT headers saved successfully.",
      type: "success",
    });
  };

  const handleApplyHeader = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHeader = headerCode.trim().toUpperCase();

    if (cleanHeader.length !== 6 || !/^[A-Z0-9]+$/.test(cleanHeader)) {
      toast({
        title: "Invalid Sender ID Header",
        message: "Indian TRAI DLT headers must be exactly 6 alphanumeric characters (e.g. SHRFSH, 150044).",
        type: "error",
      });
      return;
    }

    addSenderHeader({
      customerId: activeCustomer?.id || "cust-01",
      customerName: activeCustomer?.businessName || "Sharma Fashion Store",
      header: cleanHeader,
      category: headerCategory,
      dltEntityId: dltEntityId || "110145892300001",
      dltOperator: headerOperator,
      operator: headerOperator,
      description: headerDescription || `${headerCategory.toUpperCase()} Sender ID for customer communication`,
    });

    toast({
      title: "DLT Header Submitted",
      message: `Header "${cleanHeader}" submitted for telecom operator & admin approval.`,
      type: "success",
    });

    setShowHeaderModal(false);
    setHeaderCode("");
    setHeaderDescription("");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass) {
      toast({ title: "Fields Required", message: "Enter current and new passwords", type: "error" });
      return;
    }
    toast({
      title: "Password Changed",
      message: "Your login security credentials have been updated.",
      type: "success",
    });
    setCurrentPass("");
    setNewPass("");
  };

  return (
    <ClientLayout>
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Profile & Business Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your retail business details, TRAI DLT sender headers, WhatsApp Business API telemetry, and alerts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Business & DLT Info (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Profile Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Store className="w-5 h-5 text-slate-700" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Registered Business Information</h3>
                <p className="text-xs text-slate-500">Legal entity for GST invoicing, TRAI DLT, and telecom verification</p>
              </div>
            </div>

            <form onSubmit={handleSaveBusiness} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business / Store Name
                  </label>
                  <Input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
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
                    <option value="Education & Coaching">Education & Coaching</option>
                    <option value="Hospitality & Dining">Hospitality & Dining</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Digital Marketing Agency">Digital Marketing Agency</option>
                    <option value="Healthcare & Diagnostics">Healthcare & Diagnostics</option>
                    <option value="F&B & Bakery">F&B & Bakery</option>
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
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    TRAI DLT Principal Entity ID
                  </label>
                  <Input
                    value={dltEntityId}
                    onChange={(e) => setDltEntityId(e.target.value)}
                    placeholder="110145892300001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Billing & Shop Address
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

          {/* TRAI DLT 6-Character Sender IDs / Headers Management */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    TRAI DLT Sender IDs (Headers)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Approved 6-character Alpha sender headers for Indian telecom routes
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowHeaderModal(true)}
                className="gap-1.5 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Apply for New Header
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 px-3 font-semibold">Sender ID / Header</th>
                    <th className="py-2 px-3 font-semibold">Category</th>
                    <th className="py-2 px-3 font-semibold">Operator</th>
                    <th className="py-2 px-3 font-semibold">Status</th>
                    <th className="py-2 px-3 font-semibold">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myHeaders.length > 0 ? (
                    myHeaders.map((hdr) => (
                      <tr key={hdr.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {hdr.header}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 capitalize text-slate-700">
                          {hdr.category}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {hdr.dltOperator || hdr.operator}
                        </td>
                        <td className="py-2.5 px-3">
                          <StatusBadge status={hdr.status} />
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">
                          {formatDate(hdr.createdDate, false)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400">
                        No registered sender headers found. Apply for one above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>TRAI Telecom Compliance Notice:</strong> Promotional SMS headers are approved for 9:00 AM to 9:00 PM transmission. Transactional and OTP headers operate 24x7 with instantaneous carrier handoff.
              </div>
            </div>
          </div>

          {/* WhatsApp Business API Profile & Meta Telemetry */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Meta WhatsApp Business API Telemetry
                </h3>
                <p className="text-xs text-slate-500">
                  Direct official Meta Cloud API integration and broadcast throughput rating
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">Display Name:</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    {whatsappProfile.displayName}
                    {whatsappProfile.verifiedBadge && (
                      <span className="text-emerald-600" title="Green Tick Verified">
                        ✓
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">WhatsApp Phone:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {whatsappProfile.phoneNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">WABA Account ID:</span>
                  <span className="font-mono text-slate-600 text-[10px]">
                    {whatsappProfile.wabaId || "waba_781290348123"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-[#E8F8EE] rounded-xl border border-[#b5e7c8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#075E54] text-[11px] font-medium">Messaging Tier:</span>
                  <span className="font-bold text-[#075E54]">
                    {whatsappProfile.tierLimit || whatsappProfile.messagingTier}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#075E54] text-[11px] font-medium">Quality Rating:</span>
                  <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {whatsappProfile.qualityRating}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#075E54] text-[11px] font-medium">Webhook Status:</span>
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active / Synced
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Owner Profile Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <User className="w-5 h-5 text-slate-700" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Authorized Signatory / Owner</h3>
                <p className="text-xs text-slate-500">Primary point of contact for this account</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <Input value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile</label>
                <Input value={ownerMobile} onChange={(e) => setOwnerMobile(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Notifications & Security (1 col) */}
        <div className="space-y-6">
          {/* Notification Preferences */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Bell className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-900 uppercase">Alert Preferences</h3>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lowBalanceAlert}
                  onChange={(e) => setLowBalanceAlert(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 mt-0.5"
                />
                <div>
                  <span className="font-semibold text-slate-800">Low Balance WhatsApp Alert</span>
                  <p className="text-[11px] text-slate-500">
                    Get pinged when wallet falls below ₹{alertThreshold}
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dailySummary}
                  onChange={(e) => setDailySummary(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 mt-0.5"
                />
                <div>
                  <span className="font-semibold text-slate-800">Daily Broadcast Summary</span>
                  <p className="text-[11px] text-slate-500">
                    Receive daily delivery and failed count report at 9:00 PM
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Security & Password */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Lock className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-900 uppercase">Update Password</h3>
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

              <Button type="submit" size="sm" variant="outline" className="w-full">
                Change Password
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Apply for New Header Modal */}
      <Modal
        isOpen={showHeaderModal}
        onClose={() => setShowHeaderModal(false)}
        size="md"
        title="Apply for TRAI DLT Sender ID (Header)"
        description="Register an official 6-character sender ID for SMS broadcasts in India."
      >
        <form onSubmit={handleApplyHeader} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              6-Character Sender ID (Header) *
            </label>
            <Input
              placeholder="e.g. SHRFSH or 150044"
              value={headerCode}
              onChange={(e) => setHeaderCode(e.target.value.toUpperCase())}
              maxLength={6}
              required
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Must be exactly 6 uppercase alphanumeric characters matching your brand.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Header Category
              </label>
              <select
                value={headerCategory}
                onChange={(e) => setHeaderCategory(e.target.value as any)}
                className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="promotional">Promotional (Offers / Sales)</option>
                <option value="transactional">Transactional (OTPs / Alerts)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                DLT Operator Portal
              </label>
              <select
                value={headerOperator}
                onChange={(e) => setHeaderOperator(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="Jio DLT">Reliance Jio DLT</option>
                <option value="Airtel DLT">Bharti Airtel DLT</option>
                <option value="Vilpower DLT">Vodafone Idea (Vi) DLT</option>
                <option value="BSNL DLT">BSNL DLT Portal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Business Justification / Purpose
            </label>
            <Input
              placeholder="e.g. Header represents Sharma Fashion Store brand identity"
              value={headerDescription}
              onChange={(e) => setHeaderDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setShowHeaderModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-slate-900 text-white">
              Submit for Approval
            </Button>
          </div>
        </form>
      </Modal>
    </ClientLayout>
  );
}

"use client";

import React, { useState } from "react";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useToast } from "@/components/ui/ToastContext";
import { DEMO_CLIENT } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Building2,
  User,
  ShieldCheck,
  Bell,
  Lock,
  CheckCircle2,
  KeyRound,
  Store,
} from "lucide-react";

export default function ClientSettingsPage() {
  const { toast } = useToast();

  // Business state
  const [businessName, setBusinessName] = useState(DEMO_CLIENT.user.businessName);
  const [category, setCategory] = useState(DEMO_CLIENT.user.category);
  const [gstin, setGstin] = useState("07AAAAA0000A1Z5");
  const [dltEntityId, setDltEntityId] = useState("110145892300001");
  const [address, setAddress] = useState(
    "Shop 14, Main Cloth Market, Chandni Chowk, Central Delhi - 110006"
  );

  // Owner state
  const [ownerName, setOwnerName] = useState(DEMO_CLIENT.user.name);
  const [ownerEmail, setOwnerEmail] = useState(DEMO_CLIENT.email);
  const [ownerMobile, setOwnerMobile] = useState("9811234567");

  // Notifications
  const [lowBalanceAlert, setLowBalanceAlert] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState("500");
  const [dailySummary, setDailySummary] = useState(true);

  // Password
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Business Details Updated",
      message: "Company profile and DLT headers saved successfully.",
      type: "success",
    });
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
          Manage your retail business details, GSTIN, DLT registration, and notification preferences
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
                <p className="text-xs text-slate-500">Legal entity for GST invoicing and billing</p>
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
                    TRAI DLT Entity ID
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
    </ClientLayout>
  );
}

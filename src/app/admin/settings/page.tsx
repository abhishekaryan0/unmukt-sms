"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { DEMO_ADMIN } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Server,
  Shield,
  KeyRound,
  RefreshCw,
  Bell,
  Lock,
  Building2,
  CheckCircle2,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { resetAllData } = useAppStore();
  const { toast } = useToast();

  const [platformName, setPlatformName] = useState("SMS Unmukt Telecom Gateway");
  const [supportEmail, setSupportEmail] = useState("support@smsunmukt.in");
  const [defaultSmsRoute, setDefaultSmsRoute] = useState("EJOIN EIMS");
  const [defaultWaProvider, setDefaultWaProvider] = useState("Meta Cloud API");
  const [gstRate, setGstRate] = useState("18");
  const [dltAggregator, setDltAggregator] = useState("Airtel DLT Portal Direct");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings Saved",
      message: "Platform parameters updated successfully.",
      type: "success",
    });
  };

  const handleResetData = () => {
    if (confirm("Reset all platform state back to factory demo dataset?")) {
      resetAllData();
      toast({
        title: "Demo State Reset",
        message: "All initial mock data restored.",
        type: "info",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Platform Configuration & Infrastructure
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Telecom aggregator integration, GST tax parameters, and master administrator preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* General Platform Info */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Server className="w-5 h-5 text-slate-700" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Telecom Platform Parameters</h3>
                <p className="text-xs text-slate-500">Core gateway identification</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Platform Brand
                  </label>
                  <Input
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Support Desk Email
                  </label>
                  <Input
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary SMS Gateway
                  </label>
                  <Input
                    value={defaultSmsRoute}
                    onChange={(e) => setDefaultSmsRoute(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp BSP
                  </label>
                  <Input
                    value={defaultWaProvider}
                    onChange={(e) => setDefaultWaProvider(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Applicable GST Rate (%)
                  </label>
                  <Input value={gstRate} onChange={(e) => setGstRate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    TRAI DLT Aggregator Node
                  </label>
                  <Input
                    value={dltAggregator}
                    onChange={(e) => setDltAggregator(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" size="sm" className="bg-slate-900 text-white">
                  Update Configuration
                </Button>
              </div>
            </form>
          </div>

          {/* Admin Profile */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Shield className="w-5 h-5 text-slate-700" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Administrator Security Profile</h3>
                <p className="text-xs text-slate-500">Super administrator account credentials</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500">Name:</span>
                <div className="font-bold text-slate-900">{DEMO_ADMIN.user.name}</div>
              </div>
              <div>
                <span className="text-slate-500">Role:</span>
                <div className="font-bold text-blue-600">Super Administrator (Level 1)</div>
              </div>
              <div>
                <span className="text-slate-500">Login ID:</span>
                <div className="font-mono text-slate-800">{DEMO_ADMIN.email}</div>
              </div>
              <div>
                <span className="text-slate-500">2FA Telemetry:</span>
                <div className="text-emerald-700 font-semibold">Enabled (Hardware Token)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Danger Zone / Reset */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-card space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Demo Environment Control
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              SMS Unmukt stores interactive demo state (wallet balances, campaigns, contacts, invoices)
              in your browser's localStorage.
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetData}
              className="w-full text-rose-600 hover:bg-rose-50 border-rose-200 gap-1.5 mt-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Factory Mock Data</span>
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

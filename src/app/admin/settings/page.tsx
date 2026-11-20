"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { DEMO_ADMIN } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  Server,
  Shield,
  Palette,
  RefreshCw,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  Radio,
  KeyRound,
  ExternalLink,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { resetAllData } = useAppStore();
  const { toast } = useToast();

  const [platformName, setPlatformName] = useState("SMS Unmukt Social Messaging Cloud");
  const [supportEmail, setSupportEmail] = useState("support@smsunmukt.in");
  const [defaultChannel, setDefaultChannel] = useState("WhatsApp Business Cloud API");
  const [graphApiVersion, setGraphApiVersion] = useState("v21.0");
  const [gstRate, setGstRate] = useState("18");
  const [webhookToken, setWebhookToken] = useState("unmukt_social_gateway_prod_sec_9941");

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
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Platform Configuration & Infrastructure
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Meta Cloud API parameters, tenant webhook endpoints, appearance theme, and master administrator preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Appearance & Platform Theme */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Appearance & Admin Portal Theme
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Switch between crisp light mode, high-contrast dark mode, or system default
                  </p>
                </div>
              </div>

              <ThemeToggle variant="pill" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("unmukt_theme", "light");
                    document.documentElement.classList.remove("dark");
                    window.dispatchEvent(new Event("storage"));
                  }
                }}
                className="cursor-pointer rounded-xl border-2 border-slate-200 dark:border-slate-800 p-4 hover:border-blue-500 transition-all bg-slate-50/60 dark:bg-slate-800/40 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Clean Light Theme</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-200/70 text-slate-700">
                    Daylight
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Subtle slate borders, clean white cards, optimized for daylight customer operations.
                </p>
              </div>

              <div
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("unmukt_theme", "dark");
                    document.documentElement.classList.add("dark");
                    window.dispatchEvent(new Event("storage"));
                  }
                }}
                className="cursor-pointer rounded-xl border-2 border-slate-200 dark:border-slate-800 p-4 hover:border-blue-500 transition-all bg-slate-900 text-white group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-white">Midnight Dark Theme</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-500/20 text-blue-300">
                    Low-Light
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Deep obsidian surfaces (`#090d16`), reduced eye fatigue, high-contrast badges for command center monitoring.
                </p>
              </div>
            </div>
          </div>

          {/* Social Cloud Messaging Platform Parameters */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Server className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Social Cloud Gateway Parameters
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Global Meta Cloud API and Social Webhook configurations
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Platform Brand
                  </label>
                  <Input
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Default Primary Channel
                  </label>
                  <Input
                    value={defaultChannel}
                    onChange={(e) => setDefaultChannel(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Meta Graph API Version
                  </label>
                  <Input
                    value={graphApiVersion}
                    onChange={(e) => setGraphApiVersion(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Applicable GST Rate (%)
                  </label>
                  <Input value={gstRate} onChange={(e) => setGstRate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Master Webhook Verification Token
                  </label>
                  <Input
                    value={webhookToken}
                    onChange={(e) => setWebhookToken(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Update Configuration
                </Button>
              </div>
            </form>
          </div>

          {/* Admin Profile */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Shield className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Administrator Security Profile
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Super administrator account credentials & role telemetry
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Name:</span>
                <div className="font-bold text-slate-900 dark:text-white">{DEMO_ADMIN.user.name}</div>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Role:</span>
                <div className="font-bold text-blue-600 dark:text-blue-400">Super Administrator (Level 1)</div>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Login ID:</span>
                <div className="font-mono text-slate-800 dark:text-slate-200">{DEMO_ADMIN.email}</div>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">2FA Telemetry:</span>
                <div className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enabled (Hardware Token)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Danger Zone / Reset */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-card space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Demo Environment Control
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              SMS Unmukt stores interactive demo state (conversations, channels, campaigns, contacts, invoices)
              in your browser's localStorage.
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetData}
              className="w-full text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900 gap-1.5 mt-2"
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

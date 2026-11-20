"use client";

import React, { useState, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { formatNumber } from "@/lib/utils";
import { SocialChannelType } from "@/types";
import {
  WhatsAppIcon,
  MessengerIcon,
  InstagramIcon,
  TelegramIcon,
  ChannelBadge,
} from "@/components/shared/ChannelIcons";
import {
  Radio,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Activity,
  ShieldCheck,
  Zap,
  Filter,
  ExternalLink,
  Clock,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export default function AdminChannelsPage() {
  const { customers, connectedChannels } = useAppStore();
  const { toast } = useToast();

  const [channelFilter, setChannelFilter] = useState<SocialChannelType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "healthy" | "degraded">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Cross-tenant mock channel connections across client accounts
  const crossTenantChannels = useMemo(() => {
    return [
      {
        id: "chan-admin-01",
        customerName: "Sharma Fashion Store",
        customerId: "cust-01",
        channelType: "whatsapp" as SocialChannelType,
        name: "Official WhatsApp Business",
        identifier: "+91 98112 34567",
        status: "connected",
        webhookStatus: "healthy",
        apiTier: "Tier 2 (10K/24h)",
        dailyMessages: 1420,
        latencyMs: 78,
        lastHandshake: "2 mins ago",
      },
      {
        id: "chan-admin-02",
        customerName: "Sharma Fashion Store",
        customerId: "cust-01",
        channelType: "instagram" as SocialChannelType,
        name: "Instagram Direct Hub",
        identifier: "@sharma_fashion_hub",
        status: "connected",
        webhookStatus: "healthy",
        apiTier: "Standard Business",
        dailyMessages: 890,
        latencyMs: 95,
        lastHandshake: "4 mins ago",
      },
      {
        id: "chan-admin-03",
        customerName: "Sharma Fashion Store",
        customerId: "cust-01",
        channelType: "messenger" as SocialChannelType,
        name: "Facebook Messenger Page",
        identifier: "Sharma Fashion Hub Delhi",
        status: "connected",
        webhookStatus: "healthy",
        apiTier: "Standard Graph v19",
        dailyMessages: 430,
        latencyMs: 110,
        lastHandshake: "5 mins ago",
      },
      {
        id: "chan-admin-04",
        customerName: "Sharma Fashion Store",
        customerId: "cust-01",
        channelType: "telegram" as SocialChannelType,
        name: "Telegram VIP Care Bot",
        identifier: "@sharmafashion_bot",
        status: "connected",
        webhookStatus: "healthy",
        apiTier: "Bot API 7.0",
        dailyMessages: 260,
        latencyMs: 62,
        lastHandshake: "12 mins ago",
      },
      {
        id: "chan-admin-05",
        customerName: "Gupta Electronics",
        customerId: "cust-02",
        channelType: "whatsapp" as SocialChannelType,
        name: "Gupta Electronics Care",
        identifier: "+91 98234 56781",
        status: "connected",
        webhookStatus: "healthy",
        apiTier: "Tier 3 (100K/24h)",
        dailyMessages: 3840,
        latencyMs: 82,
        lastHandshake: "Just now",
      },
      {
        id: "chan-admin-06",
        customerName: "Gupta Electronics",
        customerId: "cust-02",
        channelType: "instagram" as SocialChannelType,
        name: "Gupta Tech Store IG",
        identifier: "@guptaelectronics_in",
        status: "connected",
        webhookStatus: "healthy",
        apiTier: "Standard Business",
        dailyMessages: 1220,
        latencyMs: 98,
        lastHandshake: "8 mins ago",
      },
      {
        id: "chan-admin-07",
        customerName: "Royal Restaurant",
        customerId: "cust-04",
        channelType: "whatsapp" as SocialChannelType,
        name: "Royal Resto Dining Bookings",
        identifier: "+91 97118 89012",
        status: "connected",
        webhookStatus: "healthy",
        apiTier: "Tier 1 (1K/24h)",
        dailyMessages: 610,
        latencyMs: 75,
        lastHandshake: "15 mins ago",
      },
      {
        id: "chan-admin-08",
        customerName: "Bright Future Coaching",
        customerId: "cust-03",
        channelType: "telegram" as SocialChannelType,
        name: "BFC Student Alerts Bot",
        identifier: "@bfc_admissions_bot",
        status: "connected",
        webhookStatus: "healthy",
        apiTier: "Bot API 7.0",
        dailyMessages: 1840,
        latencyMs: 55,
        lastHandshake: "1 min ago",
      },
    ];
  }, []);

  const filteredChannels = useMemo(() => {
    return crossTenantChannels.filter((c) => {
      if (channelFilter !== "all" && c.channelType !== channelFilter) return false;
      if (statusFilter !== "all" && c.webhookStatus !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.customerName.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.identifier.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [crossTenantChannels, channelFilter, statusFilter, searchQuery]);

  // Aggregate Metrics
  const totalConnected = crossTenantChannels.length;
  const whatsappCount = crossTenantChannels.filter((c) => c.channelType === "whatsapp").length;
  const instagramCount = crossTenantChannels.filter((c) => c.channelType === "instagram").length;
  const messengerCount = crossTenantChannels.filter((c) => c.channelType === "messenger").length;
  const telegramCount = crossTenantChannels.filter((c) => c.channelType === "telegram").length;
  const totalDailyTraffic = crossTenantChannels.reduce((sum, c) => sum + c.dailyMessages, 0);

  const handlePingWebhook = (channelName: string) => {
    toast({
      title: "Webhook Telemetry 200 OK",
      message: `${channelName}: Round-trip response in 72ms. Zero dropped frames.`,
      type: "success",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Radio className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Connected Channels & Gateway Monitoring
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Cross-tenant monitoring of customer social messaging channel connections, Meta Cloud webhooks, and gateway latencies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Webhook Nodes Operational</span>
            </span>
          </div>
        </div>

        {/* Aggregate KPI Cards in Clean Light Theme */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-subtle">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Connected Channels
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{totalConnected}</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">Across 8 Tenants</div>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-subtle">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp WABA</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-[#075E54]">{whatsappCount}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Meta Cloud API</div>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-subtle">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
              <span>Instagram Direct</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-pink-700">{instagramCount}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Business Messaging</div>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-subtle">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MessengerIcon className="w-3.5 h-3.5 text-[#0084FF]" />
              <span>Messenger Pages</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-blue-700">{messengerCount}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Meta Graph Pages</div>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-subtle">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <TelegramIcon className="w-3.5 h-3.5 text-[#0088cc]" />
              <span>Telegram Bots</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-sky-700">{telegramCount}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Bot Webhooks</div>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-subtle">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Daily Msg Volume
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-900">
              {totalDailyTraffic.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">Handled Today</div>
          </div>
        </div>

        {/* Filters & Search in Light Theme */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setChannelFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                channelFilter === "all"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              All Platforms
            </button>
            <button
              onClick={() => setChannelFilter("whatsapp")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                channelFilter === "whatsapp"
                  ? "bg-[#25D366] text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => setChannelFilter("instagram")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                channelFilter === "instagram"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </button>
            <button
              onClick={() => setChannelFilter("messenger")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                channelFilter === "messenger"
                  ? "bg-[#0084FF] text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <MessengerIcon className="w-3.5 h-3.5" />
              <span>Messenger</span>
            </button>
            <button
              onClick={() => setChannelFilter("telegram")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                channelFilter === "telegram"
                  ? "bg-[#0088cc] text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <TelegramIcon className="w-3.5 h-3.5" />
              <span>Telegram</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by tenant or channel..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Cross-Tenant Channels Table in Light Theme */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Active Tenant Channel Handshakes</h3>
            <span className="text-xs text-slate-500 font-medium">
              {filteredChannels.length} Monitored Endpoints
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/80">
                  <th className="py-3 px-4">Client Tenant</th>
                  <th className="py-3 px-4">Channel & Platform</th>
                  <th className="py-3 px-4">Account Identifier</th>
                  <th className="py-3 px-4">API Tier / Version</th>
                  <th className="py-3 px-4">Today Traffic</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Webhook Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredChannels.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{c.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{c.customerId}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <ChannelBadge channelType={c.channelType} size="sm" />
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium mt-1">{c.name}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-700">{c.identifier}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {c.apiTier}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {c.dailyMessages.toLocaleString()} msgs
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-emerald-600 font-mono font-semibold">
                        {c.latencyMs}ms
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Healthy</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handlePingWebhook(c.name)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3 text-blue-600" />
                        <span>Ping</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

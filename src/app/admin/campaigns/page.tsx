"use client";

import React, { useState, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { formatNumber, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  ChannelBadge,
  WhatsAppIcon,
  MessengerIcon,
  InstagramIcon,
  TelegramIcon,
} from "@/components/shared/ChannelIcons";
import { BroadcastCampaign, SocialChannelType } from "@/types";
import {
  Megaphone,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Radio,
  BarChart3,
  TrendingUp,
  Search,
  Filter,
  ShieldCheck,
  Building2,
  Activity,
  Layers,
} from "lucide-react";

export default function AdminCampaignsPage() {
  const { broadcastCampaigns, customers } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [inspectCampaign, setInspectCampaign] = useState<BroadcastCampaign | null>(
    null
  );

  // Aggregate Platform Metrics
  const totalCampaigns = broadcastCampaigns.length;
  const activeSending = broadcastCampaigns.filter((c) => c.status === "sending").length;
  const scheduledCount = broadcastCampaigns.filter((c) => c.status === "scheduled").length;
  const completedCount = broadcastCampaigns.filter((c) => c.status === "completed").length;
  const failedCount = broadcastCampaigns.filter((c) => c.status === "failed").length;

  const totalDelivered = broadcastCampaigns.reduce((sum, c) => sum + (c.delivered || 0), 0);
  const totalTargeted = broadcastCampaigns.reduce((sum, c) => sum + (c.targetCount || 0), 0);
  const avgDeliverability =
    totalTargeted > 0 ? ((totalDelivered / totalTargeted) * 100).toFixed(1) : "98.2";

  // Channel breakdown counts
  const channelVolume = useMemo(() => {
    const counts: Record<SocialChannelType, number> = {
      whatsapp: 0,
      instagram: 0,
      messenger: 0,
      telegram: 0,
    };
    broadcastCampaigns.forEach((c) => {
      c.channels.forEach((ch) => {
        counts[ch] = (counts[ch] || 0) + (c.delivered || Math.round(c.targetCount / c.channels.length));
      });
    });
    return counts;
  }, [broadcastCampaigns]);

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return broadcastCampaigns.filter((camp) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = camp.campaignName.toLowerCase().includes(q);
        const matchesClient = (camp.customerName || "").toLowerCase().includes(q);
        const matchesId = camp.id.toLowerCase().includes(q);
        if (!matchesName && !matchesClient && !matchesId) return false;
      }

      if (channelFilter !== "all") {
        if (!camp.channels.includes(channelFilter as SocialChannelType)) {
          return false;
        }
      }

      if (statusFilter !== "all" && camp.status !== statusFilter) {
        return false;
      }

      if (clientFilter !== "all" && camp.customerId !== clientFilter) {
        return false;
      }

      return true;
    });
  }, [broadcastCampaigns, searchQuery, channelFilter, statusFilter, clientFilter]);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Broadcast & Campaign Monitoring
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                All Clients
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Supervise client social messaging broadcasts, throughput pacing, channel usage and delivery health across all tenants.
            </p>
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Total Broadcasts</span>
              <Megaphone className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {totalCampaigns}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Across {customers.length} tenant accounts
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Live Dispatches</span>
              <span className="relative flex h-2.5 w-2.5">
                {activeSending > 0 && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div className="text-2xl font-bold text-emerald-600 mt-2">
              {activeSending}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Active queue streaming</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Scheduled</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-600 mt-2">
              {scheduledCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Upcoming future jobs</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Avg Delivery Rate</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {avgDeliverability}%
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
              {formatNumber(totalDelivered)} delivered
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Flagged / Failed</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-bold text-slate-700 mt-2">
              {failedCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Policy / DND suppressed</div>
          </div>
        </div>

        {/* Channel Usage Volume Bar */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Platform Channel Dispatch Volume
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Total: {formatNumber(totalTargeted)} messages
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border border-slate-200 bg-[#E8F8EE]/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                <span className="text-xs font-semibold text-slate-800">WhatsApp</span>
              </div>
              <span className="text-xs font-bold text-[#075E54]">
                {formatNumber(channelVolume.whatsapp)}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-pink-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <InstagramIcon className="w-4 h-4 text-pink-600" />
                <span className="text-xs font-semibold text-slate-800">Instagram</span>
              </div>
              <span className="text-xs font-bold text-pink-700">
                {formatNumber(channelVolume.instagram)}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-blue-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessengerIcon className="w-4 h-4 text-[#0084FF]" />
                <span className="text-xs font-semibold text-slate-800">Messenger</span>
              </div>
              <span className="text-xs font-bold text-blue-700">
                {formatNumber(channelVolume.messenger)}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-sky-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TelegramIcon className="w-4 h-4 text-[#0088cc]" />
                <span className="text-xs font-semibold text-slate-800">Telegram</span>
              </div>
              <span className="text-xs font-bold text-sky-700">
                {formatNumber(channelVolume.telegram)}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search campaign, customer or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {/* Client Filter */}
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Clients</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.businessName}
                </option>
              ))}
            </select>

            {/* Channel filter */}
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Channels</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
              <option value="messenger">Messenger</option>
              <option value="telegram">Telegram</option>
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="sending">Sending</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="failed">Failed</option>
            </select>

            {(searchQuery || channelFilter !== "all" || statusFilter !== "all" || clientFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setChannelFilter("all");
                  setStatusFilter("all");
                  setClientFilter("all");
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Global Campaign Table */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Client / Account</th>
                  <th className="py-3.5 px-4">Campaign Name</th>
                  <th className="py-3.5 px-4">Channels</th>
                  <th className="py-3.5 px-4">Audience</th>
                  <th className="py-3.5 px-4">Schedule / Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Delivered / Sent</th>
                  <th className="py-3.5 px-4">Failed</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No broadcast campaigns match the active filters.
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {camp.customerName || "Client Tenant"}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {camp.customerId}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{camp.campaignName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {camp.id}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          {camp.channels.map((ch) => (
                            <span
                              key={ch}
                              className="p-1 rounded bg-slate-50 border border-slate-200"
                              title={ch}
                            >
                              {ch === "whatsapp" && <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />}
                              {ch === "instagram" && <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />}
                              {ch === "messenger" && <MessengerIcon className="w-3.5 h-3.5 text-[#0084FF]" />}
                              {ch === "telegram" && <TelegramIcon className="w-3.5 h-3.5 text-[#0088cc]" />}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {formatNumber(camp.targetCount)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {camp.audienceType === "all" ? "All Contacts" : "Segmented"}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-700 font-medium">
                          {formatDate(camp.createdDate)}
                        </div>
                        {camp.scheduledTime && (
                          <div className="text-[10px] text-amber-700 font-medium">
                            Scheduled: {formatDate(camp.scheduledTime)}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {camp.status === "sending" && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            <span>Sending ({camp.deliveryRate}%)</span>
                          </span>
                        )}
                        {camp.status === "scheduled" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            <span>Scheduled</span>
                          </span>
                        )}
                        {camp.status === "completed" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Completed</span>
                          </span>
                        )}
                        {camp.status === "paused" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-700">
                            <span>Paused</span>
                          </span>
                        )}
                        {camp.status === "failed" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Failed</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">
                          {formatNumber(camp.delivered)} / {formatNumber(camp.sent)}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-medium">
                          {camp.deliveryRate}% delivered
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={
                            camp.failed > 0 ? "text-rose-600 font-bold" : "text-slate-400"
                          }
                        >
                          {formatNumber(camp.failed)}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setInspectCampaign(camp)}
                          className="h-7 px-2.5 text-xs gap-1 font-semibold shadow-none text-slate-700"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Campaign Inspection Modal (Privacy Safe) */}
        {inspectCampaign && (
          <Modal
            isOpen={!!inspectCampaign}
            onClose={() => setInspectCampaign(null)}
            title={`Campaign Throughput & Delivery Audit: ${inspectCampaign.id}`}
          >
            <div className="space-y-5 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-500">Client Tenant:</span>
                  <div className="font-bold text-slate-900 text-sm">
                    {inspectCampaign.customerName}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">Campaign Name:</span>
                  <div className="font-bold text-slate-900 text-sm">
                    {inspectCampaign.campaignName}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">Target Audience:</span>
                  <div className="font-bold text-blue-600 text-sm">
                    {formatNumber(inspectCampaign.targetCount)} recipients
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">Delivery Status:</span>
                  <div className="font-bold capitalize text-slate-800 text-sm">
                    {inspectCampaign.status} ({inspectCampaign.deliveryRate}%)
                  </div>
                </div>
              </div>

              {/* Delivery Stats Bar */}
              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Throughput Pipeline Metrics</span>
                  <span className="text-emerald-600">{inspectCampaign.deliveryRate}% Success</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-400">Total Sent</div>
                    <div className="font-bold text-slate-900 mt-0.5">
                      {formatNumber(inspectCampaign.sent)}
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-400">Delivered</div>
                    <div className="font-bold text-emerald-600 mt-0.5">
                      {formatNumber(inspectCampaign.delivered)}
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-400">Read Receipts</div>
                    <div className="font-bold text-purple-600 mt-0.5">
                      {formatNumber(inspectCampaign.read)}
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-400">Failed</div>
                    <div className="font-bold text-rose-600 mt-0.5">
                      {formatNumber(inspectCampaign.failed)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Channel Stats */}
              <div className="space-y-2">
                <div className="font-semibold text-slate-700">Channels Dispatched</div>
                <div className="flex items-center gap-2">
                  {inspectCampaign.channels.map((ch) => (
                    <span
                      key={ch}
                      className="px-2.5 py-1 rounded-lg border bg-white text-slate-800 font-bold uppercase text-[10px]"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-3 bg-blue-50/70 rounded-xl text-[11px] text-blue-700 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Tenant Privacy Protection:</strong> Private customer message content and individual phone logs are masked in compliance with enterprise tenant isolation standards.
                </span>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  onClick={() => setInspectCampaign(null)}
                  className="bg-slate-900 text-white text-xs px-4"
                >
                  Close Audit
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}

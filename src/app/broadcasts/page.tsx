"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { formatNumber, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import {
  ChannelBadge,
  WhatsAppIcon,
  MessengerIcon,
  InstagramIcon,
  TelegramIcon,
} from "@/components/shared/ChannelIcons";
import { BroadcastCampaign, BroadcastStatus, SocialChannelType } from "@/types";
import {
  Send,
  Plus,
  Search,
  Filter,
  Eye,
  Play,
  Pause,
  Copy,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Radio,
  BarChart3,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function BroadcastsDashboardPage() {
  const router = useRouter();
  const {
    broadcastCampaigns,
    activeCustomer,
    pauseBroadcastCampaign,
    resumeBroadcastCampaign,
    deleteBroadcastCampaign,
    duplicateBroadcastCampaign,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filter campaigns strictly for active customer
  const clientCampaigns = useMemo(() => {
    return broadcastCampaigns.filter((c) => c.customerId === activeCustomer.id);
  }, [broadcastCampaigns, activeCustomer.id]);

  // Aggregate metrics
  const totalCampaigns = clientCampaigns.length;
  const activeCampaigns = clientCampaigns.filter((c) => c.status === "sending").length;
  const scheduledCampaigns = clientCampaigns.filter((c) => c.status === "scheduled").length;
  const completedCampaigns = clientCampaigns.filter((c) => c.status === "completed").length;
  const failedCampaigns = clientCampaigns.filter((c) => c.status === "failed").length;

  const totalDelivered = clientCampaigns.reduce((sum, c) => sum + (c.delivered || 0), 0);
  const totalTargeted = clientCampaigns.reduce((sum, c) => sum + (c.targetCount || 0), 0);
  const avgDeliveryRate =
    totalTargeted > 0 ? ((totalDelivered / totalTargeted) * 100).toFixed(1) : "98.4";

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return clientCampaigns.filter((camp) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = camp.campaignName.toLowerCase().includes(q);
        const matchesDesc = (camp.description || "").toLowerCase().includes(q);
        const matchesId = camp.id.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesId) return false;
      }

      // Channel
      if (selectedChannel !== "all") {
        if (!camp.channels.includes(selectedChannel as SocialChannelType)) {
          return false;
        }
      }

      // Status
      if (selectedStatus !== "all") {
        if (camp.status !== selectedStatus) return false;
      }

      return true;
    });
  }, [clientCampaigns, searchQuery, selectedChannel, selectedStatus]);

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const dup = duplicateBroadcastCampaign(id);
    router.push(`/broadcasts/${dup.id}`);
  };

  const handleToggleStatus = (camp: BroadcastCampaign, e: React.MouseEvent) => {
    e.stopPropagation();
    if (camp.status === "sending") {
      pauseBroadcastCampaign(camp.id);
    } else if (camp.status === "paused") {
      resumeBroadcastCampaign(camp.id);
    }
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteBroadcastCampaign(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <ClientLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Social Media Broadcasts
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                Multi-Channel
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Reach thousands of segmented customers across WhatsApp, Instagram, Messenger & Telegram.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/broadcasts/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-subtle">
                <Plus className="w-4 h-4" />
                <span>Create Broadcast</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {/* 1. Total Campaigns */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Total Broadcasts</span>
              <Send className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900">{totalCampaigns}</div>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                <span>{formatNumber(totalTargeted)} total reached</span>
              </div>
            </div>
          </div>

          {/* 2. Active / Sending */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Active Sending</span>
              <span className="relative flex h-2.5 w-2.5">
                {activeCampaigns > 0 && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-emerald-600">{activeCampaigns}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Live streaming queue</div>
            </div>
          </div>

          {/* 3. Scheduled */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Scheduled</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-amber-600">{scheduledCampaigns}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Queued for future release</div>
            </div>
          </div>

          {/* 4. Completed */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Completed</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900">{completedCampaigns}</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{avgDeliveryRate}% avg delivery</span>
              </div>
            </div>
          </div>

          {/* 5. Failed */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle flex flex-col justify-between col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Failed / Flagged</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-700">{failedCampaigns}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Policy / invalid recipients</div>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by campaign name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {/* Channel filter */}
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
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
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="sending">Active / Sending</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
              <option value="failed">Failed</option>
            </select>

            {(searchQuery || selectedChannel !== "all" || selectedStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedChannel("all");
                  setSelectedStatus("all");
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Campaign List / Table */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Campaign Name</th>
                  <th className="py-3.5 px-4">Channels</th>
                  <th className="py-3.5 px-4">Audience</th>
                  <th className="py-3.5 px-4">Schedule / Created</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Delivered / Sent</th>
                  <th className="py-3.5 px-4">Failed</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
                        <Send className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">No broadcast campaigns found</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                        {searchQuery || selectedChannel !== "all" || selectedStatus !== "all"
                          ? "Try adjusting your search or filters to find what you're looking for."
                          : "Create your first multi-channel broadcast to connect with thousands of customers."}
                      </p>
                      <Link href="/broadcasts/new">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs">
                          <Plus className="w-3.5 h-3.5 mr-1.5" />
                          <span>Create First Broadcast</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((camp) => {
                    const isSending = camp.status === "sending";
                    const isScheduled = camp.status === "scheduled";
                    const isCompleted = camp.status === "completed";
                    const isPaused = camp.status === "paused";
                    const isFailed = camp.status === "failed";
                    const isDraft = camp.status === "draft";

                    return (
                      <tr
                        key={camp.id}
                        className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        onClick={() => router.push(`/broadcasts/${camp.id}`)}
                      >
                        {/* 1. Campaign Name & Info */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {camp.campaignName}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                            {camp.description || "Multi-channel announcement"}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            ID: {camp.id}
                          </div>
                        </td>

                        {/* 2. Channels */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {camp.channels.map((ch) => (
                              <span
                                key={ch}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-white"
                              >
                                {ch === "whatsapp" && (
                                  <>
                                    <WhatsAppIcon className="w-3 h-3 text-[#25D366]" />
                                    <span className="text-[#075E54]">WhatsApp</span>
                                  </>
                                )}
                                {ch === "instagram" && (
                                  <>
                                    <InstagramIcon className="w-3 h-3 text-pink-600" />
                                    <span className="text-pink-700">Instagram</span>
                                  </>
                                )}
                                {ch === "messenger" && (
                                  <>
                                    <MessengerIcon className="w-3 h-3 text-[#0084FF]" />
                                    <span className="text-blue-700">Messenger</span>
                                  </>
                                )}
                                {ch === "telegram" && (
                                  <>
                                    <TelegramIcon className="w-3 h-3 text-[#0088cc]" />
                                    <span className="text-sky-700">Telegram</span>
                                  </>
                                )}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* 3. Audience Count */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">
                            {formatNumber(camp.targetCount)}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {camp.audienceType === "all" ? "All Contacts" : "Segmented Filter"}
                          </div>
                        </td>

                        {/* 4. Schedule / Created Date */}
                        <td className="py-3 px-4">
                          {isScheduled && camp.scheduledTime ? (
                            <div>
                              <div className="font-semibold text-amber-700 flex items-center gap-1 text-[11px]">
                                <Clock className="w-3 h-3" />
                                <span>{formatDate(camp.scheduledTime)}</span>
                              </div>
                              <div className="text-[10px] text-slate-400">Scheduled</div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-slate-700 font-medium text-[11px]">
                                {formatDate(camp.createdDate)}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {camp.deliveryType === "now" ? "Instant dispatch" : "Manual draft"}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* 5. Status Badge */}
                        <td className="py-3 px-4">
                          {isSending && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                              <span>Sending ({camp.deliveryRate}%)</span>
                            </span>
                          )}

                          {isScheduled && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3 h-3" />
                              <span>Scheduled</span>
                            </span>
                          )}

                          {isCompleted && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Completed</span>
                            </span>
                          )}

                          {isPaused && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                              <Pause className="w-3 h-3" />
                              <span>Paused</span>
                            </span>
                          )}

                          {isDraft && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              <span>Draft</span>
                            </span>
                          )}

                          {isFailed && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Failed</span>
                            </span>
                          )}
                        </td>

                        {/* 6. Delivered / Sent */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">
                            {formatNumber(camp.delivered)}{" "}
                            <span className="text-slate-400 font-normal">/ {formatNumber(camp.sent)}</span>
                          </div>
                          <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${Math.min(camp.deliveryRate || 0, 100)}%` }}
                            />
                          </div>
                        </td>

                        {/* 7. Failed */}
                        <td className="py-3 px-4">
                          <span
                            className={
                              camp.failed > 0
                                ? "text-rose-600 font-semibold"
                                : "text-slate-400 font-normal"
                            }
                          >
                            {formatNumber(camp.failed)}
                          </span>
                        </td>

                        {/* 8. Actions */}
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            {/* View Analytics */}
                            <Link
                              href={`/broadcasts/${camp.id}`}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="View Analytics"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </Link>

                            {/* Pause / Resume if applicable */}
                            {(camp.status === "sending" || camp.status === "paused") && (
                              <button
                                onClick={(e) => handleToggleStatus(camp, e)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  camp.status === "sending"
                                    ? "text-orange-600 hover:bg-orange-50"
                                    : "text-emerald-600 hover:bg-emerald-50"
                                }`}
                                title={camp.status === "sending" ? "Pause Dispatch" : "Resume Dispatch"}
                              >
                                {camp.status === "sending" ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </button>
                            )}

                            {/* Duplicate */}
                            <button
                              onClick={(e) => handleDuplicate(camp.id, e)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                              title="Duplicate Campaign"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(camp.id);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Campaign"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          title="Delete Broadcast Campaign"
          description="Are you sure you want to delete this broadcast campaign? This will remove its analytics and history."
          confirmText="Delete Campaign"
          variant="destructive"
        />
      </div>
    </ClientLayout>
  );
}

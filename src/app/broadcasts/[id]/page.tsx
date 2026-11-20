"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { formatNumber, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import {
  ChannelBadge,
  WhatsAppIcon,
  MessengerIcon,
  InstagramIcon,
  TelegramIcon,
} from "@/components/shared/ChannelIcons";
import { BroadcastCampaign, SocialChannelType } from "@/types";
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  Copy,
  Trash2,
  Users,
  Check,
  Eye,
  BarChart3,
  TrendingUp,
  Radio,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Inbox,
  Share2,
} from "lucide-react";

export default function BroadcastDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    broadcastCampaigns,
    pauseBroadcastCampaign,
    resumeBroadcastCampaign,
    deleteBroadcastCampaign,
    duplicateBroadcastCampaign,
  } = useAppStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Find the campaign
  const campaign = useMemo(() => {
    return broadcastCampaigns.find((c) => c.id === id);
  }, [broadcastCampaigns, id]);

  if (!campaign) {
    return (
      <ClientLayout>
        <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Campaign Not Found</h2>
          <p className="text-xs text-slate-500">
            The broadcast campaign ID &apos;{id}&apos; does not exist or may have been deleted.
          </p>
          <Link href="/broadcasts">
            <Button className="text-xs bg-blue-600 hover:bg-blue-700 text-white">
              Back to Broadcasts
            </Button>
          </Link>
        </div>
      </ClientLayout>
    );
  }

  const isSending = campaign.status === "sending";
  const isScheduled = campaign.status === "scheduled";
  const isCompleted = campaign.status === "completed";
  const isPaused = campaign.status === "paused";
  const isFailed = campaign.status === "failed";
  const isDraft = campaign.status === "draft";

  const progressPercent = Math.min(
    100,
    Math.round(((campaign.sent || 0) / (campaign.targetCount || 1)) * 100)
  );

  const handleDuplicate = () => {
    const dup = duplicateBroadcastCampaign(campaign.id);
    router.push(`/broadcasts/${dup.id}`);
  };

  const handleToggleStatus = () => {
    if (isSending) {
      pauseBroadcastCampaign(campaign.id);
    } else if (isPaused) {
      resumeBroadcastCampaign(campaign.id);
    }
  };

  const confirmDelete = () => {
    deleteBroadcastCampaign(campaign.id);
    router.push("/broadcasts");
  };

  return (
    <ClientLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-16">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              href="/broadcasts"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">
                  {campaign.campaignName}
                </h1>

                {/* Status Badge */}
                {isSending && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>Sending ({progressPercent}%)</span>
                  </span>
                )}
                {isScheduled && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <Clock className="w-3 h-3" />
                    <span>Scheduled</span>
                  </span>
                )}
                {isCompleted && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Completed</span>
                  </span>
                )}
                {isPaused && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                    <Pause className="w-3 h-3" />
                    <span>Paused</span>
                  </span>
                )}
                {isDraft && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                    <span>Draft</span>
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span className="font-mono text-[11px]">ID: {campaign.id}</span>
                <span>•</span>
                <span>Created {formatDate(campaign.createdDate)}</span>
                {campaign.scheduledTime && (
                  <>
                    <span>•</span>
                    <span className="text-amber-700 font-medium">
                      Scheduled for {formatDate(campaign.scheduledTime)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {(isSending || isPaused) && (
              <Button
                onClick={handleToggleStatus}
                variant="outline"
                className={`text-xs flex items-center gap-1.5 font-semibold ${
                  isSending
                    ? "text-orange-700 border-orange-300 hover:bg-orange-50"
                    : "text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                }`}
              >
                {isSending ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Broadcast</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Resume Broadcast</span>
                  </>
                )}
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handleDuplicate}
              className="text-xs text-slate-700 flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicate</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(true)}
              className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        {/* Top Progress & Metrics Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-subtle space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Overall Dispatch Progress
              </span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {formatNumber(campaign.delivered)}{" "}
                <span className="text-sm font-semibold text-slate-500">
                  / {formatNumber(campaign.targetCount)} Delivered ({campaign.deliveryRate}%)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Target Channels:</span>
              <div className="flex items-center gap-1">
                {campaign.channels.map((ch) => (
                  <span
                    key={ch}
                    className="p-1.5 rounded-lg border bg-slate-50"
                    title={ch}
                  >
                    {ch === "whatsapp" && <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />}
                    {ch === "instagram" && <InstagramIcon className="w-4 h-4 text-pink-600" />}
                    {ch === "messenger" && <MessengerIcon className="w-4 h-4 text-[#0084FF]" />}
                    {ch === "telegram" && <TelegramIcon className="w-4 h-4 text-[#0088cc]" />}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  isCompleted
                    ? "bg-emerald-500"
                    : isSending
                    ? "bg-gradient-to-r from-blue-500 to-emerald-500 animate-pulse"
                    : "bg-blue-600"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>{progressPercent}% Complete</span>
              <span>
                {campaign.queued > 0 ? `${formatNumber(campaign.queued)} remaining in queue` : "Queue cleared"}
              </span>
            </div>
          </div>

          {/* 6 Metric Cubes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-3 border-t border-slate-100">
            {/* 1. Targeted */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">Targeted</div>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {formatNumber(campaign.targetCount)}
              </div>
            </div>

            {/* 2. Sent */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">Sent</div>
              <div className="text-lg font-bold text-blue-600 mt-1">
                {formatNumber(campaign.sent)}
              </div>
            </div>

            {/* 3. Delivered */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">Delivered</div>
              <div className="text-lg font-bold text-emerald-600 mt-1">
                {formatNumber(campaign.delivered)}
              </div>
            </div>

            {/* 4. Read */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">Read Receipts</div>
              <div className="text-lg font-bold text-purple-600 mt-1">
                {formatNumber(campaign.read)}
              </div>
            </div>

            {/* 5. Queued */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">Queued</div>
              <div className="text-lg font-bold text-amber-600 mt-1">
                {formatNumber(campaign.queued)}
              </div>
            </div>

            {/* 6. Failed */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">Failed</div>
              <div
                className={`text-lg font-bold mt-1 ${
                  campaign.failed > 0 ? "text-rose-600" : "text-slate-400"
                }`}
              >
                {formatNumber(campaign.failed)}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Channel Breakdown & Activity Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Channel Performance & Message Preview */}
          <div className="lg:col-span-7 space-y-6">
            {/* Channel Performance Breakdown */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Channel-Wise Performance
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {campaign.channels.length} channels tracked
                </span>
              </div>

              <div className="space-y-3">
                {campaign.channels.map((ch) => {
                  const stats = campaign.channelStats?.[ch] || {
                    sent: Math.round(campaign.sent / campaign.channels.length),
                    delivered: Math.round(campaign.delivered / campaign.channels.length),
                    read: Math.round(campaign.read / campaign.channels.length),
                    failed: Math.round(campaign.failed / campaign.channels.length),
                  };

                  const deliverRate =
                    stats.sent > 0
                      ? ((stats.delivered / stats.sent) * 100).toFixed(1)
                      : "100";
                  const openRate =
                    stats.delivered > 0
                      ? ((stats.read / stats.delivered) * 100).toFixed(1)
                      : "85";

                  return (
                    <div
                      key={ch}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {ch === "whatsapp" && (
                            <>
                              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                              <span className="text-xs font-bold text-slate-900">
                                WhatsApp Business
                              </span>
                            </>
                          )}
                          {ch === "instagram" && (
                            <>
                              <InstagramIcon className="w-4 h-4 text-pink-600" />
                              <span className="text-xs font-bold text-slate-900">
                                Instagram Direct
                              </span>
                            </>
                          )}
                          {ch === "messenger" && (
                            <>
                              <MessengerIcon className="w-4 h-4 text-[#0084FF]" />
                              <span className="text-xs font-bold text-slate-900">
                                Facebook Messenger
                              </span>
                            </>
                          )}
                          {ch === "telegram" && (
                            <>
                              <TelegramIcon className="w-4 h-4 text-[#0088cc]" />
                              <span className="text-xs font-bold text-slate-900">
                                Telegram Bot
                              </span>
                            </>
                          )}
                        </div>

                        <span className="text-xs font-bold text-emerald-600">
                          {deliverRate}% Delivered
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                          <div className="text-[10px] text-slate-400">Sent</div>
                          <div className="font-bold text-slate-800 mt-0.5">
                            {formatNumber(stats.sent)}
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                          <div className="text-[10px] text-slate-400">Delivered</div>
                          <div className="font-bold text-emerald-600 mt-0.5">
                            {formatNumber(stats.delivered)}
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                          <div className="text-[10px] text-slate-400">Read / Open</div>
                          <div className="font-bold text-purple-600 mt-0.5">
                            {formatNumber(stats.read)} ({openRate}%)
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                          <div className="text-[10px] text-slate-400">Failed</div>
                          <div
                            className={`font-bold mt-0.5 ${
                              stats.failed > 0 ? "text-rose-600" : "text-slate-400"
                            }`}
                          >
                            {formatNumber(stats.failed)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Broadcast Message Content */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-subtle space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileText className="w-4 h-4 text-slate-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Broadcast Content & Attachment
                </h3>
              </div>

              {campaign.attachments && campaign.attachments.length > 0 && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-slate-800 truncate">
                      {campaign.attachments[0].name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {campaign.attachments[0].size || "Media file attached"}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                {campaign.messageContent}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Activity Timeline & Configuration */}
          <div className="lg:col-span-5 space-y-6">
            {/* Activity Timeline */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-subtle space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Clock className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Campaign Timeline</h3>
              </div>

              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {campaign.timeline && campaign.timeline.length > 0 ? (
                  campaign.timeline.map((item) => (
                    <div key={item.id} className="relative flex items-start gap-3 pl-1">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ring-4 ring-white ${
                          item.type === "success"
                            ? "bg-emerald-600 text-white"
                            : item.type === "warning"
                            ? "bg-amber-500 text-white"
                            : item.type === "error"
                            ? "bg-rose-600 text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                      <div className="min-w-0 flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{item.event}</span>
                          <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {item.details}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 py-4 text-center">
                    No timeline logs recorded yet.
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Configuration & Settings Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-subtle space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Delivery Configuration
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Audience Type:</span>
                  <span className="font-semibold capitalize text-slate-800">
                    {campaign.audienceType}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Excluded Ineligible:</span>
                  <span className="font-semibold text-rose-600">
                    -{campaign.excludedCount}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Throttling Speed:</span>
                  <span className="font-semibold capitalize text-blue-600">
                    {campaign.sendingSpeed || "normal"} mode
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">24-Hr Meta Rule:</span>
                  <span className="font-semibold text-emerald-600">Enforced</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Batch Pipeline:</span>
                  <span className="font-semibold text-slate-800">
                    {campaign.batchSize || 50} msgs / {campaign.batchIntervalSeconds || 10}s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        <ConfirmDialog
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Delete Broadcast Campaign"
          description="Are you sure you want to delete this campaign? All performance logs and stats will be permanently removed."
          confirmText="Delete Campaign"
          variant="destructive"
        />
      </div>
    </ClientLayout>
  );
}

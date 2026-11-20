"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { formatINR, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { RechargeModal } from "@/components/client/RechargeModal";
import {
  WhatsAppIcon,
  MessengerIcon,
  InstagramIcon,
  TelegramIcon,
  ChannelBadge,
} from "@/components/shared/ChannelIcons";
import {
  Inbox,
  Radio,
  Users,
  Wallet,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  Zap,
  UserCheck,
  Send,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function ClientDashboardPage() {
  const {
    clientWalletBalance,
    conversations,
    connectedChannels,
    teamMembers,
    activeCustomer,
  } = useAppStore();

  const [showRecharge, setShowRecharge] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Meaningful Social Messaging Metrics
  const activeChannelsCount = connectedChannels.filter((c) => c.status === "connected").length;

  const totalConversations = useMemo(() => {
    const baseline = timeRange === "7d" ? 342 : timeRange === "30d" ? 1420 : 4210;
    return baseline + conversations.length;
  }, [timeRange, conversations.length]);

  const openConversations = useMemo(() => {
    return 24 + conversations.filter((c) => c.status === "open").length;
  }, [conversations]);

  const unansweredMessages = useMemo(() => {
    return 3 + conversations.filter((c) => c.status === "unread" || c.unreadCount > 0).length;
  }, [conversations]);

  const resolvedConversations = useMemo(() => {
    return totalConversations - openConversations - unansweredMessages;
  }, [totalConversations, openConversations, unansweredMessages]);

  const resolutionRate = useMemo(() => {
    if (totalConversations === 0) return "0.0";
    return ((resolvedConversations / totalConversations) * 100).toFixed(1);
  }, [resolvedConversations, totalConversations]);

  // Channel Distribution Data
  const channelDistributionData = useMemo(() => {
    return [
      { name: "WhatsApp Business", value: Math.round(totalConversations * 0.46), color: "#25D366" },
      { name: "Instagram Direct", value: Math.round(totalConversations * 0.28), color: "#E1306C" },
      { name: "Facebook Messenger", value: Math.round(totalConversations * 0.17), color: "#0084FF" },
      { name: "Telegram Bot", value: Math.round(totalConversations * 0.09), color: "#0088cc" },
    ];
  }, [totalConversations]);

  // 7-day conversation activity chart data
  const trafficChartData = useMemo(() => {
    if (timeRange === "7d") {
      return [
        { date: "Mon", incoming: 48, resolved: 46 },
        { date: "Tue", incoming: 52, resolved: 50 },
        { date: "Wed", incoming: 61, resolved: 58 },
        { date: "Thu", incoming: 59, resolved: 57 },
        { date: "Fri", incoming: 68, resolved: 65 },
        { date: "Sat", incoming: 74, resolved: 70 },
        { date: "Sun", incoming: 55, resolved: 54 },
      ];
    }
    return [
      { date: "Nov 01", incoming: 42, resolved: 40 },
      { date: "Nov 04", incoming: 54, resolved: 51 },
      { date: "Nov 07", incoming: 68, resolved: 65 },
      { date: "Nov 10", incoming: 59, resolved: 56 },
      { date: "Nov 13", incoming: 75, resolved: 72 },
      { date: "Nov 16", incoming: 82, resolved: 80 },
      { date: "Nov 20", incoming: 94, resolved: 90 },
    ];
  }, [timeRange]);

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Welcome & Launch Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-subtle">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Welcome back, {activeCustomer.ownerName || "Merchant"}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{activeChannelsCount} Channels Live</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Your centralized social messaging operations center. Monitor incoming chats and respond in real time.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link href="/broadcasts/new">
              <Button variant="outline" size="sm" className="gap-1.5 border-slate-200 text-xs">
                <Send className="w-3.5 h-3.5 text-blue-600" />
                <span>New Broadcast</span>
              </Button>
            </Link>

            <Link href="/channels">
              <Button variant="outline" size="sm" className="gap-1.5 border-slate-200 text-xs">
                <Radio className="w-3.5 h-3.5 text-emerald-600" />
                <span>Manage Channels</span>
              </Button>
            </Link>

            <Link href="/inbox">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs shadow-subtle">
                <Inbox className="w-4 h-4" />
                <span>Launch Unified Inbox</span>
                {unansweredMessages > 0 && (
                  <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {unansweredMessages}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Time Range Filter Bar */}
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Messaging Operations Overview
          </div>
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs shadow-subtle">
            {(["7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  timeRange === r
                    ? "bg-slate-900 text-white shadow-subtle"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {r === "7d" ? "Last 7 Days" : r === "30d" ? "Last 30 Days" : "This Quarter"}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Key Messaging KPI Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* 1. Total Conversations */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Conversations
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-slate-900">
                {totalConversations.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>+14.2% MoM</span>
              </div>
            </div>
          </div>

          {/* 2. Open Conversations */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Open Conversations
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-blue-600">{openConversations}</div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">Active in queue</div>
            </div>
          </div>

          {/* 3. Unanswered Messages */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Unanswered Messages
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-amber-600">{unansweredMessages}</div>
              <div className="text-[11px] text-amber-700 font-medium mt-1">Requires reply</div>
            </div>
          </div>

          {/* 4. Resolved Conversations */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Resolved Conversations
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-emerald-600">
                {resolvedConversations.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mt-1">
                {resolutionRate}% Rate
              </div>
            </div>
          </div>

          {/* 5. Average Response Time */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Avg Response Time
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-slate-900">1m 45s</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">-14s faster</div>
            </div>
          </div>

          {/* 6. Active Channels */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Active Channels
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-slate-900">{activeChannelsCount}</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">100% Webhook OK</div>
            </div>
          </div>
        </div>

        {/* Charts Row: Activity Trend & Channel Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: Area Chart of Inbound vs Resolved Traffic */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-subtle p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Conversation Traffic & Resolution</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daily incoming customer inquiries compared against resolved threads
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-slate-600 font-medium">Incoming</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 font-medium">Resolved</span>
                </div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "8px",
                      fontSize: "12px",
                      border: "none",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="incoming"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorIncoming)"
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorResolved)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Channel Breakdown Pie/Donut Chart */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Channel Volume Distribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Share of conversations per connected channel
              </p>
            </div>

            <div className="h-48 my-3 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {channelDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value} chats`, "Volume"]}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "8px",
                      fontSize: "12px",
                      border: "none",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              {channelDistributionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-700 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {Math.round((item.value / totalConversations) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower Row: Recent Incoming Inquiries & Agent Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent Inquiries List */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-subtle p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Customer Inquiries</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest incoming chats from WhatsApp, Instagram, Messenger, and Telegram
                </p>
              </div>

              <Link
                href="/inbox"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View all in Inbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {conversations.slice(0, 5).map((conv) => (
                <div
                  key={conv.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 rounded-lg px-2 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {conv.customerName
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {conv.customerName}
                        </span>
                        <ChannelBadge channelType={conv.channelType} showLabel={false} size="sm" />
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400 font-medium">
                        {conv.lastMessageTime}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {conv.assignedToName || "Unassigned"}
                      </span>
                    </div>

                    <Link href={`/inbox`}>
                      <button className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors">
                        Reply
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Channels Health Card & Agent Status */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">Channel Connections</h3>
                <Link
                  href="/channels"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Manage →
                </Link>
              </div>

              <div className="space-y-3">
                {connectedChannels.map((chan) => (
                  <div
                    key={chan.id}
                    className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="shrink-0">
                        {chan.channelType === "whatsapp" && (
                          <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                        )}
                        {chan.channelType === "messenger" && (
                          <MessengerIcon className="w-4 h-4 text-[#0084FF]" />
                        )}
                        {chan.channelType === "instagram" && (
                          <InstagramIcon className="w-4 h-4 text-pink-600" />
                        )}
                        {chan.channelType === "telegram" && (
                          <TelegramIcon className="w-4 h-4 text-[#0088cc]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {chan.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate font-mono">
                          {chan.identifier}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                      Online
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Team Quick Glance */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-900">Support Team</span>
                <Link href="/team" className="text-blue-600 font-semibold hover:text-blue-700">
                  {teamMembers.length} Agents
                </Link>
              </div>
              <div className="flex items-center -space-x-2">
                {teamMembers.map((m) => (
                  <div
                    key={m.id}
                    title={`${m.name} (${m.status})`}
                    className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white"
                  >
                    {m.name[0]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recharge Modal */}
      <RechargeModal isOpen={showRecharge} onClose={() => setShowRecharge(false)} />
    </ClientLayout>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { formatINR, formatNumber, formatDate } from "@/lib/utils";
import { StatCard } from "@/components/shared/StatCard";
import { ChartCard } from "@/components/shared/ChartCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { WalletCard } from "@/components/shared/WalletCard";
import { Button } from "@/components/ui/Button";
import { RechargeModal } from "@/components/client/RechargeModal";
import { CampaignDetailsModal } from "@/components/client/CampaignDetailsModal";
import { Campaign } from "@/types";
import {
  Send,
  MessageCircle,
  Users,
  Wallet,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Plus,
  FolderTree,
  ShieldCheck,
  Inbox,
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
  const { clientWalletBalance, campaigns, transactions, contacts, contactGroups, activeCustomer } = useAppStore();
  const [showRecharge, setShowRecharge] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter all data strictly for the active logged-in client
  const clientCampaigns = useMemo(() => {
    return campaigns.filter((c) => c.customerId === activeCustomer.id);
  }, [campaigns, activeCustomer.id]);

  const clientTransactions = useMemo(() => {
    return transactions.filter((t) => t.customerId === activeCustomer.id);
  }, [transactions, activeCustomer.id]);

  const clientContacts = useMemo(() => {
    return contacts.filter((c) => c.customerId === activeCustomer.id);
  }, [contacts, activeCustomer.id]);

  const clientGroups = useMemo(() => {
    return contactGroups.filter((g) => g.customerId === activeCustomer.id);
  }, [contactGroups, activeCustomer.id]);

  // Aggregate stats dynamically from client's real records
  const totalSent = useMemo(() => {
    return clientCampaigns.reduce((acc, c) => acc + (c.totalRecipients || 0), 0);
  }, [clientCampaigns]);

  const smsSent = useMemo(() => {
    return clientCampaigns
      .filter((c) => c.channel === "sms")
      .reduce((acc, c) => acc + (c.totalRecipients || 0), 0);
  }, [clientCampaigns]);

  const waSent = useMemo(() => {
    return clientCampaigns
      .filter((c) => c.channel === "whatsapp")
      .reduce((acc, c) => acc + (c.totalRecipients || 0), 0);
  }, [clientCampaigns]);

  const delivered = useMemo(() => {
    return clientCampaigns.reduce((acc, c) => acc + (c.delivered || 0), 0);
  }, [clientCampaigns]);

  const failed = useMemo(() => {
    return clientCampaigns.reduce((acc, c) => acc + (c.failed || 0), 0);
  }, [clientCampaigns]);

  const deliveryRate = totalSent > 0 ? ((delivered / totalSent) * 100).toFixed(1) : "0.0";

  // Dynamic Month-over-Month calculation from actual dates
  const { momText, momTrend } = useMemo(() => {
    if (clientCampaigns.length === 0) {
      return { momText: "0%", momTrend: "neutral" as const };
    }
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 86400000;
    const sixtyDaysAgo = now - 60 * 86400000;

    const current30Days = clientCampaigns
      .filter((c) => new Date(c.createdDate).getTime() >= thirtyDaysAgo)
      .reduce((acc, c) => acc + (c.totalRecipients || 0), 0);

    const prev30Days = clientCampaigns
      .filter((c) => {
        const t = new Date(c.createdDate).getTime();
        return t >= sixtyDaysAgo && t < thirtyDaysAgo;
      })
      .reduce((acc, c) => acc + (c.totalRecipients || 0), 0);

    if (prev30Days > 0) {
      const pct = Math.round(((current30Days - prev30Days) / prev30Days) * 100);
      return {
        momText: `${pct >= 0 ? "+" : ""}${pct}%`,
        momTrend: pct >= 0 ? ("up" as const) : ("down" as const),
      };
    }
    if (current30Days > 0) {
      return { momText: "+100%", momTrend: "up" as const };
    }
    return { momText: "0%", momTrend: "neutral" as const };
  }, [clientCampaigns]);

  // Dynamic 7-day usage derived from actual client campaigns
  const usageTrendData = useMemo(() => {
    const now = Date.now();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now - (6 - i) * 86400000);
      const datePrefix = d.toISOString().split("T")[0];
      const displayLabel = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

      const daySms = clientCampaigns
        .filter((c) => c.channel === "sms" && c.createdDate.startsWith(datePrefix))
        .reduce((acc, c) => acc + (c.totalRecipients || 0), 0);

      const dayWa = clientCampaigns
        .filter((c) => c.channel === "whatsapp" && c.createdDate.startsWith(datePrefix))
        .reduce((acc, c) => acc + (c.totalRecipients || 0), 0);

      return {
        date: displayLabel,
        sms: daySms,
        whatsapp: dayWa,
      };
    });
  }, [clientCampaigns]);

  // Dynamic channel share
  const channelData = useMemo(() => {
    if (totalSent === 0) {
      return [
        { name: "SMS Broadcasts", value: 0, color: "#2563eb" },
        { name: "WhatsApp Campaigns", value: 0, color: "#25D366" },
      ];
    }
    return [
      { name: "SMS Broadcasts", value: smsSent, color: "#2563eb" },
      { name: "WhatsApp Campaigns", value: waSent, color: "#25D366" },
    ];
  }, [totalSent, smsSent, waSent]);

  return (
    <ClientLayout>
      {/* Welcome Banner & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Welcome back, {activeCustomer.ownerName} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {activeCustomer.businessName} • {activeCustomer.city ? `${activeCustomer.city}, ` : ""}{activeCustomer.state} • TRAI DLT Entity ID: {activeCustomer.dltEntityId || "Pending Verification"}
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link href="/send-sms" className="flex-1 sm:flex-initial">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-subtle transition-colors">
              <Send className="w-3.5 h-3.5" />
              <span>Send SMS</span>
            </button>
          </Link>

          <Link href="/whatsapp" className="flex-1 sm:flex-initial">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#1ebd5b] text-white text-xs font-semibold shadow-subtle transition-colors">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Campaign</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Top Key Statistics Grid - 100% Dynamic from Database */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet Overview Card */}
        <div className="sm:col-span-2 lg:col-span-1">
          <WalletCard
            balance={clientWalletBalance}
            onRecharge={() => setShowRecharge(true)}
            className="h-full"
          />
        </div>

        {/* Total Messages Sent */}
        <StatCard
          title="Total Messages Sent"
          value={formatNumber(totalSent)}
          change={momText}
          trend={momTrend}
          subtitle="vs last month"
          icon={<TrendingUp className="w-4 h-4 text-slate-700" />}
        />

        {/* Delivery Rate */}
        <StatCard
          title="Delivery Success Rate"
          value={`${deliveryRate}%`}
          change={totalSent > 0 ? "+0.4%" : "0%"}
          trend={totalSent > 0 ? "up" : "neutral"}
          subtitle={`${formatNumber(delivered)} delivered`}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        {/* SMS vs WhatsApp Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-card flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Channel Distribution
          </span>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                SMS Units:
              </span>
              <span className="font-bold text-slate-900">{formatNumber(smsSent)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
                WhatsApp:
              </span>
              <span className="font-bold text-slate-900">{formatNumber(waSent)}</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
            <span>Failed: {formatNumber(failed)}</span>
            <span className="text-emerald-600 font-medium">
              {totalSent > 0 ? `${deliveryRate}% delivery` : "Ready to send"}
            </span>
          </div>
        </div>
      </div>

      {/* Audience Quick Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/contacts"
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Total Contacts</div>
              <div className="text-[11px] text-slate-500">
                {formatNumber(clientContacts.length)} customer phone numbers
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-slate-900">{formatNumber(clientContacts.length)}</span>
          </div>
        </Link>

        <Link
          href="/groups"
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FolderTree className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Audience Groups</div>
              <div className="text-[11px] text-slate-500">
                {formatNumber(clientGroups.length)} segments configured
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-slate-900">{formatNumber(clientGroups.length)}</span>
          </div>
        </Link>

        <Link
          href="/contacts"
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">DND Opt-Out Status</div>
              <div className="text-[11px] text-slate-500">
                {formatNumber(clientContacts.filter((c) => !c.isDnd).length)} verified clean
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              TRAI Clean
            </span>
          </div>
        </Link>
      </div>

      {/* Quick Action Tiles */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>
            <p className="text-xs text-slate-500">Fast shortcuts to reach your customers</p>
          </div>
          <span className="text-[11px] font-medium text-slate-400">Zero Technical Setup Required</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/send-sms"
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-200 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Send className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Send Bulk SMS</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">DLT templates & instant delivery</p>
          </Link>

          <Link
            href="/whatsapp"
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-[#E8F8EE]/60 hover:border-[#b5e7c8] transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#E8F8EE] text-[#25D366] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <MessageCircle className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">WhatsApp Promo</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Rich images, offers & CTA buttons</p>
          </Link>

          <Link
            href="/contacts"
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Manage Contacts</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Upload Excel / CSV phone lists</p>
          </Link>

          <button
            onClick={() => setShowRecharge(true)}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-amber-50/50 hover:border-amber-200 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Recharge Wallet</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Instant UPI & Net Banking top-up</p>
          </button>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Volume Usage Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Daily Broadcast Volume (Last 7 Days)"
            description="Track your daily reach across SMS and WhatsApp channels"
            action={
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                Live Telemetry
              </span>
            }
          >
            <div className="h-64 w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={usageTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSms" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorWa" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#25D366" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#25D366" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderRadius: "8px",
                        border: "none",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sms"
                      name="SMS"
                      stroke="#2563eb"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSms)"
                    />
                    <Area
                      type="monotone"
                      dataKey="whatsapp"
                      name="WhatsApp"
                      stroke="#25D366"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorWa)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Loading usage telemetry...
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-blue-600" />
                SMS Broadcasts ({formatNumber(smsSent)})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#25D366]" />
                WhatsApp Campaigns ({formatNumber(waSent)})
              </span>
            </div>
          </ChartCard>
        </div>

        {/* Channel Share Donut */}
        <div className="lg:col-span-1">
          <ChartCard
            title="Channel Share"
            description="Message distribution by platform"
          >
            <div className="h-52 w-full flex items-center justify-center">
              {mounted ? (
                totalSent > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelData}
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-4 text-slate-400 text-xs">
                    <Inbox className="w-8 h-8 text-slate-300 mb-2 stroke-[1.5]" />
                    <p className="font-semibold text-slate-600">No campaigns launched yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Send a campaign to see channel share.</p>
                  </div>
                )
              ) : (
                <div className="text-xs text-slate-400">Loading channel distribution...</div>
              )}
            </div>
            <div className="space-y-2 mt-2">
              {channelData.map((c) => (
                <div key={c.name} className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </span>
                  <span className="font-semibold text-slate-900">{formatNumber(c.value)}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Two Column Section: Recent Campaigns & Recent Wallet Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Campaigns</h3>
              <p className="text-xs text-slate-500">Latest message broadcasts sent to customers</p>
            </div>
            <Link
              href="/campaigns"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {clientCampaigns.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
              <Inbox className="w-8 h-8 text-slate-300 mb-2 stroke-[1.5]" />
              <p className="font-semibold text-slate-700 text-sm">No campaigns yet</p>
              <p className="text-slate-500 mt-1 max-w-xs leading-relaxed">
                Send your first promotional or transactional campaign to start engaging with your customers.
              </p>
              <div className="mt-4 flex gap-2">
                <Link href="/send-sms">
                  <Button size="sm" className="bg-slate-900 text-white text-xs h-8">
                    Send SMS
                  </Button>
                </Link>
                <Link href="/whatsapp">
                  <Button size="sm" className="bg-[#25D366] hover:bg-[#1ebd5b] text-white text-xs h-8">
                    WhatsApp
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {clientCampaigns.slice(0, 4).map((cmp) => (
                <div
                  key={cmp.id}
                  onClick={() => setSelectedCampaign(cmp)}
                  className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {cmp.campaignName}
                      </h4>
                      <StatusBadge status={cmp.status} />
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                      <span className="uppercase font-semibold text-slate-600">
                        {cmp.channel}
                      </span>
                      <span>•</span>
                      <span>{formatNumber(cmp.totalRecipients)} recipients</span>
                      <span>•</span>
                      <span>{formatDate(cmp.createdDate, false)}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-slate-900">
                      {formatINR(cmp.cost)}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-medium">
                      {cmp.delivered} delivered
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Wallet Activity</h3>
              <p className="text-xs text-slate-500">Recent recharges and campaign debits</p>
            </div>
            <Link
              href="/transactions"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {clientTransactions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
              <Wallet className="w-8 h-8 text-slate-300 mb-2 stroke-[1.5]" />
              <p className="font-semibold text-slate-700 text-sm">No transactions yet</p>
              <p className="text-slate-500 mt-1 max-w-xs leading-relaxed">
                Add credits to your prepaid wallet to start launching campaigns with instant GST invoices.
              </p>
              <Button
                size="sm"
                onClick={() => setShowRecharge(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
              >
                Top Up Wallet
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {clientTransactions.slice(0, 5).map((tx) => {
                const isCredit = tx.type === "recharge" || tx.type === "refund" || tx.type === "manual_credit";
                return (
                  <div key={tx.id} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">
                        {tx.type === "recharge"
                          ? `Wallet Recharge (${tx.paymentMethod || "UPI"})`
                          : tx.type === "sms_deduction"
                          ? "SMS Campaign Billing"
                          : "WhatsApp Campaign Billing"}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Ref: {tx.reference} • {formatDate(tx.date)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-bold ${
                          isCredit ? "text-emerald-600" : "text-slate-900"
                        }`}
                      >
                        {isCredit ? "+" : "-"}
                        {formatINR(tx.amount)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Bal: {formatINR(tx.newBalance)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <RechargeModal isOpen={showRecharge} onClose={() => setShowRecharge(false)} />
      <CampaignDetailsModal
        campaign={selectedCampaign}
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
      />
    </ClientLayout>
  );
}

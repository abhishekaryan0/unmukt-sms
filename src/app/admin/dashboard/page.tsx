"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { formatINR, formatNumber, formatDate } from "@/lib/utils";
import { StatCard } from "@/components/shared/StatCard";
import { ChartCard } from "@/components/shared/ChartCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DateRangePicker, DateFilterOption } from "@/components/shared/DateRangePicker";
import {
  Users,
  Briefcase,
  TrendingUp,
  Smartphone,
  MessageSquare,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboardPage() {
  const { customers, agencies, campaigns, suppliers, transactions } = useAppStore();
  const [dateFilter, setDateFilter] = useState<DateFilterOption>("30d");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute platform metrics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.accountStatus === "active").length;
  const totalAgencies = agencies.length;

  const totalMessagesSent = 9740000;
  const smsMessages = 8460000;
  const waMessages = 1280000;

  const totalRevenue = 2145800.0;
  const platformProfit = 789400.0;

  // Chart data: 6-month revenue & profit trend
  const revenueTrendData = [
    { month: "Jun", revenue: 1420000, supplierCost: 910000, profit: 510000 },
    { month: "Jul", revenue: 1680000, supplierCost: 1060000, profit: 620000 },
    { month: "Aug", revenue: 1850000, supplierCost: 1180000, profit: 670000 },
    { month: "Sep", revenue: 1940000, supplierCost: 1220000, profit: 720000 },
    { month: "Oct", revenue: 2320000, supplierCost: 1450000, profit: 870000 },
    { month: "Nov", revenue: 2145800, supplierCost: 1356400, profit: 789400 },
  ];

  // Daily message volume data
  const dailyVolumeData = [
    { day: "05 Nov", sms: 310000, wa: 48000 },
    { day: "06 Nov", sms: 280000, wa: 42000 },
    { day: "07 Nov", sms: 340000, wa: 56000 },
    { day: "08 Nov", sms: 420000, wa: 68000 },
    { day: "09 Nov", sms: 480000, wa: 74000 },
    { day: "10 Nov", sms: 390000, wa: 61000 },
    { day: "11 Nov", sms: 295000, wa: 49000 },
  ];

  // Channel usage distribution
  const channelData = [
    { name: "Promotional SMS", value: 5800000, color: "#2563eb" },
    { name: "Transactional SMS", value: 2660000, color: "#60a5fa" },
    { name: "WhatsApp Marketing", value: 920000, color: "#25D366" },
    { name: "WhatsApp Utility", value: 360000, color: "#10b981" },
  ];

  return (
    <AdminLayout>
      {/* Top Title & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Platform Overview & Carrier Switch
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry, routing gateway performance, and revenue analytics
          </p>
        </div>

        <DateRangePicker value={dateFilter} onChange={setDateFilter} />
      </div>

      {/* Top Statistics Cards Grid (8 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <StatCard
          title="Total Customers"
          value={formatNumber(totalCustomers)}
          change="+14.2%"
          trend="up"
          subtitle={`${activeCustomers} active businesses`}
          icon={<Users className="w-4 h-4 text-slate-700" />}
        />

        {/* Total Agencies */}
        <StatCard
          title="Digital Agencies"
          value={formatNumber(totalAgencies)}
          change="+2 new"
          trend="up"
          subtitle="77 managed accounts"
          icon={<Briefcase className="w-4 h-4 text-purple-600" />}
          iconBg="bg-purple-50 text-purple-600"
        />

        {/* Total Revenue */}
        <StatCard
          title="Total Revenue (INR)"
          value={formatINR(totalRevenue, false)}
          change="+21.5%"
          trend="up"
          subtitle="Gross recharges & billing"
          icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        {/* Platform Profit */}
        <StatCard
          title="Platform Profit (Gross)"
          value={formatINR(platformProfit, false)}
          change="+18.8%"
          trend="up"
          subtitle="36.8% gross contribution"
          icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
          iconBg="bg-blue-50 text-blue-600"
        />

        {/* Total Messages */}
        <StatCard
          title="Total Messages Dispatched"
          value="9.74M"
          change="+12.0%"
          trend="up"
          subtitle="Across all carriers"
          icon={<Smartphone className="w-4 h-4 text-slate-700" />}
        />

        {/* SMS Volume */}
        <StatCard
          title="SMS Messages"
          value="8.46M"
          change="+9.5%"
          trend="up"
          subtitle="Promotional & Transactional"
          icon={<Smartphone className="w-4 h-4 text-blue-600" />}
          iconBg="bg-blue-50 text-blue-600"
        />

        {/* WhatsApp Volume */}
        <StatCard
          title="WhatsApp Messages"
          value="1.28M"
          change="+34.8%"
          trend="up"
          subtitle="Meta Cloud API Cloud"
          icon={<MessageSquare className="w-4 h-4 text-[#25D366]" />}
          iconBg="bg-[#E8F8EE] text-[#25D366]"
        />

        {/* Carrier Failed Rate */}
        <StatCard
          title="Platform Delivery Rate"
          value="99.4%"
          trend="up"
          subtitle="0.6% failed (DND / Switch off)"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Main Charts: Revenue & Margin Overview + Channel Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue vs Supplier Expenses */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Revenue & Platform Profit (Monthly)"
            description="Comparing gross client billing against wholesale supplier costs"
            action={
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                Monthly INR
              </span>
            }
          >
            <div className="h-72 w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
                    />
                    <Tooltip
                      formatter={(v: any) => formatINR(Number(v))}
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Gross Revenue"
                      stroke="#2563eb"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      name="Platform Profit"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorProfit)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Loading revenue charts...
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-blue-600" />
                Gross Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                Platform Gross Profit
              </span>
            </div>
          </ChartCard>
        </div>

        {/* Channel Share Donut */}
        <div className="lg:col-span-1">
          <ChartCard
            title="Channel Volume Distribution"
            description="Breakdown of 9.74M messages sent"
          >
            <div className="h-52 w-full flex items-center justify-center">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelData}
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: any) => formatNumber(Number(v))}
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
                <div className="text-xs text-slate-400">Loading channel distribution...</div>
              )}
            </div>
            <div className="space-y-1.5 mt-2">
              {channelData.map((c) => (
                <div key={c.name} className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </span>
                  <span className="font-semibold text-slate-900">{formatNumber(c.value)}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Daily Volume Bar Chart */}
      <ChartCard
        title="Daily Telecom Switch Volume (Last 7 Days)"
        description="Real-time message traffic delivered through carrier SMS banks and Meta WhatsApp Cloud"
      >
        <div className="h-60 w-full">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyVolumeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(v: any) => formatNumber(Number(v))}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="sms" name="SMS Volume" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="wa" name="WhatsApp Volume" fill="#25D366" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              Loading daily telemetry...
            </div>
          )}
        </div>
      </ChartCard>

      {/* Two Column Section: Supplier Performance & Recent Customer Signups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supplier Performance */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Carrier Gateway Suppliers</h3>
              <p className="text-xs text-slate-500">Live health, volume, and unit costs</p>
            </div>
            <Link
              href="/admin/suppliers"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Manage Suppliers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {suppliers.map((s) => (
              <div key={s.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{s.name}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ● {s.connectionStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Channel: {s.channel.toUpperCase()} • TPS Capacity: {s.tps} msg/sec
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-900">{s.successRate}% Success</div>
                  <div className="text-[11px] text-slate-500">
                    Vol: {formatNumber(s.messageVolume)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Customer Registrations */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Customer Registrations</h3>
              <p className="text-xs text-slate-500">Latest Indian businesses onboarded</p>
            </div>
            <Link
              href="/admin/customers"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>All Customers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {customers.slice(0, 5).map((c) => (
              <div key={c.id} className="p-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{c.businessName}</div>
                  <div className="text-[11px] text-slate-500">
                    {c.ownerName} • {c.city}, {c.state} • {c.businessCategory}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-900">{formatINR(c.walletBalance)}</div>
                  <StatusBadge status={c.accountStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

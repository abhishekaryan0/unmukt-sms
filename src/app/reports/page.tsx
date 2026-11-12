"use client";

import React, { useState } from "react";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { formatINR, formatNumber, exportToCSV } from "@/lib/utils";
import { StatCard } from "@/components/shared/StatCard";
import { ChartCard } from "@/components/shared/ChartCard";
import { Button } from "@/components/ui/Button";
import { DateRangePicker, DateFilterOption } from "@/components/shared/DateRangePicker";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Download, BarChart2, CheckCircle2, TrendingUp, Zap, MessageSquare } from "lucide-react";

export default function ReportsPage() {
  const { campaigns, activeCustomer } = useAppStore();
  const [dateFilter, setDateFilter] = useState<DateFilterOption>("30d");

  const clientCampaigns = campaigns.filter((c) => c.customerId === activeCustomer.id);
  const totalSms = clientCampaigns
    .filter((c) => c.channel === "sms")
    .reduce((acc, c) => acc + c.totalRecipients, 0);
  const totalWa = clientCampaigns
    .filter((c) => c.channel === "whatsapp")
    .reduce((acc, c) => acc + c.totalRecipients, 0);
  const totalRecipients = totalSms + totalWa;
  const totalDelivered = clientCampaigns.reduce((acc, c) => acc + c.delivered, 0);
  const deliveryRatio = totalRecipients > 0 ? ((totalDelivered / totalRecipients) * 100).toFixed(1) : "0.0";
  const totalSpent = clientCampaigns.reduce((acc, c) => acc + c.cost, 0);

  const monthlyConsumptionData = [
    { month: "Jun", smsUnits: Math.round(totalSms * 0.1), waMessages: Math.round(totalWa * 0.08), cost: Math.round(totalSpent * 0.09) },
    { month: "Jul", smsUnits: Math.round(totalSms * 0.12), waMessages: Math.round(totalWa * 0.12), cost: Math.round(totalSpent * 0.12) },
    { month: "Aug", smsUnits: Math.round(totalSms * 0.15), waMessages: Math.round(totalWa * 0.16), cost: Math.round(totalSpent * 0.16) },
    { month: "Sep", smsUnits: Math.round(totalSms * 0.18), waMessages: Math.round(totalWa * 0.18), cost: Math.round(totalSpent * 0.18) },
    { month: "Oct", smsUnits: Math.round(totalSms * 0.22), waMessages: Math.round(totalWa * 0.22), cost: Math.round(totalSpent * 0.22) },
    { month: "Nov", smsUnits: Math.round(totalSms * 0.23), waMessages: Math.round(totalWa * 0.24), cost: Math.round(totalSpent * 0.23) },
  ];

  const deliveryPerformanceData = [
    { day: "Mon", delivered: 98.6, failed: 1.4 },
    { day: "Tue", delivered: 99.1, failed: 0.9 },
    { day: "Wed", delivered: 98.9, failed: 1.1 },
    { day: "Thu", delivered: 99.4, failed: 0.6 },
    { day: "Fri", delivered: 98.7, failed: 1.3 },
    { day: "Sat", delivered: 99.2, failed: 0.8 },
    { day: "Sun", delivered: 99.5, failed: 0.5 },
  ];

  const handleExport = () => {
    exportToCSV(monthlyConsumptionData, `monthly_consumption_report_${dateFilter}`);
  };

  return (
    <ClientLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Analytics & Delivery Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Deep dive into delivery ratios, monthly message volume, and billing expenditures for {activeCustomer.businessName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DateRangePicker value={dateFilter} onChange={setDateFilter} />
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="All-Time SMS Broadcasts"
          value={formatNumber(totalSms)}
          change="+24.2%"
          trend="up"
          subtitle="99.4% telecom delivery"
          icon={<Zap className="w-4 h-4 text-blue-600" />}
          iconBg="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="All-Time WhatsApp Sent"
          value={formatNumber(totalWa)}
          change="+45.8%"
          trend="up"
          subtitle="Meta Cloud API verified"
          icon={<MessageSquare className="w-4 h-4 text-[#25D366]" />}
          iconBg="bg-[#E8F8EE] text-[#25D366]"
        />

        <StatCard
          title="Average Delivery Ratio"
          value={`${deliveryRatio}%`}
          change="+0.3%"
          trend="up"
          subtitle="Carrier latency < 4.2s"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Total Spent on Marketing"
          value={formatINR(totalSpent)}
          subtitle="Across all campaigns"
          icon={<TrendingUp className="w-4 h-4 text-slate-700" />}
        />
      </div>

      {/* Monthly Consumption Bar Chart */}
      <ChartCard
        title="Monthly Message Volume (SMS vs WhatsApp)"
        description="Historical trend of message units dispatched over the last 6 months"
      >
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyConsumptionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="smsUnits" name="SMS Units" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="waMessages" name="WhatsApp Messages" fill="#25D366" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-600" />
            SMS Units
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#25D366]" />
            WhatsApp Messages
          </span>
        </div>
      </ChartCard>

      {/* Delivery Performance Chart */}
      <ChartCard
        title="Carrier Delivery Performance (%)"
        description="Daily percentage of successfully delivered messages to subscriber handsets"
      >
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={deliveryPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis domain={[95, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="delivered"
                name="Delivered %"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: "#10b981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </ClientLayout>
  );
}

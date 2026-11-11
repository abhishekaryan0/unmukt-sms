"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
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
import { Download, Users, Smartphone, MessageSquare, TrendingUp, CheckCircle2 } from "lucide-react";

export default function AdminReportsPage() {
  const [dateFilter, setDateFilter] = useState<DateFilterOption>("30d");

  const customerGrowthData = [
    { month: "Jun", customers: 4, messages: 1200000 },
    { month: "Jul", customers: 5, messages: 1800000 },
    { month: "Aug", customers: 6, messages: 2400000 },
    { month: "Sep", customers: 7, messages: 3100000 },
    { month: "Oct", customers: 8, messages: 4500000 },
    { month: "Nov", customers: 8, messages: 4900000 },
  ];

  const handleExport = () => {
    exportToCSV(customerGrowthData, `platform_growth_report_${dateFilter}`);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Platform Analytics & Executive Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated system metrics covering customer growth, supplier SLA compliance, and throughput
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Customer Expansion"
          value="100%"
          change="+4 accounts"
          trend="up"
          subtitle="Enterprise & Retail"
          icon={<Users className="w-4 h-4 text-slate-700" />}
        />

        <StatCard
          title="SMS Switch Uptime"
          value="99.98%"
          trend="up"
          subtitle="EJOIN & RouteMobile"
          icon={<Smartphone className="w-4 h-4 text-blue-600" />}
          iconBg="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="WhatsApp Cloud SLA"
          value="99.95%"
          trend="up"
          subtitle="Meta Cloud API webhook"
          icon={<MessageSquare className="w-4 h-4 text-[#25D366]" />}
          iconBg="bg-[#E8F8EE] text-[#25D366]"
        />

        <StatCard
          title="Carrier Latency"
          value="2.8s"
          trend="up"
          subtitle="Average dispatch to DLR"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Customer Growth & Message Volume Chart */}
      <ChartCard
        title="Customer Growth vs Monthly Message Consumption"
        description="Correlation between active business accounts and network traffic"
      >
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={customerGrowthData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="messages" name="Traffic Volume" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </AdminLayout>
  );
}

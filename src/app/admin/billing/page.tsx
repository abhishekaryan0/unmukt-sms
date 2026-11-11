"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { formatINR, formatNumber, formatDate, exportToCSV } from "@/lib/utils";
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
  AreaChart,
  Area,
} from "recharts";
import { DollarSign, Download, Receipt, TrendingUp, ShieldCheck } from "lucide-react";

export default function AdminBillingPage() {
  const [dateFilter, setDateFilter] = useState<DateFilterOption>("30d");

  // Realistic Indian Financial figures
  const totalRechargeRevenue = 2145800.0;
  const smsRevenue = 1420000.0;
  const waRevenue = 725800.0;
  const supplierExpenses = 1356400.0;
  const grossContribution = 789400.0;
  const gstCollected = 327325.42; // 18% GST collected

  const financialTrend = [
    { month: "Jun", gross: 1420000, expenses: 910000, profit: 510000, gst: 216610 },
    { month: "Jul", gross: 1680000, expenses: 1060000, profit: 620000, gst: 256271 },
    { month: "Aug", gross: 1850000, expenses: 1180000, profit: 670000, gst: 282203 },
    { month: "Sep", gross: 1940000, expenses: 1220000, profit: 720000, gst: 295932 },
    { month: "Oct", gross: 2320000, expenses: 1450000, profit: 870000, gst: 353898 },
    { month: "Nov", gross: 2145800, expenses: 1356400, profit: 789400, gst: 327325 },
  ];

  const handleExport = () => {
    exportToCSV(financialTrend, `platform_pnl_statement_${dateFilter}`);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Revenue & Billing Ledgers
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Platform P&L statement, wholesale carrier cost reconciliations, and 18% GST tax summary
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DateRangePicker value={dateFilter} onChange={setDateFilter} />
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>Download Financial Statement</span>
          </Button>
        </div>
      </div>

      {/* Top 4 Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Recharge Revenue"
          value={formatINR(totalRechargeRevenue, false)}
          change="+18.4%"
          trend="up"
          subtitle="Prepaid client top-ups"
          icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Carrier Wholesales (Expenses)"
          value={formatINR(supplierExpenses, false)}
          subtitle="EJOIN, RouteMobile, Meta"
          icon={<Receipt className="w-4 h-4 text-slate-700" />}
        />

        <StatCard
          title="Net Gross Contribution"
          value={formatINR(grossContribution, false)}
          change="+21.2%"
          trend="up"
          subtitle="36.8% platform margin"
          icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
          iconBg="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="GST Output Collected"
          value={formatINR(gstCollected, false)}
          subtitle="18% CGST + SGST pooled"
          icon={<ShieldCheck className="w-4 h-4 text-purple-600" />}
          iconBg="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Monthly Financial Chart */}
      <ChartCard
        title="Revenue vs Carrier Expenses vs Net Gross Margin"
        description="Monthly financial breakdown of platform performance"
      >
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
              <Bar dataKey="gross" name="Recharge Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Carrier Cost" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Platform Margin" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-600" />
            Recharge Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-400" />
            Carrier Cost
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500" />
            Platform Margin
          </span>
        </div>
      </ChartCard>

      {/* GST Summary Box */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Goods and Services Tax (GST) Summary</h3>
            <p className="text-xs text-slate-500">
              Tax collected under HSN 998413 (Telecommunications & Cloud Messaging Services)
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
            GSTIN: 07AAACU9988P1Z3 (Delhi)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-[11px] text-slate-500">Central Tax (CGST @ 9%)</div>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              {formatINR(gstCollected / 2)}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-[11px] text-slate-500">State Tax (SGST @ 9%)</div>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              {formatINR(gstCollected / 2)}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-[11px] text-slate-500">Input Tax Credit (ITC Offset)</div>
            <div className="text-base font-bold text-emerald-700 mt-0.5">
              {formatINR(supplierExpenses * 0.18)}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

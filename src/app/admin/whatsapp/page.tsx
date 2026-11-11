"use client";

import React from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { formatINR, formatNumber, formatDate } from "@/lib/utils";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MessageLog } from "@/types";
import { MessageSquare, ShieldCheck, CheckCircle2, XCircle, DollarSign } from "lucide-react";

export default function AdminWhatsAppPage() {
  const { messageLogs } = useAppStore();
  const waLogs = messageLogs.filter((m) => m.channel === "whatsapp");

  const totalWA = 1280000;
  const marketing = 920000;
  const utility = 310000;
  const auth = 50000;

  const delivered = 1269760;
  const failed = 10240;

  const metaCharges = 744000.0;
  const customerCharges = 1242000.0;
  const grossContribution = 498000.0;

  const columns: Column<MessageLog>[] = [
    {
      header: "Log ID",
      accessorKey: "id",
      cell: (row) => <span className="font-mono text-xs text-slate-700">{row.id}</span>,
    },
    {
      header: "Customer",
      accessorKey: "customerName",
      cell: (row) => <span className="font-semibold text-slate-900">{row.customerName}</span>,
    },
    {
      header: "Category",
      accessorKey: "type",
      cell: (row) => (
        <span className="font-semibold uppercase text-xs text-slate-800">
          {row.type}
        </span>
      ),
    },
    {
      header: "Recipient",
      accessorKey: "recipient",
      cell: (row) => <span className="font-mono text-slate-800">{row.recipient}</span>,
    },
    {
      header: "Customer Billing",
      accessorKey: "cost",
      cell: (row) => <span className="font-bold text-slate-900">{formatINR(row.cost)}</span>,
    },
    {
      header: "Meta API Cost",
      accessorKey: "supplierCost",
      cell: (row) => <span className="text-slate-600">{formatINR(row.supplierCost)}</span>,
    },
    {
      header: "Gross Margin",
      cell: (row) => (
        <span className="font-semibold text-emerald-700">
          +{formatINR(row.cost - row.supplierCost)}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Timestamp",
      accessorKey: "timestamp",
      cell: (row) => <span className="text-slate-500 text-[11px]">{formatDate(row.timestamp)}</span>,
    },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            WhatsApp Business API Gateway
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Meta Cloud API telemetry, conversation categorization, and billing margin analysis
          </p>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total WhatsApp Traffic"
          value={formatNumber(totalWA)}
          change="+34.8%"
          trend="up"
          subtitle="99.2% delivered"
          icon={<MessageSquare className="w-4 h-4 text-[#25D366]" />}
          iconBg="bg-[#E8F8EE] text-[#25D366]"
        />

        <StatCard
          title="Marketing Conversations"
          value={formatNumber(marketing)}
          subtitle="Customer ₹1.10 / Meta ₹0.72"
          icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Utility & Alerts"
          value={formatNumber(utility)}
          subtitle="Customer ₹0.20 / Meta ₹0.12"
          icon={<CheckCircle2 className="w-4 h-4 text-blue-600" />}
          iconBg="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Total WhatsApp Profit"
          value={formatINR(grossContribution, false)}
          change="+40.1%"
          trend="up"
          subtitle="Platform contribution"
          icon={<ShieldCheck className="w-4 h-4 text-purple-600" />}
          iconBg="bg-purple-50 text-purple-600"
        />
      </div>

      {/* WhatsApp Message Log Table */}
      <DataTable
        data={waLogs}
        columns={columns}
        searchPlaceholder="Search WhatsApp recipient, customer..."
      />
    </AdminLayout>
  );
}

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
  const { messageLogs, campaigns, pricing } = useAppStore();
  const waLogs = messageLogs.filter((m) => m.channel === "whatsapp");

  const waCampaigns = campaigns.filter((c) => c.channel === "whatsapp");
  const totalWA = waCampaigns.reduce((acc, c) => acc + c.totalRecipients, 0) || 1280000;
  const marketing = waCampaigns.filter((c) => c.messageType === "marketing" || !c.messageType).reduce((acc, c) => acc + c.totalRecipients, 0) || Math.round(totalWA * 0.72);
  const utility = waCampaigns.filter((c) => c.messageType === "utility").reduce((acc, c) => acc + c.totalRecipients, 0) || Math.round(totalWA * 0.24);
  const auth = waCampaigns.filter((c) => c.messageType === "otp").reduce((acc, c) => acc + c.totalRecipients, 0) || Math.round(totalWA * 0.04);

  const delivered = waCampaigns.reduce((acc, c) => acc + c.delivered, 0) || Math.round(totalWA * 0.992);
  const failed = waCampaigns.reduce((acc, c) => acc + c.failed, 0) || Math.round(totalWA * 0.008);

  const waPricing = pricing.find((p) => p.channel === "whatsapp") || { supplierCost: 0.58, sellingPrice: 0.97 };
  const customerCharges = waCampaigns.reduce((acc, c) => acc + c.cost, 0) || Math.round(totalWA * waPricing.sellingPrice);
  const metaCharges = Number((customerCharges * 0.6).toFixed(2));
  const grossContribution = Number((customerCharges - metaCharges).toFixed(2));

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

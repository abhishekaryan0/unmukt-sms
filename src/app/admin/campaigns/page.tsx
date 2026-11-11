"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { formatINR, formatNumber, formatDate } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { CampaignDetailsModal } from "@/components/client/CampaignDetailsModal";
import { Campaign } from "@/types";
import { Megaphone, Send, MessageCircle, Eye } from "lucide-react";

export default function AdminCampaignsPage() {
  const { campaigns } = useAppStore();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [channelFilter, setChannelFilter] = useState("all");

  const filtered = campaigns.filter((c) => {
    if (channelFilter !== "all" && c.channel !== channelFilter) return false;
    return true;
  });

  const columns: Column<Campaign>[] = [
    {
      header: "Campaign ID",
      accessorKey: "id",
      cell: (row) => <span className="font-mono text-xs font-bold text-slate-800">{row.id}</span>,
    },
    {
      header: "Campaign Name",
      accessorKey: "campaignName",
      cell: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.campaignName}</div>
          <div className="text-[11px] text-slate-500">{row.templateName || "Custom Template"}</div>
        </div>
      ),
    },
    {
      header: "Customer",
      accessorKey: "customerName",
      cell: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.customerName}</div>
          <div className="text-[10px] text-slate-400 font-mono">{row.customerId}</div>
        </div>
      ),
    },
    {
      header: "Channel",
      accessorKey: "channel",
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1 font-bold text-xs ${
            row.channel === "whatsapp" ? "text-[#075E54]" : "text-blue-600"
          }`}
        >
          {row.channel === "whatsapp" ? (
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
          ) : (
            <Send className="w-3.5 h-3.5 text-blue-600" />
          )}
          {row.channel.toUpperCase()}
        </span>
      ),
    },
    {
      header: "Recipients",
      accessorKey: "totalRecipients",
      cell: (row) => (
        <span className="font-semibold text-slate-900">
          {formatNumber(row.totalRecipients)}
        </span>
      ),
    },
    {
      header: "Delivered",
      accessorKey: "delivered",
      cell: (row) => (
        <span className="font-semibold text-emerald-700">
          {formatNumber(row.delivered)}
        </span>
      ),
    },
    {
      header: "Failed",
      accessorKey: "failed",
      cell: (row) => (
        <span className={row.failed > 0 ? "text-rose-600 font-medium" : "text-slate-400"}>
          {formatNumber(row.failed)}
        </span>
      ),
    },
    {
      header: "Gross Billed",
      accessorKey: "cost",
      cell: (row) => <span className="font-bold text-slate-900">{formatINR(row.cost)}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Created Date",
      accessorKey: "createdDate",
      cell: (row) => (
        <span className="text-slate-500 text-[11px]">{formatDate(row.createdDate)}</span>
      ),
    },
    {
      header: "Actions",
      className: "whitespace-nowrap text-right",
      cell: (row) => (
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCampaign(row)}
            className="h-7 px-2.5 text-xs gap-1 font-semibold whitespace-nowrap shadow-none"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Platform Campaigns
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Global view of all client SMS broadcasts and WhatsApp marketing executions
          </p>
        </div>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        searchPlaceholder="Search campaign name or customer..."
        tableClassName="min-w-[1250px]"
        filters={
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">All Channels</option>
            <option value="sms">SMS Broadcasts</option>
            <option value="whatsapp">WhatsApp Campaigns</option>
          </select>
        }
      />

      <CampaignDetailsModal
        campaign={selectedCampaign}
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
      />
    </AdminLayout>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { formatINR, formatNumber, formatDate } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { CampaignDetailsModal } from "@/components/client/CampaignDetailsModal";
import { Campaign } from "@/types";
import {
  History,
  Send,
  MessageCircle,
  Eye,
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export default function CampaignHistoryPage() {
  const { campaigns } = useAppStore();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [channelFilter, setChannelFilter] = useState<string>("all");

  const clientCampaigns = campaigns.filter(
    (c) => c.customerId === "cust-01" || c.customerName.includes("Sharma")
  );

  const filteredCampaigns = clientCampaigns.filter((c) => {
    if (channelFilter === "all") return true;
    return c.channel === channelFilter;
  });

  const columns: Column<Campaign>[] = [
    {
      header: "Campaign Name",
      accessorKey: "campaignName",
      cell: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.campaignName}</div>
          <div className="text-[11px] text-slate-500 font-mono">ID: {row.id}</div>
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
        <div className="text-emerald-700 font-semibold">
          {formatNumber(row.delivered)}
          <span className="text-[10px] text-emerald-600 font-normal ml-1">
            ({((row.delivered / (row.totalRecipients || 1)) * 100).toFixed(0)}%)
          </span>
        </div>
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
      header: "Total Cost",
      accessorKey: "cost",
      cell: (row) => <span className="font-bold text-slate-900">{formatINR(row.cost)}</span>,
    },
    {
      header: "Date",
      accessorKey: "createdDate",
      cell: (row) => (
        <span className="text-slate-500 text-[11px]">{formatDate(row.createdDate)}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedCampaign(row)}
          className="h-7 px-2.5 text-xs gap-1"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Report</span>
        </Button>
      ),
    },
  ];

  return (
    <ClientLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Campaign History & Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full audit log of SMS and WhatsApp broadcasts, delivery funnels, and debited costs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/send-sms">
            <Button size="sm" className="bg-slate-900 text-white gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>New Campaign</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={filteredCampaigns}
        columns={columns}
        searchPlaceholder="Search campaigns..."
        filters={
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">All Channels</option>
            <option value="sms">SMS Only</option>
            <option value="whatsapp">WhatsApp Only</option>
          </select>
        }
      />

      {/* Campaign Details Report Modal */}
      <CampaignDetailsModal
        campaign={selectedCampaign}
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
      />
    </ClientLayout>
  );
}

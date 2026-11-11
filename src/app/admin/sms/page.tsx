"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { formatINR, formatNumber, formatDate, formatIndianMobile } from "@/lib/utils";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { MessageLog, SenderHeader } from "@/types";
import {
  Smartphone,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  DollarSign,
  ShieldCheck,
  Check,
  X,
  FileText,
} from "lucide-react";

export default function AdminSMSPage() {
  const { messageLogs, senderHeaders, updateSenderHeaderStatus, campaigns, pricing } = useAppStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("logs");

  const smsLogs = messageLogs.filter((m) => m.channel === "sms");
  const pendingHeadersCount = senderHeaders.filter((h) => h.status === "pending").length;

  // Dynamic Summary Metrics
  const smsCampaigns = campaigns.filter((c) => c.channel === "sms");
  const totalSMS = smsCampaigns.reduce((acc, c) => acc + c.totalRecipients, 0) || 8460000;
  const promoSMS = smsCampaigns.filter((c) => c.messageType === "promotional").reduce((acc, c) => acc + c.totalRecipients, 0) || Math.round(totalSMS * 0.7);
  const transSMS = smsCampaigns.filter((c) => c.messageType === "transactional").reduce((acc, c) => acc + c.totalRecipients, 0) || Math.round(totalSMS * 0.3);
  const delivered = smsCampaigns.reduce((acc, c) => acc + c.delivered, 0) || Math.round(totalSMS * 0.994);
  const failed = smsCampaigns.reduce((acc, c) => acc + c.failed, 0) || Math.round(totalSMS * 0.006);

  const smsPricing = pricing.find((p) => p.type.toLowerCase().includes("promotional sms") || p.channel === "sms") || {
    supplierCost: 0.09,
    sellingPrice: 0.22,
    grossMargin: 0.13,
  };
  const supplierCost = smsPricing.supplierCost;
  const sellingPrice = smsPricing.sellingPrice;
  const grossContribution = Number((sellingPrice - supplierCost).toFixed(2));

  const handleApproveHeader = (header: SenderHeader) => {
    updateSenderHeaderStatus(header.id, "approved");
    toast({
      title: "Header Approved",
      message: `DLT Header "${header.header}" for ${header.customerName} marked as Approved.`,
      type: "success",
    });
  };

  const handleRejectHeader = (header: SenderHeader) => {
    updateSenderHeaderStatus(header.id, "rejected");
    toast({
      title: "Header Rejected",
      message: `DLT Header "${header.header}" has been rejected.`,
      type: "error",
    });
  };

  const logColumns: Column<MessageLog>[] = [
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
      header: "Sender Header",
      accessorKey: "senderId",
      cell: (row) => <span className="font-mono font-bold text-slate-900">{row.senderId}</span>,
    },
    {
      header: "Recipient",
      accessorKey: "recipient",
      cell: (row) => <span className="font-mono text-slate-800">{row.recipient}</span>,
    },
    {
      header: "Carrier Route",
      accessorKey: "route",
      cell: (row) => (
        <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
          {row.route}
        </span>
      ),
    },
    {
      header: "Price / Cost",
      cell: (row) => (
        <div className="text-xs">
          <span className="font-bold text-slate-900">{formatINR(row.cost)}</span>
          <span className="text-[10px] text-slate-500 block">
            Wholesale: {formatINR(row.supplierCost)}
          </span>
        </div>
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

  const headerColumns: Column<SenderHeader>[] = [
    {
      header: "Sender Header",
      accessorKey: "header",
      cell: (row) => (
        <span className="font-mono font-bold text-sm bg-slate-100 text-slate-900 px-2.5 py-1 rounded border border-slate-300">
          {row.header}
        </span>
      ),
    },
    {
      header: "Customer Name",
      accessorKey: "customerName",
      cell: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.customerName}</div>
          <div className="text-[11px] text-slate-500">ID: {row.customerId}</div>
        </div>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (row) => (
        <span className="capitalize text-xs font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
          {row.category}
        </span>
      ),
    },
    {
      header: "DLT Entity ID",
      accessorKey: "dltEntityId",
      cell: (row) => <span className="font-mono text-xs text-slate-600">{row.dltEntityId}</span>,
    },
    {
      header: "Operator",
      accessorKey: "dltOperator",
      cell: (row) => <span className="text-xs font-medium text-slate-800">{row.dltOperator || row.operator}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Registered",
      accessorKey: "createdDate",
      cell: (row) => <span className="text-slate-500 text-xs">{formatDate(row.createdDate, false)}</span>,
    },
    {
      header: "Actions",
      className: "whitespace-nowrap text-right min-w-[180px]",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
          {row.status !== "approved" && (
            <Button
              size="sm"
              onClick={() => handleApproveHeader(row)}
              className="h-7 px-2 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Check className="w-3 h-3 mr-1" />
              Approve
            </Button>
          )}
          {row.status !== "rejected" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRejectHeader(row)}
              className="h-7 px-2 text-[11px] text-rose-600 border-rose-300 hover:bg-rose-50"
            >
              <X className="w-3 h-3 mr-1" />
              Reject
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            SMS Carrier & Header Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Telecom switches, TRAI DLT 6-character header verification, delivery ratios, and margin economics
          </p>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total SMS Dispatched"
          value={formatNumber(totalSMS)}
          change="+8.9%"
          trend="up"
          subtitle="All platform traffic"
          icon={<Smartphone className="w-4 h-4 text-blue-600" />}
          iconBg="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Promotional SMS"
          value={formatNumber(promoSMS)}
          subtitle="₹0.22 / unit selling price"
          icon={<Zap className="w-4 h-4 text-slate-700" />}
        />
        <StatCard
          title="Transactional / OTP SMS"
          value={formatNumber(transSMS)}
          subtitle="₹0.25 / unit selling price"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Gross Margin / SMS"
          value="59.1%"
          change="+₹0.13/SMS"
          trend="up"
          subtitle="₹0.22 sell - ₹0.09 cost"
          icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: "logs", label: "Carrier Message Logs", count: smsLogs.length, icon: <FileText /> },
          {
            id: "headers",
            label: "TRAI DLT Sender Headers Registry",
            count: senderHeaders.length,
            icon: <ShieldCheck />,
          },
        ]}
      />

      {activeTab === "logs" && (
        <div className="space-y-4">
          {/* Pricing & Margin Box */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-elevated border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400">
                Current Bulk Route Economics
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                EJOIN EIMS Bulk Gateway (Primary Promo Switch)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Active carrier routing with automatic failover to RouteMobile
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <div>
                <div className="text-slate-400 text-[10px]">Wholesale Cost</div>
                <div className="font-bold text-slate-200 text-sm">{formatINR(supplierCost)}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">Client Selling Price</div>
                <div className="font-bold text-white text-sm">{formatINR(sellingPrice)}</div>
              </div>
              <div>
                <div className="text-emerald-400 text-[10px]">Gross Contribution</div>
                <div className="font-bold text-emerald-400 text-sm">{formatINR(grossContribution)}</div>
              </div>
            </div>
          </div>

          {/* Message Logs Table */}
          <DataTable
            data={smsLogs}
            columns={logColumns}
            searchPlaceholder="Search recipient, sender, ID..."
            tableClassName="min-w-[1000px]"
          />
        </div>
      )}

      {activeTab === "headers" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex items-start justify-between">
            <div>
              <h4 className="font-bold text-blue-950">TRAI Telecom Header Scrutiny</h4>
              <p className="mt-0.5 text-blue-800">
                All 6-character sender headers must match the registered brand trademark or entity name registered on Jio, Airtel, Vi, or BSNL DLT telemarketer networks.
              </p>
            </div>
            {pendingHeadersCount > 0 && (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2.5 py-1 rounded-full text-[11px] shrink-0">
                {pendingHeadersCount} Pending Review
              </span>
            )}
          </div>

          <DataTable
            data={senderHeaders}
            columns={headerColumns}
            searchPlaceholder="Search header (e.g. SHRFSH), customer name..."
            tableClassName="min-w-[1100px]"
          />
        </div>
      )}
    </AdminLayout>
  );
}

"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { formatINR, formatNumber, formatDate, formatIndianMobile } from "@/lib/utils";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MessageLog } from "@/types";
import { Smartphone, Zap, CheckCircle2, XCircle, ArrowUpRight, DollarSign } from "lucide-react";

export default function AdminSMSPage() {
  const { messageLogs } = useAppStore();
  const smsLogs = messageLogs.filter((m) => m.channel === "sms");

  // Summary Metrics
  const totalSMS = 8460000;
  const promoSMS = 5800000;
  const transSMS = 2660000;
  const delivered = 8410000;
  const failed = 50000;

  const supplierCost = 0.09;
  const sellingPrice = 0.22;
  const grossContribution = 0.13;

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

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            SMS Carrier Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Telecom switches, TRAI DLT delivery ratios, and unit gross contribution
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
        columns={columns}
        searchPlaceholder="Search recipient, sender, ID..."
      />
    </AdminLayout>
  );
}

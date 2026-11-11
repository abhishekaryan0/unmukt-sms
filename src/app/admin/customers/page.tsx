"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { formatINR, formatNumber, formatDate, formatIndianMobile } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Customer } from "@/types";
import {
  Users,
  UserPlus,
  Eye,
  ShieldAlert,
  ShieldCheck,
  Wallet,
  Megaphone,
  MoreVertical,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function AdminCustomersPage() {
  const { customers, updateCustomerStatus, manualCustomerWalletAdjustment } = useAppStore();
  const { toast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Wallet adjustment modal
  const [walletCust, setWalletCust] = useState<Customer | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustType, setAdjustType] = useState<"credit" | "debit">("credit");
  const [adjustNote, setAdjustNote] = useState("");

  const filteredCustomers = customers.filter((c) => {
    if (categoryFilter !== "all" && c.businessCategory !== categoryFilter) return false;
    if (statusFilter !== "all" && c.accountStatus !== statusFilter) return false;
    return true;
  });

  const handleToggleStatus = (cust: Customer) => {
    const newStatus = cust.accountStatus === "active" ? "suspended" : "active";
    updateCustomerStatus(cust.id, newStatus);
    toast({
      title: `Customer ${newStatus === "active" ? "Activated" : "Suspended"}`,
      message: `${cust.businessName} account status set to ${newStatus}.`,
      type: newStatus === "active" ? "success" : "error",
    });
  };

  const handleApplyWalletAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletCust) return;
    const amt = parseFloat(adjustAmount);
    if (!amt || amt <= 0) {
      toast({ title: "Invalid Amount", message: "Enter valid adjustment amount", type: "error" });
      return;
    }

    manualCustomerWalletAdjustment(
      walletCust.id,
      amt,
      adjustType,
      adjustNote.trim() || "Admin Balance Adjustment"
    );

    toast({
      title: `Wallet Adjusted (${adjustType.toUpperCase()})`,
      message: `${formatINR(amt)} ${
        adjustType === "credit" ? "credited to" : "debited from"
      } ${walletCust.businessName}.`,
      type: "success",
    });

    setWalletCust(null);
    setAdjustAmount("");
    setAdjustNote("");
  };

  const columns: Column<Customer>[] = [
    {
      header: "Customer ID",
      accessorKey: "id",
      cell: (row) => (
        <Link
          href={`/admin/customers/${row.id}`}
          className="font-mono text-xs font-bold text-blue-600 hover:underline"
        >
          {row.id}
        </Link>
      ),
    },
    {
      header: "Business Name",
      accessorKey: "businessName",
      cell: (row) => (
        <div>
          <Link
            href={`/admin/customers/${row.id}`}
            className="font-bold text-slate-900 hover:text-blue-600 hover:underline"
          >
            {row.businessName}
          </Link>
          <div className="text-[11px] text-slate-500">
            {row.city}, {row.state}
          </div>
        </div>
      ),
    },
    {
      header: "Owner",
      accessorKey: "ownerName",
      cell: (row) => (
        <div>
          <div className="font-medium text-slate-900">{row.ownerName}</div>
          <div className="text-[11px] text-slate-500">{row.email}</div>
        </div>
      ),
    },
    {
      header: "Mobile",
      accessorKey: "mobile",
      cell: (row) => (
        <span className="font-mono text-slate-800 text-xs">
          {formatIndianMobile(row.mobile)}
        </span>
      ),
    },
    {
      header: "Category",
      accessorKey: "businessCategory",
      cell: (row) => (
        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {row.businessCategory}
        </span>
      ),
    },
    {
      header: "Wallet Balance",
      accessorKey: "walletBalance",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-900">{formatINR(row.walletBalance)}</span>
          <button
            onClick={() => setWalletCust(row)}
            className="p-1 rounded text-blue-600 hover:bg-blue-50"
            title="Adjust Wallet Balance"
          >
            <Wallet className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
    {
      header: "Total Msgs",
      accessorKey: "totalMessages",
      cell: (row) => (
        <span className="font-semibold text-slate-700">{formatNumber(row.totalMessages)}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "accountStatus",
      cell: (row) => <StatusBadge status={row.accountStatus} />,
    },
    {
      header: "Registered",
      accessorKey: "registrationDate",
      cell: (row) => <span className="text-slate-500 text-[11px]">{formatDate(row.registrationDate, false)}</span>,
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Link href={`/admin/customers/${row.id}`}>
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
              <Eye className="w-3.5 h-3.5 mr-1" />
              View
            </Button>
          </Link>
          <button
            onClick={() => handleToggleStatus(row)}
            className={`p-1.5 rounded transition-colors text-xs font-semibold ${
              row.accountStatus === "active"
                ? "text-rose-600 hover:bg-rose-50"
                : "text-emerald-600 hover:bg-emerald-50"
            }`}
            title={row.accountStatus === "active" ? "Suspend Customer" : "Activate Customer"}
          >
            {row.accountStatus === "active" ? "Suspend" : "Activate"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Customer Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage Indian business accounts, prepaid balances, TRAI DLT verification, and switch logs
          </p>
        </div>
      </div>

      <DataTable
        data={filteredCustomers}
        columns={columns}
        searchPlaceholder="Search customer, business, mobile..."
        filters={
          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Categories</option>
              <option value="Retail & Apparel">Retail & Apparel</option>
              <option value="Consumer Electronics">Consumer Electronics</option>
              <option value="Education & Coaching">Education & Coaching</option>
              <option value="Hospitality & Dining">Hospitality & Dining</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Digital Marketing Agency">Digital Marketing Agency</option>
              <option value="Healthcare & Labs">Healthcare & Labs</option>
              <option value="F&B & Retail">F&B & Retail</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
            </select>
          </div>
        }
      />

      {/* Manual Wallet Adjustment Modal */}
      <Modal
        isOpen={!!walletCust}
        onClose={() => setWalletCust(null)}
        size="sm"
        title="Manual Wallet Adjustment"
        description={`Customer: ${walletCust?.businessName} (${formatINR(
          walletCust?.walletBalance || 0
        )})`}
      >
        <form onSubmit={handleApplyWalletAdjustment} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Adjustment Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAdjustType("credit")}
                className={`py-2 px-3 rounded-lg border font-semibold transition-all ${
                  adjustType === "credit"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                + Credit Balance
              </button>
              <button
                type="button"
                onClick={() => setAdjustType("debit")}
                className={`py-2 px-3 rounded-lg border font-semibold transition-all ${
                  adjustType === "debit"
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                - Debit Balance
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amount (INR) *
            </label>
            <Input
              type="number"
              placeholder="e.g. 500"
              value={adjustAmount}
              onChange={(e) => setAdjustAmount(e.target.value)}
              leftIcon={<span className="text-xs font-bold text-slate-500">₹</span>}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Audit Note / Reference *
            </label>
            <Input
              placeholder="e.g. DLT registration refund or promo voucher"
              value={adjustNote}
              onChange={(e) => setAdjustNote(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setWalletCust(null)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-slate-900 text-white">
              Apply Adjustment
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

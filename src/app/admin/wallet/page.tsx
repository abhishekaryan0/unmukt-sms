"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { formatINR, formatDate, exportToCSV } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Transaction } from "@/types";
import { Wallet, Plus, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AdminWalletTransactionsPage() {
  const { transactions, customers, manualCustomerWalletAdjustment } = useAppStore();
  const { toast } = useToast();

  const [typeFilter, setTypeFilter] = useState("all");
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  // Manual Adjustment State
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || "cust-01");
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustType, setAdjustType] = useState<"credit" | "debit">("credit");
  const [adjustNote, setAdjustNote] = useState("");

  const filtered = transactions.filter((t) => {
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    return true;
  });

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(adjustAmount);
    if (!amt || amt <= 0) return;

    manualCustomerWalletAdjustment(
      selectedCustomerId,
      amt,
      adjustType,
      adjustNote.trim() || "Admin Credit Adjustment"
    );

    const cust = customers.find((c) => c.id === selectedCustomerId);

    toast({
      title: "Wallet Balance Adjusted",
      message: `${formatINR(amt)} ${adjustType} applied for ${cust?.businessName}.`,
      type: "success",
    });

    setShowAdjustModal(false);
    setAdjustAmount("");
    setAdjustNote("");
  };

  const handleExport = () => {
    const data = filtered.map((t) => ({
      Transaction_ID: t.id,
      Customer: t.customerName,
      Type: t.type,
      Reference: t.reference,
      Amount: t.amount,
      Previous_Balance: t.previousBalance,
      New_Balance: t.newBalance,
      Date: t.date,
    }));
    exportToCSV(data, "platform_all_transactions");
  };

  const columns: Column<Transaction>[] = [
    {
      header: "Tx ID",
      accessorKey: "id",
      cell: (row) => <span className="font-mono text-xs text-slate-800">{row.id}</span>,
    },
    {
      header: "Customer",
      accessorKey: "customerName",
      cell: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.customerName}</div>
          <div className="text-[10px] text-slate-400 font-mono">{row.customerId}</div>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (row) => {
        const isCredit = row.type === "recharge" || row.type === "manual_credit" || row.type === "refund";
        return (
          <span
            className={`inline-flex items-center gap-1 font-bold text-xs uppercase px-2 py-0.5 rounded ${
              isCredit ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-800"
            }`}
          >
            {isCredit ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {row.type.replace("_", " ")}
          </span>
        );
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (row) => {
        const isCredit = row.type === "recharge" || row.type === "manual_credit" || row.type === "refund";
        return (
          <span className={`font-bold ${isCredit ? "text-emerald-700" : "text-slate-900"}`}>
            {isCredit ? "+" : "-"}
            {formatINR(row.amount)}
          </span>
        );
      },
    },
    {
      header: "Previous Bal",
      accessorKey: "previousBalance",
      cell: (row) => <span className="text-slate-500">{formatINR(row.previousBalance)}</span>,
    },
    {
      header: "New Balance",
      accessorKey: "newBalance",
      cell: (row) => <span className="font-bold text-slate-900">{formatINR(row.newBalance)}</span>,
    },
    {
      header: "Reference",
      accessorKey: "reference",
      cell: (row) => <span className="font-mono text-[11px] text-slate-600 truncate max-w-xs block">{row.reference}</span>,
    },
    {
      header: "Timestamp",
      accessorKey: "date",
      cell: (row) => <span className="text-slate-500 text-[11px]">{formatDate(row.date)}</span>,
    },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Wallet Ledgers & Transactions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail of customer recharges, campaign debits, refunds, and manual credits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setShowAdjustModal(true)}
            className="bg-slate-900 text-white gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Manual Adjustment</span>
          </Button>
        </div>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        searchPlaceholder="Search customer, reference, ID..."
        filters={
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">All Types</option>
            <option value="recharge">Recharge</option>
            <option value="sms_deduction">SMS Deduction</option>
            <option value="whatsapp_deduction">WhatsApp Deduction</option>
            <option value="manual_credit">Manual Credit</option>
            <option value="manual_debit">Manual Debit</option>
          </select>
        }
      />

      {/* Manual Adjustment Modal */}
      <Modal
        isOpen={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        size="md"
        title="Super Admin Manual Wallet Adjustment"
        description="Credit or debit any customer wallet with audit trail note"
      >
        <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Customer
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-semibold"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.businessName} (Current: {formatINR(c.walletBalance)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setAdjustType("credit")}
              className={`py-2 px-3 rounded-lg border font-semibold text-xs ${
                adjustType === "credit"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              + Credit (Add Money)
            </button>
            <button
              type="button"
              onClick={() => setAdjustType("debit")}
              className={`py-2 px-3 rounded-lg border font-semibold text-xs ${
                adjustType === "debit"
                  ? "bg-rose-600 text-white border-rose-600"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              - Debit (Deduct Money)
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amount (INR) *
            </label>
            <Input
              type="number"
              placeholder="e.g. 1000"
              value={adjustAmount}
              onChange={(e) => setAdjustAmount(e.target.value)}
              leftIcon={<span className="text-xs font-bold text-slate-400">₹</span>}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Audit Reason / Note *
            </label>
            <Input
              placeholder="e.g. Manual recharge top-up or goodwill credit"
              value={adjustNote}
              onChange={(e) => setAdjustNote(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setShowAdjustModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-slate-900 text-white">
              Execute Adjustment
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

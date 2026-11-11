"use client";

import React, { useState } from "react";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { formatINR, formatDate, exportToCSV } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/Button";
import { Transaction } from "@/types";
import { Receipt, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function TransactionsPage() {
  const { transactions, activeCustomer } = useAppStore();
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const clientTx = transactions.filter((t) => t.customerId === activeCustomer.id);

  const filteredTx = clientTx.filter((t) => {
    if (typeFilter === "all") return true;
    return t.type === typeFilter;
  });

  const handleExport = () => {
    const data = filteredTx.map((t) => ({
      Transaction_ID: t.id,
      Type: t.type,
      Reference: t.reference,
      Amount_INR: t.amount,
      Previous_Balance: t.previousBalance,
      New_Balance: t.newBalance,
      Payment_Method: t.paymentMethod || "N/A",
      Date: t.date,
    }));
    exportToCSV(data, `wallet_statement_${new Date().toISOString().split("T")[0]}`);
  };

  const columns: Column<Transaction>[] = [
    {
      header: "Transaction ID",
      accessorKey: "id",
      cell: (row) => <span className="font-mono text-xs text-slate-800">{row.id}</span>,
    },
    {
      header: "Description / Type",
      cell: (row) => {
        const isCredit = row.type === "recharge" || row.type === "refund" || row.type === "manual_credit";
        return (
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                isCredit ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"
              }`}
            >
              {isCredit ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            </div>
            <div>
              <div className="font-semibold text-slate-900 capitalize">
                {row.type.replace("_", " ")}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">{row.reference}</div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (row) => {
        const isCredit = row.type === "recharge" || row.type === "refund" || row.type === "manual_credit";
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
      cell: (row) => <span className="font-semibold text-slate-900">{formatINR(row.newBalance)}</span>,
    },
    {
      header: "Payment Method",
      accessorKey: "paymentMethod",
      cell: (row) => (
        <span className="text-slate-600 text-[11px]">
          {row.paymentMethod || "Wallet Debit"}
        </span>
      ),
    },
    {
      header: "Timestamp",
      accessorKey: "date",
      cell: (row) => <span className="text-slate-500 text-[11px]">{formatDate(row.date)}</span>,
    },
  ];

  return (
    <ClientLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Wallet Transactions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete transaction ledger of top-ups, campaign broadcast fees, and adjustments
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
          <Download className="w-3.5 h-3.5" />
          <span>Export Statement</span>
        </Button>
      </div>

      <DataTable
        data={filteredTx}
        columns={columns}
        searchPlaceholder="Search reference, tx ID..."
        filters={
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">All Transaction Types</option>
            <option value="recharge">Recharges Only</option>
            <option value="sms_deduction">SMS Debits</option>
            <option value="whatsapp_deduction">WhatsApp Debits</option>
          </select>
        }
      />
    </ClientLayout>
  );
}

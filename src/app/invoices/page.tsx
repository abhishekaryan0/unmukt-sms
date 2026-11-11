"use client";

import React, { useState } from "react";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { formatINR, formatDate } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/Button";
import { InvoiceModal } from "@/components/client/InvoiceModal";
import { Invoice } from "@/types";
import { FileCheck2, Printer, Eye, Download, ShieldCheck } from "lucide-react";

export default function InvoicesPage() {
  const { invoices, activeCustomer } = useAppStore();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const clientInvoices = invoices.filter((inv) => inv.customerId === activeCustomer.id);

  const columns: Column<Invoice>[] = [
    {
      header: "Invoice Number",
      accessorKey: "invoiceNumber",
      cell: (row) => (
        <div>
          <div className="font-bold text-slate-900 font-mono">{row.invoiceNumber}</div>
          <div className="text-[11px] text-slate-400">SAC: 998413 (Cloud Messaging)</div>
        </div>
      ),
    },
    {
      header: "Date",
      accessorKey: "invoiceDate",
      cell: (row) => <span className="text-slate-600">{formatDate(row.invoiceDate, false)}</span>,
    },
    {
      header: "Taxable Value",
      accessorKey: "amount",
      cell: (row) => <span className="text-slate-700">{formatINR(row.amount)}</span>,
    },
    {
      header: "GST (18%)",
      accessorKey: "gst",
      cell: (row) => (
        <span className="text-slate-700">
          {formatINR(row.gst)}
          <span className="text-[10px] text-slate-400 block">9% CGST + 9% SGST</span>
        </span>
      ),
    },
    {
      header: "Total Amount",
      accessorKey: "totalAmount",
      cell: (row) => <span className="font-bold text-slate-900">{formatINR(row.totalAmount)}</span>,
    },
    {
      header: "GSTIN",
      accessorKey: "gstin",
      cell: (row) => <span className="font-mono text-[11px] text-slate-600">{row.gstin}</span>,
    },
    {
      header: "Status",
      accessorKey: "paymentStatus",
      cell: (row) => (
        <span className="inline-flex items-center gap-1 font-semibold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          ● Paid
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedInvoice(row)}
          className="h-7 px-2.5 text-xs gap-1"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Invoice</span>
        </Button>
      ),
    },
  ];

  return (
    <ClientLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            GST Tax Invoices
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Download compliant tax invoices with input tax credit (ITC) details for monthly GST filings
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified GSTIN: 07AAAAA0000A1Z5</span>
        </div>
      </div>

      <DataTable
        data={clientInvoices}
        columns={columns}
        searchPlaceholder="Search invoice #, reference..."
      />

      <InvoiceModal
        invoice={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </ClientLayout>
  );
}

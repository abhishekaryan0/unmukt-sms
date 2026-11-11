"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Invoice } from "@/types";
import { formatINR, formatDate } from "@/lib/utils";
import { Printer, Download, CheckCircle2 } from "lucide-react";

interface InvoiceModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceModal({ invoice, isOpen, onClose }: InvoiceModalProps) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const cgst = Number((invoice.gst / 2).toFixed(2));
  const sgst = Number((invoice.gst / 2).toFixed(2));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={`Tax Invoice: ${invoice.invoiceNumber}`}
      description="Official GST Invoice for your records"
      footer={
        <div className="flex items-center justify-between w-full no-print">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            <span>Payment Verified (Paid via {invoice.transactionReference.split("/")[0]})</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button size="sm" onClick={handlePrint} className="gap-1.5">
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </Button>
          </div>
        </div>
      }
    >
      <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs print:border-none print:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between border-b border-slate-200 pb-5 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900">
                SMS<span className="text-blue-600">UNMUKT</span>
              </span>
              <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                ORIGINAL FOR RECIPIENT
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">SMS Unmukt Technologies India Pvt. Ltd.</p>
            <p className="text-[11px] text-slate-500">Connaught Place, New Delhi - 110001</p>
            <p className="text-[11px] text-slate-500 font-medium">GSTIN: 07AAACU9988P1Z3</p>
          </div>

          <div className="text-left sm:text-right">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              TAX INVOICE
            </h2>
            <p className="text-xs font-semibold text-slate-800 mt-0.5">{invoice.invoiceNumber}</p>
            <p className="text-[11px] text-slate-500 mt-1">Date: {formatDate(invoice.invoiceDate, false)}</p>
            <p className="text-[11px] text-slate-500">Ref: {invoice.transactionReference}</p>
          </div>
        </div>

        {/* Billed To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              BILLED TO:
            </span>
            <h4 className="font-bold text-slate-900 mt-0.5">{invoice.businessName}</h4>
            <p className="text-slate-600 text-[11px]">Attn: {invoice.ownerName}</p>
            <p className="text-slate-600 text-[11px] mt-0.5">{invoice.billingAddress}</p>
            <p className="text-slate-800 text-[11px] font-medium mt-1">GSTIN: {invoice.gstin}</p>
          </div>
          <div className="sm:text-right">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              PAYMENT STATUS:
            </span>
            <div className="mt-1">
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded text-xs">
                ● PAID IN FULL
              </span>
            </div>
            <p className="text-slate-500 text-[11px] mt-2">Place of Supply: Delhi (07)</p>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="py-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-2">Item Description</th>
                <th className="py-2 text-center">HSN/SAC</th>
                <th className="py-2 text-right">Taxable Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              <tr>
                <td className="py-3">
                  <div className="font-semibold text-slate-900">{invoice.description}</div>
                  <div className="text-[11px] text-slate-500">Cloud Messaging Gateway & WhatsApp Business Credits</div>
                </td>
                <td className="py-3 text-center text-slate-600 font-mono">998413</td>
                <td className="py-3 text-right font-medium text-slate-900">{formatINR(invoice.amount)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal (Taxable Amount):</span>
            <span>{formatINR(invoice.amount)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Central GST (CGST @ 9%):</span>
            <span>{formatINR(cgst)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>State GST (SGST @ 9%):</span>
            <span>{formatINR(sgst)}</span>
          </div>
          <div className="border-t border-slate-300 pt-2 flex justify-between font-bold text-slate-900 text-sm">
            <span>Total Invoice Amount (INR):</span>
            <span>{formatINR(invoice.totalAmount)}</span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-dashed border-slate-200 text-[10px] text-slate-400 text-center">
          This is a computer-generated invoice and does not require a physical signature. Registered under the Goods and Services Tax Act 2017.
        </div>
      </div>
    </Modal>
  );
}

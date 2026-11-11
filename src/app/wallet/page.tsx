"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { formatINR, formatNumber, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/shared/StatCard";
import { RechargeModal } from "@/components/client/RechargeModal";
import { InvoiceModal } from "@/components/client/InvoiceModal";
import { Invoice } from "@/types";
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  FileCheck2,
  ShieldCheck,
  CreditCard,
  Building2,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

export default function WalletPage() {
  const { clientWalletBalance, transactions, invoices, activeCustomer } = useAppStore();
  const [showRecharge, setShowRecharge] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const clientTx = transactions.filter((t) => t.customerId === activeCustomer.id);
  const totalRecharged = clientTx
    .filter((t) => t.type === "recharge")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSpent = clientTx
    .filter((t) => t.type === "sms_deduction" || t.type === "whatsapp_deduction")
    .reduce((acc, t) => acc + t.amount, 0);

  const clientInvoices = invoices.filter((inv) => inv.customerId === activeCustomer.id);

  return (
    <ClientLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Prepaid Wallet & Recharge
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add credits for SMS and WhatsApp campaigns with instant GST tax invoices
          </p>
        </div>

        <Button
          onClick={() => setShowRecharge(true)}
          className="bg-slate-900 text-white font-semibold gap-1.5 shadow-subtle"
        >
          <Plus className="w-4 h-4" />
          <span>Recharge Wallet</span>
        </Button>
      </div>

      {/* Wallet Cards Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Main Available Balance */}
        <div className="bg-slate-950 text-white rounded-xl p-5 shadow-elevated border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Available Balance
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-3xl font-bold tracking-tight mt-2 text-white">
              {formatINR(clientWalletBalance)}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between items-center">
            <span>Prepaid Billing</span>
            <button
              onClick={() => setShowRecharge(true)}
              className="text-blue-400 hover:text-blue-300 font-bold underline"
            >
              + Quick Top-up
            </button>
          </div>
        </div>

        {/* Total Recharged */}
        <StatCard
          title="Total Recharged"
          value={formatINR(totalRecharged || 6950)}
          change="+100%"
          subtitle="All-time top-ups"
          icon={<ArrowUpRight className="w-4 h-4 text-emerald-600" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        {/* Total Consumed */}
        <StatCard
          title="Total Consumed"
          value={formatINR(totalSpent || 5324)}
          trend="neutral"
          subtitle="Spent on campaigns"
          icon={<ArrowDownRight className="w-4 h-4 text-slate-600" />}
        />

        {/* Pending Charges */}
        <StatCard
          title="Pending Invoices"
          value="₹0.00"
          trend="neutral"
          subtitle="Prepaid account in good standing"
          icon={<CheckCircle2 className="w-4 h-4 text-blue-600" />}
          iconBg="bg-blue-50 text-blue-600"
        />
      </div>

      {/* Quick Recharge Packs Grid */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recommended Recharge Packs</h3>
            <p className="text-xs text-slate-500">
              Select an instant pack to recharge via UPI, Net Banking, or Cards
            </p>
          </div>
          <span className="text-[11px] font-medium text-slate-500">18% GST applicable</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              amount: 499,
              title: "Starter Pack",
              sms: "2,268 SMS",
              wa: "453 WhatsApp",
              popular: false,
            },
            {
              amount: 999,
              title: "Growth Pack",
              sms: "4,540 SMS",
              wa: "908 WhatsApp",
              popular: true,
            },
            {
              amount: 1999,
              title: "Festive Pack",
              sms: "9,086 SMS",
              wa: "1,817 WhatsApp",
              popular: false,
            },
            {
              amount: 4999,
              title: "Enterprise Pack",
              sms: "22,722 SMS",
              wa: "4,544 WhatsApp",
              popular: false,
            },
          ].map((pack) => (
            <div
              key={pack.amount}
              className={`rounded-xl border p-5 flex flex-col justify-between transition-all ${
                pack.popular
                  ? "border-slate-900 bg-slate-50/50 shadow-md ring-1 ring-slate-900"
                  : "border-slate-200 bg-white hover:border-slate-300 shadow-subtle"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">{pack.title}</span>
                  {pack.popular && (
                    <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2">
                  ₹{pack.amount}
                  <span className="text-xs font-normal text-slate-500 ml-1">+ GST</span>
                </div>
                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="text-blue-600 font-bold">●</span>
                    <span>~{pack.sms} credits</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#25D366] font-bold">●</span>
                    <span>~{pack.wa} messages</span>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <Button
                  size="sm"
                  onClick={() => setShowRecharge(true)}
                  className={`w-full ${
                    pack.popular
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  Recharge ₹{pack.amount}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns: Recent Wallet Deductions & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Wallet Transaction History</h3>
              <p className="text-xs text-slate-500">Live credits and campaign deductions</p>
            </div>
            <Link
              href="/transactions"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Full History →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {clientTx.slice(0, 5).map((t) => {
              const isCredit = t.type === "recharge" || t.type === "refund";
              return (
                <div key={t.id} className="p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {t.type === "recharge"
                        ? `Wallet Top-Up (${t.paymentMethod || "UPI"})`
                        : t.type === "sms_deduction"
                        ? "SMS Broadcast Debit"
                        : "WhatsApp Campaign Debit"}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {t.reference} • {formatDate(t.date)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-bold ${
                        isCredit ? "text-emerald-700" : "text-slate-900"
                      }`}
                    >
                      {isCredit ? "+" : "-"}
                      {formatINR(t.amount)}
                    </span>
                    <div className="text-[10px] text-slate-400">Bal: {formatINR(t.newBalance)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* GST Invoices */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent GST Tax Invoices</h3>
              <p className="text-xs text-slate-500">Official tax invoices eligible for ITC claims</p>
            </div>
            <Link
              href="/invoices"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View Invoices →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {clientInvoices.slice(0, 4).map((inv) => (
              <div
                key={inv.id}
                onClick={() => setSelectedInvoice(inv)}
                className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-slate-900">{inv.invoiceNumber}</div>
                  <div className="text-[11px] text-slate-500">
                    {formatDate(inv.invoiceDate, false)} • GST: {formatINR(inv.gst)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">{formatINR(inv.totalAmount)}</span>
                  <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-0.5 hover:underline">
                    <Receipt className="w-3 h-3" />
                    View
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <RechargeModal isOpen={showRecharge} onClose={() => setShowRecharge(false)} />
      <InvoiceModal
        invoice={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </ClientLayout>
  );
}

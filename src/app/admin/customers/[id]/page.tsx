"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { formatINR, formatNumber, formatDate, formatIndianMobile } from "@/lib/utils";
import { Tabs } from "@/components/ui/Tabs";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/shared/StatCard";
import {
  Users,
  Wallet,
  Megaphone,
  Receipt,
  FolderTree,
  Activity,
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Send,
  MessageCircle,
  LogIn,
} from "lucide-react";

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const { customers, campaigns, transactions, contacts, switchActiveCustomer } = useAppStore();
  const customer = customers.find((c) => c.id === customerId) || customers[0];

  const [activeTab, setActiveTab] = useState("overview");

  if (!customer) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-slate-500">Customer not found</div>
      </AdminLayout>
    );
  }

  // Filter related data
  const custCampaigns = campaigns.filter((c) => c.customerId === customer.id);
  const custTx = transactions.filter((t) => t.customerId === customer.id);
  const custContacts = contacts; // Representing demo audience

  return (
    <AdminLayout>
      {/* Top Breadcrumb & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/customers"
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-subtle"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {customer.businessName}
              </h1>
              <StatusBadge status={customer.accountStatus} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Customer ID: {customer.id} • {customer.businessCategory} • Registered on{" "}
              {formatDate(customer.registrationDate, false)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              switchActiveCustomer(customer.id);
              router.push("/dashboard");
            }}
            className="bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 font-semibold"
          >
            <LogIn className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
            Login as Customer
          </Button>

          <div className="text-right pl-3 border-l border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">
              Wallet Balance
            </span>
            <span className="text-lg font-bold text-slate-900">
              {formatINR(customer.walletBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: "overview", label: "Overview", icon: <Building2 /> },
          { id: "campaigns", label: "Campaigns", count: custCampaigns.length, icon: <Megaphone /> },
          { id: "wallet", label: "Wallet & Credits", icon: <Wallet /> },
          { id: "transactions", label: "Transactions", count: custTx.length, icon: <Receipt /> },
          { id: "contacts", label: "Contacts", count: custContacts.length, icon: <Users /> },
          { id: "activity", label: "Activity Log", icon: <Activity /> },
        ]}
      />

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Prepaid Balance"
              value={formatINR(customer.walletBalance)}
              subtitle="Active credit"
              icon={<Wallet className="w-4 h-4 text-emerald-600" />}
              iconBg="bg-emerald-50 text-emerald-600"
            />
            <StatCard
              title="Total Messages"
              value={formatNumber(customer.totalMessages)}
              subtitle="Lifetime sent"
              icon={<Send className="w-4 h-4 text-blue-600" />}
              iconBg="bg-blue-50 text-blue-600"
            />
            <StatCard
              title="Campaigns Run"
              value={custCampaigns.length}
              subtitle="SMS & WhatsApp"
              icon={<Megaphone className="w-4 h-4 text-purple-600" />}
              iconBg="bg-purple-50 text-purple-600"
            />
            <StatCard
              title="Carrier Deliverability"
              value="99.2%"
              trend="up"
              subtitle="Clean DLT record"
              icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
              iconBg="bg-emerald-50 text-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-card space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Business Profile
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Business Name:</span>
                  <span className="font-semibold text-slate-900">{customer.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="text-slate-800">{customer.businessCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="text-slate-800">
                    {customer.city}, {customer.state}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GSTIN:</span>
                  <span className="font-mono font-medium text-slate-800">
                    {customer.gstin || "Not Submitted"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">TRAI DLT Entity ID:</span>
                  <span className="font-mono font-medium text-slate-800">
                    {customer.dltEntityId || "110145892300001"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-card space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Signatory Details
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Owner Name:</span>
                  <span className="font-semibold text-slate-900">{customer.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="text-slate-800">{customer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mobile Phone:</span>
                  <span className="font-mono text-slate-800">
                    {formatIndianMobile(customer.mobile)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registration Date:</span>
                  <span className="text-slate-800">
                    {formatDate(customer.registrationDate, false)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CAMPAIGNS */}
      {activeTab === "campaigns" && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="divide-y divide-slate-100">
            {custCampaigns.length > 0 ? (
              custCampaigns.map((c) => (
                <div key={c.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{c.campaignName}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Channel: {c.channel.toUpperCase()} • Recipients: {formatNumber(c.totalRecipients)} • Date:{" "}
                      {formatDate(c.createdDate)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">{formatINR(c.cost)}</span>
                    <div className="text-[10px] text-emerald-600 font-medium">
                      {c.delivered} delivered
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                No campaigns launched yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: WALLET */}
      {activeTab === "wallet" && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-card space-y-4 max-w-xl">
          <h3 className="text-sm font-bold text-slate-900">Prepaid Wallet Summary</h3>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Available Credit:</span>
              <span className="text-lg font-bold text-slate-900">
                {formatINR(customer.walletBalance)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Account Type:</span>
              <span className="font-semibold text-slate-800">Prepaid Direct Switch</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Auto-Recharge:</span>
              <span className="text-slate-600">Disabled</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRANSACTIONS */}
      {activeTab === "transactions" && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="divide-y divide-slate-100">
            {custTx.map((t) => (
              <div key={t.id} className="p-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-900 capitalize">
                    {t.type.replace("_", " ")}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {t.reference} • {formatDate(t.date)}
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-slate-900">
                  {formatINR(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CONTACTS */}
      {activeTab === "contacts" && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="p-4 border-b border-slate-100 text-xs text-slate-500">
            Total {custContacts.length} verified audience contacts in account
          </div>
          <div className="divide-y divide-slate-100">
            {custContacts.slice(0, 6).map((cnt) => (
              <div key={cnt.id} className="p-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{cnt.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {formatIndianMobile(cnt.mobile)}
                  </div>
                </div>
                <span className="text-[11px] font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                  {cnt.group}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ACTIVITY LOG */}
      {activeTab === "activity" && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-card space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
            Audit Trail & Event Log
          </h3>
          <div className="space-y-2">
            {[
              {
                time: "Today, 11:42 AM",
                event: "SMS Campaign Dispatched (Winter Arrival Alert) via EJOIN EIMS",
              },
              { time: "09 Nov, 03:15 PM", event: "Wallet top-up via UPI approved (₹5,000.00)" },
              {
                time: "07 Nov, 10:20 AM",
                event: "Meta WhatsApp template 'wa_festive_offer_v2' mapped to account",
              },
              {
                time: "15 Aug, 09:00 AM",
                event: "Account created and DLT entity verified by Super Admin",
              },
            ].map((log, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2 rounded bg-slate-50">
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div>
                  <div className="font-medium text-slate-800">{log.event}</div>
                  <div className="text-[11px] text-slate-400">{log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { formatINR, formatNumber, formatDate, formatIndianMobile } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Agency } from "@/types";
import { Briefcase, Users, Plus, ShieldCheck, Tag } from "lucide-react";

export default function AdminAgenciesPage() {
  const { agencies, customers } = useAppStore();
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);

  const columns: Column<Agency>[] = [
    {
      header: "Agency Name",
      accessorKey: "agencyName",
      cell: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.agencyName}</div>
          <div className="text-[11px] text-slate-500">{row.ownerName} • {row.email}</div>
        </div>
      ),
    },
    {
      header: "Mobile",
      accessorKey: "mobile",
      cell: (row) => (
        <span className="font-mono text-xs text-slate-800 font-medium">
          {formatIndianMobile(row.mobile)}
        </span>
      ),
    },
    {
      header: "Clients Managed",
      accessorKey: "clientsManaged",
      cell: (row) => (
        <span className="inline-flex items-center gap-1 font-bold text-xs text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full">
          <Users className="w-3 h-3 text-slate-600" />
          {row.clientsManaged} Sub-accounts
        </span>
      ),
    },
    {
      header: "Agency Wallet",
      accessorKey: "walletBalance",
      cell: (row) => <span className="font-bold text-slate-900">{formatINR(row.walletBalance)}</span>,
    },
    {
      header: "Custom Pricing Tier",
      cell: (row) => (
        <div className="text-[11px] space-y-0.5">
          <div>SMS: <span className="font-semibold text-slate-900">{formatINR(row.customPricing.smsPromo)}</span></div>
          <div>WA: <span className="font-semibold text-slate-900">{formatINR(row.customPricing.whatsappMarketing)}</span></div>
        </div>
      ),
    },
    {
      header: "Account Status",
      accessorKey: "accountStatus",
      cell: (row) => <StatusBadge status={row.accountStatus} />,
    },
    {
      header: "Actions",
      className: "whitespace-nowrap text-right",
      cell: (row) => (
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedAgency(row)}
            className="h-7 px-2.5 text-xs font-semibold whitespace-nowrap shadow-none"
          >
            Manage Agency
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Agency Partners
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            White-label digital marketing agencies reselling SMS and WhatsApp API services
          </p>
        </div>
      </div>

      <DataTable
        data={agencies}
        columns={columns}
        searchPlaceholder="Search agency partner name..."
        tableClassName="min-w-[1050px]"
      />

      {/* Agency Details Modal */}
      <Modal
        isOpen={!!selectedAgency}
        onClose={() => setSelectedAgency(null)}
        size="md"
        title={selectedAgency?.agencyName}
        description={`Partner since ${formatDate(selectedAgency?.joinedDate || "", false)}`}
      >
        {selectedAgency && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-[11px] text-slate-500">Contact Person</span>
                <div className="font-bold text-slate-900">{selectedAgency.ownerName}</div>
                <div className="text-[11px] text-slate-600">{selectedAgency.email}</div>
              </div>
              <div>
                <span className="text-[11px] text-slate-500">Agency Balance</span>
                <div className="text-base font-bold text-slate-900">
                  {formatINR(selectedAgency.walletBalance)}
                </div>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-1">
                Wholesale Agency Reseller Pricing:
              </span>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[10px] text-slate-500">SMS Promo</div>
                  <div className="font-bold text-slate-900">
                    {formatINR(selectedAgency.customPricing.smsPromo)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">SMS Trans</div>
                  <div className="font-bold text-slate-900">
                    {formatINR(selectedAgency.customPricing.smsTrans)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">WhatsApp Marketing</div>
                  <div className="font-bold text-slate-900">
                    {formatINR(selectedAgency.customPricing.whatsappMarketing)}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-1.5">
                Sub-Accounts Linked ({selectedAgency.managedClientIds.length}):
              </span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {selectedAgency.managedClientIds.map((cid) => {
                  const cust = customers.find((c) => c.id === cid);
                  return (
                    <div
                      key={cid}
                      className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between"
                    >
                      <span className="font-semibold text-slate-800">
                        {cust?.businessName || cid}
                      </span>
                      <span className="text-slate-500">{cust?.businessCategory}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}

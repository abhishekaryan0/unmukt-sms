"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { formatINR, formatNumber } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Supplier } from "@/types";
import { Truck, Plus, Edit2, Server, CheckCircle2, ShieldCheck } from "lucide-react";

export default function AdminSuppliersPage() {
  const { suppliers, updateSupplier } = useAppStore();
  const { toast } = useToast();

  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<"sms" | "whatsapp">("sms");
  const [tps, setTps] = useState(1000);
  const [endpoint, setEndpoint] = useState("");

  const handleOpenEdit = (sup: Supplier) => {
    setEditingSupplier(sup);
    setName(sup.name);
    setChannel(sup.channel as any);
    setTps(sup.tps);
    setEndpoint(sup.apiEndpoint);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupplier) return;

    updateSupplier({
      ...editingSupplier,
      name,
      tps,
      apiEndpoint: endpoint,
    });

    toast({
      title: "Supplier Updated",
      message: `${name} gateway configuration saved.`,
      type: "success",
    });

    setShowModal(false);
  };

  const columns: Column<Supplier>[] = [
    {
      header: "Supplier Name",
      accessorKey: "name",
      cell: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.name}</div>
          <div className="text-[11px] text-slate-400 font-mono truncate max-w-xs">{row.apiEndpoint}</div>
        </div>
      ),
    },
    {
      header: "Channel",
      accessorKey: "channel",
      cell: (row) => <span className="font-bold uppercase text-xs text-slate-700">{row.channel}</span>,
    },
    {
      header: "Status",
      accessorKey: "connectionStatus",
      cell: (row) => <StatusBadge status={row.connectionStatus} />,
    },
    {
      header: "Wholesale Cost",
      cell: (row) => (
        <span className="font-bold text-slate-900">
          {row.channel === "sms"
            ? `${formatINR(row.costPerMessage.smsPromo)} / SMS`
            : `${formatINR(row.costPerMessage.whatsappMarketing || 0.72)} / WA`}
        </span>
      ),
    },
    {
      header: "Total Volume",
      accessorKey: "messageVolume",
      cell: (row) => (
        <span className="font-semibold text-slate-900">{formatNumber(row.messageVolume)}</span>
      ),
    },
    {
      header: "Success Rate",
      accessorKey: "successRate",
      cell: (row) => (
        <div className="text-emerald-700 font-bold">
          {row.successRate}%
          <span className="text-[10px] text-slate-400 block font-normal">
            Failed: {formatNumber(row.failedMessages)}
          </span>
        </div>
      ),
    },
    {
      header: "Throughput (TPS)",
      accessorKey: "tps",
      cell: (row) => <span className="font-mono text-slate-800">{row.tps} msg/sec</span>,
    },
    {
      header: "Actions",
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleOpenEdit(row)}
          className="h-7 px-2.5 text-xs gap-1"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Configure</span>
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Telecom Gateway Suppliers
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage upstream carriers, EJOIN SIM pools, Tanla DLT nodes, and Meta WhatsApp BSP endpoints
          </p>
        </div>
      </div>

      <DataTable
        data={suppliers}
        columns={columns}
        searchPlaceholder="Search gateway suppliers..."
      />

      {/* Edit Supplier Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        size="md"
        title="Configure Gateway Supplier"
        description="Update carrier endpoint, maximum TPS capacity, and routing credentials"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supplier / Gateway Name
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Channel
              </label>
              <Input value={channel.toUpperCase()} disabled className="bg-slate-100" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Max TPS (Capacity)
              </label>
              <Input
                type="number"
                value={tps}
                onChange={(e) => setTps(parseInt(e.target.value) || 100)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Gateway API / SMPP Endpoint URL
            </label>
            <Input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} required />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-[11px] text-blue-900">
            Frontend demonstration mode: Gateway health check pings are simulated in the UI.
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-slate-900 text-white">
              Save Configuration
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

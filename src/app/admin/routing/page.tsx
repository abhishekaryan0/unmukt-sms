"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { formatINR } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { RoutingRule } from "@/types";
import { GitFork, Plus, Edit2, Trash2, ArrowRight } from "lucide-react";

export default function AdminRoutingPage() {
  const { routingRules, suppliers, addRoutingRule, updateRoutingRule, deleteRoutingRule } =
    useAppStore();
  const { toast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<RoutingRule | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<"sms" | "whatsapp">("sms");
  const [messageType, setMessageType] = useState("promotional");
  const [supplierId, setSupplierId] = useState("supp-01");
  const [priority, setPriority] = useState(1);
  const [cost, setCost] = useState("0.09");
  const [condition, setCondition] = useState("Traffic: Cost Optimized");

  const handleOpenAdd = () => {
    setEditingRule(null);
    setName("");
    setChannel("sms");
    setMessageType("promotional");
    setSupplierId(suppliers[0]?.id || "supp-01");
    setPriority(1);
    setCost("0.09");
    setCondition("Bulk traffic, lowest wholesale rate");
    setShowModal(true);
  };

  const handleOpenEdit = (rule: RoutingRule) => {
    setEditingRule(rule);
    setName(rule.name);
    setChannel(rule.channel);
    setMessageType(rule.messageType);
    setSupplierId(rule.supplierId);
    setPriority(rule.priority);
    setCost(rule.cost.toString());
    setCondition(rule.condition);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedSup = suppliers.find((s) => s.id === supplierId);
    const supName = selectedSup?.name || "Primary Gateway";

    if (editingRule) {
      updateRoutingRule({
        ...editingRule,
        name: name.trim(),
        channel,
        messageType,
        supplierId,
        supplierName: supName,
        priority,
        cost: parseFloat(cost) || 0.1,
        condition,
      });
      toast({ title: "Routing Rule Updated", message: `Rule "${name}" updated.`, type: "success" });
    } else {
      addRoutingRule({
        name: name.trim(),
        channel,
        messageType,
        supplierId,
        supplierName: supName,
        priority,
        cost: parseFloat(cost) || 0.1,
        status: "active",
        condition,
      });
      toast({ title: "Routing Rule Created", message: `New rule active on switchboard.`, type: "success" });
    }

    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    deleteRoutingRule(id);
    toast({ title: "Rule Deleted", message: "Routing rule removed from switch.", type: "success" });
  };

  const columns: Column<RoutingRule>[] = [
    {
      header: "Rule Name",
      accessorKey: "name",
      cell: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.name}</div>
          <div className="text-[11px] text-slate-500">{row.condition}</div>
        </div>
      ),
    },
    {
      header: "Channel & Type",
      cell: (row) => (
        <span className="font-semibold uppercase text-xs text-slate-800">
          {row.channel} • {row.messageType}
        </span>
      ),
    },
    {
      header: "Target Carrier Gateway",
      accessorKey: "supplierName",
      cell: (row) => (
        <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs">
          {row.supplierName}
        </span>
      ),
    },
    {
      header: "Priority",
      accessorKey: "priority",
      cell: (row) => <span className="font-bold text-slate-900">Priority #{row.priority}</span>,
    },
    {
      header: "Cost / Msg",
      accessorKey: "cost",
      cell: (row) => <span className="font-bold text-slate-900">{formatINR(row.cost)}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenEdit(row)}
            className="h-7 px-2 text-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
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
            Routing & Dispatch Rules Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure dynamic carrier distribution, failover triggers, and cost-weighted routes
          </p>
        </div>

        <Button size="sm" onClick={handleOpenAdd} className="bg-slate-900 text-white gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Add Routing Rule</span>
        </Button>
      </div>

      <DataTable
        data={routingRules}
        columns={columns}
        searchPlaceholder="Search routing rules..."
        tableClassName="min-w-[1050px]"
      />

      {/* Add / Edit Rule Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        size="md"
        title={editingRule ? "Edit Routing Rule" : "Create Carrier Routing Rule"}
        description="Route specific message traffic through optimal upstream supplier"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Rule Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Supplier
              </label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.channel.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority (1 = Highest)
              </label>
              <Input
                type="number"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value) || 1)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Wholesale Cost (INR)
              </label>
              <Input
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                leftIcon={<span className="text-xs font-bold text-slate-400">₹</span>}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Routing Condition / Note
            </label>
            <Input
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g. Traffic: Service Alerts, High Deliverability"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-slate-900 text-white">
              {editingRule ? "Save Rule" : "Create Rule"}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

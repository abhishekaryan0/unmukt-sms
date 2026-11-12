"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { formatNumber, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import {
  FolderTree,
  Plus,
  Users,
  Send,
  MessageCircle,
  Trash2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function ContactGroupsPage() {
  const { contactGroups, addGroup, deleteGroup, contacts, activeCustomer } = useAppStore();
  const { toast } = useToast();

  const [showAddModal, setShowAddModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

  // Scope groups and contacts strictly to the active client
  const clientGroups = contactGroups.filter((g) => g.customerId === activeCustomer.id);
  const clientContacts = contacts.filter((c) => c.customerId === activeCustomer.id);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      toast({ title: "Name Required", message: "Please provide a group name", type: "error" });
      return;
    }

    addGroup({
      name: groupName.trim(),
      description: groupDescription.trim() || "Target marketing group",
    });

    toast({
      title: "Group Created",
      message: `Group "${groupName}" is ready for broadcasts.`,
      type: "success",
    });

    setGroupName("");
    setGroupDescription("");
    setShowAddModal(false);
  };

  const handleDelete = () => {
    if (deletingGroupId) {
      deleteGroup(deletingGroupId);
      toast({ title: "Group Deleted", message: "The group was removed.", type: "success" });
      setDeletingGroupId(null);
    }
  };

  return (
    <ClientLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Contact Groups
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize customer lists by purchase history, location, and festive events
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="bg-slate-900 text-white gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Group</span>
        </Button>
      </div>

      {/* Group Cards Grid */}
      {clientGroups.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-card">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center mb-3">
            <FolderTree className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">No Contact Groups Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
            Create segmented groups (like VIP Customers, Leads, Festive Offers) to target your campaigns effectively.
          </p>
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="bg-slate-900 text-white gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Group</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientGroups.map((g) => {
            // Count contacts belonging to this group
            const liveCount = clientContacts.filter((c) => c.group === g.name).length;
            const displayCount = Math.max(g.contactCount, liveCount);

            return (
              <div
                key={g.id}
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-card hover:shadow-elevated transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FolderTree className="w-5 h-5" />
                    </div>

                    <button
                      onClick={() => setDeletingGroupId(g.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-50 transition-colors"
                      title="Delete Group"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-3">{g.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{g.description}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-slate-500">Recipients:</span>
                    <span className="font-bold text-slate-900">
                      {formatNumber(displayCount)} contacts
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/send-sms?group=${g.id}`} className="block">
                      <button className="w-full py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors">
                        <Send className="w-3 h-3 text-slate-600" />
                        <span>SMS</span>
                      </button>
                    </Link>
                    <Link href={`/whatsapp?group=${g.id}`} className="block">
                      <button className="w-full py-1.5 px-2 rounded-lg bg-[#E8F8EE] hover:bg-[#d8f4e2] text-[#075E54] text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors border border-[#b5e7c8]">
                        <MessageCircle className="w-3 h-3 text-[#25D366]" />
                        <span>WhatsApp</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Group Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        size="sm"
        title="Create Contact Group"
        description="E.g. VIP Customers, Coaching Students, Festival Offers"
      >
        <form onSubmit={handleCreateGroup} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Group Name *
            </label>
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. VIP Customers, Diwali Offers 2026"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description
            </label>
            <Input
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="e.g. High spending buyers from festive season"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-slate-900 text-white">
              Create Group
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deletingGroupId}
        onClose={() => setDeletingGroupId(null)}
        onConfirm={handleDelete}
        title="Delete Contact Group"
        description="Are you sure you want to delete this group? The contacts themselves will remain in your general database."
        variant="destructive"
        confirmText="Yes, Delete Group"
      />
    </ClientLayout>
  );
}

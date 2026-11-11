"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { formatDate } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SupportTicket } from "@/types";
import { Headphones, Eye, Send } from "lucide-react";

export default function AdminSupportPage() {
  const { supportTickets, replyToTicket } = useAppStore();
  const { toast } = useToast();

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [adminReply, setAdminReply] = useState("");

  const handleSendAdminReply = () => {
    if (!adminReply.trim() || !selectedTicket) return;

    replyToTicket(
      selectedTicket.id,
      adminReply.trim(),
      "support",
      "Carrier Operations Desk"
    );

    toast({
      title: "Support Response Dispatched",
      message: "Customer notified on portal.",
      type: "success",
    });

    setAdminReply("");
    const updated = supportTickets.find((t) => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
  };

  const columns: Column<SupportTicket>[] = [
    {
      header: "Ticket ID",
      accessorKey: "id",
      cell: (row) => <span className="font-mono text-xs font-bold text-slate-800">{row.id}</span>,
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
      header: "Subject & Category",
      cell: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.subject}</div>
          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
            {row.category}
          </span>
        </div>
      ),
    },
    {
      header: "Priority",
      accessorKey: "priority",
      cell: (row) => (
        <span
          className={`text-xs font-bold uppercase ${
            row.priority === "high" || row.priority === "critical"
              ? "text-rose-600"
              : "text-slate-600"
          }`}
        >
          {row.priority}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Created",
      accessorKey: "createdDate",
      cell: (row) => <span className="text-slate-500 text-[11px]">{formatDate(row.createdDate)}</span>,
    },
    {
      header: "Actions",
      className: "whitespace-nowrap text-right",
      cell: (row) => (
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedTicket(row)}
            className="h-7 px-2.5 text-xs gap-1 font-semibold whitespace-nowrap shadow-none"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Reply</span>
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
            Helpdesk & Support Dispatch
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Resolve customer tickets concerning TRAI DLT verification, Meta template flags, and billing
          </p>
        </div>
      </div>

      <DataTable
        data={supportTickets}
        columns={columns}
        searchPlaceholder="Search tickets, subject, customer..."
        tableClassName="min-w-[1050px]"
      />

      {/* Admin Ticket Thread & Reply Modal */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        size="lg"
        title={
          <div className="flex items-center gap-2">
            <span>{selectedTicket?.subject}</span>
            {selectedTicket && <StatusBadge status={selectedTicket.status} />}
          </div>
        }
        description={`Customer: ${selectedTicket?.customerName} (${selectedTicket?.customerId})`}
      >
        {selectedTicket && (
          <div className="space-y-4">
            <div className="space-y-3 max-h-72 overflow-y-auto p-1">
              {selectedTicket.messages.map((m, idx) => {
                const isSupport = m.sender === "support";
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isSupport ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">{m.senderName}</span>
                      <span>•</span>
                      <span>{formatDate(m.timestamp)}</span>
                    </div>
                    <div
                      className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                        isSupport
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Official Admin Response
              </label>
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                  placeholder="Type official operator response..."
                  className="flex-1 rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <Button
                  onClick={handleSendAdminReply}
                  disabled={!adminReply.trim()}
                  className="bg-blue-600 hover:bg-blue-500 text-white self-end h-10 px-4"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Reply
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}

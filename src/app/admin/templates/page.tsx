"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { formatDate } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Template } from "@/types";
import { FileCode2, Check, X, Send, MessageCircle } from "lucide-react";

export default function AdminTemplatesPage() {
  const { templates, updateTemplateStatus } = useAppStore();
  const { toast } = useToast();

  const handleApprove = (id: string, name: string) => {
    updateTemplateStatus(id, "approved");
    toast({ title: "Template Approved", message: `${name} approved for broadcast.`, type: "success" });
  };

  const handleReject = (id: string, name: string) => {
    updateTemplateStatus(id, "rejected");
    toast({ title: "Template Rejected", message: `${name} rejected for compliance.`, type: "error" });
  };

  const columns: Column<Template>[] = [
    {
      header: "Template Name",
      accessorKey: "name",
      cell: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.name}</div>
          <div className="text-[11px] text-slate-500 truncate max-w-sm">{row.content}</div>
        </div>
      ),
    },
    {
      header: "Channel",
      accessorKey: "channel",
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1 font-bold text-xs uppercase ${
            row.channel === "whatsapp" ? "text-[#075E54]" : "text-blue-600"
          }`}
        >
          {row.channel === "whatsapp" ? (
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
          ) : (
            <Send className="w-3.5 h-3.5 text-blue-600" />
          )}
          {row.channel}
        </span>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (row) => (
        <span className="text-xs uppercase font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {row.category}
        </span>
      ),
    },
    {
      header: "Language",
      accessorKey: "language",
      cell: (row) => <span className="text-slate-600 text-xs">{row.language}</span>,
    },
    {
      header: "Status",
      accessorKey: "approvalStatus",
      cell: (row) => <StatusBadge status={row.approvalStatus} />,
    },
    {
      header: "Created",
      accessorKey: "createdDate",
      cell: (row) => <span className="text-slate-500 text-[11px]">{formatDate(row.createdDate, false)}</span>,
    },
    {
      header: "Review Actions",
      className: "whitespace-nowrap text-right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
          {row.approvalStatus === "pending" && (
            <>
              <button
                onClick={() => handleApprove(row.id, row.name)}
                className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                title="Approve Template"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleReject(row.id, row.name)}
                className="p-1 rounded text-rose-600 hover:bg-rose-50"
                title="Reject Template"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
          {row.approvalStatus === "approved" && (
            <span className="text-[10px] text-emerald-600 font-medium">Verified Active</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Platform Template Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage TRAI DLT template mappings and Meta WhatsApp review statuses
          </p>
        </div>
      </div>

      <DataTable
        data={templates}
        columns={columns}
        searchPlaceholder="Search template name, content..."
        tableClassName="min-w-[1050px]"
      />
    </AdminLayout>
  );
}

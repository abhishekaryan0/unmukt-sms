"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Template } from "@/types";
import {
  FileText,
  Plus,
  Send,
  MessageCircle,
  Copy,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

export default function TemplatesPage() {
  const { templates, addTemplate } = useAppStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<"sms" | "whatsapp">("sms");
  const [category, setCategory] = useState<"promotional" | "transactional" | "marketing" | "utility">("promotional");
  const [content, setContent] = useState("");
  const [senderId, setSenderId] = useState("SHRFSH");

  const filteredTemplates = templates.filter((t) => {
    if (activeTab === "sms") return t.channel === "sms";
    if (activeTab === "whatsapp") return t.channel === "whatsapp";
    return true;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Template Copied", message: "Content copied to clipboard.", type: "success" });
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      toast({ title: "Fields Required", message: "Please fill template name and message text", type: "error" });
      return;
    }

    addTemplate({
      name: name.trim(),
      channel,
      category,
      language: "English / Hinglish",
      approvalStatus: "pending", // Always pending to reflect realistic DLT/Meta compliance!
      content: content.trim(),
      senderId: channel === "sms" ? senderId : undefined,
    });

    toast({
      title: "Template Submitted for Review",
      message: "Template has been saved with 'Pending Approval' status as required by TRAI DLT / Meta regulations.",
      type: "info",
    });

    setName("");
    setContent("");
    setShowAddModal(false);
  };

  return (
    <ClientLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Message Templates
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pre-approved Indian festive, promotional, and transactional message templates
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="bg-slate-900 text-white gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Submit Custom Template</span>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: "all", label: "All Templates", count: templates.length },
          { id: "sms", label: "DLT SMS Templates", count: templates.filter((t) => t.channel === "sms").length },
          { id: "whatsapp", label: "Meta WhatsApp Templates", count: templates.filter((t) => t.channel === "whatsapp").length },
        ]}
      />

      {/* Compliance Notice */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Indian Telecom Regulatory Notice:</span> All SMS templates
          must be mapped with their verified TRAI DLT Template ID. WhatsApp marketing templates
          require Meta category approval. Ready-made templates shown below are pre-approved for
          instant broadcasting.
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-card hover:shadow-elevated transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span
                    className={`inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider ${
                      tpl.channel === "whatsapp" ? "text-[#075E54]" : "text-blue-600"
                    }`}
                  >
                    {tpl.channel === "whatsapp" ? (
                      <MessageCircle className="w-3 h-3 text-[#25D366]" />
                    ) : (
                      <Send className="w-3 h-3 text-blue-600" />
                    )}
                    {tpl.channel} • {tpl.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">{tpl.name}</h3>
                </div>
                <StatusBadge status={tpl.approvalStatus} />
              </div>

              {/* Message Box */}
              <div className="mt-3 bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                {tpl.content}
              </div>

              {/* Buttons if WhatsApp */}
              {tpl.buttons && tpl.buttons.length > 0 && (
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  {tpl.buttons.map((b, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold bg-slate-100 text-blue-600 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      {b.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-mono">
                {tpl.dltTemplateId || tpl.metaTemplateId || "DLT Pending"}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy(tpl.content)}
                  className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-50"
                  title="Copy Text"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                {tpl.approvalStatus === "approved" && (
                  <Link
                    href={tpl.channel === "sms" ? "/send-sms" : "/whatsapp"}
                    className="font-semibold text-slate-900 hover:text-blue-600 ml-1"
                  >
                    Use in Campaign →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Custom Template Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        size="md"
        title="Submit New Template for Verification"
        description="Submit custom SMS or WhatsApp message drafts for regulatory review"
      >
        <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Template Name *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Wedding Season 20% Off"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="sms">SMS (TRAI DLT)</option>
                <option value="whatsapp">WhatsApp (Meta)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="promotional">Promotional / Marketing</option>
                <option value="transactional">Transactional / Utility</option>
              </select>
            </div>
          </div>

          {channel === "sms" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sender Header
              </label>
              <Input
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
                placeholder="SHRFSH"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Template Content * (Include {"{{1}}"} for customer variables)
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Dear {{1}}, enjoy Flat 20% off on all sarees at Sharma Fashion Store..."
              className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 leading-relaxed focus:outline-none focus:ring-1 focus:ring-slate-900"
              required
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-500">
            Note: New templates will be marked as <strong>Pending Verification</strong> until reviewed
            by the telecom registrar.
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-slate-900 text-white">
              Submit Template
            </Button>
          </div>
        </form>
      </Modal>
    </ClientLayout>
  );
}

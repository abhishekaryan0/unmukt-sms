"use client";

import React, { useState } from "react";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { SupportTicket } from "@/types";
import {
  HelpCircle,
  Plus,
  MessageSquare,
  Send,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Headphones,
} from "lucide-react";

export default function ClientSupportPage() {
  const { supportTickets, createSupportTicket, replyToTicket, activeCustomer } = useAppStore();
  const { toast } = useToast();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // New ticket state
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<SupportTicket["category"]>("DLT Approval");
  const [message, setMessage] = useState("");
  const [replyText, setReplyText] = useState("");

  const clientTickets = supportTickets.filter((t) => t.customerId === activeCustomer.id);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast({ title: "Required", message: "Please provide a subject and message", type: "error" });
      return;
    }

    const newTicket = createSupportTicket({
      subject: subject.trim(),
      category,
      message: message.trim(),
    });

    toast({
      title: "Support Ticket Raised",
      message: `Ticket ID ${newTicket.id} created. Support team will respond within 2 hours.`,
      type: "success",
    });

    setSubject("");
    setMessage("");
    setShowCreateModal(false);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    replyToTicket(selectedTicket.id, replyText.trim(), "customer", "Rajesh Sharma");
    setReplyText("");
    toast({ title: "Reply Sent", message: "Your message has been posted.", type: "success" });

    // Update active modal view
    const updated = supportTickets.find((t) => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
  };

  return (
    <ClientLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Customer Support & Helpdesk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct assistance for DLT sender ID approval, Meta template onboarding, and billing queries
          </p>
        </div>

        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-slate-900 text-white font-semibold gap-1.5 shadow-subtle"
        >
          <Plus className="w-4 h-4" />
          <span>New Support Ticket</span>
        </Button>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Your Tickets</h3>
          <span className="text-xs text-slate-500">{clientTickets.length} tickets total</span>
        </div>

        <div className="divide-y divide-slate-100">
          {clientTickets.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-slate-500">{t.id}</span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{t.subject}</span>
                  <StatusBadge status={t.status} />
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                    {t.category}
                  </span>
                  <span>•</span>
                  <span>Created {formatDate(t.createdDate)}</span>
                  <span>•</span>
                  <span>{t.messages.length} messages</span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="shrink-0 text-xs">
                Open Thread
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        size="md"
        title="Create New Support Ticket"
        description="Our telecom specialists assist with DLT and WhatsApp compliance"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Issue Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="DLT Approval">DLT Sender ID / Header Approval</option>
              <option value="WhatsApp Template">WhatsApp Template Categorization</option>
              <option value="Wallet/Billing">Wallet Recharge & GST Invoicing</option>
              <option value="Delivery Issue">SMS Carrier Delivery Inquiries</option>
              <option value="Technical">API & Webhook Assistance</option>
              <option value="General">General Inquiries</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject *
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Need second DLT Sender ID approved"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Describe your issue or query *
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide exact details so our support team can verify..."
              className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 leading-relaxed focus:outline-none focus:ring-1 focus:ring-slate-900"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-slate-900 text-white">
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>

      {/* Ticket Conversation Thread Modal */}
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
        description={`Ticket ID: ${selectedTicket?.id} • Category: ${selectedTicket?.category}`}
      >
        {selectedTicket && (
          <div className="space-y-4">
            {/* Conversation Messages */}
            <div className="space-y-3 max-h-80 overflow-y-auto p-1">
              {selectedTicket.messages.map((m, idx) => {
                const isCustomer = m.sender === "customer";
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isCustomer ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">{m.senderName}</span>
                      <span>•</span>
                      <span>{formatDate(m.timestamp)}</span>
                    </div>
                    <div
                      className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                        isCustomer
                          ? "bg-slate-900 text-white rounded-tr-none"
                          : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Box */}
            <div className="pt-3 border-t border-slate-200">
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a reply to the support team..."
                  className="flex-1 rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <Button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="bg-slate-900 text-white self-end h-10 px-4"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Reply
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </ClientLayout>
  );
}

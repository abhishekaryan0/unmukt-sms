"use client";

import React, { useState, useMemo } from "react";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { SavedReply } from "@/types";
import {
  MessageSquareQuote,
  Plus,
  Search,
  Copy,
  Trash2,
  Sparkles,
  Tag,
  Check,
  Zap,
} from "lucide-react";

export default function SavedRepliesPage() {
  const { savedReplies, addSavedReply, deleteSavedReply } = useAppStore();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [shortcut, setShortcut] = useState("");
  const [category, setCategory] = useState<SavedReply["category"]>("Greeting");
  const [content, setContent] = useState("");

  const categories = ["all", "Greeting", "Support", "Billing", "Sales", "FAQ"];

  const filteredReplies = useMemo(() => {
    return savedReplies.filter((r) => {
      if (selectedCategory !== "all" && r.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.shortcut.toLowerCase().includes(q) ||
          r.content.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [savedReplies, selectedCategory, searchQuery]);

  const handleCopy = (text: string, shortcutText: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      message: `Shortcut "${shortcutText}" copied. You can paste it into any chat.`,
      type: "success",
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    let cleanShortcut = shortcut.trim();
    if (!cleanShortcut.startsWith("/")) {
      cleanShortcut = "/" + cleanShortcut;
    }

    addSavedReply({
      title: title.trim(),
      shortcut: cleanShortcut,
      category,
      content: content.trim(),
    });

    setTitle("");
    setShortcut("");
    setContent("");
    setShowAddModal(false);
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <MessageSquareQuote className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Saved Canned Replies
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Create quick response templates and keyboard shortcuts for your agents to resolve customer chats faster.
            </p>
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-subtle"
          >
            <Plus className="w-4 h-4" />
            <span>Create Saved Reply</span>
          </Button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shortcuts..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Grid of Saved Replies */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReplies.map((reply) => (
            <div
              key={reply.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-subtle p-5 flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {reply.title}
                  </h3>
                  <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 shrink-0">
                    {reply.shortcut}
                  </span>
                </div>

                <div className="mt-2">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                    {reply.category}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-3 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                  {reply.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleCopy(reply.content, reply.shortcut)}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeletingId(reply.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete Template"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create Saved Reply Template"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Title / Description
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Return Policy Instructions"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Shortcut (starts with /)
              </label>
              <Input
                value={shortcut}
                onChange={(e) => setShortcut(e.target.value)}
                placeholder="/return"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Greeting" className="dark:bg-slate-900 dark:text-white">Greeting</option>
                <option value="Support" className="dark:bg-slate-900 dark:text-white">Support</option>
                <option value="Billing" className="dark:bg-slate-900 dark:text-white">Billing</option>
                <option value="Sales" className="dark:bg-slate-900 dark:text-white">Sales</option>
                <option value="FAQ" className="dark:bg-slate-900 dark:text-white">FAQ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Reply Message Body
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Type the pre-approved response here..."
              className="w-full p-2.5 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              type="button"
              onClick={() => setShowAddModal(false)}
              className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Template
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) {
            deleteSavedReply(deletingId);
            setDeletingId(null);
          }
        }}
        title="Delete Saved Reply?"
        description="Are you sure you want to remove this canned response template? Agents will no longer be able to use this keyboard shortcut in active chats."
        confirmText="Yes, Delete Reply"
        variant="destructive"
      />
    </ClientLayout>
  );
}

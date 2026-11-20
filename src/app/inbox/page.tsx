"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SocialChannelType, Conversation, ChatMessage, TeamMember } from "@/types";
import {
  WhatsAppIcon,
  MessengerIcon,
  InstagramIcon,
  TelegramIcon,
  ChannelBadge,
} from "@/components/shared/ChannelIcons";
import {
  Search,
  CheckCircle2,
  Clock,
  User,
  Tag,
  Paperclip,
  Smile,
  Send,
  Lock,
  MessageSquare,
  ChevronRight,
  MoreVertical,
  Check,
  CheckCheck,
  Plus,
  X,
  FileText,
  UserCheck,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  CornerDownRight,
  Filter,
  Eye,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";

export default function UnifiedInboxPage() {
  const {
    conversations,
    connectedChannels,
    teamMembers,
    savedReplies,
    sendConversationMessage,
    markConversationStatus,
    assignConversation,
    addTagToConversation,
    removeTagFromConversation,
    addInternalNote,
    activeCustomer,
  } = useAppStore();

  const { toast } = useToast();

  // Filters & Selection
  const [selectedChannel, setSelectedChannel] = useState<SocialChannelType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "unread" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConvId, setSelectedConvId] = useState<string>(() => {
    return conversations[0]?.id || "";
  });

  // Composer State
  const [composerMode, setComposerMode] = useState<"reply" | "note">("reply");
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSavedReplies, setShowSavedReplies] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string; type: "image" | "file"; url: string }[]>([]);

  // Right Panel toggling
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [newTagInput, setNewTagInput] = useState("");
  const [newNoteInput, setNewNoteInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat thread when conversation or messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConvId, conversations]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      // Channel filter
      if (selectedChannel !== "all" && conv.channelType !== selectedChannel) {
        return false;
      }
      // Status filter
      if (statusFilter === "open" && conv.status !== "open" && conv.status !== "unread") {
        return false;
      }
      if (statusFilter === "unread" && conv.status !== "unread" && conv.unreadCount === 0) {
        return false;
      }
      if (statusFilter === "resolved" && conv.status !== "resolved") {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = conv.customerName.toLowerCase().includes(q);
        const matchesMsg = conv.lastMessage.toLowerCase().includes(q);
        const matchesId = conv.customerIdentifier.toLowerCase().includes(q);
        const matchesTag = conv.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesMsg && !matchesId && !matchesTag) {
          return false;
        }
      }
      return true;
    });
  }, [conversations, selectedChannel, statusFilter, searchQuery]);

  // Active selected conversation
  const activeConversation = useMemo(() => {
    return (
      conversations.find((c) => c.id === selectedConvId) ||
      filteredConversations[0] ||
      conversations[0]
    );
  }, [conversations, selectedConvId, filteredConversations]);

  // Handle Send message / note
  const handleSendMessage = () => {
    if (!inputText.trim() && attachedFiles.length === 0) return;
    if (!activeConversation) return;

    sendConversationMessage(
      activeConversation.id,
      inputText,
      composerMode === "note",
      attachedFiles.length > 0 ? attachedFiles : undefined
    );

    setInputText("");
    setAttachedFiles([]);
    setShowEmojiPicker(false);
    setShowSavedReplies(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInsertSavedReply = (content: string) => {
    setInputText((prev) => (prev ? `${prev} ${content}` : content));
    setShowSavedReplies(false);
  };

  const quickEmojis = ["👍", "🙏", "❤️", "😊", "🎉", "📦", "✨", "🔥"];

  const popularTags = ["VIP Client", "Order Inquiry", "Urgent", "Exchange", "Follow-up", "Billing"];

  return (
    <ClientLayout>
      {/* Salesmartly-Inspired Unified Inbox Workspace */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-6rem)]">
        {/* Top Control Bar: Channels Switcher Tabs */}
        <div className="h-14 px-4 border-b border-slate-200/90 bg-slate-50/70 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setSelectedChannel("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                selectedChannel === "all"
                  ? "bg-slate-900 text-white shadow-subtle"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              <span>All Channels</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700">
                {conversations.length}
              </span>
            </button>

            <button
              onClick={() => setSelectedChannel("whatsapp")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                selectedChannel === "whatsapp"
                  ? "bg-[#25D366] text-white shadow-subtle"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              <WhatsAppIcon className={`w-3.5 h-3.5 ${selectedChannel === "whatsapp" ? "text-white" : "text-[#25D366]"}`} />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => setSelectedChannel("instagram")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                selectedChannel === "instagram"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-subtle"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              <InstagramIcon className={`w-3.5 h-3.5 ${selectedChannel === "instagram" ? "text-white" : "text-pink-600"}`} />
              <span>Instagram</span>
            </button>

            <button
              onClick={() => setSelectedChannel("messenger")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                selectedChannel === "messenger"
                  ? "bg-[#0084FF] text-white shadow-subtle"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              <MessengerIcon className={`w-3.5 h-3.5 ${selectedChannel === "messenger" ? "text-white" : "text-[#0084FF]"}`} />
              <span>Messenger</span>
            </button>

            <button
              onClick={() => setSelectedChannel("telegram")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                selectedChannel === "telegram"
                  ? "bg-[#0088cc] text-white shadow-subtle"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              <TelegramIcon className={`w-3.5 h-3.5 ${selectedChannel === "telegram" ? "text-white" : "text-[#0088cc]"}`} />
              <span>Telegram</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 transition-colors"
              title={showRightPanel ? "Hide Details Sidebar" : "Show Details Sidebar"}
            >
              {showRightPanel ? (
                <PanelRightClose className="w-4 h-4" />
              ) : (
                <PanelRightOpen className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* 3-Pane Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* ============================================================== */}
          {/* LEFT PANEL: Conversation List, Search & Status Filters         */}
          {/* ============================================================== */}
          <div className="w-80 md:w-88 border-r border-slate-200/90 flex flex-col shrink-0 bg-white">
            {/* Search Input */}
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats, contacts, tags..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1 mt-2.5 text-[11px]">
                {(["all", "open", "unread", "resolved"] as const).map((filter) => {
                  const isActive = statusFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`flex-1 py-1 rounded-md font-semibold capitalize text-center transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conversation List Scroll Area */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p>No conversations match your filter criteria.</p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = activeConversation?.id === conv.id;
                  const isUnread = conv.status === "unread" || conv.unreadCount > 0;
                  const isResolved = conv.status === "resolved";

                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setSelectedConvId(conv.id);
                        if (isUnread) {
                          // Auto mark as read on select
                          markConversationStatus(conv.id, "open");
                        }
                      }}
                      className={`p-3.5 cursor-pointer transition-all border-l-2 relative ${
                        isSelected
                          ? "bg-blue-50/70 border-blue-600"
                          : "hover:bg-slate-50/80 border-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar with Channel Overlay Badge */}
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">
                            {conv.customerName
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>
                          {/* Channel Badge Overlay */}
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-subtle border border-slate-200">
                            {conv.channelType === "whatsapp" && (
                              <WhatsAppIcon className="w-3 h-3 text-[#25D366]" />
                            )}
                            {conv.channelType === "messenger" && (
                              <MessengerIcon className="w-3 h-3 text-[#0084FF]" />
                            )}
                            {conv.channelType === "instagram" && (
                              <InstagramIcon className="w-3 h-3 text-pink-600" />
                            )}
                            {conv.channelType === "telegram" && (
                              <TelegramIcon className="w-3 h-3 text-[#0088cc]" />
                            )}
                          </div>
                        </div>

                        {/* Customer & Message Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`text-xs truncate ${
                                isUnread ? "font-bold text-slate-900" : "font-semibold text-slate-800"
                              }`}
                            >
                              {conv.customerName}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                              {conv.lastMessageTime}
                            </span>
                          </div>

                          <p
                            className={`text-xs mt-0.5 truncate ${
                              isUnread ? "font-semibold text-slate-900" : "text-slate-500"
                            }`}
                          >
                            {conv.lastMessage}
                          </p>

                          {/* Tags & Badges */}
                          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            {conv.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-slate-100 text-slate-600"
                              >
                                {tag}
                              </span>
                            ))}

                            {isResolved && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-slate-100 text-slate-500">
                                Resolved
                              </span>
                            )}

                            {isUnread && (
                              <span className="ml-auto w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                                {conv.unreadCount || 1}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ============================================================== */}
          {/* MIDDLE PANEL: Active Chat Conversation Thread & Composer       */}
          {/* ============================================================== */}
          <div className="flex-1 flex flex-col bg-slate-50/40 overflow-hidden">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="h-16 px-5 border-b border-slate-200/90 bg-white flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                        {activeConversation.customerName
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-slate-900 truncate">
                          {activeConversation.customerName}
                        </h2>
                        <ChannelBadge channelType={activeConversation.channelType} size="sm" />
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {activeConversation.customerIdentifier}
                        {activeConversation.customerCity ? ` • ${activeConversation.customerCity}` : ""}
                      </div>
                    </div>
                  </div>

                  {/* Header Actions: Assigned agent & Resolve */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    {/* Agent Assignment Dropdown */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <select
                        value={activeConversation.assignedToName || ""}
                        onChange={(e) => assignConversation(activeConversation.id, e.target.value)}
                        className="bg-transparent text-xs font-medium text-slate-800 focus:outline-none cursor-pointer"
                      >
                        <option value="">Unassigned</option>
                        {teamMembers.map((m) => (
                          <option key={m.id} value={m.name}>
                            {m.name} ({m.status})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Resolve Toggle Button */}
                    {activeConversation.status === "resolved" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markConversationStatus(activeConversation.id, "open")}
                        className="text-xs gap-1.5 border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolved (Reopen)</span>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markConversationStatus(activeConversation.id, "resolved")}
                        className="text-xs gap-1.5 border-slate-200 hover:bg-slate-50"
                      >
                        <Check className="w-3.5 h-3.5 text-slate-500" />
                        <span>Mark Resolved</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Messages Stream Scroll Area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {/* Date separator */}
                  <div className="flex items-center justify-center my-3">
                    <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full">
                      Today • Encrypted Cloud Gateway
                    </span>
                  </div>

                  {activeConversation.messages.map((msg) => {
                    const isCustomer = msg.sender === "customer";
                    const isAgent = msg.sender === "agent";
                    const isNote = msg.isInternalNote;

                    if (isNote) {
                      return (
                        <div
                          key={msg.id}
                          className="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5 my-3 max-w-lg mx-auto shadow-subtle"
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Internal Team Note (Private)</span>
                            <span className="text-[10px] text-amber-600 font-normal ml-auto">
                              {msg.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-amber-950 leading-relaxed">{msg.content}</p>
                          <div className="text-[10px] text-amber-700 font-medium mt-1">
                            By {msg.senderName}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-2.5 ${
                          isAgent ? "justify-end" : "justify-start"
                        }`}
                      >
                        {isCustomer && (
                          <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mb-0.5">
                            {msg.senderName[0]}
                          </div>
                        )}

                        <div className="max-w-[75%] sm:max-w-[65%] space-y-1">
                          <div
                            className={`rounded-2xl px-4 py-2.5 text-xs shadow-subtle ${
                              isAgent
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-white text-slate-900 border border-slate-200/90 rounded-bl-none"
                            }`}
                          >
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                            {/* Attachments */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {msg.attachments.map((att, idx) => (
                                  <div
                                    key={idx}
                                    className={`flex items-center gap-2 p-1.5 rounded-lg text-[11px] ${
                                      isAgent ? "bg-blue-700/60 text-white" : "bg-slate-100 text-slate-700"
                                    }`}
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span className="truncate">{att.name}</span>
                                    {att.size && <span className="opacity-75">({att.size})</span>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div
                            className={`flex items-center gap-1.5 text-[10px] text-slate-400 px-1 ${
                              isAgent ? "justify-end" : "justify-start"
                            }`}
                          >
                            <span>{msg.timestamp}</span>
                            {isAgent && (
                              <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div ref={messagesEndRef} />
                </div>

                {/* Rich Message Composer */}
                <div className="p-4 bg-white border-t border-slate-200/90 shrink-0">
                  {/* Mode Selector Tabs: Customer Reply vs Internal Note */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                      <button
                        type="button"
                        onClick={() => setComposerMode("reply")}
                        className={`px-3 py-1 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                          composerMode === "reply"
                            ? "bg-white text-blue-700 shadow-subtle"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <Send className="w-3 h-3" />
                        <span>Reply to Customer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setComposerMode("note")}
                        className={`px-3 py-1 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                          composerMode === "note"
                            ? "bg-amber-100 text-amber-800 shadow-subtle"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>Internal Note</span>
                      </button>
                    </div>

                    {/* Channel Indicator Badge */}
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span>Replying via</span>
                      <strong className="text-slate-700 capitalize font-semibold">
                        {activeConversation.channelType}
                      </strong>
                    </div>
                  </div>

                  {/* Attachment Pill Previews */}
                  {attachedFiles.length > 0 && (
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {attachedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-xs text-slate-700 border border-slate-200"
                        >
                          <Paperclip className="w-3 h-3 text-slate-500" />
                          <span className="truncate max-w-xs">{file.name}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setAttachedFiles((prev) => prev.filter((_, i) => i !== idx))
                            }
                            className="text-slate-400 hover:text-rose-600 ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input Box */}
                  <div
                    className={`rounded-xl border transition-all ${
                      composerMode === "note"
                        ? "border-amber-300 bg-amber-50/30 ring-1 ring-amber-300"
                        : "border-slate-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
                    }`}
                  >
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={2}
                      placeholder={
                        composerMode === "note"
                          ? "Write an internal team note (only visible to support agents)..."
                          : `Type a response to ${activeConversation.customerName}... (Press Enter to send)`
                      }
                      className="w-full p-3 text-xs text-slate-900 bg-transparent resize-none focus:outline-none placeholder:text-slate-400"
                    />

                    {/* Composer Toolbar */}
                    <div className="px-3 pb-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2 relative">
                        {/* Emoji Trigger */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="Insert Emoji"
                          >
                            <Smile className="w-4 h-4" />
                          </button>

                          {showEmojiPicker && (
                            <div className="absolute bottom-8 left-0 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 flex items-center gap-1.5">
                              {quickEmojis.map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => {
                                    setInputText((prev) => prev + emoji);
                                    setShowEmojiPicker(false);
                                  }}
                                  className="w-7 h-7 text-sm hover:bg-slate-100 rounded flex items-center justify-center transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Attachments Trigger */}
                        <button
                          type="button"
                          onClick={() => {
                            setAttachedFiles((prev) => [
                              ...prev,
                              {
                                name: `Catalog_Order_${Math.floor(1000 + Math.random() * 9000)}.pdf`,
                                size: "142 KB",
                                type: "file",
                                url: "#",
                              },
                            ]);
                            toast({
                              title: "File Attached",
                              message: "Mock document added to message payload.",
                              type: "info",
                            });
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title="Attach Document or Image"
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>

                        {/* Saved Replies Trigger */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowSavedReplies(!showSavedReplies)}
                            className="px-2 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                            title="Insert Saved Canned Response"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            <span>Saved Replies</span>
                          </button>

                          {showSavedReplies && (
                            <div className="absolute bottom-8 left-0 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-xs space-y-1">
                              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Quick Canned Responses
                              </div>
                              {savedReplies.map((r) => (
                                <button
                                  key={r.id}
                                  type="button"
                                  onClick={() => handleInsertSavedReply(r.content)}
                                  className="w-full p-2 text-left hover:bg-blue-50 rounded-lg transition-colors group"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-900 group-hover:text-blue-700">
                                      {r.title}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-blue-600">
                                      {r.shortcut}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                    {r.content}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Send Button */}
                      <Button
                        size="sm"
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() && attachedFiles.length === 0}
                        className={`text-xs gap-1.5 font-semibold ${
                          composerMode === "note"
                            ? "bg-amber-600 hover:bg-amber-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {composerMode === "note" ? (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Save Note</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Reply</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 text-xs text-center">
                <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
                <h3 className="text-sm font-bold text-slate-800">Select a Conversation</h3>
                <p className="max-w-xs mt-1">
                  Choose an active chat thread from the left panel to review messages and reply.
                </p>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* RIGHT PANEL: Customer Profile, Tags, Assignment & Notes        */}
          {/* ============================================================== */}
          {showRightPanel && activeConversation && (
            <div className="w-80 border-l border-slate-200/90 flex flex-col shrink-0 bg-white overflow-y-auto">
              <div className="p-5 border-b border-slate-100 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg font-bold mx-auto mb-3 shadow-subtle">
                  {activeConversation.customerName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {activeConversation.customerName}
                </h3>
                <div className="mt-1">
                  <ChannelBadge channelType={activeConversation.channelType} size="sm" />
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="p-4 border-b border-slate-100 space-y-2.5 text-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Contact Information
                </div>

                <div className="flex items-center gap-2.5 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-slate-900">
                    {activeConversation.customerIdentifier}
                  </span>
                </div>

                {activeConversation.customerEmail && (
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{activeConversation.customerEmail}</span>
                  </div>
                )}

                {activeConversation.customerCity && (
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{activeConversation.customerCity}</span>
                  </div>
                )}

                <div className="flex items-center gap-2.5 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>First Contact: 2026-11-18</span>
                </div>
              </div>

              {/* Assigned Agent */}
              <div className="p-4 border-b border-slate-100 space-y-2 text-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Assigned Team Member
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                      {(activeConversation.assignedToName || "Unassigned")[0]}
                    </div>
                    <span className="font-semibold text-slate-800">
                      {activeConversation.assignedToName || "Unassigned"}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>

              {/* Tags Section */}
              <div className="p-4 border-b border-slate-100 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Conversation Tags
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {activeConversation.tags.length} active
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {activeConversation.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 group"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTagFromConversation(activeConversation.id, tag)}
                        className="text-blue-400 hover:text-blue-900 ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Custom Tag Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (newTagInput.trim()) {
                      addTagToConversation(activeConversation.id, newTagInput);
                      setNewTagInput("");
                    }
                  }}
                  className="flex items-center gap-1.5 mt-2"
                >
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    placeholder="New tag..."
                    className="flex-1 px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <Button type="submit" size="sm" variant="outline" className="px-2 text-xs">
                    + Add
                  </Button>
                </form>

                {/* Popular Tags */}
                <div className="pt-1">
                  <span className="text-[10px] text-slate-400 block mb-1">Quick Add:</span>
                  <div className="flex flex-wrap gap-1">
                    {popularTags
                      .filter((t) => !activeConversation.tags.includes(t))
                      .slice(0, 4)
                      .map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => addTagToConversation(activeConversation.id, t)}
                          className="text-[10px] px-1.5 py-0.2 rounded border border-dashed border-slate-300 text-slate-500 hover:text-blue-600 hover:border-blue-400 transition-colors"
                        >
                          + {t}
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              {/* Internal Notes History in Right Panel */}
              <div className="p-4 space-y-2.5 text-xs flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-600" />
                    <span>Internal Notes Log</span>
                  </span>
                </div>

                <div className="space-y-2">
                  {(!activeConversation.internalNotes ||
                    activeConversation.internalNotes.length === 0) ? (
                    <div className="text-[11px] text-slate-400 italic">No notes recorded yet.</div>
                  ) : (
                    activeConversation.internalNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-950 text-xs"
                      >
                        <p className="leading-snug">{note.content}</p>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-amber-700 font-medium">
                          <span>{note.author}</span>
                          <span>{note.createdAt}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Quick Add Note Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (newNoteInput.trim()) {
                      addInternalNote(activeConversation.id, newNoteInput);
                      setNewNoteInput("");
                    }
                  }}
                  className="mt-3 pt-2 border-t border-slate-100"
                >
                  <textarea
                    value={newNoteInput}
                    onChange={(e) => setNewNoteInput(e.target.value)}
                    rows={2}
                    placeholder="Add private note for team..."
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none text-slate-900 placeholder:text-slate-400"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="w-full mt-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                  >
                    Save Private Note
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}

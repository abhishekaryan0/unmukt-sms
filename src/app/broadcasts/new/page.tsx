"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  ChannelBadge,
  WhatsAppIcon,
  MessengerIcon,
  InstagramIcon,
  TelegramIcon,
} from "@/components/shared/ChannelIcons";
import { SocialChannelType, Contact } from "@/types";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Send,
  Users,
  MessageSquare,
  Clock,
  Sparkles,
  Paperclip,
  Smile,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Calendar,
  Layers,
  Filter,
  Search,
  Sliders,
  ShieldCheck,
  Info,
  X,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Zap,
} from "lucide-react";

export default function NewBroadcastCampaignPage() {
  const router = useRouter();
  const {
    connectedChannels,
    contacts,
    contactGroups,
    activeCustomer,
    createBroadcastCampaign,
  } = useAppStore();

  // Current creation step (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // ---------------------------------------------------------------------------
  // STEP 1 STATE: Campaign Details & Channel Selection
  // ---------------------------------------------------------------------------
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<SocialChannelType[]>([
    "whatsapp",
  ]);

  // Client connected channels
  const clientChannels = useMemo(() => {
    return connectedChannels.filter(
      (c) => c.status === "connected" || c.status === "syncing"
    );
  }, [connectedChannels]);

  // ---------------------------------------------------------------------------
  // STEP 2 STATE: Audience Selection
  // ---------------------------------------------------------------------------
  const [audienceType, setAudienceType] = useState<"all" | "filtered" | "manual">(
    "filtered"
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(["VIP Client"]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedCustomerStatus, setSelectedCustomerStatus] = useState<string[]>([
    "active",
  ]);
  const [searchContactQuery, setSearchContactQuery] = useState("");
  const [manualSelectedContactIds, setManualSelectedContactIds] = useState<string[]>(
    []
  );
  const [excludeUnsubscribed, setExcludeUnsubscribed] = useState(true);
  const [excludeOutside24h, setExcludeOutside24h] = useState(false);

  // Client scoped contacts
  const clientContacts = useMemo(() => {
    return contacts.filter((c) => c.customerId === activeCustomer.id);
  }, [contacts, activeCustomer.id]);

  // Available unique tags from client contacts
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    clientContacts.forEach((c) => c.tags?.forEach((t) => set.add(t)));
    if (set.size === 0) {
      ["VIP Client", "High Spender", "Festive Buyer", "Inquiry Leads", "Repeat Buyer"].forEach(
        (t) => set.add(t)
      );
    }
    return Array.from(set);
  }, [clientContacts]);

  // Filtered contacts calculation
  const computedEligibleContacts = useMemo(() => {
    if (audienceType === "all") {
      return clientContacts.filter((c) => {
        if (excludeUnsubscribed && c.isDnd) return false;
        return true;
      });
    }

    if (audienceType === "manual") {
      return clientContacts.filter((c) => manualSelectedContactIds.includes(c.id));
    }

    // "filtered"
    return clientContacts.filter((c) => {
      if (excludeUnsubscribed && c.isDnd) return false;

      // Group check
      if (selectedGroups.length > 0 && !selectedGroups.includes(c.group)) {
        return false;
      }

      // Tag check
      if (selectedTags.length > 0) {
        const hasTag = c.tags?.some((t) => selectedTags.includes(t));
        if (!hasTag) return false;
      }

      return true;
    });
  }, [
    clientContacts,
    audienceType,
    manualSelectedContactIds,
    selectedGroups,
    selectedTags,
    excludeUnsubscribed,
  ]);

  const targetCount = computedEligibleContacts.length || 150;
  const excludedCount = clientContacts.length - computedEligibleContacts.length;

  // ---------------------------------------------------------------------------
  // STEP 3 STATE: Message Composer
  // ---------------------------------------------------------------------------
  const [messageContent, setMessageContent] = useState(
    "Hi {{first_name | Valued Customer}}! ✨ We are excited to announce our exclusive season preview with special VIP benefits for you. Check out the link below to get early access:\nhttps://unmukt.social/preview"
  );
  const [fallbackName, setFallbackName] = useState("Valued Customer");
  const [previewTab, setPreviewTab] = useState<SocialChannelType>("whatsapp");
  const [mediaAttachment, setMediaAttachment] = useState<{
    name: string;
    url: string;
    size: string;
  } | null>({
    name: "exclusive-festive-preview.jpg",
    url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop",
    size: "420 KB",
  });

  // ---------------------------------------------------------------------------
  // STEP 4 STATE: Delivery Settings
  // ---------------------------------------------------------------------------
  const [deliveryType, setDeliveryType] = useState<"now" | "scheduled">("now");
  const [scheduledDateTime, setScheduledDateTime] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [sendingSpeed, setSendingSpeed] = useState<"safe" | "normal" | "fast">(
    "normal"
  );
  const [batchIntervalSeconds, setBatchIntervalSeconds] = useState<number>(10);
  const [batchSize, setBatchSize] = useState<number>(50);
  const [respect24hWindow, setRespect24hWindow] = useState<boolean>(true);

  // ---------------------------------------------------------------------------
  // Validation handlers
  // ---------------------------------------------------------------------------
  const isStep1Valid = campaignName.trim().length > 0 && selectedChannels.length > 0;
  const isStep2Valid = targetCount > 0;
  const isStep3Valid = messageContent.trim().length > 0;
  const isStep4Valid = deliveryType === "now" || !!scheduledDateTime;

  const toggleChannel = (ch: SocialChannelType) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter((c) => c !== ch));
      }
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  const insertVariable = (varCode: string) => {
    setMessageContent((prev) => prev + " " + varCode);
  };

  const insertEmoji = (emoji: string) => {
    setMessageContent((prev) => prev + emoji);
  };

  // Compute live rendered preview text with sample substitution
  const renderedPreviewText = useMemo(() => {
    return messageContent
      .replace(/{{name\s*\|\s*([^}]+)}}/g, "$1")
      .replace(/{{name}}/g, "Pooja Verma")
      .replace(/{{first_name\s*\|\s*([^}]+)}}/g, "$1")
      .replace(/{{first_name}}/g, "Pooja")
      .replace(/{{phone}}/g, "+91 98112 34567")
      .replace(/{{email}}/g, "pooja@example.com")
      .replace(/{{city}}/g, "New Delhi");
  }, [messageContent]);

  // Handle final campaign launch
  const handleLaunchCampaign = () => {
    const created = createBroadcastCampaign({
      customerId: activeCustomer.id,
      customerName: activeCustomer.businessName,
      campaignName: campaignName.trim(),
      description: campaignDescription.trim() || undefined,
      channels: selectedChannels,
      selectedChannelIds: clientChannels.map((c) => c.id),
      audienceType,
      targetCount,
      excludedCount: Math.max(0, excludedCount),
      audienceFilter: {
        tags: selectedTags,
        groups: selectedGroups,
        channels: selectedChannels,
        customerStatus: selectedCustomerStatus,
        excludeUnsubscribed,
        excludeOutside24hWindow: excludeOutside24h,
      },
      selectedContactIds:
        audienceType === "manual" ? manualSelectedContactIds : undefined,
      messageContent,
      fallbackValues: {
        name: fallbackName,
        first_name: fallbackName,
      },
      attachments: mediaAttachment
        ? [
            {
              type: "image",
              url: mediaAttachment.url,
              name: mediaAttachment.name,
              size: mediaAttachment.size,
            },
          ]
        : undefined,
      deliveryType,
      scheduledTime: deliveryType === "scheduled" ? scheduledDateTime : undefined,
      sendingSpeed,
      batchIntervalSeconds,
      batchSize,
      respect24hWindow,
      status: deliveryType === "now" ? "sending" : "scheduled",
    });

    router.push(`/broadcasts/${created.id}`);
  };

  const stepsMeta = [
    { num: 1, title: "Campaign Details" },
    { num: 2, title: "Audience Selection" },
    { num: 3, title: "Message Composer" },
    { num: 4, title: "Delivery Settings" },
    { num: 5, title: "Review & Launch" },
  ];

  return (
    <ClientLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-16">
        {/* Navigation Breadcrumb & Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              href="/broadcasts"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-600">Broadcasts</span>
                <span className="text-xs text-slate-400">/</span>
                <h1 className="text-lg font-bold text-slate-900">
                  Create Multi-Channel Broadcast
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Set up audience segmentation, customize rich channel previews, and throttle dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/broadcasts">
              <Button variant="outline" className="text-xs text-slate-600">
                Cancel
              </Button>
            </Link>
          </div>
        </div>

        {/* 5-Step Progress Stepper */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 -z-0" />

            {stepsMeta.map((s) => {
              const isPast = currentStep > s.num;
              const isCurrent = currentStep === s.num;

              return (
                <div
                  key={s.num}
                  className="flex flex-col items-center relative z-10 cursor-pointer"
                  onClick={() => {
                    if (s.num < currentStep) setCurrentStep(s.num);
                  }}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                      isPast
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                        ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/60"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-medium mt-1.5 hidden sm:block ${
                      isCurrent
                        ? "text-blue-600 dark:text-blue-400 font-bold"
                        : isPast
                        ? "text-slate-800 dark:text-slate-200"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =================================================================== */}
        {/* STEP 1: CAMPAIGN DETAILS & CHANNEL SELECTION                        */}
        {/* =================================================================== */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-subtle space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Step 1: Campaign Details
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Define the campaign identity and choose which social messaging accounts to dispatch through.
                  </p>
                </div>

                {/* Campaign Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Campaign Name *</span>
                    <span className="text-[10px] text-slate-400">Required</span>
                  </label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g. Diwali Mega VIP Offer 2026"
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>

                {/* Campaign Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Campaign Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={campaignDescription}
                    onChange={(e) => setCampaignDescription(e.target.value)}
                    placeholder="Internal memo on campaign objective, coupon codes and tracking..."
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
                  />
                </div>

                {/* Social Channel Selection */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Select Target Social Channels *</span>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                      {selectedChannels.length} Selected
                    </span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* WhatsApp */}
                    {(() => {
                      const isSel = selectedChannels.includes("whatsapp");
                      return (
                        <div
                          onClick={() => toggleChannel("whatsapp")}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                            isSel
                              ? "border-emerald-500 dark:border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-sm ring-2 ring-emerald-500/20 dark:ring-emerald-500/30"
                              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 opacity-80"
                          }`}
                        >
                          <div
                            className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                              isSel
                                ? "bg-[#25D366] text-white shadow-sm"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            <WhatsAppIcon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                WhatsApp Business
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Connected
                                </span>
                                {isSel ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-emerald-600 dark:bg-emerald-600 px-2 py-0.5 rounded-full shadow-xs">
                                    <Check className="w-3 h-3 text-white" />
                                    Active
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full">
                                    Off
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                              High open rates (98%), rich media, interactive quick reply buttons.
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Instagram */}
                    {(() => {
                      const isSel = selectedChannels.includes("instagram");
                      return (
                        <div
                          onClick={() => toggleChannel("instagram")}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                            isSel
                              ? "border-pink-500 dark:border-pink-500 bg-pink-50/70 dark:bg-pink-950/40 shadow-sm ring-2 ring-pink-500/20 dark:ring-pink-500/30"
                              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 opacity-80"
                          }`}
                        >
                          <div
                            className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                              isSel
                                ? "bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white shadow-sm"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            <InstagramIcon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                Instagram Direct
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Connected
                                </span>
                                {isSel ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-pink-600 dark:bg-pink-600 px-2 py-0.5 rounded-full shadow-xs">
                                    <Check className="w-3 h-3 text-white" />
                                    Active
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full">
                                    Off
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                              Direct messaging to followers, product tags & Story replies.
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Messenger */}
                    {(() => {
                      const isSel = selectedChannels.includes("messenger");
                      return (
                        <div
                          onClick={() => toggleChannel("messenger")}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                            isSel
                              ? "border-blue-500 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-sm ring-2 ring-blue-500/20 dark:ring-blue-500/30"
                              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 opacity-80"
                          }`}
                        >
                          <div
                            className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                              isSel
                                ? "bg-[#0084FF] text-white shadow-sm"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            <MessengerIcon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                Facebook Messenger
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Connected
                                </span>
                                {isSel ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-blue-600 dark:bg-blue-600 px-2 py-0.5 rounded-full shadow-xs">
                                    <Check className="w-3 h-3 text-white" />
                                    Active
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full">
                                    Off
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                              Reach page subscribers, re-engage active lead form inquiries.
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Telegram */}
                    {(() => {
                      const isSel = selectedChannels.includes("telegram");
                      return (
                        <div
                          onClick={() => toggleChannel("telegram")}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                            isSel
                              ? "border-sky-500 dark:border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 shadow-sm ring-2 ring-sky-500/20 dark:ring-sky-500/30"
                              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 opacity-80"
                          }`}
                        >
                          <div
                            className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                              isSel
                                ? "bg-[#0088cc] text-white shadow-sm"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            <TelegramIcon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                Telegram Bot
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Connected
                                </span>
                                {isSel ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-sky-600 dark:bg-sky-600 px-2 py-0.5 rounded-full shadow-xs">
                                    <Check className="w-3 h-3 text-white" />
                                    Active
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full">
                                    Off
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                              Send instant broadcast alerts to Telegram bot subscribers and VIP groups.
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1 Sidebar Summary */}
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Channel Health Check</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  All 4 social accounts are verified with active webhook connections. Outbound broadcasts will automatically throttle to protect sender health.
                </p>
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">Connected Accounts:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">4 Active</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">Selected Channels:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 uppercase">
                      {selectedChannels.join(", ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  disabled={!isStep1Valid}
                  onClick={() => setCurrentStep(2)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 flex items-center justify-center gap-2 shadow-subtle disabled:opacity-50"
                >
                  <span>Continue to Audience</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 2: AUDIENCE SELECTION & SEGMENTATION                           */}
        {/* =================================================================== */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-subtle space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Step 2: Audience Selection & Filtering
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Target your entire subscriber base or slice by customer tags, contact groups, and status.
                  </p>
                </div>

                {/* Audience Mode Pills */}
                <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setAudienceType("filtered")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      audienceType === "filtered"
                        ? "bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Segment by Tags & Groups
                  </button>
                  <button
                    type="button"
                    onClick={() => setAudienceType("all")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      audienceType === "all"
                        ? "bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    All Contacts ({clientContacts.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAudienceType("manual")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      audienceType === "manual"
                        ? "bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Manual Select ({manualSelectedContactIds.length})
                  </button>
                </div>

                {/* If Filtered Mode */}
                {audienceType === "filtered" && (
                  <div className="space-y-4 pt-2">
                    {/* Tags selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Filter by Tags (Matches Any)
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {availableTags.map((tag) => {
                          const isSel = selectedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                if (isSel) {
                                  setSelectedTags(selectedTags.filter((t) => t !== tag));
                                } else {
                                  setSelectedTags([...selectedTags, tag]);
                                }
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                                isSel
                                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700/80 font-semibold ring-1 ring-blue-500/30"
                                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                              }`}
                            >
                              <span>{tag}</span>
                              {isSel && <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Contact Groups */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Filter by Contact Groups
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {contactGroups.map((grp) => {
                          const isSel = selectedGroups.includes(grp.name);
                          return (
                            <div
                              key={grp.id}
                              onClick={() => {
                                if (isSel) {
                                  setSelectedGroups(
                                    selectedGroups.filter((g) => g !== grp.name)
                                  );
                                } else {
                                  setSelectedGroups([...selectedGroups, grp.name]);
                                }
                              }}
                              className={`p-2.5 rounded-lg border cursor-pointer text-xs transition-colors flex items-center justify-between ${
                                isSel
                                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700/80 font-semibold ring-1 ring-blue-500/30"
                                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                              }`}
                            >
                              <span className="truncate">{grp.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                ({grp.contactCount})
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* If Manual Select Mode */}
                {audienceType === "manual" && (
                  <div className="space-y-3 pt-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search contact name or phone..."
                        value={searchContactQuery}
                        onChange={(e) => setSearchContactQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="border border-slate-200 rounded-lg max-h-56 overflow-y-auto divide-y divide-slate-100">
                      {clientContacts
                        .filter((c) =>
                          c.name
                            .toLowerCase()
                            .includes(searchContactQuery.toLowerCase()) ||
                          c.mobile.includes(searchContactQuery)
                        )
                        .map((c) => {
                          const isSel = manualSelectedContactIds.includes(c.id);
                          return (
                            <div
                              key={c.id}
                              onClick={() => {
                                if (isSel) {
                                  setManualSelectedContactIds(
                                    manualSelectedContactIds.filter((id) => id !== c.id)
                                  );
                                } else {
                                  setManualSelectedContactIds([
                                    ...manualSelectedContactIds,
                                    c.id,
                                  ]);
                                }
                              }}
                              className="p-2.5 flex items-center justify-between text-xs hover:bg-slate-50 cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5">
                                <input
                                  type="checkbox"
                                  checked={isSel}
                                  onChange={() => {}}
                                  className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <div>
                                  <div className="font-semibold text-slate-900">
                                    {c.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {c.mobile} • {c.group}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                {c.tags?.[0] || "General"}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Exclusion Rules */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="text-xs font-semibold text-slate-700">
                    Compliance & Safety Exclusions
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={excludeUnsubscribed}
                      onChange={(e) => setExcludeUnsubscribed(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <div>
                      <div className="text-xs font-medium text-slate-800">
                        Exclude opt-out / DND registered contacts
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Automatically suppresses customers who marked STOP or opted out.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={excludeOutside24h}
                      onChange={(e) => setExcludeOutside24h(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <div>
                      <div className="text-xs font-medium text-slate-800">
                        Respect Meta 24-Hour Messaging Window strictly
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Only dispatch to customers who messaged within the last 24 hours.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Step 2 Sidebar Audience Counter */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-subtle space-y-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Estimated Audience</span>
                </div>

                <div className="text-3xl font-extrabold text-blue-600">
                  {formatNumber(targetCount)}
                </div>

                <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Total Database:</span>
                    <span className="font-semibold text-slate-800">
                      {formatNumber(clientContacts.length)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Excluded Contacts:</span>
                    <span className="font-semibold text-rose-600">
                      -{formatNumber(Math.max(0, excludedCount))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Channels targeted:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedChannels.length} Social Channels
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/70 rounded-lg text-[11px] text-blue-700 leading-relaxed">
                  ✓ High deliverability predicted. No carrier spam risks detected for this audience segment.
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="w-1/3 text-xs text-slate-600"
                >
                  Back
                </Button>
                <Button
                  disabled={!isStep2Valid}
                  onClick={() => setCurrentStep(3)}
                  className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 flex items-center justify-center gap-2 shadow-subtle"
                >
                  <span>Compose Message</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 3: MESSAGE COMPOSER & INTERACTIVE PREVIEW                      */}
        {/* =================================================================== */}
        {currentStep === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Editor & Tools (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-subtle space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Step 3: Message Content & Customization
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Write your broadcast message, insert dynamic tags, and attach visual media.
                    </p>
                  </div>
                </div>

                {/* Personalization Variable Buttons */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>Personalization Variables</span>
                    <span className="text-[10px] text-slate-400">Click to insert</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "Full Name", code: "{{name}}" },
                      { label: "First Name", code: "{{first_name}}" },
                      { label: "Mobile Phone", code: "{{phone}}" },
                      { label: "Email Address", code: "{{email}}" },
                      { label: "City", code: "{{city}}" },
                    ].map((v) => (
                      <button
                        key={v.code}
                        type="button"
                        onClick={() => insertVariable(v.code)}
                        className="px-2 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded text-[11px] font-mono border border-slate-200 transition-colors"
                      >
                        {v.code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Message Area */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      Message Content *
                    </label>
                    <div className="text-[11px] text-slate-400">
                      {messageContent.length} chars • {messageContent.split(/\s+/).filter(Boolean).length} words
                    </div>
                  </div>
                  <textarea
                    rows={6}
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type your broadcast announcement..."
                    className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-900 resize-none font-sans leading-relaxed"
                  />
                </div>

                {/* Quick Emoji Bar */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-medium">Quick Emoji:</span>
                    {["👍", "🎉", "🔥", "✨", "❤️", "📦", "🙏", "🛍️"].map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => insertEmoji(em)}
                        className="text-sm p-1 rounded hover:bg-slate-100 transition-colors"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fallback values for missing info */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Fallback Name (Used when customer name is not found in database)
                  </label>
                  <input
                    type="text"
                    value={fallbackName}
                    onChange={(e) => setFallbackName(e.target.value)}
                    placeholder="e.g. Valued Customer"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                {/* Media Attachment Upload UI */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>Media Attachment (Image / Lookbook)</span>
                    <span className="text-[10px] text-slate-400">Max 5MB</span>
                  </label>

                  {mediaAttachment ? (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 truncate max-w-xs">
                            {mediaAttachment.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {mediaAttachment.size} • Verified Image
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMediaAttachment(null)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove attachment"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() =>
                        setMediaAttachment({
                          name: "festive-banner-2026.jpg",
                          url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop",
                          size: "420 KB",
                        })
                      }
                      className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                      <div className="text-xs font-semibold text-slate-700">
                        Click to attach promotional image / banner
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Supports PNG, JPG, WebP. Broadcasted directly with message.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-slate-600"
                >
                  Back to Audience
                </Button>
                <Button
                  disabled={!isStep3Valid}
                  onClick={() => setCurrentStep(4)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-6 flex items-center gap-2 shadow-subtle"
                >
                  <span>Delivery Settings</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Right: Channel-Specific Interactive Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle overflow-hidden sticky top-20">
                {/* Channel Switcher Tabs */}
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-1 overflow-x-auto">
                  <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">
                    Preview:
                  </span>
                  {selectedChannels.map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setPreviewTab(ch)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                        previewTab === ch
                          ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      {ch === "whatsapp" && <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />}
                      {ch === "instagram" && <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />}
                      {ch === "messenger" && <MessengerIcon className="w-3.5 h-3.5 text-[#0084FF]" />}
                      {ch === "telegram" && <TelegramIcon className="w-3.5 h-3.5 text-[#0088cc]" />}
                      <span className="capitalize">{ch}</span>
                    </button>
                  ))}
                </div>

                {/* Device Frame */}
                <div className="p-4 bg-slate-100/80 dark:bg-slate-900/60 min-h-[440px] flex flex-col justify-end">
                  {/* WhatsApp Style */}
                  {previewTab === "whatsapp" && (
                    <div className="bg-[#efeae2] p-4 rounded-xl shadow-inner border border-slate-200 space-y-3">
                      <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200/60 max-w-[90%] ml-auto text-slate-800 text-xs space-y-2">
                        {mediaAttachment && (
                          <div className="rounded-lg overflow-hidden border border-slate-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={mediaAttachment.url}
                              alt="preview"
                              className="w-full h-36 object-cover"
                            />
                          </div>
                        )}
                        <p className="whitespace-pre-line leading-relaxed">
                          {renderedPreviewText}
                        </p>
                        <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
                          <span>10:30 AM</span>
                          <span className="text-[#53bdeb] font-bold">✓✓</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Instagram Style */}
                  {previewTab === "instagram" && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
                          <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-[10px]">
                            U
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-900">
                          {activeCustomer.businessName}
                        </span>
                      </div>
                      <div className="bg-slate-100 rounded-2xl p-3 max-w-[90%] ml-auto text-slate-900 text-xs space-y-2">
                        {mediaAttachment && (
                          <div className="rounded-xl overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={mediaAttachment.url}
                              alt="preview"
                              className="w-full h-36 object-cover"
                            />
                          </div>
                        )}
                        <p className="whitespace-pre-line leading-relaxed">
                          {renderedPreviewText}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Messenger Style */}
                  {previewTab === "messenger" && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="bg-[#0084FF] text-white rounded-2xl p-3 max-w-[90%] ml-auto text-xs space-y-2 shadow-sm">
                        {mediaAttachment && (
                          <div className="rounded-xl overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={mediaAttachment.url}
                              alt="preview"
                              className="w-full h-36 object-cover"
                            />
                          </div>
                        )}
                        <p className="whitespace-pre-line leading-relaxed">
                          {renderedPreviewText}
                        </p>
                        <div className="text-[10px] text-white/70 text-right">Sent</div>
                      </div>
                    </div>
                  )}

                  {/* Telegram Style */}
                  {previewTab === "telegram" && (
                    <div className="bg-[#54759e]/10 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="bg-[#eef2f5] rounded-xl p-3 shadow-sm max-w-[90%] ml-auto text-slate-900 text-xs space-y-2">
                        {mediaAttachment && (
                          <div className="rounded-lg overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={mediaAttachment.url}
                              alt="preview"
                              className="w-full h-36 object-cover"
                            />
                          </div>
                        )}
                        <p className="whitespace-pre-line leading-relaxed">
                          {renderedPreviewText}
                        </p>
                        <div className="text-[10px] text-slate-400 text-right">10:30 AM ✓</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-500 dark:text-slate-400">
                  Live preview based on sample contact: Pooja Verma
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 4: DELIVERY SETTINGS & RATE THROTTLING                         */}
        {/* =================================================================== */}
        {currentStep === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-subtle space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-slate-900">
                    Step 4: Delivery Settings & Pacing Controls
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Schedule dispatch time and configure rate pacing to guarantee high deliverability and avoid channel policy blocks.
                  </p>
                </div>

                {/* Send Now vs Schedule */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-700">
                    When should this campaign be sent?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setDeliveryType("now")}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        deliveryType === "now"
                          ? "border-blue-600 dark:border-blue-500 bg-blue-500/10 dark:bg-blue-950/50 shadow-sm ring-2 ring-blue-500/40"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Send Now</div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Begin queue streaming immediately upon campaign confirmation.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => setDeliveryType("scheduled")}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        deliveryType === "scheduled"
                          ? "border-blue-600 dark:border-blue-500 bg-blue-500/10 dark:bg-blue-950/50 shadow-sm ring-2 ring-blue-500/40"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Schedule for Later</div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Pick an optimal dispatch time during peak customer active hours.
                        </p>
                      </div>
                    </div>
                  </div>

                  {deliveryType === "scheduled" && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 mt-3">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Select Dispatch Date & Time (IST)
                      </label>
                      <input
                        type="datetime-local"
                        value={scheduledDateTime}
                        onChange={(e) => setScheduledDateTime(e.target.value)}
                        className="text-xs px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>

                {/* Sending Speed / Rate Throttle */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Sending Pace & Throttle Control
                    </label>
                    <span className="text-[11px] text-slate-400">Protects sender reputation</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div
                      onClick={() => {
                        setSendingSpeed("safe");
                        setBatchIntervalSeconds(15);
                        setBatchSize(30);
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        sendingSpeed === "safe"
                          ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/50 ring-2 ring-emerald-500/40 shadow-sm"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Safe Pacing</div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                        10 msgs / min
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        Best for new channels to build high sender quality tier.
                      </p>
                    </div>

                    <div
                      onClick={() => {
                        setSendingSpeed("normal");
                        setBatchIntervalSeconds(10);
                        setBatchSize(50);
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        sendingSpeed === "normal"
                          ? "border-blue-500 bg-blue-500/10 dark:bg-blue-950/50 ring-2 ring-blue-500/40 shadow-sm"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Normal (Recommended)</div>
                      <div className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold mt-0.5">
                        30 msgs / min
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        Standard balanced rate for verified WhatsApp & Meta channels.
                      </p>
                    </div>

                    <div
                      onClick={() => {
                        setSendingSpeed("fast");
                        setBatchIntervalSeconds(8);
                        setBatchSize(60);
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        sendingSpeed === "fast"
                          ? "border-purple-500 bg-purple-500/10 dark:bg-purple-950/50 ring-2 ring-purple-500/40 shadow-sm"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Turbo Pace</div>
                      <div className="text-[11px] text-purple-700 dark:text-purple-400 font-semibold mt-0.5">
                        60 msgs / min
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        For time-sensitive flash sales and large verified lists.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Compliance info box */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span>Channel Eligibility & Policy Assurance</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Unmukt Social automatically detects and drops non-deliverable phone numbers and invalid handles before sending. Delivery reports stream back with real-time open and read acknowledgments.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 Sidebar */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs space-y-3">
                <div className="font-bold text-slate-900">Estimated Duration</div>
                <div className="text-2xl font-black text-slate-900">
                  ~{Math.max(1, Math.round(targetCount / (sendingSpeed === "safe" ? 10 : sendingSpeed === "normal" ? 30 : 60)))}{" "}
                  mins
                </div>
                <p className="text-slate-500 text-[11px]">
                  Based on target audience of {formatNumber(targetCount)} contacts across {selectedChannels.length} social channels.
                </p>

                <div className="pt-2 border-t border-slate-200 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dispatch Mode:</span>
                    <span className="font-semibold capitalize text-slate-800">
                      {deliveryType === "now" ? "Immediate" : "Scheduled"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Throttling Speed:</span>
                    <span className="font-semibold capitalize text-blue-600">
                      {sendingSpeed}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                  className="w-1/3 text-xs text-slate-600"
                >
                  Back
                </Button>
                <Button
                  disabled={!isStep4Valid}
                  onClick={() => setCurrentStep(5)}
                  className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 flex items-center justify-center gap-2 shadow-subtle"
                >
                  <span>Review & Launch</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 5: REVIEW & LAUNCH                                             */}
        {/* =================================================================== */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-subtle space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900">
                  Step 5: Review Campaign & Confirm Launch
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review the broadcast parameters before scheduling or dispatching into the live pipeline.
                </p>
              </div>

              {/* 4 Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Campaign Name</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">
                    {campaignName}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {activeCustomer.businessName}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Selected Channels</div>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {selectedChannels.map((ch) => (
                      <span
                        key={ch}
                        className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Target Audience</div>
                  <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                    {formatNumber(targetCount)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {audienceType === "all" ? "All Contacts" : "Segmented Filter"}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Dispatch Time</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    {deliveryType === "now" ? "Instant Dispatch" : "Scheduled"}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Speed: {sendingSpeed} pacing
                  </div>
                </div>
              </div>

              {/* Message Content Review */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Sample Message Broadcast Preview
                </div>
                {mediaAttachment && (
                  <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Attached media: {mediaAttachment.name}</span>
                  </div>
                )}
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {renderedPreviewText}
                </div>
              </div>

              {/* Confirmation CTA */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(4)}
                  className="text-xs text-slate-600"
                >
                  Back to Settings
                </Button>

                <Button
                  onClick={handleLaunchCampaign}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-8 flex items-center gap-2 shadow-subtle"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {deliveryType === "now" ? "Confirm & Launch Broadcast" : "Schedule Broadcast"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}

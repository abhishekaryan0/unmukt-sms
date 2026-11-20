"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Search,
  CheckCircle2,
  Lock,
  Send,
  User,
  Clock,
  Sparkles,
  ShieldCheck,
  Tag,
  Paperclip,
  CheckCheck,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  WhatsAppIcon,
  MessengerIcon,
  InstagramIcon,
  TelegramIcon,
} from "@/components/shared/ChannelIcons";

export function HeroSection() {
  const [activeChannelTab, setActiveChannelTab] = useState<"all" | "whatsapp" | "instagram" | "messenger" | "telegram">("all");

  const scrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const elem = document.getElementById("features");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white border-b border-slate-100">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Centered Hero Content */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Subtle SaaS Category Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 text-slate-800 text-xs font-medium mb-6 shadow-xs hover:bg-slate-100 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-semibold text-slate-900">Unified Social Messaging Platform</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 hidden sm:inline">WhatsApp, Instagram, Messenger & Telegram</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Every Customer Conversation. <br className="hidden sm:inline" />
            <span className="text-slate-900">One Powerful Workspace.</span>
          </h1>

          {/* Supporting Text */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Manage conversations across your connected messaging channels, engage customers,
            run campaigns, and empower your team—all from one unified platform.
          </p>

          {/* CTAs: SINGLE LOGIN CTA + EXPLORE FEATURES (NO REGISTER/SIGNUP) */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            {/* Primary CTA: Login */}
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-7 h-12 text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex items-center justify-center gap-2 rounded-xl transition-all hover:shadow-md"
              >
                <span>Login to Smsunmukt</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            {/* Secondary CTA: Explore Features (Scrolls down) */}
            <a
              href="#features"
              onClick={scrollToFeatures}
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-6 h-12 text-sm font-semibold text-slate-800 border-slate-300 hover:bg-slate-50 bg-white shadow-xs rounded-xl flex items-center justify-center gap-2"
              >
                <span>Explore Features</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </Button>
            </a>
          </div>

          {/* Micro Trust & Product Highlights */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Multi-Agent Team Routing
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Official Meta & Telegram Cloud APIs
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Real-time Sub-Second Delivery
            </span>
          </div>
        </div>

        {/* High-Fidelity Realistic SaaS Unified Inbox Mockup */}
        <div className="mt-12 sm:mt-16 max-w-6xl mx-auto">
          <div className="rounded-2xl border border-slate-200/90 bg-white shadow-elevated overflow-hidden">
            {/* Top Application Window Bar */}
            <div className="bg-slate-50/90 border-b border-slate-200/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                {/* Window Dots */}
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                </div>
                <div className="hidden sm:flex items-center gap-2 ml-2 pl-3 border-l border-slate-200 text-slate-500">
                  <span className="font-mono text-[11px] text-slate-500">app.smsunmukt.com/inbox</span>
                </div>
              </div>

              {/* Workspace Pill & Status */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-medium text-slate-800">Aura Retail Workspace</span>
                  <span className="text-[10px] text-slate-400">|</span>
                  <span className="text-[11px] text-slate-500 font-normal">4 agents active</span>
                </div>
              </div>
            </div>

            {/* Inner Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px] bg-white divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
              {/* Left Channel Filter Rail (Cols 1-3) */}
              <div className="lg:col-span-3 bg-slate-50/50 p-3 sm:p-4 flex flex-col justify-between space-y-4">
                <div>
                  {/* Search Bar */}
                  <div className="relative mb-3">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      readOnly
                      placeholder="Search conversations..."
                      value=""
                      className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  {/* Channel Switchers */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                      Channels
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveChannelTab("all")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        activeChannelTab === "all"
                          ? "bg-slate-900 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        All Channels
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        activeChannelTab === "all" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                      }`}>
                        14
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveChannelTab("whatsapp")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeChannelTab === "whatsapp"
                          ? "bg-slate-900 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                        WhatsApp
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                        6
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveChannelTab("instagram")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeChannelTab === "instagram"
                          ? "bg-slate-900 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
                        Instagram
                      </span>
                      <span className="text-[10px] bg-pink-100 text-pink-800 font-bold px-1.5 py-0.2 rounded-full">
                        4
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveChannelTab("messenger")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeChannelTab === "messenger"
                          ? "bg-slate-900 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <MessengerIcon className="w-3.5 h-3.5 text-[#0084FF]" />
                        Messenger
                      </span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded-full">
                        3
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveChannelTab("telegram")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeChannelTab === "telegram"
                          ? "bg-slate-900 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <TelegramIcon className="w-3.5 h-3.5 text-[#0088cc]" />
                        Telegram
                      </span>
                      <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.2 rounded-full">
                        1
                      </span>
                    </button>
                  </div>

                  {/* Teammate Activity Chip */}
                  <div className="mt-5 pt-4 border-t border-slate-200">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                      Assigned Agents
                    </div>
                    <div className="space-y-1.5 mt-1">
                      <div className="flex items-center justify-between px-2 py-1 text-xs text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                            NS
                          </span>
                          <span className="font-medium text-slate-800">Neha S. (You)</span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <div className="flex items-center justify-between px-2 py-1 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[10px]">
                            RK
                          </span>
                          <span>Rohan K.</span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900">
                  <div className="font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>Real-time Routing Active</span>
                  </div>
                  <div className="text-blue-700 text-[10px] mt-0.5">
                    All connected channels synced with zero webhook lag.
                  </div>
                </div>
              </div>

              {/* Middle Chat & Conversation Stream (Cols 4-8) */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                {/* Active Chat Conversation Header */}
                <div className="px-4 py-3 border-b border-slate-200/80 bg-white flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center border border-slate-200">
                        AP
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-xs">
                        <WhatsAppIcon className="w-3 h-3 text-[#25D366]" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <span>Aarav Patel</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          WhatsApp Cloud
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">+91 98201 44521</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                      Assigned: Neha S.
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Open
                    </span>
                  </div>
                </div>

                {/* Message Stream */}
                <div className="p-4 space-y-3.5 bg-slate-50/30 overflow-y-auto max-h-[340px]">
                  {/* Timestamp */}
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100">
                      Today • 10:24 AM
                    </span>
                  </div>

                  {/* Customer Message (Incoming) */}
                  <div className="flex items-start gap-2.5 max-w-[85%]">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                      AP
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-slate-200/90 shadow-xs space-y-1 text-xs">
                      <p className="text-slate-800 leading-relaxed">
                        Hi team! I placed order <strong>#8492</strong> yesterday for the festive jacket.
                        Can you confirm if it has been dispatched from Mumbai warehouse?
                      </p>
                      <div className="text-[10px] text-slate-400 text-right">10:24 AM</div>
                    </div>
                  </div>

                  {/* Internal Team Note (Collaboration Demonstration) */}
                  <div className="mx-6 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1 shadow-2xs">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-amber-800">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-700" />
                        Internal Note (Visible to team only)
                      </span>
                      <span>Neha S. • 10:26 AM</span>
                    </div>
                    <p className="text-[11px] text-amber-950">
                      Dispatched this morning via BlueDart (Tracking: BD4892110). Delivery scheduled for tomorrow before 4 PM.
                    </p>
                  </div>

                  {/* Agent Response (Outgoing) */}
                  <div className="flex items-start gap-2.5 max-w-[85%] ml-auto justify-end">
                    <div className="bg-slate-900 text-white p-3 rounded-2xl rounded-tr-sm shadow-xs space-y-2 text-xs">
                      <p className="text-slate-100 leading-relaxed">
                        Hello Aarav! Yes, your order was dispatched this morning via BlueDart Express.
                        Your tracking number is <strong>BD4892110</strong>.
                      </p>
                      <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-[11px] flex items-center justify-between gap-3">
                        <span className="text-slate-300 font-mono">AWB: BD4892110</span>
                        <span className="text-blue-400 font-semibold cursor-pointer">Track &rarr;</span>
                      </div>
                      <div className="text-[10px] text-slate-400 text-right flex items-center justify-end gap-1">
                        <span>10:27 AM</span>
                        <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reply Composer Bar */}
                <div className="p-3 border-t border-slate-200/80 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-slate-500 font-medium">Quick Replies:</span>
                    <span className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded cursor-pointer font-mono">
                      /track-order
                    </span>
                    <span className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded cursor-pointer font-mono">
                      /festive-offer
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-200 p-1.5 focus-within:border-slate-400 transition-colors">
                    <input
                      type="text"
                      readOnly
                      placeholder="Type a reply or press '/' for saved replies..."
                      className="flex-1 bg-transparent px-2.5 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                    <div className="flex items-center gap-1.5 pr-1">
                      <span className="p-1.5 text-slate-400 hover:text-slate-600 rounded">
                        <Paperclip className="w-3.5 h-3.5" />
                      </span>
                      <button
                        type="button"
                        className="h-7 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
                      >
                        <span>Send</span>
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Customer Details Panel (Cols 9-12) */}
              <div className="lg:col-span-3 bg-slate-50/50 p-4 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-900">Customer Profile</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="font-bold text-sm text-slate-900">Aarav Patel</div>
                    <div className="text-[11px] text-slate-500">Retail VIP Customer</div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="text-slate-600">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Phone</span>
                      <span className="font-medium text-slate-900">+91 98201 44521</span>
                    </div>

                    <div className="text-slate-600">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Email</span>
                      <span className="font-medium text-slate-900">aarav.patel@gmail.com</span>
                    </div>

                    <div className="text-slate-600">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">City / Region</span>
                      <span className="font-medium text-slate-900">Mumbai, Maharashtra</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1.5">
                      Customer Tags
                    </span>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md font-medium">
                        VIP Tier-1
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                        Repeat Buyer
                      </span>
                      <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md font-medium">
                        Diwali Campaign
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">
                      Customer Value
                    </span>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex justify-between items-center">
                      <div>
                        <div className="text-[10px] text-slate-400">Total Orders</div>
                        <div className="font-bold text-slate-900">12 Orders</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">Lifetime Spend</div>
                        <div className="font-bold text-slate-900">₹48,500</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

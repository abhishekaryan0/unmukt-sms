"use client";

import React, { useState } from "react";
import {
  Inbox,
  Send,
  BarChart2,
  Users,
  CheckCircle2,
  Lock,
  Search,
  CheckCheck,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  ShieldCheck,
  ChevronRight,
  Calendar,
} from "lucide-react";
import {
  WhatsAppIcon,
  MessengerIcon,
  InstagramIcon,
  TelegramIcon,
} from "@/components/shared/ChannelIcons";

export function ProductPreview() {
  const [activeTab, setActiveTab] = useState<"inbox" | "campaigns" | "analytics">("inbox");

  return (
    <section className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-3 border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Application Preview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Designed for Real-World Customer Operations
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Inspect the interface that powers high-volume support, team collaboration, broadcast marketing, and performance telemetry.
          </p>
        </div>

        {/* Tab Buttons Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-xl bg-slate-200/70 border border-slate-200 gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("inbox")}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "inbox"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Inbox className="w-4 h-4 text-blue-600" />
              <span>Unified Inbox & Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("campaigns")}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "campaigns"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Send className="w-4 h-4 text-emerald-600" />
              <span>Campaign Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "analytics"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChart2 className="w-4 h-4 text-purple-600" />
              <span>Analytics & SLA Telemetry</span>
            </button>
          </div>
        </div>

        {/* Main Preview Container Frame */}
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-elevated overflow-hidden max-w-6xl mx-auto">
          {/* Header Bar */}
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="font-mono text-[11px] text-slate-500 ml-2 hidden sm:inline">
                {activeTab === "inbox" && "app.smsunmukt.com / workspace / inbox"}
                {activeTab === "campaigns" && "app.smsunmukt.com / workspace / broadcasts"}
                {activeTab === "analytics" && "app.smsunmukt.com / workspace / reports"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <span className="text-[11px]">Active Workspace:</span>
              <span className="font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                Aura Enterprise Group
              </span>
            </div>
          </div>

          {/* TAB 1: UNIFIED INBOX & CUSTOMER PANEL */}
          {activeTab === "inbox" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px] divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
              {/* Left Conversation List (Cols 1-4) */}
              <div className="lg:col-span-4 bg-slate-50/40 p-3 sm:p-4 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                  <span className="font-bold text-slate-800">Inbox Conversations</span>
                  <span className="text-[10px] text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full font-bold">
                    3 unread
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Item 1 - Active */}
                  <div className="bg-white p-3 rounded-xl border-2 border-blue-500 shadow-2xs space-y-1 cursor-pointer">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>Aarav Patel</span>
                      </div>
                      <span className="text-[10px] text-slate-400">2m ago</span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">
                      Can I track delivery for order #8492?
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-semibold">
                        VIP Tier-1
                      </span>
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold border border-emerald-200">
                        Assigned: Neha
                      </span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors space-y-1 cursor-pointer">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
                        <span>Priya Sharma</span>
                      </div>
                      <span className="text-[10px] text-slate-400">8m ago</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      Do you have the linen dress in olive green size M?
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                        Product Inquiry
                      </span>
                      <span className="text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-medium">
                        Unassigned
                      </span>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors space-y-1 cursor-pointer">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <MessengerIcon className="w-3.5 h-3.5 text-[#0084FF]" />
                        <span>Vikram Malhotra</span>
                      </div>
                      <span className="text-[10px] text-slate-400">22m ago</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      Thanks for updating the company billing GSTIN!
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-bold">
                        Resolved
                      </span>
                      <span className="text-slate-500">Agent: Rohan</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Active Chat (Cols 5-8) */}
              <div className="lg:col-span-5 p-4 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Aarav Patel</span>
                      <span className="text-[10px] font-mono text-slate-500">+91 98201 44521</span>
                    </div>
                    <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>WhatsApp Cloud API Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Status: Open
                    </span>
                  </div>
                </div>

                {/* Conversation bubbles */}
                <div className="space-y-3 text-xs flex-1">
                  <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-sm text-slate-800 max-w-[85%] space-y-1">
                    <p>Can I track delivery for order #8492?</p>
                    <div className="text-[9px] text-slate-400 text-right">10:24 AM</div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200/90 p-2.5 rounded-xl text-amber-950 text-[11px] space-y-1">
                    <div className="font-bold text-amber-800 flex items-center gap-1 text-[10px]">
                      <Lock className="w-3 h-3 text-amber-700" />
                      <span>Internal Team Note (Private)</span>
                    </div>
                    <p>Warehouse verified dispatch. BlueDart AWB BD4892110.</p>
                  </div>

                  <div className="bg-slate-900 text-white p-3 rounded-2xl rounded-tr-sm max-w-[85%] ml-auto space-y-1">
                    <p>Hello Aarav! Your order was dispatched via BlueDart. Tracking: BD4892110.</p>
                    <div className="text-[9px] text-slate-400 text-right flex items-center justify-end gap-1">
                      <span>10:27 AM</span>
                      <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                  </div>
                </div>

                {/* Simulated Input */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-400">
                    <span>Press '/' to select saved template...</span>
                    <span className="text-[10px] font-semibold text-white bg-blue-600 px-2 py-1 rounded-md">
                      Send
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Customer Details Panel (Cols 9-12) */}
              <div className="lg:col-span-3 bg-slate-50/40 p-4 space-y-4 text-xs">
                <div className="pb-2 border-b border-slate-200 font-bold text-slate-900">
                  Customer Profile
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                      Name & Tier
                    </span>
                    <div className="font-bold text-slate-900">Aarav Patel</div>
                    <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded font-semibold inline-block mt-0.5">
                      Diamond VIP Member
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                      Team Assignment
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-4 h-4 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[9px]">
                        N
                      </span>
                      <span className="font-medium text-slate-800">Neha Sharma</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                      Conversation Status
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded inline-block mt-0.5">
                      In Progress
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
                      Tags & Attributes
                    </span>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[10px] bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                        VIP Tier-1
                      </span>
                      <span className="text-[10px] bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                        Repeat Buyer
                      </span>
                      <span className="text-[10px] bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                        Festive Order
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CAMPAIGN OVERVIEW */}
          {activeTab === "campaigns" && (
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Broadcast Campaign Telemetry</h4>
                  <p className="text-xs text-slate-500">Multi-channel targeted outreach executed across opted-in contacts.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                    Live Status: 98.4% Delivered
                  </span>
                </div>
              </div>

              {/* Campaign Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">Festive VIP Collection Launch</span>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      Completed
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                      WhatsApp Cloud
                    </span>
                    <span>•</span>
                    <span>3,420 Targeted</span>
                    <span>•</span>
                    <span>3,365 Delivered</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "98.4%" }} />
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-200/80">
                    <span className="text-slate-500">Read Receipts</span>
                    <span className="font-bold text-slate-900">2,880 read (85.6%)</span>
                  </div>
                </div>

                <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">Weekend Flash Sale Alert</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Active Dispatch
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <TelegramIcon className="w-3.5 h-3.5 text-[#0088cc]" />
                      Telegram Bot
                    </span>
                    <span>•</span>
                    <span>1,850 Targeted</span>
                    <span>•</span>
                    <span>1,822 Delivered</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: "98.5%" }} />
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-200/80">
                    <span className="text-slate-500">CTA Button Clicks</span>
                    <span className="font-bold text-slate-900">642 clicked (35.2%)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ANALYTICS & SLA */}
          {activeTab === "analytics" && (
            <div className="p-6 space-y-6">
              {/* Top Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500">Avg First Response</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">1m 38s</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">↓ 42% vs last month</div>
                </div>

                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500">SLA Resolution Rate</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">98.2%</div>
                  <div className="text-[10px] text-blue-600 font-semibold mt-0.5">Under 15min target</div>
                </div>

                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500">Total Inbound Messages</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">24,190</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Across 4 channels</div>
                </div>

                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500">Customer CSAT Rating</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">4.9 / 5.0</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Based on 1,420 ratings</div>
                </div>
              </div>

              {/* Team Performance Table */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 text-xs">
                <div className="font-bold text-slate-900">Teammate Performance & Workload</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                        <th className="pb-2">Agent</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2">Chats Handled</th>
                        <th className="pb-2">Avg Response</th>
                        <th className="pb-2">SLA Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="py-2.5 font-semibold text-slate-900">Neha Sharma</td>
                        <td className="py-2.5 text-emerald-600 font-medium">● Online</td>
                        <td className="py-2.5">142 conversations</td>
                        <td className="py-2.5 font-mono">1m 18s</td>
                        <td className="py-2.5 font-bold text-slate-900">99.2%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold text-slate-900">Rohan Kulkarni</td>
                        <td className="py-2.5 text-emerald-600 font-medium">● Online</td>
                        <td className="py-2.5">118 conversations</td>
                        <td className="py-2.5 font-mono">1m 45s</td>
                        <td className="py-2.5 font-bold text-slate-900">97.8%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold text-slate-900">Priya Mehra</td>
                        <td className="py-2.5 text-slate-400 font-medium">○ Away</td>
                        <td className="py-2.5">95 conversations</td>
                        <td className="py-2.5 font-mono">1m 52s</td>
                        <td className="py-2.5 font-bold text-slate-900">98.1%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

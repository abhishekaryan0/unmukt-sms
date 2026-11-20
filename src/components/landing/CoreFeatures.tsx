"use client";

import React from "react";
import {
  Inbox,
  Users,
  Contact2,
  Send,
  Zap,
  BarChart3,
  CheckCircle2,
  Lock,
  Tag,
  Clock,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCheck,
} from "lucide-react";
import {
  WhatsAppIcon,
  MessengerIcon,
  InstagramIcon,
  TelegramIcon,
} from "@/components/shared/ChannelIcons";

export function CoreFeatures() {
  const features = [
    {
      id: "unified-inbox",
      title: "Unified Inbox",
      subtitle: "Manage customer conversations from multiple channels in one workspace.",
      icon: Inbox,
      badge: "Core Platform",
      demo: (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-[11px]">Aarav Patel</div>
                <div className="text-[10px] text-slate-500 truncate max-w-[140px]">Can I track delivery for order #8492?</div>
              </div>
            </div>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Open
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-pink-50 text-pink-700 flex items-center justify-center">
                <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-[11px]">Priya Sharma</div>
                <div className="text-[10px] text-slate-500 truncate max-w-[140px]">Loved the silk kurta! Is XL in stock?</div>
              </div>
            </div>
            <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center">
                <TelegramIcon className="w-3.5 h-3.5 text-[#0088cc]" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-[11px]">Vikram Malhotra</div>
                <div className="text-[10px] text-slate-500 truncate max-w-[140px]">Sharing company GSTIN details</div>
              </div>
            </div>
            <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
              Resolved
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "team-collaboration",
      title: "Team Collaboration",
      subtitle: "Assign conversations, collaborate with teammates, and manage support workflows.",
      icon: Users,
      badge: "Workflow",
      demo: (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2.5 text-xs">
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Assigned Agent</span>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[9px]">
                N
              </span>
              <span className="font-semibold text-slate-800 text-[11px]">Neha Sharma</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>

          <div className="bg-amber-50/90 border border-amber-200/90 p-2.5 rounded-lg text-amber-950 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-amber-800">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-700" /> Private Team Note
              </span>
              <span>10:26 AM</span>
            </div>
            <p className="text-[10px] leading-relaxed">
              Warehouse verified item dispatch. Tracking link shared with customer.
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
            <span>Collision Warning:</span>
            <span className="text-emerald-600 font-medium">No overlaps detected</span>
          </div>
        </div>
      ),
    },
    {
      id: "customer-management",
      title: "Customer Management",
      subtitle: "Organize contacts, customer profiles, tags, notes, and conversation history.",
      icon: Contact2,
      badge: "CRM & Profiles",
      demo: (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2 text-xs">
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900 text-xs">Rohan Verma</div>
              <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.2 rounded border border-blue-200">
                VIP Tier-1
              </span>
            </div>
            <div className="text-[10px] text-slate-500 space-y-0.5">
              <div>Phone: +91 98112 34567</div>
              <div>City: New Delhi, India</div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
              <span className="text-[9px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                Repeat Buyer
              </span>
              <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                LTV: ₹64,200
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500 px-1">
            <span>Unified History:</span>
            <span className="font-medium text-slate-700">14 interactions across 2 channels</span>
          </div>
        </div>
      ),
    },
    {
      id: "broadcast-campaigns",
      title: "Broadcast Campaigns",
      subtitle: "Create and manage campaigns for targeted audiences.",
      icon: Send,
      badge: "Targeted Outreach",
      demo: (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2.5 text-xs">
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-900">Festive VIP Announcement</span>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                Delivered
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span>Channels:</span>
              <div className="flex items-center gap-1">
                <WhatsAppIcon className="w-3 h-3 text-[#25D366]" />
                <TelegramIcon className="w-3 h-3 text-[#0088cc]" />
              </div>
              <span className="text-slate-400">•</span>
              <span>3,420 Target Contacts</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: "98.4%" }} />
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-500">Delivery Rate</span>
              <span className="font-bold text-slate-900">98.4% (3,365 read)</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "smart-automation",
      title: "Smart Automation",
      subtitle: "Simplify repetitive customer communication workflows.",
      icon: Zap,
      badge: "Productivity",
      demo: (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2 text-xs">
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Saved Reply Shortcuts</span>
              <span className="text-blue-600 font-mono">Press /</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between p-1.5 rounded bg-blue-50/60 border border-blue-100 text-[11px]">
                <span className="font-mono font-bold text-blue-700">/track</span>
                <span className="text-slate-500 text-[10px] truncate max-w-[130px]">Here is your live shipment tracking...</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-50 border border-slate-100 text-[11px]">
                <span className="font-mono font-bold text-slate-700">/hours</span>
                <span className="text-slate-500 text-[10px] truncate max-w-[130px]">Our support hours are 9 AM - 8 PM...</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 text-center">
            Auto-responder triggers & keyword routing
          </div>
        </div>
      ),
    },
    {
      id: "analytics-insights",
      title: "Analytics & Insights",
      subtitle: "Monitor engagement, campaign performance, and team productivity.",
      icon: BarChart3,
      badge: "Real-time Telemetry",
      demo: (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
              <div className="text-[10px] text-slate-400">First Response</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">1m 42s</div>
              <div className="text-[9px] text-emerald-600 font-semibold">↓ 34% faster</div>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
              <div className="text-[10px] text-slate-400">Resolution Rate</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">97.2%</div>
              <div className="text-[9px] text-blue-600 font-semibold">↑ 12% vs last wk</div>
            </div>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between text-[11px]">
            <span className="text-slate-600">Total Conversations</span>
            <span className="font-bold text-slate-900">18,420 msgs</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-3 border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Engineered for Modern Messaging Operations
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Everything your team needs to centralize communication, resolve queries faster, and deliver personalized customer journeys.
          </p>
        </div>

        {/* 6 Core Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-card hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header & Icon */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                    {feature.subtitle}
                  </p>
                </div>

                {/* Subtle Visual Demonstration Micro-UI */}
                <div className="mt-auto pt-2">
                  {feature.demo}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

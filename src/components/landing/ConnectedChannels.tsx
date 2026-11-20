"use client";

import React from "react";
import {
  WhatsAppIcon,
  MessengerIcon,
  InstagramIcon,
  TelegramIcon,
} from "@/components/shared/ChannelIcons";
import { Check, ArrowRight, ShieldCheck, Zap, Radio, Globe } from "lucide-react";

export function ConnectedChannels() {
  const channels = [
    {
      id: "whatsapp",
      name: "WhatsApp Business API",
      subtitle: "Meta Cloud API Cloud WABA",
      icon: WhatsAppIcon,
      accentColor: "#25D366",
      badgeClass: "bg-[#E8F8EE] text-[#075E54] border-[#b5e7c8]",
      iconBg: "bg-[#E8F8EE] text-[#25D366]",
      description:
        "Official Meta Cloud API integration. Send broadcasts, manage 2-way chats, display verified Green Tick badge, and dispatch rich catalogs and quick CTA buttons.",
      features: [
        "Verified Green Tick business identity",
        "Interactive buttons & catalog messages",
        "High-throughput delivery with zero SIM ban risks",
        "Real-time blue read-receipts & click tracking",
      ],
      speed: "< 350ms latency",
      status: "Official Partner Ready",
    },
    {
      id: "instagram",
      name: "Instagram Direct",
      subtitle: "Instagram Messaging API for Business",
      icon: InstagramIcon,
      accentColor: "#E1306C",
      badgeClass: "bg-pink-50 text-pink-700 border-pink-200",
      iconBg: "bg-pink-50 text-pink-600",
      description:
        "Turn Instagram direct messages, story mentions, and post interactions into organized team conversations with full customer history.",
      features: [
        "Consolidated direct message & story replies",
        "Customer handle & follower context",
        "Automated icebreakers & quick questions",
        "Media-rich product images & carousel shares",
      ],
      speed: "Real-time sync",
      status: "Meta Graph v19.0",
    },
    {
      id: "messenger",
      name: "Facebook Messenger",
      subtitle: "Meta Graph Messaging Platform",
      icon: MessengerIcon,
      accentColor: "#0084FF",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
      iconBg: "bg-blue-50 text-[#0084FF]",
      description:
        "Connect multiple Facebook business pages to route high-intent customer leads and support inquiries directly to your team queue.",
      features: [
        "Seamless Facebook business page routing",
        "Automated greeting & qualification flows",
        "Persistent customer thread history",
        "Shared multi-agent team assignment",
      ],
      speed: "< 500ms webhook",
      status: "Official API",
    },
    {
      id: "telegram",
      name: "Telegram Bot",
      subtitle: "Telegram Bot API Gateway",
      icon: TelegramIcon,
      accentColor: "#0088cc",
      badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
      iconBg: "bg-sky-50 text-[#0088cc]",
      description:
        "High-velocity messaging bot for VIP customer groups, enterprise announcements, and real-time community customer care.",
      features: [
        "Instant webhook dispatch for VIP clients",
        "Zero-compression file & document sharing",
        "Custom slash commands & inline menus",
        "Unrestricted team scalability",
      ],
      speed: "Instant push",
      status: "Enterprise Gateway",
    },
  ];

  return (
    <section id="channels" className="py-16 sm:py-24 bg-white border-b border-slate-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-3 border border-slate-200">
            <Radio className="w-3.5 h-3.5 text-blue-600" />
            <span>Supported Channels</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Connect Where Your Customers Already Are
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Eliminate scattered devices and browser windows. Smsunmukt synchronizes your primary business channels into a single, cohesive communications hub.
          </p>
        </div>

        {/* 4 Clean Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {channels.map((channel) => {
            const IconComponent = channel.icon;
            return (
              <div
                key={channel.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-card hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Channel Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-xl ${channel.iconBg} flex items-center justify-center p-2.5 transition-transform duration-200 group-hover:scale-105`}
                      >
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {channel.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {channel.subtitle}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${channel.badgeClass} shrink-0`}
                    >
                      {channel.status}
                    </span>
                  </div>

                  {/* Channel Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                    {channel.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    {channel.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 text-slate-900">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom Meta Bar */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-blue-600" />
                    <span>{channel.speed}</span>
                  </span>
                  <span className="text-slate-400">Standardized API Schemas</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

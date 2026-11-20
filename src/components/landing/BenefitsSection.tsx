"use client";

import React from "react";
import {
  Layers,
  Zap,
  HeartHandshake,
  FolderTree,
  Send,
  LineChart,
  Check,
  TrendingUp,
} from "lucide-react";

export function BenefitsSection() {
  const benefits = [
    {
      title: "Centralized Customer Communication",
      description:
        "Consolidate conversations from WhatsApp, Instagram, Messenger, and Telegram into one shared interface. Say goodbye to fragmented mobile devices, missed notifications, and siloed chat apps.",
      metric: "100%",
      metricLabel: "Unified visibility across all channels",
      icon: Layers,
    },
    {
      title: "Faster Team Response",
      description:
        "Empower agents with automated routing, collaborative triage, and instant saved replies. Reduce customer wait times and resolve urgent inquiries before they escalate.",
      metric: "65%",
      metricLabel: "Average decrease in initial response time",
      icon: Zap,
    },
    {
      title: "Better Customer Engagement",
      description:
        "Deliver rich, interactive conversational experiences with media catalogs, personalized variables, and verified business identities that build brand trust and loyalty.",
      metric: "4.8x",
      metricLabel: "Higher conversion rate vs generic text",
      icon: HeartHandshake,
    },
    {
      title: "Organized Conversations",
      description:
        "Categorize chats effortlessly with custom tags, customer lifecycle stages, priority badges, and searchable history. Never lose context on what a customer previously discussed.",
      metric: "Zero",
      metricLabel: "Lost customer inquiries or duplicate replies",
      icon: FolderTree,
    },
    {
      title: "Simplified Campaign Management",
      description:
        "Draft, segment, schedule, and dispatch targeted broadcast campaigns to opted-in audiences across multiple messaging networks without switching platforms.",
      metric: "98%+",
      metricLabel: "Target delivery rate with verified APIs",
      icon: Send,
    },
    {
      title: "Improved Visibility into Performance",
      description:
        "Gain real-time insights into team productivity, peak incoming message hours, channel breakdown, and resolution SLAs to continually optimize your operations.",
      metric: "Real-time",
      metricLabel: "Executive analytics & agent SLA reports",
      icon: LineChart,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-3 border border-slate-200">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>Business Value</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Why High-Growth Businesses Choose Smsunmukt
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Eliminate operational bottlenecks and turn everyday messaging into your most effective revenue and support channel.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-card hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-slate-900 font-mono tracking-tight group-hover:text-blue-600 transition-colors">
                        {benefit.metric}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {benefit.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                  <span>{benefit.metricLabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

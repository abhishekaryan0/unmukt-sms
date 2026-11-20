"use client";

import React from "react";
import { Link2, Layers, LineChart, ArrowRight, CheckCircle2 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Connect your messaging channels",
      description:
        "Link your WhatsApp Business API, Instagram Direct, Facebook Messenger, and Telegram Bot in a few straightforward clicks. Official Meta Cloud and Telegram APIs ensure reliable connectivity.",
      badge: "Quick Integration",
      icon: Link2,
      highlights: ["Official API Connectors", "Zero Server Setup", "Instant Verification"],
    },
    {
      number: "02",
      title: "Manage customers and conversations from one workspace",
      description:
        "Every inbound conversation streams into a shared team inbox. Automatically route chats to the right team members, apply customer tags, view order context, and write private internal notes.",
      badge: "Centralized Ops",
      icon: Layers,
      highlights: ["Unified Inbox Queue", "Agent Assignment", "Private Team Notes"],
    },
    {
      number: "03",
      title: "Engage, automate, and analyze your communication",
      description:
        "Accelerate your workflow with slash-command saved replies, launch targeted broadcast campaigns to segmented audiences, and measure response SLAs with executive dashboards.",
      badge: "Scale & Insight",
      icon: LineChart,
      highlights: ["Saved Reply Shortcuts", "Targeted Broadcasts", "SLA Performance Tracking"],
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-slate-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-3 border border-slate-200">
            <span>Simple Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            How Smsunmukt Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Get your entire team onboarded and handling multi-channel customer communications in three seamless steps.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-slate-50/50 rounded-2xl border border-slate-200/90 p-7 relative flex flex-col justify-between hover:bg-white hover:shadow-card hover:border-slate-300 transition-all duration-200 group"
              >
                <div>
                  {/* Step Header with Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-3xl font-black text-slate-300 group-hover:text-blue-600 transition-colors">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Highlights list */}
                <div className="pt-4 border-t border-slate-200/80 space-y-2">
                  {step.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

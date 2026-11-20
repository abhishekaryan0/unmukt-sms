"use client";

import React from "react";
import { Headphones, Target, ShoppingBag, Sparkles, Check, ArrowRight } from "lucide-react";

export function SolutionsSection() {
  const solutions = [
    {
      title: "Customer Support Teams",
      subtitle: "Resolve high inquiry volumes without dropping threads.",
      icon: Headphones,
      badge: "Support Ops",
      points: [
        "Consolidated multi-channel queue with zero missed messages",
        "Team collision alerts to avoid duplicate agent replies",
        "Private internal notes for back-office and warehouse collaboration",
        "Real-time first response time and resolution SLA monitoring",
      ],
    },
    {
      title: "Sales & Lead Conversion",
      subtitle: "Turn social inquiries into confirmed orders in minutes.",
      icon: Target,
      badge: "Revenue Growth",
      points: [
        "Instant routing of hot Instagram and WhatsApp inquiries to sales reps",
        "Saved reply macros for product specs, pricing, and payment links",
        "Customer profile attributes tracking past purchase history & LTV",
        "Follow-up scheduling and reminders across any connected channel",
      ],
    },
    {
      title: "Marketing & Growth",
      subtitle: "Deliver high-engagement broadcast campaigns with 98%+ delivery.",
      icon: Sparkles,
      badge: "Targeted Marketing",
      points: [
        "Segment contacts by tags, location, or past purchase behavior",
        "Rich WhatsApp templates with verified Green Tick and CTA buttons",
        "Automated opt-out management and compliance safeguards",
        "Live read-rate, delivery, and click-through analytics",
      ],
    },
    {
      title: "Retail & E-Commerce",
      subtitle: "Deliver post-purchase care and drive repeat orders.",
      icon: ShoppingBag,
      badge: "Commerce",
      points: [
        "Automated order confirmation and tracking status updates",
        "Fast resolution for sizing, exchange, and return inquiries",
        "VIP customer tagging for personalized priority service",
        "Direct catalog sharing and payment receipt verification",
      ],
    },
  ];

  return (
    <section id="solutions" className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-3 border border-slate-200">
            <span>Tailored Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Built for Every Customer-Facing Team
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Whether your priority is resolving customer tickets, qualifying inbound leads, or running targeted marketing broadcasts, Smsunmukt adapts to your workflow.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {solutions.map((sol, idx) => {
            const Icon = sol.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-card hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {sol.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">{sol.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                    {sol.subtitle}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    {sol.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

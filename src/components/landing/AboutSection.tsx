"use client";

import React from "react";
import { ShieldCheck, Server, Lock, Cpu, Globe2, Users } from "lucide-react";

export function AboutSection() {
  const pillars = [
    {
      title: "100% Official Cloud Integrations",
      desc: "Direct integration with official Meta Cloud APIs and Telegram Bot infrastructure. Zero unofficial scrapers or reverse-engineered tools that risk number suspensions.",
      icon: Globe2,
    },
    {
      title: "Enterprise Security & Privacy",
      desc: "All conversation telemetry and customer contact metadata is encrypted in transit and at rest with strict role-based access control across team members.",
      icon: ShieldCheck,
    },
    {
      title: "Sub-Second Message Routing",
      desc: "Built on a modern microservices architecture with real-time webhooks delivering incoming messages to agent workspaces in under 400 milliseconds.",
      icon: Cpu,
    },
    {
      title: "Collaborative Multi-Agent Operations",
      desc: "Designed from the ground up for modern distributed teams with collision detection, private internal notes, and transparent ticket assignment.",
      icon: Users,
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 bg-white border-b border-slate-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-3 border border-slate-200">
            <span>About Smsunmukt</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            The Social Messaging Operating System for Growing Businesses
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Smsunmukt was built with a singular focus: to help customer-centric teams eliminate messy, disconnected messaging workflows and engage their customers with speed and clarity.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/50 rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between hover:bg-white hover:shadow-card hover:border-slate-300 transition-all duration-200"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-2xs mb-4">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FinalCta() {
  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden border-b border-slate-100">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-6 border border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Unified Social Messaging Workspace</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Bring Every Conversation Together.
        </h2>

        {/* Supporting Text */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Make customer communication simpler, smarter, and more organized with Smsunmukt.
        </p>

        {/* ONLY Prominent Login CTA Button (Strictly No Register/Signup) */}
        <div className="mt-8 flex justify-center">
          <Link href="/login" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 h-12 text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex items-center justify-center gap-2 rounded-xl transition-all hover:shadow-md"
            >
              <span>Login to Smsunmukt</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Reassurance text */}
        <p className="mt-4 text-xs text-slate-500">
          Authorized team members can log in directly to access inboxes, channels, and campaigns.
        </p>
      </div>
    </section>
  );
}

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClientLayout } from "@/components/client/ClientLayout";
import { Button } from "@/components/ui/Button";
import { Inbox, Radio, ArrowRight, Sparkles } from "lucide-react";

export default function SendSMSPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/inbox");
    }, 1200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Inbox className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Upgraded to Social Messaging Platform</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
          Direct SMS sending has transitioned to Unified Inbox
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
          Manage your customer conversations across WhatsApp, Facebook Messenger, Instagram Direct, and Telegram in real time from our unified messaging desk. Redirecting you to the Inbox...
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/inbox">
            <Button className="flex items-center gap-2">
              <span>Open Unified Inbox</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/channels">
            <Button variant="outline" className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-600" />
              <span>Manage Channels</span>
            </Button>
          </Link>
        </div>
      </div>
    </ClientLayout>
  );
}

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClientLayout } from "@/components/client/ClientLayout";
import { Button } from "@/components/ui/Button";
import { CreditCard, Sparkles, ArrowRight } from "lucide-react";

export default function WalletPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/subscription");
    }, 1200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ClientLayout>
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CreditCard className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SaaS Subscription Platform</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
          Prepaid Wallet has transitioned to Subscriptions
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-md mx-auto">
          We have transitioned to transparent monthly and annual subscription plans with unlimited conversations and team seats. Redirecting you to Subscription & Plans...
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/subscription">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <span>View Subscription Plans</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </ClientLayout>
  );
}

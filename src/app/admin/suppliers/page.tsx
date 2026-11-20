"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Radio, ArrowRight, Sparkles } from "lucide-react";

export default function AdminSuppliersPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/admin/channels");
    }, 1200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Radio className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-3 border border-blue-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Social Cloud Architecture</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
          Telecom Carrier Suppliers No Longer Required
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 max-w-md mx-auto">
          The platform operates directly via official Meta Cloud APIs and social messaging webhooks. Carrier SMPP gateways have been decommissioned. Redirecting to Connected Channels...
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/admin/channels">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              <span>Go to Connected Channels</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}

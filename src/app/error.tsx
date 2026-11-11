"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error captured by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 p-6 shadow-card text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Something went wrong</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {error?.message || "An unexpected error occurred while loading this page."}
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => reset()} className="gap-1.5 text-xs">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </Button>
          <Link href="/admin/login">
            <Button size="sm" className="bg-slate-900 text-white gap-1.5 text-xs">
              <Home className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

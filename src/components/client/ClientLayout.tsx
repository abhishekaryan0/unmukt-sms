"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getClientSession, getImpersonationState } from "@/lib/auth";
import { useAppStore } from "@/lib/store";
import { ClientSidebar } from "./ClientSidebar";
import { ClientHeader } from "./ClientHeader";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { customers, activeCustomerId, switchActiveCustomer, exitImpersonation } = useAppStore();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);

  useEffect(() => {
    const session = getClientSession();
    if (!session || session.role !== "client") {
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
      const imp = getImpersonationState();
      setIsImpersonating(imp.active);
    }
  }, [router, activeCustomerId]);

  const handleExitImpersonation = () => {
    exitImpersonation();
    router.push("/admin/customers");
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600 text-xs">
        Loading SMS Unmukt portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      {/* Super Admin Impersonation Top Banner */}
      {isImpersonating && (
        <div className="bg-amber-400 text-slate-950 px-4 py-2 text-xs font-medium flex flex-wrap items-center justify-between gap-2 border-b border-amber-500 shadow-sm z-50">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-slate-950 shrink-0" />
            <span>
              <strong>Administrator Access Active:</strong> You are viewing customer workspace for{" "}
              <strong className="underline">
                {customers.find((c) => c.id === activeCustomerId)?.businessName}
              </strong>.
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[11px] text-amber-950 hidden sm:inline">Switch Workspace:</span>
            <select
              value={activeCustomerId}
              onChange={(e) => switchActiveCustomer(e.target.value)}
              className="h-7 px-2 text-xs rounded bg-white text-slate-900 border border-amber-600 font-semibold focus:outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.businessName} ({c.businessCategory})
                </option>
              ))}
            </select>

            <button
              onClick={handleExitImpersonation}
              className="inline-flex items-center gap-1 px-3 py-1 bg-slate-950 hover:bg-slate-900 text-white rounded font-bold text-xs transition-colors shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit to Admin Portal</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <ClientSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ClientHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

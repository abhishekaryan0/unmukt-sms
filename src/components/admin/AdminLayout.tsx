"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { DateFilterOption } from "@/components/shared/DateRangePicker";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilterOption>("30d");

  useEffect(() => {
    const session = getAdminSession();
    if (session && session.role === "super_admin") {
      setIsAuthenticated(true);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

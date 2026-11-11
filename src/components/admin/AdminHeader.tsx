"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutAdmin, DEMO_ADMIN } from "@/lib/auth";
import { DateRangePicker, DateFilterOption } from "@/components/shared/DateRangePicker";
import { Button } from "@/components/ui/Button";
import { Menu, LogOut, Bell, Shield, ExternalLink } from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  dateFilter?: DateFilterOption;
  onDateFilterChange?: (opt: DateFilterOption) => void;
}

export function AdminHeader({
  onToggleSidebar,
  dateFilter = "30d",
  onDateFilterChange,
}: AdminHeaderProps) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin/login");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-subtle">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Control Plane
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-semibold text-slate-800">Super Admin</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Date Filter */}
        {onDateFilterChange && (
          <div className="hidden md:block">
            <DateRangePicker value={dateFilter} onChange={onDateFilterChange} />
          </div>
        )}

        {/* Switch to Client View Link */}
        <Link
          href="/dashboard"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
        >
          <span>Client App</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </Link>

        {/* Notification Bell */}
        <div className="relative">
          <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </button>
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-200">
              VM
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-900">{DEMO_ADMIN.user.name}</div>
              <div className="text-[10px] text-slate-500">Super Admin</div>
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="font-semibold text-slate-900">{DEMO_ADMIN.user.name}</div>
                <div className="text-slate-500 text-[11px] truncate">{DEMO_ADMIN.email}</div>
              </div>

              <Link
                href="/admin/settings"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50"
              >
                <Shield className="w-4 h-4 text-slate-500" />
                <span>Security & Settings</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-rose-600 hover:bg-rose-50 text-left border-t border-slate-100 mt-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out (Admin)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

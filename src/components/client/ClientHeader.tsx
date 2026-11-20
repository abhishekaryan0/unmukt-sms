"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logoutClient, getClientSession } from "@/lib/auth";
import { useAppStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { RechargeModal } from "./RechargeModal";
import {
  Menu,
  Sparkles,
  Inbox,
  Radio,
  Bell,
  LogOut,
  User,
  Store,
  CreditCard,
} from "lucide-react";

interface ClientHeaderProps {
  onToggleSidebar?: () => void;
}

export function ClientHeader({ onToggleSidebar }: ClientHeaderProps) {
  const router = useRouter();
  const { clientWalletBalance, activeCustomer, conversations, connectedChannels } = useAppStore();
  const [showRecharge, setShowRecharge] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = conversations.filter((c) => c.status === "unread" || c.unreadCount > 0).length;
  const connectedCount = connectedChannels.filter((c) => c.status === "connected").length;

  const session = typeof window !== "undefined" ? getClientSession() : null;

  const handleLogout = () => {
    logoutClient();
    router.push("/login");
  };

  const businessDisplayName = activeCustomer?.businessName || session?.businessName || "My Business";
  const businessCategory = activeCustomer?.businessCategory || session?.category || "Business Account";
  const businessCity = activeCustomer?.city || "";
  const ownerName = activeCustomer?.ownerName || session?.name || "Client";
  const ownerEmail = activeCustomer?.email || session?.email || "";
  const ownerInitials = ownerName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "CL";

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-subtle">
        {/* Left Side: Mobile Menu & Business Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
              <Store className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {businessDisplayName}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {businessCategory}{businessCity ? ` • ${businessCity}` : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Wallet pill, Quick send, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Subscription Tier Pill */}
          <Link
            href="/subscription"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 transition-colors shadow-subtle group"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <div className="text-left">
              <span className="text-[10px] text-blue-600 uppercase tracking-wider block font-bold leading-none">
                Plan
              </span>
              <span className="text-xs font-bold text-slate-900 leading-none">
                Pro Tier
              </span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          </Link>

          {/* Connected Channels Pill */}
          <Link
            href="/channels"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-subtle"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            <span>Channels ({connectedCount})</span>
          </Link>

          {/* Unified Inbox Pill */}
          <Link
            href="/inbox"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-subtle"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Inbox</span>
            {unreadCount > 0 && (
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* Notifications */}
          <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold ring-2 ring-slate-100">
                {ownerInitials}
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="font-semibold text-slate-900">{ownerName}</div>
                  <div className="text-slate-500 text-[11px] truncate">{ownerEmail}</div>
                  <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                    Channels: {connectedCount} Connected (Healthy)
                  </div>
                </div>

                <Link
                  href="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Profile & Business Info</span>
                </Link>

                <Link
                  href="/subscription"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50"
                >
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  <span>Subscription & Plans</span>
                </Link>

                <Link
                  href="/invoices"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50"
                >
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  <span>Invoices & Billing</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-rose-600 hover:bg-rose-50 text-left border-t border-slate-100 mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Recharge Modal */}
      <RechargeModal isOpen={showRecharge} onClose={() => setShowRecharge(false)} />
    </>
  );
}

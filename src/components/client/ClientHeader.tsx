"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logoutClient, DEMO_CLIENT } from "@/lib/auth";
import { useAppStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { RechargeModal } from "./RechargeModal";
import {
  Menu,
  Wallet,
  Plus,
  Send,
  MessageCircle,
  Bell,
  LogOut,
  User,
  ExternalLink,
  Store,
} from "lucide-react";

interface ClientHeaderProps {
  onToggleSidebar?: () => void;
}

export function ClientHeader({ onToggleSidebar }: ClientHeaderProps) {
  const router = useRouter();
  const { clientWalletBalance, activeCustomer } = useAppStore();
  const [showRecharge, setShowRecharge] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logoutClient();
    router.push("/login");
  };

  const businessDisplayName = activeCustomer?.businessName || DEMO_CLIENT.user.businessName;
  const businessCategory = activeCustomer?.businessCategory || DEMO_CLIENT.user.category;
  const businessCity = activeCustomer?.city || "Delhi";
  const ownerName = activeCustomer?.ownerName || DEMO_CLIENT.user.name;
  const ownerEmail = activeCustomer?.email || DEMO_CLIENT.email;
  const ownerInitials = ownerName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {businessDisplayName}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {businessCategory} • {businessCity}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Wallet pill, Quick send, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Wallet Balance Pill */}
          <button
            onClick={() => setShowRecharge(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors shadow-subtle group"
          >
            <Wallet className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-700" />
            <div className="text-left">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold leading-none">
                Wallet
              </span>
              <span className="text-xs font-bold text-slate-900 leading-none">
                {formatINR(clientWalletBalance)}
              </span>
            </div>
            <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] ml-1">
              <Plus className="w-3 h-3" />
            </span>
          </button>

          {/* Quick Send WhatsApp Pill */}
          <Link
            href="/whatsapp"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8F8EE] text-[#075E54] hover:bg-[#d8f3e2] text-xs font-semibold border border-[#b8e8c8] transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>WhatsApp</span>
          </Link>

          {/* Quick Send SMS Pill */}
          <Link
            href="/send-sms"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors border border-slate-200"
          >
            <Send className="w-3.5 h-3.5 text-slate-600" />
            <span>Send SMS</span>
          </Link>

          {/* Super Admin Switch link (for demo convenience) */}
          <Link
            href="/admin/dashboard"
            target="_blank"
            className="hidden xl:inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 px-2 py-1 rounded bg-slate-50 border border-slate-200"
          >
            <span>Admin Portal</span>
            <ExternalLink className="w-3 h-3" />
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
                    DLT Entity ID: {activeCustomer?.dltEntityId || "1701159820000034"}
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
                  href="/invoices"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50"
                >
                  <Wallet className="w-4 h-4 text-slate-500" />
                  <span>Invoices & GST</span>
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

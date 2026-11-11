"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Send,
  MessageCircle,
  Users,
  FolderTree,
  History,
  FileText,
  Wallet,
  Receipt,
  FileCheck2,
  BarChart2,
  HelpCircle,
  Settings,
  ChevronRight,
  PlusCircle,
  Plus,
} from "lucide-react";
import { cn, formatINR } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { RechargeModal } from "./RechargeModal";

interface ClientSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function ClientSidebar({ isOpen, onClose }: ClientSidebarProps) {
  const pathname = usePathname();
  const { clientWalletBalance } = useAppStore();
  const [showRecharge, setShowRecharge] = useState(false);

  const mainNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Send SMS", href: "/send-sms", icon: Send },
    { name: "WhatsApp Campaigns", href: "/whatsapp", icon: MessageCircle, badge: "Popular" },
    { name: "Contacts", href: "/contacts", icon: Users },
    { name: "Contact Groups", href: "/groups", icon: FolderTree },
    { name: "Campaign History", href: "/campaigns", icon: History },
    { name: "Templates", href: "/templates", icon: FileText },
  ];

  const financeNavigation = [
    { name: "Wallet & Recharge", href: "/wallet", icon: Wallet },
    { name: "Transactions", href: "/transactions", icon: Receipt },
    { name: "Invoices", href: "/invoices", icon: FileCheck2 },
    { name: "Reports", href: "/reports", icon: BarChart2 },
    { name: "Support", href: "/support", icon: HelpCircle },
    { name: "Profile & Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white text-slate-700 flex flex-col border-r border-slate-200/90 shadow-sm transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 bg-white">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-subtle">
              U
            </div>
            <div>
              <div className="font-bold text-slate-900 tracking-tight text-sm">
                SMS<span className="text-blue-600">UNMUKT</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Marketing Platform</div>
            </div>
          </Link>
        </div>

        {/* Quick Campaign Action Button */}
        <div className="px-4 pt-4 pb-2">
          <Link
            href="/send-sms"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-subtle transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Campaign</span>
          </Link>
        </div>

        {/* Nav lists */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
          {/* Main Campaigning */}
          <div className="space-y-1">
            <div className="px-2.5 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Campaigns & Audience
            </div>
            {mainNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors group",
                    isActive
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <item.icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive
                          ? item.href === "/whatsapp"
                            ? "text-[#25D366]"
                            : "text-slate-900"
                          : item.href === "/whatsapp"
                          ? "text-[#25D366]"
                          : "text-slate-400 group-hover:text-slate-600"
                      )}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-semibold bg-[#E8F8EE] text-[#075E54] px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Billing & Management */}
          <div className="space-y-1">
            <div className="px-2.5 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Billing & Account
            </div>
            {financeNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors group",
                    isActive
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <item.icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                      )}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Wallet Mini-Widget in Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-subtle">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-medium">Wallet Balance</span>
              <button
                onClick={() => setShowRecharge(true)}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-0.5 text-[11px]"
              >
                <Plus className="w-3 h-3" />
                Add Money
              </button>
            </div>
            <div className="text-base font-bold text-slate-900 mt-1">
              {formatINR(clientWalletBalance)}
            </div>
          </div>
        </div>
      </aside>

      {/* Recharge Modal */}
      <RechargeModal isOpen={showRecharge} onClose={() => setShowRecharge(false)} />
    </>
  );
}

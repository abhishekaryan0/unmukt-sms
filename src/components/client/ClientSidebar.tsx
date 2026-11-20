"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Radio,
  Users,
  FolderTree,
  History,
  MessageSquareQuote,
  UserCheck,
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
  MessageSquare,
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
  const { clientWalletBalance, conversations, connectedChannels } = useAppStore();
  const [showRecharge, setShowRecharge] = useState(false);

  const unreadConversationsCount = conversations.filter(
    (c) => c.status === "unread" || c.unreadCount > 0
  ).length;

  const activeChannelsCount = connectedChannels.filter((c) => c.status === "connected").length;

  const mainNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
      name: "Unified Inbox",
      href: "/inbox",
      icon: Inbox,
      badge: unreadConversationsCount > 0 ? `${unreadConversationsCount} New` : undefined,
      highlight: true,
    },
    {
      name: "Connected Channels",
      href: "/channels",
      icon: Radio,
      badge: `${activeChannelsCount} Active`,
    },
    { name: "Contacts", href: "/contacts", icon: Users },
    { name: "Contact Groups", href: "/groups", icon: FolderTree },
    { name: "Conversation History", href: "/campaigns", icon: History },
    { name: "Saved Replies", href: "/saved-replies", icon: MessageSquareQuote },
    { name: "Team Members", href: "/team", icon: UserCheck },
  ];

  const financeNavigation = [
    { name: "Wallet & Recharge", href: "/wallet", icon: Wallet },
    { name: "Transactions", href: "/transactions", icon: Receipt },
    { name: "Invoices", href: "/invoices", icon: FileCheck2 },
    { name: "Reports & Analytics", href: "/reports", icon: BarChart2 },
    { name: "Support Tickets", href: "/support", icon: HelpCircle },
    { name: "Settings", href: "/settings", icon: Settings },
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
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-subtle">
              U
            </div>
            <div>
              <div className="font-bold text-slate-900 tracking-tight text-sm">
                UNMUKT<span className="text-blue-600">.SOCIAL</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Social Messaging Platform</div>
            </div>
          </Link>
        </div>

        {/* Quick Launch Inbox Button */}
        <div className="px-4 pt-4 pb-2">
          <Link
            href="/inbox"
            onClick={onClose}
            className="flex items-center justify-between w-full py-2.5 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-subtle transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4" />
              <span>Open Unified Inbox</span>
            </div>
            {unreadConversationsCount > 0 && (
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {unreadConversationsCount}
              </span>
            )}
          </Link>
        </div>

        {/* Nav lists */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
          {/* Main Messaging & Channels */}
          <div className="space-y-1">
            <div className="px-2.5 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Messaging & Channels
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
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded font-medium",
                        isActive
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                      )}
                    >
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

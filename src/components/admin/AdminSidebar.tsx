"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Megaphone,
  MessageSquare,
  Smartphone,
  Truck,
  GitFork,
  Wallet,
  Tag,
  Receipt,
  BarChart3,
  FileCode2,
  Headphones,
  Settings,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Agencies", href: "/admin/agencies", icon: Briefcase },
    { name: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
    { name: "SMS Management", href: "/admin/sms", icon: Smartphone },
    { name: "WhatsApp Management", href: "/admin/whatsapp", icon: MessageSquare },
    { name: "Suppliers", href: "/admin/suppliers", icon: Truck },
    { name: "Routing Management", href: "/admin/routing", icon: GitFork },
    { name: "Wallet & Transactions", href: "/admin/wallet", icon: Wallet },
    { name: "Pricing Management", href: "/admin/pricing", icon: Tag },
    { name: "Revenue & Billing", href: "/admin/billing", icon: Receipt },
    { name: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
    { name: "Templates", href: "/admin/templates", icon: FileCode2 },
    { name: "Support Tickets", href: "/admin/support", icon: Headphones },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800/80 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 bg-slate-950/80">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
            U
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white tracking-tight text-sm">SMS UNMUKT</span>
              <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">
                ADMIN
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Carrier Gateway Cloud</div>
          </div>
        </Link>
      </div>

      {/* Nav links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-2 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          Platform Administration
        </div>

        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors group",
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <item.icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                <span className="truncate">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200 shrink-0" />}
            </Link>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-300 font-medium">Gateway: 99.98% TPS</span>
        </div>
      </div>
    </aside>
  );
}

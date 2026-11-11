import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
  icon?: ReactNode;
  iconBg?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  trend = "up",
  subtitle,
  icon,
  iconBg = "bg-slate-100 text-slate-700",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-200/80 p-5 shadow-card hover:shadow-elevated transition-shadow flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</span>
        {icon && (
          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", iconBg)}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>

        {(change || subtitle) && (
          <div className="mt-2 flex items-center gap-2 text-xs flex-wrap">
            {change && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded",
                  trend === "up" && "text-emerald-700 bg-emerald-50",
                  trend === "down" && "text-rose-700 bg-rose-50",
                  trend === "neutral" && "text-slate-600 bg-slate-100"
                )}
              >
                {trend === "up" && <ArrowUpRight className="w-3 h-3" />}
                {trend === "down" && <ArrowDownRight className="w-3 h-3" />}
                {trend === "neutral" && <Minus className="w-3 h-3" />}
                {change}
              </span>
            )}
            {subtitle && <span className="text-slate-500">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

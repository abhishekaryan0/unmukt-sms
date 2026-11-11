import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "destructive" | "neutral" | "whatsapp" | "blue";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    destructive: "bg-rose-50 text-rose-700 border-rose-200",
    neutral: "bg-slate-100 text-slate-600 border-slate-200",
    whatsapp: "bg-[#E8F8EE] text-[#075E54] border-[#b5e7c8]",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const dotColors = {
    default: "bg-slate-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    destructive: "bg-rose-500",
    neutral: "bg-slate-400",
    whatsapp: "bg-[#25D366]",
    blue: "bg-blue-500",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-0.5 gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border leading-normal transition-colors select-none",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />}
      {children}
    </span>
  );
}

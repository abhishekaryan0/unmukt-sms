"use client";

import React, { useState } from "react";
import { Calendar } from "lucide-react";

export type DateFilterOption = "today" | "7d" | "30d" | "month" | "custom";

interface DateRangePickerProps {
  value: DateFilterOption;
  onChange: (val: DateFilterOption) => void;
  className?: string;
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const options: { id: DateFilterOption; label: string }[] = [
    { id: "today", label: "Today" },
    { id: "7d", label: "Last 7 days" },
    { id: "30d", label: "Last 30 days" },
    { id: "month", label: "This month" },
    { id: "custom", label: "Custom range" },
  ];

  return (
    <div className={`inline-flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200/80 ${className || ""}`}>
      <span className="pl-2 pr-1 text-slate-400">
        <Calendar className="w-3.5 h-3.5" />
      </span>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
            value === opt.id
              ? "bg-white text-slate-900 shadow-sm font-semibold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

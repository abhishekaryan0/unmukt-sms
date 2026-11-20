"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export type ThemeMode = "light" | "dark" | "system";

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  try {
    const saved = localStorage.getItem("unmukt_theme") as ThemeMode | null;
    if (saved === "light" || saved === "dark" || saved === "system") return saved;
  } catch {}
  return "light";
}

export function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  let isDark = false;

  if (mode === "dark") {
    isDark = true;
  } else if (mode === "system") {
    isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  } else {
    isDark = false;
  }

  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  try {
    localStorage.setItem("unmukt_theme", mode);
    window.dispatchEvent(new CustomEvent("unmukt_theme_changed", { detail: mode }));
  } catch {}
}

export function ThemeToggle({
  variant = "button",
  className = "",
}: {
  variant?: "button" | "pill" | "dropdown";
  className?: string;
}) {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initial = getStoredTheme();
    setTheme(initial);
    applyTheme(initial);

    const handleThemeChange = (e: any) => {
      if (e.detail) setTheme(e.detail);
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "unmukt_theme" && e.newValue) {
        setTheme(e.newValue as ThemeMode);
        applyTheme(e.newValue as ThemeMode);
      }
    };

    window.addEventListener("unmukt_theme_changed", handleThemeChange);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("unmukt_theme_changed", handleThemeChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const toggleTheme = () => {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  // Segmented 3-Way Pill (Used in Settings)
  if (variant === "pill") {
    return (
      <div className={`inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 ${className}`}>
        <button
          type="button"
          onClick={() => {
            setTheme("light");
            applyTheme("light");
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            theme === "light"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setTheme("dark");
            applyTheme("dark");
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            theme === "dark"
              ? "bg-slate-900 text-white shadow-sm dark:bg-slate-700"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-blue-400" />
          <span>Dark</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setTheme("system");
            applyTheme("system");
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            theme === "system"
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Monitor className="w-3.5 h-3.5 text-slate-500" />
          <span>System</span>
        </button>
      </div>
    );
  }

  // Header Quick Toggle Button (Navbar)
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative flex items-center justify-center ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
}

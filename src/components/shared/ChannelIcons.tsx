"use client";

import React from "react";
import { SocialChannelType } from "@/types";

export function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.78 14.07c-.24.68-1.4 1.27-1.92 1.34-.5.07-1.12.1-3.23-.77-2.69-1.12-4.41-3.85-4.54-4.03-.13-.18-1.07-1.42-1.07-2.71 0-1.29.68-1.92.92-2.18.24-.26.53-.33.7-.33.18 0 .35 0 .5.01.16.01.38-.06.59.45.22.53.75 1.83.82 1.96.07.13.11.29.02.47-.09.18-.13.29-.26.44-.13.16-.28.35-.4.47-.13.13-.27.28-.12.54.16.26.7 1.15 1.5 1.86 1.03.92 1.9 1.2 2.17 1.34.27.13.42.11.58-.07.16-.18.68-.79.86-1.06.18-.27.35-.22.59-.13.24.09 1.53.72 1.79.85.26.13.44.2.5.31.07.11.07.64-.17 1.32z" />
    </svg>
  );
}

export function MessengerIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.12 7.15V22l3.05-1.68c1.19.33 2.47.52 3.83.52 5.64 0 10-4.13 10-9.14S17.64 2 12 2zm1.05 12.3-2.69-2.87-5.25 2.87 5.77-6.13 2.76 2.87 5.18-2.87-5.77 6.13z" />
    </svg>
  );
}

export function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function TelegramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

export function ChannelBadge({
  channelType,
  showLabel = true,
  size = "md",
}: {
  channelType: SocialChannelType;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const iconSize = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";

  switch (channelType) {
    case "whatsapp":
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8F8EE] text-[#075E54] border border-[#b5e7c8]">
          <WhatsAppIcon className={`${iconSize} text-[#25D366]`} />
          {showLabel && <span>WhatsApp</span>}
        </span>
      );
    case "messenger":
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <MessengerIcon className={`${iconSize} text-[#0084FF]`} />
          {showLabel && <span>Messenger</span>}
        </span>
      );
    case "instagram":
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-pink-50 text-pink-700 border border-pink-200">
          <InstagramIcon className={`${iconSize} text-pink-600`} />
          {showLabel && <span>Instagram</span>}
        </span>
      );
    case "telegram":
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
          <TelegramIcon className={`${iconSize} text-[#0088cc]`} />
          {showLabel && <span>Telegram</span>}
        </span>
      );
    default:
      return null;
  }
}

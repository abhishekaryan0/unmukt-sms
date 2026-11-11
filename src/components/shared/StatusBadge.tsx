import React from "react";
import { Badge } from "@/components/ui/Badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const safeStatus = typeof status === "string" ? status : "";
  const normalized = safeStatus.toLowerCase().trim();
  const label = safeStatus
    ? safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1).replace(/_/g, " ")
    : "Active";

  switch (normalized) {
    case "delivered":
    case "completed":
    case "approved":
    case "active":
    case "connected":
    case "paid":
    case "resolved":
    case "success":
      return (
        <Badge variant="success" dot className={className}>
          {label}
        </Badge>
      );

    case "failed":
    case "rejected":
    case "suspended":
    case "offline":
    case "closed":
    case "error":
      return (
        <Badge variant="destructive" dot className={className}>
          {label}
        </Badge>
      );

    case "pending":
    case "processing":
    case "scheduled":
    case "pending_verification":
    case "in_progress":
    case "degraded":
      return (
        <Badge variant="warning" dot className={className}>
          {label}
        </Badge>
      );

    case "whatsapp":
      return (
        <Badge variant="whatsapp" className={className}>
          WhatsApp
        </Badge>
      );

    case "sms":
      return (
        <Badge variant="blue" className={className}>
          SMS
        </Badge>
      );

    default:
      return (
        <Badge variant="neutral" className={className}>
          {status}
        </Badge>
      );
  }
}

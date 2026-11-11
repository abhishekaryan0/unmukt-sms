import React from "react";
import { Badge } from "@/components/ui/Badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = (status || "").toLowerCase().trim();

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
          {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
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
          {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
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
          {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
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

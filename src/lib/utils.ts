import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency into Indian Rupees format (₹1,23,456.78)
 */
export function formatINR(amount: number, showDecimals: boolean = true): string {
  if (isNaN(amount)) return "₹0.00";
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
  return formatted;
}

/**
 * Format standard number to Indian comma separation (e.g., 1,50,000)
 */
export function formatNumber(num: number): string {
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
}

/**
 * Format date string into human friendly format
 */
export function formatDate(dateStr: string, includeTime: boolean = true): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...(includeTime
        ? {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }
        : {}),
    };
    return new Intl.DateTimeFormat("en-IN", options).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * SMS character and segment calculation.
 * GSM 7-bit standard:
 * - 1 segment: 160 characters
 * - Multipart: 153 characters per segment
 * Unicode (Hindi / Regional / Emoji):
 * - 1 segment: 70 characters
 * - Multipart: 67 characters per segment
 */
export function calculateSMSSegments(text: string) {
  if (!text) {
    return {
      characters: 0,
      isUnicode: false,
      segments: 0,
      charLimitPerSegment: 160,
      remainingInSegment: 160,
    };
  }

  // Regex to detect characters outside GSM 03.38 basic set (including Devanagari/Hindi, emojis, etc.)
  // If text contains non-ASCII characters outside GSM set, treat as Unicode
  const gsmRegex = /^[@£$¥èéùìòÇ\r\nØø\S+ÅåΔ_ΦΓΛΩΠΨΣΘΞ^{}\[~\]|€ÆæßÉ !"#%&'()*+,\-.\/0-9:;<=>?A-Z\w\d]*$/;
  // A safer practical check: if character code > 127 and not euro symbol
  const hasUnicode = Array.from(text).some((char) => {
    const code = char.charCodeAt(0);
    return code > 127 && char !== "€";
  });

  const characters = Array.from(text).length; // Proper unicode-aware length

  if (hasUnicode) {
    const singleLimit = 70;
    const multiLimit = 67;
    const segments = characters <= singleLimit ? 1 : Math.ceil(characters / multiLimit);
    const limitUsed = segments === 1 ? singleLimit : segments * multiLimit;
    const remainingInSegment = limitUsed - characters;

    return {
      characters,
      isUnicode: true,
      segments: Math.max(1, segments),
      charLimitPerSegment: segments === 1 ? singleLimit : multiLimit,
      remainingInSegment: Math.max(0, remainingInSegment),
    };
  } else {
    const singleLimit = 160;
    const multiLimit = 153;
    const segments = characters <= singleLimit ? 1 : Math.ceil(characters / multiLimit);
    const limitUsed = segments === 1 ? singleLimit : segments * multiLimit;
    const remainingInSegment = limitUsed - characters;

    return {
      characters,
      isUnicode: false,
      segments: Math.max(1, segments),
      charLimitPerSegment: segments === 1 ? singleLimit : multiLimit,
      remainingInSegment: Math.max(0, remainingInSegment),
    };
  }
}

/**
 * Validate 10-digit Indian mobile number
 * Starts with 6, 7, 8, or 9
 */
export function validateIndianMobile(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  // Accept either 10 digits or 12 digits starting with 91
  if (cleaned.length === 10) {
    return /^[6-9]\d{9}$/.test(cleaned);
  }
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return /^91[6-9]\d{9}$/.test(cleaned);
  }
  return false;
}

/**
 * Format Indian mobile number nicely (+91 98765 43210)
 */
export function formatIndianMobile(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    const core = cleaned.slice(2);
    return `+91 ${core.slice(0, 5)} ${core.slice(5)}`;
  }
  return phone;
}

/**
 * Client-side CSV export
 */
export function exportToCSV(data: Record<string, any>[], filename: string) {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const csvRows: string[] = [];

  csvRows.push(headers.join(","));

  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header] ?? "";
      const escaped = ("" + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

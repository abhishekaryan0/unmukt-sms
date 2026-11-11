import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { ToastProvider } from "@/components/ui/ToastContext";

export const metadata: Metadata = {
  title: "SMS Unmukt | SMS & WhatsApp Marketing SaaS Platform",
  description:
    "India's premier high-throughput B2B SMS and WhatsApp marketing platform for retail, coaching institutes, restaurants, and digital agencies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#f8fafc] text-slate-900 selection:bg-slate-900 selection:text-white">
        <AppProvider>
          <ToastProvider>{children}</ToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}

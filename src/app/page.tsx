"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Smartphone,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  BarChart3,
  Building2,
  Users,
  Check,
  ChevronDown,
  Sparkles,
  Send,
  HelpCircle,
  Clock,
  Wallet,
  Receipt,
  FileSpreadsheet,
  BadgeCheck,
  Headphones,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [dashboardTab, setDashboardTab] = useState<"analytics" | "whatsapp" | "sms" | "wallet">("analytics");

  const faqs = [
    {
      q: "What is TRAI DLT and is it mandatory for sending SMS in India?",
      a: "Yes. In accordance with Telecom Regulatory Authority of India (TRAI) TCCCPR 2018 regulations, every Indian enterprise must register their business entity and 6-character sender ID on telecom DLT portals (Jio, Airtel, Vi, BSNL). Our onboarding team guides you through 100% free DLT registration and template approvals.",
    },
    {
      q: "How does the official WhatsApp Business API differ from personal WhatsApp?",
      a: "SMS Unmukt connects directly to the official Meta Cloud API. Unlike personal or web automation tools that risk number banning, the official API allows you to send broadcast marketing messages to unlimited opted-in customers, features a verified Green Tick badge, and includes interactive buttons (Quick Replies and URL CTAs).",
    },
    {
      q: "Is there any monthly subscription fee or minimum commitment?",
      a: "No! SMS Unmukt is 100% pay-as-you-go. You only recharge your prepaid wallet as needed (starting from ₹500). There are zero monthly maintenance fees, zero platform access charges, and your wallet balance never expires.",
    },
    {
      q: "Do you provide GST tax invoices for business expense input credit?",
      a: "Yes. Every recharge instantly generates a downloadable GST tax invoice including full CGST and SGST breakdowns (18%) and your company GSTIN, enabling you to claim input tax credit (ITC) on your business returns.",
    },
    {
      q: "How quickly are promotional and transactional messages delivered?",
      a: "Our telecom carrier switches (direct Tier-1 routes with Airtel, Jio, and Vodafone Idea) maintain an average delivery latency under 1.8 seconds for OTP/transactional messages and over 5,000 messages per second for promotional broadcasts.",
    },
    {
      q: "Can I import existing customer contacts from Excel or CSV spreadsheets?",
      a: "Absolutely. You can upload an Excel or CSV file with thousands of contacts in one click. Our smart importer automatically detects columns for customer name, mobile number, city, and custom tags.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 font-sans">
      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              U
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">
              SMS<span className="text-blue-600">UNMUKT</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#solutions" className="hover:text-blue-600 transition-colors">
              Solutions
            </a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">
              FAQ
            </a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Actions: Only Customer Login & Get Started */}
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 text-xs font-semibold text-slate-800 border-slate-300 hover:bg-slate-50"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="h-9 px-4 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
            <div className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-50"
              >
                Features
              </a>
              <a
                href="#solutions"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-50"
              >
                Solutions
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-50"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-50"
              >
                Pricing
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-50"
              >
                FAQ
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-50"
              >
                Contact
              </a>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="outline" className="w-full text-xs font-semibold">
                  Login to Dashboard
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
                  Get Started Free (₹100 Bonus)
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-100 bg-linear-to-b from-slate-50/70 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200/90 text-slate-800 text-xs font-medium shadow-xs mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-600" />
              <span>TRAI DLT & Meta WhatsApp Cloud API Compliant</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Connect With Your Customers. <br />
              <span className="text-slate-900">Grow Your Business.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Send SMS and WhatsApp campaigns, share offers, manage customers and grow your business from one simple platform.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto px-6 h-11 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center justify-center gap-2">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-6 h-11 text-sm font-semibold text-slate-800 border-slate-300 hover:bg-slate-50"
                >
                  Login to Dashboard
                </Button>
              </Link>
            </div>

            {/* Micro Perks Under CTA */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" /> ₹100 Free Welcome Credit
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" /> 2-Minute Account Setup
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" /> No Credit Card Required
              </span>
            </div>
          </div>

          {/* Interactive Product Dashboard Mockup */}
          <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-slate-200/90 bg-white shadow-elevated overflow-hidden">
              {/* Mockup Window Header Bar */}
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 ml-2 hidden sm:inline">
                    app.smsunmukt.in/dashboard
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Workspace:</span>
                  <span className="font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Sharma Fashion Store (Delhi)
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                    Prepaid: ₹6,500.00
                  </span>
                </div>
              </div>

              {/* Mockup Tabs */}
              <div className="bg-white border-b border-slate-200 px-4 flex gap-4 overflow-x-auto text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setDashboardTab("analytics")}
                  className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
                    dashboardTab === "analytics"
                      ? "border-blue-600 text-blue-600 font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Campaign Analytics
                </button>
                <button
                  type="button"
                  onClick={() => setDashboardTab("whatsapp")}
                  className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
                    dashboardTab === "whatsapp"
                      ? "border-blue-600 text-blue-600 font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  WhatsApp Green Tick Preview
                </button>
                <button
                  type="button"
                  onClick={() => setDashboardTab("sms")}
                  className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
                    dashboardTab === "sms"
                      ? "border-blue-600 text-blue-600 font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  SMS DLT Gateway
                </button>
                <button
                  type="button"
                  onClick={() => setDashboardTab("wallet")}
                  className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
                    dashboardTab === "wallet"
                      ? "border-blue-600 text-blue-600 font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  GST Billing & Invoices
                </button>
              </div>

              {/* Mockup Inner Body */}
              <div className="p-4 sm:p-6 bg-slate-50/50">
                {dashboardTab === "analytics" && (
                  <div className="space-y-4">
                    {/* Stat Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                        <div className="text-[11px] text-slate-500 font-medium">Total Messages Sent</div>
                        <div className="text-xl font-bold text-slate-900 mt-1">1,98,000</div>
                        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">↑ 18.4% this month</div>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                        <div className="text-[11px] text-slate-500 font-medium">Telecom Delivery Rate</div>
                        <div className="text-xl font-bold text-slate-900 mt-1">99.82%</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Airtel • Jio • Vi Direct</div>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                        <div className="text-[11px] text-slate-500 font-medium">WhatsApp Read Rate</div>
                        <div className="text-xl font-bold text-slate-900 mt-1">86.4%</div>
                        <div className="text-[10px] text-blue-600 font-semibold mt-0.5">Verified Green Tick</div>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                        <div className="text-[11px] text-slate-500 font-medium">Active Customer Contacts</div>
                        <div className="text-xl font-bold text-slate-900 mt-1">14,250</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">100% DND Cleaned</div>
                      </div>
                    </div>

                    {/* Recent Campaign Execution Row */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                        <div className="font-bold text-slate-900">Recent Broadcast Execution</div>
                        <span className="text-[11px] text-slate-500 font-mono">Live CDR Telemetry</span>
                      </div>
                      <div className="mt-3 space-y-2 text-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 gap-2">
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                            <div>
                              <div className="font-bold text-slate-900">Diwali Weekend VIP Offer Broadcast</div>
                              <div className="text-[11px] text-slate-500">Channel: WhatsApp Marketing • Header: SHRFSH</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-right">
                            <div>
                              <span className="font-bold text-slate-900 block">10,000 sent</span>
                              <span className="text-[11px] text-emerald-600 font-semibold">9,982 Delivered</span>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              COMPLETED
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 gap-2">
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                            <div>
                              <div className="font-bold text-slate-900">Monthly Loyalty Reward Points Update</div>
                              <div className="text-[11px] text-slate-500">Channel: High-speed Promotional SMS • Route: Ejoin Primary</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-right">
                            <div>
                              <span className="font-bold text-slate-900 block">45,000 sent</span>
                              <span className="text-[11px] text-emerald-600 font-semibold">44,910 Delivered</span>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              COMPLETED
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {dashboardTab === "whatsapp" && (
                  <div className="flex flex-col sm:flex-row gap-6 items-center justify-center py-4">
                    {/* Realistic WhatsApp Handset Bubble */}
                    <div className="max-w-xs w-full bg-[#EFEAE2] p-3 rounded-2xl border border-slate-300 shadow-sm font-sans text-slate-900">
                      <div className="bg-[#075E54] text-white p-2.5 rounded-t-xl -m-3 mb-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                          SF
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-xs truncate flex items-center gap-1">
                            Sharma Fashion Store
                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 shrink-0" />
                          </div>
                          <div className="text-[10px] text-white/80">Official Business Account</div>
                        </div>
                      </div>

                      {/* Chat Bubble */}
                      <div className="bg-white rounded-lg p-3 text-xs shadow-xs space-y-2">
                        <div className="font-bold text-slate-900">Special Festive Weekend Sale! 🎉</div>
                        <p className="text-slate-700 leading-relaxed text-[11px]">
                          Hello Rajesh, enjoy an exclusive <strong>30% OFF</strong> on all ethnic and wedding wear collections at our Connaught Place store this Friday–Sunday.
                        </p>
                        <div className="bg-slate-50 p-2 rounded border border-slate-200 text-[10px] text-slate-600">
                          Coupon Code: <strong className="font-mono text-blue-700">FESTIVE30</strong>
                        </div>
                        <div className="text-[9px] text-slate-400 text-right">10:45 AM • Read ✓✓</div>
                      </div>

                      {/* Interactive Buttons */}
                      <div className="mt-2 space-y-1">
                        <button type="button" className="w-full bg-white text-blue-600 font-bold py-1.5 px-3 rounded text-[11px] shadow-xs text-center border border-slate-200 hover:bg-slate-50">
                          🛍️ View Festive Catalog
                        </button>
                        <button type="button" className="w-full bg-white text-blue-600 font-bold py-1.5 px-3 rounded text-[11px] shadow-xs text-center border border-slate-200 hover:bg-slate-50">
                          📍 Locate Store (Connaught Place)
                        </button>
                      </div>
                    </div>

                    <div className="max-w-sm space-y-3 text-xs text-slate-600">
                      <h4 className="font-bold text-sm text-slate-900">Why Official Meta WhatsApp Cloud API?</h4>
                      <p>Unlike fragile browser automations that risk permanent SIM blocking, our official API integration ensures:</p>
                      <ul className="space-y-1.5 font-medium text-slate-800">
                        <li className="flex items-center gap-1.5">✓ <strong>Verified Green Tick badge</strong> on your business profile</li>
                        <li className="flex items-center gap-1.5">✓ Up to <strong>1,00,000 unique customers</strong> daily in Tier 3</li>
                        <li className="flex items-center gap-1.5">✓ Interactive buttons, catalogs, images & video brochures</li>
                        <li className="flex items-center gap-1.5">✓ Detailed read-receipt and click-through analytics</li>
                      </ul>
                    </div>
                  </div>
                )}

                {dashboardTab === "sms" && (
                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-900">Registered TRAI DLT Sender IDs</div>
                        <div className="text-slate-500 text-[11px]">Approved 6-Character Alpha Headers on Indian Telecom Operators</div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10px] border border-emerald-200">
                        100% TRAI Compliant
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-base text-slate-900">SHRFSH</span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Active / Approved</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Reliance Jio DLT • Entity ID: 170115894120349</div>
                        <div className="text-[11px] text-slate-700 mt-2 font-medium">Used for: Promotional Weekend Flash Sales & Discount Alerts</div>
                      </div>

                      <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-base text-slate-900">SHROTp</span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Active / Approved</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Bharti Airtel DLT • Entity ID: 170115894120349</div>
                        <div className="text-[11px] text-slate-700 mt-2 font-medium">Used for: 24x7 Instant OTPs & Billing Receipts (1.4s Delivery)</div>
                      </div>
                    </div>
                  </div>
                )}

                {dashboardTab === "wallet" && (
                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <div>
                        <div className="font-bold text-slate-900">Prepaid Wallet & GST Tax Invoices</div>
                        <div className="text-slate-500 text-[11px]">Instant 18% GST input credit tax invoices on every top-up</div>
                      </div>
                      <span className="font-mono font-bold text-base text-slate-900">Balance: ₹6,500.00</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                        <div>
                          <div className="font-bold text-slate-800">INV-2026-11-0024</div>
                          <div className="text-[10px] text-slate-500">Online UPI Recharge • Ref: TXN-UPI-894102</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">₹5,000.00 (₹900 GST)</div>
                          <span className="text-[10px] text-blue-600 underline font-medium cursor-pointer">Download Tax Invoice PDF</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST METRICS SECTION */}
      <section className="py-12 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Trusted by Indian Small Businesses & Enterprises
            </span>
            <p className="text-slate-600 text-xs mt-1">
              Delivering high-reliability commercial messaging across all Indian mobile network operators.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-3xl font-extrabold text-slate-900">99.8%</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Handset Delivery SLA</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Direct Tier-1 Telecom Interconnects</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-3xl font-extrabold text-slate-900">&lt; 1.8s</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Average Latency</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Ultra-fast OTP & Alert Delivery</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-3xl font-extrabold text-slate-900">10,000+</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Indian Businesses</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Retail, Coaching, Dining, Real Estate</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-3xl font-extrabold text-slate-900">100%</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">TRAI DLT & Meta Compliant</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Zero Spams • Zero Blocking Risks</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SMS MARKETING FEATURES */}
      <section id="features" className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              SMS Marketing Engine
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1.5">
              High-Speed, DLT-Approved Bulk SMS for India
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Deliver critical alerts, promotional sales, and one-time passwords across every handset in India with 100% TRAI compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 border border-blue-100">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Promotional SMS Broadcasts
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Send festival offers, end-of-season discounts, and weekend sale alerts. Automatically filters out registered DND numbers between 9:00 AM and 9:00 PM as per TRAI guidelines.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-700">
                Starting at only <span className="text-blue-600 font-bold">₹0.18 / SMS</span>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 border border-blue-100">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  24x7 Transactional & OTP SMS
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Priority routing for user login OTPs, order booking confirmations, fee reminders, and banking alerts. Delivered 24 hours a day with sub-2 second handset latency.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-700">
                Direct carrier route: <span className="text-blue-600 font-bold">&lt; 1.8s delivery</span>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 border border-blue-100">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  6-Char DLT Headers & Templates
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Send with your own custom 6-character brand header (e.g., <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-slate-800">SHRFSH</code>). Pre-verified dynamic variables with zero template rejection.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-700">
                Free DLT setup guidance included
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHATSAPP MARKETING FEATURES */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              WhatsApp Business API Cloud
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1.5">
              Engage Customers on India&apos;s Favorite App
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Over 90% of Indian mobile users read WhatsApp messages within 3 minutes. Unlock official Meta Cloud messaging with high open rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50/70 p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100">
                  <BadgeCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Verified Green Tick Profile
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Display your official company name and verified badge instead of an unknown mobile number. Build instant credibility and protect your brand identity.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-200/60 text-[11px] font-semibold text-emerald-700">
                Tier 2 & 3 High-Volume Messaging
              </div>
            </div>

            <div className="bg-slate-50/70 p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Interactive CTA & Quick Replies
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Include 1-click &quot;Buy Now&quot;, &quot;Call Store&quot;, or &quot;Book Appointment&quot; buttons right inside the chat window. Boost conversion rates up to 5x compared to plain text.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-200/60 text-[11px] font-semibold text-emerald-700">
                Up to 5x higher engagement
              </div>
            </div>

            <div className="bg-slate-50/70 p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Real-Time Read & Click Telemetry
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Track sent, delivered, read (blue double-tick), and button clicks in real time. Know exactly which customers opened your campaign and clicked your links.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-200/60 text-[11px] font-semibold text-emerald-700">
                Detailed CDR reports downloadable in CSV
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SOLUTIONS BY INDUSTRY */}
      <section id="solutions" className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Tailored Solutions
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1.5">
              Built for Every Type of Indian Business
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Whether you run a local retail boutique or manage marketing for dozens of clients, SMS Unmukt delivers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Retail & Fashion Stores",
                desc: "Send weekend flash sale alerts, new collection drops, and reward point updates directly to local shoppers.",
                example: "“Special Festive 30% OFF at Connaught Place store this weekend.”",
              },
              {
                title: "Coaching & Education Institutes",
                desc: "Broadcast exam dates, test batch schedules, student attendance alerts, and tuition fee reminders to parents.",
                example: "“JEE Mains Mock Exam scheduled for Sunday at 9:00 AM. Download admit card.”",
              },
              {
                title: "Restaurants & Dining",
                desc: "Send weekend table reservation confirmations, festive menu specials, and online ordering discount vouchers.",
                example: "“Chef’s Special Biryani Festival this Saturday. Get 20% off on dine-in.”",
              },
              {
                title: "Real Estate & Housing",
                desc: "Announce new luxury property launches, site visit bookings, and construction milestone alerts to high-net-worth buyers.",
                example: "“New 3BHK launch in Whitefield starting at ₹85 Lakhs. Schedule site visit.”",
              },
              {
                title: "Healthcare & Diagnostic Clinics",
                desc: "Automate patient appointment confirmations, lab report readiness notifications, and medicine reminders.",
                example: "“Your blood test reports are ready. Click here to download secure PDF.”",
              },
              {
                title: "Digital Marketing Agencies",
                desc: "Manage multiple client sub-accounts, allocate custom credits, set wholesale pricing, and resell messaging under your agency brand.",
                example: "“Manage 50+ business clients with dedicated billing ledgers and DLT headers.”",
              },
            ].map((sol, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{sol.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{sol.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 p-2.5 rounded-lg text-[11px] text-slate-600 italic">
                  {sol.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1.5">
              Start Reaching Customers in Under 5 Minutes
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              No complicated developer setup required. Everything is designed for Indian business owners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Create Free Account",
                desc: "Sign up with your business name and mobile number. Instantly receive ₹100 free welcome credit in your wallet.",
              },
              {
                step: "02",
                title: "Recharge Prepaid Wallet",
                desc: "Add funds securely via UPI, Net Banking, or Cards (minimum ₹500). Download your instant 18% GST tax invoice.",
              },
              {
                step: "03",
                title: "Select Contacts & Template",
                desc: "Upload contacts via CSV or choose from your audience groups. Pick an approved TRAI DLT or WhatsApp template.",
              },
              {
                step: "04",
                title: "Launch & Track Live",
                desc: "Hit send or schedule for later. Monitor handset delivery rates, WhatsApp blue ticks, and customer responses in real time.",
              },
            ].map((stepItem, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-xs relative">
                <div className="text-2xl font-black text-blue-600/30 font-mono mb-2">
                  {stepItem.step}
                </div>
                <h3 className="text-base font-bold text-slate-900">{stepItem.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{stepItem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. TRANSPARENT PRICING */}
      <section id="pricing" className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Simple Prepaid Pricing
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1.5">
              Pay As You Go. Zero Monthly Fees.
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              No contracts. No hidden setup charges. Your wallet balance never expires.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Plan 1: Promotional SMS */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Bulk Marketing
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Promotional SMS</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900">₹0.18</span>
                  <span className="text-xs text-slate-500">/ message</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  For sales alerts, discounts, and high-volume customer outreach.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600" /> TRAI DLT 6-Char Header
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600" /> Automatic National DND Filter
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600" /> 9:00 AM – 9:00 PM Delivery
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600" /> Real-time Handset Delivery CDR
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600" /> Lifetime Wallet Validity
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link href="/register" className="block">
                  <Button variant="outline" className="w-full text-xs font-semibold h-10 border-slate-300">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>

            {/* Plan 2: Transactional & OTP SMS (Featured) */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-blue-600 shadow-md flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </div>

              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  24x7 Priority
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Transactional & OTP</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900">₹0.20</span>
                  <span className="text-xs text-slate-500">/ message</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  For instant OTPs, order updates, invoices, and payment confirmations.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600" /> Sub-1.8 Second Delivery SLA
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600" /> Delivered 24 Hours / 365 Days
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600" /> Delivered to DND & Non-DND
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600" /> Direct Telecom Switching
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600" /> High Availability Fallback Route
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link href="/register" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-10 shadow-sm">
                    Start with ₹100 Bonus
                  </Button>
                </Link>
              </div>
            </div>

            {/* Plan 3: WhatsApp Business Cloud */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                  Official Meta Cloud
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">WhatsApp Marketing</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900">₹0.95</span>
                  <span className="text-xs text-slate-500">/ conversation</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Rich multimedia catalogs, discount vouchers, and interactive buttons.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Official Meta Cloud API
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Verified Green Tick Profile Ready
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> 1-Click Interactive CTA Buttons
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Image, Video & PDF Attachments
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Full Read-Receipt Analytics
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link href="/register" className="block">
                  <Button variant="outline" className="w-full text-xs font-semibold h-10 border-slate-300">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Got Questions?
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1.5">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Everything you need to know about Indian DLT compliance, WhatsApp API, and prepaid billing.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      activeFaq === idx ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FINAL CONVERSION CTA */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-5 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Instant ₹100 Free Welcome Credit Added Upon Registration</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Ready to Connect with Your Customers?
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Join 10,000+ Indian businesses driving repeat sales and higher customer engagement with SMS Unmukt.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto">
            <Link href="/register" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto px-6 h-11 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2">
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto px-6 h-11 text-sm font-semibold text-white border-slate-700 bg-slate-800/80 hover:bg-slate-800"
              >
                Login to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 11. FOOTER (NO ADMIN LINKS) */}
      <footer id="contact" className="bg-white border-t border-slate-200 text-xs text-slate-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  U
                </div>
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  SMS<span className="text-blue-600">UNMUKT</span>
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed max-w-sm text-xs">
                Next-generation telecom messaging cloud for Indian enterprises. High-speed DLT SMS and official Meta WhatsApp Cloud API marketing platform.
              </p>
              <div className="pt-2 text-slate-600 font-medium space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Nariman Point, Mumbai, Maharashtra 400021, India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href="mailto:support@smsunmukt.in" className="hover:text-blue-600">
                    support@smsunmukt.in
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>+91 80009 12345 (9:00 AM – 7:00 PM IST)</span>
                </div>
              </div>
            </div>

            {/* Products Column */}
            <div className="space-y-2.5">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Products
              </div>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <a href="#features" className="hover:text-slate-900">
                    Promotional Bulk SMS
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-slate-900">
                    24x7 OTP & Transactional SMS
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-slate-900">
                    WhatsApp Business API
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-slate-900">
                    Verified Green Tick Profiles
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-slate-900">
                    TRAI DLT 6-Char Headers
                  </a>
                </li>
              </ul>
            </div>

            {/* Solutions Column */}
            <div className="space-y-2.5">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Solutions
              </div>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <a href="#solutions" className="hover:text-slate-900">
                    Retail & Fashion Boutiques
                  </a>
                </li>
                <li>
                  <a href="#solutions" className="hover:text-slate-900">
                    Coaching & Schools
                  </a>
                </li>
                <li>
                  <a href="#solutions" className="hover:text-slate-900">
                    Restaurants & Cafes
                  </a>
                </li>
                <li>
                  <a href="#solutions" className="hover:text-slate-900">
                    Real Estate Builders
                  </a>
                </li>
                <li>
                  <a href="#solutions" className="hover:text-slate-900">
                    Digital Marketing Agencies
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal & Compliance Column */}
            <div className="space-y-2.5">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Legal & Compliance
              </div>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <a href="#terms" className="hover:text-slate-900">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="hover:text-slate-900">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#dlt" className="hover:text-slate-900">
                    TRAI TCCCPR Regulations
                  </a>
                </li>
                <li>
                  <a href="#refund" className="hover:text-slate-900">
                    Prepaid Refund Policy
                  </a>
                </li>
                <li>
                  <a href="#gst" className="hover:text-slate-900">
                    GST 18% Invoicing Rules
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Pure Copyright and Customer Links */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div>
              © {new Date().getFullYear()} SMS Unmukt Technologies Private Limited. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hover:text-slate-700">
                Customer Login
              </Link>
              <span>•</span>
              <Link href="/register" className="hover:text-slate-700">
                Free Registration
              </Link>
              <span>•</span>
              <Link href="/forgot-password" className="hover:text-slate-700">
                Password Recovery
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

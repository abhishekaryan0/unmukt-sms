"use client";

import React from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DEMO_ADMIN, DEMO_CLIENT } from "@/lib/auth";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      {/* Navigation */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              U
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">
              SMS<span className="text-blue-600">UNMUKT</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Client Login
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800">
                Super Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Designed for Indian Small Businesses, Retailers & Agencies
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            SMS & WhatsApp Marketing <br className="hidden sm:inline" />
            <span className="text-slate-600">Platform for Modern India</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            High-speed DLT-compliant SMS and official WhatsApp Business API marketing cloud.
            Built with two distinct, independent portals for platform owners and business customers.
          </p>
        </div>

        {/* Dual Portal Gateway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12 w-full">
          {/* Client Portal Card */}
          <div className="rounded-2xl border-2 border-slate-200 hover:border-slate-400 bg-white p-6 sm:p-8 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6 text-[#25D366]" />
              </div>
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Portal 1: Customer View
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Client Marketing Dashboard
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Tailored for shopkeepers, coaching centres, restaurants, and digital agencies. Send
                SMS campaigns, build rich WhatsApp messages with image and button previews, manage
                contacts, and recharge prepaid wallet with GST invoices.
              </p>

              {/* Demo Credentials */}
              <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono space-y-0.5">
                <div className="text-slate-500 text-[11px] font-sans font-semibold uppercase">
                  Client Demo Account
                </div>
                <div className="text-slate-700">Email: {DEMO_CLIENT.email}</div>
                <div className="text-slate-700">Password: {DEMO_CLIENT.password}</div>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/login" className="block">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white justify-between h-11">
                  <span>Enter Client Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Super Admin Card */}
          <div className="rounded-2xl border-2 border-slate-800 hover:border-blue-600 bg-slate-950 text-white p-6 sm:p-8 shadow-2xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Portal 2: Platform Owner View
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                Super Admin Control Plane
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Telecommunications switchboard for the platform owner. Manage customers, agencies,
                EJOIN / RouteMobile suppliers, multi-tier routing rules, profit margins, GST
                billing, and customer support tickets.
              </p>

              {/* Demo Credentials */}
              <div className="mt-5 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono space-y-0.5">
                <div className="text-slate-400 text-[11px] font-sans font-semibold uppercase">
                  Super Admin Account
                </div>
                <div className="text-slate-300">Email: {DEMO_ADMIN.email}</div>
                <div className="text-slate-300">Password: {DEMO_ADMIN.password}</div>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/admin/login" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white justify-between h-11 shadow-lg shadow-blue-600/20">
                  <span>Enter Super Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Grid Highlights */}
        <div className="mt-16 pt-12 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-slate-900">99.8%</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Telecom Delivery Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">1.2M+</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Messages Sent / Day</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">₹0.22</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Promotional SMS Starting</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">100%</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">TRAI DLT & Meta Compliant</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        SMS Unmukt Technologies India • Production-Ready B2B Frontend Application
      </footer>
    </div>
  );
}

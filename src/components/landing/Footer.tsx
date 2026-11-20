"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-xs text-slate-500 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Brand & Description Column (Cols 1-5) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <svg
                  className="w-4 h-4 text-blue-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <circle cx="9" cy="10" r="1" fill="currentColor" />
                  <circle cx="12" cy="10" r="1" fill="currentColor" />
                  <circle cx="15" cy="10" r="1" fill="currentColor" />
                </svg>
              </div>
              <span className="font-bold text-base tracking-tight text-slate-900">
                Smsunmukt
              </span>
            </Link>

            <p className="text-slate-600 leading-relaxed text-xs max-w-sm">
              The unified social messaging management platform for businesses. Centralize customer conversations, automate support workflows, and run targeted broadcast campaigns across WhatsApp, Instagram, Messenger, and Telegram.
            </p>

            <div className="pt-2 space-y-1.5 text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Nariman Point, Mumbai, Maharashtra 400021, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href="mailto:support@smsunmukt.in" className="hover:text-slate-900 transition-colors">
                  support@smsunmukt.in
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>+91 80009 12345 (9:00 AM – 7:00 PM IST)</span>
              </div>
            </div>
          </div>

          {/* Product Links (Cols 6-7) */}
          <div className="md:col-span-2 space-y-3">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Platform
            </div>
            <ul className="space-y-2 text-slate-600">
              <li>
                <a href="#features" className="hover:text-slate-900 transition-colors">
                  Unified Inbox
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-900 transition-colors">
                  Team Collaboration
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-900 transition-colors">
                  Customer Management
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-900 transition-colors">
                  Broadcast Campaigns
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-900 transition-colors">
                  Smart Automation
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-900 transition-colors">
                  Analytics & SLA
                </a>
              </li>
            </ul>
          </div>

          {/* Channels Links (Cols 8-9) */}
          <div className="md:col-span-2 space-y-3">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Channels
            </div>
            <ul className="space-y-2 text-slate-600">
              <li>
                <a href="#channels" className="hover:text-slate-900 transition-colors">
                  WhatsApp Business
                </a>
              </li>
              <li>
                <a href="#channels" className="hover:text-slate-900 transition-colors">
                  Instagram Direct
                </a>
              </li>
              <li>
                <a href="#channels" className="hover:text-slate-900 transition-colors">
                  Facebook Messenger
                </a>
              </li>
              <li>
                <a href="#channels" className="hover:text-slate-900 transition-colors">
                  Telegram Bot
                </a>
              </li>
            </ul>
          </div>

          {/* Account Access (Cols 10-12) */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Account Access
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Log in to your workspace to manage ongoing conversations, assigned tickets, and campaigns.
            </p>
            <div className="pt-1">
              {/* Single Login link - strictly no signup */}
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 font-semibold text-xs text-slate-900 bg-white border border-slate-300 px-3.5 py-2 rounded-lg hover:bg-slate-100 hover:border-slate-400 transition-all shadow-2xs"
              >
                <span>Login to Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Login Only */}
        <div className="pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {currentYear} Smsunmukt Technologies Private Limited. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-slate-900 font-medium transition-colors">
              Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

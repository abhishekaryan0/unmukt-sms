"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginClient, DEMO_CLIENT } from "@/lib/auth";
import { useToast } from "@/components/ui/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  MessageSquare,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

export default function ClientLoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    if (!emailOrPhone.trim()) {
      setError("Please enter your registered email address or 10-digit mobile number.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailOrPhone.trim(), password, portal: "client" }),
      });
      const data = await res.json();
      if (data.success && data.session) {
        localStorage.setItem("smsunmukt_client_session", JSON.stringify(data.session));
        localStorage.removeItem("smsunmukt_impersonation");
        if (typeof document !== "undefined") {
          document.cookie = `smsunmukt_client_session=${encodeURIComponent(JSON.stringify(data.session))}; path=/; max-age=604800; SameSite=Lax`;
          window.dispatchEvent(new Event("smsunmukt_auth_changed"));
        }
        toast({
          title: "Login Successful",
          message: `Welcome back, ${data.session.name}! Signed in to ${data.session.businessName}.`,
          type: "success",
        });
        router.push("/dashboard");
      } else {
        setError(data.error || "Authentication failed. Please verify your credentials.");
        toast({
          title: "Login Failed",
          message: data.error || "Invalid credentials",
          type: "error",
        });
      }
    } catch {
      // Fallback
      const result = loginClient(emailOrPhone, password);
      if (result.success) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("smsunmukt_auth_changed"));
        }
        toast({
          title: "Login Successful",
          message: "Welcome back to SMS Unmukt!",
          type: "success",
        });
        router.push("/dashboard");
      } else {
        setError(result.error || "Authentication failed. Please check credentials.");
        toast({
          title: "Login Failed",
          message: result.error,
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmailOrPhone(DEMO_CLIENT.email);
    setPassword(DEMO_CLIENT.password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-blue-100">
      {/* Top Navbar */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              U
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">
              SMS<span className="text-blue-600">UNMUKT</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">New to SMS Unmukt?</span>
            <Link href="/register">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Login Box */}
      <main className="max-w-md w-full mx-auto p-4 sm:p-6 my-auto">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100 shadow-xs">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Sign in to your account</h1>
            <p className="text-xs text-slate-500 mt-1">
              Access your SMS & WhatsApp marketing dashboard, contacts, and wallet
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address or 10-Digit Mobile
              </label>
              <Input
                type="text"
                placeholder="e.g. demo@messagehub.in or 9811234567"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-slate-600">Remember this device for 30 days</span>
              </label>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 mt-2 shadow-sm"
            >
              Sign In to Dashboard
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                Customer Demo Account
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline"
              >
                1-Click Auto-fill
              </button>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs font-mono space-y-1">
              <div className="text-slate-600">
                Login: <span className="text-slate-900 font-bold">{DEMO_CLIENT.email}</span> (or <span className="text-slate-900 font-bold">9811234567</span>)
              </div>
              <div className="text-slate-600">
                Password: <span className="text-slate-900 font-bold">{DEMO_CLIENT.password}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Register Prompt */}
        <div className="text-center mt-6 text-xs text-slate-600">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-bold underline">
            Register for free with ₹100 bonus
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200/80 bg-white">
        © {new Date().getFullYear()} SMS Unmukt Technologies Pvt Ltd. All rights reserved.
      </footer>
    </div>
  );
}

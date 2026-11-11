"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginClient, DEMO_CLIENT } from "@/lib/auth";
import { useToast } from "@/components/ui/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MessageSquare, Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";

export default function ClientLoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, portal: "client" }),
      });
      const data = await res.json();
      if (data.success && data.session) {
        localStorage.setItem("smsunmukt_client_session", JSON.stringify(data.session));
        localStorage.removeItem("smsunmukt_impersonation");
        toast({
          title: "Login Successful",
          message: `Welcome back, ${data.session.name}! Signed in to ${data.session.businessName}.`,
          type: "success",
        });
        router.push("/dashboard");
      } else {
        setError(data.error || "Authentication failed");
        toast({
          title: "Login Failed",
          message: data.error || "Invalid credentials",
          type: "error",
        });
      }
    } catch {
      // Fallback
      const result = loginClient(email, password);
      if (result.success) {
        toast({
          title: "Login Successful",
          message: "Welcome back to SMS Unmukt!",
          type: "success",
        });
        router.push("/dashboard");
      } else {
        setError(result.error || "Authentication failed");
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
    setEmail(DEMO_CLIENT.email);
    setPassword(DEMO_CLIENT.password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-900">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white mb-3 shadow-card">
            <span className="font-bold text-lg tracking-tight">U</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            SMS<span className="text-blue-600">UNMUKT</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fast SMS & WhatsApp Marketing for Indian Businesses
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-card">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-900">Sign in to your account</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your campaigns, contacts, and wallet balance
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="demo@messagehub.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">DLT Verified Portal</span>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                required
              />
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold h-10 mt-1 shadow-subtle"
            >
              Sign In to Dashboard
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Demo Credentials Box */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                Demo Credentials
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Auto-fill
              </button>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/80 text-xs font-mono space-y-1">
              <div className="text-slate-600">
                Email: <span className="text-slate-900 font-semibold">{DEMO_CLIENT.email}</span>
              </div>
              <div className="text-slate-600">
                Password: <span className="text-slate-900 font-semibold">{DEMO_CLIENT.password}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-sans mt-1">
                Account: Sharma Fashion Store (Retail & Apparel, Delhi)
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-slate-500">
          Platform Owner?{" "}
          <Link href="/admin/login" className="text-slate-700 hover:text-slate-900 underline font-semibold">
            Super Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}

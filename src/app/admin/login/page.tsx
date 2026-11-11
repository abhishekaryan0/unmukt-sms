"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin, DEMO_ADMIN } from "@/lib/auth";
import { useToast } from "@/components/ui/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Shield, Lock, Mail, ArrowRight, Server, KeyRound } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const result = loginAdmin(email, password);
      setIsLoading(false);
      if (result.success) {
        toast({
          title: "Admin Authenticated",
          message: "Welcome to SMS Unmukt Carrier Control Plane",
          type: "success",
        });
        router.push("/admin/dashboard");
      } else {
        setError(result.error || "Authentication failed");
        toast({
          title: "Access Denied",
          message: result.error,
          type: "error",
        });
      }
    }, 600);
  };

  const handleFillDemo = () => {
    setEmail(DEMO_ADMIN.email);
    setPassword(DEMO_ADMIN.password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100">
      <div className="w-full max-w-md">
        {/* Logo and Control Plane Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 mb-3.5 shadow-lg shadow-blue-500/10">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            SMS UNMUKT <span className="text-blue-500">ADMIN</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Telecom Carrier Switch & Super Administrator Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Administrator Email
              </label>
              <Input
                type="email"
                placeholder="admin@messagehub.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
                className="bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Security Passcode
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-slate-500" />}
                className="bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold h-10 mt-2 shadow-lg shadow-blue-600/20"
            >
              Sign In to Switchboard
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Demo Credentials Section */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                Demo Credentials
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium underline"
              >
                Auto-fill
              </button>
            </div>
            <div className="bg-slate-950/90 rounded-lg p-3 border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-slate-400">
                Email: <span className="text-slate-200">{DEMO_ADMIN.email}</span>
              </div>
              <div className="text-slate-400">
                Password: <span className="text-slate-200">{DEMO_ADMIN.password}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6 text-xs text-slate-500">
          Looking for customer portal?{" "}
          <Link href="/login" className="text-slate-300 hover:text-white underline font-medium">
            Go to Client Login
          </Link>
        </div>
      </div>
    </div>
  );
}

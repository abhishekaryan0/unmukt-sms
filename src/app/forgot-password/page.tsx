"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Smartphone,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
  KeyRound,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastContext";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState<"identifier" | "otp" | "success">("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hintOtp, setHintOtp] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: "", color: "bg-slate-200" };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
        return { score: 25, text: "Weak", color: "bg-rose-500" };
      case 2:
        return { score: 50, text: "Fair", color: "bg-amber-500" };
      case 3:
        return { score: 75, text: "Good", color: "bg-blue-600" };
      case 4:
        return { score: 100, text: "Strong", color: "bg-emerald-600" };
      default:
        return { score: 10, text: "Very Weak", color: "bg-rose-400" };
    }
  };

  const strength = getPasswordStrength(newPassword);

  // Step 1: Request OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError("Please enter your registered email address or mobile number.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_otp", identifier: identifier.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: "Verification Code Sent",
          message: data.message || "Please check your mobile / email.",
          type: "success",
        });
        if (data.hintOtp) setHintOtp(data.hintOtp);
        setStep("otp");
      } else {
        setError(data.error || "Account not found with this identifier.");
      }
    } catch {
      setError("Failed to connect to authentication server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset Password with OTP
  const handleResetPassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    if (!otp || otp.trim().length !== 6) {
      setError("Please enter the 6-digit verification code sent to you.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset_password",
          identifier: identifier.trim(),
          otp: otp.trim(),
          newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: "Password Updated",
          message: "Your new password has been set. You can now sign in.",
          type: "success",
        });
        setStep("success");
      } else {
        setError(data.error || "Failed to reset password. Please check your OTP.");
      }
    } catch {
      setError("An error occurred during password reset. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-blue-100">
      {/* Top Simple Header */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              U
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">
              SMS<span className="text-blue-600">UNMUKT</span>
            </span>
          </Link>

          <Link
            href="/login"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md w-full mx-auto p-4 sm:p-6 my-auto">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {step === "identifier" && (
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 border border-blue-100 shadow-sm">
                <KeyRound className="w-6 h-6 text-blue-600" />
              </div>

              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Recover your account
              </h1>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Enter your registered business email or 10-digit mobile number. We will send you a 6-digit verification code.
              </p>

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleRequestOtp} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address or Mobile Number
                  </label>
                  <Input
                    placeholder="demo@messagehub.in or 9811234567"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                    required
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Accepts Indian mobile number (+91) or your account email.
                  </span>
                </div>

                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 shadow-sm"
                >
                  Send Verification Code
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </form>
            </div>
          )}

          {step === "otp" && (
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>

              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Enter verification code
              </h1>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                We sent a 6-digit code for account{" "}
                <strong className="text-slate-800">{identifier}</strong>.
              </p>

              {hintOtp && (
                <div className="mt-3 p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center justify-between">
                  <span>Demo OTP Verification Code:</span>
                  <button
                    type="button"
                    onClick={() => setOtp(hintOtp)}
                    className="font-mono font-bold tracking-wider underline hover:text-blue-950"
                  >
                    {hintOtp} (Fill)
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    6-Digit Verification Code (OTP)
                  </label>
                  <Input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    leftIcon={<KeyRound className="w-4 h-4 text-slate-400" />}
                    className="tracking-widest font-mono text-center text-sm font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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

                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strength.color} transition-all duration-300`}
                          style={{ width: `${strength.score}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 flex justify-between">
                        <span>Strength: {strength.text}</span>
                        <span>Min 6 characters</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 shadow-sm"
                >
                  Reset Password & Continue
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("identifier");
                      setError("");
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Change Email / Mobile Number
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Password Reset Successfully!
              </h2>
              <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                Your account password has been updated securely. You can now log in using your new credentials.
              </p>

              <div className="mt-6">
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold h-10 shadow-sm"
                >
                  Sign In to Customer Dashboard
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6 text-xs text-slate-500">
          Need help? Contact our Indian support team at{" "}
          <a href="mailto:support@smsunmukt.in" className="text-blue-600 hover:underline font-medium">
            support@smsunmukt.in
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200/80 bg-white">
        © {new Date().getFullYear()} SMS Unmukt Technologies Pvt Ltd. All rights reserved.
      </footer>
    </div>
  );
}

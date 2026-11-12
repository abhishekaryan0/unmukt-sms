"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Receipt,
  Check,
  ChevronRight,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastContext";

const INDIAN_STATES = [
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "Uttar Pradesh",
  "Rajasthan",
  "Telangana",
  "West Bengal",
  "Madhya Pradesh",
  "Haryana",
  "Punjab",
  "Kerala",
  "Bihar",
  "Andhra Pradesh",
  "Odisha",
  "Assam",
  "Goa",
  "Jharkhand",
  "Uttarakhand",
  "Chhattisgarh",
  "Himachal Pradesh",
  "Other",
];

const BUSINESS_CATEGORIES = [
  "Retail & Apparel",
  "Education & Coaching",
  "Hospitality & Dining",
  "Real Estate & Construction",
  "Healthcare & Clinics",
  "Consumer Electronics",
  "Automotive & Garage",
  "Digital Marketing Agency",
  "Financial Services & CA",
  "Beauty & Wellness",
  "E-Commerce & D2C",
  "Logistics & Transport",
  "Other Business",
];

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Form Fields
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessCategory, setBusinessCategory] = useState("Retail & Apparel");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [state, setState] = useState("Maharashtra");
  const [gstin, setGstin] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Verification UI State
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [isVerifyingMobile, setIsVerifyingMobile] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [sentOtpCode, setSentOtpCode] = useState("729401");

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState<any | null>(null);

  // Password strength gauge
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

  const strength = getPasswordStrength(password);

  // Mobile verification trigger
  const handleTriggerMobileVerification = () => {
    const clean = mobile.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(clean)) {
      toast({
        title: "Invalid Mobile Number",
        message: "Please enter a valid 10-digit Indian mobile number to verify.",
        type: "error",
      });
      return;
    }

    setIsVerifyingMobile(true);
    setTimeout(() => {
      setIsVerifyingMobile(false);
      setShowOtpModal(true);
      setSentOtpCode("830192");
      toast({
        title: "OTP Dispatched",
        message: `6-digit verification code sent to +91 ${clean}`,
        type: "info",
      });
    }, 600);
  };

  const handleVerifyOtp = () => {
    if (mobileOtp.trim() === sentOtpCode || mobileOtp.trim() === "123456" || mobileOtp.trim().length === 6) {
      setIsMobileVerified(true);
      setShowOtpModal(false);
      toast({
        title: "Mobile Verified",
        message: "Your Indian mobile number has been verified successfully.",
        type: "success",
      });
    } else {
      toast({
        title: "Invalid OTP",
        message: "Please enter the 6-digit code shown in the test prompt.",
        type: "error",
      });
    }
  };

  // Submission handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validations
    if (!businessName.trim() || !ownerName.trim() || !email.trim() || !mobile.trim()) {
      setError("Please fill in all required business information.");
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setError("Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (!agreeTerms) {
      setError("Please accept the Terms of Service & Privacy Policy to create your account.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        email: email.trim().toLowerCase(),
        mobile: cleanMobile,
        password: password.trim(),
        businessCategory,
        city: city.trim() || "Mumbai",
        state: state.trim() || "Maharashtra",
        gstin: gstin.trim() || undefined,
        initialWallet: 100, // ₹100 Free Welcome Credit
      };

      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.data) {
        setRegistrationSuccess(data.data);
        toast({
          title: "Account Created Successfully!",
          message: `Welcome to SMS Unmukt, ${ownerName}! ₹100 welcome credit has been added.`,
          type: "success",
        });
      } else {
        setError(data.error || "Failed to complete business registration.");
      }
    } catch {
      setError("Could not connect to registration server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-blue-100">
      {/* Top Navbar */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              U
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">
              SMS<span className="text-blue-600">UNMUKT</span>
            </span>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-500 hidden sm:inline">Already have an account?</span>
            <Link href="/login">
              <Button variant="outline" size="sm" className="font-semibold text-slate-800 border-slate-300">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full flex items-center justify-center">
        {registrationSuccess ? (
          /* Post-Registration Success Onboarding Screen */
          <div className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 border border-emerald-100">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>₹100 Welcome Credit Loaded</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Registration Complete!
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              Your business account for <strong className="text-slate-900">{registrationSuccess.businessName}</strong> has been provisioned on the telecom gateway.
            </p>

            {/* Account Profile Summary Card */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Customer ID</span>
                <span className="font-mono font-bold text-slate-900">{registrationSuccess.id}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Registered Email</span>
                <span className="font-semibold text-slate-800">{registrationSuccess.email}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Mobile Number</span>
                <span className="font-mono font-semibold text-slate-800">+91 {registrationSuccess.mobile}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Business Category</span>
                <span className="font-medium text-slate-800">{registrationSuccess.businessCategory}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">DLT Entity ID</span>
                <span className="font-mono text-slate-700">{registrationSuccess.dltEntityId}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <Link href="/login" className="w-full sm:flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 shadow-sm">
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full max-w-6xl items-start">
            {/* Left Column: Brand & Trust Proof */}
            <div className="lg:col-span-5 space-y-6 pt-2">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  Instant Activation • 100% TRAI DLT Compliant
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Start Sending SMS & WhatsApp in Minutes
                </h1>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Join 10,000+ Indian retail shops, schools, coaching centres, restaurants, and digital agencies growing with SMS Unmukt.
                </p>
              </div>

              {/* Perks List */}
              <div className="space-y-3.5 pt-2">
                {[
                  {
                    title: "₹100 Free Welcome Bonus",
                    desc: "Test SMS and WhatsApp dispatches immediately upon signing up.",
                  },
                  {
                    title: "Official Meta Cloud WhatsApp API",
                    desc: "Verified Green Tick ready with interactive quick-reply buttons.",
                  },
                  {
                    title: "100% TRAI DLT Compliance Support",
                    desc: "Full guidance for Jio, Airtel, and Vi sender header approvals.",
                  },
                  {
                    title: "GST Tax Invoices for Business Input Credit",
                    desc: "Download instant 18% GST receipts on every prepaid recharge.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-normal">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Testimonial Snippet */}
              <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-700 space-y-2">
                <p className="italic">
                  “We migrated our fashion store campaigns to SMS Unmukt. Weekend sales alerts on WhatsApp brought us a 34% surge in footfalls with zero template rejection.”
                </p>
                <div className="font-semibold text-slate-900 text-[11px]">
                  — Rajesh Sharma, Sharma Fashion Store (Central Delhi)
                </div>
              </div>
            </div>

            {/* Right Column: Multi-Section Registration Form */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Create your business account
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your company details to set up your marketing control panel
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5 text-xs">
                {/* Section 1: Business Basics */}
                <div className="space-y-3.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    1. Business Identification
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Business Name <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        placeholder="e.g. Apex Coaching Institute"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        leftIcon={<Building2 className="w-4 h-4 text-slate-400" />}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Authorized Contact Person <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        placeholder="e.g. Dr. Ramesh Verma"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        leftIcon={<User className="w-4 h-4 text-slate-400" />}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Business Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    >
                      {BUSINESS_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Section 2: Contact & Verification */}
                <div className="space-y-3.5 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    2. Contact & Verification
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Business Email <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="email"
                        placeholder="contact@apexcoaching.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-slate-700">
                          Mobile Number <span className="text-rose-500">*</span>
                        </label>
                        {isMobileVerified ? (
                          <span className="text-[10px] text-emerald-600 font-bold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleTriggerMobileVerification}
                            disabled={isVerifyingMobile}
                            className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold underline"
                          >
                            {isVerifyingMobile ? "Sending OTP..." : "Verify Mobile"}
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-semibold">
                          +91
                        </div>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="9876543210"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                          className="w-full h-10 pl-11 pr-3 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Location & GSTIN */}
                <div className="space-y-3.5 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    3. Address & Taxation (Optional)
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        placeholder="e.g. Jaipur"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        State <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        GSTIN (Optional)
                      </label>
                      <Input
                        placeholder="08AAAAA0000A1Z5"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        leftIcon={<Receipt className="w-4 h-4 text-slate-400" />}
                        maxLength={15}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Security Password */}
                <div className="space-y-3.5 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    4. Account Password
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Min 6 characters"
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

                      {password && (
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
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirm Password <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      required
                    />
                    <span className="text-xs text-slate-600 leading-normal">
                      I agree to the{" "}
                      <a href="#terms" className="text-blue-600 hover:underline font-medium">
                        Terms of Service
                      </a>
                      ,{" "}
                      <a href="#privacy" className="text-blue-600 hover:underline font-medium">
                        Privacy Policy
                      </a>
                      , and TRAI DLT Commercial Messaging Regulations.
                    </span>
                  </label>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 text-sm shadow-sm transition-all"
                  >
                    <span>Create Free Account & Claim ₹100 Bonus</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-elevated">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-6 h-6 text-blue-600" />
            </div>

            <h3 className="text-center font-bold text-slate-900 text-base">
              Verify Mobile Number
            </h3>
            <p className="text-center text-xs text-slate-500 mt-1">
              Enter the 6-digit verification code sent to +91 {mobile.slice(-10)}
            </p>

            <div className="my-4 p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs text-center">
              <span>Test OTP Code: </span>
              <strong className="font-mono text-sm underline cursor-pointer" onClick={() => setMobileOtp(sentOtpCode)}>
                {sentOtpCode}
              </strong>
            </div>

            <div className="space-y-3">
              <Input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={mobileOtp}
                onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, ""))}
                className="text-center font-mono text-base font-bold tracking-widest"
              />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowOtpModal(false)}
                  className="flex-1 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleVerifyOtp}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                >
                  Confirm & Verify
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200/80 bg-white">
        © {new Date().getFullYear()} SMS Unmukt Technologies Pvt Ltd. All rights reserved.
      </footer>
    </div>
  );
}

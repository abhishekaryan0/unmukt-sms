"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { formatINR, formatNumber, formatDate, formatIndianMobile } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Customer } from "@/types";
import {
  Users,
  UserPlus,
  Eye,
  EyeOff,
  ShieldAlert,
  ShieldCheck,
  Wallet,
  Megaphone,
  MoreVertical,
  CheckCircle2,
  XCircle,
  LogIn,
  Building2,
  Lock,
  KeyRound,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";

export default function AdminCustomersPage() {
  const router = useRouter();
  const { customers, updateCustomerStatus, manualCustomerWalletAdjustment, switchActiveCustomer, addCustomer } =
    useAppStore();
  const { toast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Wallet adjustment modal
  const [walletCust, setWalletCust] = useState<Customer | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustType, setAdjustType] = useState<"credit" | "debit">("credit");
  const [adjustNote, setAdjustNote] = useState("");

  // Onboard Customer modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCust, setNewCust] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    mobile: "",
    password: "",
    businessCategory: "Retail & Apparel",
    city: "Mumbai",
    state: "Maharashtra",
    gstin: "",
    dltEntityId: "",
    initialWallet: "500",
  });

  // Success credentials modal
  const [createdCredentials, setCreatedCredentials] = useState<{
    businessName: string;
    ownerName: string;
    email: string;
    password: string;
    mobile: string;
    loginUrl: string;
    id: string;
    walletBalance: number;
  } | null>(null);
  const [hasCopiedCreds, setHasCopiedCreds] = useState(false);

  const filteredCustomers = customers.filter((c) => {
    if (categoryFilter !== "all" && c.businessCategory !== categoryFilter) return false;
    if (statusFilter !== "all" && c.accountStatus !== statusFilter) return false;
    return true;
  });

  const handleToggleStatus = (cust: Customer) => {
    const newStatus = cust.accountStatus === "active" ? "suspended" : "active";
    updateCustomerStatus(cust.id, newStatus);
    toast({
      title: `Customer ${newStatus === "active" ? "Activated" : "Suspended"}`,
      message: `${cust.businessName} account status set to ${newStatus}.`,
      type: newStatus === "active" ? "success" : "error",
    });
  };

  const handleLoginAsCustomer = (cust: Customer) => {
    switchActiveCustomer(cust.id);
    toast({
      title: "Workspace Activated",
      message: `Impersonating ${cust.businessName}. Redirecting to client dashboard...`,
      type: "success",
    });
    router.push("/dashboard");
  };

  const handleGeneratePassword = () => {
    const prefixes = ["Biz", "Market", "Growth", "Unmukt", "Client", "Store"];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const generated = `${randomPrefix}@${randomDigits}`;
    setNewCust((prev) => ({ ...prev, password: generated }));
    toast({
      title: "Strong Password Generated",
      message: `Assigned: ${generated}`,
      type: "info",
    });
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.businessName || !newCust.ownerName || !newCust.email || !newCust.mobile) {
      toast({ title: "Missing Fields", message: "Please fill all required fields", type: "error" });
      return;
    }

    setIsSubmitting(true);
    const passwordToUse = newCust.password.trim() || `Client@${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await addCustomer({
        businessName: newCust.businessName.trim(),
        ownerName: newCust.ownerName.trim(),
        email: newCust.email.trim(),
        mobile: newCust.mobile.trim(),
        password: passwordToUse,
        businessCategory: newCust.businessCategory,
        city: newCust.city.trim() || "Mumbai",
        state: newCust.state.trim() || "Maharashtra",
        gstin: newCust.gstin.trim() || undefined,
        dltEntityId: newCust.dltEntityId.trim() || `17011${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        walletBalance: parseFloat(newCust.initialWallet) || 500,
        accountStatus: "active",
      });

      setShowAddModal(false);

      // Pop up the credentials card so admin can immediately copy or share it
      setCreatedCredentials({
        businessName: newCust.businessName.trim(),
        ownerName: newCust.ownerName.trim(),
        email: newCust.email.trim().toLowerCase(),
        password: res.credentials?.password || passwordToUse,
        mobile: newCust.mobile.trim(),
        loginUrl: "/login",
        id: res.customer?.id || `cust-${Date.now().toString().slice(-4)}`,
        walletBalance: parseFloat(newCust.initialWallet) || 500,
      });

      setNewCust({
        businessName: "",
        ownerName: "",
        email: "",
        mobile: "",
        password: "",
        businessCategory: "Retail & Apparel",
        city: "Mumbai",
        state: "Maharashtra",
        gstin: "",
        dltEntityId: "",
        initialWallet: "500",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const text = `🎉 Welcome to SMS & WhatsApp Marketing Platform!

Your business account has been provisioned:
🏢 Business: ${createdCredentials.businessName}
👤 Account Owner: ${createdCredentials.ownerName}
🌐 Client Portal: ${origin}/login
📧 Login Email: ${createdCredentials.email}
📱 Mobile: +91 ${createdCredentials.mobile}
🔑 Password: ${createdCredentials.password}
💰 Welcome Prepaid Balance: ₹${createdCredentials.walletBalance.toFixed(2)}

Please login and configure your TRAI DLT Sender Headers and WhatsApp templates.`;

    navigator.clipboard.writeText(text);
    setHasCopiedCreds(true);
    setTimeout(() => setHasCopiedCreds(false), 2500);
    toast({
      title: "Credentials Copied!",
      message: "Ready to share with the customer via WhatsApp or Email.",
      type: "success",
    });
  };

  const handleApplyWalletAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletCust) return;
    const amt = parseFloat(adjustAmount);
    if (!amt || amt <= 0) {
      toast({ title: "Invalid Amount", message: "Enter valid adjustment amount", type: "error" });
      return;
    }

    manualCustomerWalletAdjustment(
      walletCust.id,
      amt,
      adjustType,
      adjustNote.trim() || "Admin Balance Adjustment"
    );

    toast({
      title: `Wallet Adjusted (${adjustType.toUpperCase()})`,
      message: `${formatINR(amt)} ${
        adjustType === "credit" ? "credited to" : "debited from"
      } ${walletCust.businessName}.`,
      type: "success",
    });

    setWalletCust(null);
    setAdjustAmount("");
    setAdjustNote("");
  };

  const columns: Column<Customer>[] = [
    {
      header: "Customer ID",
      accessorKey: "id",
      className: "whitespace-nowrap",
      cell: (row) => (
        <Link
          href={`/admin/customers/${row.id}`}
          className="font-mono text-xs font-bold text-blue-600 hover:underline"
        >
          {row.id}
        </Link>
      ),
    },
    {
      header: "Business Name",
      accessorKey: "businessName",
      className: "min-w-[180px]",
      cell: (row) => (
        <div>
          <Link
            href={`/admin/customers/${row.id}`}
            className="font-bold text-slate-900 hover:text-blue-600 hover:underline"
          >
            {row.businessName}
          </Link>
          <div className="text-[11px] text-slate-500">
            {row.city}, {row.state}
          </div>
        </div>
      ),
    },
    {
      header: "Owner",
      accessorKey: "ownerName",
      className: "min-w-[160px]",
      cell: (row) => (
        <div>
          <div className="font-medium text-slate-900">{row.ownerName}</div>
          <div className="text-[11px] text-slate-500">{row.email}</div>
        </div>
      ),
    },
    {
      header: "Mobile",
      accessorKey: "mobile",
      className: "whitespace-nowrap",
      cell: (row) => (
        <span className="font-mono text-slate-800 text-xs">
          {formatIndianMobile(row.mobile)}
        </span>
      ),
    },
    {
      header: "Category",
      accessorKey: "businessCategory",
      className: "whitespace-nowrap",
      cell: (row) => (
        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {row.businessCategory}
        </span>
      ),
    },
    {
      header: "Wallet Balance",
      accessorKey: "walletBalance",
      className: "whitespace-nowrap",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-900">{formatINR(row.walletBalance)}</span>
          <button
            onClick={() => setWalletCust(row)}
            className="p-1 rounded text-blue-600 hover:bg-blue-50 transition-colors"
            title="Adjust Wallet Balance"
          >
            <Wallet className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
    {
      header: "Total Msgs",
      accessorKey: "totalMessages",
      className: "whitespace-nowrap",
      cell: (row) => (
        <span className="font-semibold text-slate-700">{formatNumber(row.totalMessages)}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "accountStatus",
      className: "whitespace-nowrap",
      cell: (row) => <StatusBadge status={row.accountStatus} />,
    },
    {
      header: "Registered",
      accessorKey: "registrationDate",
      className: "whitespace-nowrap",
      cell: (row) => <span className="text-slate-500 text-[11px]">{formatDate(row.registrationDate, false)}</span>,
    },
    {
      header: "Actions",
      className: "min-w-[320px] text-right pr-5",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLoginAsCustomer(row)}
            className="h-7.5 px-2.5 text-xs bg-amber-50/80 hover:bg-amber-100/90 text-amber-900 border-amber-300/80 font-medium gap-1.5 whitespace-nowrap shrink-0 shadow-none transition-colors"
            title="Log in to customer portal as this business"
          >
            <LogIn className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Login as Client</span>
          </Button>

          <Link href={`/admin/customers/${row.id}`} className="inline-flex shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="h-7.5 px-2.5 text-xs text-slate-700 hover:text-slate-900 border-slate-300 gap-1.5 whitespace-nowrap shrink-0 shadow-none transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>View</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleStatus(row)}
            className={`h-7.5 px-2.5 text-xs font-medium gap-1.5 whitespace-nowrap shrink-0 shadow-none transition-colors ${
              row.accountStatus === "active"
                ? "border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300"
            }`}
            title={row.accountStatus === "active" ? "Suspend Customer Account" : "Activate Customer Account"}
          >
            {row.accountStatus === "active" ? (
              <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            )}
            <span>{row.accountStatus === "active" ? "Suspend" : "Activate"}</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Customer Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage Indian business accounts, prepaid balances, TRAI DLT verification, and switch workspaces
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} size="sm">
          <UserPlus className="w-3.5 h-3.5 mr-1.5" />
          Onboard New Customer
        </Button>
      </div>

      <DataTable
        data={filteredCustomers}
        columns={columns}
        searchPlaceholder="Search customer, business, mobile..."
        tableClassName="min-w-[1250px]"
        filters={
          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Categories</option>
              <option value="Retail & Apparel">Retail & Apparel</option>
              <option value="Consumer Electronics">Consumer Electronics</option>
              <option value="Education & Coaching">Education & Coaching</option>
              <option value="Hospitality & Dining">Hospitality & Dining</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Digital Marketing Agency">Digital Marketing Agency</option>
              <option value="Healthcare & Labs">Healthcare & Labs</option>
              <option value="F&B & Retail">F&B & Retail</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
            </select>
          </div>
        }
      />

      {/* Onboard Customer Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        size="md"
        title="Onboard New Business Customer"
        description="Provision a verified business account with Indian DLT credentials and initial prepaid credits."
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business / Legal Name *
              </label>
              <Input
                placeholder="e.g. Verma Sweets & Dairy"
                value={newCust.businessName}
                onChange={(e) => setNewCust({ ...newCust, businessName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Owner / Authorized Person *
              </label>
              <Input
                placeholder="e.g. Vikram Verma"
                value={newCust.ownerName}
                onChange={(e) => setNewCust({ ...newCust, ownerName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <Input
                type="email"
                placeholder="owner@business.com"
                value={newCust.email}
                onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number (+91) *
              </label>
              <Input
                type="tel"
                placeholder="9812345678"
                value={newCust.mobile}
                onChange={(e) => setNewCust({ ...newCust, mobile: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Client Portal Authentication Credentials */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <KeyRound className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Client Portal Login Credentials</span>
              </div>
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span>Auto-Generate Password</span>
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Login Password *
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="e.g. Shopkeeper@123 (or auto-generate)"
                  value={newCust.password}
                  onChange={(e) => setNewCust({ ...newCust, password: e.target.value })}
                  leftIcon={<Lock className="w-3.5 h-3.5 text-slate-400" />}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                  tabIndex={-1}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                The business owner can login at <span className="font-mono text-slate-700 font-semibold">/login</span> using their email (or phone number) with this password. If left blank, a secure temporary passcode will be assigned.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={newCust.businessCategory}
                onChange={(e) => setNewCust({ ...newCust, businessCategory: e.target.value })}
                className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="Retail & Apparel">Retail & Apparel</option>
                <option value="Consumer Electronics">Consumer Electronics</option>
                <option value="Education & Coaching">Education & Coaching</option>
                <option value="Hospitality & Dining">Hospitality & Dining</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Digital Marketing Agency">Digital Marketing Agency</option>
                <option value="Healthcare & Labs">Healthcare & Labs</option>
                <option value="F&B & Retail">F&B & Retail</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City
              </label>
              <Input
                placeholder="Mumbai"
                value={newCust.city}
                onChange={(e) => setNewCust({ ...newCust, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State
              </label>
              <Input
                placeholder="Maharashtra"
                value={newCust.state}
                onChange={(e) => setNewCust({ ...newCust, state: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GSTIN (Optional)
              </label>
              <Input
                placeholder="27AABCU9603R1ZM"
                value={newCust.gstin}
                onChange={(e) => setNewCust({ ...newCust, gstin: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                TRAI DLT Entity ID
              </label>
              <Input
                placeholder="Auto-assigned if empty"
                value={newCust.dltEntityId}
                onChange={(e) => setNewCust({ ...newCust, dltEntityId: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Wallet Credit (₹)
              </label>
              <Input
                type="number"
                placeholder="500"
                value={newCust.initialWallet}
                onChange={(e) => setNewCust({ ...newCust, initialWallet: e.target.value })}
                leftIcon={<span className="text-xs font-bold text-slate-500">₹</span>}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="bg-slate-900 text-white gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Onboard & Provision Account</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* Onboarding Success & Credentials Card Modal */}
      <Modal
        isOpen={!!createdCredentials}
        onClose={() => setCreatedCredentials(null)}
        size="md"
        title="Customer Provisioned & Credentials Ready"
        description="Login credentials have been created in the database and are ready to be shared with the client."
      >
        {createdCredentials && (
          <div className="space-y-4 text-xs">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-950 text-sm">
                  {createdCredentials.businessName} is Active!
                </h4>
                <p className="text-emerald-800 text-xs mt-0.5">
                  Authorized Owner: <span className="font-semibold">{createdCredentials.ownerName}</span> • Initial Balance: <span className="font-semibold">{formatINR(createdCredentials.walletBalance)}</span>
                </p>
              </div>
            </div>

            <div className="bg-slate-900 text-slate-100 rounded-xl p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400 font-sans text-[11px] uppercase tracking-wider font-semibold">
                  Client Portal Access
                </span>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded text-[10px] font-sans font-semibold">
                  Active in DB
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Portal URL:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-200 select-all font-semibold">
                      {typeof window !== "undefined" ? `${window.location.origin}/login` : "http://localhost:3000/login"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const url = typeof window !== "undefined" ? `${window.location.origin}/login` : "http://localhost:3000/login";
                        navigator.clipboard.writeText(url);
                        toast({ title: "Copied", message: "Portal URL copied", type: "success" });
                      }}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Copy URL"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Login Email:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400 select-all font-semibold">{createdCredentials.email}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(createdCredentials.email);
                        toast({ title: "Copied", message: "Email copied", type: "success" });
                      }}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Copy Email"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Login Mobile:</span>
                  <span className="text-slate-200 select-all font-semibold">+91 {createdCredentials.mobile}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400">Password:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold select-all text-sm tracking-wider">
                      {createdCredentials.password}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(createdCredentials.password);
                        toast({ title: "Copied", message: "Password copied", type: "success" });
                      }}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Copy Password"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCredentials}
                className="gap-1.5 text-xs font-semibold border-slate-300"
              >
                {hasCopiedCreds ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied Welcome Msg!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copy Full Welcome Message</span>
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCreatedCredentials(null)}
                  className="text-xs"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    switchActiveCustomer(createdCredentials.id);
                    setCreatedCredentials(null);
                    router.push("/dashboard");
                  }}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-700" />
                  <span>Login as Client Now</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Manual Wallet Adjustment Modal */}
      <Modal
        isOpen={!!walletCust}
        onClose={() => setWalletCust(null)}
        size="sm"
        title="Manual Wallet Adjustment"
        description={`Customer: ${walletCust?.businessName} (${formatINR(
          walletCust?.walletBalance || 0
        )})`}
      >
        <form onSubmit={handleApplyWalletAdjustment} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Adjustment Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAdjustType("credit")}
                className={`py-2 px-3 rounded-lg border font-semibold transition-all ${
                  adjustType === "credit"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                + Credit Balance
              </button>
              <button
                type="button"
                onClick={() => setAdjustType("debit")}
                className={`py-2 px-3 rounded-lg border font-semibold transition-all ${
                  adjustType === "debit"
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                - Debit Balance
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amount (INR) *
            </label>
            <Input
              type="number"
              placeholder="e.g. 500"
              value={adjustAmount}
              onChange={(e) => setAdjustAmount(e.target.value)}
              leftIcon={<span className="text-xs font-bold text-slate-500">₹</span>}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Audit Note / Reference *
            </label>
            <Input
              placeholder="e.g. DLT registration refund or promo voucher"
              value={adjustNote}
              onChange={(e) => setAdjustNote(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setWalletCust(null)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-slate-900 text-white">
              Apply Adjustment
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

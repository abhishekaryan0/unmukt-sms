"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import {
  calculateSMSSegments,
  formatINR,
  formatNumber,
  validateIndianMobile,
} from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { RechargeModal } from "@/components/client/RechargeModal";
import {
  Send,
  Upload,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Smartphone,
  Calendar,
  Clock,
  Sparkles,
  Info,
  ChevronRight,
  ChevronLeft,
  Trash2,
} from "lucide-react";

export default function SendSMSPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    activeCustomer,
    clientWalletBalance,
    templates,
    contactGroups,
    contacts,
    createCampaign,
    sendTestMessage,
  } = useAppStore();

  const [step, setStep] = useState<number>(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Test send state
  const [showTestModal, setShowTestModal] = useState(false);
  const [testNumber, setTestNumber] = useState(activeCustomer?.mobile || "9811234567");
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Form State
  const [campaignName, setCampaignName] = useState("Festive Weekend Mega Sale");
  const [smsType, setSmsType] = useState<"promotional" | "transactional">("promotional");
  const [senderHeader, setSenderHeader] = useState("SHRFSH");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  // Step 2: Recipients
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(["grp-01", "grp-02"]);
  const [manualNumbers, setManualNumbers] = useState("");
  const [uploadedFileStats, setUploadedFileStats] = useState<{ filename: string; count: number } | null>(null);

  // Step 3: Message
  const [messageText, setMessageText] = useState(
    "New Arrival Alert! Exclusive Silk Sarees & Ethnic Kurtis now in stock at Sharma Fashion Store Delhi. Visit today & get flat 20% off! - SHRFSH"
  );

  // Step 4/5: Schedule
  const [sendSchedule, setSendSchedule] = useState<"now" | "later">("now");
  const [scheduleDate, setScheduleDate] = useState("");

  // SMS templates
  const smsApprovedTemplates = templates.filter((t) => t.channel === "sms");

  // Character calculation
  const smsCalc = useMemo(() => calculateSMSSegments(messageText), [messageText]);

  // Recipient calculation
  const { totalRecipients, uniqueNumbers } = useMemo(() => {
    const numbersSet = new Set<string>();

    // From groups
    selectedGroupIds.forEach((gid) => {
      const grp = contactGroups.find((g) => g.id === gid);
      if (grp) {
        // Find contacts in this group
        const groupContacts = contacts.filter((c) => c.group === grp.name);
        groupContacts.forEach((c) => {
          if (validateIndianMobile(c.mobile)) numbersSet.add(c.mobile);
        });
        // Also simulate full group count if higher
        const simulatedFill = Math.max(0, grp.contactCount - groupContacts.length);
        for (let i = 0; i < simulatedFill; i++) {
          numbersSet.add(`98${gid.slice(-2)}${String(i).padStart(6, "0")}`);
        }
      }
    });

    // From manual numbers
    if (manualNumbers.trim()) {
      const raw = manualNumbers.split(/[\n,;]+/);
      raw.forEach((num) => {
        const cleaned = num.replace(/\D/g, "");
        if (validateIndianMobile(cleaned)) {
          numbersSet.add(cleaned.slice(-10));
        }
      });
    }

    // From uploaded CSV
    if (uploadedFileStats) {
      for (let i = 0; i < uploadedFileStats.count; i++) {
        numbersSet.add(`9910${String(i).padStart(6, "0")}`);
      }
    }

    const count = numbersSet.size || 0;
    return {
      totalRecipients: count,
      uniqueNumbers: Array.from(numbersSet),
    };
  }, [selectedGroupIds, manualNumbers, uploadedFileStats, contactGroups, contacts]);

  // Pricing calculation
  const pricePerUnit = smsType === "promotional" ? 0.22 : 0.25;
  const segmentsPerRecipient = Math.max(1, smsCalc.segments);
  const totalSMSUnits = totalRecipients * segmentsPerRecipient;
  const estimatedCost = Number((totalSMSUnits * pricePerUnit).toFixed(2));
  const hasEnoughBalance = clientWalletBalance >= estimatedCost;

  // Handlers
  const handleTemplateSelect = (tplId: string) => {
    setSelectedTemplateId(tplId);
    const tpl = smsApprovedTemplates.find((t) => t.id === tplId);
    if (tpl) {
      setMessageText(tpl.content);
      if (tpl.senderId) setSenderHeader(tpl.senderId);
      if (tpl.category === "transactional") setSmsType("transactional");
    }
  };

  const handleGroupToggle = (id: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleMockFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileStats({
        filename: file.name,
        count: 500, // Simulated valid numbers from file
      });
      toast({
        title: "Contact List Uploaded",
        message: `Parsed 500 valid Indian mobile numbers from ${file.name}`,
        type: "success",
      });
    }
  };

  const handleSendCampaign = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const res = createCampaign({
        campaignName,
        customerId: activeCustomer?.id || "cust-01",
        customerName: activeCustomer?.businessName || "Sharma Fashion Store",
        channel: "sms",
        messageType: smsType,
        totalRecipients: Math.max(1, totalRecipients),
        cost: estimatedCost,
        status: sendSchedule === "now" ? "completed" : "scheduled",
        scheduledDate: sendSchedule === "later" ? scheduleDate : undefined,
        messageContent: messageText,
        senderId: senderHeader,
        templateId: selectedTemplateId || "DLT-CUSTOM",
      });

      setIsSubmitting(false);
      setShowConfirm(false);

      if (res.success) {
        toast({
          title: "Campaign Broadcast Dispatched! 🚀",
          message: `${formatNumber(
            totalRecipients
          )} SMS sent via Route Mobile & EJOIN carriers. Cost: ${formatINR(estimatedCost)}`,
          type: "success",
        });
        router.push("/campaigns");
      } else {
        toast({
          title: "Sending Failed",
          message: res.error,
          type: "error",
        });
      }
    }, 1200);
  };

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = testNumber.replace(/\D/g, "").slice(-10);
    if (cleanNum.length !== 10) {
      toast({
        title: "Invalid Mobile Number",
        message: "Enter a valid 10-digit Indian mobile number for test preview.",
        type: "error",
      });
      return;
    }

    setIsSendingTest(true);
    setTimeout(() => {
      sendTestMessage(cleanNum, "sms", messageText);
      setIsSendingTest(false);
      setShowTestModal(false);
      toast({
        title: "Test SMS Dispatched! 📲",
        message: `Carrier simulation routed via ${senderHeader} to +91 ${cleanNum}. Delivered in 1.1s.`,
        type: "success",
      });
    }, 600);
  };

  return (
    <ClientLayout>
      {/* Wizard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Create SMS Campaign
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step wizard to broadcast promotional or transactional SMS
          </p>
        </div>

        {/* Available Balance Pill */}
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
          <span className="text-slate-500 font-medium">Balance:</span>
          <span className="font-bold text-slate-900">{formatINR(clientWalletBalance)}</span>
        </div>
      </div>

      {/* Progress Steps Indicator */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-card overflow-x-auto">
        <div className="flex items-center min-w-[550px] justify-between">
          {[
            { num: 1, title: "Campaign Info" },
            { num: 2, title: "Recipients" },
            { num: 3, title: "Compose" },
            { num: 4, title: "Summary" },
            { num: 5, title: "Send" },
          ].map((s, idx) => {
            const isDone = step > s.num;
            const isCurrent = step === s.num;
            return (
              <React.Fragment key={s.num}>
                <div
                  onClick={() => s.num < step && setStep(s.num)}
                  className={`flex items-center gap-2 cursor-pointer transition-opacity ${
                    isCurrent
                      ? "opacity-100"
                      : isDone
                      ? "opacity-80 hover:opacity-100"
                      : "opacity-40"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-slate-900 text-white ring-4 ring-slate-100"
                        : isDone
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      isCurrent ? "text-slate-900 font-bold" : "text-slate-600"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {idx < 4 && <div className="flex-1 h-[2px] bg-slate-200 mx-3" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP 1: CAMPAIGN INFO */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-card space-y-5 max-w-2xl mx-auto">
          <div>
            <h3 className="text-base font-bold text-slate-900">Step 1: Campaign Information</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Set campaign name, route type, and DLT sender identifier
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Campaign Name
              </label>
              <Input
                placeholder="e.g. Diwali Mega Sale, Winter Discount"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  SMS Route Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSmsType("promotional")}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                      smsType === "promotional"
                        ? "border-slate-900 bg-slate-900 text-white font-semibold"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div>Promotional</div>
                    <div className={`text-[10px] ${smsType === "promotional" ? "text-slate-300" : "text-slate-400"}`}>
                      ₹0.22 / SMS (9AM - 9PM)
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSmsType("transactional")}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                      smsType === "transactional"
                        ? "border-slate-900 bg-slate-900 text-white font-semibold"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div>Transactional</div>
                    <div className={`text-[10px] ${smsType === "transactional" ? "text-slate-300" : "text-slate-400"}`}>
                      ₹0.25 / SMS (24x7)
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Sender Header (DLT Approved)
                </label>
                <select
                  value={senderHeader}
                  onChange={(e) => setSenderHeader(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="SHRFSH">SHRFSH (Sharma Fashion)</option>
                  <option value="SHRETH">SHRETH (Sharma Ethnic)</option>
                  <option value="BFCEDU">BFCEDU (Bright Future)</option>
                  <option value="GUPTAE">GUPTAE (Gupta Electronics)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Entity ID: 110145892300001 (Airtel DLT)
                </p>
              </div>
            </div>

            {/* DLT Template Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Load DLT Approved Template (Optional)
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="">-- Choose Approved Template --</option>
                {smsApprovedTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.dltTemplateId || "DLT"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <Button
              onClick={() => setStep(2)}
              disabled={!campaignName.trim()}
              className="gap-1.5"
            >
              <span>Next: Select Recipients</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT RECIPIENTS */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-card space-y-6 max-w-2xl mx-auto">
          <div>
            <h3 className="text-base font-bold text-slate-900">Step 2: Select Recipients</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose saved contact groups, upload an Excel/CSV file, or enter numbers manually
            </p>
          </div>

          {/* Group Checkboxes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Contact Groups
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {contactGroups.map((g) => {
                const checked = selectedGroupIds.includes(g.id);
                return (
                  <div
                    key={g.id}
                    onClick={() => handleGroupToggle(g.id)}
                    className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                      checked
                        ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{g.name}</div>
                      <div className="text-[10px] text-slate-500">
                        {formatNumber(g.contactCount)} contacts
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* CSV File Upload Demo */}
          <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50/60">
            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-slate-800">
              Upload Mobile Numbers (CSV or Excel)
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Supported format: .csv, .xlsx with mobile numbers in first column
            </p>
            <div className="mt-2.5 flex items-center justify-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-subtle">
                <span>Browse File</span>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  className="hidden"
                  onChange={handleMockFileUpload}
                />
              </label>
              {uploadedFileStats && (
                <button
                  onClick={() => setUploadedFileStats(null)}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove {uploadedFileStats.filename}
                </button>
              )}
            </div>
          </div>

          {/* Manual Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Add Individual Mobile Numbers (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 9811234567, 9823456781, 9431098765 (comma separated)"
              value={manualNumbers}
              onChange={(e) => setManualNumbers(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Automatic validation & duplicate scrubbing enabled
            </p>
          </div>

          {/* Recipient Total Counter Box */}
          <div className="bg-slate-100 rounded-lg p-3.5 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">Total Valid Recipients Scrubbed:</span>
            <span className="text-base font-bold text-slate-900">
              {formatNumber(totalRecipients)} numbers
            </span>
          </div>

          <div className="flex justify-between pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setStep(1)} className="gap-1.5">
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={totalRecipients === 0}
              className="gap-1.5"
            >
              <span>Next: Compose Message</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: COMPOSE MESSAGE */}
      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Editor Column */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-6 shadow-card space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 3: Compose SMS</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Type your message text. Character counter calculates segments and Unicode
                automatically.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Message Text</label>
                <div className="flex items-center gap-2">
                  {smsCalc.isUnicode ? (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      Unicode (70 char/seg)
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      GSM 7-bit (160 char/seg)
                    </span>
                  )}
                </div>
              </div>

              <textarea
                rows={5}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Enter SMS content..."
                className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 leading-relaxed focus:outline-none focus:ring-1 focus:ring-slate-900"
              />

              {/* Character and Segment Stats */}
              <div className="mt-2 grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Characters</span>
                  <span className="font-bold text-slate-900">{smsCalc.characters}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">SMS Segments</span>
                  <span className="font-bold text-blue-600">{smsCalc.segments} credit/recp</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Remaining in Part</span>
                  <span className="font-bold text-slate-900">{smsCalc.remainingInSegment}</span>
                </div>
              </div>
            </div>

            {/* Quick Templates List */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Or pick a ready approved Indian template:
              </label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {smsApprovedTemplates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTemplateSelect(t.id)}
                    className="w-full p-2 text-left text-[11px] rounded border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-800 truncate">{t.name}</span>
                    <span className="text-[10px] text-blue-600 font-semibold shrink-0 ml-2">
                      Use This
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setStep(2)} className="gap-1.5">
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!messageText.trim()}
                className="gap-1.5"
              >
                <span>Next: Review Summary</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Live Mobile SMS Preview Mockup */}
          <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-xl flex flex-col justify-between max-w-sm mx-auto w-full">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400">
                <span>SMS Live Preview</span>
                <span className="font-mono text-emerald-400">● 4G VoLTE</span>
              </div>

              {/* Virtual Smartphone Screen */}
              <div className="bg-slate-950 rounded-xl p-4 mt-4 border border-slate-800 min-h-[260px] flex flex-col justify-between">
                <div className="text-center pb-2 border-b border-slate-900">
                  <div className="text-[10px] text-slate-500 uppercase">Sender</div>
                  <div className="text-xs font-mono font-bold text-white tracking-widest mt-0.5">
                    {senderHeader}
                  </div>
                  <div className="text-[9px] text-slate-600">Today • 11:42 AM</div>
                </div>

                <div className="my-auto py-2">
                  <div className="bg-slate-800 text-slate-100 rounded-2xl rounded-tl-sm p-3 text-xs leading-relaxed shadow-sm">
                    {messageText || "Type message to preview..."}
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-600 pt-2 border-t border-slate-900">
                  Delivered via Route Mobile Priority Route
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setShowTestModal(true)}
                className="w-full mt-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 text-xs gap-1.5"
              >
                <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                <span>Send Test SMS to My Mobile</span>
              </Button>
            </div>

            <div className="mt-4 text-center text-[10px] text-slate-400">
              Formatted according to Telecom Regulatory Authority of India (TRAI) guidelines.
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: CAMPAIGN SUMMARY & COST */}
      {step === 4 && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-card space-y-6 max-w-2xl mx-auto">
          <div>
            <h3 className="text-base font-bold text-slate-900">Step 4: Campaign Cost Summary</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review recipients, calculated SMS units, and wallet deduction
            </p>
          </div>

          {/* Breakdown Table */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Campaign Title:</span>
              <span className="font-semibold text-slate-900">{campaignName}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Channel & Type:</span>
              <span className="font-semibold text-slate-900 uppercase">
                SMS ({smsType})
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>DLT Sender Header:</span>
              <span className="font-mono font-bold text-slate-900">{senderHeader}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Recipients:</span>
              <span className="font-bold text-slate-900">{formatNumber(totalRecipients)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Segments per Recipient:</span>
              <span className="font-semibold text-slate-900">
                {segmentsPerRecipient} part(s) ({smsCalc.characters} chars)
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total SMS Credits:</span>
              <span className="font-semibold text-slate-900">
                {formatNumber(totalSMSUnits)} units
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Rate per Unit:</span>
              <span className="font-semibold text-slate-900">{formatINR(pricePerUnit)}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Campaign Cost:</span>
              <span className="text-base text-blue-600">{formatINR(estimatedCost)}</span>
            </div>
          </div>

          {/* Wallet check box */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
              hasEnoughBalance
                ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                : "bg-rose-50/70 border-rose-200 text-rose-900"
            }`}
          >
            {hasEnoughBalance ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-bold">
                {hasEnoughBalance ? "Sufficient Balance Available" : "Insufficient Wallet Balance"}
              </div>
              <div className="mt-0.5 text-[11px] leading-relaxed">
                Your available balance is <span className="font-bold">{formatINR(clientWalletBalance)}</span>.
                After this campaign, your remaining balance will be{" "}
                <span className="font-bold">
                  {formatINR(Math.max(0, clientWalletBalance - estimatedCost))}
                </span>.
              </div>
              {!hasEnoughBalance && (
                <button
                  type="button"
                  onClick={() => setShowRecharge(true)}
                  className="mt-2 inline-flex items-center gap-1 font-bold underline text-xs text-rose-700 hover:text-rose-900"
                >
                  Click here to recharge wallet now
                </button>
              )}
            </div>
          </div>

          {/* Scheduling Options */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Dispatch Schedule
            </label>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setSendSchedule("now")}
                className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                  sendSchedule === "now"
                    ? "border-slate-900 bg-slate-50 font-semibold ring-1 ring-slate-900 text-slate-900"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <Send className="w-4 h-4 text-slate-900" />
                <div>
                  <div>Send Immediately</div>
                  <div className="text-[10px] text-slate-500 font-normal">Push to carrier queue right now</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSendSchedule("later")}
                className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                  sendSchedule === "later"
                    ? "border-slate-900 bg-slate-50 font-semibold ring-1 ring-slate-900 text-slate-900"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <Calendar className="w-4 h-4 text-slate-900" />
                <div>
                  <div>Schedule for Later</div>
                  <div className="text-[10px] text-slate-500 font-normal">Set future date and time</div>
                </div>
              </button>
            </div>

            {sendSchedule === "later" && (
              <div className="mt-3">
                <Input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="text-xs"
                />
              </div>
            )}
          </div>

          <div className="flex justify-between pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setStep(3)} className="gap-1.5">
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <Button
              onClick={() => setShowConfirm(true)}
              disabled={!hasEnoughBalance || totalRecipients === 0}
              className="bg-slate-900 text-white font-semibold gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Send Campaign Now</span>
            </Button>
          </div>
        </div>
      )}

      {/* Test SMS Modal */}
      <Modal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
        size="sm"
        title="Send Test SMS to My Mobile"
        description="Verify delivery, sender header, and character formatting on your personal phone before broadcasting to all recipients."
      >
        <form onSubmit={handleSendTest} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Indian Mobile Number (+91) *
            </label>
            <Input
              type="tel"
              value={testNumber}
              onChange={(e) => setTestNumber(e.target.value)}
              placeholder="9811234567"
              required
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div>
              Sender Header: <strong className="font-mono text-slate-900">{senderHeader}</strong>
            </div>
            <div>
              SMS Units: <strong>{smsCalc.segments} segment(s)</strong> ({smsCalc.characters} characters)
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold">
              ✓ Test simulation routes instantly through carrier sandbox.
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setShowTestModal(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSendingTest}
              className="bg-slate-900 text-white"
            >
              {isSendingTest ? "Sending Test..." : "Send Test SMS"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleSendCampaign}
        title="Confirm SMS Campaign Broadcast"
        description={
          <div>
            Are you sure you want to broadcast this campaign to{" "}
            <strong>{formatNumber(totalRecipients)} recipients</strong>? Total amount of{" "}
            <strong>{formatINR(estimatedCost)}</strong> will be deducted from your prepaid wallet.
          </div>
        }
        confirmText="Yes, Send Campaign"
        isLoading={isSubmitting}
      />

      {/* Recharge Modal */}
      <RechargeModal isOpen={showRecharge} onClose={() => setShowRecharge(false)} />
    </ClientLayout>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { formatINR, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { RechargeModal } from "@/components/client/RechargeModal";
import {
  MessageCircle,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ExternalLink,
  Phone,
  CornerDownLeft,
  Sparkles,
  ShieldCheck,
  Check,
  Smartphone,
  Radio,
} from "lucide-react";

export default function WhatsAppCampaignPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    activeCustomer,
    clientWalletBalance,
    templates,
    contactGroups,
    createCampaign,
    whatsappProfile,
    sendTestMessage,
  } = useAppStore();

  const businessDisplayName = activeCustomer?.businessName || "Sharma Fashion Store";
  const businessInitials = businessDisplayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const [campaignName, setCampaignName] = useState("Diwali Festive WhatsApp Broadcast");
  const [selectedGroupId, setSelectedGroupId] = useState("grp-02"); // Festival Offers
  const [selectedTemplateId, setSelectedTemplateId] = useState("tpl-01"); // Diwali Festive Offer
  const [var1, setVar1] = useState("Priya ji");
  const [var2, setVar2] = useState("40");
  const [headerImageUrl, setHeaderImageUrl] = useState(
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop"
  );
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Test modal state
  const [showTestModal, setShowTestModal] = useState(false);
  const [testNumber, setTestNumber] = useState(activeCustomer?.mobile || "9811234567");
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Filter WhatsApp templates
  const waTemplates = templates.filter((t) => t.channel === "whatsapp");
  const selectedTemplate = waTemplates.find((t) => t.id === selectedTemplateId) || waTemplates[0];

  // Selected Group
  const selectedGroup = contactGroups.find((g) => g.id === selectedGroupId);
  const recipientCount = selectedGroup?.contactCount || 1250;

  // Pricing: Marketing ₹1.10, Utility ₹0.20
  const ratePerMessage = selectedTemplate?.category === "utility" ? 0.2 : 1.1;
  const estimatedCost = Number((recipientCount * ratePerMessage).toFixed(2));
  const hasEnoughBalance = clientWalletBalance >= estimatedCost;

  // Interpolated content
  const renderedContent = useMemo(() => {
    if (!selectedTemplate) return "";
    let txt = selectedTemplate.content;
    txt = txt.replace(/\{\{1\}\}/g, var1 || "Customer");
    txt = txt.replace(/\{\{2\}\}/g, var2 || "Discount");
    txt = txt.replace(/\{\{3\}\}/g, "BD-889912");
    txt = txt.replace(/\{\{4\}\}/g, "8:00 PM");
    return txt;
  }, [selectedTemplate, var1, var2]);

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
      sendTestMessage(cleanNum, "whatsapp", renderedContent);
      setIsSendingTest(false);
      setShowTestModal(false);
      toast({
        title: "Test WhatsApp Dispatched! 📲",
        message: `Simulated message delivered to +91 ${cleanNum}. Verified with double blue ticks.`,
        type: "success",
      });
    }, 600);
  };

  const handleSend = () => {
    if (selectedTemplate?.approvalStatus !== "approved") {
      toast({
        title: "Template Not Approved",
        message: "Only Meta-approved WhatsApp templates can be broadcasted.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = createCampaign({
        campaignName,
        customerId: activeCustomer?.id || "cust-01",
        customerName: businessDisplayName,
        channel: "whatsapp",
        messageType: selectedTemplate.category as any,
        totalRecipients: recipientCount,
        cost: estimatedCost,
        status: scheduleType === "now" ? "completed" : "scheduled",
        scheduledDate: scheduleType === "later" ? scheduleDate : undefined,
        messageContent: renderedContent,
        templateName: selectedTemplate.name,
        templateId: selectedTemplate.metaTemplateId,
        mediaUrl: headerImageUrl,
      });

      setIsSubmitting(false);
      setShowConfirm(false);

      if (res.success) {
        toast({
          title: "WhatsApp Campaign Dispatched! 🎉",
          message: `${formatNumber(
            recipientCount
          )} WhatsApp messages sent via Meta Cloud API. Cost: ${formatINR(estimatedCost)}`,
          type: "success",
        });
        router.push("/campaigns");
      } else {
        toast({
          title: "Broadcast Failed",
          message: res.error,
          type: "error",
        });
      }
    }, 1200);
  };

  return (
    <ClientLayout>
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              WhatsApp Campaign Builder
            </h1>
            <span className="text-xs font-bold bg-[#E8F8EE] text-[#075E54] border border-[#b5e7c8] px-2.5 py-0.5 rounded-full">
              Meta Cloud API
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Send rich multimedia promotional offers and service updates directly to customer WhatsApp
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTestModal(true)}
            className="text-xs gap-1.5 border-slate-300"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Send Test to Mobile</span>
          </Button>

          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
            <span className="text-slate-500 font-medium">Wallet:</span>
            <span className="font-bold text-slate-900">{formatINR(clientWalletBalance)}</span>
          </div>
        </div>
      </div>

      {/* Meta API Telemetry Status Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#E8F8EE] flex items-center justify-center text-[#075E54]">
            <Radio className="w-4 h-4 text-[#25D366] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <span>{whatsappProfile.displayName}</span>
              {whatsappProfile.verifiedBadge && (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                  ✓ Verified Green Tick
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500">
              WABA Phone: {whatsappProfile.phoneNumber} • Account ID: {whatsappProfile.wabaId || "waba_781290348123"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div>
            <span className="text-slate-500 block">Throughput Tier</span>
            <span className="font-bold text-slate-900">{whatsappProfile.tierLimit || whatsappProfile.messagingTier}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Quality Rating</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {whatsappProfile.qualityRating}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Webhook</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Connected
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Builder (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-6 shadow-card space-y-5">
          {/* Campaign Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Campaign Name
            </label>
            <Input
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g. Diwali WhatsApp Blast"
            />
          </div>

          {/* Select Contact Group */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Target Audience (Contact Group)
            </label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {contactGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({formatNumber(g.contactCount)} recipients)
                </option>
              ))}
            </select>
          </div>

          {/* Approved Template Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Choose Meta-Approved Template
              </label>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Meta Approved Only
              </span>
            </div>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {waTemplates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} • {t.category.toUpperCase()} ({t.language})
                </option>
              ))}
            </select>
          </div>

          {/* Header Media (if image supported) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Header Media (Banner Image URL)
            </label>
            <Input
              value={headerImageUrl}
              onChange={(e) => setHeaderImageUrl(e.target.value)}
              placeholder="https://example.com/banner.jpg"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Supports JPG/PNG (1080x1080 or 1200x628). Displays at the top of the WhatsApp message.
            </p>
          </div>

          {/* Template Dynamic Variables */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3">
            <span className="text-xs font-bold text-slate-900 block">
              Fill Template Dynamic Placeholders
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {"{{1}}"} (Customer Name sample)
                </label>
                <Input
                  value={var1}
                  onChange={(e) => setVar1(e.target.value)}
                  placeholder="Priya ji"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {"{{2}}"} (Discount / Offer %)
                </label>
                <Input value={var2} onChange={(e) => setVar2(e.target.value)} placeholder="40" />
              </div>
            </div>
          </div>

          {/* Schedule Options */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Delivery Schedule
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setScheduleType("now")}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  scheduleType === "now"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span>Send Instantly</span>
              </button>

              <button
                type="button"
                onClick={() => setScheduleType("later")}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  scheduleType === "later"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Later</span>
              </button>
            </div>

            {scheduleType === "later" && (
              <div className="mt-2.5">
                <Input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Pricing & Estimation Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Recipients:</span>
              <span className="font-semibold text-slate-900">{formatNumber(recipientCount)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Meta Tier Rate ({selectedTemplate?.category}):</span>
              <span className="font-semibold text-slate-900">{formatINR(ratePerMessage)} / message</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
              <span>Total Estimated Cost:</span>
              <span className="text-emerald-700">{formatINR(estimatedCost)}</span>
            </div>
          </div>

          {/* Insufficient balance warning */}
          {!hasEnoughBalance && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <div className="font-bold">Insufficient Balance</div>
                <div className="text-[11px]">
                  Available: {formatINR(clientWalletBalance)}. Required: {formatINR(estimatedCost)}.
                </div>
                <button
                  type="button"
                  onClick={() => setShowRecharge(true)}
                  className="font-bold underline text-rose-700 hover:text-rose-900 mt-1 block"
                >
                  Recharge Wallet Now
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => setShowTestModal(true)}
              className="w-1/3 text-xs gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Test Send</span>
            </Button>

            <Button
              onClick={() => setShowConfirm(true)}
              disabled={!hasEnoughBalance || recipientCount === 0}
              className="w-2/3 bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold h-11 text-sm shadow-subtle gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Broadcast Campaign ({formatINR(estimatedCost)})</span>
            </Button>
          </div>
        </div>

        {/* Right Column: Live Interactive WhatsApp Screen (5 cols) */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="bg-[#128C7E] rounded-3xl p-3 shadow-2xl border-4 border-slate-800 max-w-sm mx-auto">
            {/* Phone Screen Notch & Status Bar */}
            <div className="bg-[#075E54] rounded-t-2xl p-3 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white text-slate-900 font-bold flex items-center justify-center text-xs">
                  {businessInitials}
                </div>
                <div>
                  <div className="text-xs font-bold leading-none">{businessDisplayName}</div>
                  <div className="text-[10px] text-emerald-200 mt-0.5">Verified Business Account</div>
                </div>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>

            {/* WhatsApp Chat Body Wallpaper */}
            <div className="bg-[#E5DDD5] p-3 rounded-b-2xl min-h-[380px] flex flex-col justify-end">
              {/* Message Bubble */}
              <div className="bg-white rounded-xl rounded-tl-sm p-2.5 max-w-[92%] shadow-sm text-slate-900 text-xs space-y-2 border border-slate-200/50">
                {/* Header Image Preview */}
                {headerImageUrl && (
                  <div className="rounded-lg overflow-hidden border border-slate-100 max-h-40">
                    <img
                      src={headerImageUrl}
                      alt="WhatsApp Promo"
                      className="w-full h-36 object-cover"
                    />
                  </div>
                )}

                {/* Body Text */}
                <p className="leading-relaxed whitespace-pre-wrap text-slate-800 text-[11px]">
                  {renderedContent}
                </p>

                {/* Timestamp and Double Blue Ticks */}
                <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400">
                  <span>11:45 AM</span>
                  <span className="text-[#53bdeb] font-bold">✓✓</span>
                </div>

                {/* Interactive Action Buttons */}
                {selectedTemplate?.buttons && selectedTemplate.buttons.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    {selectedTemplate.buttons.map((btn, idx) => (
                      <div
                        key={idx}
                        className="py-1.5 px-3 rounded bg-slate-50 border border-slate-200/80 text-center font-semibold text-blue-600 text-[11px] flex items-center justify-center gap-1.5 hover:bg-slate-100"
                      >
                        {btn.type === "URL" && <ExternalLink className="w-3 h-3" />}
                        {btn.type === "PHONE" && <Phone className="w-3 h-3" />}
                        {btn.type === "QUICK_REPLY" && <CornerDownLeft className="w-3 h-3" />}
                        <span>{btn.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center mt-3 text-slate-500 text-[11px]">
            Preview matches the exact layout delivered to recipient WhatsApp applications.
          </div>
        </div>
      </div>

      {/* Test Message Modal */}
      <Modal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
        size="sm"
        title="Send Test WhatsApp Message"
        description="Verify your message layout and image rendering on an actual phone before broadcasting to all customers."
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

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600">
            A test dispatch does not deduct bulk campaign credits. It tests live Meta Cloud API delivery simulation.
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setShowTestModal(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSendingTest}
              className="bg-[#25D366] hover:bg-[#1ebd5b] text-white"
            >
              {isSendingTest ? "Dispatching..." : "Dispatch Test WhatsApp"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleSend}
        title="Confirm WhatsApp Campaign"
        description={
          <div>
            Broadcast <strong>{campaignName}</strong> to{" "}
            <strong>{formatNumber(recipientCount)} WhatsApp users</strong>?{" "}
            <strong>{formatINR(estimatedCost)}</strong> will be charged to your wallet.
          </div>
        }
        confirmText="Yes, Broadcast WhatsApp"
        isLoading={isSubmitting}
      />

      {/* Recharge Modal */}
      <RechargeModal isOpen={showRecharge} onClose={() => setShowRecharge(false)} />
    </ClientLayout>
  );
}
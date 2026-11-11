"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { formatINR, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
} from "lucide-react";

export default function WhatsAppCampaignPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    clientWalletBalance,
    templates,
    contactGroups,
    createCampaign,
  } = useAppStore();

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
        customerId: "cust-01",
        customerName: "Sharma Fashion Store",
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

        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
          <span className="text-slate-500 font-medium">Wallet:</span>
          <span className="font-bold text-slate-900">{formatINR(clientWalletBalance)}</span>
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

          {/* Header Image Upload URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Header Image URL (Optional)
            </label>
            <Input
              value={headerImageUrl}
              onChange={(e) => setHeaderImageUrl(e.target.value)}
              placeholder="https://..."
              leftIcon={<ImageIcon className="w-4 h-4 text-slate-400" />}
            />
          </div>

          {/* Dynamic Template Variables */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Template Dynamic Variables</span>
              <span className="text-[10px] text-slate-500">Substituted per customer</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Variable {"{{1}}"} (Customer Name)
                </label>
                <Input
                  value={var1}
                  onChange={(e) => setVar1(e.target.value)}
                  placeholder="e.g. Amitabh ji"
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Variable {"{{2}}"} (Offer / Discount)
                </label>
                <Input
                  value={var2}
                  onChange={(e) => setVar2(e.target.value)}
                  placeholder="e.g. 40"
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Rate & Cost Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Recipients:</span>
              <span className="font-bold text-slate-900">{formatNumber(recipientCount)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Meta Message Category:</span>
              <span className="font-semibold uppercase text-slate-900">
                {selectedTemplate?.category}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Rate per WhatsApp message:</span>
              <span className="font-semibold text-slate-900">{formatINR(ratePerMessage)}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
              <span>Estimated Campaign Cost:</span>
              <span className="text-[#075E54] text-base">{formatINR(estimatedCost)}</span>
            </div>
          </div>

          {/* Wallet Balance Warning if needed */}
          {!hasEnoughBalance && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
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

          {/* Action Button */}
          <Button
            onClick={() => setShowConfirm(true)}
            disabled={!hasEnoughBalance || recipientCount === 0}
            className="w-full bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold h-11 text-sm shadow-subtle gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Broadcast WhatsApp Campaign ({formatINR(estimatedCost)})</span>
          </Button>
        </div>

        {/* Right Column: Live Interactive WhatsApp Screen (5 cols) */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="bg-[#128C7E] rounded-3xl p-3 shadow-2xl border-4 border-slate-800 max-w-sm mx-auto">
            {/* Phone Screen Notch & Status Bar */}
            <div className="bg-[#075E54] rounded-t-2xl p-3 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white text-slate-900 font-bold flex items-center justify-center text-xs">
                  SF
                </div>
                <div>
                  <div className="text-xs font-bold leading-none">Sharma Fashion Store</div>
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

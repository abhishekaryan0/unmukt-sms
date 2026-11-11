"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { formatINR } from "@/lib/utils";
import { QrCode, CreditCard, Building2, Smartphone, ShieldCheck, Check } from "lucide-react";

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RechargeModal({ isOpen, onClose, onSuccess }: RechargeModalProps) {
  const { rechargeWallet } = useAppStore();
  const { toast } = useToast();

  const presets = [499, 999, 1999, 4999];
  const [selectedAmount, setSelectedAmount] = useState<number>(999);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [method, setMethod] = useState<"UPI" | "Net Banking" | "Credit Card" | "Debit Card">("UPI");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const amountToCharge = isCustom ? parseFloat(customAmount) || 0 : selectedAmount;
  // Calculate GST: Amount + 18% GST
  const gstAmount = Number((amountToCharge * 0.18).toFixed(2));
  const totalPayable = Number((amountToCharge + gstAmount).toFixed(2));

  const handlePay = () => {
    if (amountToCharge < 100) {
      toast({
        title: "Minimum Recharge",
        message: "Minimum recharge amount is ₹100",
        type: "error",
      });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const result = rechargeWallet(totalPayable, method);
      setIsProcessing(false);
      onClose();
      toast({
        title: "Recharge Successful! 🎉",
        message: `${formatINR(totalPayable)} added to your wallet. New balance: ${formatINR(
          result.newBalance
        )}`,
        type: "success",
      });
      if (onSuccess) onSuccess();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Recharge Prepaid Wallet"
      description="Instant recharge for sending SMS and WhatsApp campaigns"
    >
      <div className="space-y-4">
        {/* Preset Amounts */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Select Recharge Pack
          </label>
          <div className="grid grid-cols-4 gap-2">
            {presets.map((amt) => {
              const active = !isCustom && selectedAmount === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setIsCustom(false);
                    setSelectedAmount(amt);
                  }}
                  className={`py-2 px-2 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                    active
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span>₹{amt}</span>
                  <span className={`text-[10px] font-normal ${active ? "text-slate-300" : "text-slate-500"}`}>
                    Popular
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom amount */}
        <div>
          <button
            type="button"
            onClick={() => setIsCustom(true)}
            className={`text-xs font-medium underline mb-1.5 inline-block ${
              isCustom ? "text-slate-900 font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Or enter custom amount
          </button>
          {isCustom && (
            <Input
              type="number"
              placeholder="Enter amount (min ₹100)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              leftIcon={<span className="text-slate-500 font-semibold text-xs">₹</span>}
            />
          )}
        </div>

        {/* Payment Methods */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Payment Method (Instant Demo)
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setMethod("UPI")}
              className={`p-3 rounded-lg border flex items-center gap-2.5 transition-all text-left ${
                method === "UPI"
                  ? "border-slate-900 bg-slate-50 font-semibold text-slate-900 ring-1 ring-slate-900"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="flex-1">
                <div>UPI / QR Code</div>
                <div className="text-[10px] text-slate-500 font-normal">GPay, PhonePe, Paytm</div>
              </div>
              {method === "UPI" && <Check className="w-3.5 h-3.5 text-slate-900" />}
            </button>

            <button
              type="button"
              onClick={() => setMethod("Net Banking")}
              className={`p-3 rounded-lg border flex items-center gap-2.5 transition-all text-left ${
                method === "Net Banking"
                  ? "border-slate-900 bg-slate-50 font-semibold text-slate-900 ring-1 ring-slate-900"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="flex-1">
                <div>Net Banking</div>
                <div className="text-[10px] text-slate-500 font-normal">SBI, HDFC, ICICI</div>
              </div>
              {method === "Net Banking" && <Check className="w-3.5 h-3.5 text-slate-900" />}
            </button>

            <button
              type="button"
              onClick={() => setMethod("Credit Card")}
              className={`p-3 rounded-lg border flex items-center gap-2.5 transition-all text-left ${
                method === "Credit Card"
                  ? "border-slate-900 bg-slate-50 font-semibold text-slate-900 ring-1 ring-slate-900"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <CreditCard className="w-4 h-4 text-indigo-600 shrink-0" />
              <div className="flex-1">
                <div>Credit Card</div>
                <div className="text-[10px] text-slate-500 font-normal">Visa, Mastercard, RuPay</div>
              </div>
              {method === "Credit Card" && <Check className="w-3.5 h-3.5 text-slate-900" />}
            </button>

            <button
              type="button"
              onClick={() => setMethod("Debit Card")}
              className={`p-3 rounded-lg border flex items-center gap-2.5 transition-all text-left ${
                method === "Debit Card"
                  ? "border-slate-900 bg-slate-50 font-semibold text-slate-900 ring-1 ring-slate-900"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <CreditCard className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="flex-1">
                <div>Debit Card</div>
                <div className="text-[10px] text-slate-500 font-normal">All Indian Banks</div>
              </div>
              {method === "Debit Card" && <Check className="w-3.5 h-3.5 text-slate-900" />}
            </button>
          </div>
        </div>

        {/* GST & Total Breakdown Box */}
        <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-600">
            <span>Base Recharge Amount:</span>
            <span>{formatINR(amountToCharge)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>GST (18% - CGST 9% + SGST 9%):</span>
            <span>{formatINR(gstAmount)}</span>
          </div>
          <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-slate-900 text-sm">
            <span>Total Payable:</span>
            <span>{formatINR(totalPayable)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Demo checkout: Instantly updates your wallet balance and generates GST invoice.</span>
        </div>

        <Button
          onClick={handlePay}
          isLoading={isProcessing}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold h-10 mt-2"
        >
          Pay {formatINR(totalPayable)} & Add to Wallet
        </Button>
      </div>
    </Modal>
  );
}

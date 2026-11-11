import React from "react";
import { formatINR, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Wallet, Plus, Zap, MessageSquare } from "lucide-react";

interface WalletCardProps {
  balance: number;
  onRecharge?: () => void;
  className?: string;
  showActions?: boolean;
}

export function WalletCard({
  balance,
  onRecharge,
  className,
  showActions = true,
}: WalletCardProps) {
  // SMS unit price ~₹0.22, WhatsApp marketing ~₹1.10
  const estSms = Math.floor(balance / 0.22);
  const estWhatsApp = Math.floor(balance / 1.1);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-5 shadow-elevated ${
        className || ""
      }`}
    >
      {/* Decorative background grid subtle effect */}
      <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-blue-600/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Wallet className="w-4 h-4 text-blue-400" />
            <span>PREPAID WALLET BALANCE</span>
          </div>
          <div className="text-3xl font-bold tracking-tight text-white mt-2">
            {formatINR(balance)}
          </div>
        </div>

        {showActions && onRecharge && (
          <Button
            size="sm"
            onClick={onRecharge}
            className="bg-white text-slate-950 hover:bg-slate-100 font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1 text-slate-900" />
            Recharge
          </Button>
        )}
      </div>

      <div className="relative z-10 mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-500/15 flex items-center justify-center text-blue-400">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Est. SMS Credits</div>
            <div className="font-semibold text-slate-200">~{formatNumber(estSms)} units</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#25D366]/15 flex items-center justify-center text-[#25D366]">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Est. WhatsApp</div>
            <div className="font-semibold text-slate-200">~{formatNumber(estWhatsApp)} messages</div>
          </div>
        </div>
      </div>
    </div>
  );
}

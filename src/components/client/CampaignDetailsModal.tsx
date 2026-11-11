"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Campaign } from "@/types";
import { formatINR, formatNumber, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MessageSquare, Zap, CheckCircle2, XCircle, Clock, DollarSign } from "lucide-react";

interface CampaignDetailsModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CampaignDetailsModal({ campaign, isOpen, onClose }: CampaignDetailsModalProps) {
  if (!campaign) return null;

  const deliveryRate =
    campaign.totalRecipients > 0
      ? ((campaign.delivered / campaign.totalRecipients) * 100).toFixed(1)
      : "0";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-2">
          <span>{campaign.campaignName}</span>
          <StatusBadge status={campaign.status} />
        </div>
      }
      description={`Campaign ID: ${campaign.id} • Created on ${formatDate(campaign.createdDate)}`}
      footer={
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">Recipients</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {formatNumber(campaign.totalRecipients)}
            </div>
          </div>
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-lg p-3">
            <span className="text-[10px] font-semibold text-emerald-700 uppercase">Delivered</span>
            <div className="text-lg font-bold text-emerald-800 mt-0.5">
              {formatNumber(campaign.delivered)}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">{deliveryRate}% rate</span>
          </div>
          <div className="bg-rose-50/60 border border-rose-200/80 rounded-lg p-3">
            <span className="text-[10px] font-semibold text-rose-700 uppercase">Failed</span>
            <div className="text-lg font-bold text-rose-800 mt-0.5">
              {formatNumber(campaign.failed)}
            </div>
          </div>
        </div>

        {/* Channel Details */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-slate-500">Channel & Type:</span>
            <span className="font-semibold text-slate-800 uppercase flex items-center gap-1.5">
              {campaign.channel === "whatsapp" ? (
                <span className="text-[#25D366] font-bold">WhatsApp ({campaign.messageType})</span>
              ) : (
                <span className="text-blue-600 font-bold">SMS ({campaign.messageType})</span>
              )}
            </span>
          </div>

          {campaign.senderId && (
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-slate-500">Sender Header:</span>
              <span className="font-mono font-semibold text-slate-800">{campaign.senderId}</span>
            </div>
          )}

          {campaign.templateName && (
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-slate-500">Template:</span>
              <span className="font-medium text-slate-800">{campaign.templateName}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Total Billed:</span>
            <span className="font-bold text-slate-900 text-sm">{formatINR(campaign.cost)}</span>
          </div>
        </div>

        {/* Message Content Preview */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Broadcast Content
          </label>
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
            {campaign.messageContent}
          </div>
        </div>
      </div>
    </Modal>
  );
}

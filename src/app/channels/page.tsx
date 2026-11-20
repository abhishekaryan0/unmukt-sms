"use client";

import React, { useState } from "react";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { SocialChannelType, ConnectedChannel } from "@/types";
import {
  Radio,
  Plus,
  RefreshCw,
  PowerOff,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sliders,
  Check,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";
import {
  WhatsAppIcon,
  MessengerIcon,
  InstagramIcon,
  TelegramIcon,
} from "@/components/shared/ChannelIcons";

export default function ConnectedChannelsPage() {
  const { connectedChannels, connectChannel, disconnectChannel, reconnectChannel } = useAppStore();
  const { toast } = useToast();

  const [showWizard, setShowWizard] = useState(false);
  const [selectedChannelType, setSelectedChannelType] = useState<SocialChannelType>("whatsapp");
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [accountName, setAccountName] = useState("");
  const [accountIdentifier, setAccountIdentifier] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [confirmDisconnectId, setConfirmDisconnectId] = useState<string | null>(null);

  // Statistics
  const totalChannels = connectedChannels.length;
  const activeChannels = connectedChannels.filter((c) => c.status === "connected").length;
  const totalMessagesProcessed = connectedChannels.reduce((sum, c) => sum + (c.totalConversations || 0), 0);

  const channelConfigMap: Record<
    SocialChannelType,
    {
      title: string;
      brandColor: string;
      badgeColor: string;
      icon: React.ComponentType<{ className?: string }>;
      placeholderName: string;
      placeholderId: string;
      labelId: string;
      docsHint: string;
    }
  > = {
    whatsapp: {
      title: "WhatsApp Business API",
      brandColor: "bg-[#25D366] text-white",
      badgeColor: "bg-[#E8F8EE] text-[#075E54] border-[#b5e7c8]",
      icon: WhatsAppIcon,
      placeholderName: "Aura Official Store Support",
      placeholderId: "+91 98112 34567",
      labelId: "Registered Business Phone Number (E.164 format)",
      docsHint: "Meta Cloud API Cloud WABA - Requires verified Meta Business Manager",
    },
    messenger: {
      title: "Facebook Messenger",
      brandColor: "bg-[#0084FF] text-white",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      icon: MessengerIcon,
      placeholderName: "Aura Fashion Hub Official Page",
      placeholderId: "fb.me/aurafashionhub (Page ID: 108492019)",
      labelId: "Facebook Page Name or Page ID",
      docsHint: "Meta Graph API v19.0 - Messages and messaging_postbacks permissions",
    },
    instagram: {
      title: "Instagram Direct",
      brandColor: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white",
      badgeColor: "bg-pink-50 text-pink-700 border-pink-200",
      icon: InstagramIcon,
      placeholderName: "Aura Lifestyle India",
      placeholderId: "@aura_lifestyle_in",
      labelId: "Instagram Professional Username / Handle",
      docsHint: "Instagram Messaging API for Business - Connected to Facebook Page",
    },
    telegram: {
      title: "Telegram Bot",
      brandColor: "bg-[#0088cc] text-white",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
      icon: TelegramIcon,
      placeholderName: "Aura Concierge Support Bot",
      placeholderId: "@auracare_official_bot",
      labelId: "Telegram Bot Username (@botname)",
      docsHint: "Telegram Bot API Webhooks with SSL / TLS 1.3 mutual auth",
    },
  };

  const handleStartConnect = (type: SocialChannelType) => {
    setSelectedChannelType(type);
    setAccountName(channelConfigMap[type].placeholderName);
    setAccountIdentifier(channelConfigMap[type].placeholderId);
    setWizardStep(1);
    setShowWizard(true);
  };

  const handleWizardSubmit = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      connectChannel({
        channelType: selectedChannelType,
        name: accountName || channelConfigMap[selectedChannelType].placeholderName,
        identifier: accountIdentifier || channelConfigMap[selectedChannelType].placeholderId,
        status: "connected",
        webhookStatus: "healthy",
        autoReplyEnabled: true,
      });
      setShowWizard(false);
      setWizardStep(1);
    }, 1200);
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Radio className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Connected Messaging Channels
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Connect and monitor customer communication across WhatsApp, Facebook Messenger, Instagram Direct, and Telegram.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={() => {
                setSelectedChannelType("whatsapp");
                setAccountName("");
                setAccountIdentifier("");
                setWizardStep(1);
                setShowWizard(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-subtle"
            >
              <Plus className="w-4 h-4" />
              <span>Connect New Channel</span>
            </Button>
          </div>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Connected Channels
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{activeChannels}</span>
              <span className="text-xs text-slate-400 font-medium">/ {totalChannels} Total</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Webhooks Online</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Conversations Handled
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {totalMessagesProcessed.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-600 font-semibold">+18.4%</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 font-medium">Across all platforms</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Webhook Uptime
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">99.98%</span>
              <span className="text-xs text-emerald-600 font-semibold">Healthy</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 font-medium">Real-time socket delivery</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Average Latency
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">85ms</span>
              <span className="text-xs text-blue-600 font-semibold">Fast</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 font-medium">Direct gateway polling</div>
          </div>
        </div>

        {/* Channels Grid */}
        {connectedChannels.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center shadow-subtle">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Radio className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No channels connected yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
              Connect your WhatsApp Business, Facebook Messenger, Instagram Direct, or Telegram accounts to receive customer inquiries in the Unified Inbox.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                onClick={() => handleStartConnect("whatsapp")}
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs gap-2"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Connect WhatsApp</span>
              </Button>
              <Button
                onClick={() => handleStartConnect("instagram")}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white text-xs gap-2"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Connect Instagram</span>
              </Button>
              <Button
                onClick={() => handleStartConnect("messenger")}
                className="bg-[#0084FF] hover:bg-[#0074e0] text-white text-xs gap-2"
              >
                <MessengerIcon className="w-4 h-4" />
                <span>Connect Messenger</span>
              </Button>
              <Button
                onClick={() => handleStartConnect("telegram")}
                className="bg-[#0088cc] hover:bg-[#007ab8] text-white text-xs gap-2"
              >
                <TelegramIcon className="w-4 h-4" />
                <span>Connect Telegram</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {connectedChannels.map((chan) => {
              const cfg = channelConfigMap[chan.channelType] || channelConfigMap.whatsapp;
              const IconComp = cfg.icon;
              const isConnected = chan.status === "connected";

              return (
                <div
                  key={chan.id}
                  className="bg-white rounded-xl border border-slate-200/90 shadow-subtle p-5 flex flex-col justify-between transition-all hover:border-slate-300"
                >
                  {/* Top Row: Channel Icon, Brand, Status */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-subtle ${cfg.brandColor}`}
                        >
                          <IconComp className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900 leading-tight">
                              {chan.name}
                            </h3>
                            {chan.channelType === "whatsapp" && (
                              <span
                                title="Meta Verified Official WABA"
                                className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white"
                              >
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">
                            {chan.identifier}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isConnected ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span>Disconnected</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata & Diagnostics */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">
                          Connected Date
                        </span>
                        <span className="font-semibold text-slate-700">{chan.connectedAt}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">
                          Last Synced
                        </span>
                        <span className="font-semibold text-slate-700">{chan.lastSyncAt}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">
                          Conversations
                        </span>
                        <span className="font-semibold text-slate-700">
                          {chan.totalConversations} handled
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">
                          Webhook Health
                        </span>
                        <span className="font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>200 OK (Healthy)</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isConnected ? (
                        <button
                          onClick={() => reconnectChannel(chan.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-subtle"
                          title="Verify credentials and trigger handshake"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                          <span>Test & Reconnect</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => reconnectChannel(chan.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-subtle"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Re-activate Channel</span>
                        </button>
                      )}
                    </div>

                    <div>
                      {isConnected ? (
                        <button
                          onClick={() => setConfirmDisconnectId(chan.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                        >
                          <PowerOff className="w-3.5 h-3.5" />
                          <span>Disconnect</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Paused</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Connect Supported Channels Section */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Supported Social Messaging Integrations</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Add multiple accounts per channel to scale customer care across sales, support, and marketing teams.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {(["whatsapp", "messenger", "instagram", "telegram"] as SocialChannelType[]).map((type) => {
              const cfg = channelConfigMap[type];
              const IconComp = cfg.icon;
              return (
                <div
                  key={type}
                  className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${cfg.brandColor}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-slate-900">{cfg.title}</div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {cfg.docsHint}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartConnect(type)}
                    className="w-full mt-4 text-xs font-semibold border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Connection Setup Wizard Modal */}
      <Modal
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        title="Connect Social Messaging Channel"
        size="md"
      >
        <div className="space-y-5">
          {/* Step Indicators */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  wizardStep === 1 ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
                }`}
              >
                1
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Select Platform</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  wizardStep === 2 ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                2
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Credentials</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  wizardStep === 3 ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                3
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Verify</span>
            </div>
          </div>

          {/* Wizard Step 1: Select Channel */}
          {wizardStep === 1 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose the social channel you want to link to your Unified Inbox:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(["whatsapp", "messenger", "instagram", "telegram"] as SocialChannelType[]).map(
                  (type) => {
                    const cfg = channelConfigMap[type];
                    const IconComp = cfg.icon;
                    const isSelected = selectedChannelType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setSelectedChannelType(type);
                          setAccountName(cfg.placeholderName);
                          setAccountIdentifier(cfg.placeholderId);
                        }}
                        className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "border-blue-600 dark:border-blue-500 bg-blue-50/80 dark:bg-blue-950/50 shadow-sm ring-1 ring-blue-600 dark:ring-blue-500"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${cfg.brandColor}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{cfg.title}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Instant Webhook Sync</div>
                      </button>
                    );
                  }
                )}
              </div>
              <div className="flex justify-end pt-3">
                <Button onClick={() => setWizardStep(2)} className="gap-1.5">
                  <span>Continue to Credentials</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Wizard Step 2: Account Details */}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  Connecting <strong>{channelConfigMap[selectedChannelType].title}</strong>. Enter your business details below.
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Channel Display Name
                </label>
                <Input
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder={channelConfigMap[selectedChannelType].placeholderName}
                />
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                  This internal name helps your agents identify which channel the customer contacted.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {channelConfigMap[selectedChannelType].labelId}
                </label>
                <Input
                  value={accountIdentifier}
                  onChange={(e) => setAccountIdentifier(e.target.value)}
                  placeholder={channelConfigMap[selectedChannelType].placeholderId}
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" onClick={() => setWizardStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setWizardStep(3)} className="gap-1.5">
                  <span>Proceed to Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Wizard Step 3: Webhook Verification */}
          {wizardStep === 3 && (
            <div className="space-y-4 py-2 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Ready to link {channelConfigMap[selectedChannelType].title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                  We will perform a simulated handshake with the Meta / Telegram webhook listener and initialize the message pipeline.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/90 rounded-xl p-3 text-left border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 font-mono">
                <div className="text-slate-500 dark:text-slate-400">Account: <span className="font-bold text-slate-900 dark:text-white">{accountName || channelConfigMap[selectedChannelType].placeholderName}</span></div>
                <div className="text-slate-500 dark:text-slate-400">Identifier: <span className="font-bold text-slate-900 dark:text-white">{accountIdentifier || channelConfigMap[selectedChannelType].placeholderId}</span></div>
                <div className="text-slate-500 dark:text-slate-400">Webhook URL: <span className="text-blue-600 dark:text-blue-400">https://api.unmukt.in/v1/webhook/{selectedChannelType}</span></div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" disabled={isVerifying} onClick={() => setWizardStep(2)}>
                  Back
                </Button>
                <Button onClick={handleWizardSubmit} disabled={isVerifying} className="gap-2">
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Webhook...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Authorize & Connect</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Disconnect Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDisconnectId}
        onClose={() => setConfirmDisconnectId(null)}
        onConfirm={() => {
          if (confirmDisconnectId) {
            disconnectChannel(confirmDisconnectId);
            setConfirmDisconnectId(null);
          }
        }}
        title="Disconnect Channel?"
        description="Are you sure you want to disconnect this messaging channel? While disconnected, incoming customer messages will not be delivered to your inbox."
        confirmText="Yes, Disconnect Channel"
        variant="destructive"
      />
    </ClientLayout>
  );
}

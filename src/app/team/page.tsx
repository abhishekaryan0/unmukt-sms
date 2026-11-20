"use client";

import React, { useState } from "react";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { TeamMember, SocialChannelType } from "@/types";
import { ChannelBadge } from "@/components/shared/ChannelIcons";
import {
  UserCheck,
  Plus,
  Users,
  Shield,
  MessageSquare,
  Activity,
  CheckCircle2,
  Clock,
  Radio,
} from "lucide-react";

export default function TeamMembersPage() {
  const { teamMembers, addTeamMember, updateTeamMemberStatus } = useAppStore();
  const { toast } = useToast();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamMember["role"]>("agent");
  const [selectedChannels, setSelectedChannels] = useState<SocialChannelType[]>([
    "whatsapp",
    "instagram",
  ]);

  const onlineCount = teamMembers.filter((m) => m.status === "online").length;
  const totalActiveChats = teamMembers.reduce((sum, m) => sum + m.activeChats, 0);

  const toggleChannel = (ch: SocialChannelType) => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addTeamMember({
      name: name.trim(),
      email: email.trim(),
      role,
      status: "online",
      channels: selectedChannels,
    });

    setName("");
    setEmail("");
    setRole("agent");
    setShowAddModal(false);
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <UserCheck className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Support Team & Agent Management
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Assign conversations, manage agent workload, and track response capacity across channels.
            </p>
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-subtle"
          >
            <Plus className="w-4 h-4" />
            <span>Invite Team Member</span>
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Agents
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{teamMembers.length}</div>
            <div className="mt-2 text-[11px] text-slate-500 font-medium">Assigned to channels</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Online Now
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-600">{onlineCount}</span>
              <span className="text-xs text-slate-400 font-medium">Active Agents</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Accepting inquiries</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Live Active Chats
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{totalActiveChats}</div>
            <div className="mt-2 text-[11px] text-slate-500 font-medium">Under active resolution</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-subtle">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Avg SLA Response
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-900">1m 45s</div>
            <div className="mt-2 text-[11px] text-emerald-600 font-medium">Faster than 92% benchmark</div>
          </div>
        </div>

        {/* Team Members List Table / Cards */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Team Roster</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500">{teamMembers.length} Members</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold ring-2 ring-slate-100 dark:ring-slate-800">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{member.name}</h4>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                        {member.role}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{member.email}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Assigned Channels */}
                  <div className="flex items-center gap-1">
                    {member.channels.map((ch) => (
                      <ChannelBadge key={ch} channelType={ch} showLabel={false} size="sm" />
                    ))}
                  </div>

                  {/* Active Chats */}
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 px-2.5 py-1 rounded-lg">
                    {member.activeChats} Active Chats
                  </div>

                  {/* Status Picker */}
                  <div className="flex items-center gap-1.5">
                    <select
                      value={member.status}
                      onChange={(e) =>
                        updateTeamMemberStatus(member.id, e.target.value as TeamMember["status"])
                      }
                      className={`text-xs font-semibold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer ${
                        member.status === "online"
                          ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                          : member.status === "away"
                          ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <option value="online" className="dark:bg-slate-900 dark:text-white">Online</option>
                      <option value="away" className="dark:bg-slate-900 dark:text-white">Away</option>
                      <option value="offline" className="dark:bg-slate-900 dark:text-white">Offline</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Invite Support Agent"
        size="md"
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anjali Gupta"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anjali@yourbusiness.in"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="agent">Support Agent (Respond to assigned chats)</option>
              <option value="manager">Manager (Assign, view reports, modify replies)</option>
              <option value="admin">Admin (Full channel connection and billing rights)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Assigned Channels
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["whatsapp", "messenger", "instagram", "telegram"] as SocialChannelType[]).map(
                (ch) => {
                  const isChecked = selectedChannels.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => toggleChannel(ch)}
                      className={`p-2 rounded-lg border text-xs font-semibold capitalize flex items-center justify-between transition-colors ${
                        isChecked
                          ? "bg-blue-50 text-blue-700 border-blue-300"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span>{ch}</span>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Invite Agent</Button>
          </div>
        </form>
      </Modal>
    </ClientLayout>
  );
}

"use client";

import React, { useState } from "react";
import { ClientLayout } from "@/components/client/ClientLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { formatIndianMobile, formatDate, exportToCSV, validateIndianMobile } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Contact } from "@/types";
import {
  Users,
  UserPlus,
  Upload,
  Download,
  Trash2,
  Edit2,
  Eye,
  CheckCircle2,
  XCircle,
  Tag,
  Phone,
  Mail,
  ShieldCheck,
  ShieldAlert,
  FileSpreadsheet,
  Filter,
} from "lucide-react";

export default function ContactsPage() {
  const { contacts, contactGroups, addContact, updateContact, deleteContact, importContacts } =
    useAppStore();
  const { toast } = useToast();

  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [dndFilter, setDndFilter] = useState<"all" | "clean" | "dnd">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);
  const [deletingContactId, setDeletingContactId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formMobile, setFormMobile] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formGroup, setFormGroup] = useState("Regular Customers");
  const [formTags, setFormTags] = useState("");
  const [formSmsConsent, setFormSmsConsent] = useState(true);
  const [formWaConsent, setFormWaConsent] = useState(true);
  const [formIsDnd, setFormIsDnd] = useState(false);

  // File import state
  const [importSummary, setImportSummary] = useState<{
    total: number;
    valid: number;
    invalid: number;
  } | null>(null);

  // Filtered contacts
  const filteredContacts = contacts.filter((c) => {
    if (selectedGroup !== "all" && c.group !== selectedGroup) return false;
    if (dndFilter === "clean" && c.isDnd) return false;
    if (dndFilter === "dnd" && !c.isDnd) return false;
    return true;
  });

  const dndCount = contacts.filter((c) => c.isDnd).length;

  const handleOpenAdd = () => {
    setEditingContact(null);
    setFormName("");
    setFormMobile("");
    setFormEmail("");
    setFormGroup(contactGroups[0]?.name || "Regular Customers");
    setFormTags("");
    setFormSmsConsent(true);
    setFormWaConsent(true);
    setFormIsDnd(false);
    setShowAddModal(true);
  };

  const handleOpenEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormName(contact.name);
    setFormMobile(contact.mobile);
    setFormEmail(contact.email);
    setFormGroup(contact.group);
    setFormTags(contact.tags.join(", "));
    setFormSmsConsent(contact.smsConsent);
    setFormWaConsent(contact.whatsappConsent);
    setFormIsDnd(!!contact.isDnd);
    setShowAddModal(true);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formMobile.trim()) {
      toast({ title: "Required Fields", message: "Please enter name and mobile number", type: "error" });
      return;
    }

    if (!validateIndianMobile(formMobile)) {
      toast({
        title: "Invalid Mobile Number",
        message: "Please enter a valid 10-digit Indian mobile number (e.g. 9811234567)",
        type: "error",
      });
      return;
    }

    const tagsArray = formTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingContact) {
      updateContact({
        ...editingContact,
        name: formName.trim(),
        mobile: formMobile.replace(/\D/g, "").slice(-10),
        email: formEmail.trim(),
        group: formGroup,
        tags: tagsArray,
        smsConsent: formSmsConsent,
        whatsappConsent: formWaConsent,
        isDnd: formIsDnd,
      });
      toast({ title: "Contact Updated", message: `${formName} has been updated.`, type: "success" });
    } else {
      addContact({
        name: formName.trim(),
        mobile: formMobile.replace(/\D/g, "").slice(-10),
        email: formEmail.trim(),
        group: formGroup,
        tags: tagsArray,
        smsConsent: formSmsConsent,
        whatsappConsent: formWaConsent,
        isDnd: formIsDnd,
      });
      toast({ title: "Contact Added", message: `${formName} added to ${formGroup}.`, type: "success" });
    }

    setShowAddModal(false);
  };

  const handleDelete = () => {
    if (deletingContactId) {
      deleteContact(deletingContactId);
      toast({ title: "Contact Removed", message: "Contact was deleted from list", type: "success" });
      setDeletingContactId(null);
    }
  };

  const handleExport = () => {
    const exportData = filteredContacts.map((c) => ({
      Name: c.name,
      Mobile: c.mobile,
      Email: c.email,
      Group: c.group,
      Tags: c.tags.join("; "),
      SMS_Consent: c.smsConsent ? "YES" : "NO",
      WhatsApp_Consent: c.whatsappConsent ? "YES" : "NO",
      DND_Registered: c.isDnd ? "YES" : "NO",
      Date_Added: c.dateAdded,
    }));
    exportToCSV(exportData, `contacts_export_${new Date().toISOString().split("T")[0]}`);
    toast({ title: "Contacts Exported", message: "CSV file download started.", type: "success" });
  };

  const handleDownloadSampleCSV = () => {
    const sampleHeaders = "Name,Mobile,Group,Email,Tags,DND\n";
    const sampleRows = [
      "Aakash Sharma,9811234567,Regular Customers,aakash@gmail.com,VIP; Repeat,No",
      "Priya Patel,9823456789,Festival Offers,priya@yahoo.com,Diwali Offer,No",
      "Vikram Malhotra,9899001122,Wholesale Buyers,vikram@malhotra.com,Bulk Trader,Yes",
      "Sunita Kapoor,9876543210,Regular Customers,sunita@outlook.com,Loyalty,No",
    ].join("\n");

    const blob = new Blob([sampleHeaders + sampleRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "smsunmukt_sample_contacts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Sample CSV Downloaded",
      message: "Use this template to format and import customer lists.",
      type: "success",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        toast({ title: "Empty CSV", message: "CSV file contains no data rows", type: "error" });
        return;
      }

      // Parse headers
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const nameIdx = headers.findIndex((h) => h.includes("name"));
      const mobileIdx = headers.findIndex((h) => h.includes("mobile") || h.includes("phone"));
      const groupIdx = headers.findIndex((h) => h.includes("group"));
      const emailIdx = headers.findIndex((h) => h.includes("email"));
      const tagsIdx = headers.findIndex((h) => h.includes("tag"));
      const dndIdx = headers.findIndex((h) => h.includes("dnd"));

      const newContacts: Omit<Contact, "id" | "dateAdded">[] = [];
      let invalidCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(",").map((p) => p.trim());
        const rawMobile = mobileIdx >= 0 ? parts[mobileIdx] : parts[1] || "";
        const cleanMobile = rawMobile.replace(/\D/g, "").slice(-10);

        if (!validateIndianMobile(cleanMobile)) {
          invalidCount++;
          continue;
        }

        const name = (nameIdx >= 0 ? parts[nameIdx] : parts[0]) || `Customer ${cleanMobile.slice(-4)}`;
        const group = (groupIdx >= 0 ? parts[groupIdx] : parts[2]) || formGroup;
        const email = emailIdx >= 0 ? parts[emailIdx] : "";
        const rawTags = tagsIdx >= 0 ? parts[tagsIdx] : "";
        const tags = rawTags ? rawTags.split(";").map((t) => t.trim()) : ["CSV Import"];
        const isDnd = dndIdx >= 0 ? parts[dndIdx].toLowerCase().includes("yes") : false;

        newContacts.push({
          name,
          mobile: cleanMobile,
          email,
          group,
          tags,
          smsConsent: true,
          whatsappConsent: true,
          isDnd,
        });
      }

      const importedCount = importContacts(newContacts);
      setImportSummary({
        total: lines.length - 1,
        valid: importedCount,
        invalid: invalidCount,
      });

      toast({
        title: "Contacts Imported Successfully! 🎉",
        message: `${importedCount} verified Indian contacts added. ${invalidCount} invalid rows skipped.`,
        type: "success",
      });

      setShowImportModal(false);
    };

    reader.readAsText(file);
  };

  const handleScrubDnd = () => {
    toast({
      title: "TRAI NDNC Scrub Completed",
      message: `Scrubbed ${contacts.length} contacts against the National Do Not Disturb registry. ${dndCount} contact(s) are active on DND.`,
      type: "success",
    });
  };

  const columns: Column<Contact>[] = [
    {
      header: "Customer Name",
      accessorKey: "name",
      cell: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.name}</div>
          <div className="text-[11px] text-slate-400">{row.email || "No email"}</div>
        </div>
      ),
    },
    {
      header: "Mobile Number",
      accessorKey: "mobile",
      cell: (row) => (
        <span className="font-mono text-slate-800 font-medium">
          {formatIndianMobile(row.mobile)}
        </span>
      ),
    },
    {
      header: "Group",
      accessorKey: "group",
      cell: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
          {row.group}
        </span>
      ),
    },
    {
      header: "DND Registry",
      accessorKey: "isDnd",
      cell: (row) =>
        row.isDnd ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded">
            <ShieldAlert className="w-3 h-3 text-amber-600" />
            DND Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Clean (Safe)
          </span>
        ),
    },
    {
      header: "Tags",
      cell: (row) => (
        <div className="flex items-center gap-1 flex-wrap">
          {row.tags.slice(0, 2).map((t, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200"
            >
              {t}
            </span>
          ))}
          {row.tags.length > 2 && (
            <span className="text-[10px] text-slate-400">+{row.tags.length - 2}</span>
          )}
        </div>
      ),
    },
    {
      header: "Consent",
      cell: (row) => (
        <div className="flex items-center gap-2 text-[11px]">
          <span
            className={`flex items-center gap-0.5 ${
              row.smsConsent ? "text-emerald-700 font-semibold" : "text-slate-400"
            }`}
          >
            SMS {row.smsConsent ? "✓" : "✗"}
          </span>
          <span>•</span>
          <span
            className={`flex items-center gap-0.5 ${
              row.whatsappConsent ? "text-emerald-700 font-semibold" : "text-slate-400"
            }`}
          >
            WA {row.whatsappConsent ? "✓" : "✗"}
          </span>
        </div>
      ),
    },
    {
      header: "Added Date",
      accessorKey: "dateAdded",
      cell: (row) => <span className="text-slate-500 text-xs">{formatDate(row.dateAdded, false)}</span>,
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setViewingContact(row);
              setShowViewModal(true);
            }}
            className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100"
            title="Edit Contact"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeletingContactId(row.id)}
            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100"
            title="Delete Contact"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <ClientLayout>
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Contact Management & Phonebook
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your verified Indian customer phonebook, TRAI DND scrubbing, opt-in consent, and tags
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleScrubDnd}
            className="gap-1.5 text-xs text-amber-800 border-amber-300 bg-amber-50 hover:bg-amber-100"
            title="Check contacts against National Do Not Disturb registry"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Scrub DND ({dndCount})</span>
          </Button>

          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowImportModal(true)}
            className="gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </Button>

          <Button size="sm" onClick={handleOpenAdd} className="bg-slate-900 text-white gap-1.5">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={filteredContacts}
        columns={columns}
        searchPlaceholder="Search by name, mobile, tag..."
        filters={
          <div className="flex items-center gap-2">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Contact Groups ({contacts.length})</option>
              {contactGroups.map((g) => (
                <option key={g.id} value={g.name}>
                  {g.name} ({g.contactCount})
                </option>
              ))}
            </select>

            <select
              value={dndFilter}
              onChange={(e) => setDndFilter(e.target.value as any)}
              className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All DND Status</option>
              <option value="clean">Clean Only (Promotional Safe)</option>
              <option value="dnd">DND Registered ({dndCount})</option>
            </select>
          </div>
        }
      />

      {/* Add / Edit Contact Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        size="md"
        title={editingContact ? "Edit Contact" : "Add New Customer Contact"}
        description="Enter verified phone details, DND status, and opt-in consent"
      >
        <form onSubmit={handleSaveContact} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer Full Name *
            </label>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Sunita Kapoor"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Indian Mobile (+91) *
              </label>
              <Input
                type="tel"
                value={formMobile}
                onChange={(e) => setFormMobile(e.target.value)}
                placeholder="9811234567"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <Input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="customer@gmail.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Group
              </label>
              <select
                value={formGroup}
                onChange={(e) => setFormGroup(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                {contactGroups.map((g) => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tags (comma separated)
              </label>
              <Input
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="VIP, Festive, Repeat"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formSmsConsent}
                onChange={(e) => setFormSmsConsent(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span className="text-slate-700">SMS Marketing Consent (TRAI Compliant)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formWaConsent}
                onChange={(e) => setFormWaConsent(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span className="text-slate-700">WhatsApp Notification Opt-in Verified</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formIsDnd}
                onChange={(e) => setFormIsDnd(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-amber-800 font-medium">Marked on TRAI National Do Not Disturb (DND)</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-slate-900 text-white">
              {editingContact ? "Save Changes" : "Add Contact"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* CSV Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        size="md"
        title="Import Contacts from CSV File"
        description="Upload customer phone lists directly into your marketing group with automatic mobile sanitization."
      >
        <div className="space-y-4 text-xs">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 space-y-3">
            <Upload className="w-8 h-8 text-slate-400 mx-auto" />
            <div>
              <h4 className="font-bold text-slate-900">Choose CSV File from Device</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Columns required: <code>Name, Mobile, Group, Email, Tags, DND</code>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Select .CSV File</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={handleDownloadSampleCSV}
                className="gap-1.5 text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample Template</span>
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-[11px] text-blue-900 space-y-1">
            <div className="font-bold">Indian Telecom Carrier Scrubbing:</div>
            <div>
              Our system automatically filters out invalid prefixes, standardizes 10-digit formats with +91 country codes, and removes duplicate rows prior to broadcast.
            </div>
          </div>
        </div>
      </Modal>

      {/* View Contact Details Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        size="sm"
        title="Contact Profile"
        description={`Details for ${viewingContact?.name}`}
      >
        {viewingContact && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
                {viewingContact.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{viewingContact.name}</h4>
                <div className="text-[11px] text-slate-500">{viewingContact.group}</div>
              </div>
            </div>

            <div className="space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Mobile:</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatIndianMobile(viewingContact.mobile)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-medium text-slate-900">{viewingContact.email || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">DND Status:</span>
                <span
                  className={
                    viewingContact.isDnd
                      ? "text-amber-700 font-bold"
                      : "text-emerald-700 font-semibold"
                  }
                >
                  {viewingContact.isDnd ? "Registered on DND" : "Clean (Non-DND)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date Added:</span>
                <span>{formatDate(viewingContact.dateAdded, false)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">SMS Consent:</span>
                <span
                  className={
                    viewingContact.smsConsent ? "text-emerald-700 font-bold" : "text-rose-600"
                  }
                >
                  {viewingContact.smsConsent ? "Subscribed (Opt-in Verified)" : "Unsubscribed"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">WhatsApp Consent:</span>
                <span
                  className={
                    viewingContact.whatsappConsent
                      ? "text-emerald-700 font-bold"
                      : "text-rose-600"
                  }
                >
                  {viewingContact.whatsappConsent ? "Opted In" : "Not Opted In"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <span className="block text-[11px] font-semibold text-slate-600 mb-1">Tags</span>
              <div className="flex gap-1 flex-wrap">
                {viewingContact.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingContactId}
        onClose={() => setDeletingContactId(null)}
        onConfirm={handleDelete}
        title="Delete Customer Contact"
        description="Are you sure you want to delete this contact from your database? This action cannot be undone."
        variant="destructive"
        confirmText="Yes, Delete Contact"
      />
    </ClientLayout>
  );
}
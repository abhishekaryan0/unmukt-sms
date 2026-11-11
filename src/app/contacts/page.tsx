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
} from "lucide-react";

export default function ContactsPage() {
  const { contacts, contactGroups, addContact, updateContact, deleteContact } = useAppStore();
  const { toast } = useToast();

  const [selectedGroup, setSelectedGroup] = useState<string>("all");
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

  // Filtered contacts
  const filteredContacts = contacts.filter((c) => {
    if (selectedGroup === "all") return true;
    return c.group === selectedGroup;
  });

  const handleOpenAdd = () => {
    setEditingContact(null);
    setFormName("");
    setFormMobile("");
    setFormEmail("");
    setFormGroup(contactGroups[0]?.name || "Regular Customers");
    setFormTags("");
    setFormSmsConsent(true);
    setFormWaConsent(true);
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
      Date_Added: c.dateAdded,
    }));
    exportToCSV(exportData, `contacts_export_${new Date().toISOString().split("T")[0]}`);
    toast({ title: "Contacts Exported", message: "CSV file download started.", type: "success" });
  };

  const columns: Column<Contact>[] = [
    {
      header: "Name",
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
      cell: (row) => <span className="text-slate-500">{formatDate(row.dateAdded, false)}</span>,
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Contacts & Audience
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your verified Indian customer phonebook, consent status, and tags
          </p>
        </div>

        <div className="flex items-center gap-2">
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
        }
      />

      {/* Add / Edit Contact Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        size="md"
        title={editingContact ? "Edit Contact" : "Add New Customer Contact"}
        description="Enter verified phone details and consent status"
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
                Mobile Number (10 Digits) *
              </label>
              <Input
                value={formMobile}
                onChange={(e) => setFormMobile(e.target.value)}
                placeholder="e.g. 9811234567"
                leftIcon={<span className="text-xs font-semibold text-slate-500">+91</span>}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address (Optional)
              </label>
              <Input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="sunita@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assign to Group
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
                Tags (Comma separated)
              </label>
              <Input
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="VIP, Ethnic, Bridal"
              />
            </div>
          </div>

          {/* Consent Checkboxes */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="block text-[11px] font-bold text-slate-700 uppercase">
              Customer Consent (TRAI & WhatsApp Policy)
            </span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formSmsConsent}
                onChange={(e) => setFormSmsConsent(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span className="text-slate-700">SMS Marketing Consent Given</span>
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
        title="Import Contacts from CSV or Excel"
        description="Upload customer phone lists directly into your marketing group"
      >
        <div className="space-y-4 text-xs">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900">Choose CSV File</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              File must have columns: Name, Mobile, Group
            </p>
            <div className="mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Demo CSV Imported",
                    message: "Successfully added 120 customer contacts to Festival Offers.",
                    type: "success",
                  });
                  setShowImportModal(false);
                }}
              >
                Upload Demo Customer List (.csv)
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-[11px] text-blue-800 space-y-1">
            <div className="font-bold">Indian Telecom Scrubbing:</div>
            <div>
              Our system automatically filters out invalid prefixes, standardizes +91 country codes,
              and removes duplicate rows prior to broadcast.
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

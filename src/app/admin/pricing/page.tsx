"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastContext";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { PricingConfig } from "@/types";
import { Tag, Edit2, TrendingUp, DollarSign } from "lucide-react";

export default function AdminPricingPage() {
  const { pricing, updatePricing } = useAppStore();
  const { toast } = useToast();

  const [editingConfig, setEditingConfig] = useState<PricingConfig | null>(null);
  const [newSellingPrice, setNewSellingPrice] = useState("");

  const handleOpenEdit = (p: PricingConfig) => {
    setEditingConfig(p);
    setNewSellingPrice(p.sellingPrice.toString());
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingConfig) return;
    const price = parseFloat(newSellingPrice);
    if (!price || price <= editingConfig.supplierCost) {
      toast({
        title: "Invalid Pricing",
        message: `Selling price must be higher than wholesale cost (${formatINR(
          editingConfig.supplierCost
        )})`,
        type: "error",
      });
      return;
    }

    updatePricing(editingConfig.type, price);
    toast({
      title: "Pricing Updated",
      message: `${editingConfig.type} price updated to ${formatINR(price)}.`,
      type: "success",
    });

    setEditingConfig(null);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Pricing & Margin Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure customer selling tariffs, wholesale carrier costs, and automated gross margin calculation
          </p>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pricing.map((p) => {
          const gross = Number((p.sellingPrice - p.supplierCost).toFixed(2));
          const margin = Number(((gross / p.sellingPrice) * 100).toFixed(1));

          return (
            <div
              key={p.type}
              className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-card hover:shadow-elevated transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      p.channel === "whatsapp"
                        ? "bg-[#E8F8EE] text-[#075E54]"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {p.channel.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {margin}% Margin
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-2.5">{p.type}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{p.description}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center text-xs mb-3">
                  <div>
                    <div className="text-[10px] text-slate-400">Supplier</div>
                    <div className="font-bold text-slate-700">{formatINR(p.supplierCost)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Selling Price</div>
                    <div className="font-bold text-slate-900">{formatINR(p.sellingPrice)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-600 font-medium">Gross Profit</div>
                    <div className="font-bold text-emerald-600">+{formatINR(gross)}</div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(p)}
                  className="w-full text-xs font-semibold gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Update Selling Price</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Pricing Modal */}
      <Modal
        isOpen={!!editingConfig}
        onClose={() => setEditingConfig(null)}
        size="sm"
        title="Update Selling Tariff"
        description={`Configure customer price for ${editingConfig?.type}`}
      >
        {editingConfig && (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600">
              <div className="flex justify-between">
                <span>Carrier Wholesale Cost:</span>
                <span className="font-bold text-slate-900">
                  {formatINR(editingConfig.supplierCost)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Customer Selling Price (INR) *
              </label>
              <Input
                type="number"
                step="0.01"
                value={newSellingPrice}
                onChange={(e) => setNewSellingPrice(e.target.value)}
                leftIcon={<span className="text-xs font-bold text-slate-500">₹</span>}
                required
              />
            </div>

            {/* Live calculation */}
            {parseFloat(newSellingPrice) > editingConfig.supplierCost && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-900 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Gross Contribution:</span>
                  <span>
                    +{formatINR(parseFloat(newSellingPrice) - editingConfig.supplierCost)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-700">
                  <span>Gross Profit Margin:</span>
                  <span>
                    {(
                      ((parseFloat(newSellingPrice) - editingConfig.supplierCost) /
                        parseFloat(newSellingPrice)) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setEditingConfig(null)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-slate-900 text-white">
                Save Price
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </AdminLayout>
  );
}

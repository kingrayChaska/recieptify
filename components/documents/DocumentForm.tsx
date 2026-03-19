"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useDocuments } from "@/hooks/useDocuments";
import {
  generateDocumentNumber,
  calculateTotals,
  formatCurrency,
  cn,
} from "@/lib/utils";
import type { DocumentData, LineItem } from "@/lib/supabase/types";
import { DocumentPreview } from "./DocumentPreview";
import { v4 as uuidv4 } from "uuid";

interface DocumentFormProps {
  type: "invoice" | "receipt";
}

const TEMPLATES = [
  { id: "modern", label: "Modern", desc: "Clean green header" },
  { id: "minimal", label: "Minimal", desc: "Simple monochrome" },
  { id: "classic", label: "Classic", desc: "Traditional blue" },
] as const;

const CURRENCIES = ["USD", "EUR", "GBP", "NGN", "CAD", "AUD", "JPY"];

const emptyItem = (): LineItem => ({
  id: uuidv4(),
  name: "",
  quantity: 1,
  price: 0,
});

export const DocumentForm = ({ type }: DocumentFormProps) => {
  const router = useRouter();
  const { createDocument } = useDocuments();
  const supabase = createClient();

  const [template, setTemplate] = useState<"minimal" | "modern" | "classic">(
    "modern",
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [mounted, setMounted] = useState(false);

  // All random/date values start empty — populated after mount to avoid hydration mismatch
  const [form, setForm] = useState<
    Omit<DocumentData, "subtotal" | "taxAmount" | "total">
  >({
    documentNumber: "",
    businessName: "",
    businessEmail: "",
    businessAddress: "",
    customerName: "",
    customerEmail: "",
    customerAddress: "",
    date: "",
    dueDate: "",
    items: [],
    taxRate: 0,
    discount: 0,
    paymentStatus: "unpaid",
    paymentMethod: "",
    notes: "",
    currency: "USD",
  });

  // Only runs on the client — safe to use Math.random(), Date.now(), uuidv4()
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      documentNumber: generateDocumentNumber(type),
      date: new Date().toISOString().split("T")[0],
      items: [emptyItem()],
    }));
    setMounted(true);
  }, [type]);

  const { subtotal, taxAmount, total } = calculateTotals(
    form.items,
    form.taxRate ?? 0,
    form.discount ?? 0,
  );

  const documentData: DocumentData = { ...form, subtotal, taxAmount, total };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const addItem = () =>
    setForm((f) => ({ ...f, items: [...f.items, emptyItem()] }));

  const updateItem = (
    id: string,
    field: keyof LineItem,
    value: string | number,
  ) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const removeItem = (id: string) => {
    if (form.items.length === 1) return;
    setForm((f) => ({ ...f, items: f.items.filter((item) => item.id !== id) }));
  };

  const handleSave = async () => {
    if (
      !form.businessName ||
      !form.customerName ||
      form.items.some((i) => !i.name)
    )
      return;
    setSaving(true);

    let logoUrl: string | null = null;

    if (logoFile) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const path = `${user.id}/${uuidv4()}-${logoFile.name}`;
        const { data } = await supabase.storage
          .from("logos")
          .upload(path, logoFile);
        if (data) {
          const { data: urlData } = supabase.storage
            .from("logos")
            .getPublicUrl(data.path);
          logoUrl = urlData.publicUrl;
        }
      }
    }

    try {
      await createDocument(type, documentData, logoUrl, template);
      router.push(
        type === "invoice" ? "/dashboard/invoices" : "/dashboard/receipts",
      );
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  // Render a skeleton until client-side values are ready
  if (!mounted) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <div className="space-y-3 w-full max-w-xl px-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-[var(--border)] rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Mobile tabs */}
      <div className="md:hidden flex border-b border-[var(--border)]">
        {(["form", "preview"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-3 text-sm font-semibold capitalize transition-colors",
              activeTab === tab
                ? "border-b-2 border-[var(--brand)] text-[var(--brand)]"
                : "text-muted",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Form panel */}
        <div
          className={cn(
            "flex-1 overflow-y-auto p-6 scrollbar-thin",
            activeTab === "preview" && "hidden md:block",
          )}
        >
          <div className="max-w-xl mx-auto space-y-6">
            {/* Template */}
            <div>
              <label className="block text-xs font-semibold text-muted mb-2">
                Template
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={cn(
                      "border rounded-xl p-3 text-left transition-all",
                      template === t.id
                        ? "border-[var(--brand)] bg-[var(--brand)]/5"
                        : "border-[var(--border)] hover:border-[var(--brand)]/50",
                    )}
                  >
                    <div className="text-sm font-bold">{t.label}</div>
                    <div className="text-xs text-muted">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Logo */}
            <div>
              <label className="block text-xs font-semibold text-muted mb-2">
                Logo
              </label>
              <div className="flex items-center gap-3">
                {logoPreview && (
                  <div className="relative w-16 h-16 rounded-xl border border-[var(--border)] overflow-hidden">
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="w-full h-full object-contain p-1"
                    />
                    <button
                      onClick={() => {
                        setLogoFile(null);
                        setLogoPreview(null);
                      }}
                      className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
                <label className="flex items-center gap-2 border border-dashed border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-muted cursor-pointer hover:border-[var(--brand)] transition-colors">
                  <Upload className="w-4 h-4" />
                  Upload logo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>
            </div>

            {/* Business info */}
            <fieldset className="bg-card border border-[var(--border)] rounded-2xl p-5 space-y-3">
              <legend className="text-xs font-bold px-1 -mt-3 bg-card text-muted">
                Business Info
              </legend>
              <input
                placeholder="Business name *"
                value={form.businessName}
                onChange={(e) =>
                  setForm({ ...form, businessName: e.target.value })
                }
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
              />
              <input
                placeholder="Business email"
                type="email"
                value={form.businessEmail}
                onChange={(e) =>
                  setForm({ ...form, businessEmail: e.target.value })
                }
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
              />
              <input
                placeholder="Business address"
                value={form.businessAddress}
                onChange={(e) =>
                  setForm({ ...form, businessAddress: e.target.value })
                }
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
              />
            </fieldset>

            {/* Customer info */}
            <fieldset className="bg-card border border-[var(--border)] rounded-2xl p-5 space-y-3">
              <legend className="text-xs font-bold px-1 -mt-3 bg-card text-muted">
                Customer Info
              </legend>
              <input
                placeholder="Customer name *"
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
              />
              <input
                placeholder="Customer email"
                type="email"
                value={form.customerEmail}
                onChange={(e) =>
                  setForm({ ...form, customerEmail: e.target.value })
                }
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
              />
              <input
                placeholder="Customer address"
                value={form.customerAddress}
                onChange={(e) =>
                  setForm({ ...form, customerAddress: e.target.value })
                }
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
              />
            </fieldset>

            {/* Dates & Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">
                  Date *
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full bg-card border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
                />
              </div>
              {type === "invoice" && (
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">
                    Due date
                  </label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm({ ...form, dueDate: e.target.value })
                    }
                    className="w-full bg-card border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">
                  Currency
                </label>
                <select
                  value={form.currency}
                  onChange={(e) =>
                    setForm({ ...form, currency: e.target.value })
                  }
                  className="w-full bg-card border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">
                  Payment status
                </label>
                <select
                  value={form.paymentStatus}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      paymentStatus: e.target
                        .value as DocumentData["paymentStatus"],
                    })
                  }
                  className="w-full bg-card border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                </select>
              </div>
            </div>

            {/* Line items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-muted">
                  Line Items *
                </label>
                <button
                  onClick={addItem}
                  className="flex items-center gap-1 text-xs text-[var(--brand)] font-semibold hover:underline"
                >
                  <Plus className="w-3 h-3" /> Add item
                </button>
              </div>
              <div className="space-y-2">
                {form.items.map((item) => (
                  <div key={item.id} className="flex gap-2 items-center">
                    <input
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(item.id, "name", e.target.value)
                      }
                      className="flex-1 bg-card border border-[var(--border)] rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--brand)] transition-colors"
                    />
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, "quantity", Number(e.target.value))
                      }
                      className="w-16 bg-card border border-[var(--border)] rounded-xl px-2 py-2 text-sm outline-none focus:border-[var(--brand)] transition-colors text-center"
                    />
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.price}
                      onChange={(e) =>
                        updateItem(item.id, "price", Number(e.target.value))
                      }
                      className="w-24 bg-card border border-[var(--border)] rounded-xl px-2 py-2 text-sm outline-none focus:border-[var(--brand)] transition-colors"
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={form.items.length === 1}
                      className="p-2 text-muted hover:text-red-500 transition-colors disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-card border border-[var(--border)] rounded-2xl p-5">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">
                    Tax rate (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.taxRate ?? 0}
                    onChange={(e) =>
                      setForm({ ...form, taxRate: Number(e.target.value) })
                    }
                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--brand)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">
                    Discount ({form.currency})
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.discount ?? 0}
                    onChange={(e) =>
                      setForm({ ...form, discount: Number(e.target.value) })
                    }
                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--brand)] transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal, form.currency)}</span>
                </div>
                {(form.taxRate ?? 0) > 0 && (
                  <div className="flex justify-between text-muted">
                    <span>Tax ({form.taxRate}%)</span>
                    <span>{formatCurrency(taxAmount, form.currency)}</span>
                  </div>
                )}
                {(form.discount ?? 0) > 0 && (
                  <div className="flex justify-between text-muted">
                    <span>Discount</span>
                    <span>
                      -{formatCurrency(form.discount!, form.currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-base pt-2 border-t border-[var(--border)]">
                  <span>Total</span>
                  <span className="text-[var(--brand)]">
                    {formatCurrency(total, form.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">
                Notes
              </label>
              <textarea
                placeholder="Payment terms, additional info..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full bg-card border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors resize-none"
              />
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving || !form.businessName || !form.customerName}
              className="w-full bg-[var(--brand)] text-white py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving..." : `Save ${type}`}
            </button>
          </div>
        </div>

        {/* Preview panel */}
        <div
          className={cn(
            "w-full md:w-[460px] border-l border-[var(--border)] overflow-y-auto bg-[var(--bg)] scrollbar-thin",
            activeTab === "form" && "hidden md:block",
          )}
        >
          <DocumentPreview
            data={documentData}
            type={type}
            template={template}
            logoUrl={logoPreview}
          />
        </div>
      </div>
    </div>
  );
};

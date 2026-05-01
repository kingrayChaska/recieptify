"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, Loader2, Upload, X } from "lucide-react";
import { cn, RECEIPT_CATEGORIES, generateDocumentNumber, calculateTotals } from "@/lib/utils";
import { useReceipts } from "@/hooks/useReceipts";
import { TemplateSelector } from "./TemplateSelector";
import { ReceiptPreview } from "./ReceiptPreview";
import type { ReceiptTemplate, ReceiptItem, ReceiptTemplateData } from "@/lib/supabase/types";
import type { ReceiptCategory } from "@/lib/supabase/types";
import { v4 as uuid } from "uuid";

const emptyItem = (): ReceiptItem => ({ id: uuid(), name: "", quantity: 1, price: 0 });

const DEFAULT_FORM = {
  businessName: "",
  businessEmail: "",
  businessAddress: "",
  customerName: "",
  date: new Date().toISOString().split("T")[0],
  category: "Uncategorized" as ReceiptCategory,
  notes: "",
  currency: "NGN",
};

export const ReceiptForm = () => {
  const router = useRouter();
  const { createReceipt, uploadImage } = useReceipts();

  const [template, setTemplate] = useState<ReceiptTemplate>("modern");
  const [form, setForm] = useState(DEFAULT_FORM);
  const [items, setItems] = useState<ReceiptItem[]>([emptyItem()]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [receiptId] = useState(() => generateDocumentNumber("receipt"));

  const set = (k: keyof typeof DEFAULT_FORM, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const setItem = (id: string, k: keyof ReceiptItem, v: string | number) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, [k]: v } : i)));

  const addItem = () => setItems((p) => [...p, emptyItem()]);
  const removeItem = (id: string) => setItems((p) => p.filter((i) => i.id !== id));

  const handleLogo = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }, []);

  const { subtotal, total } = calculateTotals(items);

  const templateData: ReceiptTemplateData = {
    receiptId,
    businessName: form.businessName || "Your Business",
    businessEmail: form.businessEmail || undefined,
    businessAddress: form.businessAddress || undefined,
    customerName: form.customerName || undefined,
    items,
    subtotal,
    total,
    date: form.date,
    logoUrl: logoPreview || undefined,
    notes: form.notes || undefined,
    currency: form.currency,
  };

  const handleSave = async () => {
    if (!form.businessName && items.every((i) => !i.name)) return;
    setSaving(true);
    try {
      let image_url: string | null = null;
      if (logoFile) image_url = await uploadImage(logoFile);

      await createReceipt({
        merchant_name: form.businessName || null,
        amount: total,
        currency: form.currency,
        category: form.category,
        date: new Date(form.date).toISOString(),
        notes: form.notes || null,
        source: "manual",
        image_url,
      });

      router.push("/receipts");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message ?? JSON.stringify(err);
      console.error("Save failed:", msg);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors";
  const labelCls = "block text-xs font-semibold text-muted mb-1.5";
  const sectionCls = "bg-card border border-[var(--border)] rounded-2xl p-5 space-y-4";

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* ── LEFT: Form ── */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* Template selector */}
        <div className={sectionCls}>
          <h3 className="font-bold text-sm">Choose Template</h3>
          <TemplateSelector selected={template} onChange={setTemplate} />
        </div>

        {/* Business Info */}
        <div className={sectionCls}>
          <h3 className="font-bold text-sm">Business Info</h3>

          {/* Logo upload */}
          <div>
            <label className={labelCls}>Logo (optional)</label>
            <div className="flex items-center gap-3">
              {logoPreview ? (
                <div className="relative w-14 h-14 rounded-xl border border-[var(--border)] overflow-hidden shrink-0">
                  <img src={logoPreview} alt="logo" className="w-full h-full object-contain" />
                  <button
                    onClick={() => { setLogoFile(null); setLogoPreview(""); }}
                    className="absolute top-0.5 right-0.5 bg-black/50 rounded-full p-0.5"
                  >
                    <X className="w-2.5 h-2.5 text-white" />
                  </button>
                </div>
              ) : (
                <label className="w-14 h-14 rounded-xl border-2 border-dashed border-[var(--border)] flex items-center justify-center cursor-pointer hover:border-[var(--brand)] transition-colors shrink-0">
                  <Upload className="w-4 h-4 text-muted" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                </label>
              )}
              <input
                value={form.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                placeholder="Business name *"
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Email</label>
              <input value={form.businessEmail} onChange={(e) => set("businessEmail", e.target.value)} placeholder="email@business.com" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Address</label>
              <input value={form.businessAddress} onChange={(e) => set("businessAddress", e.target.value)} placeholder="123 Street, City" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className={sectionCls}>
          <h3 className="font-bold text-sm">Customer Info</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelCls}>Customer Name</label>
              <input value={form.customerName} onChange={(e) => set("customerName", e.target.value)} placeholder="Customer / Client name" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
                {RECEIPT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className={sectionCls}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm">Items</h3>
            <button onClick={addItem} className="flex items-center gap-1 text-xs font-semibold text-[var(--brand)] hover:opacity-80 transition-opacity">
              <Plus className="w-3.5 h-3.5" /> Add item
            </button>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-muted uppercase tracking-widest px-1">
              <span className="col-span-5">Name</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-3 text-right">Price (₦)</span>
              <span className="col-span-2" />
            </div>

            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <input
                  value={item.name}
                  onChange={(e) => setItem(item.id, "name", e.target.value)}
                  placeholder="Item name"
                  className={cn(inputCls, "col-span-5 py-2")}
                />
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => setItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                  className={cn(inputCls, "col-span-2 py-2 text-center")}
                />
                <input
                  type="number"
                  min={0}
                  value={item.price || ""}
                  onChange={(e) => setItem(item.id, "price", parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className={cn(inputCls, "col-span-3 py-2 text-right")}
                />
                <button
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  className="col-span-2 flex justify-center p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/5 transition-all disabled:opacity-20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2 border-t border-[var(--border)]">
            <div className="space-y-1 text-sm w-44">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span><span>{new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(subtotal)}</span>
              </div>
              <div className="flex justify-between font-black text-[var(--brand)]">
                <span>Total</span><span>{new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className={sectionCls}>
          <h3 className="font-bold text-sm">Notes (optional)</h3>
          <textarea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Thank you for your business..."
            rows={2}
            className={cn(inputCls, "resize-none")}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving || (!form.businessName && items.every((i) => !i.name))}
          className="w-full flex items-center justify-center gap-2 bg-[var(--brand)] text-white py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Receipt</>}
        </button>
      </div>

      {/* ── RIGHT: Live Preview ── */}
      <div className="lg:w-[380px] w-full lg:sticky lg:top-6">
        <ReceiptPreview template={template} data={templateData} />
      </div>
    </div>
  );
};

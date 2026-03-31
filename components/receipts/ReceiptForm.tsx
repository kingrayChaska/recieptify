"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import { cn, RECEIPT_CATEGORIES, formatNaira } from "@/lib/utils";
import { useReceipts } from "@/hooks/useReceipts";
import { ReceiptUploader } from "./ReceiptUploader";
import { BankAlertParser } from "./BankAlertParser";
import type { OcrResult } from "@/lib/ocr";
import type { ReceiptCategory } from "@/lib/supabase/types";

type Tab = "upload" | "manual" | "bank_alert";

export const ReceiptForm = () => {
  const router = useRouter();
  const { createReceipt, uploadImage } = useReceipts();
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const [saving, setSaving] = useState(false);
  const [ocrFile, setOcrFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    merchant_name: "",
    amount: "",
    currency: "NGN",
    category: "Uncategorized" as ReceiptCategory,
    date: new Date().toISOString().split("T")[0],
    notes: "",
    raw_text: "",
    ocr_confidence: null as number | null,
  });

  const handleOcrResult = (result: OcrResult, file: File) => {
    setOcrFile(file);
    setForm((prev) => ({
      ...prev,
      merchant_name: result.merchant_name ?? prev.merchant_name,
      amount: result.amount?.toString() ?? prev.amount,
      category: result.category,
      date: result.date ? new Date(result.date).toISOString().split("T")[0] : prev.date,
      raw_text: result.raw_text,
      ocr_confidence: result.confidence,
    }));
  };

  const handleBankAlert = (parsed: { amount: number | null; merchant: string | null; date: Date | null }, raw: string) => {
    setForm((prev) => ({
      ...prev,
      merchant_name: parsed.merchant ?? prev.merchant_name,
      amount: parsed.amount?.toString() ?? prev.amount,
      date: parsed.date ? parsed.date.toISOString().split("T")[0] : prev.date,
      raw_text: raw,
    }));
  };

  const handleSave = async () => {
    if (!form.merchant_name && !form.amount) return;
    setSaving(true);

    try {
      let image_url: string | null = null;
      if (ocrFile) {
        image_url = await uploadImage(ocrFile);
      }

      await createReceipt({
        merchant_name: form.merchant_name || null,
        amount: form.amount ? parseFloat(form.amount) : null,
        currency: form.currency,
        category: form.category,
        date: new Date(form.date).toISOString(),
        notes: form.notes || null,
        raw_text: form.raw_text || null,
        ocr_confidence: form.ocr_confidence,
        source: activeTab === "bank_alert" ? "bank_alert" : activeTab === "upload" ? "upload" : "manual",
        bank_alert_raw: activeTab === "bank_alert" ? form.raw_text : null,
        image_url,
      });

      router.push("/receipts");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "upload", label: "📷 Upload Receipt" },
    { id: "bank_alert", label: "📱 Bank Alert" },
    { id: "manual", label: "✏️ Manual Entry" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Tabs */}
      <div className="flex bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-1 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all",
              activeTab === tab.id
                ? "bg-[var(--brand)] text-white shadow-sm"
                : "text-muted hover:text-[var(--text)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input method */}
      {activeTab === "upload" && (
        <ReceiptUploader onResult={handleOcrResult} />
      )}
      {activeTab === "bank_alert" && (
        <BankAlertParser onParsed={handleBankAlert} />
      )}

      {/* Form fields */}
      <div className="bg-card border border-[var(--border)] rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-sm">Receipt Details</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-muted mb-1.5">Merchant / Store Name</label>
            <input
              value={form.merchant_name}
              onChange={(e) => setForm({ ...form, merchant_name: e.target.value })}
              placeholder="e.g. Chicken Republic"
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted font-mono">₦</span>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl pl-8 pr-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-muted mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ReceiptCategory })}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors"
            >
              {RECEIPT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-muted mb-1.5">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any additional notes..."
              rows={2}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors resize-none"
            />
          </div>
        </div>

        {form.amount && (
          <div className="bg-[var(--brand)]/5 border border-[var(--brand)]/20 rounded-xl px-4 py-3 text-sm font-bold text-[var(--brand)]">
            Total: {formatNaira(parseFloat(form.amount) || 0)}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving || (!form.merchant_name && !form.amount)}
          className="w-full flex items-center justify-center gap-2 bg-[var(--brand)] text-white py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Receipt</>}
        </button>
      </div>
    </div>
  );
};

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { ArrowLeft, Edit2, Trash2, Receipt, Save } from "lucide-react";
import Link from "next/link";
import { formatNaira, formatDate, RECEIPT_CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS, cn } from "@/lib/utils";
import type { Receipt, ReceiptCategory } from "@/lib/supabase/types";

export default function ReceiptDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ merchant_name: "", amount: "", category: "Uncategorized" as ReceiptCategory, notes: "", date: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("receipts").select("*").eq("id", id).single();
      if (data) {
        const r = data as Receipt;
        setReceipt(r);
        setForm({
          merchant_name: r.merchant_name ?? "",
          amount: r.amount?.toString() ?? "",
          category: r.category as ReceiptCategory,
          notes: r.notes ?? "",
          date: r.date.split("T")[0],
        });
      }
      setLoading(false);
    };
    fetch();
  }, [id, supabase]);

  const handleSave = async () => {
    if (!receipt) return;
    setSaving(true);
    const { data } = await supabase.from("receipts").update({
      merchant_name: form.merchant_name,
      amount: parseFloat(form.amount) || null,
      category: form.category,
      notes: form.notes,
      date: new Date(form.date).toISOString(),
    }).eq("id", id).select().single();
    if (data) setReceipt(data as Receipt);
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this receipt?")) return;
    await supabase.from("receipts").delete().eq("id", id);
    router.push("/receipts");
  };

  if (loading) return (
    <div className="flex h-screen bg-base">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-muted">Loading...</div>
      </div>
    </div>
  );

  if (!receipt) return (
    <div className="flex h-screen bg-base">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted">Receipt not found</p>
          <Link href="/receipts" className="text-[var(--brand)] text-sm mt-2 block">Back to receipts</Link>
        </div>
      </div>
    </div>
  );

  const icon = CATEGORY_ICONS[receipt.category as ReceiptCategory] ?? "📄";
  const color = CATEGORY_COLORS[receipt.category as ReceiptCategory] ?? "#9ca3af";

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20 bg-[var(--bg)]/80 backdrop-blur border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/receipts" className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-muted transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-extrabold text-lg">Receipt Detail</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setEditing(!editing)} className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] rounded-xl text-xs font-semibold hover:border-[var(--brand)] transition-colors">
              <Edit2 className="w-3.5 h-3.5" /> {editing ? "Cancel" : "Edit"}
            </button>
            <button onClick={handleDelete} className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500/20 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/5 transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </header>

        <div className="max-w-2xl mx-auto p-6 space-y-5 animate-fade-in">
          {/* Receipt card */}
          <div className="bg-card border border-[var(--border)] rounded-2xl overflow-hidden">
            {/* Image preview */}
            {receipt.image_url && (
              <div className="bg-[var(--bg)] h-48 flex items-center justify-center border-b border-[var(--border)]">
                <img src={receipt.image_url} alt="Receipt" className="max-h-full max-w-full object-contain" />
              </div>
            )}

            <div className="p-6">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1.5">Merchant</label>
                    <input value={form.merchant_name} onChange={(e) => setForm({ ...form, merchant_name: e.target.value })}
                      className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-muted mb-1.5">Amount (₦)</label>
                      <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted mb-1.5">Date</label>
                      <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1.5">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ReceiptCategory })}
                      className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)]">
                      {RECEIPT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1.5">Notes</label>
                    <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
                      className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] resize-none" />
                  </div>
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 bg-[var(--brand)] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
                    <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: color + "20" }}>
                      {icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold">{receipt.merchant_name ?? "Unknown merchant"}</h2>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-lg" style={{ color, backgroundColor: color + "15" }}>
                        {receipt.category}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted mb-0.5">Amount</p>
                      <p className="font-extrabold text-2xl text-[var(--brand)]">{formatNaira(receipt.amount ?? 0)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-0.5">Date</p>
                      <p className="font-semibold">{formatDate(receipt.date)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-0.5">Source</p>
                      <p className="font-semibold capitalize">{receipt.source}</p>
                    </div>
                    {receipt.ocr_confidence && (
                      <div>
                        <p className="text-xs text-muted mb-0.5">AI Confidence</p>
                        <p className="font-semibold">{Math.round(receipt.ocr_confidence)}%</p>
                      </div>
                    )}
                  </div>

                  {receipt.notes && (
                    <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-4">
                      <p className="text-xs text-muted mb-1">Notes</p>
                      <p className="text-sm">{receipt.notes}</p>
                    </div>
                  )}

                  {receipt.raw_text && (
                    <div>
                      <p className="text-xs text-muted mb-1.5">Extracted Text (OCR)</p>
                      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-4 font-mono text-xs text-muted max-h-32 overflow-y-auto whitespace-pre-wrap">
                        {receipt.raw_text}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

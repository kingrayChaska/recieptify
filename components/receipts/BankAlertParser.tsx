"use client";

import { useState } from "react";
import { parseBankAlert } from "@/lib/utils";
import { Smartphone, Zap } from "lucide-react";

interface BankAlertParserProps {
  onParsed: (result: { amount: number | null; merchant: string | null; date: Date | null }, raw: string) => void;
}

const SAMPLES = [
  "Acct:1234 Debit NGN4,500.00 POS CHICKEN REPUBLIC 23/03/2024",
  "Your Acct ***5678 was debited with NGN 18,700. Desc:POS/SHOPRITE Lagos",
  "Debit Alert! Amount:NGN2000.00 at BOLT RIDES on 24/03/2024",
];

export const BankAlertParser = ({ onParsed }: BankAlertParserProps) => {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState<{ amount: number | null; merchant: string | null; date: Date | null } | null>(null);

  const handleParse = () => {
    if (!text.trim()) return;
    const result = parseBankAlert(text);
    setParsed(result);
    onParsed(result, text);
  };

  return (
    <div className="space-y-3">
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Smartphone className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-blue-400">Bank Alert Parser</span>
        </div>
        <p className="text-xs text-muted">Paste your bank SMS/notification text and we&apos;ll extract the details automatically.</p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste bank alert SMS here..."
        rows={4}
        className="w-full bg-card border border-[var(--border)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--brand)] transition-colors resize-none font-mono"
      />

      {/* Sample alerts */}
      <div>
        <p className="text-xs text-muted mb-2">Try a sample:</p>
        <div className="space-y-1.5">
          {SAMPLES.map((s, i) => (
            <button
              key={i}
              onClick={() => setText(s)}
              className="w-full text-left text-xs bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 py-2 text-muted hover:border-[var(--brand)] hover:text-[var(--text)] transition-all font-mono truncate"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleParse}
        disabled={!text.trim()}
        className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <Zap className="w-4 h-4" /> Parse Alert
      </button>

      {parsed && (
        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 space-y-1.5">
          <p className="text-xs font-bold text-green-500 mb-2">✓ Extracted Data</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-muted">Merchant:</span> <span className="font-semibold">{parsed.merchant ?? "—"}</span></div>
            <div><span className="text-muted">Amount:</span> <span className="font-semibold">₦{parsed.amount?.toLocaleString() ?? "—"}</span></div>
            <div><span className="text-muted">Date:</span> <span className="font-semibold">{parsed.date?.toLocaleDateString() ?? "—"}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

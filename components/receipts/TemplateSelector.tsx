"use client";

import { cn } from "@/lib/utils";
import type { ReceiptTemplate } from "@/lib/supabase/types";

const TEMPLATES: { id: ReceiptTemplate; label: string; description: string; accent: string }[] = [
  { id: "modern", label: "Modern", description: "Clean with green header", accent: "bg-emerald-500" },
  { id: "minimal", label: "Minimal", description: "Simple & elegant", accent: "bg-gray-900" },
  { id: "classic", label: "Classic", description: "Retro paper style", accent: "bg-amber-800" },
];

interface TemplateSelectorProps {
  selected: ReceiptTemplate;
  onChange: (t: ReceiptTemplate) => void;
}

export const TemplateSelector = ({ selected, onChange }: TemplateSelectorProps) => (
  <div className="grid grid-cols-3 gap-3">
    {TEMPLATES.map((t) => (
      <button
        key={t.id}
        onClick={() => onChange(t.id)}
        className={cn(
          "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-left",
          selected === t.id
            ? "border-[var(--brand)] bg-[var(--brand)]/5"
            : "border-[var(--border)] hover:border-[var(--brand)]/40 bg-card"
        )}
      >
        <div className={cn("w-full h-8 rounded-lg", t.accent)} />
        <div className="w-full">
          <p className="text-xs font-bold">{t.label}</p>
          <p className="text-[10px] text-muted">{t.description}</p>
        </div>
        {selected === t.id && (
          <div className="w-2 h-2 rounded-full bg-[var(--brand)] self-end" />
        )}
      </button>
    ))}
  </div>
);

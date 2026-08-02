"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import type { ReceiptTemplate, ReceiptTemplateData } from "@/lib/supabase/types";
import { ModernTemplate } from "./templates/ModernTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";

const THEME_COLORS = ["#22c55e", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6"];

interface ReceiptPreviewProps {
  template: ReceiptTemplate;
  data: ReceiptTemplateData;
}

const TEMPLATE_MAP = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  classic: ClassicTemplate,
};

export const ReceiptPreview = ({ template, data }: ReceiptPreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [accentColor, setAccentColor] = useState("#22c55e");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const rootColor = getComputedStyle(document.documentElement).getPropertyValue("--brand").trim();
    setAccentColor(rootColor || "#22c55e");
  }, []);

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "px", format: [canvas.width / 2, canvas.height / 2] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`receipt-${data.receiptId}.pdf`);
    } finally {
      setExporting(false);
    }
  };

  const Template = TEMPLATE_MAP[template];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-muted uppercase tracking-widest">Live Preview</p>
        <button
          onClick={handleDownload}
          disabled={exporting}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--brand)] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          {exporting ? "Exporting..." : "Download PDF"}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {THEME_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setAccentColor(color)}
            className="h-8 w-8 rounded-full border-2 transition-transform hover:scale-110"
            style={{
              backgroundColor: color,
              borderColor: accentColor === color ? "#111827" : "transparent",
            }}
            aria-label={`Select ${color} accent`}
          />
        ))}
      </div>

      {/* Mobile-sized preview container */}
      <div className="flex justify-center">
        <div className="w-[320px] transition-all duration-300" ref={previewRef}>
          <Template data={data} accentColor={accentColor} />
        </div>
      </div>
    </div>
  );
};

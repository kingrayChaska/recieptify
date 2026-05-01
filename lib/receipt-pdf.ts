import type { Receipt } from "@/lib/supabase/types";
import { CATEGORY_ICONS } from "@/lib/utils";
import type { ReceiptCategory } from "@/lib/supabase/types";

export const downloadReceiptPdf = async (receipt: Receipt) => {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a5" });

  const W = doc.internal.pageSize.getWidth();
  const accent = [34, 197, 94] as [number, number, number]; // emerald-500
  const gray = [107, 114, 128] as [number, number, number];

  // Header bar
  doc.setFillColor(...accent);
  doc.rect(0, 0, W, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("RECEIPT", 10, 12);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Recieptify", W - 10, 12, { align: "right" });

  // Merchant & amount
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  const icon = CATEGORY_ICONS[receipt.category as ReceiptCategory] ?? "";
  doc.text(receipt.merchant_name ?? "Unknown Merchant", 10, 42);

  doc.setFontSize(22);
  doc.setTextColor(...accent);
  const amount = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(receipt.amount ?? 0);
  doc.text(amount, 10, 54);

  // Divider
  doc.setDrawColor(229, 231, 235);
  doc.line(10, 60, W - 10, 60);

  // Details grid
  const details: [string, string][] = [
    ["Category", `${icon} ${receipt.category}`],
    ["Date", new Intl.DateTimeFormat("en-NG", { year: "numeric", month: "long", day: "numeric" }).format(new Date(receipt.date))],
    ["Source", receipt.source.replace("_", " ")],
    ...(receipt.ocr_confidence ? [["AI Confidence", `${Math.round(receipt.ocr_confidence)}%`] as [string, string]] : []),
  ];

  let y = 70;
  doc.setFontSize(9);
  for (const [label, value] of details) {
    doc.setTextColor(...gray);
    doc.setFont("helvetica", "normal");
    doc.text(label, 10, y);
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.text(value, W / 2, y);
    y += 10;
  }

  if (receipt.notes) {
    doc.line(10, y, W - 10, y);
    y += 8;
    doc.setTextColor(...gray);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Notes", 10, y);
    y += 6;
    doc.setTextColor(30, 30, 30);
    const lines = doc.splitTextToSize(receipt.notes, W - 20);
    doc.text(lines, 10, y);
    y += lines.length * 5;
  }

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(200, 200, 200);
  doc.text("Generated with Recieptify", W / 2, doc.internal.pageSize.getHeight() - 8, { align: "center" });

  const filename = `receipt-${receipt.merchant_name?.replace(/\s+/g, "-").toLowerCase() ?? receipt.id}-${receipt.date.split("T")[0]}.pdf`;
  doc.save(filename);
};

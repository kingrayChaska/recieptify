import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { DocumentData } from "@/lib/supabase/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export const generatePDF = (
  data: DocumentData,
  type: "invoice" | "receipt",
  template: "minimal" | "modern" | "classic",
  logoUrl?: string | null
): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  const themes = {
    minimal: { primary: [30, 30, 30] as [number, number, number], accent: [120, 120, 120] as [number, number, number] },
    modern: { primary: [34, 197, 94] as [number, number, number], accent: [21, 128, 61] as [number, number, number] },
    classic: { primary: [37, 99, 235] as [number, number, number], accent: [29, 78, 216] as [number, number, number] },
  };

  const theme = themes[template];
  const title = type === "invoice" ? "INVOICE" : "RECEIPT";

  // Header background
  doc.setFillColor(...theme.primary);
  doc.rect(0, 0, pageWidth, 45, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text(title, 15, 25);

  // Document number
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`#${data.documentNumber}`, 15, 35);

  // Business name (top right)
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(data.businessName, pageWidth - 15, 20, { align: "right" });

  if (data.businessEmail) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(data.businessEmail, pageWidth - 15, 28, { align: "right" });
  }

  if (data.businessAddress) {
    doc.setFontSize(9);
    doc.text(data.businessAddress, pageWidth - 15, 35, { align: "right" });
  }

  // Bill to section
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", 15, 60);

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(data.customerName, 15, 68);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  if (data.customerEmail) doc.text(data.customerEmail, 15, 75);
  if (data.customerAddress) doc.text(data.customerAddress, 15, 82);

  // Date info (right side)
  const dateY = 60;
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("DATE", pageWidth - 80, dateY);
  doc.text("STATUS", pageWidth - 40, dateY);

  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(data.date), pageWidth - 80, dateY + 8);

  const statusColors: Record<string, [number, number, number]> = {
    paid: [34, 197, 94],
    unpaid: [239, 68, 68],
    partial: [234, 179, 8],
  };
  doc.setTextColor(...(statusColors[data.paymentStatus] || [30, 30, 30]));
  doc.setFont("helvetica", "bold");
  doc.text(data.paymentStatus.toUpperCase(), pageWidth - 40, dateY + 8);

  if (data.dueDate) {
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "bold");
    doc.text("DUE DATE", pageWidth - 80, dateY + 18);
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "normal");
    doc.text(formatDate(data.dueDate), pageWidth - 80, dateY + 26);
  }

  // Items table
  autoTable(doc, {
    startY: 98,
    head: [["Item", "Qty", "Unit Price", "Total"]],
    body: data.items.map((item) => [
      item.name,
      item.quantity.toString(),
      formatCurrency(item.price, data.currency),
      formatCurrency(item.quantity * item.price, data.currency),
    ]),
    theme: "grid",
    headStyles: {
      fillColor: theme.primary,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: [30, 30, 30] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { halign: "center", cellWidth: 20 },
      2: { halign: "right", cellWidth: 35 },
      3: { halign: "right", cellWidth: 35 },
    },
  });

  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // Totals
  const totalsX = pageWidth - 75;
  let currentY = finalY;

  const addTotalRow = (label: string, value: string, bold = false) => {
    doc.setFontSize(9);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(label, totalsX, currentY);
    doc.setTextColor(30, 30, 30);
    doc.text(value, pageWidth - 15, currentY, { align: "right" });
    currentY += 8;
  };

  addTotalRow("Subtotal", formatCurrency(data.subtotal, data.currency));
  if (data.taxRate && data.taxAmount) {
    addTotalRow(`Tax (${data.taxRate}%)`, formatCurrency(data.taxAmount, data.currency));
  }
  if (data.discount) {
    addTotalRow("Discount", `-${formatCurrency(data.discount, data.currency)}`);
  }

  // Total line
  doc.setDrawColor(...theme.primary);
  doc.setLineWidth(0.5);
  doc.line(totalsX, currentY, pageWidth - 15, currentY);
  currentY += 6;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...theme.primary);
  doc.text("TOTAL", totalsX, currentY);
  doc.text(formatCurrency(data.total, data.currency), pageWidth - 15, currentY, { align: "right" });

  // Notes
  if (data.notes) {
    currentY += 20;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("NOTES", 15, currentY);
    currentY += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    const splitNotes = doc.splitTextToSize(data.notes, pageWidth - 30);
    doc.text(splitNotes, 15, currentY);
  }

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFillColor(...theme.primary);
  doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Generated with Recieptify", pageWidth / 2, pageHeight - 4, { align: "center" });

  return doc;
};

export const downloadPDF = (
  data: DocumentData,
  type: "invoice" | "receipt",
  template: "minimal" | "modern" | "classic",
  logoUrl?: string | null
) => {
  const doc = generatePDF(data, type, template, logoUrl);
  const filename = `${type}-${data.documentNumber}.pdf`;
  doc.save(filename);
};

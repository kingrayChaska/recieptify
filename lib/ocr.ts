"use client";

import type { ReceiptCategory } from "./supabase/types";
import { autoCategory } from "./utils";

export interface OcrResult {
  raw_text: string;
  merchant_name: string | null;
  amount: number | null;
  date: string | null;
  category: ReceiptCategory;
  confidence: number;
}

export const runOcr = async (
  imageFile: File,
  onProgress?: (pct: number) => void
): Promise<OcrResult> => {
  // Dynamic import so Tesseract is only loaded client-side
  const Tesseract = (await import("tesseract.js")).default;

  const result = await Tesseract.recognize(imageFile, "eng", {
    logger: (m) => {
      if (m.status === "recognizing text" && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });

  const raw_text = result.data.text;
  const confidence = result.data.confidence;

  const merchant_name = extractMerchant(raw_text);
  const amount = extractAmount(raw_text);
  const date = extractDate(raw_text);
  const category = autoCategory(raw_text + " " + (merchant_name ?? ""));

  return { raw_text, merchant_name, amount, date, category, confidence };
};

const extractMerchant = (text: string): string | null => {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  // Usually merchant name is in first 3 non-empty lines
  const candidates = lines.slice(0, 3);
  const cleaned = candidates.find((l) =>
    l.length > 2 && l.length < 60 && !/\d{5,}/.test(l) && !/total|amount|date|tax|vat/i.test(l)
  );
  return cleaned ?? null;
};

const extractAmount = (text: string): number | null => {
  // Match patterns like: Total: 4,500.00 / ₦3500 / NGN 2,000
  const patterns = [
    /(?:total|amount|grand\s*total|subtotal)\s*[:\-]?\s*(?:NGN|₦)?\s*([0-9,]+(?:\.[0-9]{2})?)/gi,
    /(?:NGN|₦)\s*([0-9,]+(?:\.[0-9]{2})?)/gi,
    /([0-9,]+\.[0-9]{2})\s*(?:NGN)?$/gm,
  ];

  let best: number | null = null;
  for (const pattern of patterns) {
    const matches = [...text.matchAll(pattern)];
    if (matches.length) {
      const amounts = matches.map((m) => parseFloat(m[1].replace(/,/g, "")));
      const candidate = Math.max(...amounts);
      if (!best || candidate > best) best = candidate;
    }
  }
  return best;
};

const extractDate = (text: string): string | null => {
  const patterns = [
    /(\d{2}[\/\-]\d{2}[\/\-]\d{4})/,
    /(\d{4}[\/\-]\d{2}[\/\-]\d{2})/,
    /(\d{2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const parsed = new Date(match[1]);
      if (!isNaN(parsed.getTime())) return parsed.toISOString();
    }
  }
  return null;
};

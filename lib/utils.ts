import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ReceiptCategory } from "./supabase/types";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatCurrency = (amount: number, currency = "USD"): string => {
  try {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

export const formatNaira = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  return new Intl.DateTimeFormat("en-NG", { year: "numeric", month: "long", day: "numeric" }).format(new Date(dateStr));
};

export const formatDateShort = (dateStr: string): string => {
  return new Intl.DateTimeFormat("en-NG", { month: "short", day: "numeric" }).format(new Date(dateStr));
};

export const generateDocumentNumber = (type: "invoice" | "receipt"): string => {
  const prefix = type === "invoice" ? "INV" : "REC";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
};

export const generateShareToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const generateApiKey = (): { key: string; prefix: string } => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const key = "rfy_" + Array.from({ length: 48 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return { key, prefix: key.slice(0, 12) };
};

export const calculateTotals = (
  items: { quantity: number; price: number }[],
  taxRate = 0,
  discount = 0
) => {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount - discount;
  return { subtotal, taxAmount, total };
};

export const RECEIPT_CATEGORIES: ReceiptCategory[] = [
  "Food & Dining", "Transport", "Bills & Utilities", "Shopping",
  "Health", "Entertainment", "Education", "Travel", "Business", "Uncategorized",
];

export const CATEGORY_COLORS: Record<ReceiptCategory, string> = {
  "Food & Dining": "#22c55e",
  "Transport": "#3b82f6",
  "Bills & Utilities": "#f59e0b",
  "Shopping": "#ec4899",
  "Health": "#ef4444",
  "Entertainment": "#8b5cf6",
  "Education": "#06b6d4",
  "Travel": "#f97316",
  "Business": "#64748b",
  "Uncategorized": "#9ca3af",
};

export const CATEGORY_ICONS: Record<ReceiptCategory, string> = {
  "Food & Dining": "🍽️", "Transport": "🚗", "Bills & Utilities": "💡",
  "Shopping": "🛍️", "Health": "🏥", "Entertainment": "🎬",
  "Education": "📚", "Travel": "✈️", "Business": "💼", "Uncategorized": "📄",
};

export const autoCategory = (text: string): ReceiptCategory => {
  const t = text.toLowerCase();
  if (/chicken|restaurant|food|eat|cafe|pizza|burger|suya|sharwarma|amala|eba/.test(t)) return "Food & Dining";
  if (/uber|bolt|taxi|bus|fuel|petrol|transport|keke|okada/.test(t)) return "Transport";
  if (/nepa|dstv|electricity|water|internet|mtn|airtel|glo|data|bill/.test(t)) return "Bills & Utilities";
  if (/shoprite|jumia|konga|store|market|supermarket/.test(t)) return "Shopping";
  if (/hospital|pharmacy|clinic|drug|health|medical/.test(t)) return "Health";
  if (/cinema|movie|netflix|game|sport/.test(t)) return "Entertainment";
  if (/school|university|course|book|tuition/.test(t)) return "Education";
  if (/hotel|flight|airline|airbnb|travel/.test(t)) return "Travel";
  if (/invoice|business|office|equipment/.test(t)) return "Business";
  return "Uncategorized";
};

export const parseBankAlert = (text: string): { amount: number | null; merchant: string | null; date: Date | null } => {
  // GTB: "Acct:1234 Debit NGN5,000.00 ... POS CHICKEN REPUBLIC"
  // Access: "Your Acct ...was debited with NGN 3,500"
  // UBA: "Debit Alert! Amount:NGN2000.00 Desc:POS/SHOPRITE"
  const amountMatch = text.match(/(?:NGN|₦)\s*([0-9,]+(?:\.[0-9]{2})?)/i);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : null;

  const merchantPatterns = [
    /(?:POS|ATM|WEB)\s*[/\-]?\s*([A-Z][A-Z\s]+?)(?:\s+\d|\.|$)/,
    /(?:Desc|Description):\s*([^\n\r,]+)/i,
    /at\s+([A-Z][A-Z\s]+?)(?:\s+on|\s+\d|$)/i,
  ];
  let merchant: string | null = null;
  for (const pattern of merchantPatterns) {
    const match = text.match(pattern);
    if (match) { merchant = match[1].trim(); break; }
  }

  const dateMatch = text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{2,4})/);
  const date = dateMatch ? new Date(dateMatch[1]) : null;

  return { amount, merchant, date };
};

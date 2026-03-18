import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateStr));
};

export const generateDocumentNumber = (type: "invoice" | "receipt"): string => {
  const prefix = type === "invoice" ? "INV" : "REC";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
};

export const generateShareToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
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

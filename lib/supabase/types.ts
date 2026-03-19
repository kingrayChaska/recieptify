export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface DocumentData {
  documentNumber: string;
  businessName: string;
  businessEmail?: string;
  businessAddress?: string;
  customerName: string;
  customerEmail?: string;
  customerAddress?: string;
  date: string;
  dueDate?: string;
  items: LineItem[];
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  discount?: number;
  total: number;
  paymentStatus: "paid" | "unpaid" | "partial";
  paymentMethod?: string;
  notes?: string;
  currency: string;
}

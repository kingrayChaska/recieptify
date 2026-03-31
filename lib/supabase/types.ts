export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

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

export type ReceiptCategory =
  | "Food & Dining"
  | "Transport"
  | "Bills & Utilities"
  | "Shopping"
  | "Health"
  | "Entertainment"
  | "Education"
  | "Travel"
  | "Business"
  | "Uncategorized";

export type ReceiptSource = "upload" | "manual" | "bank_alert" | "api";

export interface Receipt {
  id: string;
  user_id: string;
  image_url: string | null;
  merchant_name: string | null;
  amount: number | null;
  currency: string;
  category: ReceiptCategory;
  date: string;
  raw_text: string | null;
  ocr_confidence: number | null;
  bank_alert_raw: string | null;
  source: ReceiptSource;
  notes: string | null;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  owner_id: string;
  slug: string | null;
  logo_url: string | null;
  created_at: string;
}

export type OrgRole = "owner" | "admin" | "member" | "viewer";

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrgRole;
  invited_by: string | null;
  joined_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  organization_id: string | null;
  name: string;
  key_prefix: string;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

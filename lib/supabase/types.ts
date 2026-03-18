export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string;
          user_id: string;
          type: "invoice" | "receipt";
          data: DocumentData;
          logo_url: string | null;
          share_token: string | null;
          template: "minimal" | "modern" | "classic";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "invoice" | "receipt";
          data: DocumentData;
          logo_url?: string | null;
          share_token?: string | null;
          template?: "minimal" | "modern" | "classic";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          data?: DocumentData;
          logo_url?: string | null;
          share_token?: string | null;
          template?: "minimal" | "modern" | "classic";
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          business_name: string | null;
          theme_color: string | null;
          avatar_url: string | null;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          business_name?: string | null;
          theme_color?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          business_name?: string | null;
          theme_color?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}

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

import { DocumentForm } from "@/components/documents/DocumentForm";
import { Sidebar } from "@/components/layout/Sidebar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewInvoicePage() {
  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-20 bg-[var(--bg)]/80 backdrop-blur border-b border-[var(--border)] px-6 py-4 flex items-center gap-3">
          <Link href="/dashboard/invoices" className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-muted transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-extrabold text-lg">New Invoice</h1>
        </header>
        <div className="flex-1 overflow-hidden">
          <DocumentForm type="invoice" />
        </div>
      </div>
    </div>
  );
}

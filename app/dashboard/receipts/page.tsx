import { Topbar } from "@/components/layout/Topbar";
import { DocumentList } from "@/components/dashboard/DocumentList";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function ReceiptsPage() {
  return (
    <div>
      <Topbar title="Receipts" />
      <div className="p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted">All your generated receipts</p>
          <Link
            href="/receipt/new"
            className="flex items-center gap-2 bg-[var(--brand)] text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> New Receipt
          </Link>
        </div>
        <DocumentList type="receipt" />
      </div>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="text-7xl font-black text-[var(--brand)] mb-4">404</div>
        <h1 className="text-2xl font-extrabold mb-2">Page not found</h1>
        <p className="text-muted text-sm mb-8">
          This page doesn&apos;t exist or may have been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-[var(--brand)] text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}

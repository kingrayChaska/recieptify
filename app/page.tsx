import Link from "next/link";
import { FileText, Zap, Shield, Download, ArrowRight, Check } from "lucide-react";

export default function LandingPage() {
  const features = [
    { icon: FileText, title: "Invoices & Receipts", desc: "Generate professional documents in seconds" },
    { icon: Zap, title: "Live Preview", desc: "See changes reflected instantly as you type" },
    { icon: Shield, title: "Secure Storage", desc: "All documents stored safely in your account" },
    { icon: Download, title: "PDF Export", desc: "Download crisp PDFs with one click" },
  ];

  const plans = ["Unlimited documents", "3 layout templates", "Logo upload", "Shareable links", "Analytics dashboard"];

  return (
    <main className="min-h-screen bg-base">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="font-bold text-xl tracking-tight">Recieptify</span>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm text-muted hover:text-[var(--text)] transition-colors">
            Log in
          </Link>
          <Link
            href="/auth/register"
            className="text-sm bg-[var(--brand)] text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-full px-4 py-1.5 text-xs font-mono text-muted mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
          Now with shareable invoice links
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
          Invoices that look
          <br />
          <span className="text-[var(--brand)]">seriously good.</span>
        </h1>
        <p className="text-lg text-muted max-w-xl mx-auto mb-10">
          Create, customize, and send professional invoices and receipts in under a minute. No design skills needed.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/auth/register"
            className="flex items-center gap-2 bg-[var(--brand)] text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all hover:gap-3"
          >
            Start for free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/auth/login"
            className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] px-7 py-3.5 rounded-xl font-semibold text-sm hover:border-[var(--brand)] transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-card border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--brand)] transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--brand)]/20 transition-colors">
                <Icon className="w-5 h-5 text-[var(--brand)]" />
              </div>
              <h3 className="font-bold mb-1">{title}</h3>
              <p className="text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing / free tier */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-card border border-[var(--border)] rounded-3xl p-10 max-w-md mx-auto text-center">
          <span className="text-xs font-mono text-[var(--brand)] uppercase tracking-widest">Free forever</span>
          <h2 className="text-3xl font-extrabold mt-2 mb-1">Everything included</h2>
          <p className="text-muted text-sm mb-8">No credit card required. No hidden fees.</p>
          <ul className="space-y-3 text-left mb-8">
            {plans.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-[var(--brand)] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/auth/register"
            className="block w-full bg-[var(--brand)] text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Create your account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 text-center text-xs text-muted">
        <p>© {new Date().getFullYear()} Recieptify. Built with Next.js & Supabase.</p>
      </footer>
    </main>
  );
}

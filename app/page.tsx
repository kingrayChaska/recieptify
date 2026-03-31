"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Brain,
  Receipt,
  Smartphone,
  Check,
  ArrowRight,
  Upload,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  ChevronRight,
  Star,
} from "lucide-react";

/* ─── tiny motion helpers (no framer dep needed) ─── */
const useFadeIn = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
};

const FadeIn = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

/* ─── mock dashboard ─── */
const MockDashboard = () => (
  <div className="relative w-full max-w-2xl mx-auto">
    {/* glow */}
    <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl rounded-3xl" />
    <div className="relative bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* topbar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
        </div>
        <span className="text-white/30 text-xs font-mono">
          Receiptify.app/dashboard
        </span>
        <div className="w-16" />
      </div>
      {/* content */}
      <div className="p-5 space-y-4">
        {/* stat row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Monthly Spend", value: "₦284,500", up: false },
            { label: "Receipts", value: "47", up: true },
            { label: "Saved", value: "₦32,000", up: true },
          ].map(({ label, value, up }) => (
            <div
              key={label}
              className="bg-white/5 rounded-xl p-3 border border-white/5"
            >
              <p className="text-white/40 text-[10px] mb-1">{label}</p>
              <p className="text-white font-bold text-sm">{value}</p>
              <p
                className={`text-[10px] mt-0.5 ${up ? "text-emerald-400" : "text-red-400"}`}
              >
                {up ? "▲ 12%" : "▼ 3%"}
              </p>
            </div>
          ))}
        </div>
        {/* bar chart */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <p className="text-white/40 text-[10px] mb-3">Spending by Category</p>
          <div className="space-y-2">
            {[
              { label: "Food & Dining", pct: 72, color: "bg-emerald-500" },
              { label: "Transport", pct: 45, color: "bg-blue-500" },
              { label: "Bills", pct: 58, color: "bg-purple-500" },
              { label: "Shopping", pct: 30, color: "bg-orange-500" },
            ].map(({ label, pct, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-white/40 text-[10px] w-20 shrink-0">
                  {label}
                </span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-white/40 text-[10px] w-6">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
        {/* recent */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <p className="text-white/40 text-[10px] mb-3">Recent Receipts</p>
          <div className="space-y-2">
            {[
              {
                name: "Chicken Republic",
                amount: "₦4,500",
                cat: "Food",
                time: "2h ago",
              },
              {
                name: "Bolt",
                amount: "₦1,200",
                cat: "Transport",
                time: "5h ago",
              },
              {
                name: "Shoprite",
                amount: "₦18,700",
                cat: "Shopping",
                time: "1d ago",
              },
            ].map(({ name, amount, cat, time }) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Receipt className="w-3 h-3 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white text-[11px] font-medium">{name}</p>
                    <p className="text-white/30 text-[9px]">
                      {cat} · {time}
                    </p>
                  </div>
                </div>
                <span className="text-white/70 text-[11px] font-mono">
                  {amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    {
      icon: BarChart3,
      title: "Smart Expense Tracking",
      desc: "Automatically organize spending into categories like food, transport, bills, and more.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      desc: "Understand where your money goes with intelligent summaries and trends.",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      icon: Receipt,
      title: "Receipt Storage",
      desc: "Securely store and access all your receipts anytime, anywhere.",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      icon: Smartphone,
      title: "Built for Real Life",
      desc: "Works seamlessly with local payment methods, bank alerts, and everyday transactions.",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
  ];

  const steps = [
    {
      icon: Upload,
      step: "01",
      title: "Upload Receipts",
      desc: "Snap, upload, or forward receipts from anywhere—images, PDFs, or even bank alerts.",
      color: "text-emerald-400",
    },
    {
      icon: Sparkles,
      step: "02",
      title: "Smart Extraction",
      desc: "Our AI instantly reads and structures your receipt data—no manual entry needed.",
      color: "text-blue-400",
    },
    {
      icon: TrendingUp,
      step: "03",
      title: "Instant Insights",
      desc: "Track spending patterns, categorize expenses, and get clear financial summaries.",
      color: "text-purple-400",
    },
  ];

  const whyPoints = [
    { icon: Zap, text: "Designed for modern financial habits" },
    { icon: Brain, text: "Built with AI at its core" },
    { icon: Shield, text: "Optimized for speed, simplicity, and clarity" },
    { icon: BarChart3, text: "Works for both individuals and businesses" },
  ];

  const useCases = [
    {
      title: "For Individuals",
      desc: "Stay in control of your daily spending without spreadsheets.",
      emoji: "👤",
    },
    {
      title: "For Small Businesses",
      desc: "Track expenses, manage records, and simplify bookkeeping.",
      emoji: "🏢",
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#060910] text-white overflow-x-hidden"
      style={{ fontFamily: "'Cabinet Grotesk', 'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'Instrument Serif', serif; }
        .grain { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); }
        .mesh { background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16,185,129,0.15) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 50%, rgba(59,130,246,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 20% 80%, rgba(139,92,246,0.06) 0%, transparent 60%); }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.4} 100%{transform:scale(1.6);opacity:0} }
        .float { animation: float 6s ease-in-out infinite; }
        .badge { background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05)); border: 1px solid rgba(16,185,129,0.3); }
      `}</style>

      {/* ── NAV ── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: scrollY > 40 ? "rgba(6,9,16,0.9)" : "transparent",
          backdropFilter: scrollY > 40 ? "blur(16px)" : "none",
          borderBottom:
            scrollY > 40 ? "1px solid rgba(255,255,255,0.05)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Receipt className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Receiptify</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            {["Features", "How it Works", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm text-white/60 hover:text-white transition-colors hidden md:block"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="text-sm bg-emerald-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-emerald-400 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 mesh grain">
        {/* bg orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-blue-500/5 blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* badge */}
          <div
            className="inline-flex items-center gap-2 badge rounded-full px-4 py-1.5 text-xs text-emerald-400 font-medium mb-8"
            style={{ opacity: 0, animation: "fadeUp 0.8s ease 0.1s forwards" }}
          >
            <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
            <Sparkles className="w-3 h-3" />
            AI-powered expense intelligence
          </div>

          {/* headline */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-6"
            style={{ opacity: 0, animation: "fadeUp 0.8s ease 0.2s forwards" }}
          >
            <span className="text-white">Track Every </span>
            <span className="serif italic text-emerald-400">Naira.</span>
            <br />
            <span className="text-white">Understand Every </span>
            <span className="serif italic text-white/80">Spend.</span>
          </h1>

          <p
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-10"
            style={{ opacity: 0, animation: "fadeUp 0.8s ease 0.35s forwards" }}
          >
            Receiptify transforms your receipts into powerful financial
            insights—automatically. Upload, scan, and analyze your spending in
            seconds.
          </p>

          <div
            className="flex items-center justify-center gap-4 flex-wrap mb-20"
            style={{ opacity: 0, animation: "fadeUp 0.8s ease 0.5s forwards" }}
          >
            <Link
              href="/auth/register"
              className="flex items-center gap-2 bg-emerald-500 text-white px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-emerald-400 transition-all hover:gap-3 shadow-lg shadow-emerald-500/20"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 bg-white/5 border border-white/10 px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
            >
              See How It Works <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* dashboard mock */}
          <div
            style={{ opacity: 0, animation: "fadeUp 0.9s ease 0.65s forwards" }}
            className="float"
          >
            <MockDashboard />
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-16 border-y border-white/5 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="text-center mb-10">
            <p className="text-white/30 text-sm tracking-widest uppercase">
              Trusted by individuals and growing businesses managing their daily
              expenses smarter
            </p>
          </FadeIn>
          <FadeIn
            delay={100}
            className="flex items-center justify-center gap-8 flex-wrap"
          >
            {[
              { name: "Amaka O.", role: "Freelancer", stars: 5 },
              { name: "Tunde B.", role: "SME Owner", stars: 5 },
              { name: "Chisom E.", role: "Accountant", stars: 5 },
              { name: "Femi A.", role: "Student", stars: 5 },
            ].map(({ name, role, stars }) => (
              <div
                key={name}
                className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-5 py-3"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-400">
                  {name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="text-xs text-white/30">{role}</p>
                </div>
                <div className="flex gap-0.5 ml-2">
                  {[...Array(stars)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-emerald-400 text-emerald-400"
                    />
                  ))}
                </div>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="text-emerald-400 text-xs font-semibold tracking-widest uppercase">
              Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
              How It Works
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              Three simple steps to complete financial clarity
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20" />

            {steps.map(({ icon: Icon, step, title, desc, color }, i) => (
              <FadeIn key={title} delay={i * 150}>
                <div className="relative bg-white/[0.03] border border-white/8 rounded-2xl p-7 hover:bg-white/[0.05] transition-all group">
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className={`w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <span className="text-4xl font-black text-white/5">
                      {step}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        id="features"
        className="py-28 px-6 bg-white/[0.015] border-y border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="text-emerald-400 text-xs font-semibold tracking-widest uppercase">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
              Everything You Need
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              Powerful tools built for how real people manage money
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-5">
            {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <FadeIn key={title} delay={i * 100}>
                <div className="flex gap-5 bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/15 transition-all group">
                  <div
                    className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1.5">{title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY SECTION ── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <span className="text-emerald-400 text-xs font-semibold tracking-widest uppercase">
                Why Receiptify
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-6 leading-tight">
                Built Different,
                <br />
                <span className="serif italic text-white/60">by Design.</span>
              </h2>
              <p className="text-white/40 leading-relaxed mb-8">
                We didn&apos;t just build another finance app. We rethought how
                people interact with their money — starting with the humble
                receipt.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold hover:gap-3 transition-all"
              >
                Start for free <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeIn>

            <FadeIn delay={150} className="space-y-4">
              {whyPoints.map(({ icon: Icon, text }, i) => (
                <div
                  key={text}
                  className="flex items-center gap-4 bg-white/[0.03] border border-white/8 rounded-xl px-5 py-4 hover:bg-white/[0.05] transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-white/80">
                    {text}
                  </span>
                  <Check className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
                </div>
              ))}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="py-28 px-6 bg-white/[0.015] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-14">
            <span className="text-emerald-400 text-xs font-semibold tracking-widest uppercase">
              Use Cases
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              Built for Everyone
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map(({ title, desc, emoji }, i) => (
              <FadeIn key={title} delay={i * 150}>
                <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8 hover:bg-white/[0.05] hover:border-emerald-500/20 transition-all group">
                  <div className="text-4xl mb-5">{emoji}</div>
                  <h3 className="text-xl font-bold mb-3">{title}</h3>
                  <p className="text-white/40 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREVIEW ── */}
      <section id="preview" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-14">
            <span className="text-emerald-400 text-xs font-semibold tracking-widest uppercase">
              Dashboard
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
              See Your Financial Story
              <br />
              at a Glance
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              Everything you need to understand and control your spending
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-4 gap-4 mb-10">
            {[
              {
                label: "Total monthly spending",
                icon: BarChart3,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
              },
              {
                label: "Category breakdown",
                icon: TrendingUp,
                color: "text-blue-400",
                bg: "bg-blue-500/10",
              },
              {
                label: "Recent receipts",
                icon: Receipt,
                color: "text-purple-400",
                bg: "bg-purple-500/10",
              },
              {
                label: "AI-generated insights",
                icon: Brain,
                color: "text-orange-400",
                bg: "bg-orange-500/10",
              },
            ].map(({ label, icon: Icon, color, bg }, i) => (
              <FadeIn key={label} delay={i * 100}>
                <div
                  className={`${bg} border border-white/5 rounded-2xl p-5 flex flex-col gap-3`}
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                  <p className="text-sm text-white/70 font-medium">{label}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={200}>
            <MockDashboard />
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div
              className="relative rounded-3xl overflow-hidden text-center p-14"
              style={{
                background:
                  "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,9,16,0.9) 50%, rgba(59,130,246,0.1) 100%)",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1),transparent_70%)]" />
              <div className="relative z-10">
                <div className="inline-flex w-14 h-14 rounded-2xl bg-emerald-500/20 items-center justify-center mb-6 mx-auto">
                  <Sparkles className="w-7 h-7 text-emerald-400" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Start Tracking
                  <br />
                  <span className="serif italic text-emerald-400">
                    Smarter Today
                  </span>
                </h2>
                <p className="text-white/40 mb-10 max-w-md mx-auto">
                  Join Receiptify and take control of your finances
                  effortlessly.
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <Link
                    href="/auth/register"
                    className="flex items-center gap-2 bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 hover:gap-3"
                  >
                    Create Free Account <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-2 bg-white/5 border border-white/10 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-all"
                  >
                    Try Demo
                  </Link>
                </div>
                <p className="text-white/20 text-xs mt-6">
                  No credit card required · Free forever
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Receipt className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm">Receiptify</span>
            </div>

            <div className="flex items-center gap-6 flex-wrap justify-center">
              {[
                "Product",
                "Features",
                "Pricing",
                "Privacy Policy",
                "Terms of Service",
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs text-white/30 hover:text-white/70 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>

            <p className="text-xs text-white/20">
              © 2026 Recieptify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

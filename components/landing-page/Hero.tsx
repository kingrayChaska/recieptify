"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { FadeIn } from "./FadeIn";
import { CSSProperties } from "react";

// Constants
const ANIMATION_KEYFRAMES = `@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`;
const ANIMATION_DURATION = "0.8s";
const ANIMATION_TIMING = "ease";
const ANIMATION_DELAYS = {
  badge: "0.1s",
  headline: "0.2s",
  description: "0.35s",
  buttons: "0.5s",
  dashboard: "0.65s",
} as const;

// Content constants
const CONTENT = {
  badge: "AI-powered expense intelligence",
  headline: {
    line1: "Track Every ",
    emphasis1: "Naira.",
    line2: "Understand Every ",
    emphasis2: "Spend.",
  },
  description:
    "Receiptify transforms your receipts into powerful financial insights—automatically. Upload, scan, and analyze your spending in seconds.",
  cta: {
    primary: "Get Started Free",
    secondary: "See How It Works",
    secondaryLink: "#how-it-works",
    primaryLink: "/auth/register",
  },
} as const;

// Utility function to create fade-in animation style
const createFadeInStyle = (delay: string): CSSProperties => ({
  opacity: 0,
  animation: `fadeUp ${ANIMATION_DURATION} ${ANIMATION_TIMING} ${delay} forwards`,
});

// Badge Component
const Badge = () => (
  <div
    className="inline-flex items-center gap-2 badge rounded-full px-4 py-1.5 text-xs text-emerald-400 font-medium mb-8"
    style={createFadeInStyle(ANIMATION_DELAYS.badge)}
  >
    <style>{ANIMATION_KEYFRAMES}</style>
    <Sparkles className="w-3 h-3" />
    {CONTENT.badge}
  </div>
);

// Headline Component
const Headline = () => (
  <h1
    className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-6"
    style={createFadeInStyle(ANIMATION_DELAYS.headline)}
  >
    <span className="text-white">{CONTENT.headline.line1}</span>
    <span className="serif italic text-emerald-400">
      {CONTENT.headline.emphasis1}
    </span>
    <br />
    <span className="text-white">{CONTENT.headline.line2}</span>
    <span className="serif italic text-white/80">
      {CONTENT.headline.emphasis2}
    </span>
  </h1>
);

// Description Component
const Description = () => (
  <p
    className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-10"
    style={createFadeInStyle(ANIMATION_DELAYS.description)}
  >
    {CONTENT.description}
  </p>
);

// CTA Buttons Component
const CTAButtons = () => (
  <div
    className="flex items-center justify-center gap-4 flex-wrap mb-20"
    style={createFadeInStyle(ANIMATION_DELAYS.buttons)}
  >
    <Link
      href={CONTENT.cta.primaryLink}
      className="flex items-center gap-2 bg-emerald-500 text-white px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-emerald-400 transition-all hover:gap-3 shadow-lg shadow-emerald-500/20"
    >
      {CONTENT.cta.primary}
      <ArrowRight className="w-4 h-4" />
    </Link>
    <a
      href={CONTENT.cta.secondaryLink}
      className="flex items-center gap-2 bg-white/5 border border-white/10 px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
    >
      {CONTENT.cta.secondary}
      <ChevronRight className="w-4 h-4" />
    </a>
  </div>
);

// Background Orbs Component
const BackgroundOrbs = () => (
  <>
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
    <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-blue-500/5 blur-[80px] pointer-events-none" />
  </>
);

// Main Hero Component
export const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 mesh grain">
      <BackgroundOrbs />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <Badge />
        <Headline />
        <Description />
        <CTAButtons />
      </div>
    </section>
  );
};

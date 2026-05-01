import Link from "next/link";
import {
  Zap,
  Brain,
  Shield,
  BarChart3,
  Check,
  ArrowRight,
  LucideIcon,
} from "lucide-react";
import { FadeIn } from "./FadeIn";

interface WhyPoint {
  icon: LucideIcon;
  text: string;
}

export const Why = () => {
  const whyPoints: WhyPoint[] = [
    { icon: Zap, text: "Designed for modern financial habits" },
    { icon: Brain, text: "Built with AI at its core" },
    { icon: Shield, text: "Optimized for speed, simplicity, and clarity" },
    { icon: BarChart3, text: "Works for both individuals and businesses" },
  ];

  return (
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
  );
};

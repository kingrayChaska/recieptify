import { Upload, Sparkles, TrendingUp } from "lucide-react";
import { FadeIn } from "./FadeIn";
import { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  step: string;
  title: string;
  desc: string;
  color: string;
}

export const HowItWorks = () => {
  const steps: Step[] = [
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

  return (
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
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

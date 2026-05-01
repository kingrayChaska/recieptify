import {
  BarChart3,
  Brain,
  Receipt,
  Smartphone,
  LucideIcon,
} from "lucide-react";
import { FadeIn } from "./FadeIn";

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  bg: string;
}

export const Features = () => {
  const features: Feature[] = [
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

  return (
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
  );
};

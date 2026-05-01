import {
  BarChart3,
  TrendingUp,
  Receipt,
  Brain,
  LucideIcon,
} from "lucide-react";
import { FadeIn } from "./FadeIn";
import { MockDashboard } from "./MockDashboard";

interface DashboardFeature {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export const Preview = () => {
  const dashboardFeatures: DashboardFeature[] = [
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
  ];

  return (
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
          {dashboardFeatures.map(({ label, icon: Icon, color, bg }, i) => (
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
  );
};

import { FadeIn } from "./FadeIn";

interface UseCase {
  title: string;
  desc: string;
  emoji: string;
}

export const UseCases = () => {
  const useCases: UseCase[] = [
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
  );
};

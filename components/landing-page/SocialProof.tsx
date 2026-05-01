import { Star } from "lucide-react";
import { FadeIn } from "./FadeIn";

export const SocialProof = () => {
  const testimonials = [
    { name: "Amaka O.", role: "Freelancer", stars: 5 },
    { name: "Tunde B.", role: "SME Owner", stars: 5 },
    { name: "Chisom E.", role: "Accountant", stars: 5 },
    { name: "Femi A.", role: "Student", stars: 5 },
  ];

  return (
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
          {testimonials.map(({ name, role, stars }) => (
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
  );
};

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { FadeIn } from "./FadeIn";

export const CTA = () => {
  return (
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
                Join Receiptify and take control of your finances effortlessly.
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
  );
};

import Link from "next/link";
import { Receipt } from "lucide-react";

interface NavbarProps {
  scrollY: number;
}

export const Navbar = ({ scrollY }: NavbarProps) => {
  return (
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
  );
};

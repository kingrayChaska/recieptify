import { Receipt } from "lucide-react";

export const Footer = () => {
  const links = [
    "Product",
    "Features",
    "Pricing",
    "Privacy Policy",
    "Terms of Service",
  ];

  return (
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
            {links.map((link) => (
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
  );
};

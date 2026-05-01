"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/landing-page/Navbar";
import { Hero } from "@/components/landing-page/Hero";
import { SocialProof } from "@/components/landing-page/SocialProof";
import { HowItWorks } from "@/components/landing-page/HowItWorks";
import { Features } from "@/components/landing-page/Features";
import { Why } from "@/components/landing-page/Why";
import { UseCases } from "@/components/landing-page/UseCases";
import { Preview } from "@/components/landing-page/Preview";
import { CTA } from "@/components/landing-page/CTA";
import { Footer } from "@/components/landing-page/Footer";
import { GlobalStyles } from "@/components/landing-page/GlobalStyles";
//   <div className="relative w-full max-w-2xl mx-auto">
//     {/* glow */}
//     <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl rounded-3xl" />
//     <div className="relative bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
//       {/* topbar */}
//       <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 rounded-full bg-red-500/70" />
//           <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
//           <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
//         </div>
//         <span className="text-white/30 text-xs font-mono">
//           Receiptify.app/dashboard
//         </span>
//         <div className="w-16" />
//       </div>
//       {/* content */}
//       <div className="p-5 space-y-4">
//         {/* stat row */}
//         <div className="grid grid-cols-3 gap-3">
//           {[
//             { label: "Monthly Spend", value: "₦284,500", up: false },
//             { label: "Receipts", value: "47", up: true },
//             { label: "Saved", value: "₦32,000", up: true },
//           ].map(({ label, value, up }) => (
//             <div
//               key={label}
//               className="bg-white/5 rounded-xl p-3 border border-white/5"
//             >
//               <p className="text-white/40 text-[10px] mb-1">{label}</p>
//               <p className="text-white font-bold text-sm">{value}</p>
//               <p
//                 className={`text-[10px] mt-0.5 ${up ? "text-emerald-400" : "text-red-400"}`}
//               >
//                 {up ? "▲ 12%" : "▼ 3%"}
//               </p>
//             </div>
//           ))}
//         </div>
//         {/* bar chart */}
//         <div className="bg-white/5 rounded-xl p-4 border border-white/5">
//           <p className="text-white/40 text-[10px] mb-3">Spending by Category</p>
//           <div className="space-y-2">
//             {[
//               { label: "Food & Dining", pct: 72, color: "bg-emerald-500" },
//               { label: "Transport", pct: 45, color: "bg-blue-500" },
//               { label: "Bills", pct: 58, color: "bg-purple-500" },
//               { label: "Shopping", pct: 30, color: "bg-orange-500" },
//             ].map(({ label, pct, color }) => (
//               <div key={label} className="flex items-center gap-3">
//                 <span className="text-white/40 text-[10px] w-20 shrink-0">
//                   {label}
//                 </span>
//                 <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
//                   <div
//                     className={`h-full ${color} rounded-full`}
//                     style={{ width: `${pct}%` }}
//                   />
//                 </div>
//                 <span className="text-white/40 text-[10px] w-6">{pct}%</span>
//               </div>
//             ))}
//           </div>
//         </div>
//         {/* recent */}
//         <div className="bg-white/5 rounded-xl p-4 border border-white/5">
//           <p className="text-white/40 text-[10px] mb-3">Recent Receipts</p>
//           <div className="space-y-2">
//             {[
//               {
//                 name: "Chicken Republic",
//                 amount: "₦4,500",
//                 cat: "Food",
//                 time: "2h ago",
//               },
//               {
//                 name: "Bolt",
//                 amount: "₦1,200",
//                 cat: "Transport",
//                 time: "5h ago",
//               },
//               {
//                 name: "Shoprite",
//                 amount: "₦18,700",
//                 cat: "Shopping",
//                 time: "1d ago",
//               },
//             ].map(({ name, amount, cat, time }) => (
//               <div key={name} className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
//                     <Receipt className="w-3 h-3 text-emerald-400" />
//                   </div>
//                   <div>
//                     <p className="text-white text-[11px] font-medium">{name}</p>
//                     <p className="text-white/30 text-[9px]">
//                       {cat} · {time}
//                     </p>
//                   </div>
//                 </div>
//                 <span className="text-white/70 text-[11px] font-mono">
//                   {amount}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#060910] text-white overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', 'Cabinet Grotesk', sans-serif" }}
    >
      <GlobalStyles />
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <Navbar scrollY={scrollY} />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Features />
      <Why />
      <UseCases />
      <Preview />
      <CTA />
      <Footer />
    </div>
  );
}

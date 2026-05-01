export const GlobalStyles = () => {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
      * { font-family: 'DM Sans', sans-serif; }
      .serif { font-family: 'Instrument Serif', serif; }
      .grain { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); }
      .mesh { background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16,185,129,0.15) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 50%, rgba(59,130,246,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 20% 80%, rgba(139,92,246,0.06) 0%, transparent 60%); }
      @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
      @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.4} 100%{transform:scale(1.6);opacity:0} }
      .float { animation: float 6s ease-in-out infinite; }
      .badge { background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05)); border: 1px solid rgba(16,185,129,0.3); }
    `}</style>
  );
};

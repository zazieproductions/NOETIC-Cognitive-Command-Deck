import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

// Performative telemetry: each meter random-walks on its own interval. The
// clock beside them is real — the deck mixes genuine system signals with
// synthetic ones, and never labels which is which.
function Meter({ label, color }: { label: string; color: string }) {
  // Lazy initializer: drawn once on mount, not on every render.
  const [v, setV] = useState(() => 30 + Math.random() * 50);
  useEffect(() => {
    const t = setInterval(() => {
      setV((prev) => {
        const next = prev + (Math.random() - 0.5) * 14;
        return Math.max(8, Math.min(96, next));
      });
    }, 1400);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hidden md:flex items-center gap-2">
      <span className="text-[9px] tracking-[0.2em] text-white/40 font-mono uppercase">{label}</span>
      <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${v}%`, background: color }} />
      </div>
    </div>
  );
}

export default function TopBar() {
  const now = useClock();
  return (
    <div className="fixed top-0 left-0 right-0 h-11 z-50 flex items-center justify-between px-4 border-b border-white/10 bg-[#05060a]/80 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-md grid place-items-center bg-gradient-to-br from-[#7CFFD8] to-[#8B5CF6]">
          <Eye size={13} className="text-black" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[15px] tracking-wide text-white/90">NOETIC</span>
          <span className="hidden sm:inline text-[9px] tracking-[0.3em] text-white/35 font-mono uppercase">
            Cognitive Command Deck
          </span>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <Meter label="Cognitive Load" color="#7CFFD8" />
        <Meter label="Signal / Noise" color="#8B5CF6" />
        <Meter label="Entropy" color="#FF6B9D" />
        <div className="text-[11px] font-mono text-white/60 tabular-nums">
          {now.toLocaleTimeString([], { hour12: false })}
        </div>
      </div>
    </div>
  );
}

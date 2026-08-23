import { useState } from 'react';
import { Copy, Check, Shuffle } from 'lucide-react';
import { generatePalette } from '../../lib/engine';

export default function HexLab() {
  const [palette, setPalette] = useState(() => generatePalette());
  const [copied, setCopied] = useState<string | null>(null);
  const [history, setHistory] = useState<{ swatches: string[]; mood: string }[]>([]);

  const regenerate = () => {
    setHistory((h) => [palette, ...h].slice(0, 12));
    setPalette(generatePalette());
  };

  const copy = (hex: string) => {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopied(hex);
    setTimeout(() => setCopied(null), 1000);
  };

  return (
    <div className="p-3 space-y-3 h-full flex flex-col">
      <div className="rounded-lg border border-white/10 overflow-hidden shrink-0">
        <div className="h-8 flex">
          {palette.swatches.map((c) => (
            <div key={c} style={{ background: c }} className="flex-1" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {palette.swatches.map((c) => (
          <button
            key={c}
            onClick={() => copy(c)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-white/25 transition-colors group"
          >
            <span className="w-6 h-6 rounded-md border border-white/15 shrink-0" style={{ background: c }} />
            <span className="font-mono text-[12px] text-white/80 tracking-wide">{c.toUpperCase()}</span>
            <span className="ml-auto text-white/30 group-hover:text-white/70">
              {copied === c ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            </span>
          </button>
        ))}
      </div>

      <div className="text-center py-1 shrink-0">
        <div className="text-[8.5px] font-mono uppercase tracking-widest text-white/30">{palette.harmony} Harmony</div>
        <div className="text-[13px] font-display text-[#FFD23F] mt-0.5">"{palette.mood}"</div>
      </div>

      <button
        onClick={regenerate}
        className="shrink-0 w-full py-2 rounded-lg font-mono text-[11px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 border transition-all hover:scale-[1.01]"
        style={{ borderColor: '#FFD23F66', background: 'linear-gradient(90deg,#FFD23F22,#F7B26722)', color: '#FFD23F' }}
      >
        <Shuffle size={13} /> Synthesize Palette
      </button>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scroll space-y-1.5">
        {history.map((h, i) => (
          <div key={i} className="flex items-center gap-1.5 rounded-md border border-white/8 p-1.5">
            <div className="flex h-4 flex-1 rounded overflow-hidden">
              {h.swatches.map((c) => <div key={c} style={{ background: c }} className="flex-1" />)}
            </div>
            <span className="text-[8.5px] font-mono text-white/30 shrink-0 truncate max-w-[90px]">{h.mood}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

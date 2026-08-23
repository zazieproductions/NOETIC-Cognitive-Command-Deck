import { useState } from 'react';
import { Sparkles, Save, Shuffle } from 'lucide-react';
import { generateIdea, type Idea } from '../../lib/engine';

export default function IdeaSynthesizer() {
  const [current, setCurrent] = useState<Idea>(() => generateIdea());
  const [history, setHistory] = useState<Idea[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [pulsing, setPulsing] = useState(false);

  const synthesize = () => {
    setPulsing(true);
    setTimeout(() => setPulsing(false), 400);
    setHistory((h) => [current, ...h].slice(0, 40));
    setCurrent(generateIdea());
  };

  const save = (id: number) => setSaved((s) => (s.includes(id) ? s : [...s, id]));

  return (
    <div className="p-3 space-y-3 h-full flex flex-col">
      <div
        className="rounded-xl border p-4 space-y-3 shrink-0 transition-transform"
        style={{ borderColor: `${current.hex}55`, background: `linear-gradient(145deg, ${current.hex}14, transparent)`, transform: pulsing ? 'scale(0.98)' : 'scale(1)' }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[8.5px] font-mono uppercase tracking-widest text-white/35">Synthesis #{current.id.toString().padStart(3, '0')}</span>
          <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded" style={{ background: `${current.hex}22`, color: current.hex }}>
            {current.confidence}% confidence
          </span>
        </div>
        <h2 className="text-base font-display leading-snug text-white/90">{current.title}</h2>
        <p className="text-[11.5px] leading-relaxed text-white/60 font-mono">{current.abstract}</p>
        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-1.5 flex-wrap">
            {current.tags.map((t) => (
              <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-white/15 text-white/50">#{t}</span>
            ))}
          </div>
          <button onClick={() => save(current.id)} className="flex items-center gap-1 text-[9px] font-mono px-2 py-1 rounded border transition-colors"
            style={{ borderColor: saved.includes(current.id) ? current.hex : 'rgba(255,255,255,0.15)', color: saved.includes(current.id) ? current.hex : 'rgba(255,255,255,0.5)' }}>
            <Save size={11} /> {saved.includes(current.id) ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      <button
        onClick={synthesize}
        className="shrink-0 w-full py-2.5 rounded-lg font-mono text-[11px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 border transition-all hover:scale-[1.01]"
        style={{ borderColor: '#FF6B9D66', background: 'linear-gradient(90deg, #FF6B9D22, #8B5CF622)', color: '#FF6B9D' }}
      >
        <Sparkles size={14} /> Synthesize New Idea
      </button>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="text-[9px] font-mono uppercase tracking-widest text-white/30 mb-1.5 flex items-center gap-1.5 shrink-0">
          <Shuffle size={10} /> Synthesis History
        </div>
        <div className="flex-1 overflow-y-auto custom-scroll space-y-1.5 pr-1">
          {history.length === 0 && <div className="text-[10px] font-mono text-white/25 italic">Generated ideas will accumulate here.</div>}
          {history.map((idea) => (
            <div key={idea.id} className="rounded-lg border border-white/8 bg-white/[0.02] p-2 flex items-start gap-2">
              <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: idea.hex }} />
              <div className="min-w-0">
                <div className="text-[10.5px] font-mono text-white/70 truncate">{idea.title}</div>
                <div className="text-[9px] font-mono text-white/30">{idea.confidence}% · {idea.tags.join(', ')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

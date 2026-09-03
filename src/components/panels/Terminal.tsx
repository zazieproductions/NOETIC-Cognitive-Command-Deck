import { useEffect, useRef, useState } from 'react';
import { VERBS, OBJECTS, DOMAINS, FRAMES, ADJECTIVES } from '../../lib/lexicon';
import { pick } from '../../lib/rng';

type LineKind = 'sys' | 'thought' | 'glitch';
interface Line { id: number; text: string; kind: LineKind }

const SYS_TAGS = ['SIGNAL ACQUIRED', 'MEMETIC SCAN', 'PATTERN LOCK', 'NODE SYNC', 'BUFFER FLUSH', 'DREAM CACHE', 'ANOMALY', 'HEURISTIC HIT'];

function randomLine(rng: () => number, id: number): Line {
  const roll = rng();
  if (roll < 0.4) {
    const tag = pick(rng, SYS_TAGS);
    const hex = Math.floor(rng() * 0xffffff).toString(16).padStart(6, '0');
    return { id, kind: 'sys', text: `[${tag}] 0x${hex} :: ${pick(rng, DOMAINS)} :: confidence ${(rng() * 100).toFixed(1)}%` };
  }
  if (roll < 0.85) {
    return {
      id,
      kind: 'thought',
      text: `${pick(rng, VERBS)} the ${pick(rng, OBJECTS).toLowerCase()} ${pick(rng, FRAMES)} — ${pick(rng, ADJECTIVES).toLowerCase()} but inevitable.`,
    };
  }
  return { id, kind: 'glitch', text: '░▒▓ '.repeat(3 + Math.floor(rng() * 6)) };
}

export default function TerminalPanel() {
  const [lines, setLines] = useState<Line[]>([]);
  const counter = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const seedInitial = Array.from({ length: 14 }, () => {
      counter.current += 1;
      return randomLine(Math.random, counter.current);
    });
    setLines(seedInitial);
    // Cadence is drawn once per mount (0.9–1.8s) rather than per line: the
    // stream feels irregular across reloads but stays a single cheap timer.
    const t = setInterval(() => {
      counter.current += 1;
      // Ring buffer: the log keeps at most 160 lines in memory and in the DOM.
      setLines((ls) => [...ls.slice(-160), randomLine(Math.random, counter.current)]);
    }, 900 + Math.random() * 900);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const colorFor = (kind: LineKind) => (kind === 'sys' ? '#39FF88' : kind === 'glitch' ? '#39FF8855' : '#c9ffe0');

  return (
    <div className="h-full flex flex-col bg-[#050805]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scroll p-3 font-mono text-[10.5px] leading-relaxed">
        {lines.map((l) => (
          <div key={l.id} style={{ color: colorFor(l.kind) }} className={l.kind === 'glitch' ? 'opacity-60 tracking-widest' : ''}>
            {l.kind !== 'glitch' && <span className="text-[#39FF88]/40 mr-1">$</span>}
            {l.text}
          </div>
        ))}
        <div className="animate-pulse text-[#39FF88]">▋</div>
      </div>
      <div className="shrink-0 border-t border-[#39FF88]/20 px-3 py-1.5 text-[9px] font-mono text-[#39FF88]/40 tracking-[0.2em]">
        VISION STREAM LIVE · {lines.length} EVENTS BUFFERED
      </div>
    </div>
  );
}

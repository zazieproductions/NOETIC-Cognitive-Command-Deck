import { useMemo, useRef, useState } from 'react';
import { generateSocialGraph, PRINCIPLES, type SocialNode } from '../../lib/engine';

const EDGE_COLOR = { trust: '#39FF88', neutral: '#8892a0', adversarial: '#EF476F' };

export default function SocialGraph() {
  const initial = useMemo(() => generateSocialGraph(), []);
  const [nodes, setNodes] = useState<SocialNode[]>(initial.nodes);
  const [selected, setSelected] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const principleColor = (name: string) => PRINCIPLES.find((p) => p.name === name)?.color ?? '#fff';

  const onPointerDown = (e: React.PointerEvent, n: SocialNode) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { id: n.id, sx: e.clientX, sy: e.clientY, ox: n.x, oy: n.y, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dxp = ((e.clientX - drag.current.sx) / rect.width) * 1000;
    const dyp = ((e.clientY - drag.current.sy) / rect.height) * 720;
    if (Math.abs(dxp) + Math.abs(dyp) > 2) drag.current.moved = true;
    const nx = drag.current.ox + dxp;
    const ny = drag.current.oy + dyp;
    setNodes((ns) => ns.map((n) => (n.id === drag.current!.id ? { ...n, x: nx, y: ny } : n)));
  };
  const onPointerUp = (n: SocialNode) => {
    if (!drag.current?.moved) setSelected(n.id);
    drag.current = null;
  };

  const sel = selected ? nodeMap.get(selected) : null;

  return (
    <div className="flex w-full h-full">
      <div
        ref={containerRef}
        onPointerMove={onPointerMove}
        className="relative flex-1 touch-none"
        style={{ background: 'radial-gradient(circle at 60% 30%, rgba(239,71,111,0.08), transparent 60%), #0a0b10' }}
      >
        <svg viewBox="0 0 1000 720" className="absolute inset-0 w-full h-full pointer-events-none">
          {initial.edges.map((e, i) => {
            const a = nodeMap.get(e.a), b = nodeMap.get(e.b);
            if (!a || !b) return null;
            const hl = selected && (e.a === selected || e.b === selected);
            return (
              <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={EDGE_COLOR[e.kind]} strokeOpacity={hl ? 0.85 : 0.25} strokeWidth={hl ? 2 : 1} />
            );
          })}
        </svg>
        {nodes.map((n) => {
          const isSel = n.id === selected;
          const c = principleColor(n.principle);
          const size = 8 + n.reach / 60000;
          return (
            <div
              key={n.id}
              onPointerDown={(e) => onPointerDown(e, n)}
              onPointerUp={() => onPointerUp(n)}
              className="absolute cursor-pointer select-none flex flex-col items-center"
              style={{ left: `${(n.x / 1000) * 100}%`, top: `${(n.y / 720) * 100}%`, transform: 'translate(-50%,-50%)' }}
            >
              <div
                className="rounded-full border-2 transition-transform"
                style={{
                  width: size, height: size, borderColor: c,
                  background: isSel ? c : `${c}33`,
                  boxShadow: isSel ? `0 0 16px ${c}` : 'none',
                  transform: isSel ? 'scale(1.3)' : 'scale(1)',
                }}
              />
              <span className="text-[8px] font-mono mt-0.5 whitespace-nowrap" style={{ color: isSel ? c : '#ffffff88' }}>{n.name}</span>
            </div>
          );
        })}
      </div>

      <div className="w-60 shrink-0 border-l border-white/10 p-3 flex flex-col gap-3 bg-black/30 overflow-y-auto custom-scroll">
        <div className="text-[9px] font-mono uppercase tracking-widest text-white/35">Cialdini Vectors</div>
        <div className="grid grid-cols-1 gap-1">
          {PRINCIPLES.map((p) => (
            <div key={p.name} className="flex items-center gap-1.5 text-[9px] font-mono">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
              <span style={{ color: p.color }}>{p.name}</span>
            </div>
          ))}
        </div>
        <div className="h-px bg-white/10" />
        {sel ? (
          <div className="space-y-2">
            <div className="text-[12px] font-display" style={{ color: principleColor(sel.principle) }}>{sel.name}</div>
            <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest">{sel.role}</div>
            <div className="space-y-1.5 pt-1">
              <Meter label="Reach" value={Math.min(100, sel.reach / 5000)} display={sel.reach.toLocaleString()} color="#7CFFD8" />
              <Meter label="Trust" value={sel.trust} color="#39FF88" />
              <Meter label="Susceptibility" value={sel.susceptibility} color="#EF476F" />
            </div>
            <div className="pt-2 border-t border-white/10 space-y-1">
              <div className="text-[9px] font-mono uppercase tracking-widest text-white/30">Recommended Vector</div>
              <div className="text-[11px] font-mono leading-relaxed" style={{ color: principleColor(sel.principle) }}>
                {sel.principle}
              </div>
              <p className="text-[10.5px] text-white/55 font-mono leading-relaxed">
                {PRINCIPLES.find((p) => p.name === sel.principle)?.desc}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-[10px] font-mono text-white/30 italic">Select a persona node to profile their influence surface.</div>
        )}
      </div>
    </div>
  );
}

function Meter({ label, value, display, color }: { label: string; value: number; display?: string; color: string }) {
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-[9px] font-mono text-white/45">
        <span>{label}</span><span>{display ?? `${value.toFixed(0)}%`}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, value)}%`, background: color }} />
      </div>
    </div>
  );
}

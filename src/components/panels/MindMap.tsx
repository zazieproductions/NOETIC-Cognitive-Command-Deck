import { useEffect, useMemo, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize, Plus, Link2 } from 'lucide-react';
import { generateMindMap, CATEGORY_COLOR, ADJECTIVES, DOMAINS, mulberry32, pick, type MindNode, type MindEdge } from '../../lib/engine';

const CANVAS_W = 2200;
const CANVAS_H = 1400;

export default function MindMap() {
  const initial = useMemo(() => generateMindMap(), []);
  const [nodes, setNodes] = useState<MindNode[]>(initial.nodes);
  const [edges, setEdges] = useState<MindEdge[]>(initial.edges);
  const [selected, setSelected] = useState<string | null>(null);
  const [connectMode, setConnectMode] = useState(false);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [scale, setScale] = useState(0.34);
  const [pan, setPan] = useState({ x: 40, y: 20 });
  const containerRef = useRef<HTMLDivElement>(null);
  const panState = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const dragNode = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      setScale((prevScale) => {
        const next = Math.max(0.12, Math.min(1.8, prevScale * (e.deltaY > 0 ? 0.9 : 1.1)));
        setPan((prevPan) => {
          const cx = (mx - prevPan.x) / prevScale;
          const cy = (my - prevPan.y) / prevScale;
          return { x: mx - cx * next, y: my - cy * next };
        });
        return next;
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const onBgPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    panState.current = { sx: e.clientX, sy: e.clientY, ox: pan.x, oy: pan.y };
  };
  const onBgPointerMove = (e: React.PointerEvent) => {
    if (!panState.current) return;
    const dx = e.clientX - panState.current.sx;
    const dy = e.clientY - panState.current.sy;
    setPan({ x: panState.current.ox + dx, y: panState.current.oy + dy });
  };
  const onBgPointerUp = () => {
    panState.current = null;
  };

  const onNodePointerDown = (e: React.PointerEvent, node: MindNode) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragNode.current = { id: node.id, sx: e.clientX, sy: e.clientY, ox: node.x, oy: node.y, moved: false };
  };
  const onNodePointerMove = (e: React.PointerEvent) => {
    if (!dragNode.current) return;
    const dx = (e.clientX - dragNode.current.sx) / scale;
    const dy = (e.clientY - dragNode.current.sy) / scale;
    if (Math.abs(dx) + Math.abs(dy) > 2) dragNode.current.moved = true;
    const nx = dragNode.current.ox + dx;
    const ny = dragNode.current.oy + dy;
    setNodes((ns) => ns.map((n) => (n.id === dragNode.current!.id ? { ...n, x: nx, y: ny } : n)));
  };
  const onNodePointerUp = (node: MindNode) => {
    const wasDrag = dragNode.current?.moved;
    dragNode.current = null;
    if (!wasDrag) {
      if (connectMode) {
        if (!connectFrom) setConnectFrom(node.id);
        else if (connectFrom !== node.id) {
          setEdges((es) => [...es, { a: connectFrom, b: node.id, strength: 0.9 }]);
          setConnectFrom(null);
        }
      } else {
        setSelected(node.id);
      }
    }
  };

  const addNode = () => {
    const rng = mulberry32(Date.now() % 100000);
    const label = `${pick(rng, ADJECTIVES)} ${pick(rng, DOMAINS)}`;
    const cx = (containerRef.current?.clientWidth ?? 600) / 2;
    const cy = (containerRef.current?.clientHeight ?? 400) / 2;
    const x = (cx - pan.x) / scale + (rng() - 0.5) * 120;
    const y = (cy - pan.y) / scale + (rng() - 0.5) * 120;
    const id = `X${Date.now()}`;
    const newNode: MindNode = { id, label, category: 'Provocation', x, y, insight: 'A freshly synthesized node, still warm from ideation.' };
    setNodes((ns) => [...ns, newNode]);
    if (nodes.length) {
      const nearest = nodes.reduce((best, n) => {
        const d = Math.hypot(n.x - x, n.y - y);
        return d < best.d ? { n, d } : best;
      }, { n: nodes[0], d: Infinity }).n;
      setEdges((es) => [...es, { a: id, b: nearest.id, strength: 0.7 }]);
    }
    setSelected(id);
  };

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const selectedNode = selected ? nodeMap.get(selected) : null;
  const connectedIds = useMemo(() => {
    if (!selected) return new Set<string>();
    const s = new Set<string>();
    edges.forEach((e) => {
      if (e.a === selected) s.add(e.b);
      if (e.b === selected) s.add(e.a);
    });
    return s;
  }, [selected, edges]);

  return (
    <div className="relative w-full h-full flex">
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden touch-none"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, rgba(124,255,216,0.06), transparent 60%), #0a0b10',
          cursor: connectMode ? 'crosshair' : 'grab',
        }}
        onPointerDown={onBgPointerDown}
        onPointerMove={(e) => {
          onBgPointerMove(e);
          onNodePointerMove(e);
        }}
        onPointerUp={onBgPointerUp}
      >
        <div
          style={{
            position: 'absolute',
            width: CANVAS_W,
            height: CANVAS_H,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: '0 0',
          }}
        >
          <svg width={CANVAS_W} height={CANVAS_H} className="absolute inset-0 pointer-events-none">
            {edges.map((e, i) => {
              const a = nodeMap.get(e.a);
              const b = nodeMap.get(e.b);
              if (!a || !b) return null;
              const hl = selected && (e.a === selected || e.b === selected);
              return (
                <line
                  key={i}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={hl ? '#7CFFD8' : '#ffffff'}
                  strokeOpacity={hl ? 0.55 : 0.08 + e.strength * 0.08}
                  strokeWidth={hl ? 2 : 1}
                />
              );
            })}
          </svg>
          {nodes.map((n) => {
            const isSel = n.id === selected;
            const isConnected = connectedIds.has(n.id);
            const color = CATEGORY_COLOR[n.category];
            return (
              <div
                key={n.id}
                onPointerDown={(e) => onNodePointerDown(e, n)}
                onPointerUp={() => onNodePointerUp(n)}
                className="absolute px-2.5 py-1 rounded-full border text-[10px] font-mono whitespace-nowrap cursor-pointer select-none transition-shadow"
                style={{
                  left: n.x,
                  top: n.y,
                  transform: 'translate(-50%,-50%)',
                  borderColor: isSel ? color : `${color}55`,
                  background: isSel ? `${color}33` : isConnected ? `${color}1a` : 'rgba(10,11,16,0.75)',
                  color,
                  boxShadow: isSel ? `0 0 20px ${color}88` : 'none',
                }}
              >
                {n.label}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-56 shrink-0 border-l border-white/10 p-3 flex flex-col gap-3 bg-black/30">
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setScale((s) => Math.min(1.8, s * 1.2))} className="p-1.5 rounded border border-white/15 hover:bg-white/10 text-white/70"><ZoomIn size={13} /></button>
          <button onClick={() => setScale((s) => Math.max(0.12, s * 0.8))} className="p-1.5 rounded border border-white/15 hover:bg-white/10 text-white/70"><ZoomOut size={13} /></button>
          <button onClick={() => { setScale(0.34); setPan({ x: 40, y: 20 }); }} className="p-1.5 rounded border border-white/15 hover:bg-white/10 text-white/70"><Maximize size={13} /></button>
          <button onClick={addNode} className="p-1.5 rounded border border-white/15 hover:bg-white/10 text-white/70"><Plus size={13} /></button>
          <button
            onClick={() => { setConnectMode((c) => !c); setConnectFrom(null); }}
            className="p-1.5 rounded border text-white/70"
            style={{ borderColor: connectMode ? '#7CFFD8' : 'rgba(255,255,255,0.15)', background: connectMode ? '#7CFFD822' : 'transparent', color: connectMode ? '#7CFFD8' : undefined }}
          >
            <Link2 size={13} />
          </button>
        </div>
        <div className="text-[9px] font-mono text-white/35 leading-relaxed">
          Scroll to zoom · drag canvas to pan · drag nodes to reorganize · {connectMode ? 'click two nodes to link' : 'click a node to inspect'}
        </div>
        <div className="flex flex-col gap-1 text-[9px] font-mono uppercase tracking-wider">
          {Object.entries(CATEGORY_COLOR).map(([k, c]) => (
            <div key={k} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: c }} />
              <span style={{ color: c }}>{k}</span>
            </div>
          ))}
        </div>
        <div className="h-px bg-white/10" />
        {selectedNode ? (
          <div className="flex-1 min-h-0 overflow-auto custom-scroll space-y-2">
            <div className="text-[11px] font-display" style={{ color: CATEGORY_COLOR[selectedNode.category] }}>{selectedNode.label}</div>
            <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest">{selectedNode.category}</div>
            <p className="text-[11px] text-white/65 leading-relaxed font-mono">{selectedNode.insight}</p>
            <div className="text-[9px] font-mono text-white/35 uppercase tracking-widest pt-1">{connectedIds.size} connections</div>
            <div className="flex flex-col gap-1">
              {[...connectedIds].slice(0, 8).map((id) => {
                const n = nodeMap.get(id);
                if (!n) return null;
                return (
                  <button key={id} onClick={() => setSelected(id)} className="text-left text-[10px] font-mono px-2 py-1 rounded bg-white/5 hover:bg-white/10 truncate" style={{ color: CATEGORY_COLOR[n.category] }}>
                    {n.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-[10px] font-mono text-white/30 italic">No node selected. The lattice awaits your attention.</div>
        )}
      </div>
    </div>
  );
}

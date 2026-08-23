import { useEffect, useRef, type ReactNode } from 'react';
import { Minus } from 'lucide-react';
import { useWM } from '../context/WindowManager';

interface Props {
  id: string;
  title: string;
  icon: ReactNode;
  accent: string;
  defaultPos: { x: number; y: number; w: number; h: number };
  z: number;
  boundsRef: React.RefObject<HTMLDivElement | null>;
  children: ReactNode;
}

export default function Window({ id, title, icon, accent, defaultPos, z, boundsRef, children }: Props) {
  const { wins, register, focus, toggleMin, setRect } = useWM();
  const dragState = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resizeState = useRef<{ startX: number; startY: number; origW: number; origH: number } | null>(null);

  useEffect(() => {
    register(id, { ...defaultPos, z, minimized: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const win = wins[id];
  if (!win) return null;

  const onHeaderPointerDown = (e: React.PointerEvent) => {
    focus(id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, origX: win.x, origY: win.y };
  };
  const onHeaderPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    const bounds = boundsRef.current?.getBoundingClientRect();
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    let nx = dragState.current.origX + dx;
    let ny = dragState.current.origY + dy;
    if (bounds) {
      nx = Math.max(-win.w + 160, Math.min(nx, bounds.width - 100));
      ny = Math.max(0, Math.min(ny, bounds.height - 44));
    }
    setRect(id, { x: nx, y: ny });
  };
  const onHeaderPointerUp = () => {
    dragState.current = null;
  };

  const onResizePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    focus(id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    resizeState.current = { startX: e.clientX, startY: e.clientY, origW: win.w, origH: win.h };
  };
  const onResizePointerMove = (e: React.PointerEvent) => {
    if (!resizeState.current) return;
    const dx = e.clientX - resizeState.current.startX;
    const dy = e.clientY - resizeState.current.startY;
    const nw = Math.max(340, resizeState.current.origW + dx);
    const nh = Math.max(260, resizeState.current.origH + dy);
    setRect(id, { w: nw, h: nh });
  };
  const onResizePointerUp = () => {
    resizeState.current = null;
  };

  if (win.minimized) return null;

  return (
    <div
      className="absolute flex flex-col rounded-xl overflow-hidden border animate-window-in"
      style={{
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        zIndex: win.z,
        borderColor: `${accent}44`,
        background: 'rgba(9,10,16,0.86)',
        backdropFilter: 'blur(18px)',
        boxShadow: `0 0 0 1px ${accent}18, 0 30px 70px -25px rgba(0,0,0,0.85), 0 0 50px -18px ${accent}55`,
      }}
      onPointerDownCapture={() => focus(id)}
    >
      <div
        className="flex items-center justify-between px-3 py-2.5 cursor-grab active:cursor-grabbing select-none border-b shrink-0"
        style={{ borderColor: `${accent}30`, background: `linear-gradient(90deg, ${accent}1c, transparent 70%)` }}
        onPointerDown={onHeaderPointerDown}
        onPointerMove={onHeaderPointerMove}
        onPointerUp={onHeaderPointerUp}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span style={{ color: accent }} className="shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5">{icon}</span>
          <span className="text-[10.5px] tracking-[0.22em] uppercase font-mono truncate" style={{ color: accent }}>
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => toggleMin(id)}
            className="w-5 h-5 grid place-items-center rounded hover:bg-white/10 text-white/40 hover:text-white/90 transition-colors ml-1"
          >
            <Minus size={12} />
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto custom-scroll">{children}</div>
      <div
        onPointerDown={onResizePointerDown}
        onPointerMove={onResizePointerMove}
        onPointerUp={onResizePointerUp}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize opacity-70"
        style={{ background: `linear-gradient(135deg, transparent 50%, ${accent}77 50%)` }}
      />
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const RADAR_AXES = ['Originality', 'Feasibility', 'Virality', 'Cog. Load', 'Signal/Noise', 'Synchronicity'];
const DOMAIN_BARS = ['Memetics', 'Biomimicry', 'Cryptoanarchism', 'Noopolitics', 'Neuro-Aesthetics', 'Hyperstition'];

function walk(v: number, amt = 6, min = 6, max = 97) {
  return Math.max(min, Math.min(max, v + (Math.random() - 0.5) * amt));
}

function useSeries(len: number, seed = 50) {
  const [data, setData] = useState<number[]>(() => Array.from({ length: len }, () => seed));
  useEffect(() => {
    const t = setInterval(() => {
      setData((d) => [...d.slice(1), walk(d[d.length - 1], 10)]);
    }, 1500);
    return () => clearInterval(t);
  }, []);
  return data;
}

function LineChart({ data, color }: { data: number[]; color: string }) {
  const w = 400, h = 110;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / 100) * h}`).join(' ');
  const area = `0,${h} ${points} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
      <defs>
        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={0} x2={w} y1={h * f} y2={h * f} stroke="white" strokeOpacity={0.06} />
      ))}
      <polygon points={area} fill="url(#lineFill)" />
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.6} />
    </svg>
  );
}

function RadarChart({ values, color }: { values: number[]; color: string }) {
  const size = 200, cx = size / 2, cy = size / 2, R = 78;
  const n = values.length;
  const pt = (i: number, r: number) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };
  const poly = values.map((v, i) => pt(i, (v / 100) * R).join(',')).join(' ');
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon
          key={f}
          points={Array.from({ length: n }, (_, i) => pt(i, R * f).join(',')).join(' ')}
          fill="none" stroke="white" strokeOpacity={0.08}
        />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const [x, y] = pt(i, R);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="white" strokeOpacity={0.08} />;
      })}
      <polygon points={poly} fill={color} fillOpacity={0.22} stroke={color} strokeWidth={1.5} />
      {RADAR_AXES.map((label, i) => {
        const [x, y] = pt(i, R + 18);
        return (
          <text key={label} x={x} y={y} fontSize={7} fill="white" fillOpacity={0.5} textAnchor="middle" fontFamily="monospace">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

function Kpi({ label, value, suffix, color }: { label: string; value: string; suffix?: string; color: string }) {
  const [up] = useState(() => Math.random() > 0.35);
  const [pct] = useState(() => (Math.random() * 12 + 1).toFixed(1));
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5 flex flex-col gap-1">
      <div className="text-[8.5px] font-mono uppercase tracking-widest text-white/35">{label}</div>
      <div className="text-lg font-display" style={{ color }}>{value}<span className="text-[10px] ml-0.5 text-white/40">{suffix}</span></div>
      <div className={`flex items-center gap-1 text-[9px] font-mono ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
        {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {pct}%
      </div>
    </div>
  );
}

export default function Analytics() {
  const velocity = useSeries(36, 55);
  const [radar, setRadar] = useState(() => RADAR_AXES.map(() => 30 + Math.random() * 60));
  const [bars, setBars] = useState(() => DOMAIN_BARS.map(() => 20 + Math.random() * 75));
  const counter = useRef(1482);
  const [ideasCount, setIdeasCount] = useState(1482);

  useEffect(() => {
    const t = setInterval(() => setRadar((r) => r.map((v) => walk(v, 8))), 2200);
    const t2 = setInterval(() => setBars((b) => b.map((v) => walk(v, 5))), 1800);
    const t3 = setInterval(() => {
      counter.current += Math.floor(Math.random() * 4);
      setIdeasCount(counter.current);
    }, 2600);
    return () => { clearInterval(t); clearInterval(t2); clearInterval(t3); };
  }, []);

  return (
    <div className="p-3 space-y-3 text-white">
      <div className="grid grid-cols-3 gap-2">
        <Kpi label="Ideas Synthesized" value={ideasCount.toLocaleString()} color="#8B5CF6" />
        <Kpi label="Network Reach" value="340" suffix="K nodes" color="#7CFFD8" />
        <Kpi label="Entropy Index" value="0.734" color="#FF6B9D" />
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
        <div className="text-[9px] font-mono uppercase tracking-widest text-white/35 mb-1">Idea Velocity — last 36 cycles</div>
        <div className="h-28"><LineChart data={velocity} color="#8B5CF6" /></div>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
        <div className="text-[9px] font-mono uppercase tracking-widest text-white/35 mb-1">Visionary Profile</div>
        <div className="h-52"><RadarChart values={radar} color="#7CFFD8" /></div>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5 space-y-2">
        <div className="text-[9px] font-mono uppercase tracking-widest text-white/35">Domain Saturation</div>
        {DOMAIN_BARS.map((label, i) => (
          <div key={label} className="space-y-0.5">
            <div className="flex justify-between text-[9.5px] font-mono text-white/50">
              <span>{label}</span><span>{bars[i].toFixed(0)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${bars[i]}%`, background: 'linear-gradient(90deg,#8B5CF6,#7CFFD8)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { PANELS } from '../lib/panels';
import { useWM } from '../context/WindowManager';

export default function Taskbar() {
  const { wins, toggleMin, focus } = useWM();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 z-50 flex items-center gap-2 px-4 border-t border-white/10 bg-[#05060a]/85 backdrop-blur-xl overflow-x-auto custom-scroll">
      {PANELS.map((p) => {
        const win = wins[p.id];
        const active = win && !win.minimized;
        const Icon = p.icon;
        return (
          <button
            key={p.id}
            onClick={() => {
              if (win?.minimized) {
                toggleMin(p.id);
                focus(p.id);
              } else if (active) {
                toggleMin(p.id);
              } else {
                focus(p.id);
              }
            }}
            className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-mono tracking-widest uppercase transition-all"
            style={{
              borderColor: active ? `${p.accent}66` : 'rgba(255,255,255,0.08)',
              background: active ? `${p.accent}14` : 'rgba(255,255,255,0.03)',
              color: active ? p.accent : 'rgba(255,255,255,0.45)',
            }}
          >
            <Icon size={13} />
            <span className="hidden lg:inline">{p.title.split('//')[0].trim()}</span>
            <span className="w-1 h-1 rounded-full" style={{ background: active ? p.accent : 'rgba(255,255,255,0.2)' }} />
          </button>
        );
      })}
    </div>
  );
}

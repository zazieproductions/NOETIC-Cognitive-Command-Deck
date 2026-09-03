import { useEffect, useRef, useState, type ComponentType } from 'react';
import { ChevronDown } from 'lucide-react';
import NeuralBackground from './components/NeuralBackground';
import BootSequence from './components/BootSequence';
import TopBar from './components/TopBar';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import { WindowManagerProvider } from './context/WindowManager';
import { PANELS } from './lib/panels';

import MindMap from './components/panels/MindMap';
import NotesVault from './components/panels/NotesVault';
import Analytics from './components/panels/Analytics';
import IdeaSynthesizer from './components/panels/IdeaSynthesizer';
import SocialGraph from './components/panels/SocialGraph';
import HexLab from './components/panels/HexLab';
import TerminalPanel from './components/panels/Terminal';

const PANEL_COMPONENTS: Record<string, ComponentType> = {
  mindmap: MindMap,
  notes: NotesVault,
  analytics: Analytics,
  ideas: IdeaSynthesizer,
  social: SocialGraph,
  hex: HexLab,
  terminal: TerminalPanel,
};

// Below 900px the draggable desktop gives way to an accordion of the same
// panels — the window manager is desktop-only by design.
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 900);
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return mobile;
}

function MobileLayout() {
  const [open, setOpen] = useState<string | null>(PANELS[0].id);
  return (
    <div className="relative z-10 pt-14 pb-4 px-3 space-y-3 min-h-screen">
      {PANELS.map((p) => {
        const Comp = PANEL_COMPONENTS[p.id];
        const isOpen = open === p.id;
        const Icon = p.icon;
        return (
          <div key={p.id} className="rounded-xl border overflow-hidden" style={{ borderColor: `${p.accent}44`, background: 'rgba(9,10,16,0.86)' }}>
            <button
              onClick={() => setOpen(isOpen ? null : p.id)}
              className="w-full flex items-center justify-between px-3 py-3"
              style={{ background: `linear-gradient(90deg, ${p.accent}1c, transparent 70%)` }}
            >
              <span className="flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] uppercase" style={{ color: p.accent }}>
                <Icon size={14} /> {p.title}
              </span>
              <ChevronDown size={14} style={{ color: p.accent, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {isOpen && <div style={{ height: 460 }}>{<Comp />}</div>}
          </div>
        );
      })}
    </div>
  );
}

function Desktop() {
  const boundsRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={boundsRef} className="relative z-10 mt-11 mb-14" style={{ height: 'calc(100vh - 44px - 56px)' }}>
      {PANELS.map((p, i) => {
        const Comp = PANEL_COMPONENTS[p.id];
        return (
          <Window key={p.id} id={p.id} title={p.title} icon={<p.icon size={13} />} accent={p.accent} defaultPos={p.defaultPos} z={10 + i} boundsRef={boundsRef}>
            <Comp />
          </Window>
        );
      })}
    </div>
  );
}

export default function App() {
  const [booted, setBooted] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen w-full text-white overflow-hidden">
      <NeuralBackground />
      {!booted && <BootSequence onDone={() => setBooted(true)} />}
      {booted && (
        <WindowManagerProvider>
          <TopBar />
          {isMobile ? <MobileLayout /> : <Desktop />}
          <Taskbar />
        </WindowManagerProvider>
      )}
    </div>
  );
}

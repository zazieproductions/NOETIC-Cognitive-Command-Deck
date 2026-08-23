import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

export interface WinState {
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
}

interface Ctx {
  wins: Record<string, WinState>;
  register: (id: string, init: WinState) => void;
  focus: (id: string) => void;
  toggleMin: (id: string) => void;
  setRect: (id: string, rect: Partial<WinState>) => void;
  focused: string | null;
}

const WMContext = createContext<Ctx | null>(null);

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [wins, setWins] = useState<Record<string, WinState>>({});
  const [focused, setFocused] = useState<string | null>(null);
  const zCounter = useRef(10);

  const register = useCallback((id: string, init: WinState) => {
    setWins((w) => (w[id] ? w : { ...w, [id]: init }));
  }, []);

  const focus = useCallback((id: string) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setFocused(id);
    setWins((w) => (w[id] ? { ...w, [id]: { ...w[id], z } } : w));
  }, []);

  const toggleMin = useCallback((id: string) => {
    setWins((w) => (w[id] ? { ...w, [id]: { ...w[id], minimized: !w[id].minimized } } : w));
  }, []);

  const setRect = useCallback((id: string, rect: Partial<WinState>) => {
    setWins((w) => (w[id] ? { ...w, [id]: { ...w[id], ...rect } } : w));
  }, []);

  return (
    <WMContext.Provider value={{ wins, register, focus, toggleMin, setRect, focused }}>
      {children}
    </WMContext.Provider>
  );
}

export function useWM() {
  const c = useContext(WMContext);
  if (!c) throw new Error('useWM must be used inside WindowManagerProvider');
  return c;
}

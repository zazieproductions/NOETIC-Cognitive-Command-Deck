import { Brain, StickyNote, Activity, Sparkles, Users, Palette, SquareTerminal } from 'lucide-react';
import type { ComponentType } from 'react';

export interface PanelDef {
  id: string;
  title: string;
  icon: ComponentType<{ size?: number }>;
  accent: string;
  defaultPos: { x: number; y: number; w: number; h: number };
}

export const PANELS: PanelDef[] = [
  { id: 'mindmap', title: 'Neural Concept Lattice', icon: Brain, accent: '#7CFFD8', defaultPos: { x: 40, y: 24, w: 620, h: 460 } },
  { id: 'notes', title: 'Vault // 260 Fragments', icon: StickyNote, accent: '#F7B267', defaultPos: { x: 680, y: 24, w: 520, h: 460 } },
  { id: 'analytics', title: 'Visionary Analytics', icon: Activity, accent: '#8B5CF6', defaultPos: { x: 1220, y: 24, w: 480, h: 460 } },
  { id: 'ideas', title: 'Idea Synthesis Reactor', icon: Sparkles, accent: '#FF6B9D', defaultPos: { x: 40, y: 504, w: 520, h: 420 } },
  { id: 'social', title: 'Social Engineering Grid', icon: Users, accent: '#EF476F', defaultPos: { x: 580, y: 504, w: 560, h: 420 } },
  { id: 'hex', title: 'Chromatic Synthesis Lab', icon: Palette, accent: '#FFD23F', defaultPos: { x: 1160, y: 504, w: 400, h: 420 } },
  { id: 'terminal', title: 'Vision Log // Stream', icon: SquareTerminal, accent: '#39FF88', defaultPos: { x: 1580, y: 24, w: 380, h: 900 } },
];

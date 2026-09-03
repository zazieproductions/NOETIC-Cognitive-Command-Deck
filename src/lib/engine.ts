// NOETIC OS — synthetic cognition engine.
//
// Generator layer: recombines the lexicon (src/lib/lexicon.ts) through seeded
// mulberry32 streams (src/lib/rng.ts) into the deck's datasets. Fixed seeds
// (1337, 2024, 555, 9001+n) mean the archive, lattice, and social graph are
// identical on every boot — the deck presents as an institution with a
// history, not a slot machine. Only explicitly live surfaces (idea synthesis,
// palette synthesis, the vision stream) fall back to Math.random.

import { mulberry32, pick, pickN, range } from './rng';
import {
  ADJECTIVES, CODE_PARTS, DOMAINS, FRAMEWORKS, FRAMES, OBJECTS,
  PRINCIPLES, PROVOCATIONS, ROLES, TAG_POOL, TECHNIQUES, VERBS,
} from './lexicon';

/* ------------------------------------ notes ------------------------------------- */

export interface Note {
  id: number;
  title: string;
  tags: string[];
  body: string;
  day: number;
  links: number[];
}

function sentenceTemplate(rng: () => number): string {
  const templates = [
    () => `${pick(rng, VERBS)} the ${pick(rng, OBJECTS).toLowerCase()} ${pick(rng, FRAMES)}.`,
    () => `Consider a ${pick(rng, ADJECTIVES).toLowerCase()} ${pick(rng, OBJECTS).toLowerCase()} that emerges from ${pick(rng, DOMAINS)}.`,
    () => `${pick(rng, PROVOCATIONS)}`,
    () => `The ${pick(rng, OBJECTS).toLowerCase()} only survives if we ${pick(rng, VERBS).toLowerCase()} its assumptions first.`,
    () => `Borrowing from ${pick(rng, TECHNIQUES).toLowerCase()}, the whole system could ${pick(rng, VERBS).toLowerCase()} itself.`,
  ];
  return pick(rng, templates)();
}

export function generateNotes(count: number): Note[] {
  const rng = mulberry32(1337);
  const notes: Note[] = [];
  for (let i = 0; i < count; i++) {
    const usePrefix = rng() > 0.5;
    const title = usePrefix
      ? `${pick(rng, ADJECTIVES)} ${pick(rng, DOMAINS)}`
      : `On ${pick(rng, VERBS)}ing the ${pick(rng, OBJECTS)}`;
    const tags = pickN(rng, TAG_POOL, 1 + Math.floor(rng() * 3));
    const sentences = range(2 + Math.floor(rng() * 3)).map(() => sentenceTemplate(rng));
    notes.push({
      id: i,
      title,
      tags,
      body: sentences.join(' '),
      day: Math.floor(rng() * 640),
      links: [],
    });
  }
  // Second pass with per-note seeds: backlinks stay stable even though they
  // are derived independently of the corpus stream above.
  notes.forEach((n, i) => {
    const rng2 = mulberry32(9001 + i);
    const linkCount = Math.floor(rng2() * 4);
    const links = new Set<number>();
    for (let k = 0; k < linkCount; k++) {
      const other = Math.floor(rng2() * count);
      if (other !== i) links.add(other);
    }
    n.links = [...links];
  });
  return notes;
}

/* ---------------------------------- mind map ------------------------------------ */

export interface MindNode {
  id: string;
  label: string;
  category: 'Domain' | 'Technique' | 'Framework' | 'Provocation';
  x: number;
  y: number;
  insight: string;
}
export interface MindEdge { a: string; b: string; strength: number }

export const CATEGORY_COLOR: Record<MindNode['category'], string> = {
  Domain: '#7CFFD8',
  Technique: '#FF6B9D',
  Framework: '#8B5CF6',
  Provocation: '#FFD23F',
};

// Virtual canvas the lattice is laid out on; MindMap.tsx pans/zooms a 2200×1400
// coordinate space inside a ~620px window.
export const MIND_CANVAS = { w: 2200, h: 1400 } as const;

export function generateMindMap(): { nodes: MindNode[]; edges: MindEdge[] } {
  const rng = mulberry32(2024);
  const nodes: MindNode[] = [];
  const { w: W, h: H } = MIND_CANVAS;

  const addSet = (arr: string[], category: MindNode['category'], n: number) => {
    pickN(rng, arr, n).forEach((label, idx) => {
      const id = `${category[0]}${idx}-${label.slice(0, 3)}`;
      nodes.push({
        id,
        label,
        category,
        x: W / 2 + Math.cos(rng() * Math.PI * 2) * (300 + rng() * 650),
        y: H / 2 + Math.sin(rng() * Math.PI * 2) * (220 + rng() * 480),
        // Per-node derived seed: node insights stay fixed without burning
        // draws from the layout stream.
        insight: sentenceTemplate(mulberry32(idx * 17 + label.length)),
      });
    });
  };
  addSet(DOMAINS, 'Domain', 14);
  addSet(TECHNIQUES, 'Technique', 12);
  addSet(FRAMEWORKS, 'Framework', 10);
  addSet(PROVOCATIONS, 'Provocation', 10);

  const edges: MindEdge[] = [];
  nodes.forEach((node, i) => {
    const connections = 1 + Math.floor(rng() * 3);
    for (let k = 0; k < connections; k++) {
      const j = Math.floor(rng() * nodes.length);
      if (j !== i) edges.push({ a: node.id, b: nodes[j].id, strength: rng() });
    }
  });
  return { nodes, edges };
}

/* --------------------------------- social graph ---------------------------------- */

export interface SocialNode {
  id: string;
  name: string;
  role: string;
  reach: number;
  trust: number;
  susceptibility: number;
  principle: string;
  x: number;
  y: number;
}
export interface SocialEdge { a: string; b: string; kind: 'trust' | 'neutral' | 'adversarial' }

export const SOCIAL_CANVAS = { w: 1000, h: 720 } as const;

export function generateSocialGraph(): { nodes: SocialNode[]; edges: SocialEdge[] } {
  const rng = mulberry32(555);
  const { w: W, h: H } = SOCIAL_CANVAS;
  const count = 22;
  // Ring layout: personas are placed on an ellipse, then jittered radially.
  const nodes: SocialNode[] = range(count).map((i) => {
    const angle = (i / count) * Math.PI * 2;
    const radius = 250 + rng() * 90;
    return {
      id: `S${i}`,
      name: `${pick(rng, CODE_PARTS)}-${100 + Math.floor(rng() * 899)}`,
      role: pick(rng, ROLES),
      reach: Math.floor(1000 + rng() * 480000),
      trust: Math.round(rng() * 100),
      susceptibility: Math.round(rng() * 100),
      principle: pick(rng, PRINCIPLES).name,
      x: W / 2 + Math.cos(angle) * radius,
      y: H / 2 + Math.sin(angle) * radius * 0.78,
    };
  });
  const edges: SocialEdge[] = [];
  nodes.forEach((n, i) => {
    const links = 1 + Math.floor(rng() * 2);
    for (let k = 0; k < links; k++) {
      const j = Math.floor(rng() * nodes.length);
      if (j === i) continue;
      const roll = rng();
      edges.push({ a: n.id, b: nodes[j].id, kind: roll > 0.8 ? 'adversarial' : roll > 0.4 ? 'trust' : 'neutral' });
    }
  });
  return { nodes, edges };
}

/* ------------------------------------ colors ------------------------------------- */

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) => Math.round(255 * x).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

const HARMONIES = ['Complementary', 'Analogous', 'Triadic', 'Split-Complementary', 'Tetradic'];
const MOOD_WORDS = ['Feral', 'Chromatic', 'Lucid', 'Nocturnal', 'Synaptic', 'Molten', 'Occult', 'Ambient', 'Static', 'Fractal', 'Drift', 'Bloom'];

export function generatePalette(rng: () => number = Math.random) {
  const base = Math.floor(rng() * 360);
  const harmony = pick(rng, HARMONIES);
  const offsets: Record<string, number[]> = {
    Complementary: [0, 180, 30, 210, 15],
    Analogous: [0, 30, 60, -30, -60],
    Triadic: [0, 120, 240, 60, 180],
    'Split-Complementary': [0, 150, 210, 30, 60],
    Tetradic: [0, 90, 180, 270, 45],
  };
  const swatches = offsets[harmony].map((off, i) => {
    const h = (base + off + 360) % 360;
    const s = 55 + rng() * 35;
    const l = i === 0 ? 22 + rng() * 10 : 38 + rng() * 30;
    return hslToHex(h, s, l);
  });
  const mood = `${pick(rng, MOOD_WORDS)} ${pick(rng, MOOD_WORDS)} #${Math.floor(rng() * 9000 + 1000)}`;
  return { swatches, harmony, mood };
}

/* ------------------------------------- ideas -------------------------------------- */

export interface Idea {
  id: number;
  title: string;
  abstract: string;
  tags: string[];
  confidence: number;
  hex: string;
  ts: number;
}

let ideaCounter = 0;
// Live, not seeded: each synthesis is meant to be unrepeatable, unlike the
// fixed archive the rest of the deck boots from.
export function generateIdea(): Idea {
  const rng = Math.random;
  const verb = pick(rng, VERBS);
  const obj = pick(rng, OBJECTS);
  const domain = pick(rng, DOMAINS);
  const frame = pick(rng, FRAMES);
  const adj = pick(rng, ADJECTIVES);
  const title = `${verb} the ${obj} ${frame}`;
  const abstract = `A ${adj.toLowerCase()} proposal at the intersection of ${domain} and ${pick(rng, DOMAINS)}. ` +
    `${sentenceTemplate(rng)} ${sentenceTemplate(rng)} The result: a ${adj.toLowerCase()} ${obj.toLowerCase()} nobody asked for, and everybody needs.`;
  const tags = pickN(rng, TAG_POOL, 2);
  const { swatches } = generatePalette(rng);
  ideaCounter += 1;
  return {
    id: ideaCounter,
    title,
    abstract,
    tags,
    confidence: Math.round(40 + rng() * 59),
    hex: swatches[0],
    ts: Date.now(),
  };
}

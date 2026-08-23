// NOETIC OS — synthetic cognition engine
// Deterministic pseudo-random generators + word banks that power every panel.

export function mulberry32(seed: number) {
  let a = seed;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function pickN<T>(rng: () => number, arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(rng() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

export function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}

/* ---------------------------------- word banks ---------------------------------- */

export const DOMAINS = [
  'Biomimicry', 'Memetics', 'Xenolinguistics', 'Post-Scarcity Economics', 'Quantum Ethics',
  'Computational Mysticism', 'Decentralized Cognition', 'Urban Semiotics', 'Synthetic Ecology',
  'Cryptoanarchism', 'Noopolitics', 'Speculative Anthropology', 'Neuro-Aesthetics',
  'Panpsychist Design', 'Astrobiological Myth-Making', 'Recursive Governance',
  'Hyperstition Engineering', 'Chrono-Economics', 'Swarm Epistemology', 'Glitch Theology',
  'Applied Phenomenology', 'Feral Futurism', 'Semiotic Arbitrage', 'Combinatorial Folklore',
];

export const VERBS = [
  'Decentralize', 'Synthesize', 'Entangle', 'Recompile', 'Ferment', 'Hybridize',
  'Deconstruct', 'Reanimate', 'Terraform', 'Encrypt', 'Democratize', 'Weaponize',
  'Domesticate', 'Liquefy', 'Cross-Pollinate', 'Reprogram', 'Mythologize', 'Distill',
  'Fork', 'Metabolize', 'Rewild', 'Compost', 'Choreograph', 'Unbundle',
];

export const OBJECTS = [
  'Protocol', 'Lattice', 'Mythology', 'Algorithm', 'Marketplace', 'Constitution',
  'Organism', 'Interface', 'Ritual', 'Currency', 'Archive', 'Ecosystem', 'Manifesto',
  'Simulation', 'Ontology', 'Feedback Loop', 'Supply Chain', 'Nervous System',
  'Folk Tale', 'Operating System', 'Border', 'Utopia', 'Contract', 'Dreamscape',
];

export const FRAMES = [
  'through a post-humanist lens', 'as a decentralized protocol', 'via biomimetic feedback loops',
  'under conditions of radical transparency', 'using swarm-intelligence heuristics',
  'as an act of speculative fiction', 'through recursive self-reference',
  'via memetic contagion vectors', 'as a form of applied mysticism',
  'under a post-scarcity paradigm', 'through the optics of game theory', 'via glitch aesthetics',
  'as a form of civilizational infrastructure', 'through non-linear time perception',
  'as a ritual of collective sense-making', 'via adversarial collaboration',
];

export const ADJECTIVES = [
  'Emergent', 'Liminal', 'Recursive', 'Synthetic', 'Feral', 'Radical', 'Latent',
  'Distributed', 'Hyperreal', 'Ambient', 'Fractal', 'Insurgent', 'Occult', 'Lucid',
  'Chthonic', 'Oblique', 'Molecular', 'Nomadic',
];

export const TECHNIQUES = [
  'Desire Path Mapping', 'Signal Jamming', 'Trust Scaffolding', 'Attention Arbitrage',
  'Value Alignment Loops', 'Semantic Satiation', 'Framing Cascades', 'Anchoring Chains',
  'Narrative Priming', 'A/B Cognitive Testing', 'Status Laddering', 'Scarcity Choreography',
  'Identity Mirroring', 'Curiosity Gap Engineering', 'Ritual Onboarding',
];

export const FRAMEWORKS = [
  'Jobs-To-Be-Done', 'Blue Ocean Strategy', 'Diffusion of Innovation', "Hero's Journey",
  'OODA Loop', 'Cynefin Framework', 'Lean Startup', 'Design Thinking', 'Systems Thinking',
  'Behavioral Economics', 'Actor-Network Theory', 'Long Tail Theory',
];

export const PROVOCATIONS = [
  'What if brands were granted legal personhood?', 'What if attention were a currency with inflation?',
  'What if nostalgia could be manufactured on demand?', 'What if trust decayed like a radioactive isotope?',
  'What if a myth could be A/B tested?', 'What if silence became a premium product?',
  'What if every notification carried a tax?', 'What if a company\'s mascot could unionize?',
  'What if boredom were the last untapped resource?', 'What if loyalty programs became religions?',
  'What if your inbox had a heartbeat?', 'What if a rumor could be patented?',
];

export const PRINCIPLES = [
  { name: 'Reciprocity', color: '#7CFFD8', desc: 'Give first — obligation compounds like interest.' },
  { name: 'Scarcity', color: '#FFD23F', desc: 'Perceived rarity inflates perceived value instantly.' },
  { name: 'Authority', color: '#8B5CF6', desc: 'Borrowed credibility short-circuits scrutiny.' },
  { name: 'Consistency', color: '#F7B267', desc: 'Small yeses architect the path to big ones.' },
  { name: 'Liking', color: '#FF6B9D', desc: 'Affinity dissolves resistance before logic arrives.' },
  { name: 'Social Proof', color: '#39FF88', desc: 'The herd is the fastest heuristic humans own.' },
  { name: 'Unity', color: '#EF476F', desc: 'Shared identity converts strangers into kin.' },
];

export const ROLES = ['Connector', 'Gatekeeper', 'Amplifier', 'Skeptic', 'Evangelist', 'Lurker', 'Broker', 'Provocateur'];

export const CODE_PARTS = ['ECHO', 'VESSEL', 'ORACLE', 'CIPHER', 'NOMAD', 'SIGNAL', 'GHOST', 'ANCHOR', 'PROXY', 'WITNESS', 'TEMPLE', 'MIRROR', 'RELAY', 'HALO', 'DRIFT', 'ASH', 'VOID', 'LOOM'];

export const TAG_POOL = [...DOMAINS.slice(0, 14), 'Marketing', 'Strategy', 'Ideation', 'Archive', 'Fragment', 'Draft', 'Manifesto'];

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
  // wire up backlinks after generation for consistency
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

export function generateMindMap(): { nodes: MindNode[]; edges: MindEdge[] } {
  const rng = mulberry32(2024);
  const nodes: MindNode[] = [];
  const W = 2200, H = 1400;

  const addSet = (arr: string[], category: MindNode['category'], n: number) => {
    pickN(rng, arr, n).forEach((label, idx) => {
      const id = `${category[0]}${idx}-${label.slice(0, 3)}`;
      nodes.push({
        id,
        label,
        category,
        x: W / 2 + Math.cos(rng() * Math.PI * 2) * (300 + rng() * 650),
        y: H / 2 + Math.sin(rng() * Math.PI * 2) * (220 + rng() * 480),
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

export function generateSocialGraph(): { nodes: SocialNode[]; edges: SocialEdge[] } {
  const rng = mulberry32(555);
  const W = 1000, H = 720;
  const count = 22;
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

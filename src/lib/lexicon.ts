// NOETIC — the lexicon.
//
// Purely data: the vocabulary the generative engine recombines. Everything in
// this file is a word bank or attribute table consumed by src/lib/engine.ts.
// Editing a bank changes the texture of everything the deck says; the seeds
// in engine.ts decide how it is recombined.

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

// Cialdini's principles of influence, repurposed as "vectors" the Social
// Engineering Grid scores personas against. Color drives node rendering.
export const PRINCIPLES = [
  { name: 'Reciprocity', color: '#7CFFD8', desc: 'Give first — obligation compounds like interest.' },
  { name: 'Scarcity', color: '#FFD23F', desc: 'Perceived rarity inflates perceived value instantly.' },
  { name: 'Authority', color: '#8B5CF6', desc: 'Borrowed credibility short-circuits scrutiny.' },
  { name: 'Consistency', color: '#F7B267', desc: 'Small yeses architect the path to big ones.' },
  { name: 'Liking', color: '#FF6B9D', desc: 'Affinity dissolves resistance before logic arrives.' },
  { name: 'Social Proof', color: '#39FF88', desc: 'The herd is the fastest heuristic humans own.' },
  { name: 'Unity', color: '#EF476F', desc: 'Shared identity converts strangers into kin.' },
] as const;

export const ROLES = ['Connector', 'Gatekeeper', 'Amplifier', 'Skeptic', 'Evangelist', 'Lurker', 'Broker', 'Provocateur'];

export const CODE_PARTS = ['ECHO', 'VESSEL', 'ORACLE', 'CIPHER', 'NOMAD', 'SIGNAL', 'GHOST', 'ANCHOR', 'PROXY', 'WITNESS', 'TEMPLE', 'MIRROR', 'RELAY', 'HALO', 'DRIFT', 'ASH', 'VOID', 'LOOM'];

export const TAG_POOL = [...DOMAINS.slice(0, 14), 'Marketing', 'Strategy', 'Ideation', 'Archive', 'Fragment', 'Draft', 'Manifesto'];

import { describe, expect, it } from 'vitest';
import {
  CATEGORY_COLOR, MIND_CANVAS,
  generateIdea, generateMindMap, generateNotes, generatePalette, generateSocialGraph, hslToHex,
} from './engine';
import { TAG_POOL } from './lexicon';

/**
 * These tests pin the deck's core claim: the archive is deterministic. The
 * same seeds must rebuild the same 260 fragments, the same lattice, and the
 * same social graph on every machine — the deck behaves like an institution
 * with a fixed history, not a random generator.
 */

describe('generateNotes (seed 1337)', () => {
  const a = generateNotes(260);
  const b = generateNotes(260);

  it('is fully deterministic across calls', () => {
    expect(a).toEqual(b);
  });

  it('builds a corpus of 260 well-formed fragments', () => {
    expect(a).toHaveLength(260);
    a.forEach((n) => {
      expect(n.title.trim()).not.toBe('');
      expect(n.body.trim()).not.toBe('');
      expect(n.tags.length).toBeGreaterThanOrEqual(1);
      n.tags.forEach((t) => expect(TAG_POOL).toContain(t));
      expect(n.day).toBeGreaterThanOrEqual(0);
      expect(n.day).toBeLessThan(640);
    });
  });

  it('wires backlinks that reference other fragments and never the fragment itself', () => {
    a.forEach((n) => {
      n.links.forEach((id) => {
        expect(id).not.toBe(n.id);
        expect(id).toBeGreaterThanOrEqual(0);
        expect(id).toBeLessThan(a.length);
      });
      // Set semantics: no duplicate links.
      expect(new Set(n.links).size).toBe(n.links.length);
    });
  });
});

describe('generateMindMap (seed 2024)', () => {
  const a = generateMindMap();
  const b = generateMindMap();

  it('is fully deterministic across calls', () => {
    expect(a).toEqual(b);
  });

  it('lays out 14 domains, 12 techniques, 10 frameworks, 10 provocations', () => {
    const byCategory = a.nodes.reduce<Record<string, number>>((acc, n) => {
      acc[n.category] = (acc[n.category] ?? 0) + 1;
      return acc;
    }, {});
    expect(byCategory).toEqual({ Domain: 14, Technique: 12, Framework: 10, Provocation: 10 });
  });

  it('places every node inside the virtual canvas', () => {
    a.nodes.forEach((n) => {
      expect(n.x).toBeGreaterThanOrEqual(0);
      expect(n.x).toBeLessThanOrEqual(MIND_CANVAS.w);
      expect(n.y).toBeGreaterThanOrEqual(0);
      expect(n.y).toBeLessThanOrEqual(MIND_CANVAS.h);
    });
  });

  it('only edges between existing nodes, never self-edges', () => {
    const ids = new Set(a.nodes.map((n) => n.id));
    a.edges.forEach((e) => {
      expect(ids.has(e.a)).toBe(true);
      expect(ids.has(e.b)).toBe(true);
      expect(e.a).not.toBe(e.b);
      expect(e.strength).toBeGreaterThanOrEqual(0);
      expect(e.strength).toBeLessThan(1);
    });
  });

  it('colors every category', () => {
    a.nodes.forEach((n) => {
      expect(CATEGORY_COLOR[n.category]).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});

describe('generateSocialGraph (seed 555)', () => {
  const a = generateSocialGraph();
  const b = generateSocialGraph();

  it('is fully deterministic across calls', () => {
    expect(a).toEqual(b);
  });

  it('profiles 22 personas with in-range metrics', () => {
    expect(a.nodes).toHaveLength(22);
    a.nodes.forEach((n) => {
      expect(n.name).toMatch(/^[A-Z]+-\d{3}$/);
      expect(n.reach).toBeGreaterThanOrEqual(1000);
      expect(n.reach).toBeLessThan(481_000 + 1000);
      expect(n.trust).toBeGreaterThanOrEqual(0);
      expect(n.trust).toBeLessThanOrEqual(100);
      expect(n.susceptibility).toBeGreaterThanOrEqual(0);
      expect(n.susceptibility).toBeLessThanOrEqual(100);
    });
  });

  it('classifies every edge as trust, neutral, or adversarial', () => {
    const ids = new Set(a.nodes.map((n) => n.id));
    a.edges.forEach((e) => {
      expect(ids.has(e.a)).toBe(true);
      expect(ids.has(e.b)).toBe(true);
      expect(['trust', 'neutral', 'adversarial']).toContain(e.kind);
    });
  });
});

describe('color synthesis', () => {
  it('converts HSL to hex accurately', () => {
    expect(hslToHex(0, 100, 50).toLowerCase()).toBe('#ff0000');
    expect(hslToHex(120, 100, 50).toLowerCase()).toBe('#00ff00');
    expect(hslToHex(240, 100, 50).toLowerCase()).toBe('#0000ff');
  });

  it('produces five valid hex swatches and a known harmony', () => {
    for (let i = 0; i < 50; i++) {
      const p = generatePalette();
      expect(p.swatches).toHaveLength(5);
      p.swatches.forEach((s) => expect(s).toMatch(/^#[0-9a-f]{6}$/i));
      expect(['Complementary', 'Analogous', 'Triadic', 'Split-Complementary', 'Tetradic']).toContain(p.harmony);
    }
  });
});

describe('generateIdea (live, unseeded by design)', () => {
  it('increments synthesis ids and stays well-formed', () => {
    const first = generateIdea();
    const second = generateIdea();
    expect(second.id).toBe(first.id + 1);
    for (const idea of [first, second]) {
      expect(idea.title.trim()).not.toBe('');
      expect(idea.abstract).toContain('proposal');
      expect(idea.confidence).toBeGreaterThanOrEqual(40);
      expect(idea.confidence).toBeLessThanOrEqual(99);
      expect(idea.hex).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

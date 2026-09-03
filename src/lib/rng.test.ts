import { describe, expect, it } from 'vitest';
import { mulberry32, pick, pickN, range } from './rng';

describe('mulberry32', () => {
  it('reproduces the exact sequence for a given seed', () => {
    const a = mulberry32(1337);
    const b = mulberry32(1337);
    for (let i = 0; i < 1000; i++) {
      expect(a()).toBe(b());
    }
  });

  it('produces different sequences for different seeds', () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    const seqA = Array.from({ length: 10 }, () => a());
    const seqB = Array.from({ length: 10 }, () => b());
    expect(seqA).not.toEqual(seqB);
  });

  it('returns floats in [0, 1)', () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 10_000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('pick / pickN / range', () => {
  const rng = mulberry32(7);

  it('pick returns a member of the array', () => {
    const arr = ['a', 'b', 'c'];
    expect(arr).toContain(pick(rng, arr));
  });

  it('pickN returns distinct members and never more than the array holds', () => {
    const arr = ['a', 'b', 'c', 'd'];
    const out = pickN(rng, arr, 3);
    expect(out).toHaveLength(3);
    expect(new Set(out).size).toBe(3);
    expect(pickN(rng, arr, 99)).toHaveLength(4);
  });

  it('range counts from zero', () => {
    expect(range(4)).toEqual([0, 1, 2, 3]);
  });
});

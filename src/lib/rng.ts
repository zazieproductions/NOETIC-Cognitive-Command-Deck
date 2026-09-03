// NOETIC — deterministic randomness primitives.
//
// Every "thought" the deck displays is generated from a seeded mulberry32
// stream, so a given seed always reproduces the same archive, lattice, and
// social graph across sessions and machines. Panels that react to the user
// in real time (idea synthesis, palette synthesis, the vision stream) drop
// down to Math.random on purpose: the archive is fixed, the live feed is not.

/** Fast, well-distributed 32-bit PRNG. Returns floats in [0, 1). */
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

/** Pick one element. `rng` is threaded explicitly so seeds stay call-site owned. */
export function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

/** Pick `n` distinct elements (order-preserving removal from a copy). */
export function pickN<T>(rng: () => number, arr: readonly T[], n: number): T[] {
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

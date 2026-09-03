# The Generative Engine

Subsystem doc · [`src/lib/rng.ts`](../../src/lib/rng.ts) · [`src/lib/lexicon.ts`](../../src/lib/lexicon.ts) · [`src/lib/engine.ts`](../../src/lib/engine.ts)

The engine is three modules with a strict one-way dependency: **`rng`** (determinism primitives) ← **`engine`** (generators) → **`lexicon`** (vocabulary). Panels consume generators; nothing consumes panels.

## Determinism model

All "institutional" data comes from `mulberry32`, a small 32-bit PRNG with good distribution for this purpose. The engine threads the rng *function* through every call (`pick(rng, arr)`) rather than using module state, so each generator owns its stream and sub-streams can be derived deliberately:

| Dataset | Seed | Produced at | Reproduces across boots |
| --- | --- | --- | --- |
| Fragment archive (260 notes) | `1337` | module import (`NotesVault`) | yes — identical corpus on every machine |
| Note backlinks (per note) | `9001 + noteId` | second pass of `generateNotes` | yes |
| Concept lattice (46 nodes + edges) | `2024` | `useMemo` on mount | yes |
| Node insights (per node) | `nodeIndex * 17 + label.length` | inside `generateMindMap` | yes |
| Social graph (22 personas) | `555` | `useMemo` on mount | yes |
| Idea synthesis | — (`Math.random`) | on click | **no — live by design** |
| Palette synthesis | — (`Math.random`, default arg) | on click | **no — live by design** |
| Vision stream lines | — (`Math.random`) | on interval | **no — live by design** |

The derived sub-seeds matter: node insights and backlinks draw from their *own* streams so that adding a feature which consumes one more draw from the main layout stream cannot silently shift every insight in the archive. This is the difference between "seeded" and *composable* determinism, and it is what lets the test suite pin exact corpora.

## The lexicon

`lexicon.ts` is pure data: 11 word banks (domains, verbs, objects, frames, adjectives, techniques, frameworks, provocations, roles, code-name parts, tags) plus the Cialdini `PRINCIPLES` table with its display colors. Sentences are template recombination — `sentenceTemplate` draws one of five grammatical shapes and fills each slot from a bank:

```
"Synthesize the mythology through a post-humanist lens."
"Consider a chthonic ritual that emerges from Glitch Theology."
"What if trust decayed like a radioactive isotope?"
```

The voice of the deck is entirely a property of these banks and templates; the engine contributes only combinatorics. Editing a bank changes what the institution *believes*; editing a seed changes what it *remembers*.

## Generators

- **`generateNotes(count)`** — draws titles (prefix form *"Emergent Xenolinguistics"* or gerund form *"On Fermenting the Protocol"*), 2–4 template sentences, 1–3 tags, an age in days, then a second pass wires 0–3 backlinks per note (never self-links, deduplicated via `Set`).
- **`generateMindMap()`** — picks 14 domains + 12 techniques + 10 frameworks + 10 provocations, scatters them around the canvas center with polar radii (300–950 px horizontal, 220–700 px vertical), then gives each node 1–3 weighted edges to random other nodes.
- **`generateSocialGraph()`** — 22 personas on a jittered ellipse (`radius * 0.78` vertically → reads as a screen, not a circle), each with a code-name (`VESSEL-482`), a role, reach 1k–481k, trust/susceptibility 0–100, and an assigned influence principle; edges are classified trust/neutral/adversarial by roll.
- **`generatePalette(rng = Math.random)`** — picks a base hue and a harmony, derives 5 swatches via HSL→hex with per-index lightness structure (swatch 0 dark = "the ground"), and names the mood (`"Molten Drift #4417"`).
- **`generateIdea()`** — unseeded; assembles title/abstract/tags/confidence and calls `generatePalette` so each idea carries its own color, which tints the reactor card. IDs increment monotonically per session.

## Testing the guarantees

[`src/lib/engine.test.ts`](../../src/lib/engine.test.ts) and [`src/lib/rng.test.ts`](../../src/lib/rng.test.ts) (20 tests) pin the claims above: same seed ⇒ byte-identical corpora; category counts (14/12/10/10); every edge resolves and never self-links; personas in range; palettes are valid hex from a known harmony set; `pickN` never duplicates; `generateIdea` ids increment. If a future change shifts a draw from a main stream, the equality assertions fail loudly — that is the point.

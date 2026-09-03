# Roadmap

What is genuinely intended, in rough priority order. Nothing listed here exists in code today — this file records direction, not features. Statuses: **planned** (committed next), **exploring** (want it, design open), **against** (deliberately not doing).

## 1. Keyboard & screen-reader access — planned

The largest debt ([ARCHITECTURE.md §8](ARCHITECTURE.md#8-limitations-and-technical-compromises)): keyboard-moveable windows, focus trapping inside the active window, accessible names for icon-only controls, `aria-live` on the vision stream, and full `prefers-reduced-motion` handling (freeze the canvas field, slow the meters, stop the pulse).

## 2. Session persistence — planned

`localStorage`-backed session restore: window positions, saved ideas, palette history, lattice edits. Optional "amnesia switch" in the top bar for the pure fiction. The determinism tests make this safe to add — the archive itself never changes.

## 3. Shareable seeds — exploring

A `?seed=` URL parameter that re-seeds the whole institution (archive, lattice, social graph) on load, so a visitor can hand someone *their* NOETIC. Requires promoting the fixed constants in `engine.ts` to a seeded context and extending the test suite to prove arbitrary-seed stability.

## 4. Artifact export — exploring

"Export fragment" / "export idea" as PNG or JSON — the deck currently lets things vanish on refresh. Compositor-side (canvas snapshot of cards) keeps it dependency-free.

## 5. Optional ambient layer — exploring

An *opt-in* generative audio bed (Web Audio: filtered noise drift keyed to telemetry, terminal cadence as soft ticks). Off by default and silent until enabled — the deck's silence is part of the work, so this must deepen it, not fill it.

## 6. True small-screen design — exploring

Below 900 px the panels stack in an accordion at a fixed height. A real redesign would give the lattice and social graph touch-first gestures (pinch-zoom, momentum pan) instead of a shrunken desktop.

## Deliberately against

- **A backend / accounts / cloud sync.** The deck runs entirely in the browser; that is the work, not a limitation.
- **LLM-generated text.** The lexicon-and-templates approach is the artistic position: the institution is procedural, not intelligent.
- **A chart/UI component library.** The hand-rolled SVG charts and ~320-line window manager are the point.
- **New colors outside the token set.** See [docs/technical/visual-and-motion-system.md](docs/technical/visual-and-motion-system.md).

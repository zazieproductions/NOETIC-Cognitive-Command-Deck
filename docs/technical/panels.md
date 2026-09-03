# Panel Reference

Subsystem doc · [`src/components/panels/`](../../src/components/panels/)

Each panel is a self-contained component consuming the [generative engine](generative-engine.md). Panels share no state; the shell treats them as opaque content. Registry (titles, icons, accent colors, default geometry): [`src/lib/panels.ts`](../../src/lib/panels.ts).

## Neural Concept Lattice (`MindMap.tsx`)

**Data:** seeded lattice (seed 2024) — 46 nodes in four categories, 1–3 weighted edges each, on a 2200×1400 virtual canvas.

**Implementation notes:** the whole world is one container `div` with `transform: translate(pan) scale(zoom)`; node coordinates are never converted — the DOM transform does it. Wheel zoom is cursor-anchored: before applying the new scale, the world point under the cursor is solved (`cx = (mx - pan.x) / scale`) and the pan recomposed so that point stays fixed. Node dragging divides pointer deltas by the current scale. Drag-vs-click is disambiguated by a 2 px movement threshold, so clicking selects (or, in link mode, chains edges between two clicks) while dragging repositions. New nodes ("+" button) are placed at the *screen* center converted back into world coordinates and auto-linked to the geometrically nearest existing node — synthetic, but spatially honest.

**Inspector:** the right rail shows the selected node's category, generated insight, connection count, and up to 8 linked nodes as navigation buttons; connected edges highlight (brighter, wider stroke) while selection persists.

## Vault // 260 Fragments (`NotesVault.tsx`)

**Data:** `generateNotes(260)` at module import (seed 1337) — fixed corpus, so search results and backlinks are identical for every visitor.

**Implementation notes:** filtering is `useMemo`'d over query (title + body substring) and AND-combined active tags; the list paginates 50 rows at a time. Tag colors are hash-derived (`hsl(strHash(tag) % 360, 70%, 65%)`) — deterministic without a palette table. Backlinks jump between fragments by id; `ALL_NOTES[id]` lookup makes the graph navigable without loading anything.

## Visionary Analytics (`Analytics.tsx`)

**Data:** no dataset — three `setInterval` streams random-walking from seeds (`walk()` clamps and smooths). KPI trend arrows/percentages are drawn once at mount and frozen, like an exported report; the ideas counter genuinely counts (up).

**Implementation notes:** charts are hand-rolled SVG (a 36-point area line, a six-axis radar, six horizontal bars) — no chart library; the radar recomputes its polygon every 2.2 s.

## Idea Synthesis Reactor (`IdeaSynthesizer.tsx`)

**Data:** `generateIdea()` per click — unseeded, therefore unrepeatable; each idea carries a minted palette color that tints its card.

**Implementation notes:** the current idea scales 0.98 for 400 ms on synthesis (a physical "recoil"); history keeps the last 40; "Save" is a per-session set of ids (no persistence — see limits in [ARCHITECTURE.md](../../ARCHITECTURE.md)).

## Social Engineering Grid (`SocialGraph.tsx`)

**Data:** seeded ring of 22 personas (seed 555) with reach/trust/susceptibility and a Cialdini principle each; edges typed trust/neutral/adversarial (green/grey/red).

**Implementation notes:** the graph is an SVG `viewBox="0 0 1000 720"` with nodes as percentage-positioned divs — dragging converts pointer deltas through `rect.width/1000`, so positions stay in graph units. Node size encodes reach (`8 + reach/60000` px); node color is the persona's principle. The profile rail meters Reach/Trust/Susceptibility and recommends the influence "vector" with the principle's one-line doctrine.

## Chromatic Synthesis Lab (`HexLab.tsx`)

**Data:** `generatePalette()` per click — live harmonies; history keeps the last 12 as strip swatches.

**Implementation notes:** the only panel using a privileged browser API — `navigator.clipboard.writeText` for click-to-copy hex, with a 1 s "copied" confirmation and a silent catch when the clipboard is unavailable.

## Vision Log // Stream (`Terminal.tsx`)

**Data:** unseeded line generator with three kinds — system events (`[PATTERN LOCK] 0x1f9a2c :: Memetics :: confidence 71.4%`), thoughts (template sentences), and glitch blocks (`░▒▓` × 3–8, the deck's signal decay).

**Implementation notes:** seeds 14 lines on mount, then appends on a timer whose cadence is drawn once per mount (0.9–1.8 s — see [ARCHITECTURE.md §8](../../ARCHITECTURE.md#8-limitations-and-technical-compromises) for why this is documented, not fixed). A 160-line ring buffer bounds memory and DOM; the view auto-scrolls to the newest line; the status bar counts buffered events.

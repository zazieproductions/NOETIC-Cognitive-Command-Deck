# Visual & Motion System

Subsystem doc · [`src/index.css`](../../src/index.css) · [`NeuralBackground.tsx`](../../src/components/NeuralBackground.tsx) · [`BootSequence.tsx`](../../src/components/BootSequence.tsx)

## How the aesthetic is produced

NOETIC's look — cybernetic, archival, faintly hostile — is not a theme applied on top of the interface; it falls out of a small set of material decisions:

1. **One dark ground.** `#05060a` everywhere: page, windows (at 86 % alpha), the canvas, the terminal. Nothing is pure black; the ground is deep blue-black, which reads as *screen glow* rather than print.
2. **Accents as institutional coding.** Every panel owns one accent (`panels.ts`): lattice teal `#7CFFD8`, vault amber `#F7B267`, analytics violet `#8B5CF6`, reactor pink `#FF6B9D`, social red `#EF476F`, hex yellow `#FFD23F`, log green `#39FF88`. Window borders, titles, glows, taskbar states, and panel internals are all derived from that single hex with alpha suffixes (`${accent}44`, `${accent}1c`) — so the system reads as color-coded bureaucracy, not decoration.
3. **Two typefaces, two voices.** *Fraunces Variable* (an optical-size serif) speaks for the institution: titles, fragment titles, mood names — authority. *IBM Plex Mono* speaks for the machine: logs, tags, meters, every button label — procedure. Almost all UI text is uppercase, letterspaced (`tracking-[0.2em]` and beyond), and sized 8–13 px: the deck is deliberately dense and slightly *small*, forcing the reader to lean in.
4. **Glass over a living ground.** Windows sit on `backdrop-filter: blur(18px)` above a canvas particle field — the "neural" background that is always moving underneath everything, with a radial vignette and a 48 px teal grid at 4 % opacity. Content floats over a nervous system.
5. **Motion as telemetry.** Nothing animates for delight; everything animates *as instrumentation*: meters walk, the log streams, the cursor block pulses, selected nodes glow, windows materialize once (350 ms, `cubic-bezier(0.16, 1, 0.3, 1)`) like processes being mounted. The boot sequence is the thesis statement — 8 lines of kernel log ending in `ACCESS GRANTED — WELCOME, ARCHITECT.`
6. **Signal decay as texture.** Glitch blocks (`░▒▓`), `//` separators in titles (`Vault // 260 Fragments`), zero-padded ids (`Fragment #0042`), and confidence percentages give every surface the patina of a system that is old, watched, and slightly corrupted.

## Design tokens

Declared once, in Tailwind 4 `@theme`:

```css
--color-noetic-teal:#7CFFD8;  --color-noetic-violet:#8B5CF6;
--color-noetic-pink:#FF6B9D;  --color-noetic-amber:#F7B267;
--color-noetic-red:#EF476F;   --color-noetic-yellow:#FFD23F;
--color-noetic-green:#39FF88;
--font-display:"Fraunces Variable",…serif;  --font-mono:"IBM Plex Mono",…;
```

Selection color is teal at 30 %; scrollbars are custom-thin (WebKit) with `scrollbar-width: thin` elsewhere. Both fonts are self-hosted WOFF2 via Fontsource and bundled at build — the deck renders identically offline, and loads nothing from any CDN at runtime.

## The canvas field

`NeuralBackground.tsx` maintains ≤ 90 particles (viewport-area-scaled) drifting at constant velocity with wall bounces, redrawn in one `requestAnimationFrame` loop: fill ground → advance particles → stroke proximity links (teal, opacity `(1 - d/150) * 0.09` under 150 px) → draw points. The pairwise pass is O(n²) but capped (~4k checks/frame at the maximum particle count). A resize listener reallocates the surface. The canvas sits at `opacity 0.7` under the vignette so it reads as atmosphere, not content.

## Restraint rules (for contributors)

- No new colors outside the token set + panel accents; derive with alpha, not new hexes.
- No animation without a systemic reading (something is being measured, transmitted, mounted, or decaying).
- Uppercase + letterspacing for machine voice; Fraunces only where the institution speaks.
- Keep text small and dense; whitespace is a bug in this fiction, not a feature.
- Reduced-motion support is a known gap ([ROADMAP](../../ROADMAP.md)) — until it lands, do not add motion that would be unusable under one.

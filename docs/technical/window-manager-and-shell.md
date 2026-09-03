# Window Manager & Shell

Subsystem doc · [`src/context/WindowManager.tsx`](../../src/context/WindowManager.tsx) · [`src/components/Window.tsx`](../../src/components/Window.tsx) · [`Taskbar.tsx`](../../src/components/Taskbar.tsx) · [`TopBar.tsx`](../../src/components/TopBar.tsx) · [`BootSequence.tsx`](../../src/components/BootSequence.tsx)

The "operating system" is four shell components and one React context. No router, no layout engine, no drag library — about 320 lines total.

## WindowManager context

A single provider holds:

- `wins: Record<panelId, WinState>` — `{ x, y, w, h, z, minimized }` per window
- `focused: panelId | null` and a `useRef` z-counter starting at 10

with four operations: `register` (idempotent — a window that re-mounts keeps its state), `focus` (bumps the counter, assigns the new `z`, sets `focused`), `toggleMin`, `setRect` (partial patch used by drag/resize at pointer-move frequency).

Windows self-register on mount with geometry from the panel registry ([`panels.ts`](../../src/lib/panels.ts)) and an initial `z` from their boot order. From then on the counter is the only source of truth for stacking: focusing any window permanently raises it above everything focused earlier — classic desktop behavior in ~5 lines.

The taskbar is a pure projection of the registry: active windows glow in their accent color, minimized ones dim; clicking a minimized window restores *and* focuses it, clicking an active one minimizes it.

## Drag & resize (pointer capture)

`Window.tsx` implements both interactions with pointer events and `setPointerCapture`:

- **Drag** stores the pointer start plus the window's origin; on move it clamps `x` to keep ≥ 160 px of the window inside the desktop bounds and `y` within `[0, bounds.height - 44]` (the header can never leave the screen).
- **Resize** is a 16×16 px corner grip (a diagonal accent gradient, intentionally visible) with minima `340×260`.
- Because the capture is on the header/grip element, a fast drag that outruns the window still delivers events; no global `mousemove` listeners are involved.

Minimized windows render `null` — content unmounts, so panel timers clean up via their effect teardown. Restoring re-registers nothing (state persisted in the context) and replays the 350 ms window-in animation.

## The rest of the shell

- **BootSequence** — a fixed 8-line kernel log, one line per 220–460 ms, then 650 ms of stillness; a click anywhere collapses it instantly. It exists to establish the fiction (an institution booting you in) and to buy the ~1 s the first render needs.
- **TopBar** — the deck's most explicit con: a real clock (`toLocaleTimeString`) beside three random-walk meters ("Cognitive Load", "Signal / Noise", "Entropy") that never disclose their synthetic nature.
- **Taskbar** — one button per panel from the same `PANELS` registry that lays out the desktop; on narrow screens the labels collapse to icon + status dot.
- **Desktop vs. mobile** — `useIsMobile` (900 px breakpoint) switches between absolutely-positioned windows and an accordion of the same panel components (`MobileLayout` in `App.tsx`). The window manager still exists on mobile — it is simply unused, which is cheaper than branching the context.

## Known limits

Pointer-only manipulation (no keyboard moving/focusing of windows), no window close (only minimize — the deck cannot lose its own panels), no persistence of positions across refreshes, and no `aria` roles on the window chrome. See [ARCHITECTURE.md §8](../../ARCHITECTURE.md#8-limitations-and-technical-compromises).

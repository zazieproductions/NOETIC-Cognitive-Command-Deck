# Changelog

All notable changes to NOETIC — Cognitive Command Deck. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); dating is by release, not commit.

## [1.0.0] — 2026-09-03 — the canonical archive release

First release of the repository as a documented, deployable work. The baseline application (window shell, seven panels, generative engine) originates from a design-tooling export ("DesignArena build"); this release audits, hardens, and documents it without altering the artistic system.

### Added
- Determinism test suite (Vitest, 20 tests) pinning the seeded corpora — fragment archive, concept lattice, social graph, palette validity — plus RNG primitives (`mulberry32`, `pick`, `pickN`).
- CI workflow: clean install → lint → typecheck → tests → production build (`.github/workflows/ci.yml`).
- Automatic GitHub Pages deployment from `main` with correct base-path handling (`.github/workflows/deploy.yml`), plus manual dispatch.
- Automated screenshot pipeline (`scripts/capture-screenshots.mjs`, Playwright) producing the documentation imagery in `docs/images/`, including the 1280×640 social preview composited from real captures (`scripts/social-preview.html`).
- Documentation set: `README.md` (orientation), `ARCHITECTURE.md` (system design), `docs/technical/` (engine, shell, panels, visual system), `CONTRIBUTING.md`, `SECURITY.md`, `ROADMAP.md`, this changelog, issue/PR templates, `.env.example`.
- Site favicon (the eye mark) and Open Graph / Twitter card metadata.
- `typecheck` and `test` npm scripts; package metadata (name, description, keywords).

### Changed
- **Fonts are now self-hosted** (Fontsource: Fraunces Variable, IBM Plex Mono 400 + italic) instead of fetched from Google Fonts at runtime — identical offline rendering, no third-party requests, and only the weights actually used.
- Generative core reorganized for clarity: word banks extracted to `src/lib/lexicon.ts`, PRNG primitives to `src/lib/rng.ts`, generators remain in `src/lib/engine.ts`. No behavioral change; all seeds preserved.
- Vite config simplified: explicit `VITE_BASE_PATH` support, removal of Next.js-style `NEXT_PUBLIC_` env plumbing and design-tooling source-tag plugin.
- TopBar meters now draw their initial value lazily (previously `Math.random()` ran eagerly on every render — impure render fixed).

### Removed
- Unused dependencies `framer-motion` and `react-router-dom`.
- Design-environment instrumentation from the exported baseline: session-recording script and element-picker/source-tag plugin (`data-source-loc` attribute injection) — foreign telemetry, not part of the work.

### Fixed
- Missing favicon (404 on every load).
- Lint errors: impure render call (TopBar), fast-refresh export violation (WindowManager), unused test import.
- `.gitignore` entries for tooling that no longer exists.

### Known limitations at release
See [ARCHITECTURE.md §8](ARCHITECTURE.md#8-limitations-and-technical-compromises): pointer-only window manipulation, no persistence, no `prefers-reduced-motion`, fixed search corpus, DOM-untested panels, terminal cadence drawn once per mount.

## Pre-history

The application was exported from an internal design/build environment as "NOETIC — Cognitive Command Deck" (single commit, template README). The 1.0.0 audit is the first time its behavior is specified and tested anywhere.

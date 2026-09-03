# Contributing to NOETIC

The deck is a curated creative-technology work, not a product with a roadmap committee — but serious contributions (especially accessibility, engine correctness, and new generative panels that fit the fiction) are welcome.

## Setup

```bash
git clone https://github.com/zazieproductions/NOETIC-Cognitive-Command-Deck.git
cd NOETIC-Cognitive-Command-Deck
npm ci
npm run dev        # http://localhost:5173
```

Node 20+ (developed on 22). All commands: `dev`, `build`, `preview`, `lint`, `typecheck`, `test`, `test:watch`, `capture:screenshots`.

## Before you open a PR

CI ([`ci.yml`](.github/workflows/ci.yml)) must pass, and it checks exactly what you should run locally:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

- **Engine changes:** if you alter any word bank, template, or the *order of draws* from a seeded stream, you will break determinism tests on purpose. That is allowed — but say so in the PR, because it redefines what the "institution remembers" (the corpora change for everyone).
- **New panels:** register in [`src/lib/panels.ts`](src/lib/panels.ts) + `PANEL_COMPONENTS` in [`App.tsx`](src/App.tsx), follow an existing panel for accent usage, and add a short entry in [`docs/technical/panels.md`](docs/technical/panels.md).
- **Visual changes:** read [`docs/technical/visual-and-motion-system.md`](docs/technical/visual-and-motion-system.md) first — the restraint rules are the aesthetic. Derive colors from tokens/accents with alpha; don't introduce new hexes.
- **Screenshots:** if the interface changed visually, regenerate documentation imagery (`npm run preview & npm run capture:screenshots`) and commit the updated `docs/images/`.

## Style

- TypeScript strict; ESLint 9 flat config as shipped. No formatting wars: match the surrounding file.
- Comments explain *why*, not *what* — see existing panels for the register.
- Commit messages: imperative subject ("Add link mode to the lattice", not "added…"). No emoji prefixes.

## Reporting problems

Open an issue using one of the templates (bug or concept). For security matters see [SECURITY.md](SECURITY.md) — do not open public issues for those.

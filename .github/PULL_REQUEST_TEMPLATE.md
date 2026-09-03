## What this changes

<!-- One or two sentences. -->

## Type

- [ ] Engine / generative system
- [ ] Shell / window manager
- [ ] Visual system
- [ ] Documentation
- [ ] Tooling / CI / deployment
- [ ] Other

## Determinism impact

- [ ] None — seeded corpora are byte-identical (`npm test` passes unchanged)
- [ ] **Yes** — draws, banks, or seeds changed; the institution's memory changes. Explain below.

<!-- If seeds changed: which corpora shift, and why that is the right call. -->

## Checklist

- [ ] `npm run lint && npm run typecheck && npm test && npm run build` all pass
- [ ] Visual changes follow the restraint rules (tokens/accents only, motion has a systemic reading)
- [ ] Documentation updated (`docs/technical/panels.md`, `ARCHITECTURE.md` where relevant)
- [ ] If the interface changed visually: `docs/images/` regenerated via `npm run capture:screenshots`

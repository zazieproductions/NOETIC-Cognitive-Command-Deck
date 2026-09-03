# Security Policy

## Scope

NOETIC is a **fully static, client-side application**: no backend, no database, no authentication, no cookies, no analytics, no runtime network requests (fonts and all assets are bundled at build time). The deployed artifact is HTML/CSS/JS on GitHub Pages. Accordingly, the attack surface is minimal and mostly inherited from the toolchain:

- Build-time dependencies (`npm install` of this repository's `package.json`)
- GitHub Actions workflows in this repository
- The usual SPA concerns if the deployment is ever moved behind a dynamic host

Out of scope: the generated *content* of the deck (it is fictional text produced by a seeded PRNG) and denial-of-service against GitHub Pages.

## Data

The deck stores nothing and transmits nothing. No `localStorage`/`sessionStorage` writes, no fetch/XHR/WebSocket calls, no third-party scripts. You can verify this statically: `grep -rn "fetch\|XMLHttpRequest\|WebSocket\|localStorage\|sessionStorage" src/` returns nothing.

## Reporting a vulnerability

If you find a security issue — for example in a dependency, a workflow, or an input sink such as the clipboard-adjacent code paths — please use **GitHub's private vulnerability reporting** on this repository (*Security → Report a vulnerability*), or open a security advisory. Please do not open public issues for security reports.

Include: affected file(s)/workflow(s), a minimal reproduction or proof-of-concept, and impact. Reports are triaged by Zazie Productions; there is no bug-bounty program, but credit will be given in the advisory and [CHANGELOG.md](CHANGELOG.md).

## Hardening posture

- Dependencies are pinned via `package-lock.json` and installed with `npm ci` in CI.
- Workflows follow least-privilege scopes (`contents: read` for CI; Pages deploys use the dedicated `pages`/`id-token` scopes only).
- No secrets are required to build or run the project — `.env.example` documents the single optional public variable.

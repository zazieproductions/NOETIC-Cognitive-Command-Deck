#!/usr/bin/env node
/**
 * NOETIC — automated screenshot capture.
 *
 * Boots a headless browser against a running instance of the deck (by default
 * `vite preview` on http://localhost:4173), drives it through real
 * interactions, and writes the documentation imagery:
 *
 *   docs/images/project-preview.png    — the full, clean desktop interface
 *   docs/images/project-active.png     — live interactive/generative state
 *   docs/images/project-detail.png     — close-up of the concept lattice
 *   docs/images/github-social-preview.png — 1280×640 composite (real imagery)
 *
 * Usage:
 *   npm run build && npm run preview        # in one terminal
 *   npm run capture:screenshots            # in another
 *
 * Environment:
 *   CAPTURE_URL               target URL (default http://localhost:4173)
 *   OUT_DIR                   output directory (default docs/images)
 *   PLAYWRIGHT_EXECUTABLE_PATH  use a specific Chromium/Chrome binary
 *   CHROMIUM_LD_LIBRARY_PATH    LD_LIBRARY_PATH for that binary (if needed)
 *
 * If PLAYWRIGHT_EXECUTABLE_PATH is unset, Playwright's own managed browser is
 * used (install once with `npx playwright install chromium`).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CAPTURE_URL = process.env.CAPTURE_URL ?? 'http://localhost:4173';
const OUT_DIR = path.resolve(ROOT, process.env.OUT_DIR ?? 'docs/images');

// The default desktop layout spans roughly 1960×980 (windows up to x=1580+380,
// plus the 44px top bar and 56px taskbar).
const VIEWPORT = { width: 2000, height: 1150 };

const launchOptions = {};
if (process.env.PLAYWRIGHT_EXECUTABLE_PATH) {
  launchOptions.executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH;
}
if (process.env.CHROMIUM_LD_LIBRARY_PATH) {
  launchOptions.env = {
    ...process.env,
    LD_LIBRARY_PATH: process.env.CHROMIUM_LD_LIBRARY_PATH,
  };
}

const log = (...args) => console.log('[capture]', ...args);

/** The window root for a panel, located by its unique title text. */
const windowByTitle = (page, title) =>
  page.locator('div.rounded-xl', { hasText: title }).first();

async function settle(page, ms = 900) {
  await page.waitForTimeout(ms);
}

async function skipBoot(page) {
  // The boot sequence is click-anywhere-to-skip.
  await page.mouse.click(20, 300);
  await page.locator('div.rounded-xl').first().waitFor({ timeout: 10_000 });
  await page.evaluate(() => document.fonts.ready);
  await settle(page);
  log('boot complete, deck rendered');
}

/** Click the lattice node closest to the visible canvas centre. */
async function clickCentralNode(page) {
  const mind = windowByTitle(page, 'Neural Concept Lattice');
  const canvas = mind.locator('div.touch-none');
  const box = await canvas.boundingBox();
  const nodes = await mind.locator('div.rounded-full.border').all();
  let best = null;
  let bestDist = Infinity;
  for (const node of nodes) {
    const b = await node.boundingBox();
    if (!b) continue;
    const cx = b.x + b.width / 2;
    const cy = b.y + b.height / 2;
    const dist = Math.hypot(cx - (box.x + box.width / 2), cy - (box.y + box.height / 2));
    if (dist < bestDist) {
      bestDist = dist;
      best = { node, b };
    }
  }
  if (!best) throw new Error('no lattice nodes found');
  await best.node.click({ position: { x: best.b.width / 2, y: best.b.height / 2 } });
  log(`selected lattice node (distance ${Math.round(bestDist)}px from centre)`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ ...launchOptions, args: ['--no-sandbox'] });

  try {
    const page = await browser.newPage({ viewport: VIEWPORT });
    log(`opening ${CAPTURE_URL}`);
    await page.goto(CAPTURE_URL, { waitUntil: 'networkidle' });

    // --- 1. Clean interface -------------------------------------------------
    await skipBoot(page);
    await page.screenshot({ path: path.join(OUT_DIR, 'project-preview.png') });
    log('wrote project-preview.png');

    // --- 2. Live / interactive state ----------------------------------------
    // Idea Synthesis Reactor: several synthesis passes fill the history rail.
    const synthButton = page.getByRole('button', { name: 'Synthesize New Idea' });
    for (let i = 0; i < 4; i++) {
      await synthButton.click();
      await settle(page, 200);
    }
    log('synthesized 4 ideas');

    // Chromatic Synthesis Lab: one palette pass fills its history.
    await page.getByRole('button', { name: 'Synthesize Palette' }).click();
    await settle(page, 200);

    // Vault: a search query narrows the fragment list.
    await page.getByPlaceholder('search the vault...').fill('myth');
    log('queried the vault');

    // Social Engineering Grid: profile a persona node (centre-most).
    {
      const social = windowByTitle(page, 'Social Engineering Grid');
      const canvas = social.locator('div.touch-none');
      const box = await canvas.boundingBox();
      const nodes = await social.locator('div.cursor-pointer.flex.flex-col').all();
      let best = null;
      let bestDist = Infinity;
      for (const node of nodes) {
        const b = await node.boundingBox();
        if (!b) continue;
        const cx = b.x + b.width / 2;
        const cy = b.y + b.height / 2;
        const dist = Math.hypot(cx - (box.x + box.width / 2), cy - (box.y + box.height / 2));
        if (dist < bestDist) {
          bestDist = dist;
          best = node;
        }
      }
      if (best) await best.click();
    }
    log('profiled a persona');

    // Let the vision stream and telemetry advance so the shot shows live data.
    await settle(page, 2600);
    await page.screenshot({ path: path.join(OUT_DIR, 'project-active.png') });
    log('wrote project-active.png');

    // --- 3. Technical detail: the concept lattice ----------------------------
    await captureDetail(browser);
    await page.close();
  } finally {
    await browser.close();
  }

  // --- 4. Social preview composite (1280×640) -------------------------------
  await writeSocialPreview();
}

/**
 * The detail shot is taken in its own 2×-DPR context so the close-up stays
 * crisp on high-density displays. The deck is deterministic, so re-booting and
 * re-selecting reproduces the same lattice state as the live page.
 */
async function captureDetail(browser) {
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  await page.goto(CAPTURE_URL, { waitUntil: 'networkidle' });
  await skipBoot(page);

  await clickCentralNode(page);

  // Cursor-anchored zoom into the selection for density.
  const mind = windowByTitle(page, 'Neural Concept Lattice');
  const winBox = await mind.boundingBox();
  const canvasBox = await mind.locator('div.touch-none').boundingBox();
  const cx = canvasBox.x + canvasBox.width / 2;
  const cy = canvasBox.y + canvasBox.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.wheel(0, -400);
  await settle(page, 700);
  await page.mouse.wheel(0, -400);
  await settle(page, 700);

  // Frame the whole window: canvas plus the inspector rail on its right.
  const pad = 6;
  await page.screenshot({
    path: path.join(OUT_DIR, 'project-detail.png'),
    clip: {
      x: Math.max(0, winBox.x - pad),
      y: Math.max(0, winBox.y - pad),
      width: Math.min(VIEWPORT.width - winBox.x, winBox.width + pad * 2),
      height: Math.min(VIEWPORT.height - winBox.y, winBox.height + pad * 2),
    },
  });
  log('wrote project-detail.png');
  await page.close();
}

/** Renders scripts/social-preview.html — a composition of the shots above. */
async function writeSocialPreview() {
  const html = path.join(ROOT, 'scripts', 'social-preview.html');
  const out = path.join(OUT_DIR, 'github-social-preview.png');
  const browser = await chromium.launch({ ...launchOptions, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 640 } });
    await page.goto('file://' + html, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await settle(page, 400);
    await page.screenshot({ path: out });
    log('wrote github-social-preview.png');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('[capture] failed:', err);
  process.exit(1);
});

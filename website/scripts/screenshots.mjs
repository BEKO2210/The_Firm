// Firma OS · Dashboard-Screenshots für die README
//
// Startet keinen eigenen Dev-Server — erwartet, dass http://localhost:3000 läuft.
// Nimmt 6 Routen × Desktop-Viewport auf und speichert in ../docs/screenshots/.
//
// Run:  node website/scripts/screenshots.mjs
// Voraussetzung:  cd website && npm run dev   (in zweitem Terminal)

import { chromium } from "playwright";
import { promises as fs } from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, "..", "..", "docs", "screenshots");

const ROUTES = [
  { path: "/",          name: "01-home" },
  { path: "/inbox",     name: "02-inbox" },
  { path: "/approvals", name: "03-approvals" },
  { path: "/tokens",    name: "04-tokens" },
  { path: "/tools",     name: "05-tools" },
  { path: "/reports",   name: "06-reports" },
];

const BASE = "http://localhost:3000";

await fs.mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
});

for (const route of ROUTES) {
  const page = await ctx.newPage();
  const url = BASE + route.path;
  console.log(`→ ${url}`);
  await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
  // Ein bisschen warten, damit alle SSR-Inhalte sicher gerendert sind
  await page.waitForTimeout(300);
  const outFile = path.join(OUT, `${route.name}.png`);
  await page.screenshot({ path: outFile, fullPage: true });
  const stat = await fs.stat(outFile);
  console.log(`  ${route.name}.png · ${(stat.size / 1024).toFixed(1)} KB`);
  await page.close();
}

await browser.close();
console.log(`OK · 6 Screenshots in ${path.relative(process.cwd(), OUT)}/`);

// Firma OS · Benchmark · Lighthouse für das Dashboard
//
// Standards / Quellen:
//   - Lighthouse 12 (Google, Apache 2.0)  →  https://github.com/GoogleChrome/lighthouse
//   - Core Web Vitals: LCP, INP, CLS, TBT, FCP, SI, TTFB  →  https://web.dev/vitals/
//   - Accessibility-Category nutzt axe-core (Deque, MPL 2.0)
//   - Lighthouse CI Server (Google, Apache 2.0) für reproduzierbare Pipelines
//
// Methodik (deterministisch, A/A reproduzierbar):
//   1. `next build` muss bereits erfolgreich sein.
//   2. `lhci collect` startet `next start`, lädt 3 Routen × 3 Runs, persistiert die
//      vollen LHR-JSON-Reports in website/.lighthouseci/.
//   3. Dieses Script aggregiert daraus die Median-Werte pro Route + Category
//      und schreibt einen stabilen Snapshot nach docs/benchmarks/.
//
// Disclaimer:
//   Performance-Werte hängen vom Throttling-Profil ab (preset=desktop). Vergleiche
//   nur Snapshots mit identischer Methodology-Version.
//
// Run:
//   npm --prefix website run bench:lighthouse          (vorher: npm --prefix website run build)
//   node scripts/firma/benchmarks/lighthouse-dashboard.mjs --json

import path from "node:path";
import url from "node:url";
import { promises as fs } from "node:fs";
import { spawn, spawnSync } from "node:child_process";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..", "..");
const WEBSITE = path.join(ROOT, "website");
const LHCI_OUT = path.join(WEBSITE, ".lighthouseci");

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];
const ROUTES = ["/", "/tools", "/reports"];

function median(arr) {
  if (arr.length === 0) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const m = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[m] : (sorted[m - 1] + sorted[m]) / 2;
}

function pad(s, n) { return String(s).padEnd(n); }
function padR(s, n) { return String(s).padStart(n); }
function fmtScore(v) { return v === null ? "  —" : (v * 100).toFixed(0).padStart(3); }

async function ensureFreshLhciDir() {
  await fs.rm(LHCI_OUT, { recursive: true, force: true });
}

const DEFAULT_CHROME = "/opt/pw-browsers/chromium-1223/chrome-linux64/chrome";

function runLhciCollect() {
  const chromePath = process.env.CHROME_PATH || DEFAULT_CHROME;
  // Wir spawnen lhci direkt — Server-Start, Multi-Run, Cleanup macht lhci selbst.
  const r = spawnSync(
    "npx",
    ["--no-install", "lhci", "collect"],
    {
      cwd: WEBSITE,
      encoding: "utf-8",
      stdio: ["ignore", "inherit", "inherit"],
      env: { ...process.env, CHROME_PATH: chromePath },
    }
  );
  if (r.status !== 0) {
    throw new Error(`lhci collect exit code ${r.status}`);
  }
}

async function readLhrFiles() {
  const entries = await fs.readdir(LHCI_OUT);
  const lhrs = entries.filter((f) => f.startsWith("lhr-") && f.endsWith(".json"));
  const reports = [];
  for (const f of lhrs) {
    const raw = await fs.readFile(path.join(LHCI_OUT, f), "utf-8");
    reports.push(JSON.parse(raw));
  }
  return reports;
}

function routeOfUrl(u) {
  try {
    return new URL(u).pathname || "/";
  } catch {
    return u;
  }
}

function aggregate(reports) {
  // reports[].categories[name].score in [0..1] (or null for n/a)
  // reports[].audits['largest-contentful-paint'].numericValue (ms)
  const byRoute = new Map();
  for (const r of reports) {
    const route = routeOfUrl(r.finalDisplayedUrl || r.requestedUrl || r.finalUrl);
    if (!byRoute.has(route)) byRoute.set(route, []);
    byRoute.get(route).push(r);
  }
  const out = [];
  for (const route of ROUTES) {
    const runs = byRoute.get(route) || [];
    const row = {
      route,
      runs: runs.length,
      lighthouse_version: runs[0]?.lighthouseVersion ?? null,
      user_agent: runs[0]?.userAgent ?? null,
      scores: {},
      web_vitals_ms: {},
    };
    for (const c of CATEGORIES) {
      const scores = runs
        .map((r) => r.categories?.[c]?.score)
        .filter((v) => typeof v === "number");
      row.scores[c] = median(scores);
    }
    // Core Web Vitals (lab values, ms — median über die Runs)
    const vital = (auditId) =>
      median(
        runs
          .map((r) => r.audits?.[auditId]?.numericValue)
          .filter((v) => typeof v === "number")
      );
    row.web_vitals_ms.lcp = vital("largest-contentful-paint");
    row.web_vitals_ms.tbt = vital("total-blocking-time");
    row.web_vitals_ms.cls = vital("cumulative-layout-shift"); // unitless, aber stable median ok
    row.web_vitals_ms.fcp = vital("first-contentful-paint");
    row.web_vitals_ms.speed_index = vital("speed-index");
    row.web_vitals_ms.tti = vital("interactive");
    out.push(row);
  }
  return out;
}

function average(values) {
  const xs = values.filter((v) => typeof v === "number");
  if (xs.length === 0) return null;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

async function main() {
  const wantJson = process.argv.includes("--json");
  const skipCollect = process.argv.includes("--skip-collect");

  if (!skipCollect) {
    await ensureFreshLhciDir();
    runLhciCollect();
  }

  const reports = await readLhrFiles();
  if (reports.length === 0) {
    console.error("Keine LHR-JSONs gefunden — Collect-Step fehlgeschlagen?");
    process.exit(2);
  }

  const perRoute = aggregate(reports);

  // Gesamt-Mittelwert pro Category (über die 3 Routen, gleich gewichtet)
  const overall = {};
  for (const c of CATEGORIES) {
    overall[c] = average(perRoute.map((r) => r.scores[c]));
  }

  const meta = {
    schema: "firma-bench/lighthouse-dashboard/1",
    methodology: {
      tool: "lighthouse 12 + @lhci/cli",
      preset: "desktop",
      runs_per_url: 3,
      aggregator: "median pro URL/Kategorie + arithmetic mean über Routen",
      chrome: spawnSync(
        process.env.CHROME_PATH || DEFAULT_CHROME,
        ["--version"],
        { encoding: "utf-8" }
      ).stdout?.trim() || "chrome-headless via Playwright",
      caveat:
        "Performance hängt vom CPU/Network-Throttling-Profil ab. Nur Snapshots mit identischer schema-Version vergleichen.",
    },
    timestamp: new Date().toISOString(),
    node_version: process.version,
    repo: {
      root: ROOT,
      branch: spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
        cwd: ROOT,
        encoding: "utf-8",
      }).stdout.trim(),
      commit: spawnSync("git", ["rev-parse", "HEAD"], {
        cwd: ROOT,
        encoding: "utf-8",
      }).stdout.trim(),
    },
    target: {
      app: "firma-os-dashboard",
      base_url: "http://localhost:3000",
      routes: ROUTES,
    },
    per_route: perRoute,
    overall_mean: overall,
  };

  const outDir = path.join(ROOT, "docs", "benchmarks");
  await fs.mkdir(outDir, { recursive: true });
  const date = meta.timestamp.slice(0, 10); // YYYY-MM-DD
  const outFile = path.join(outDir, `lighthouse-dashboard-${date}.json`);
  await fs.writeFile(outFile, JSON.stringify(meta, null, 2) + "\n");

  if (wantJson) {
    process.stdout.write(JSON.stringify(meta, null, 2) + "\n");
    return;
  }

  console.log(`# Benchmark · Lighthouse Dashboard  (${meta.timestamp})`);
  console.log("");
  console.log(`- runs/url:  ${meta.methodology.runs_per_url}`);
  console.log(`- preset:    ${meta.methodology.preset}`);
  console.log(`- chrome:    ${meta.methodology.chrome}`);
  console.log(`- branch:    ${meta.repo.branch} @ ${meta.repo.commit.slice(0, 7)}`);
  console.log("");
  console.log("Scores (0-100, je höher desto besser):");
  console.log("");
  console.log("| Route     | Perf | A11y | BP  | SEO |");
  console.log("|-----------|-----:|-----:|----:|----:|");
  for (const r of perRoute) {
    console.log(
      `| ${pad(r.route, 9)} | ${fmtScore(r.scores.performance)} | ${fmtScore(
        r.scores.accessibility
      )} | ${fmtScore(r.scores["best-practices"])} | ${fmtScore(r.scores.seo)} |`
    );
  }
  console.log(
    `| ${pad("⌀ mean", 9)} | ${fmtScore(overall.performance)} | ${fmtScore(
      overall.accessibility
    )} | ${fmtScore(overall["best-practices"])} | ${fmtScore(overall.seo)} |`
  );
  console.log("");
  console.log("Core Web Vitals (Median, Lab, desktop preset):");
  console.log("");
  console.log("| Route     | LCP ms | TBT ms | CLS    | FCP ms | TTI ms |");
  console.log("|-----------|-------:|-------:|-------:|-------:|-------:|");
  for (const r of perRoute) {
    const v = r.web_vitals_ms;
    const num = (x, d = 0) => (x === null ? "   —" : x.toFixed(d));
    console.log(
      `| ${pad(r.route, 9)} | ${padR(num(v.lcp), 6)} | ${padR(num(v.tbt), 6)} | ${padR(
        num(v.cls, 3),
        6
      )} | ${padR(num(v.fcp), 6)} | ${padR(num(v.tti), 6)} |`
    );
  }
  console.log("");
  console.log(`Snapshot: ${path.relative(ROOT, outFile)}`);
}

main().catch((e) => {
  console.error("bench error:", e?.stack || e);
  process.exit(1);
});

// Firma OS · Benchmark · axe-core Accessibility-Audit (WCAG 2.1 AA)
//
// Standards:
//   - axe-core 4 (Deque Systems, MPL 2.0)  →  https://github.com/dequelabs/axe-core
//   - WCAG 2.1 AA  (W3C Recommendation)    →  https://www.w3.org/TR/WCAG21/
//   - @axe-core/playwright (offizielles Binding, MPL 2.0)
//
// Warum dieser Benchmark zusätzlich zu Lighthouse?
//   Lighthouse läuft nur ein Subset der axe-Regeln (ca. 30-40 der ~90 Regeln, Stand 2026).
//   Für eine ehrliche WCAG-2.1-AA-Aussage brauchen wir den vollständigen axe-Run.
//
// Methodik (deterministisch, reproduzierbar):
//   1. Build (next build) + Server (next start) müssen laufen — der Runner spawnt
//      `next start` selbst und schließt ihn am Ende.
//   2. Playwright öffnet jede Route in Chromium (headless), wartet auf networkidle.
//   3. axe-core läuft mit WCAG 2.0/2.1 Level A + AA Tags  ('wcag2a','wcag2aa','wcag21a','wcag21aa').
//   4. Violations werden nach Impact (critical/serious/moderate/minor) aggregiert.
//   5. Snapshot wird nach docs/benchmarks/axe-dashboard-YYYY-MM-DD.json geschrieben.
//
// Run:
//   npm run bench:axe                       (vorher: npm --prefix website run build)
//   node scripts/firma/benchmarks/axe-dashboard.mjs --json
//   node scripts/firma/benchmarks/axe-dashboard.mjs --base http://localhost:3001   (eigenen Server)

import path from "node:path";
import url from "node:url";
import { promises as fs } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import net from "node:net";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..", "..");
const WEBSITE = path.join(ROOT, "website");

const ROUTES = ["/", "/inbox", "/approvals", "/tokens", "/tools", "/reports"];
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];
const IMPACTS = ["critical", "serious", "moderate", "minor"];

function arg(name, def) {
  const i = process.argv.indexOf(name);
  return i >= 0 && i + 1 < process.argv.length ? process.argv[i + 1] : def;
}

function waitForPort(port, host = "127.0.0.1", timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      const sock = net.createConnection({ port, host });
      sock.once("connect", () => {
        sock.destroy();
        resolve();
      });
      sock.once("error", () => {
        sock.destroy();
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Port ${port} nicht erreichbar nach ${timeoutMs} ms`));
        } else {
          setTimeout(tick, 250);
        }
      });
    };
    tick();
  });
}

async function startServerIfNeeded(base) {
  // Wenn ein eigener --base übergeben wurde, gehen wir davon aus, dass er läuft.
  if (process.argv.includes("--base")) return { stop: async () => {} };
  const port = Number(new URL(base).port || 3000);
  // Direkter next-Binary statt `npm start` — `npm` propagiert SIGTERM nicht
  // zuverlässig an seinen Child-Prozess, was beim Cleanup zu Zombies führt.
  const nextBin = path.join(WEBSITE, "node_modules", ".bin", "next");
  const proc = spawn(nextBin, ["start", "-p", String(port)], {
    cwd: WEBSITE,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, PORT: String(port) },
    detached: true, // eigene Prozess-Gruppe für sauberes Kill
  });
  proc.stdout.on("data", () => {});
  proc.stderr.on("data", () => {});
  try {
    await waitForPort(port);
  } catch (e) {
    try { process.kill(-proc.pid, "SIGTERM"); } catch {}
    throw e;
  }
  return {
    stop: () =>
      new Promise((res) => {
        let done = false;
        const finish = () => { if (!done) { done = true; res(); } };
        proc.once("close", finish);
        try { process.kill(-proc.pid, "SIGTERM"); } catch {}
        setTimeout(() => {
          try { process.kill(-proc.pid, "SIGKILL"); } catch {}
          finish();
        }, 3000);
      }),
  };
}

async function runAxeOn(page, axePkg, route, base) {
  await page.goto(base + route, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(200);
  const { AxeBuilder } = axePkg;
  const builder = new AxeBuilder({ page }).withTags(WCAG_TAGS);
  const result = await builder.analyze();
  return result;
}

function summarize(result) {
  const byImpact = Object.fromEntries(IMPACTS.map((k) => [k, 0]));
  for (const v of result.violations) {
    const k = v.impact || "minor";
    byImpact[k] = (byImpact[k] || 0) + 1;
  }
  return {
    violations_count: result.violations.length,
    by_impact: byImpact,
    passes_count: result.passes.length,
    incomplete_count: result.incomplete.length,
    inapplicable_count: result.inapplicable.length,
    violations: result.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      helpUrl: v.helpUrl,
      tags: v.tags,
      nodes_count: v.nodes.length,
      sample_target: v.nodes.slice(0, 2).map((n) => n.target),
      sample_snippet: v.nodes.slice(0, 2).map((n) => n.html?.slice(0, 200)),
    })),
  };
}

function pad(s, n) { return String(s).padEnd(n); }
function padR(s, n) { return String(s).padStart(n); }

async function main() {
  const wantJson = process.argv.includes("--json");
  const base = arg("--base", "http://localhost:3000");

  // Imports nach process-init (Playwright + axe-core/playwright leben in website/node_modules)
  const playwright = await import(path.join(WEBSITE, "node_modules", "playwright", "index.mjs"));
  const axePkg = await import(path.join(WEBSITE, "node_modules", "@axe-core", "playwright", "dist", "index.js"));
  const axeCoreVersion = JSON.parse(
    await fs.readFile(
      path.join(WEBSITE, "node_modules", "axe-core", "package.json"),
      "utf-8"
    )
  ).version;

  const server = await startServerIfNeeded(base);

  let browser;
  const perRoute = [];
  try {
    browser = await playwright.chromium.launch({ args: ["--no-sandbox"] });
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });

    for (const route of ROUTES) {
      const page = await ctx.newPage();
      try {
        const r = await runAxeOn(page, axePkg, route, base);
        perRoute.push({ route, ...summarize(r), test_engine: r.testEngine });
      } finally {
        await page.close();
      }
    }
  } finally {
    if (browser) await browser.close();
    await server.stop();
  }

  const total = {
    violations: perRoute.reduce((a, r) => a + r.violations_count, 0),
    by_impact: Object.fromEntries(
      IMPACTS.map((k) => [k, perRoute.reduce((a, r) => a + (r.by_impact[k] || 0), 0)])
    ),
    incomplete: perRoute.reduce((a, r) => a + r.incomplete_count, 0),
  };

  const meta = {
    schema: "firma-bench/axe-dashboard/1",
    methodology: {
      tool: `axe-core ${axeCoreVersion} + @axe-core/playwright`,
      standard: "WCAG 2.1 AA (W3C)",
      tags: WCAG_TAGS,
      runner: "Playwright Chromium headless, viewport 1280×900, waitUntil=networkidle",
      caveat:
        "Automatisierte Audits erfassen typischerweise ~57 % der WCAG-Issues (Deque). Manuelle Prüfung bleibt nötig für Tastatur-Navigation, Screen-Reader-Flows, kognitive Last.",
    },
    timestamp: new Date().toISOString(),
    node_version: process.version,
    repo: {
      root: ROOT,
      branch: spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
        cwd: ROOT, encoding: "utf-8",
      }).stdout.trim(),
      commit: spawnSync("git", ["rev-parse", "HEAD"], {
        cwd: ROOT, encoding: "utf-8",
      }).stdout.trim(),
    },
    target: { app: "firma-os-dashboard", base_url: base, routes: ROUTES },
    per_route: perRoute,
    totals: total,
  };

  const outDir = path.join(ROOT, "docs", "benchmarks");
  await fs.mkdir(outDir, { recursive: true });
  const date = meta.timestamp.slice(0, 10);
  const outFile = path.join(outDir, `axe-dashboard-${date}.json`);
  await fs.writeFile(outFile, JSON.stringify(meta, null, 2) + "\n");

  if (wantJson) {
    process.stdout.write(JSON.stringify(meta, null, 2) + "\n");
    return;
  }

  console.log(`# Benchmark · axe-core WCAG 2.1 AA  (${meta.timestamp})`);
  console.log("");
  console.log(`- tool:   ${meta.methodology.tool}`);
  console.log(`- tags:   ${WCAG_TAGS.join(", ")}`);
  console.log(`- branch: ${meta.repo.branch} @ ${meta.repo.commit.slice(0, 7)}`);
  console.log("");
  console.log("| Route       | Viol | Crit | Ser | Mod | Min | Incompl | Passes |");
  console.log("|-------------|-----:|-----:|----:|----:|----:|--------:|-------:|");
  for (const r of perRoute) {
    console.log(
      `| ${pad(r.route, 11)} | ${padR(r.violations_count, 4)} | ${padR(r.by_impact.critical, 4)} | ${padR(r.by_impact.serious, 3)} | ${padR(r.by_impact.moderate, 3)} | ${padR(r.by_impact.minor, 3)} | ${padR(r.incomplete_count, 7)} | ${padR(r.passes_count, 6)} |`
    );
  }
  console.log(
    `| ${pad("Σ", 11)} | ${padR(total.violations, 4)} | ${padR(total.by_impact.critical, 4)} | ${padR(total.by_impact.serious, 3)} | ${padR(total.by_impact.moderate, 3)} | ${padR(total.by_impact.minor, 3)} | ${padR(total.incomplete, 7)} | ${padR("—", 6)} |`
  );
  console.log("");
  if (total.violations > 0) {
    console.log("Violations (Top-3 pro Route, Impact + Rule):");
    for (const r of perRoute) {
      if (r.violations_count === 0) continue;
      console.log(`  ${r.route}:`);
      for (const v of r.violations.slice(0, 3)) {
        console.log(`    - [${v.impact}] ${v.id} · ${v.help} (${v.nodes_count} nodes)`);
      }
    }
    console.log("");
  } else {
    console.log("✓ Keine WCAG 2.1 AA-Verletzungen automatisiert messbar.");
    console.log("");
  }
  console.log(meta.methodology.caveat);
  console.log("");
  console.log(`Snapshot: ${path.relative(ROOT, outFile)}`);
}

main().catch((e) => {
  console.error("bench error:", e?.stack || e);
  process.exit(1);
});

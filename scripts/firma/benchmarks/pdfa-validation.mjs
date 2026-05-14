// Firma OS · Benchmark · PDF/A-2 Validierung der Typst-Outputs
//
// Standards:
//   - ISO 19005-2:2011 (PDF/A-2) — Langzeitarchivierungs-Format
//   - veraPDF (veraPDF Consortium, MPL 2.0 / GPLv3 dual) — die offizielle
//     PDF/A-Referenz-Validierung, getragen von der PDF Association.
//     https://verapdf.org
//
// Warum PDF/A-2 für Firma OS?
//   Angebote + Rechnungen müssen revisionssicher archivierbar sein (GoBD, §147 AO:
//   10 Jahre Aufbewahrung). PDF/A-2b garantiert: alle Fonts eingebettet, keine
//   externen Abhängigkeiten, deterministisches Rendering über Jahrzehnte.
//
// Methodik (deterministisch, reproduzierbar):
//   1. Sammelt alle gerenderten PDFs aus .firma/finance/quotes/<id>/ + docs/quotes/.
//   2. Ruft veraPDF mit --flavour 2b (PDF/A-2 Level B) je Datei auf.
//   3. Parst compliant / passedChecks / failedChecks + failende Rules (clause).
//   4. Snapshot nach docs/benchmarks/pdfa-validation-YYYY-MM-DD.json.
//
// veraPDF-Auflösung:  $VERAPDF_BIN  →  `verapdf` in PATH  →  graceful skip.
//
// Run:
//   npm run bench:pdfa
//   VERAPDF_BIN=/pfad/zu/verapdf npm run bench:pdfa
//   node scripts/firma/benchmarks/pdfa-validation.mjs --json

import path from "node:path";
import url from "node:url";
import { promises as fs } from "node:fs";
import { spawnSync } from "node:child_process";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..", "..");

const FLAVOUR = "2b"; // PDF/A-2 Level B
const PDF_DIRS = [
  path.join(ROOT, ".firma", "finance", "quotes"),
  path.join(ROOT, "docs", "quotes"),
];

function git(args) {
  return spawnSync("git", args, { cwd: ROOT, encoding: "utf-8" }).stdout.trim();
}

async function collectPdfs() {
  const found = [];
  for (const dir of PDF_DIRS) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true, recursive: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      if (e.isFile() && e.name.toLowerCase().endsWith(".pdf")) {
        const full = path.join(e.parentPath || dir, e.name);
        found.push(full);
      }
    }
  }
  // Deduplizieren (docs/quotes/ und .firma/ können dieselbe Datei spiegeln)
  return [...new Set(found)].sort();
}

function resolveVerapdf() {
  if (process.env.VERAPDF_BIN) {
    const r = spawnSync(process.env.VERAPDF_BIN, ["--version"], { encoding: "utf-8" });
    if (r.status === 0) return process.env.VERAPDF_BIN;
  }
  const which = spawnSync("sh", ["-c", "command -v verapdf"], { encoding: "utf-8" });
  if (which.status === 0 && which.stdout.trim()) return which.stdout.trim();
  return null;
}

function verapdfVersion(bin) {
  const r = spawnSync(bin, ["--version"], { encoding: "utf-8" });
  return r.stdout?.split("\n")[0]?.trim() || "unknown";
}

// veraPDF MRR (machine-readable report) ist XML. Wir parsen die wenigen Felder,
// die wir brauchen, mit Regex — kein XML-Dependency nötig, das Format ist stabil.
function parseMrr(xml) {
  const get = (re) => {
    const m = xml.match(re);
    return m ? m[1] : null;
  };
  const compliant = get(/isCompliant="([^"]+)"/);
  const passedChecks = Number(get(/passedChecks="([^"]+)"/) || 0);
  const failedChecks = Number(get(/failedChecks="([^"]+)"/) || 0);
  const passedRules = Number(get(/passedRules="([^"]+)"/) || 0);
  const failedRules = Number(get(/failedRules="([^"]+)"/) || 0);
  // Failende Rules mit Clause extrahieren
  const ruleRe = /<rule[^>]*specification="([^"]*)"[^>]*clause="([^"]*)"[^>]*testNumber="([^"]*)"[^>]*status="failed"[^>]*>/g;
  const failed = [];
  let m;
  while ((m = ruleRe.exec(xml)) !== null) {
    failed.push({ specification: m[1], clause: m[2], testNumber: m[3] });
  }
  // Fallback: manche veraPDF-Versionen ordnen status anders an
  if (failed.length === 0) {
    const altRe = /<rule[^>]*clause="([^"]*)"[^>]*testNumber="([^"]*)"[^>]*passedChecks="0"/g;
    while ((m = altRe.exec(xml)) !== null) {
      failed.push({ specification: "ISO 19005-2:2011", clause: m[1], testNumber: m[2] });
    }
  }
  return {
    compliant: compliant === "true",
    passed_checks: passedChecks,
    failed_checks: failedChecks,
    passed_rules: passedRules,
    failed_rules: failedRules,
    failed_rule_details: failed,
  };
}

function validatePdf(bin, pdfPath) {
  const r = spawnSync(bin, ["--flavour", FLAVOUR, "--format", "mrr", pdfPath], {
    encoding: "utf-8",
    maxBuffer: 32 * 1024 * 1024,
  });
  const xml = r.stdout || "";
  const parsed = parseMrr(xml);
  return { ...parsed, raw_available: xml.length > 0 };
}

function pad(s, n) { return String(s).padEnd(n); }
function padR(s, n) { return String(s).padStart(n); }

async function main() {
  const wantJson = process.argv.includes("--json");

  const pdfs = await collectPdfs();
  const bin = resolveVerapdf();

  const results = [];
  if (bin) {
    for (const pdf of pdfs) {
      const res = validatePdf(bin, pdf);
      results.push({ file: path.relative(ROOT, pdf), ...res });
    }
  }

  const allCompliant = bin && results.length > 0 && results.every((r) => r.compliant);

  const meta = {
    schema: "firma-bench/pdfa-validation/1",
    methodology: {
      tool: bin ? `veraPDF ${verapdfVersion(bin)} (veraPDF Consortium, MPL 2.0)` : "veraPDF (nicht verfügbar — skipped)",
      standard: "ISO 19005-2:2011 (PDF/A-2 Level B)",
      flavour: FLAVOUR,
      scope: PDF_DIRS.map((d) => path.relative(ROOT, d)),
      rationale:
        "PDF/A-2b garantiert revisionssichere Langzeitarchivierung (GoBD, §147 AO 10 Jahre): alle Fonts eingebettet, keine externen Abhängigkeiten, deterministisches Rendering.",
      caveat:
        "Level B ('basic') prüft visuelle Reproduzierbarkeit. Level A ('accessible') würde zusätzlich Tagged-PDF / Strukturbaum fordern — bewusst nicht Teil dieses Benchmarks, da Typst aktuell kein PDF/A-2a erzeugt.",
    },
    timestamp: new Date().toISOString(),
    node_version: process.version,
    repo: {
      root: ROOT,
      branch: git(["rev-parse", "--abbrev-ref", "HEAD"]),
      commit: git(["rev-parse", "HEAD"]),
    },
    verapdf_available: Boolean(bin),
    pdfs_found: pdfs.length,
    results,
    totals: {
      validated: results.length,
      compliant: results.filter((r) => r.compliant).length,
      non_compliant: results.filter((r) => !r.compliant).length,
      all_compliant: allCompliant,
    },
  };

  const outDir = path.join(ROOT, "docs", "benchmarks");
  await fs.mkdir(outDir, { recursive: true });
  const date = meta.timestamp.slice(0, 10);
  const outFile = path.join(outDir, `pdfa-validation-${date}.json`);
  await fs.writeFile(outFile, JSON.stringify(meta, null, 2) + "\n");

  if (wantJson) {
    process.stdout.write(JSON.stringify(meta, null, 2) + "\n");
    return;
  }

  console.log(`# Benchmark · PDF/A-2 Validierung  (${meta.timestamp})`);
  console.log("");
  console.log(`- standard: ${meta.methodology.standard}`);
  console.log(`- tool:     ${meta.methodology.tool}`);
  console.log(`- branch:   ${meta.repo.branch} @ ${meta.repo.commit.slice(0, 7)}`);
  console.log("");

  if (!bin) {
    console.log("veraPDF: SKIP — Binary nicht gefunden ($VERAPDF_BIN oder PATH).");
    console.log("  Install: https://verapdf.org/software/");
    console.log("  Dann: VERAPDF_BIN=/pfad/zu/verapdf npm run bench:pdfa");
    console.log("");
    console.log(`Snapshot: ${path.relative(ROOT, outFile)}`);
    return;
  }

  if (pdfs.length === 0) {
    console.log("Keine PDFs gefunden. Erst ein Angebot rendern (firma report quote).");
    console.log("");
    console.log(`Snapshot: ${path.relative(ROOT, outFile)}`);
    return;
  }

  console.log("| Datei                                            | PDF/A-2b | Checks ✓ | Checks ✗ |");
  console.log("|--------------------------------------------------|----------|---------:|---------:|");
  for (const r of results) {
    const status = r.compliant ? "  PASS  " : "  FAIL  ";
    console.log(
      `| ${pad(r.file.slice(0, 48), 48)} | ${status} | ${padR(r.passed_checks, 8)} | ${padR(r.failed_checks, 8)} |`
    );
  }
  console.log("");
  const failing = results.filter((r) => !r.compliant);
  if (failing.length > 0) {
    console.log("Failende Rules:");
    for (const r of failing) {
      for (const d of r.failed_rule_details) {
        console.log(`  ${r.file}: ${d.specification} clause ${d.clause} (test ${d.testNumber})`);
      }
    }
    console.log("");
  } else {
    console.log("✓ Alle gerenderten PDFs sind PDF/A-2b-konform (revisionssicher archivierbar).");
    console.log("");
  }
  console.log(meta.methodology.caveat);
  console.log("");
  console.log(`Snapshot: ${path.relative(ROOT, outFile)}`);

  if (failing.length > 0) {
    console.error(`\n✗ ${failing.length} nicht-konforme PDF(s) — Exit 1.`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("bench error:", e?.stack || e);
  process.exit(1);
});

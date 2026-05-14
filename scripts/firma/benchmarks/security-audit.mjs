// Firma OS · Benchmark · Security-Audit (npm audit + Trivy CVE-Scan)
//
// Standards:
//   - npm audit  →  GitHub Advisory Database (npm-eigene CVE-Quelle)
//   - Trivy (Aqua Security, Apache 2.0)  →  CVE-Datenbank + GitHub Advisory + OSV
//     https://github.com/aquasecurity/trivy
//   - OWASP Top 10 (A06:2021 — Vulnerable and Outdated Components)
//
// Methodik (deterministisch, reproduzierbar):
//   1. `npm audit --json` in Repo-Root UND website/ — deckt prod + dev dependencies.
//   2. `trivy fs --scanners vuln,secret` über das Repo (node_modules/.next ausgenommen,
//      Lockfiles werden direkt geparst). Trivy ist optional: ist das Binary nicht
//      verfügbar, wird der Trivy-Block als "skipped" markiert — kein Fake-Ergebnis.
//   3. Aggregation nach Severity (critical/high/moderate-medium/low) + Secrets.
//   4. Snapshot nach docs/benchmarks/security-audit-YYYY-MM-DD.json.
//
// Trivy-Binary-Auflösung:  $TRIVY_BIN  →  `trivy` in PATH  →  skip.
//
// Run:
//   npm run bench:security
//   TRIVY_BIN=/pfad/zu/trivy npm run bench:security
//   node scripts/firma/benchmarks/security-audit.mjs --json

import path from "node:path";
import url from "node:url";
import { promises as fs } from "node:fs";
import { spawnSync } from "node:child_process";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..", "..");
const WEBSITE = path.join(ROOT, "website");

function git(args) {
  return spawnSync("git", args, { cwd: ROOT, encoding: "utf-8" }).stdout.trim();
}

// --- npm audit -------------------------------------------------------------

function npmAudit(cwd) {
  const r = spawnSync("npm", ["audit", "--json"], {
    cwd,
    encoding: "utf-8",
    maxBuffer: 32 * 1024 * 1024,
  });
  // npm audit exit code != 0, wenn Vulns gefunden — das ist erwartetes Verhalten,
  // wir parsen trotzdem stdout.
  let parsed;
  try {
    parsed = JSON.parse(r.stdout);
  } catch {
    return { error: "npm audit JSON nicht parsebar", raw: r.stdout?.slice(0, 500) };
  }
  const vulns = parsed.metadata?.vulnerabilities || {};
  const advisories = Object.entries(parsed.vulnerabilities || {}).map(([name, v]) => ({
    name,
    severity: v.severity,
    range: v.range,
    via: Array.isArray(v.via)
      ? v.via.map((x) => (typeof x === "string" ? x : x.title)).filter(Boolean)
      : [v.via].filter(Boolean),
    fixAvailable:
      typeof v.fixAvailable === "object"
        ? { name: v.fixAvailable.name, version: v.fixAvailable.version, semverMajor: v.fixAvailable.isSemVerMajor }
        : v.fixAvailable,
  }));
  return {
    severity_counts: {
      critical: vulns.critical || 0,
      high: vulns.high || 0,
      moderate: vulns.moderate || 0,
      low: vulns.low || 0,
      info: vulns.info || 0,
      total: vulns.total || 0,
    },
    advisories,
  };
}

// --- Trivy -----------------------------------------------------------------

function resolveTrivy() {
  if (process.env.TRIVY_BIN) {
    const r = spawnSync(process.env.TRIVY_BIN, ["--version"], { encoding: "utf-8" });
    if (r.status === 0) return process.env.TRIVY_BIN;
  }
  const which = spawnSync("sh", ["-c", "command -v trivy"], { encoding: "utf-8" });
  if (which.status === 0 && which.stdout.trim()) return which.stdout.trim();
  return null;
}

function trivyScan(bin) {
  const version =
    spawnSync(bin, ["--version"], { encoding: "utf-8" }).stdout?.split("\n")[0]?.trim() ||
    "unknown";
  const cacheDir = process.env.TRIVY_CACHE_DIR || path.join(ROOT, ".firma", "cache", "trivy");
  const r = spawnSync(
    bin,
    [
      "fs",
      "--scanners", "vuln,secret",
      "--include-dev-deps",
      "--severity", "LOW,MEDIUM,HIGH,CRITICAL",
      "--format", "json",
      "--skip-dirs", "node_modules,.next",
      "--quiet",
      ".",
    ],
    { cwd: ROOT, encoding: "utf-8", maxBuffer: 64 * 1024 * 1024, env: { ...process.env, TRIVY_CACHE_DIR: cacheDir } }
  );
  let parsed;
  try {
    parsed = JSON.parse(r.stdout);
  } catch {
    return { version, error: "trivy JSON nicht parsebar", raw: r.stdout?.slice(0, 500), stderr: r.stderr?.slice(0, 500) };
  }
  const sevCounts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  const findings = [];
  let secrets = 0;
  for (const res of parsed.Results || []) {
    for (const v of res.Vulnerabilities || []) {
      sevCounts[v.Severity] = (sevCounts[v.Severity] || 0) + 1;
      findings.push({
        id: v.VulnerabilityID,
        severity: v.Severity,
        pkg: `${v.PkgName}@${v.InstalledVersion}`,
        fixed_version: v.FixedVersion || null,
        target: res.Target,
        title: v.Title || null,
      });
    }
    for (const s of res.Secrets || []) {
      secrets++;
      findings.push({
        id: s.RuleID,
        severity: s.Severity,
        kind: "secret",
        target: `${res.Target}:${s.StartLine}`,
      });
    }
  }
  return {
    version,
    severity_counts: {
      critical: sevCounts.CRITICAL,
      high: sevCounts.HIGH,
      medium: sevCounts.MEDIUM,
      low: sevCounts.LOW,
      total: sevCounts.CRITICAL + sevCounts.HIGH + sevCounts.MEDIUM + sevCounts.LOW,
    },
    secrets,
    findings,
  };
}

// --- main ------------------------------------------------------------------

function pad(s, n) { return String(s).padEnd(n); }
function padR(s, n) { return String(s).padStart(n); }

async function main() {
  const wantJson = process.argv.includes("--json");

  const auditRoot = npmAudit(ROOT);
  const auditWebsite = npmAudit(WEBSITE);

  const trivyBin = resolveTrivy();
  const trivy = trivyBin ? trivyScan(trivyBin) : { skipped: true, reason: "trivy nicht gefunden ($TRIVY_BIN oder PATH)" };

  const npmTotal =
    (auditRoot.severity_counts?.total || 0) + (auditWebsite.severity_counts?.total || 0);
  const trivyTotal = trivy.severity_counts?.total || 0;
  const trivySecrets = trivy.secrets || 0;

  const meta = {
    schema: "firma-bench/security-audit/1",
    methodology: {
      tools: [
        "npm audit (GitHub Advisory Database)",
        trivyBin ? `Trivy ${trivy.version} (Aqua Security, Apache 2.0)` : "Trivy (nicht verfügbar — skipped)",
      ],
      standard: "OWASP Top 10 A06:2021 (Vulnerable & Outdated Components) + CVE / GHSA / OSV",
      scope: "npm audit: root + website (prod + dev deps) · Trivy: fs-Scan über Repo, node_modules/.next ausgenommen",
      caveat:
        "Dependency-Scanning erfasst bekannte CVEs in deklarierten Paketen. Es ersetzt KEINEN Code-Audit, Pen-Test oder SAST. 0 Findings = kein bekanntes CVE, nicht 'sicher'.",
    },
    timestamp: new Date().toISOString(),
    node_version: process.version,
    npm_version: spawnSync("npm", ["--version"], { encoding: "utf-8" }).stdout.trim(),
    repo: {
      root: ROOT,
      branch: git(["rev-parse", "--abbrev-ref", "HEAD"]),
      commit: git(["rev-parse", "HEAD"]),
    },
    npm_audit: {
      root: auditRoot,
      website: auditWebsite,
    },
    trivy,
    totals: {
      npm_audit_vulnerabilities: npmTotal,
      trivy_vulnerabilities: trivyBin ? trivyTotal : null,
      trivy_secrets: trivyBin ? trivySecrets : null,
      clean: npmTotal === 0 && (!trivyBin || (trivyTotal === 0 && trivySecrets === 0)),
    },
  };

  const outDir = path.join(ROOT, "docs", "benchmarks");
  await fs.mkdir(outDir, { recursive: true });
  const date = meta.timestamp.slice(0, 10);
  const outFile = path.join(outDir, `security-audit-${date}.json`);
  await fs.writeFile(outFile, JSON.stringify(meta, null, 2) + "\n");

  if (wantJson) {
    process.stdout.write(JSON.stringify(meta, null, 2) + "\n");
    return;
  }

  console.log(`# Benchmark · Security-Audit  (${meta.timestamp})`);
  console.log("");
  console.log(`- standard: ${meta.methodology.standard}`);
  console.log(`- branch:   ${meta.repo.branch} @ ${meta.repo.commit.slice(0, 7)}`);
  console.log(`- npm:      v${meta.npm_version} · node ${meta.node_version}`);
  console.log("");
  console.log("npm audit (GitHub Advisory Database):");
  console.log("| Scope    | Crit | High | Mod | Low | Total |");
  console.log("|----------|-----:|-----:|----:|----:|------:|");
  for (const [scope, a] of [["root", auditRoot], ["website", auditWebsite]]) {
    const c = a.severity_counts || {};
    console.log(
      `| ${pad(scope, 8)} | ${padR(c.critical ?? "?", 4)} | ${padR(c.high ?? "?", 4)} | ${padR(c.moderate ?? "?", 3)} | ${padR(c.low ?? "?", 3)} | ${padR(c.total ?? "?", 5)} |`
    );
  }
  console.log("");
  if (trivyBin) {
    const c = trivy.severity_counts || {};
    console.log(`Trivy ${trivy.version} (fs-Scan, vuln + secret, incl. dev-deps):`);
    console.log("| Crit | High | Med | Low | Total | Secrets |");
    console.log("|-----:|-----:|----:|----:|------:|--------:|");
    console.log(
      `| ${padR(c.critical, 4)} | ${padR(c.high, 4)} | ${padR(c.medium, 3)} | ${padR(c.low, 3)} | ${padR(c.total, 5)} | ${padR(trivy.secrets, 7)} |`
    );
  } else {
    console.log(`Trivy: SKIP — ${trivy.reason}`);
    console.log("  Install: https://trivy.dev/latest/getting-started/installation/");
    console.log("  Dann: TRIVY_BIN=/pfad/zu/trivy npm run bench:security");
  }
  console.log("");
  const allFindings = [
    ...(auditRoot.advisories || []).map((a) => `npm/root: [${a.severity}] ${a.name}`),
    ...(auditWebsite.advisories || []).map((a) => `npm/website: [${a.severity}] ${a.name}`),
    ...(trivy.findings || []).map((f) => `trivy: [${f.severity}] ${f.id} ${f.pkg || f.target}`),
  ];
  if (allFindings.length > 0) {
    console.log("Findings:");
    allFindings.forEach((f) => console.log("  -", f));
  } else {
    console.log("✓ Keine bekannten CVEs / Secrets in den gescannten Dependencies.");
  }
  console.log("");
  console.log(meta.methodology.caveat);
  console.log("");
  console.log(`Snapshot: ${path.relative(ROOT, outFile)}`);

  // Exit-Code: nicht-null bei Critical/High, damit CI scharf schalten kann.
  const blocking =
    (auditRoot.severity_counts?.critical || 0) +
    (auditRoot.severity_counts?.high || 0) +
    (auditWebsite.severity_counts?.critical || 0) +
    (auditWebsite.severity_counts?.high || 0) +
    (trivy.severity_counts?.critical || 0) +
    (trivy.severity_counts?.high || 0);
  if (blocking > 0) {
    console.error(`\n✗ ${blocking} Critical/High Findings — Exit 1.`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("bench error:", e?.stack || e);
  process.exit(1);
});

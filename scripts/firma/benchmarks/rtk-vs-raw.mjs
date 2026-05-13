// Firma OS · Benchmark · rtk vs raw command output
//
// Methodik (A/B, reproduzierbar):
//   Tokenizer:   tiktoken cl100k_base (OpenAI GPT-4 standard, MIT-lizenziert).
//   Workload:    fixe Command-Liste (siehe COMMANDS unten), je 3 warmup + 5 measured runs.
//   Metriken:    Tokens (sum/per-cmd), Bytes (sum/per-cmd), Wall-Clock (p50/p99),
//                Token-Reduktion in % (1 - rtk/raw), Bytes-Reduktion in %.
//   Vergleich:   raw (control) vs rtk (treatment). Identische Kommandos, identische cwd.
//
// Run:  node scripts/firma/benchmarks/rtk-vs-raw.mjs
//       node scripts/firma/benchmarks/rtk-vs-raw.mjs --json   (machine-readable)
//
// Output:
//   stdout:                    Markdown-Tabelle
//   .firma/benchmarks/<ts>/    rtk-vs-raw.json + raw/<cmd>.txt + rtk/<cmd>.txt

import { promises as fs } from "node:fs";
import path from "node:path";
import url from "node:url";
import { spawnSync } from "node:child_process";
import { get_encoding } from "tiktoken";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..", "..");
const RTK_BIN = path.join(ROOT, "tools", "rtk", "target", "release", "rtk");

const WARMUP = 3;
const RUNS = 5;

// Reale, alltägliche Commands aus einem typischen Firma-OS-Workflow.
// Bewusst keine Toy-Daten: das sind Aufrufe, die der Agent tatsächlich macht.
const COMMANDS = [
  { name: "git_status",    argv: ["git", "status"] },
  { name: "git_log_20",    argv: ["git", "log", "-20", "--oneline"] },
  { name: "git_diff_head", argv: ["git", "diff", "HEAD~3..HEAD", "--stat"] },
  { name: "ls_repo",       argv: ["ls", "-la"] },
  { name: "ls_firma",      argv: ["ls", "-la", ".firma"] },
  { name: "tree_docs",     argv: ["bash", "-lc", "find docs -maxdepth 2 -type f | sort"] },
  { name: "grep_todos",    argv: ["bash", "-lc", "grep -rn 'TODO\\|FIXME' scripts docs 2>/dev/null || true"] },
  { name: "cat_state",     argv: ["cat", ".firma/state.json"] },
  { name: "wc_repo_md",    argv: ["bash", "-lc", "find . -name '*.md' -not -path './node_modules/*' -not -path './tools/*' -not -path './.git/*' | xargs wc -l 2>/dev/null"] },
  { name: "find_mjs",      argv: ["bash", "-lc", "find scripts -name '*.mjs' | sort"] },
];

function pad(s, n) { return String(s).padEnd(n); }
function padR(s, n) { return String(s).padStart(n); }
function pct(a, b) { return b === 0 ? 0 : (1 - a / b) * 100; }

function runOnce(argv, useRtk) {
  const cmd = useRtk ? RTK_BIN : argv[0];
  const args = useRtk ? argv : argv.slice(1);
  const t0 = process.hrtime.bigint();
  const res = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf-8", maxBuffer: 64 * 1024 * 1024 });
  const t1 = process.hrtime.bigint();
  return {
    out: (res.stdout || "") + (res.stderr || ""),
    ms: Number(t1 - t0) / 1e6,
    code: res.status ?? -1,
  };
}

function percentile(xs, p) {
  if (xs.length === 0) return 0;
  const sorted = [...xs].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor(p * sorted.length));
  return sorted[idx];
}

async function main() {
  const wantJson = process.argv.includes("--json");
  const enc = get_encoding("cl100k_base");

  // verify rtk is built
  try {
    await fs.access(RTK_BIN);
  } catch {
    console.error(`Fehler: rtk-Binary nicht gefunden: ${RTK_BIN}`);
    console.error("Bitte zuerst: (cd tools/rtk && cargo build --release)");
    process.exit(2);
  }

  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = path.join(ROOT, ".firma", "benchmarks", ts);
  await fs.mkdir(path.join(outDir, "raw"), { recursive: true });
  await fs.mkdir(path.join(outDir, "rtk"), { recursive: true });

  const results = [];

  for (const c of COMMANDS) {
    // Warmup beide Modi (Cache, Page-Cache angleichen)
    for (let i = 0; i < WARMUP; i++) { runOnce(c.argv, false); runOnce(c.argv, true); }

    const rawTimes = [];
    const rtkTimes = [];
    let rawOut = ""; let rtkOut = "";

    for (let i = 0; i < RUNS; i++) {
      const r = runOnce(c.argv, false);
      rawTimes.push(r.ms);
      if (i === 0) rawOut = r.out;
    }
    for (let i = 0; i < RUNS; i++) {
      const r = runOnce(c.argv, true);
      rtkTimes.push(r.ms);
      if (i === 0) rtkOut = r.out;
    }

    await fs.writeFile(path.join(outDir, "raw", c.name + ".txt"), rawOut);
    await fs.writeFile(path.join(outDir, "rtk", c.name + ".txt"), rtkOut);

    const rawTokens = enc.encode(rawOut).length;
    const rtkTokens = enc.encode(rtkOut).length;
    const rawBytes = Buffer.byteLength(rawOut);
    const rtkBytes = Buffer.byteLength(rtkOut);

    results.push({
      name: c.name,
      argv: c.argv,
      raw: {
        tokens: rawTokens,
        bytes: rawBytes,
        ms_p50: percentile(rawTimes, 0.5),
        ms_p99: percentile(rawTimes, 0.99),
      },
      rtk: {
        tokens: rtkTokens,
        bytes: rtkBytes,
        ms_p50: percentile(rtkTimes, 0.5),
        ms_p99: percentile(rtkTimes, 0.99),
      },
      reduction: {
        tokens_pct: pct(rtkTokens, rawTokens),
        bytes_pct: pct(rtkBytes, rawBytes),
      },
    });
  }

  enc.free();

  const totalRaw = results.reduce((a, r) => a + r.raw.tokens, 0);
  const totalRtk = results.reduce((a, r) => a + r.rtk.tokens, 0);
  const overall = pct(totalRtk, totalRaw);

  const meta = {
    schema: "firma-bench/rtk-vs-raw/1",
    methodology: {
      tokenizer: "tiktoken cl100k_base (GPT-4)",
      workload: "fixe Command-Liste, 3 warmup + 5 measured runs pro Command",
      mode: "A/B (raw control vs rtk treatment), identische cwd + env",
    },
    timestamp: new Date().toISOString(),
    rtk_version: spawnSync(RTK_BIN, ["--version"], { encoding: "utf-8" }).stdout.trim(),
    node_version: process.version,
    repo: { root: ROOT, branch: spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd: ROOT, encoding: "utf-8" }).stdout.trim(), commit: spawnSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf-8" }).stdout.trim() },
    commands: results,
    totals: { raw_tokens: totalRaw, rtk_tokens: totalRtk, reduction_pct: overall },
  };
  await fs.writeFile(path.join(outDir, "rtk-vs-raw.json"), JSON.stringify(meta, null, 2) + "\n");

  if (wantJson) {
    process.stdout.write(JSON.stringify(meta, null, 2) + "\n");
    return;
  }

  // Human-readable Markdown
  console.log(`# Benchmark · rtk vs raw  (${meta.timestamp})`);
  console.log("");
  console.log(`- tokenizer: ${meta.methodology.tokenizer}`);
  console.log(`- runs: ${RUNS} measured + ${WARMUP} warmup per command`);
  console.log(`- rtk: ${meta.rtk_version}`);
  console.log(`- node: ${meta.node_version}`);
  console.log(`- branch: ${meta.repo.branch} @ ${meta.repo.commit.slice(0, 7)}`);
  console.log("");
  console.log("| Command | raw tok | rtk tok | Δ tok | raw KB | rtk KB | raw p50 ms | rtk p50 ms |");
  console.log("|---------|--------:|--------:|------:|-------:|-------:|-----------:|-----------:|");
  for (const r of results) {
    console.log(
      `| ${pad(r.name, 14)} ` +
      `| ${padR(r.raw.tokens, 7)} ` +
      `| ${padR(r.rtk.tokens, 7)} ` +
      `| ${padR(r.reduction.tokens_pct.toFixed(1) + "%", 6)} ` +
      `| ${padR((r.raw.bytes / 1024).toFixed(1), 6)} ` +
      `| ${padR((r.rtk.bytes / 1024).toFixed(1), 6)} ` +
      `| ${padR(r.raw.ms_p50.toFixed(1), 10)} ` +
      `| ${padR(r.rtk.ms_p50.toFixed(1), 10)} |`,
    );
  }
  console.log("");
  console.log(`**Total tokens:** raw=${totalRaw} · rtk=${totalRtk} · **reduction=${overall.toFixed(1)}%**`);
  console.log("");
  console.log(`Outputs gespeichert: ${path.relative(ROOT, outDir)}/`);
}

main().catch((e) => { console.error("bench error:", e); process.exit(1); });

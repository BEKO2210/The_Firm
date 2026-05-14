// Firma OS · Benchmark · ICM (Layered) vs Monolithic Loading
//
// Frage: Wie viele Tokens lädt ein Agent pro Stage, wenn er der ICM-Konvention
//        folgt — vs. wie viele Tokens würde ein monolithischer Prompt enthalten,
//        der ALLES auf einmal lädt?
//
// Methodik (anerkannte Standards, siehe docs/BENCHMARKS.md):
//   Tokenizer:   tiktoken cl100k_base (OpenAI GPT-4)
//   Workload:    .firma/icm/triage Workspace (3 Stages, real-strukturierte Files)
//   Vergleich:   pro-Stage Loading-Profil vs Monolithic-Worst-Case
//
// WICHTIGER DISCLAIMER (Output-Qualität):
//   Wir messen hier NICHT, ob die Antworten besser/schlechter werden.
//   Wir messen nur die deterministisch zählbare Token-Last — exakt das, was
//   ICM zu reduzieren verspricht (Layered Context Loading).
//   Qualitäts-Benchmark braucht echte LLM-Calls + Bewertungs-Schema und ist
//   bewusst nicht Teil dieses Benchmarks.
//
// Run:
//   npm run bench:icm
//   node scripts/firma/benchmarks/icm-vs-monolithic.mjs --json

import path from "node:path";
import url from "node:url";
import { promises as fs } from "node:fs";
import { spawnSync } from "node:child_process";
import { get_encoding } from "tiktoken";
import { readWorkspace, loadingProfile, monolithicProfile, tokensForProfile } from "../lib/icm.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..", "..");

function fmt(n) { return n.toLocaleString("de-DE"); }
function pct(a, b) { return b === 0 ? 0 : (1 - a / b) * 100; }
function pad(s, n) { return String(s).padEnd(n); }
function padR(s, n) { return String(s).padStart(n); }

async function main() {
  const wantJson = process.argv.includes("--json");
  const enc = get_encoding("cl100k_base");

  const workspaceDir = path.join(ROOT, ".firma", "icm", "triage");
  const workspace = await readWorkspace(workspaceDir);
  if (workspace.stages.length === 0) {
    console.error(`Kein Workspace gefunden unter ${workspaceDir}`);
    process.exit(2);
  }

  // Loading-Profile pro Stage
  const perStage = [];
  let sumLayered = 0;
  for (let i = 0; i < workspace.stages.length; i++) {
    const prof = loadingProfile(workspace, i);
    const t = await tokensForProfile(prof, enc);
    perStage.push(t);
    sumLayered += t.tokens;
  }

  // Monolithic-Profil
  const mono = await tokensForProfile(monolithicProfile(workspace), enc);

  enc.free();

  const meta = {
    schema: "firma-bench/icm-vs-monolithic/1",
    methodology: {
      tokenizer: "tiktoken cl100k_base (GPT-4)",
      workload: ".firma/icm/triage workspace (3 stages, real structure)",
      mode: "Sum of per-stage layered loading vs single monolithic load",
      caveat: "Misst nur Token-Last, NICHT Output-Qualität. Qualitätsbenchmark braucht echte LLM-Calls.",
    },
    timestamp: new Date().toISOString(),
    node_version: process.version,
    repo: {
      root: ROOT,
      branch: spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd: ROOT, encoding: "utf-8" }).stdout.trim(),
      commit: spawnSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf-8" }).stdout.trim(),
    },
    workspace: { dir: path.relative(ROOT, workspaceDir), stages: workspace.stages.length },
    per_stage: perStage.map((s) => ({
      stage: s.stage,
      files: s.files,
      tokens: s.tokens,
      bytes: s.bytes,
    })),
    monolithic: { stage: mono.stage, files: mono.files, tokens: mono.tokens, bytes: mono.bytes },
    totals: {
      layered_sum: sumLayered,
      monolithic: mono.tokens,
      sum_vs_mono_pct: pct(sumLayered, mono.tokens),
      peak_stage_vs_mono_pct: pct(Math.max(...perStage.map((s) => s.tokens)), mono.tokens),
    },
  };

  await fs.mkdir(path.join(ROOT, ".firma", "benchmarks"), { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outFile = path.join(ROOT, ".firma", "benchmarks", `icm-vs-monolithic-${stamp}.json`);
  await fs.writeFile(outFile, JSON.stringify(meta, null, 2) + "\n");

  if (wantJson) {
    process.stdout.write(JSON.stringify(meta, null, 2) + "\n");
    return;
  }

  console.log(`# Benchmark · ICM (Layered) vs Monolithic Loading  (${meta.timestamp})`);
  console.log("");
  console.log(`- workspace: ${meta.workspace.dir}`);
  console.log(`- tokenizer: ${meta.methodology.tokenizer}`);
  console.log(`- branch: ${meta.repo.branch} @ ${meta.repo.commit.slice(0, 7)}`);
  console.log("");
  console.log("| Stage              | Files | Tokens | KB    |");
  console.log("|--------------------|------:|-------:|------:|");
  for (const s of perStage) {
    console.log(`| ${pad(s.stage, 18)} | ${padR(s.files, 5)} | ${padR(fmt(s.tokens), 6)} | ${padR((s.bytes / 1024).toFixed(1), 5)} |`);
  }
  console.log(`| ${pad("Σ layered (sum)", 18)} | ${padR("—", 5)} | ${padR(fmt(sumLayered), 6)} | ${padR("—", 5)} |`);
  console.log(`| ${pad("MONOLITHIC", 18)} | ${padR(mono.files, 5)} | ${padR(fmt(mono.tokens), 6)} | ${padR((mono.bytes / 1024).toFixed(1), 5)} |`);
  console.log("");
  console.log(`**Peak Stage vs Monolithic:** ${meta.totals.peak_stage_vs_mono_pct.toFixed(1)} % weniger Tokens pro Call`);
  console.log(`**Σ Layered vs Monolithic:**  ${meta.totals.sum_vs_mono_pct.toFixed(1)} % (kann positiv ODER negativ sein — Pipeline lädt manche Files mehrfach)`);
  console.log("");
  console.log("Disclaimer:");
  console.log("  - Misst nur Token-Last, NICHT Output-Qualität.");
  console.log("  - Qualität braucht echte LLM-Calls + Bewertungs-Schema.");
  console.log("");
  console.log(`Snapshot: ${path.relative(ROOT, outFile)}`);
}

main().catch((e) => { console.error("bench error:", e); process.exit(1); });

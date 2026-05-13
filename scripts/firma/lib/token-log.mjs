// Firma OS · Token-Log
//
// Append-only JSONL log of token usage per CLI/agent run.
// Stored in .firma/tokens/runs.jsonl. One line per run.

import { promises as fs } from "node:fs";
import path from "node:path";

export async function logRun({ root, command, tokens_in = 0, tokens_out = 0, cache_hits = 0, cache_misses = 0, started_at, ended_at, meta = {} }) {
  if (!root) throw new Error("token-log: root path required");
  if (!command) throw new Error("token-log: command required");
  const dir = path.join(root, ".firma", "tokens");
  await fs.mkdir(dir, { recursive: true });
  const entry = {
    ts: new Date().toISOString(),
    command,
    tokens_in,
    tokens_out,
    tokens_total: tokens_in + tokens_out,
    cache_hits,
    cache_misses,
    started_at: started_at || null,
    ended_at: ended_at || null,
    meta,
  };
  await fs.appendFile(path.join(dir, "runs.jsonl"), JSON.stringify(entry) + "\n");
  return entry;
}

export async function readRuns({ root, sinceDays = null } = {}) {
  if (!root) throw new Error("token-log: root path required");
  const p = path.join(root, ".firma", "tokens", "runs.jsonl");
  let raw;
  try {
    raw = await fs.readFile(p, "utf-8");
  } catch {
    return [];
  }
  const runs = raw
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try { return JSON.parse(line); } catch { return null; }
    })
    .filter(Boolean);
  if (sinceDays == null) return runs;
  const cutoff = Date.now() - sinceDays * 24 * 60 * 60 * 1000;
  return runs.filter((r) => new Date(r.ts).getTime() >= cutoff);
}

export function summarize(runs) {
  const total = runs.reduce((acc, r) => acc + (r.tokens_total || 0), 0);
  const hits = runs.reduce((acc, r) => acc + (r.cache_hits || 0), 0);
  const misses = runs.reduce((acc, r) => acc + (r.cache_misses || 0), 0);
  const byCommand = new Map();
  for (const r of runs) {
    const cur = byCommand.get(r.command) || { command: r.command, runs: 0, tokens: 0 };
    cur.runs += 1;
    cur.tokens += r.tokens_total || 0;
    byCommand.set(r.command, cur);
  }
  const top = [...byCommand.values()].sort((a, b) => b.tokens - a.tokens);
  const hitRate = hits + misses > 0 ? hits / (hits + misses) : null;
  return { total_runs: runs.length, total_tokens: total, cache_hits: hits, cache_misses: misses, cache_hit_rate: hitRate, by_command: top };
}

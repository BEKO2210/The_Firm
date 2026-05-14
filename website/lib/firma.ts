// Server-side helpers · liest .firma/ direkt vom Filesystem.
// Wird nur in Server Components verwendet (kein "use client").

import { promises as fs } from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(process.cwd(), "..");
const FIRMA_DIR = path.join(REPO_ROOT, ".firma");

export type FirmaState = {
  schema_version: number;
  firm: { name: string | null; principal: string | null; since_real: string | null };
  real: {
    bank_account: unknown;
    stripe_account: unknown;
    monthly_revenue_eur: number;
    monthly_costs_eur: { tools_subscriptions: number; hosting: number; other: number };
    customers: unknown[];
    active_engagements: unknown[];
    outstanding_invoices: unknown[];
  };
  sim: {
    _warning: string;
    forecast_revenue_eur_month_3: number;
    forecast_costs_eur_month_3: number;
    planning_scenarios: string[];
  };
  tokens: { budget_per_run_default: number; budget_per_run_hard_cap: number; spend_today: number; spend_this_week: number; warnings: string[] };
  approvals: { pending: number; decided_today: number };
  tickets: { open: number; in_progress: number; blocked: number };
  inbox: { unread: number; awaiting_action: number };
  agents: { active: number; last_run_real: string | null };
  audit: { chain_entries: number; chain_intact: boolean };
  generated_at_real?: string;
};

export async function readState(): Promise<FirmaState | null> {
  try {
    const raw = await fs.readFile(path.join(FIRMA_DIR, "state.json"), "utf-8");
    return JSON.parse(raw) as FirmaState;
  } catch {
    return null;
  }
}

export async function listFiles(rel: string, ext?: string): Promise<string[]> {
  try {
    const dir = path.join(FIRMA_DIR, rel);
    const files = await fs.readdir(dir);
    return ext ? files.filter((f) => f.endsWith(ext)).sort() : files.sort();
  } catch {
    return [];
  }
}

export type TokenRun = {
  ts: string;
  command: string;
  tokens_in?: number;
  tokens_out?: number;
  tokens_total?: number;
  cache_hits?: number;
  cache_misses?: number;
};

export async function readTokenRuns(): Promise<TokenRun[]> {
  try {
    const raw = await fs.readFile(path.join(FIRMA_DIR, "tokens", "runs.jsonl"), "utf-8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        try { return JSON.parse(line) as TokenRun; } catch { return null; }
      })
      .filter((x): x is TokenRun => x !== null);
  } catch {
    return [];
  }
}

export function summarizeRuns(runs: TokenRun[]) {
  const total = runs.reduce((a, r) => a + (r.tokens_total ?? 0), 0);
  const hits = runs.reduce((a, r) => a + (r.cache_hits ?? 0), 0);
  const misses = runs.reduce((a, r) => a + (r.cache_misses ?? 0), 0);
  const byCmd = new Map<string, { command: string; runs: number; tokens: number }>();
  for (const r of runs) {
    const cur = byCmd.get(r.command) ?? { command: r.command, runs: 0, tokens: 0 };
    cur.runs += 1;
    cur.tokens += r.tokens_total ?? 0;
    byCmd.set(r.command, cur);
  }
  const top = [...byCmd.values()].sort((a, b) => b.tokens - a.tokens);
  const hitRate = hits + misses > 0 ? hits / (hits + misses) : null;
  return { total_runs: runs.length, total_tokens: total, cache_hits: hits, cache_misses: misses, hit_rate: hitRate, by_command: top };
}

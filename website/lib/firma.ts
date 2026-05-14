// Server-side helpers · liest .firma/ direkt vom Filesystem.
// Wird nur in Server Components verwendet (kein "use client").

import { promises as fs } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";

const REPO_ROOT = path.resolve(process.cwd(), "..");
const FIRMA_DIR = path.join(REPO_ROOT, ".firma");
const TOOLS_DIR = path.join(REPO_ROOT, "tools");
const DOCS_DIR = path.join(REPO_ROOT, "docs");
export const REPO_ROOT_EXPORT = REPO_ROOT;

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

// ─── Tool-Detection für /tools ──────────────────────────────────

export type ToolStatus = {
  name: string;
  role: string;
  binary: string | null;     // absoluter Pfad falls verfügbar
  installed: boolean;
  version: string | null;
  install_cmd: string;
  license: string;
  docs: string;              // relativer doc-Path
};

async function tryVersion(bin: string, args: string[] = ["--version"], timeoutMs = 1500): Promise<string | null> {
  return new Promise((resolve) => {
    let out = "";
    const c = spawn(bin, args);
    const timer = setTimeout(() => { c.kill(); resolve(null); }, timeoutMs);
    c.stdout.on("data", (b) => { out += b.toString(); });
    c.stderr.on("data", (b) => { out += b.toString(); });
    c.on("close", (code) => {
      clearTimeout(timer);
      resolve(code === 0 && out.trim() ? out.trim().split("\n")[0] : null);
    });
    c.on("error", () => { clearTimeout(timer); resolve(null); });
  });
}

async function exists(p: string) {
  try { await fs.access(p); return true; } catch { return false; }
}

export async function getToolStatuses(): Promise<ToolStatus[]> {
  const rtkBin = path.join(TOOLS_DIR, "rtk", "target", "release", "rtk");
  const typstBin = path.join(TOOLS_DIR, "typst", "bin", "typst");
  const icmDir = path.join(FIRMA_DIR, "icm");

  const rtkAvail = await exists(rtkBin);
  const typstAvail = await exists(typstBin);
  const icmWorkspaces = await fs.readdir(icmDir).then((xs) => xs.filter((x) => !x.startsWith("."))).catch(() => []);

  return [
    {
      name: "rtk-ai",
      role: "Command-Output-Filter (token reduction)",
      binary: rtkAvail ? rtkBin : null,
      installed: rtkAvail,
      version: rtkAvail ? await tryVersion(rtkBin) : null,
      install_cmd: "bash scripts/firma/setup/install-rtk.sh",
      license: "MIT",
      docs: "docs/BENCHMARKS.md",
    },
    {
      name: "Typst",
      role: "PDF generation from templates",
      binary: typstAvail ? typstBin : null,
      installed: typstAvail,
      version: typstAvail ? await tryVersion(typstBin) : null,
      install_cmd: "bash scripts/firma/setup/install-typst.sh",
      license: "Apache 2.0",
      docs: "docs/PDF_RENDERING.md",
    },
    {
      name: "ICM",
      role: "Layered folder pattern for multi-stage workflows",
      binary: null,
      installed: icmWorkspaces.length > 0,
      version: `${icmWorkspaces.length} workspace${icmWorkspaces.length === 1 ? "" : "s"}`,
      install_cmd: "(folder pattern, no installer)",
      license: "—",
      docs: "docs/BENCHMARKS.md",
    },
    {
      name: "token-cache",
      role: "SHA-256 fingerprint cache for repeated state reminders",
      binary: null,
      installed: true,
      version: "local mode (built-in)",
      install_cmd: "(built-in)",
      license: "—",
      docs: "docs/TOKEN_CACHE.md",
    },
  ];
}

// ─── Reports/Quotes/Benchmarks ─────────────────────────────────────

export type QuoteInfo = {
  id: string;
  pdf_relpath: string | null;
  pdf_size: number | null;
  data_relpath: string | null;
  subject: string | null;
  customer: string | null;
  total: string | null;
  created_at: string | null;
};

export async function listQuotes(): Promise<QuoteInfo[]> {
  const quotesDir = path.join(FIRMA_DIR, "finance", "quotes");
  let dirs: string[] = [];
  try { dirs = await fs.readdir(quotesDir); } catch { return []; }
  const out: QuoteInfo[] = [];
  for (const id of dirs.sort().reverse()) {
    const idDir = path.join(quotesDir, id);
    const stat = await fs.stat(idDir).catch(() => null);
    if (!stat?.isDirectory()) continue;
    const pdfPath = path.join(idDir, `${id}.pdf`);
    const dataPath = path.join(idDir, "data.json");
    const pdfStat = await fs.stat(pdfPath).catch(() => null);
    let subject: string | null = null;
    let customer: string | null = null;
    let total: string | null = null;
    let createdAt: string | null = null;
    try {
      const raw = await fs.readFile(dataPath, "utf-8");
      const data = JSON.parse(raw);
      subject = data.quote?.subject ?? null;
      customer = data.customer?.name ?? null;
      const currency = data.quote?.currency ?? "EUR";
      total = data.totals?.total ? `${data.totals.total} ${currency}` : null;
      createdAt = data.quote?.date ?? null;
    } catch { /* no data.json */ }
    out.push({
      id,
      pdf_relpath: pdfStat ? path.relative(REPO_ROOT, pdfPath) : null,
      pdf_size: pdfStat?.size ?? null,
      data_relpath: path.relative(REPO_ROOT, dataPath),
      subject, customer, total, created_at: createdAt,
    });
  }
  return out;
}

export type BenchmarkSnapshot = {
  filename: string;
  path: string;
  schema: string | null;
  timestamp: string | null;
  totals: unknown;
};

export async function listBenchmarks(): Promise<BenchmarkSnapshot[]> {
  const dir = path.join(DOCS_DIR, "benchmarks");
  let files: string[] = [];
  try { files = await fs.readdir(dir); } catch { return []; }
  files = files.filter((f) => f.endsWith(".json")).sort();
  const out: BenchmarkSnapshot[] = [];
  for (const f of files) {
    const p = path.join(dir, f);
    try {
      const raw = await fs.readFile(p, "utf-8");
      const data = JSON.parse(raw);
      out.push({
        filename: f,
        path: path.relative(REPO_ROOT, p),
        schema: data.schema ?? null,
        timestamp: data.timestamp ?? null,
        totals: data.totals ?? null,
      });
    } catch { /* skip */ }
  }
  return out;
}

// ─── Audit-Log (hash-chained Event-Quelle, Iteration B.1) ──────────

export type AuditEvent = {
  seq: number;
  ts: string;
  event: string;
  actor: string;
  summary: string;
  data?: Record<string, unknown>;
  prev_hash?: string;
  hash?: string;
};

export async function readAuditChain(): Promise<AuditEvent[]> {
  try {
    const raw = await fs.readFile(path.join(FIRMA_DIR, "audit.log"), "utf-8");
    return raw
      .split("\n")
      .filter((l) => l.trim().length > 0)
      .map((line) => {
        try { return JSON.parse(line) as AuditEvent; } catch { return null; }
      })
      .filter((x): x is AuditEvent => x !== null && typeof x.seq === "number");
  } catch {
    return [];
  }
}

// ─── Mission Control · Aggregat für die Home-Seite (Iteration B.2) ──

export type KpiStatus = "ok" | "warn" | "danger" | "neutral";

export type Kpi = {
  label: string;
  value: string;
  delta: string | null;      // null = keine Vergleichsdaten (ehrlich, kein Fake-Δ)
  timeframe: string | null;
  status: KpiStatus;
  link: string | null;
};

export type NextItem = {
  kind: "approval" | "inbox" | "plan";
  label: string;
  detail: string | null;
  urgent: boolean;
  link: string | null;
};

export type DoneItem = {
  label: string;
  detail: string | null;
  ts: string | null;
};

export type MissionControl = {
  kpis: Kpi[];
  jetzt: AuditEvent[];        // jüngste Events, neueste zuerst
  naechstes: NextItem[];
  letztes: DoneItem[];
};

// Parst deutsche Zahlenformate wie "2.225,30" → 2225.3. Gibt null bei Unparsbarem.
function parseDeNumber(s: string | null | undefined): number | null {
  if (!s) return null;
  const cleaned = s.replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function fmtEur(n: number): string {
  return n.toLocaleString("de-DE");
}

export async function getMissionControl(): Promise<MissionControl | null> {
  const state = await readState();
  if (!state) return null;

  const [chain, quotes, pendingApprovals, decidedApprovals, inboxFiles, planFiles] = await Promise.all([
    readAuditChain(),
    listQuotes(),
    listFiles("approvals/pending", ".yaml"),
    listFiles("approvals/decided", ".yaml"),
    listFiles("inbox"),
    listFiles("plan"),
  ]);

  // ── Zone 1 · die 5 North-Star-KPIs ──────────────────────────────
  const openQuotesSum = quotes.reduce((acc, q) => acc + (parseDeNumber(q.total) ?? 0), 0);
  const ticketsOffen = state.tickets.open + state.tickets.in_progress;
  const tokenPct = state.tokens.budget_per_run_default > 0
    ? state.tokens.spend_today / state.tokens.budget_per_run_default
    : 0;

  const kpis: Kpi[] = [
    {
      label: "Kontostand real",
      value: state.real.bank_account ? `${fmtEur(state.real.monthly_revenue_eur)} EUR` : "nicht angebunden",
      delta: null,
      timeframe: null,
      status: state.real.bank_account ? "ok" : "neutral",
      link: null,
    },
    {
      label: "Offene Angebote",
      value: quotes.length > 0 ? `${fmtEur(openQuotesSum)} EUR` : "0 EUR",
      delta: quotes.length > 0 ? `${quotes.length} Stk` : null,
      timeframe: null,
      status: quotes.length > 0 ? "ok" : "neutral",
      link: "/reports",
    },
    {
      label: "Tickets offen",
      value: String(ticketsOffen),
      delta: state.tickets.blocked > 0 ? `${state.tickets.blocked} blockiert` : null,
      timeframe: null,
      status: state.tickets.blocked > 0 ? "warn" : "neutral",
      link: null,
    },
    {
      label: "Approvals wartend",
      value: String(pendingApprovals.length),
      delta: pendingApprovals.length > 0 ? "Aktion nötig" : null,
      timeframe: null,
      status: pendingApprovals.length > 0 ? "danger" : "ok",
      link: "/approvals",
    },
    {
      label: "Token-Budget heute",
      value: `${(tokenPct * 100).toFixed(0)} %`,
      delta: `${fmtEur(state.tokens.spend_today)} / ${fmtEur(state.tokens.budget_per_run_default)}`,
      timeframe: "heute",
      status: tokenPct >= 1 ? "danger" : tokenPct >= 0.8 ? "warn" : "ok",
      link: "/tokens",
    },
  ];

  // ── Zone 2a · JETZT — jüngste Audit-Events ──────────────────────
  const jetzt = [...chain].reverse().slice(0, 6);

  // ── Zone 2b · NÄCHSTES — was Aufmerksamkeit braucht ─────────────
  const naechstes: NextItem[] = [
    ...pendingApprovals.map((f): NextItem => ({
      kind: "approval",
      label: f.replace(/\.yaml$/, ""),
      detail: "wartet auf Freigabe",
      urgent: true,
      link: "/approvals",
    })),
    ...inboxFiles.filter((f) => !f.startsWith(".")).map((f): NextItem => ({
      kind: "inbox",
      label: f,
      detail: "untriagiert",
      urgent: false,
      link: "/inbox",
    })),
    ...planFiles.filter((f) => !f.startsWith(".")).map((f): NextItem => ({
      kind: "plan",
      label: f,
      detail: "geplant",
      urgent: false,
      link: null,
    })),
  ];

  // ── Zone 2c · LETZTES — abgeschlossene Vorgänge ─────────────────
  const letztes: DoneItem[] = [
    ...decidedApprovals.map((f): DoneItem => ({
      label: f.replace(/\.yaml$/, ""),
      detail: "Approval entschieden",
      ts: null,
    })),
    ...quotes.map((q): DoneItem => ({
      label: q.id,
      detail: `Angebot · ${q.customer ?? "?"} · ${q.total ?? "—"}`,
      ts: q.created_at,
    })),
  ].slice(0, 8);

  return { kpis, jetzt, naechstes, letztes };
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

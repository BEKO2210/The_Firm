#!/usr/bin/env node
// Firma OS · CLI
// Usage: firma <command> [options]
//
// Single-file Node ESM script. Reads/writes .firma/ at repo root.

import { promises as fs } from "node:fs";
import path from "node:path";
import url from "node:url";
import process from "node:process";
import { spawn } from "node:child_process";
import { openCache } from "./lib/token-cache.mjs";
import { logRun, readRuns, summarize } from "./lib/token-log.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const FIRMA_DIR = path.join(ROOT, ".firma");
const STATE_PATH = path.join(FIRMA_DIR, "state.json");
const CONFIG_PATH = path.join(FIRMA_DIR, "config.yaml");

const VERSION = "0.2.0";

// ----------------------------------------------------------------------------
// Utilities
// ----------------------------------------------------------------------------

async function readState() {
  try {
    const raw = await fs.readFile(STATE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeState(state) {
  state.generated_at_real = new Date().toISOString();
  await fs.mkdir(FIRMA_DIR, { recursive: true });
  await fs.writeFile(STATE_PATH, JSON.stringify(state, null, 2) + "\n");
}

async function ensureDirs() {
  const dirs = [
    "inbox", "tickets", "customers",
    "finance/real", "finance/forecast", "finance/quotes",
    "approvals/pending", "approvals/decided",
    "agents/runs",
    "reports", "tokens", "cache", "plan",
    "templates/email", "templates/pdf",
  ];
  for (const d of dirs) {
    await fs.mkdir(path.join(FIRMA_DIR, d), { recursive: true });
  }
}

function emptyState() {
  return {
    schema_version: 2,
    firm: {
      name: null,
      principal: null,
      since_real: null,
    },
    real: {
      bank_account: null,
      stripe_account: null,
      monthly_revenue_eur: 0,
      monthly_costs_eur: { tools_subscriptions: 0, hosting: 0, other: 0 },
      customers: [],
      active_engagements: [],
      outstanding_invoices: [],
    },
    sim: {
      _warning: "Diese Daten sind NICHT real. Sie sind Planning-/Forecast-Daten.",
      forecast_revenue_eur_month_3: 0,
      forecast_costs_eur_month_3: 0,
      planning_scenarios: ["lean", "standard", "premium"],
    },
    tokens: {
      budget_per_run_default: 4000,
      budget_per_run_hard_cap: 15000,
      spend_today: 0,
      spend_this_week: 0,
      warnings: [],
    },
    approvals: { pending: 0, decided_today: 0 },
    tickets: { open: 0, in_progress: 0, blocked: 0 },
    inbox: { unread: 0, awaiting_action: 0 },
    agents: { active: 0, last_run_real: null },
    audit: { chain_entries: 0, chain_intact: true },
  };
}

// ----------------------------------------------------------------------------
// Commands
// ----------------------------------------------------------------------------

async function cmdInit() {
  if (await readState()) {
    console.log("Firma OS bereits initialisiert. (.firma/state.json existiert)");
    console.log("Wenn du neu starten willst: lösche .firma/ manuell.");
    return;
  }
  await ensureDirs();
  const state = emptyState();
  state.firm.since_real = new Date().toISOString();
  await writeState(state);

  // Minimal config
  const config = `# Firma OS · config.yaml
firm:
  name: ""
  principal: ""

tokens:
  budget_per_run_default: 4000
  budget_per_run_hard_cap: 15000

approvals:
  policy: strict   # strict | relaxed
  auto_approve_internal_writes: false

integrations:
  stripe:
    enabled: false
  resend:
    enabled: false
  pdfcraft:
    enabled: false

dashboard:
  port: 3000
  open_browser_on_start: true
`;
  await fs.writeFile(CONFIG_PATH, config);

  console.log("✓ .firma/ initialisiert");
  console.log("✓ state.json (v2 Schema) angelegt");
  console.log("✓ config.yaml angelegt");
  console.log("");
  console.log("Nächste Schritte:");
  console.log("  1. .firma/config.yaml öffnen + Firmennamen eintragen");
  console.log("  2. firma start  (sobald Dashboard-App existiert)");
  console.log("  3. firma status");
}

async function cmdStatus() {
  const state = await readState();
  if (!state) {
    console.log("Nicht initialisiert. Bitte zuerst: firma init");
    process.exit(1);
  }
  const f = state.firm;
  const t = state.tickets;
  const a = state.approvals;
  const i = state.inbox;
  const tok = state.tokens;
  console.log(
    `${f.name || "(unnamed)"} · Tickets ${t.open + t.in_progress}/${t.blocked} blocked · ` +
      `Inbox ${i.unread} unread · Approvals ${a.pending} pending · ` +
      `Tokens today ${tok.spend_today}/${tok.budget_per_run_default}`,
  );
}

async function cmdInbox() {
  const inboxDir = path.join(FIRMA_DIR, "inbox");
  try {
    const files = (await fs.readdir(inboxDir)).filter((f) => f.endsWith(".md"));
    if (files.length === 0) {
      console.log("Inbox leer.");
      return;
    }
    console.log(`Inbox: ${files.length} Items`);
    for (const f of files) {
      console.log("  · " + f);
    }
    console.log("");
    console.log("Triage: firma triage <filename>");
  } catch {
    console.log("Inbox-Verzeichnis nicht vorhanden. Bitte firma init.");
  }
}

async function cmdApprovals() {
  const pendingDir = path.join(FIRMA_DIR, "approvals", "pending");
  try {
    const files = (await fs.readdir(pendingDir)).filter((f) => f.endsWith(".yaml"));
    if (files.length === 0) {
      console.log("Keine offenen Approvals.");
      return;
    }
    console.log(`Pending Approvals: ${files.length}`);
    for (const f of files) {
      console.log("  · " + f);
    }
    console.log("");
    console.log("Approve: firma approve <id>");
  } catch {
    console.log("Approvals-Verzeichnis nicht vorhanden. Bitte firma init.");
  }
}

async function cmdHelp() {
  console.log(`Firma OS · CLI v${VERSION}

Verwendung:
  firma init                  first-time setup
  firma start                 start dashboard + watcher (Phase 2)
  firma status                one-line status
  firma inbox                 list inbox + new items
  firma triage <file>         triage one inbox item (Phase 2)
  firma plan                  next 7 days (Phase 2)
  firma run <agent>           run a specific agent (Phase 2)
  firma audit                 repo audit
  firma report <type>         generate PDF (Phase 4)
  firma approvals             list pending approvals
  firma approve <id>          approve action (Phase 2)
  firma test                  smoke tests (Phase 2)
  firma token-report          token usage [--period day|week|month|all]
  firma version               print version
  firma help                  this help

Dokumentation:
  CLAUDE.md                   top-level overview
  docs/ARCHITECTURE.md        wie das System aufgebaut ist
  docs/CLI.md                 vollständige CLI-Spec
  docs/ROADMAP.md             was wann gebaut wird
`);
}

async function cmdTokenReport(...args) {
  const period = pickArg(args, "--period") || "week";
  const sinceDays = { day: 1, week: 7, month: 30, all: null }[period];
  if (sinceDays === undefined) {
    console.error(`firma token-report: unbekannter --period '${period}' (day|week|month|all)`);
    process.exit(1);
  }
  const runs = await readRuns({ root: ROOT, sinceDays });
  const s = summarize(runs);
  const cache = await openCache({ root: ROOT, mode: "local" });
  const cs = await cache.stats();
  const state = await readState();
  const budget = state?.tokens?.budget_per_run_default ?? 4000;
  const cap = state?.tokens?.budget_per_run_hard_cap ?? 15000;

  console.log(`Firma OS · Token-Report (period: ${period})`);
  console.log("");
  console.log(`Runs:           ${s.total_runs}`);
  console.log(`Tokens total:   ${s.total_tokens}`);
  if (s.total_runs > 0) {
    console.log(`Avg per run:    ${Math.round(s.total_tokens / s.total_runs)}  (budget ${budget} · cap ${cap})`);
  }
  console.log(`Cache hits:     ${s.cache_hits}`);
  console.log(`Cache misses:   ${s.cache_misses}`);
  if (s.cache_hit_rate != null) {
    console.log(`Hit rate:       ${(s.cache_hit_rate * 100).toFixed(1)}%`);
  }
  console.log(`Cache entries:  ${cs.entries} (${(cs.bytes / 1024).toFixed(1)} KB, mode=${cs.mode})`);
  if (s.by_command.length > 0) {
    console.log("");
    console.log("Top commands by tokens:");
    for (const c of s.by_command.slice(0, 10)) {
      console.log(`  ${c.tokens.toString().padStart(8)} tok · ${c.runs.toString().padStart(4)} runs · ${c.command}`);
    }
  }
}

function pickArg(args, name) {
  const i = args.indexOf(name);
  if (i === -1) return null;
  return args[i + 1] ?? null;
}

async function cmdAudit() {
  console.log("Repo-Audit:");
  console.log("");
  // Repo size
  await new Promise((resolve) => {
    const p = spawn("du", ["-sh", ROOT], { stdio: "inherit" });
    p.on("close", resolve);
  });
  // Markdown count
  console.log("");
  await new Promise((resolve) => {
    const p = spawn("bash", [
      "-lc",
      `cd "${ROOT}" && find . -name "*.md" -not -path "./node_modules/*" -not -path "./.git/*" | wc -l | awk '{print "Markdown files: " $1}'`,
    ], { stdio: "inherit" });
    p.on("close", resolve);
  });
  console.log("");
  console.log("Für vollständigen Audit: docs/RATIONALE.md lesen.");
}

// ----------------------------------------------------------------------------
// Router
// ----------------------------------------------------------------------------

const [, , cmd = "help", ...args] = process.argv;

const handlers = {
  init: cmdInit,
  status: cmdStatus,
  inbox: cmdInbox,
  approvals: cmdApprovals,
  audit: cmdAudit,
  "token-report": cmdTokenReport,
  help: cmdHelp,
  "--help": cmdHelp,
  "-h": cmdHelp,
  version: async () => console.log(`firma v${VERSION}`),
  "--version": async () => console.log(`firma v${VERSION}`),
  "-v": async () => console.log(`firma v${VERSION}`),
};

const stub = (name) => async () => {
  console.log(`firma ${name}: noch nicht implementiert (Phase 2-4 der ROADMAP).`);
  console.log("Siehe docs/CLI.md und docs/ROADMAP.md.");
};

for (const c of ["start", "triage", "plan", "run", "report", "approve", "test"]) {
  if (!handlers[c]) handlers[c] = stub(c);
}

const handler = handlers[cmd];
if (!handler) {
  console.error(`Unbekannter Befehl: ${cmd}`);
  console.error("firma help für Liste der Kommandos.");
  process.exit(1);
}

try {
  await handler(...args);
} catch (e) {
  console.error("Fehler:", e.message);
  process.exit(1);
}

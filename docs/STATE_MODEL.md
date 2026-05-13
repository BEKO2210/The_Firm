# State Model

## Prinzip

**Markdown nur für Lesbares. JSON/YAML/SQLite für Zustand.** Niemals beides für dieselbe Information.

## Verzeichnis-Layout (`.firma/`)

```
.firma/
├── state.json              single source of truth (schema v2)
├── config.yaml             ENV, Tokens-Budget, Approvals-Policy, Integrations
├── inbox/                  Real eingegangene Mails + Files
│   └── <date>-<slug>.md
├── tickets/                Real engagements
│   └── TCK-<date>-####/
│       ├── ticket.yaml
│       ├── activity.jsonl
│       └── docs/           Markdown nur (kein Zustand)
├── customers/              Lead → Qualified → Customer Pipeline
│   └── <slug>/
│       └── profile.yaml
├── finance/
│   ├── real/
│   │   ├── bank-snapshots.jsonl
│   │   ├── invoices.jsonl
│   │   └── expenses.jsonl
│   ├── forecast/
│   │   ├── monthly-plan.yaml
│   │   └── scenarios.yaml
│   └── quotes/
│       ├── QT-2026-001.yaml      data
│       └── QT-2026-001.pdf       rendered
├── approvals/
│   ├── pending/
│   └── decided/
├── agents/                 agent specs
│   ├── auditor.md
│   ├── pricing.md
│   └── runs/               per-run logs
├── audit.log               append-only, hash-chained (real events only)
├── tokens/
│   └── spend.jsonl
├── reports/
│   └── <type>-<date>.pdf
├── cache/                  ephemeral
└── plan/
    └── today.yaml
```

## `state.json` Schema v2

(siehe TARGET_ARCHITECTURE.md §3 für vollständiges Beispiel)

Kern-Felder:

```typescript
interface FirmaState {
  schema_version: 2;
  firm: { name: string; principal: string; since_real: string };
  real: {
    bank_account: BankInfo | null;
    stripe_account: StripeInfo | null;
    monthly_revenue_eur: number;
    monthly_costs_eur: CostBreakdown;
    customers: CustomerSummary[];
    active_engagements: EngagementSummary[];
    outstanding_invoices: InvoiceSummary[];
  };
  sim: {
    _warning: string;
    forecast_revenue_eur_month_3: number;
    forecast_costs_eur_month_3: number;
    planning_scenarios: ScenarioName[];
  };
  tokens: TokenBudget;
  approvals: { pending: number; decided_today: number };
  tickets: { open: number; in_progress: number; blocked: number };
  inbox: { unread: number; awaiting_action: number };
  agents: { active: number; last_run_real: string | null };
  audit: { chain_entries: number; chain_intact: boolean };
  generated_at_real: string; // ISO 8601
}
```

**Konvention:** `real.*` enthält Real-Daten. `sim.*` Plan-Daten. UI muss Sim-Banner zeigen, wenn Sim-Werte angezeigt werden.

## Migrationen aus altem State

### Was wird gemapped:

| Alt (state.json v1) | Neu (state.json v2) |
|---------------------|---------------------|
| `finance.bank_eur` (€2.350.042) | `real.bank_account = null` (existiert nicht) |
| `finance.payroll_eur` (€469.170) | gestrichen (50 Sim-MA → 1 Mensch) |
| `headcount.total` (50) | `firm.principal` (1 Mensch) + `firm.team = []` |
| `ai_ethics.decisions_logged` (86) | `audit.chain_entries` (gefiltert auf real-relevante) |
| `knowledge.nodes` (13) | `docs/knowledge-graph/` als statische Markdowns + `/graph` Dashboard |
| `okr.krs_on_track` (5/19) | bleibt, aber nach realen KRs gefiltert (max 5 KRs) |
| `incidents.open` (1) | bleibt — wenn die Vorgänge real-relevant sind |
| `hr.*`, `bcdr.*`, `oss.*`, `esg.*` | nach `archive/legacy/sim-fields.json` |
| `tickets.active` (1) | bleibt, wenn das Ticket „real" ist (Belkis hat den Brief geschrieben → ja, das war real) |

### Migrations-Script

```bash
firma audit migrate-state
# Liest state.json v1 → schreibt state.json v2 mit klarer Trennung
# Backup alte Datei nach .firma/migrations/state-v1.json
```

## Daten-Trennung: real / forecast / example / quote / internal

| Bereich | Real | Forecast | Example | Quote | Internal |
|---------|:----:|:--------:|:-------:|:-----:|:--------:|
| Bank-Stand | `real/bank-snapshots.jsonl` | — | — | — | — |
| Monats-Budget | — | `forecast/monthly-plan.yaml` | — | — | — |
| Demo-Preis-Beispiel | — | — | `docs/examples/sample-pricing.md` | — | — |
| Kunden-Angebot | — | — | — | `quotes/QT-...-yaml/.pdf` | — |
| Stundensatz-Kalkulation Belkis | — | — | — | — | `internal/pricing-calc.yaml` |

Dashboard zeigt jeweils nur den passenden Bereich pro Seite (`/finance/real` vs `/finance/forecast` etc.).

## Audit-Log v2

`.firma/audit.log` ist append-only JSONL. Hash-chained.

Real-Welt-Events nur:

| Event-Type | Beispiel-Trigger |
|------------|------------------|
| `customer_email_received` | mail.md in inbox/ erkannt |
| `customer_email_sent` | nach Approval, von Resend bestätigt |
| `quote_generated` | PDF erstellt |
| `invoice_issued` | Stripe-Invoice-ID erhalten |
| `invoice_paid` | Stripe-Webhook event.payment_intent.succeeded |
| `contract_signed` | Datei mit Signatur archiviert |
| `code_deployed` | Production-Deploy mit Hash |
| `approval_granted` / `approval_rejected` | manuell durch Belkis |
| `agent_run_complete` | inkl. Token-Verbrauch |
| `state_migration` | bei Schema-Upgrade |
| `incident_opened` / `incident_closed` | echter Vorfall |

**NICHT mehr im Log:**
- `daily_standup`
- `burnout_decay_applied`
- `wallclock_advance`
- `knowledge_graph_nodes_created` (außer als Side-Effect-Hinweis)
- alle reinen Sim-Events

## Tokens

`.firma/tokens/spend.jsonl`:

```jsonl
{"real":"2026-05-13T10:00Z","source":"agent:auditor","tokens_in":1200,"tokens_out":2300,"note":"repo audit"}
{"real":"2026-05-13T10:30Z","source":"chat:weiter","tokens_in":2500,"tokens_out":3500,"note":"day 5 standup"}
```

Dashboard `/tokens` rendert daraus.

## SQLite-Cache (optional, später)

Für Performance bei vielen Tickets/Customers: `.firma/cache.sqlite` mit Tabellen für Tickets, Customers, Invoices.

**Quelle bleibt** die JSON/YAML-Dateien. Cache ist Read-Optimization, kein Truth-Holder.

## Verzeichnis-Größe-Ziel

| Bereich | Heute | Ziel | Reduktion |
|---------|------:|-----:|----------:|
| `.firma/` | 119 Files | < 40 Files (ohne tickets/, customers/) | -66% |
| `pools/` | 250 Files | 0 (gelöscht/archiviert) | -100% |
| `workspace/` | 62 Files | < 30 (nach Aufräumen) | -50% |
| Markdown Total | 375 | < 50 (in `docs/`, `templates/`) | -87% |
| Repo-Größe | 530 MB | < 200 MB | -62% |

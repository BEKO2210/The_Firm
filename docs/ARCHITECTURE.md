# Firma OS · Zielarchitektur

**Mission:** Ein echtes, nutzbares Betriebssystem für eine 1-Person-Firma (Belkis), die Friseur-/Beauty-SaaS und KI-nahe Software-Dienstleistungen verkaufen will. Maximale Klarheit. Minimaler Tokenverbrauch. Keine Simulation, die als Realität verkleidet wird.

---

## 1. Leitprinzipien

| # | Prinzip | Praktisch |
|---|---------|-----------|
| 1 | **Trennung Sim vs Real** | Jede Zahl, jedes Event ist explizit `real:` oder `sim:` markiert |
| 2 | **Dashboard ist die Wahrheit** | Wo immer Belkis hinklickt, sieht sie den aktuellen Stand. CLI ist Backup. |
| 3 | **Einfache Kommandos** | `firma status`, `firma inbox`, `firma report` — keine Slash-Magic im Chat |
| 4 | **JSON/YAML für Status, Markdown nur für Lesbares** | `.firma/state.json` ist Quelle. Markdown ist Output, kein Zustand. |
| 5 | **Externe Aktionen = Approval Center** | Nichts geht raus ohne dokumentierte Freigabe |
| 6 | **Token-Budget pro Run** | Default 10k Tokens, kein Run > 50k ohne explizite Freigabe |
| 7 | **Mind. 1 Tool < 1 Tag deployable** | Jede neue Integration muss in ≤ 8 Stunden auf einem Use Case laufen |

---

## 2. System-Module (Top-Down)

```
┌─────────────────────────────────────────────────────────────────────┐
│  DASHBOARD (Next.js, /firma)                                         │
│  · Home    · Inbox   · Tickets   · Customers    · Finance            │
│  · Agents  · Graph   · Documents · Approvals    · Tokens             │
└─────────────────────┬───────────────────────────────────────────────┘
                      │  liest aus .firma/
                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│  .firma/                                                             │
│  · state.json         single source of truth                         │
│  · config.yaml        env, hooks, approvals-policy                   │
│  · inbox/             real-world incoming mails + files              │
│  · tickets/           one folder per real engagement                 │
│  · customers/         lead / qualified / customer pipeline           │
│  · finance/           real ledger + simulated forecasts (separated)  │
│  · approvals/         pending + decided approvals                    │
│  · agents/            agent specs (active + archived)                │
│  · audit.log          append-only hash-chain (real events only)      │
│  · reports/           generated PDFs + snapshots                     │
│  · cache/             token-budget cache, vector cache, etc.         │
└─────────────────────┬───────────────────────────────────────────────┘
                      │  written/read by
                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│  CLI · `firma`                                                       │
│  · firma start            start dashboard + watcher                  │
│  · firma status           one-liner status                           │
│  · firma inbox            list new items + triage                    │
│  · firma audit            run repo audit                             │
│  · firma plan             plan next 7 days                           │
│  · firma report           generate PDF status                        │
│  · firma test             run smoke + benchmark tests                │
│  · firma token-report     where do tokens go                         │
└─────────────────────┬───────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│  AGENTS (defined in .firma/agents/, executed on demand)              │
│  · auditor          UX-simplifier      token-economy                 │
│  · pricing          integration         dashboard                     │
│  · compliance       devops/test                                       │
│  Single-agent default. Multi-agent (ruflo) only when needed.         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Datenmodell (`.firma/state.json` v2)

```json
{
  "schema_version": 2,
  "firm": {
    "name": "Korynth Labs",
    "principal": "Belkis Aslani",
    "since_real": "2026-05-13"
  },
  "real": {
    "bank_account": null,
    "stripe_account": null,
    "monthly_revenue_eur": 0,
    "monthly_costs_eur": { "tools_subscriptions": 0, "hosting": 0, "other": 0 },
    "customers": [],
    "active_engagements": [],
    "outstanding_invoices": []
  },
  "sim": {
    "_warning": "Diese Daten sind NICHT real. Sie sind Planning-/Forecast-Daten.",
    "forecast_revenue_eur_month_3": 0,
    "forecast_costs_eur_month_3": 0,
    "planning_scenarios": ["lean", "standard", "premium"]
  },
  "tokens": {
    "budget_per_run_default": 10000,
    "budget_per_run_hard_cap": 50000,
    "spend_today": 0,
    "spend_this_week": 0,
    "warnings": []
  },
  "approvals": {
    "pending": 0,
    "decided_today": 0
  },
  "tickets": { "open": 0, "in_progress": 0, "blocked": 0 },
  "inbox": { "unread": 0, "awaiting_action": 0 },
  "agents": { "active": 0, "last_run_real": null },
  "audit": { "chain_entries": 0, "chain_intact": true },
  "generated_at_real": "ISO8601"
}
```

Sim-Daten werden **niemals** mit Real-Daten gemischt. Dashboard zeigt beide klar getrennt.

---

## 4. Dashboard-Seiten (Next.js auf dem bestehenden `website/`-Stack)

| Seite | Inhalt | Datenquelle | Real / Sim |
|-------|--------|-------------|:----------:|
| `/` (Home) | Was läuft heute? + 3 nächste Aktionen | `.firma/state.json + .firma/inbox/` | Real-fokussiert |
| `/inbox` | Eingegangene Mails + Files + Triage | `.firma/inbox/` | Real |
| `/tickets` | offene Engagements | `.firma/tickets/` | Real |
| `/customers` | Pipeline + Stammdaten | `.firma/customers/` | Real |
| `/finance/real` | echte Einnahmen, Ausgaben, ARR | `.firma/finance/real.jsonl` | Real |
| `/finance/forecast` | Plan-Szenarien (klar als Sim markiert) | `.firma/finance/forecast.json` | Sim |
| `/agents` | aktive Agent-Specs + letzter Run | `.firma/agents/` | Real-Agent-Aktivität |
| `/graph` | Beziehungen zwischen Customers/Tickets/Agents | aus state.json abgeleitet | Real |
| `/documents` | generierte PDFs, Angebote, Verträge | `.firma/reports/` | Real |
| `/approvals` | pending Approvals (extern!) | `.firma/approvals/` | Real |
| `/tokens` | Verbrauch + Budget + Drill-Down | `.firma/tokens/` | Real |
| `/settings` | Integrationen, Hooks, ENV | `.firma/config.yaml` | Real |

**Nicht-Techniker-Test:** Wer auf `/` landet, sieht sofort:

1. Eine Begrüßung + heutiges Datum
2. „Diese 3 Dinge brauchen heute deine Entscheidung" (Approvals)
3. „Diese 2 Mails warten auf Antwort" (Inbox)
4. „Hier dein aktueller Tokenverbrauch heute" (Budget)
5. Großer Button: „Was möchtest du machen?" → Wizard mit 5 Optionen

---

## 5. Agenten-Orchestrierung

**Default: 1 Agent (Claude Code) → on-demand Spezialagenten.**

Spawnen via:
```bash
firma agent run auditor       # einmaliger run
firma agent run pricing       # einmaliger run
firma agent start             # background watcher (ruflo, später)
```

Agent-Spec-Format (siehe `.firma/agents/*.md`):

```yaml
---
agent_id: auditor
purpose: "Repo + commits + chaos audit"
inputs: ["repo path", "since-commit"]
outputs: ["docs/firma-os-audit/<date>.md"]
tools_allowed: ["read_files", "git", "grep"]
tools_forbidden: ["external_api_calls", "git_push", "email_send"]
token_budget: 30000
human_approval_required_for: ["any write outside docs/firma-os-audit/"]
---
```

Multi-Agent (Ruflo) kommt **erst Phase 5** der Migration.

---

## 6. Approval Center (Human-in-the-Loop)

Jede Aktion, die unter Hard-Stop-Rule fällt, erzeugt eine Approval-Datei:

```
.firma/approvals/2026-05-13_outreach-mail-to-salon-X.yaml
```

Inhalt:
```yaml
id: APR-2026-001
type: external_outreach
created_real: 2026-05-13T22:00Z
requested_by: auditor-agent
description: "Send cold-outreach email to Hair Boutique Mariposa"
risk: medium
cost_eur: 0
visible_in_dashboard: /approvals
status: pending
expires_real: 2026-05-20
payload_file: drafts/outreach-mariposa.md
decision:
  approved_by: null
  approved_real: null
  note: null
```

Dashboard `/approvals` zeigt alle `pending` mit Approve/Reject-Buttons.
**Ohne `approved_by` darf keine externe Aktion stattfinden.**

---

## 7. Token-Economy

| Was wir brauchen | Mechanismus |
|------------------|-------------|
| Aktueller Verbrauch | tracker in `.firma/tokens/spend.jsonl` |
| Budget pro Run | `config.yaml: tokens.budget_per_run` |
| Cap pro Run | `tokens.budget_per_run_hard_cap` |
| Warning bei 80% Budget | Agent stoppt + fragt nach |
| Reduktion `state.json`-Reminders | nur Delta-Diff statt full reload (rtk-ai) |
| Reduktion Markdown-Wiederholung | Reports rendern aus Templates, nicht handgeschrieben |

**Konkrete Maßnahmen (siehe TOKEN_ECONOMY.md):**

1. CLAUDE.md kürzen von 2.511 → ~250 Zeilen (90% Reduktion)
2. Audit-Log auf real-relevante Events beschränken
3. Standup-Theater entfernen
4. State.json mit Delta-Synchronisation statt Full-Reload

---

## 8. CLI · `firma`-Script

Single-File Node-Script in `scripts/firma/firma.mjs`. Aufruf via Symlink:
```
/usr/local/bin/firma → scripts/firma/firma.mjs
```

Commands:

```
firma start              start Next.js dashboard + file watcher
firma status             one-line status
firma inbox              list inbox + new attachments
firma triage <file>      open triage prompt for one inbox file
firma plan               plan next 7 days
firma run <agent>        run a specific agent
firma test               smoke tests
firma report [type]      generate PDF report (status, weekly, quarterly)
firma audit              repo audit (this is what we just did)
firma token-report       show token spending
firma approvals          list pending approvals
firma approve <id>       approve an action
firma version            print version
firma help               print help
```

---

## 9. Migration in Phasen

Phase 0: Audit ✅ (jetzt)
Phase 1: Neue CLAUDE.md + State-Model
Phase 2: CLI + Dashboard erste Iteration
Phase 3: Token-Optimierung mit rtk-ai
Phase 4: PDFCraft-Integration für Angebote
Phase 5: Multi-Agent via Ruflo (optional)

Detail in `ROADMAP.md`.

---

## 10. Pricing-Realismus für Belkis

(siehe `PRICING_PLAYBOOK.md`)

Kernidee: Realistische Salon-MVP-Pakete:

| Paket | Preis (B2B) | Zeitaufwand | Marge für Belkis |
|-------|------------:|:-----------:|:----------------:|
| Salon-Website-Starter | €1.500–3.500 | 8–20h | 70% |
| Salon-Buchungs-App (1 Salon) | €15.000–35.000 | 4–8 Wo | 50% |
| Multi-Tenant SaaS | €60.000–120.000 | 12–20 Wo | 35% |
| Maintenance/Salon/Mo | €150–800 | 1–4h | 75% |
| KI-Beratung/Stunde | €120–250 | direkt | 85% |

---

## 11. Was bleibt von der alten Welt — gezielt

| Behalten | Form |
|----------|------|
| Slot-Engine-Final-Spec | als Verkaufs-Asset + Build-Blueprint |
| DPIA-Vorlage | als DSGVO-Servicepaket-Asset |
| 0001 + 0002 SQL Migrations | direkt nutzbar im echten Build |
| TS-Reference Slot-Engine | direkt nutzbar im echten Build |
| Discovery-Output v2 (gekürzt) | als Whitepaper / Verkaufs-Dokument |
| DSGVO/EU-AI-Act-Konzept-Inhalte | als Trust-Page-Inhalt |

---

## 12. Erfolgs-Definition für Firma OS v0.1

- [ ] Nicht-Techniker versteht in 10 Min, was das System tut
- [ ] Token pro `weiter`/`run` < 4.000 (vorher ~10k)
- [ ] CLAUDE.md ≤ 300 Zeilen
- [ ] Dashboard zeigt **echte** Daten
- [ ] Mindestens 1 PDF-Angebot generierbar (PDFCraft)
- [ ] Mindestens 1 Approval-Flow durchlaufen (Lead-Outreach genehmigt)
- [ ] Erste reale Stripe-Transaktion möglich
- [ ] Audit-Log enthält nur real-relevante Events
- [ ] Keine simulierten 50 Employees
- [ ] Keine Fake-Bank-Stände

Siehe `TESTING.md` für die konkreten Tests.

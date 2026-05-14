# Roadmap

## Übersicht

Aufbau von Firma OS in 8 Phasen — vom ersten Setup bis zur stabilen Monetarisierung. Externe Bausteine kommen pragmatisch dazu, nicht alle auf einmal.

| Phase | Dauer | Output | Status |
|------:|:-----:|--------|:------:|
| 0 | sofort | Initial Architecture + Specs | ✅ |
| 1 | 1-2 Tage | CLAUDE.md + State-Model + CLI v0.1 | ✅ |
| 2 | 1-2 Wochen | Dashboard MVP **+ rtk-ai Integration** (Token sparen) | ⏳ |
| 3 | 1 Woche | Tiefer Token-Sparen + Interpreted-CM PoC | ⏳ |
| 4 | 1-2 Tage | Typst + Erstes Angebot-PDF (PDFCraft verworfen wegen AGPL) | ✅ |
| 5 | 1-2 Wochen | MemPalace (persistentes Memory) | ⏳ |
| 6 | 1-2 Wochen | Ruflo (Multi-Agent live, wenn Volumen) | ⏳ |
| 7 | laufend | Monetarisierung tief (echte Verkäufe) | laufend |
| 8 | nach Bedarf | Erweiterungen (Graphify, agent-browser, …) | optional |

**Architektur-Vision:** [INTEGRATION_BLUEPRINT.md](INTEGRATION_BLUEPRINT.md) zeigt, wie rtk-ai, Interpreted-CM, MemPalace und Ruflo am Ende zusammenwirken.

---

## Phase 0 · Initial Architecture ✅

- [x] RATIONALE.md
- [x] ARCHITECTURE.md
- [x] TOKEN_ECONOMY.md
- [x] PRICING_PLAYBOOK.md
- [x] TOOL_RECOMMENDATIONS.md
- [x] DASHBOARD.md
- [x] CLI.md
- [x] STATE_MODEL.md
- [x] ROADMAP.md
- [x] TESTING.md
- [x] INTEGRATION_BLUEPRINT.md

## Phase 1 · CLAUDE.md + State-Model + CLI v0.1 ✅

- [x] Schlanke CLAUDE.md (≤ 400 Zeilen)
- [x] `.firma/state.json` v2 Schema mit real/sim-Split
- [x] `.firma/config.yaml`
- [x] 8 Agent-Specs in `.firma/agents/`
- [x] `scripts/firma/firma.mjs` (Single-File CLI)
- [x] Commands lauffähig: `init`, `status`, `inbox`, `approvals`, `audit`, `help`, `version`

## Phase 2 · Dashboard MVP + rtk-ai Integration

**Ziel:** Klickbares Dashboard läuft lokal · gleichzeitig erste Token-Einsparung durch rtk-ai.

**Dashboard MVP:**

- [x] Next.js 16 + React 19 + Tailwind 4 Setup in `website/`
- [x] `/` Home liest aus `state.json` v2 (Stats + Real/Forecast getrennt + Token-Gauge)
- [x] `/inbox` mit echten Files (`.firma/inbox/*.md`)
- [x] `/approvals` (Pending + Decided aus `.firma/approvals/`) — Approve/Reject als Server Action: offen
- [x] `/tokens` mit Gauge + Top-Commands + Letzte 20 Runs (aus `runs.jsonl`)
- [ ] File-Watcher für Auto-Refresh (SSE) — Phase 2.5
- [ ] Mobile-Test (375px Viewport) — Phase 2.5

**rtk-ai Integration (parallel):**

- [ ] [rtk-ai/rtk](https://github.com/rtk-ai/rtk) Repo lokal evaluieren
- [ ] PoC: Context-Fingerprint für wiederholt gelesene State-Files
- [ ] Adapter in `scripts/firma/token-cache.mjs`
- [ ] CLI: `firma run` nutzt rtk-Cache transparent
- [ ] Smoke-Test: 1 Woche Token-Verbrauch vor/nach messen
- [ ] Ziel: -40 % Tokens bei Routine-Runs

**Aufwand:** 1-2 Wochen. **Pre-conditions:** Phase 1 abgeschlossen.

## Phase 3 · Tiefer Token-Sparen + Interpreted-CM PoC

**Ziel:** rtk produktiv festklopfen · strukturierter Reasoning-Layer als zweite Ebene.

- [ ] rtk-Adapter härten (Cache-Invalidierung sauber)
- [ ] Audit-Log auf real-relevante Events beschränken (kein Sim-Rauschen)
- [ ] Token-Budget Hard-Cap (4k default / 15k cap) im CLI durchsetzen
- [ ] [Interpreted-Context-Methodology](https://github.com/RinDig/Interpreted-Context-Methdology) PoC
  - [ ] Verstehen: was bringt der strukturierte Reasoning-Layer?
  - [ ] Mini-PoC für einen Workflow (z.B. Triage-Entscheidung)
  - [ ] Entscheidung: produktiv übernehmen oder verwerfen?
- [ ] Token-Report-CLI: `firma token-report --period week`

**Aufwand:** 1 Woche. **Pre-conditions:** Phase 2 abgeschlossen.

## Phase 4 · PDFCraft + erstes Angebot-PDF

**Ziel:** Direkter Geschäftswert — Angebote raus an Leads.

- [ ] PDFCraft integriert (`tools/pdfcraft/`)
- [ ] Template: Salon-Webseite-Angebot
- [ ] Template: Rechnung
- [ ] Template: Status-Report
- [ ] CLI: `firma report quote …` + `firma report invoice …`
- [ ] **Erstes echtes Angebot-PDF an einen Lead generieren** (mit Approval)

**Aufwand:** 1-2 Tage. **Pre-conditions:** Approval-Flow funktioniert (Phase 2).

## Phase 5 · MemPalace (persistentes Memory)

**Ziel:** Wissen über Customers, Tickets, Entscheidungen persistent halten — über Sessions hinweg.

- [ ] [MemPalace](https://github.com/MemPalace/mempalace) Repo verstehen
- [ ] Schema-Mapping: `.firma/customers/`, `.firma/tickets/` → MemPalace-Entities
- [ ] Adapter in `scripts/firma/memory.mjs`
- [ ] Migration: bestehende `.firma/`-Daten einlesen
- [ ] Recall-Test: „Was haben wir mit Customer X letzten Monat besprochen?"

**Aufwand:** 1-2 Wochen. **Pre-conditions:** Phase 4 läuft, erste reale Customers existieren.

## Phase 6 · Ruflo (Multi-Agent live)

**Nur wenn Volumen es rechtfertigt.** Single-Agent bleibt Default.

- [ ] [Ruflo](https://github.com/ruvnet/ruflo) Evaluation
- [ ] Multi-Agent-Setup: auditor + pricing + customer-success parallel
- [ ] Pro-Agent Token-Budget
- [ ] Memory-Bridge zu MemPalace
- [ ] Smoke-Test über 1 Woche
- [ ] Entscheidung: produktiv oder verwerfen?

**Aufwand:** 1-2 Wochen. **Pre-conditions:** Phase 5 abgeschlossen, mindestens 3 parallele reale Workflows aktiv.

## Phase 7 · Monetarisierung tief

Realer Geschäftsbetrieb. Läuft parallel zu allen Phasen ab Phase 4.

- [ ] Landing-Page mit Paketen A–E
- [ ] Stripe-Account + Test-Integration
- [ ] Erste Cold-Outreach-Welle (mit Approvals!)
- [ ] Erstes signiertes Engagement
- [ ] Erste echte Rechnung
- [ ] Erste echte Zahlung
- [ ] Erster Pilot-Kunde onboarded

**Aufwand:** laufend, 3-12 Monate je nach Markt.

## Phase 8 · Erweiterungen (nach Bedarf)

Nach Priorität aus [TOOL_RECOMMENDATIONS.md](TOOL_RECOMMENDATIONS.md):

- [ ] Graphify für `/graph` Beziehungs-View
- [ ] agent-browser für UI-Smoke-Tests
- [ ] ClawBot für automatisches Repo-Audit
- [ ] ViMax bei Bedarf für Multimodal

**Aufwand:** je Tool 2-7 Tage.

---

## Wichtige Regeln während aller Phasen

1. **Approval-Flow ist absolut** — keine externen Aktionen ohne schriftliche Freigabe.
2. **Token-Budget per Phase:**
   - Phase 2-3: Ziel < 30k pro Tag
   - Phase 4+: Ziel < 10k pro Tag
3. **Real vs Sim**: Bei jedem Run klar markiert. Wenn unklar → annehmen es ist Sim, bis bestätigt.
4. **Externe Bausteine staffeln**: rtk-ai jetzt, andere erst wenn ihr Mehrwert messbar ist.
5. **Reversibilität**: Jede Integration muss abschaltbar bleiben (Adapter-Pattern, Feature-Flag).

## Rollback-Plan

Falls eine Integration fehlschlägt:

- Adapter abschalten (Feature-Flag in `.firma/config.yaml`)
- Git-History bleibt intakt → letzten guten Stand checken
- Firma OS Kern (CLI + state.json) läuft auch ohne externe Bausteine

## Erfolgs-Kriterien für v0.1

- [ ] `firma init` läuft fehlerfrei ✅
- [ ] `firma status` liefert plausible Ausgabe ✅
- [x] Dashboard MVP läuft (Phase 2 · `cd website && npm run dev`)
- [ ] Token-Verbrauch pro Routine-Run < 4k (Phase 3)
- [ ] Erstes echtes Angebot-PDF raus (Phase 4)
- [ ] Approval-Flow ≥ 5× durchlaufen
- [ ] Repo-Größe < 200 MB
- [ ] CLAUDE.md ≤ 400 Zeilen

## Was kommt NACH v0.1

- **v0.2**: Mehrere Customers parallel, MRR-Tracking, MemPalace-Recall produktiv
- **v0.3**: Multi-Agent in Production (Ruflo, falls Volumen)
- **v1.0**: Stabiler Betrieb, mehrere bezahlte Kunden, Token-Verbrauch optimiert

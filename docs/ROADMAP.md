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
| 5 | — | MemPalace (persistentes Memory) | ⏸ postponed |
| 6 | — | Ruflo (Multi-Agent live, wenn Volumen) | ⏸ postponed |
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

## Iteration A · Enterprise-Readiness des bestehenden Stacks

**Ziel:** Den bestehenden Stack mit weltweit anerkannten Benchmarks belegen (kein Eigen-Score). Jede neue Behauptung steht auf anerkanntem Standard.

- [x] **A.1** — Lighthouse CI auf `/`, `/tools`, `/reports` · Standard: Lighthouse 12 (Google, Apache 2.0) + Core Web Vitals · Snapshot: `docs/benchmarks/lighthouse-dashboard-2026-05-14.json` · Ergebnis: **100/100/100/100 mean** (Perf / A11y / BP / SEO)
- [x] **A.2** — axe-core Standalone gegen alle 6 Routen · Standard: axe-core 4.11.4 (Deque, MPL 2.0) + WCAG 2.1 A + AA · Snapshot: `docs/benchmarks/axe-dashboard-2026-05-14.json` · Ergebnis: **0 Violations** (nach Fix für `scrollable-region-focusable` auf `/reports`)
- [x] **A.3** — `npm audit` + Trivy CVE-Scan auf Repo · Standard: OWASP Top 10 A06:2021 + CVE/GHSA/OSV · Snapshot: `docs/benchmarks/security-audit-2026-05-14.json` · Ergebnis: **0 CVEs, 0 Secrets** (nach Fix von 6 npm-audit-Findings via `postcss`+`tmp` overrides)
- [x] **A.4** — veraPDF PDF/A-2 Validierung der Typst-Outputs · Standard: ISO 19005-2:2011 (PDF/A-2b) via veraPDF (MPL 2.0) · Snapshot: `docs/benchmarks/pdfa-validation-2026-05-14.json` · Ergebnis: **PASS, 6989/0** (nach Fix: `--pdf-standard a-2b` als Default in `renderTypst`)

**Iteration A abgeschlossen** — bis auf den manuellen A11y-Followup (Tastatur-Tour, siehe `docs/BENCHMARKS.md` #7). Vier anerkannte Standards (Lighthouse, axe-core, OWASP A06, ISO 19005-2) liefern jetzt ehrliche, reproduzierbare Aussagen über den Stack.

**Methodik:** Jeder Snapshot wird mit `npm run bench:<name>` reproduzierbar, landet in `docs/benchmarks/` mit stabilem JSON-Schema, und nennt Tool-Version + Methodology in der Datei selbst.

## Phase 5 · MemPalace · ⏸ Postponed

**Entscheidung 2026-05-14:** zurückgestellt, bis es konkrete Wiederholungs-Queries gibt, die persistentes Memory rechtfertigen. Aktuell ist `.firma/customers/<slug>/` als Markdown-Folder ausreichend.

**Trigger zum Reaktivieren:**
- mind. 3 reale Customers
- mind. 5 dokumentierte "Was haben wir letztes Mal mit X besprochen?"-Momente
- erkennbarer Kosten/Zeit-Schmerz, der Memory rechtfertigt

## Phase 6 · Ruflo (Multi-Agent) · ⏸ Postponed

**Entscheidung 2026-05-14:** zurückgestellt. Single-Agent (Claude Code) deckt alle aktuellen Workflows ab. Multi-Agent kommt erst, wenn echtes Volumen es rechtfertigt — und MemPalace verfügbar ist (gemeinsames Memory ist Voraussetzung).

**Trigger zum Reaktivieren:**
- mind. 3 parallele Workflows mit messbarer Wartezeit zwischen Agent-Calls
- Phase 5 abgeschlossen

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

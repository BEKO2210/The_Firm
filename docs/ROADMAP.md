# Migration Plan

## Übersicht

Aufbau von Firma OS in 8 Phasen — vom ersten Setup bis zur stabilen Monetarisierung.

| Phase | Dauer | Output | Risiko |
|------:|:-----:|--------|:------:|
| 0 | sofort | Freeze + Audit (✅ dieser Run) | none |
| 1 | 1-2 Tage | Neue CLAUDE.md + State-Model | low |
| 2 | 3-5 Tage | CLI + Dashboard erste Iteration | medium |
| 3 | 1 Woche | Token-Optimierung (rtk-ai) | low |
| 4 | 1-2 Tage | PDFCraft + Erstes Angebot | low |
| 5 | 1-2 Wochen | Ruflo Multi-Agent (optional) | medium |
| 6 | laufend | Monetarisierung (echte Verkäufe) | hoch (kundenseitig) |
| 7 | laufend | Tool-Integrationen weiter | low |
| 8 | nach 60 Tagen | Clean-up + Archivierung | low |

## Phase 0 · Initial Architecture Specification

- [x] RATIONALE.md
- [x] ARCHITECTURE.md
- [x] TOKEN_ECONOMY.md
- [x] PRICING_PLAYBOOK.md
- [x] TOOL_RECOMMENDATIONS.md
- [x] DASHBOARD.md
- [x] CLI.md
- [x] STATE_MODEL.md
- [x] dieser ROADMAP.md
- [ ] TESTING.md (in Arbeit)
- [ ] RUN_SUMMARY.md (am Ende)
- [ ] Neue CLAUDE.md
- [ ] 8 Agent-Specs
- [ ] First scripts

**Freeze-Regel:** Bis Phase 1 startet, keine `weiter`-Calls und keine neuen Sim-Tickets.

## Phase 1 · Neue CLAUDE.md + State-Model

- [ ] Backup alte CLAUDE.md → `archive/legacy/CLAUDE.before-firma-os-rebuild.md`
- [ ] Neue CLAUDE.md mit Verweisen auf Sub-Dateien
- [ ] state.json v2 Schema mit klarem real/sim-Split
- [ ] Migration-Script `firma migrate-state`
- [ ] Sim-Felder (pools, personality, hr/equity etc.) archivieren nach `archive/legacy/`

**Aufwand:** 1-2 Tage. **Pre-conditions:** Phase 0 abgeschlossen.

## Phase 2 · CLI + Dashboard erste Iteration

- [ ] `scripts/firma/firma.mjs` mit Commands: `status`, `inbox`, `start`, `audit`, `help`
- [ ] Dashboard-Anpassungen:
  - [ ] `/` Home liest aus state.json v2
  - [ ] `/inbox` mit echten Files
  - [ ] `/approvals` mit Approve/Reject
  - [ ] `/tokens` mit Gauge
- [ ] File-Watcher für Auto-Refresh
- [ ] Mobile-Test

**Aufwand:** 3-5 Tage. **Pre-conditions:** Phase 1 abgeschlossen.

## Phase 3 · Token-Optimierung

- [ ] rtk-ai/rtk evaluieren + PoC
- [ ] Delta-Diff für state.json-Reminders
- [ ] Audit-Log auf real-relevante Events beschränken
- [ ] Token-Budget Hard-Cap implementieren

**Aufwand:** 1 Woche. **Pre-conditions:** Phase 2 abgeschlossen.

## Phase 4 · PDFCraft + erstes Angebot

- [ ] PDFCraft integriert
- [ ] Template: Salon-Webseite-Angebot
- [ ] Template: Rechnung
- [ ] CLI: `firma report quote ...` + `firma report invoice ...`
- [ ] **Erstes echtes Angebot-PDF an einen Lead generieren** (mit Approval)

**Aufwand:** 1-2 Tage. **Pre-conditions:** Phase 2 abgeschlossen, Approval-Flow funktioniert.

## Phase 5 · Multi-Agent (Ruflo) — optional

Nur wenn Single-Agent-Workflow bewährt + Volumen rechtfertigt es.

- [ ] Ruflo-Evaluation
- [ ] Multi-Agent-Setup: auditor + pricing + customer-success parallel
- [ ] Pro-Agent-Token-Budget
- [ ] Smoke-Test über 1 Woche

**Aufwand:** 1-2 Wochen. **Pre-conditions:** Phase 4 abgeschlossen.

## Phase 6 · Monetarisierung

Realer Geschäftsbetrieb. Parallel zu allen anderen Phasen.

- [ ] Landing-Page mit Paketen A–E
- [ ] Stripe-Account + Test-Integration
- [ ] Erste Cold-Outreach-Welle (mit Approvals!)
- [ ] Erstes signiertes Angebot
- [ ] Erste echte Rechnung
- [ ] Erste echte Zahlung
- [ ] Erster Pilotsalon onboarded

**Aufwand:** laufend, 3-12 Monate je nach Markt.

## Phase 7 · Tool-Integrationen vertieft

Nach Priorität aus TOOL_RECOMMENDATIONS.md:

1. Graphify für `/graph`
2. ClawBot für automatisches Audit
3. Agent-Browser für UI-Tests
4. ViMax für Multimodal (bei Bedarf)

**Aufwand:** je Tool 2-7 Tage.

## Phase 8 · Clean-up + Archivierung

Nach 60 Tagen Firma OS in Betrieb:

- [ ] Alte Dateien nach `archive/legacy/` (nicht löschen, archivieren)
- [ ] Repo-Größe < 200 MB
- [ ] Markdown-Count < 50
- [ ] `state.json` < 100 Zeilen
- [ ] Audit-Log nur reale Events
- [ ] Reflektion: hat Belkis € verdient?

## Wichtige Regeln während der Migration

1. **Niemals löschen ohne Backup.** Alles nach `archive/legacy/`.
2. **Approval-Flow ist sofort aktiv** ab Phase 1.
3. **Token-Budget per Phase**:
   - Phase 0: bereits passiert
   - Phase 1: ~50k Tokens (Setup)
   - Phase 2-3: ~30k pro Tag
   - Phase 4+: ~10k pro Tag (Goal)
4. **Reale vs Sim**: Bei jedem Run wird klar markiert. Wenn unklar → annehmen es ist Sim, bis bestätigt.
5. **Hard-Stop-Rule** bleibt absolut. Kein externer Versand ohne Approval.

## Rollback-Plan

Falls Migration fehlschlägt:

- Alle alten Daten sind in `archive/legacy/` → rollback durch Restore
- Git-History bleibt intakt → `git reset --hard <pre-migration-commit>` möglich (nicht empfohlen, lieber forward fix)
- Notfall: alte CLAUDE.md ist in `archive/legacy/CLAUDE.before-firma-os-rebuild.md`

## Erfolgs-Kriterien für vollständige Migration

- [ ] Nicht-Techniker macht 10-Minuten-Onboarding-Test erfolgreich (siehe TESTING.md)
- [ ] Token-Verbrauch pro Run < 4k
- [ ] CLAUDE.md ≤ 300 Zeilen
- [ ] Erstes echtes Angebot raus (Phase 4)
- [ ] Approval-Flow durchlaufen
- [ ] Real-Audit-Log enthält < 10 Sim-Events
- [ ] Repo-Größe < 200 MB

## Was kommt NACH der Migration

Wenn alles oben erfüllt, ist Firma OS v0.1 erfolgreich. Dann:

- **v0.2**: Mehrere Customers, Cohort-Reporting, MRR-Tracking
- **v0.3**: Multi-Agent in Production (Ruflo)
- **v1.0**: Multi-Tenancy für mehrere Firma-Owner (falls Belkis franchised)

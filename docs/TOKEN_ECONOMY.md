# Token Economy Plan

## Aktueller Verbrauch (Schätzung)

Per `weiter`-Run (ein Sim-Tag-Fortschritt):

| Quelle | Tokens | Anteil |
|--------|-------:|:------:|
| System-Reminder `state.json` (vollständige Datei) | 800 | 8% |
| System-Reminder `wallclock.json` | 250 | 2.5% |
| System-Reminder Dashboard `page.tsx` (vollständig) | 1.500 | 15% |
| Status-Block in Antwort | 600 | 6% |
| Day-X-Standup-Theater (6 Personen × 4 Zeilen) | 2.000 | 20% |
| 1 neues ADR (300 Zeilen Markdown) | 3.000 | 30% |
| Audit-Log-Generierung (5–8 entries als Python) | 1.500 | 15% |
| README/Status-Wiederholung in Mails | 350 | 3.5% |
| **Total pro Run** | **~10.000** | **100%** |

Hochrechnung über 30 `weiter`-Runs (typische 1-Monat-Nutzung):

**300.000 Tokens. Davon ~80% Waste = 240.000 Tokens weggeworfen.**

Bei aktuellen API-Preisen (Anthropic Opus): das sind nicht trivial.

## Konkrete Sparmaßnahmen

### M1 · System-Reminder reduzieren (~2.500 Tokens Einsparung)

Aktuell wird bei jedem Run die volle `state.json` + `wallclock.json` + ggf. `dashboard/page.tsx` reingeladen.

**Ziel:** Nur Delta-Diff seit letztem Run.

Implementation:
- `.firma/state.diff` hält das letzte committed Snapshot
- Reminder liest nur Diff
- `state.json` selbst bleibt klein (< 100 Zeilen JSON)

### M2 · CLAUDE.md kürzen 2.511 → 250 Zeilen (-90%)

Die alte CLAUDE.md hat alle Regeln im Detail. Die neue verweist auf Sub-Dateien.

**Ziel:** Bei Session-Start wird nur die neue CLAUDE.md geladen (~2.500 Tokens statt 25.000).

Einsparung pro Session-Start: **~22.500 Tokens**.

### M3 · Audit-Log nur für reale Events

Statt 5-8 Pseudo-Events pro Run (daily_standup, burnout_decay, wallclock_advance — alle Sim), nur reale:

- `customer_email_sent` (mit Approval-ID)
- `invoice_issued` (real Stripe)
- `code_deploy`
- `contract_signed`
- `approval_granted`

Reduziert Audit-Log-Generierung-Tokens von 1.500 auf ~150.

### M4 · Day-X-Standup-Theater abschaffen

Bisher: 6 simulierte Personen mit Gestern/Heute/Blocker.
Neu: Bei realer Arbeit → ein kurzer Plain-Sentence-Log.

Einsparung: **2.000 Tokens/Run**.

### M5 · ADRs verkürzen + extern lagern

Volle ADR (300+ Zeilen) gehört in `docs/architecture/` als statische Datei. Während eines `weiter`-Calls braucht nur ein 5-Zeilen-Diff geliefert zu werden.

Einsparung: **2.500 Tokens/ADR-Iteration**.

### M6 · rtk-ai/rtk Integration prüfen

[rtk-ai/rtk](https://github.com/rtk-ai/rtk) komprimiert wiederholte Kontexte und reduziert Token-Last bei langen Sessions.

**Use Case:**
- Wenn Belkis 50 `weiter`-Calls in einem Monat macht, sind die State-Reminders fast identisch
- rtk könnte das auf eine Referenz reduzieren

Status: P1 — Erkunden in Phase 3 der Migration.

### M7 · Dashboard statt Chat

Statt Belkis lange Mails schreiben + `weiter` tippen, soll sie meistens **das Dashboard nutzen**. Chat nur für:

- echte Entscheidungen (= Approvals)
- echte Fragen
- Eskalation

Token pro Approval-Click im Dashboard: **~0** (clientseitige UI).
Token pro „weiter" + 2.000-Token-Antwort: **10.000+**.

### M8 · Reports rendern statt schreiben

`weekly-status.md`, `quarterly-business-review.md`, etc. werden aus Templates + `state.json` gerendert, nicht Wort-für-Wort generiert.

Einsparung: jeweils **~2.000–5.000 Tokens pro Report**.

### M9 · Token-Budget pro Run als Hard-Cap

```yaml
# .firma/config.yaml
tokens:
  budget_per_run_default: 4000
  budget_per_run_hard_cap: 15000
  warn_at: 0.8
  agent_stops_at: 1.0
```

Wenn Agent 80% Budget erreicht → meldet Belkis: „brauche mehr Tokens oder Wechsel zu shorter mode".

### M10 · Token-Report Befehl

```bash
firma token-report --last 7d
```

Output (im Dashboard `/tokens` + als JSON):
- Top-10 token-frequente Aktionen
- Tokens pro Datei-Read
- Tokens pro Agent
- Verschwendungs-Indikatoren (z.B. „derselbe state.json wurde 47× geladen")

## Ziel-Metrik

| Metrik | Heute | Ziel | Reduktion |
|--------|------:|-----:|----------:|
| Tokens pro `weiter`-Run | ~10.000 | ~4.000 | -60% |
| Tokens pro Session-Start | ~25.000 | ~3.000 | -88% |
| Tokens pro Status-Bericht | ~2.000 | ~300 | -85% |
| Tokens pro ADR-Iteration | ~3.000 | ~500 | -83% |
| Audit-Log-Tokens pro Run | ~1.500 | ~150 | -90% |

## Umsetzung

| Maßnahme | Phase | Aufwand |
|----------|:-----:|---------|
| M1 Delta-Diff State | P2 | 4h |
| M2 Lean CLAUDE.md | **P1** | sofort (in diesem Audit) |
| M3 Audit nur real | P2 | 2h |
| M4 Theater abschaffen | **P1** | sofort |
| M5 ADRs auslagern | P2 | 4h |
| M6 rtk Integration | P3 | 1-2 Tage |
| M7 Dashboard statt Chat | P2 | 8h Dashboard-Verbesserung |
| M8 Report-Templates | P2 | 4h |
| M9 Token-Budget Hard-Cap | P2 | 2h |
| M10 Token-Report CLI | P2 | 3h |

**Gesamt-Aufwand für 60% Reduktion: ~30 Stunden über 2-3 Wochen.**

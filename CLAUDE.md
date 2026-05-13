# CLAUDE.md — Firma OS

> **Firma OS · v0.1** — Lean operating system for a 1-person AI-native software firm.
>
> **Lizenz:** Proprietär · alle Rechte vorbehalten · © 2026 Belkis Aslani · siehe [LICENSE](LICENSE).

## 1. Was ist Firma OS?

Eine schlanke, ehrliche Plattform, mit der eine 1-Person-Firma echte Software-Dienstleistungen verkauft und ausliefert. Kein Theater. Keine Simulation, die als Realität verkleidet wird.

Wer das Repo öffnet, soll in 10 Minuten verstehen:
- Was läuft gerade?
- Wo offene Entscheidungen?
- Wie generiere ich ein Angebot?
- Wo ist mein Geld real und wo ist es Plan?

## 2. Startregel

```bash
# Erste Inbetriebnahme
firma init                # legt .firma/state.json an + Onboarding-Wizard
firma start               # öffnet Dashboard auf localhost:3000
```

Bei normaler Nutzung reicht `firma start`.

## 3. Arbeitsmodus

- **Default:** Arbeite im Dashboard (`firma start`).
- **CLI:** für Status, Triage, Reports, Audits.
- **Chat (Claude Code):** nur für echte Entscheidungen oder kreative Arbeit. Kein automatisierter Sim-Loop.

## 4. Zentrale Wahrheit

Alles Real liegt in `.firma/`. Markdown nur für Lesbares. JSON/YAML für Zustand.

| Was | Wo |
|-----|----|
| Status | `.firma/state.json` (Schema mit klarer real/forecast-Trennung) |
| Konfiguration | `.firma/config.yaml` |
| Inbox | `.firma/inbox/` |
| Tickets | `.firma/tickets/<id>/` |
| Customers | `.firma/customers/<slug>/` |
| Finance Real | `.firma/finance/real/` (nur mit Beleg/API-Sync) |
| Finance Plan | `.firma/finance/forecast/` (klar als Plan markiert) |
| Approvals | `.firma/approvals/` |
| Audit | `.firma/audit.log` (nur reale Events, hash-chained) |
| Reports / PDFs | `.firma/reports/` |
| Agent-Specs | `.firma/agents/` |

Details: [`docs/STATE_MODEL.md`](docs/STATE_MODEL.md).

## 5. Kommandos

```
firma init               first-time setup wizard
firma start              start dashboard + watcher
firma status             one-line status
firma inbox              list inbox + new items
firma triage <file>      triage one inbox item
firma plan               next 7 days
firma run <agent>        run a specific agent
firma audit              repo audit
firma report <type>      generate PDF (quote, invoice, weekly, status)
firma approvals          list pending approvals
firma approve <id>       approve action
firma test               smoke tests
firma token-report       token usage
firma help, firma version
```

Spec: [`docs/CLI.md`](docs/CLI.md).

## 6. Human Approval (Hard-Stop)

**Kein externer Kontakt, kein Outreach, keine Domainregistrierung, kein Toolkauf, keine neue Ausgabe und keine Kommunikation im Namen des Inhabers ohne vorherige schriftliche Freigabe.**

Workflow:
1. Aktion erzeugt Eintrag in `.firma/approvals/pending/<id>.yaml`
2. Erscheint im Dashboard `/approvals`
3. Inhaber approved → `firma approve <id>` oder Dashboard-Button
4. Audit-Log: `approval_granted` + `action_executed`

Eskalation bei Verstößen: 1. = Correction Round, 2. = Internal-Quorum + SLA-Credit, 3. = Engagement-Termination.

## 7. Agenten

Default: 1 Agent (Claude Code), on-demand spezialisiert. Specs in `.firma/agents/`:

| Agent | Zweck | Token-Budget |
|-------|-------|-------------:|
| auditor | Repo/Commit/Chaos-Audit | 30k |
| ux-simplifier | UX-Vereinfachung | 20k |
| token-economy | Token-Verbrauch reduzieren | 15k |
| pricing | Pricing-Reviews | 15k |
| integration | Tool-Bewertungen | 20k |
| dashboard | Dashboard-Erweiterung | 25k |
| compliance | HITL, DSGVO, Datenschutz | 15k |
| devops-test | CI, Benchmarks, Scripts | 25k |

Aufruf: `firma run <agent> [--budget N] [--dry-run]`.

## 8. Dashboard

`firma start` → `localhost:3000`. 12 Seiten:

Home · Inbox · Tickets · Customers · Finance Real · Finance Forecast · Agents · Graph · Documents · **Approvals** · Tokens · Settings.

Mobile-tauglich. WCAG AA. Sim/Real klar getrennt. Spec: [`docs/DASHBOARD.md`](docs/DASHBOARD.md).

## 9. Token-Budget

- Default per Run: **4.000** Tokens.
- Hard-Cap: **15.000** Tokens.
- Bei 80% Budget: Agent warnt + fragt nach.
- `firma token-report` zeigt Verbrauch.

Plan: [`docs/TOKEN_ECONOMY.md`](docs/TOKEN_ECONOMY.md).

## 10. Datei-Regeln

- **Markdown** nur für Lesbares (Specs, Docs, Reports).
- **JSON/YAML** für Zustand.
- **SQLite** für Performance-Caches (optional).
- Keine `.md`-Datei > 500 Zeilen ohne klare Begründung.
- Reports werden gerendert (aus Templates), nicht handgeschrieben.

## 11. Finance / Pricing

Spec: [`docs/PRICING_PLAYBOOK.md`](docs/PRICING_PLAYBOOK.md).

- **Real-Daten** nur mit Beleg/API-Sync. Sonst `null`.
- **Forecast-Daten** klar gekennzeichnet.
- **Pakete A–E** als Standard-Verkaufsmodelle (1.5k–120k EUR).
- Verdient wird, wenn echte Rechnungen real bezahlt sind.

## 12. Kommunikation

- Inbox-Files in `.firma/inbox/` werden manuell oder via Mail-Hook erzeugt.
- Versand: nur via Approval-Center.
- Templates: in `.firma/templates/email/`.

## 13. Tests

```bash
firma test                 # alle Tests
firma test onboarding      # nur Onboarding
firma test tokens          # Token-Benchmark
firma test workflow        # Workflow-Schritte zählen
firma test safety          # Approval-Blocker testen
```

Plan: [`docs/TESTING.md`](docs/TESTING.md).

## 14. Was niemals automatisch passieren darf

- ❌ Externe Mail versenden ohne Approval
- ❌ Domain registrieren ohne Approval
- ❌ Tool/Subscription kaufen ohne Approval
- ❌ Code zu Production deployen ohne Approval
- ❌ Customer-Daten an Drittparteien ohne Approval
- ❌ Reale Bankstände in `state.json` schreiben ohne Beleg
- ❌ Forecast-Daten als real präsentieren

## 15. Erster Lauf

1. `firma init` — wizard fragt: Firmenname, Inhaber-Name, Brand-Farben, Tokens-Budget.
2. `firma start` — Dashboard geht auf, Onboarding-Tour empfohlen.
3. `firma inbox` (oder Dashboard `/inbox`) — erste Real-World-Mail triagieren.
4. `firma report quote` — erstes Angebot-PDF (sobald PDFCraft-Integration aktiv).
5. Bei erstem zahlenden Kunden: `firma report invoice`.

---

*Diese Datei bleibt unter 400 Zeilen. Detail-Spezifikationen leben in [`docs/`](docs/).*

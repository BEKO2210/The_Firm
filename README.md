# Firma OS

> Lean operating system for a 1-person AI-native software firm.

Ein schlankes Betriebssystem für eine Einzelperson, die mit KI-Unterstützung echte Software-Dienstleistungen verkauft. Kein Theater, kein Sim-Loop. Klar getrennt: was ist real, was ist Plan.

---

## Schnellstart

```bash
# 1. Repo klonen
git clone <repo-url>
cd <repo>

# 2. CLI verfügbar machen
chmod +x scripts/firma/firma.mjs
sudo ln -sf $(pwd)/scripts/firma/firma.mjs /usr/local/bin/firma   # optional

# 3. Initialisieren
firma init

# 4. Status anzeigen
firma status
```

## Was Firma OS ist

| | |
|---|---|
| **Zielgruppe** | Eine Einzelperson, die Software / KI-Dienste verkauft + ausliefert |
| **Größe** | Sehr klein. Eine `CLAUDE.md` (≤ 400 Zeilen). Repo unter 200 MB. |
| **Architektur** | `.firma/` als Single Source of Truth · CLI · Dashboard (Phase 2) |
| **Token-Budget** | Default 4.000 pro Run · Hard-Cap 15.000 |
| **Sicherheit** | Externe Aktionen brauchen explizite Freigabe |
| **Lizenz** | proprietär · alle Rechte vorbehalten · siehe [LICENSE](LICENSE) |

## Repo-Struktur

```
.
├── CLAUDE.md                        Top-level overview (kurz)
├── README.md                        diese Datei
├── docs/                            Architektur, Pricing, Roadmap, Testing
│   ├── RATIONALE.md                 warum es existiert
│   ├── ARCHITECTURE.md              wie es aufgebaut ist
│   ├── STATE_MODEL.md               .firma/ Datenmodell
│   ├── CLI.md                       vollständige CLI-Spec
│   ├── DASHBOARD.md                 Dashboard-Spec
│   ├── ROADMAP.md                   Aufbau-Phasen
│   ├── TESTING.md                   Tests & Benchmarks
│   ├── TOKEN_ECONOMY.md             Token-Verbrauch-Plan
│   ├── PRICING_PLAYBOOK.md          realistische Pakete
│   └── TOOL_RECOMMENDATIONS.md      externe Tools (PDFCraft, rtk-ai, ...)
├── .firma/                          State (init via `firma init`)
│   ├── state.json
│   ├── config.yaml
│   ├── agents/                      8 Agent-Specs
│   ├── inbox/  tickets/  customers/
│   ├── finance/{real,forecast,quotes}/
│   ├── approvals/{pending,decided}/
│   ├── reports/  tokens/  cache/
│   └── templates/
└── scripts/
    └── firma/firma.mjs              Single-file CLI
```

## Grundprinzipien

1. **Ehrlichkeit über Theater** — real vs. forecast immer klar getrennt.
2. **Dashboard ist die Wahrheit** — klicken statt schreiben.
3. **Einfachheit für Nicht-Techniker** — 10-Min-Onboarding-Test.
4. **Markdown nur für Lesbares** — Zustand in JSON/YAML.
5. **Externe Aktionen brauchen Approval** — Hard-Stop-Rule.
6. **Token-Budget pro Run** — Sparsamkeit by default.
7. **Single-Agent-Default** — Multi-Agent nur on demand.
8. **Reversibilität + Rollback** — alles im Audit-Log.
9. **Reale Wirtschaftlichkeit** — Pakete so kalibriert, dass verdient wird.
10. **Repo-Hygiene** — keine Datei ohne Zweck.

Details: [docs/RATIONALE.md](docs/RATIONALE.md).

## Erste Schritte nach `firma init`

1. `.firma/config.yaml` öffnen + Firmennamen + Inhaber-Name eintragen.
2. `firma status` — sollte deinen Firmennamen zeigen.
3. `firma help` — alle Kommandos sehen.
4. `docs/ROADMAP.md` lesen — was wann gebaut wird.

## Roadmap (kurz)

| Phase | Was | Status |
|------:|-----|:------:|
| 0 | Initial Architecture | ✅ |
| 1 | CLAUDE.md + State-Model + CLI v0.1 | ✅ |
| 2 | Dashboard MVP | ⏳ |
| 3 | Token-Optimierung (rtk-ai) | ⏳ |
| 4 | PDFCraft + erstes Angebot-PDF | ⏳ |
| 5 | Multi-Agent (Ruflo, optional) | später |
| 6 | Monetarisierung (echte Verkäufe) | laufend |

Vollständig: [docs/ROADMAP.md](docs/ROADMAP.md).

## Externe Tools (empfohlene Integrationen)

- **PDFCraft** — Angebot/Rechnung/Report PDFs (P0)
- **rtk-ai** — Token-Verbrauch reduzieren (P1)
- **graphify** — Beziehungs-Visualisierung im Dashboard (P1)
- **Ruflo** — Multi-Agent on demand (P2)

Vollständig: [docs/TOOL_RECOMMENDATIONS.md](docs/TOOL_RECOMMENDATIONS.md).

## Lizenz

**Proprietär · Alle Rechte vorbehalten · © 2026 Belkis Aslani.**

Firma OS ist kein Open-Source-Projekt. Keine Erlaubnis zur Nutzung, Modifikation, Verbreitung oder kommerziellen Verwendung ohne ausdrückliche schriftliche Genehmigung der Eigentümerin.

Für Lizenz-Anfragen + kommerzielle Nutzung: belkis.aslani@gmail.com.

Siehe [LICENSE](LICENSE) für vollen Text.

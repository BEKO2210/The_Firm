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
| 2 | Dashboard MVP (4 Seiten) **+ rtk-ai Integration + Benchmark** | ✅ |
| 3 | Tiefer Token-Sparen + Interpreted-CM-PoC | ⏳ |
| 4 | PDFCraft + erstes Angebot-PDF | ⏳ |
| 5 | MemPalace (persistentes Memory) | ⏳ |
| 6 | Ruflo (Multi-Agent live) | ⏳ |
| 7 | Monetarisierung tief | laufend |
| 8 | Erweiterungen (Graphify, agent-browser) | nach Bedarf |

Vollständig: [docs/ROADMAP.md](docs/ROADMAP.md) · Vision: [docs/INTEGRATION_BLUEPRINT.md](docs/INTEGRATION_BLUEPRINT.md).

## Externe Bausteine

**Core-Stack** (im Blueprint, Phase 2–6):

| Repo | Rolle | Phase |
|------|-------|:-----:|
| [rtk-ai/rtk](https://github.com/rtk-ai/rtk) | Token-Kompression + Context-Engineering | **2** |
| [Interpreted-Context-Methodology](https://github.com/RinDig/Interpreted-Context-Methdology) | strukturierter Reasoning-Layer | 3 |
| [MemPalace](https://github.com/MemPalace/mempalace) | persistentes Memory | 5 |
| [Ruflo](https://github.com/ruvnet/ruflo) | Multi-Agent-Orchestration | 6 |

**Daneben für direkten Wert:**

- [PDFCraft](https://github.com/PDFCraftTool/pdfcraft) — Angebots-/Rechnungs-PDFs (Phase 4)
- [graphify](https://github.com/safishamsi/graphify) — Beziehungs-Visualisierung (Phase 8)
- agent-browser, ViMax, ClawBot — Phase 8+

Detail: [docs/TOOL_RECOMMENDATIONS.md](docs/TOOL_RECOMMENDATIONS.md) · Architektur: [docs/INTEGRATION_BLUEPRINT.md](docs/INTEGRATION_BLUEPRINT.md).

## Lizenz

**Proprietär · Alle Rechte vorbehalten · © 2026 Belkis Aslani.**

Firma OS ist kein Open-Source-Projekt. Keine Erlaubnis zur Nutzung, Modifikation, Verbreitung oder kommerziellen Verwendung ohne ausdrückliche schriftliche Genehmigung des Eigentümers.

Für Lizenz-Anfragen + kommerzielle Nutzung: belkis.aslani@gmail.com.

Siehe [LICENSE](LICENSE) für vollen Text.

# Tool & Repo Benchmark

Bewertung externer Tools für Integration in Firma OS. Skala: P0 (sofort) → P3 (vielleicht später).

## Zusammenfassung

**Core-Stack** (im Blueprint, gestaffelter Rollout):

| Tool | Zweck | Phase | Priorität |
|------|-------|:-----:|:---------:|
| **rtk-ai/rtk** | Token-Reduktion, Kontext-Kompression | **2** | **P0** |
| **Interpreted-Context-Methodology** | Strukturierter Reasoning-Layer | 3 | P1 |
| **MemPalace** | Persistentes Memory | 5 | P1 |
| **ruvnet/ruflo** | Multi-Agent Orchestration | 6 | P2 |

**Direkter Wert (parallel):**

| Tool | Zweck | Phase | Priorität |
|------|-------|:-----:|:---------:|
| **PDFCraftTool/pdfcraft** | PDF-Generierung Angebote/Rechnungen | 4 | **P0** |

**Erweiterungen (nach Bedarf):**

| Tool | Zweck | Phase | Priorität |
|------|-------|:-----:|:---------:|
| **safishamsi/graphify** | Graph-Visualisierung Beziehungen | 8 | P1 |
| **vercel-labs/agent-browser** | UI-Test-Automation | 8 | P2 |
| **ClawBot / Kimi ClawBot** | GitHub-Repo-Audits | 8 | P2 |
| **HKUDS/ViMax** | Multimodal Vision Analyse | 8+ | P2 |
| **bytedance/deer-flow** | Multi-Agent Workflow | 8+ | P3 |
| **supertone-inc/supertonic** | Voice/Audio | später | P3 |
| **bytedance/UI-TARS-desktop** | Desktop-UI-Automation | optional | P3 |
| **screenpipe/screenpipe** | Lokale Screen-Aufzeichnung | ❌ | verworfen |
| **Link-Vault Belkis** | Curated Tool-Liste | sofort | scannen |

Vollständige Architektur: [INTEGRATION_BLUEPRINT.md](INTEGRATION_BLUEPRINT.md).

---

## 1. rtk-ai/rtk · **P0 · Phase 2** · Token-Kompression

**Zweck:** Context-Engineering / Reduktion-Toolkit für LLM-Apps. Cached & komprimiert redundante Kontexte.

**Use Case:** Bei jedem `firma`-Run werden gleiche State-Files gelesen. rtk pflegt einen „Context-Fingerprint" und sendet nur Deltas.

**Erwartete Einsparung:** 40-60% Tokens bei langen Sessions.

**Integration:** **Phase 2, parallel zum Dashboard MVP.** Adapter in `scripts/firma/token-cache.mjs`. Erst sofort sinnvoll, weil laufende Kosten direkt sinken.

**Risiken:**
- Korrektheits-Risiko: Cache-Invalidierung bei state.json-Updates muss sauber funktionieren
- Lock-in: gering, da rtk lokal läuft

**Aufwand für PoC:** 1-2 Tage. **Integration produktiv:** 1 Woche.

---

## 2. ruvnet/ruflo · P2 · **Phase 6** · Multi-Agent Orchestration

**Zweck:** Swarm-/Hierarchie-Agent-Framework. Memory, Routing, Multi-Agent-Koordination.

**Use Case:** Wenn Belkis mehrere parallele Workflows fährt (z.B. Lead-Akquise + Customer-Support + Code-Review), kann Ruflo Spezialagenten orchestrieren.

**Warum erst Phase 6:** Single-Agent (Claude Code) ist Default. Multi-Agent kommt erst, wenn echtes Volumen es rechtfertigt — frühestens nach MemPalace (Phase 5), damit die Agenten ein gemeinsames Gedächtnis haben.

**Risiken:**
- Komplexität-Explosion, wenn zu früh integriert
- Doppelte Tool-Aufrufe → Token-Mehrverbrauch

**Aufwand:** 1-2 Wochen für sinnvolle Integration.

---

## 2b. Interpreted-Context-Methodology · P1 · **Phase 3** · Reasoning-Layer

**Repo:** https://github.com/RinDig/Interpreted-Context-Methdology

**Zweck:** Strukturierter Reasoning-Layer über LLM-Calls. Macht Entscheidungs-Logik nachvollziehbar.

**Use Case:** Triage-Entscheidungen (Ticket-Typ, Priorität, Customer-Klassifikation) werden mit klarer Begründungs-Kette geloggt.

**Integration:** Phase 3 als PoC. Wenn der Mehrwert messbar ist (bessere Entscheidungen + Audit-Spur), produktiv übernehmen.

**Risiken:**
- Token-Mehrverbrauch durch strukturiertere Prompts → gegenrechnen mit rtk-ai
- Lernkurve

**Aufwand:** 1 Woche PoC.

---

## 2c. MemPalace · P1 · **Phase 5** · Persistentes Memory

**Repo:** https://github.com/MemPalace/mempalace

**Zweck:** Persistentes Memory über Sessions hinweg. Customer-, Ticket-, Entscheidungs-Wissen bleibt erhalten.

**Use Case:** „Was haben wir letzten Monat mit Customer X besprochen?" — direkt abrufbar.

**Integration:** Phase 5, wenn erste reale Customers existieren und sich Wiederholungs-Fragen häufen.

**Risiken:**
- Schema-Mapping zu `.firma/`-Strukturen muss klar sein
- Privacy: was darf ins Memory, was nicht (DSGVO!)

**Aufwand:** 1-2 Wochen.

---

## 3. vercel-labs/agent-browser · P2 · UI-Test-Automation

**Zweck:** Browser-Agent für Web-Automation, Tests, UI-Interaktionen.

**Use Case:** Smoke-Tests des Dashboards. Automatisierte Click-Through-Tests von Customer-Demos.

**Integration:** Phase 4, wenn Dashboard stabil läuft.

**Risiken:**
- Externe Aktionen (=> Approval Center nötig)
- Browser-Side-Effects

**Aufwand:** 2-3 Tage für Smoke-Test-Setup.

---

## 4. safishamsi/graphify · P1 · Graph-Visualisierung

**Zweck:** Knowledge-Graph- und Beziehungs-Visualisierung.

**Use Case:** `/graph`-Seite im Dashboard zeigt:
- Customer ↔ Tickets ↔ Engagements ↔ Invoices
- Agent ↔ Datei ↔ Audit-Eintrag
- Dependencies zwischen Komponenten

**Integration:** Phase 2-3. Graphify kann auf bestehende `.firma/`-Files draufgesetzt werden.

**Risiken:**
- Visualisierungs-Overhead (Performance bei vielen Nodes)
- Lernen muss man die Lib

**Aufwand:** 3-5 Tage für nützliche Graph-View.

---

## 5. bytedance/UI-TARS-desktop · P3 · Desktop-Automation

**Zweck:** Desktop-Steuerung über GUI durch KI.

**Verdict:** Overkill für Firma OS v0.1. Belkis braucht eher ein gutes Browser-Dashboard als KI-gesteuerten Desktop.

**Status:** Aufgeschoben.

---

## 6. PDFCraftTool/pdfcraft · **P0** · PDF-Generierung

**Zweck:** PDF-Erstellung für Angebote, Rechnungen, Verträge, Reports.

**Use Case (sofort verkaufbar!):**
- Angebot-PDF an Salon-Lead generieren
- Rechnungs-PDF für ersten Kunden erstellen
- Status-PDF für Monatsbericht

**Integration:** **Sofort.** Auf Discovery-v2-Inhalt anwenden, daraus 1-Seiter „Angebot Salon-Webseite Starter" rendern.

**Aufwand:** 1-2 Tage für Template + Integration in `firma report`-CLI.

**Risiken:**
- Template-Pflege
- Lizenz-Check (PDFCraft Lizenz prüfen)

**Geschäftswert:** Direkt — kein Angebot-PDF, kein Verkauf.

---

## 7. HKUDS/ViMax · P2 · Multimodal

**Zweck:** Vision/Multimodal-Analyse.

**Use Case:** Salon-Bilder analysieren, UI-Screenshots reviewen, Mockup-zu-Code-Pipeline.

**Integration:** Phase 3+ wenn UX-Iterations-Velocity es rechtfertigt.

**Aufwand:** 1 Woche für ersten Use Case.

---

## 8. screenpipe/screenpipe · **P3** ❌ · NICHT empfohlen

**Zweck:** Lokale Aktivitäts- und Screen-Aufzeichnung.

**Verdict:** **Datenschutz-Risiko + DSGVO-Komplikationen.** Wenn Belkis auf Kunden-Daten arbeitet und die werden aufgezeichnet, ist das ein Verarbeitungs-Vorgang, der DSGVO-konform geregelt werden müsste.

**Status:** Verwerfen.

---

## 9. bytedance/deer-flow · P2 · Multi-Agent Workflow

**Zweck:** Research+Execution Flows mit mehreren Agenten.

**Use Case:** Kombination mit Ruflo möglich. Aber: separater Stack zu evaluieren.

**Integration:** Phase 5, gemeinsam mit Ruflo entscheiden.

**Aufwand:** 1-2 Wochen Evaluation.

---

## 10. supertone-inc/supertonic · P3 · Voice

**Zweck:** Voice-Synthese, Audio-Anwendungen.

**Verdict:** Nicht MVP-relevant. Salon-Owner buchen lieber per Web als per Voice-Bot.

**Status:** Aufgeschoben auf Phase 7+.

---

## 11. ClawBot / Kimi ClawBot · P1 · Repo-Audits

**Zweck:** Automatisierte Repo-Audits, GitHub-Workflow-Checks.

**Use Case:** Würde dieses Audit (RATIONALE.md) automatisieren — quartalsweise.

**Integration:** Phase 2-3. Erst die manuelle Audit-Pipeline festigen, dann automatisieren.

**Aufwand:** 2-3 Tage.

---

## 12. Belkis Link-Vault · **P0** · Sofort scannen

**URL:** https://beko2210.github.io/link-vault/

**Zweck:** Belkis' eigene kuratierte Tool-Sammlung. Vermutlich gold.

**Action:** Manuell scannen (Belkis' Auswahl ist relevant), nächste Iteration mit Priorisierung.

**Aufwand:** 1h manuell + 2-4h für Top-5-Tools tiefer evaluieren.

---

## Priorisierungs-Empfehlung (Reihenfolge der Integration)

| # | Tool | Phase | Warum |
|:-:|------|:-----:|-------|
| 1 | **rtk-ai** | **2** | Token-Verbrauch reduzieren = laufende Kosten senken, sofort |
| 2 | **Interpreted-CM** | 3 | Strukturierter Reasoning-Layer, nachvollziehbare Entscheidungen |
| 3 | **PDFCraft** | 4 | Direkter monetärer Wert: Angebot-PDFs an Leads |
| 4 | **MemPalace** | 5 | Persistentes Memory, wenn reale Customers existieren |
| 5 | **Ruflo** | 6 | Multi-Agent, nur bei Volumen |
| 6 | **Graphify** | 8 | Dashboard-Wert (`/graph`-Seite) |
| 7 | **agent-browser** | 8 | UI-Tests |
| 8 | **ClawBot** | 8 | Audit-Automatisierung |
| 9 | **ViMax** | 8+ | bei UX-/Multimodal-Bedarf |
| 10 | **deer-flow** | 8+ | mit Ruflo gemeinsam |
| 11 | **supertonic** | später | Voice (nicht MVP) |
| 12 | **UI-TARS-desktop** | optional | Desktop-Automation |
| 13 | **screenpipe** | ❌ | DSGVO-Risiko, verworfen |

## Konkrete erste Integration (Phase 2): rtk-ai

```bash
# 1. Repo clonen, lokal evaluieren
git clone https://github.com/rtk-ai/rtk tools/rtk

# 2. Adapter
scripts/firma/token-cache.mjs

# 3. CLI nutzt Cache transparent
firma run --use-rtk

# 4. Token-Report vor/nach
firma token-report --period week
```

**Erwartetes Ergebnis:** 40-60 % Token-Einsparung bei Routine-Runs, messbar im Token-Report.

# Tool & Repo Benchmark

Bewertung externer Tools für Integration in Firma OS. Skala: P0 (sofort) → P3 (vielleicht später).

## Zusammenfassung

| Tool | Zweck | Priorität | Sofort sinnvoll? |
|------|-------|:---------:|:----------------:|
| **rtk-ai/rtk** | Token-Reduktion, Kontext-Kompression | P1 | ja, Phase 3 |
| **ruvnet/ruflo** | Agent-Orchestration, Swarm | P2 | später (Phase 5) |
| **vercel-labs/agent-browser** | UI-Test-Automation, Web-Agenten | P2 | wenn Dashboard läuft |
| **safishamsi/graphify** | Graph-Visualisierung Beziehungen | P1 | ja, für /graph-Seite |
| **bytedance/UI-TARS-desktop** | Desktop-UI-Automation | P3 | overkill |
| **PDFCraftTool/pdfcraft** | PDF-Generierung Angebote/Rechnungen | **P0** | **ja, direkt monetarisierbar** |
| **HKUDS/ViMax** | Multimodal Vision Analyse | P2 | bei Bild/Mockup-Reviews |
| **screenpipe/screenpipe** | Lokale Screen-Aufzeichnung | P3 ❌ | nein, Datenschutz-Risiko |
| **bytedance/deer-flow** | Multi-Agent Workflow | P2 | mit Ruflo bewerten |
| **supertone-inc/supertonic** | Voice/Audio | P3 | nicht MVP |
| **ClawBot / Kimi ClawBot** | GitHub-Repo-Audits | P1 | ja, automatisiert Audits |
| **Link-Vault Belkis** | Curated Tool-Liste | **P0** | **ja, sofort scannen** |

---

## 1. rtk-ai/rtk · P1 · Token-Kompression

**Zweck:** Context-Engineering / Reduktion-Toolkit für LLM-Apps. Cached & komprimiert redundante Kontexte.

**Use Case:** Bei jedem `firma`-Run werden gleiche State-Files gelesen. rtk könnte einen „Context-Fingerprint" pflegen und nur Deltas senden.

**Erwartete Einsparung:** 40-60% Tokens bei langen Sessions.

**Integration:** Phase 3. Vorab: rtk-Repo lesen, Beispiel-Setup verstehen, Quick-PoC in `scripts/firma/token-cache.mjs`.

**Risiken:**
- Korrektheits-Risiko: Cache-Invalidierung bei state.json-Updates muss sauber funktionieren
- Lock-in: gering, da rtk lokal läuft

**Aufwand für PoC:** 1-2 Tage. **Integration produktiv:** 1 Woche.

---

## 2. ruvnet/ruflo · P2 · Agent-Orchestration

**Zweck:** Swarm-/Hierarchie-Agent-Framework. Memory, Routing, Multi-Agent-Koordination.

**Use Case:** Wenn Belkis mehrere parallele Workflows fährt (z.B. Lead-Akquise + Customer-Support + Code-Review), kann Ruflo Spezialagenten orchestrieren.

**Warum erst P2:** Aktuell ist Single-Agent (Claude Code) ausreichend. Multi-Agent-Setup nur nach Validierung der Single-Agent-Workflows.

**Integration:** Phase 5 der Migration.

**Risiken:**
- Komplexität-Explosion, wenn zu früh integriert
- Doppelte Tool-Aufrufe → Token-Mehrverbrauch

**Aufwand:** 1-2 Wochen für sinnvolle Integration.

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

## Priorisierungs-Empfehlung (was als nächstes integrieren)

| Reihenfolge | Tool | Warum |
|:-----------:|------|-------|
| 1 | **PDFCraft** | Direkter monetärer Wert: Angebot-PDFs an Leads |
| 2 | **Link-Vault scannen** | Mehr Klarheit über Belkis' Toolchain |
| 3 | **rtk-ai** | Token-Verbrauch reduzieren = laufende Kosten senken |
| 4 | **Graphify** | Dashboard-Wert |
| 5 | **ClawBot** | Audit-Automatisierung |
| 6 | **Ruflo** | erst bei wachsender Komplexität |
| 7 | **agent-browser** | UI-Tests |
| 8 | **ViMax** | bei UX-Bedarf |
| 9 | **deer-flow** | mit Ruflo gemeinsam |
| 10 | **supertonic** | später |
| 11 | **UI-TARS-desktop** | optional |
| 12 | **screenpipe** | nein |

## Konkrete erste Integration (Phase 1)

**PDFCraft:**

```bash
# 1. Repo clonen, lokal evaluieren
git clone https://github.com/PDFCraftTool/pdfcraft tools/pdfcraft

# 2. Template-Datei für Salon-Angebot
.firma/templates/quote-salon-website.html

# 3. CLI-Integration
firma report quote --template salon-website --data quote-data.yaml --out reports/QT-2026-001.pdf

# 4. Smoke-Test: ein echtes Angebot-PDF rendern
firma test pdf
```

Erwartetes Ergebnis: Angebot-PDF, das Belkis an Leads schicken kann (nach Approval).

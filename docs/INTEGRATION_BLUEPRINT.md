# Firma OS · Integration Blueprint

> **Wie aus 4 OSS-Bausteinen + Claude Code + dem `.firma/`-State ein vollständiges Multi-Agent-System wird.**

Dieses Dokument beschreibt den Core-Stack von Firma OS und wie die externen Bausteine ineinandergreifen — von Anfang an, nicht erst „später".

---

## Die 4 Core-Bausteine

Firma OS steht auf vier OSS-Säulen, die **gemeinsam** das machen, was sonst Frameworks wie Roflow oder LangGraph leisten — nur leichter, modularer und für eine 1-Person-Firma kalibriert.

| # | Baustein | Repo | Rolle in Firma OS |
|---|----------|------|-------------------|
| 1 | **rtk-ai/rtk** | https://github.com/rtk-ai/rtk | **Token + Context Engineering** — komprimiert wiederkehrende Kontexte, hält Token-Budgets ein |
| 2 | **Interpreted Context Methodology** | https://github.com/RinDig/Interpreted-Context-Methdology | **Strukturierter Reasoning-Layer** — gibt jeder Situation eine maschinell interpretierbare Struktur, bevor Agenten reagieren |
| 3 | **MemPalace** | https://github.com/MemPalace/mempalace | **Persistentes Memory** — langfristige Erinnerung über Sessions, Kunden, Tickets hinweg |
| 4 | **Ruflo** | https://github.com/ruvnet/ruflo | **Multi-Agent Orchestration** — Routing, Hierarchie, Swarm-Koordination |

Zusammen ergeben sie genau die Schicht, die ein KI-System braucht, um nicht jedes Mal von Null anzufangen.

---

## Architektur-Schichtung

```
┌─────────────────────────────────────────────────────────────┐
│  LLM-Layer · Claude API (oder kompatibel)                    │
└─────────────────────────────────┬───────────────────────────┘
                                  │ prompts + tool calls
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│  CORE-STACK · die 4 Bausteine                                │
│                                                              │
│  ┌─────────────┐  ┌──────────────────┐  ┌──────────────┐    │
│  │  rtk-ai     │  │ Interpreted-     │  │  MemPalace   │    │
│  │  Token-     │  │ Context-Methodo. │  │  Long-term   │    │
│  │  Kompres-   │  │ Strukturierte    │  │  Memory      │    │
│  │  sion       │  │  Interpretation  │  │  + Recall    │    │
│  └─────┬───────┘  └────────┬─────────┘  └──────┬───────┘    │
│        │                   │                    │            │
│        └─────── Context-Bus (Firma OS-eigen) ──┘            │
│                                  │                          │
│  ┌───────────────────────────────▼──────────────────────┐  │
│  │              Ruflo · Agent-Orchestration              │  │
│  │  auditor · pricing · compliance · ux-simplifier ·    │  │
│  │  token-economy · integration · dashboard · devops    │  │
│  └───────────────────────────────┬──────────────────────┘  │
└──────────────────────────────────┼──────────────────────────┘
                                   │ commits + reads + approvals
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│  .firma/ · Single Source of Truth                            │
│  state.json · config.yaml · inbox · tickets · customers ·    │
│  finance · approvals · agents · audit · reports · memory     │
└─────────────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│  Dashboard (Next.js)  ·  CLI (firma)  ·  Approvals UI       │
└─────────────────────────────────────────────────────────────┘
```

---

## Was jeder Baustein konkret tut

### 1. rtk-ai/rtk · Token + Context Engineering

**Problem es löst:**
Jeder LLM-Call sendet typischerweise denselben Kontext (system prompt, state, Historie) erneut. Das kostet 60-80% der Tokens.

**Was rtk leistet:**
- Context-Fingerprinting (hash + diff)
- Selektive Wiederverwendung statt Vollast
- Token-Budget-Tracking pro Call
- Kompressions-Heuristiken für lange Kontexte

**Wo integriert in Firma OS:**

```
.firma/cache/rtk/
  ├── context-fingerprints.json    welche Kontexte schon gesehen
  ├── diffs/                       Delta-Updates statt Vollkontext
  └── budget-tracker.jsonl         pro Run + pro Agent
```

CLI-Befehl:
```
firma token-report              zeigt rtk-Metriken
firma cache prune --older 30d   bereinigt alten Cache
```

### 2. Interpreted-Context-Methodology · Strukturierter Reasoning-Layer

**Problem es löst:**
Agenten reagieren oft direkt auf rohen Text/Input. Das ist fehleranfällig: derselbe Inbox-Brief kann anders verstanden werden, je nach Tagesform.

**Was die Methodology leistet:**
- Jede Situation wird vor Agent-Action strukturiert interpretiert:
  - Was ist die Anfrage genau?
  - Welche Entitäten sind beteiligt?
  - Welche Constraints gelten?
  - Welche Aktionen sind möglich/verboten?
- Diese strukturierte Interpretation wird **persistiert** (in `.firma/interpretations/`)
- Agenten arbeiten auf der Interpretation, nicht auf dem Rohtext

**Wo integriert in Firma OS:**

```
.firma/interpretations/
  ├── inbox/<filename>.icm.json         pro Inbox-Item: strukturierte Interpretation
  ├── tickets/<id>.icm.json
  └── approvals/<id>.icm.json
```

Beispiel-Workflow:

1. Inbox-Mail kommt rein.
2. `firma triage <file>` → ICM-Modul interpretiert → strukturierte JSON.
3. Agent (z.B. `pricing`) liest die ICM-JSON, nicht den Rohtext.
4. Output bleibt nachvollziehbar: man kann sehen, **wie** die Mail interpretiert wurde, bevor reagiert wurde.

### 3. MemPalace · Persistentes Memory

**Problem es löst:**
Ohne Memory startet jeder Agent-Run von Null. Konversationen mit Kunden, Vorlieben, vergangene Fehler — alles weg.

**Was MemPalace leistet:**
- Strukturierte Langzeit-Erinnerung über Sessions
- Memory-Trees pro Customer, pro Ticket, pro Topic
- Retrieval mit Relevanz-Scoring
- Verfall + Re-Validation (vergessene Erinnerungen verfallen)

**Wo integriert in Firma OS:**

```
.firma/memory/
  ├── palaces/
  │   ├── customers/<slug>.json    pro Kunde: Historie, Vorlieben, Notizen
  │   ├── projects/<id>.json
  │   └── lessons/<topic>.json     gelernte Lektionen aus Postmortems
  └── index.sqlite                 schneller Retrieval-Index
```

Jeder Agent, der einen Customer berührt, lädt das Memory-Palace zu diesem Customer **bevor** er antwortet. Antworten werden mit `memory.recall(customer="salon-mariposa", topic="pricing")` informiert.

CLI:
```
firma memory show <topic>
firma memory forget <id>     # für DSGVO-Löschungen
firma memory revalidate      # quartalsweise Pflege
```

### 4. Ruflo · Multi-Agent Orchestration

**Problem es löst:**
Single-Agent-Setups stoßen an Grenzen, sobald mehrere Workflows parallel laufen müssen (Lead-Triage + Code-Review + Customer-Support gleichzeitig).

**Was Ruflo leistet:**
- Agent-Routing (welcher Agent für welche Aufgabe)
- Swarm- und Hierarchie-Patterns
- Inter-Agent-Communication
- Globale Token-Budgets

**Wo integriert in Firma OS:**

```
.firma/agents/
  ├── *.md                         8 Agent-Specs
  ├── orchestration.yaml           Ruflo-Routing-Regeln
  └── runs/<run-id>/               pro Multi-Agent-Run: Logs + Outputs
```

Ruflo-Konfig in `.firma/agents/orchestration.yaml`:
```yaml
mode: hybrid                     # single | swarm | hierarchy | hybrid
default_routing: by-capability
shared_state: .firma/state.json
shared_memory: .firma/memory/
shared_context_bus: .firma/cache/rtk/

triggers:
  - on: inbox.new
    route_to: [interpreted-context, then auditor]
  - on: ticket.create
    route_to: [pricing, compliance]
  - on: approval.requested
    route_to: [compliance, then human]
```

---

## Der Context-Bus zwischen den 4 Bausteinen

Die 4 Tools sind nicht voneinander unabhängig. Sie teilen Daten über einen kleinen **Context-Bus**, der in Firma OS lebt:

```
                      ┌─────────────────────────┐
                      │   Context-Bus            │
                      │  .firma/cache/bus.json   │
                      └────┬───┬───┬───┬────────┘
                           │   │   │   │
            ┌──────────────┘   │   │   └────────────┐
            │                  │   │                │
            ▼                  ▼   ▼                ▼
       rtk-ai          Interpreted-CM    MemPalace      Ruflo
       (komprimiert    (interpretiert    (erinnert     (orchestriert)
        Context)        Context)          Context)
```

Konkret: Wenn der `pricing`-Agent ausgeführt wird:

1. **Ruflo** wählt ihn anhand der Aufgabenklassifikation.
2. **Interpreted-CM** liefert die strukturierte Situation (z.B. „Kunde fragt nach Friseur-MVP, Budget < €30k").
3. **MemPalace** liefert relevante Erinnerungen (z.B. „Dieser Kunde hat vor 3 Monaten Variante B abgelehnt").
4. **rtk-ai** komprimiert all das zu einem schlanken Prompt, der ins LLM geht.
5. Agent antwortet, Ergebnis fließt zurück in alle 4 Stores.

---

## Aufbau in Phasen (überarbeitete Roadmap)

**Entscheidung (Praktisch):** Wir bauen nicht alle 4 von Anfang an. Wir staffeln nach **erkennbarem Nutzen**:

| Phase | Inhalt | Bausteine | Begründung |
|------:|--------|-----------|------------|
| 0 | Initial Architecture | ✅ done | |
| 1 | CLAUDE.md + State + CLI v0.1 | ✅ done | |
| **2** | **Dashboard MVP + rtk-ai Integration** | **rtk-ai** | Direkt monetärer Effekt: jeder gesparte Token spart Geld ab Tag 1 |
| 3 | Token-Optimierung tief + Interpreted-CM-PoC | rtk-ai voll, Interpreted-CM minimal | strukturierte Triage hilft, sobald > 5 Tickets parallel |
| 4 | PDFCraft + erstes Angebot | (PDF daneben) | direkt verkaufsrelevant |
| 5 | MemPalace einbauen | + MemPalace | sobald 3+ Kunden mit Historie existieren |
| 6 | Multi-Agent live | + Ruflo | sobald > 3 parallele Workflows pro Tag |
| 7 | Monetarisierung tief | — | laufend |
| 8 | Tool-Erweiterungen | Graphify, agent-browser | nach Bedarf |

**Faustregel:** Ein Baustein wird integriert, wenn:
- sein **konkreter Nutzen** in der aktuellen Arbeitslast spürbar wäre, **und**
- die **Integration ≤ 5 Sim-Tage** Aufwand kostet, **und**
- du **explizit zustimmst** (Hard-Stop-Rule gilt auch für „neue Abhängigkeit").

---

## Phase 2 Minimum (was wirklich gebaut wird, sobald du Go gibst)

Nur ein Baustein kommt sofort: **rtk-ai**. Begründung: spart Token-Geld ab Tag 1, ohne Workflow-Umbau.

| Baustein | Phase-2-Minimum |
|----------|-----------------|
| **rtk-ai** | Context-Fingerprint für `.firma/state.json` (Diff statt Vollast) + Token-Counter im Dashboard |
| Interpreted-CM | nicht in Phase 2 — Hooks werden im Code vorbereitet (1-Liner-Stub), echte Integration in Phase 3 |
| MemPalace | nicht in Phase 2 — `.firma/memory/`-Verzeichnis wird angelegt, Inhalt kommt mit Phase 5 |
| Ruflo | nicht in Phase 2 — `.firma/agents/orchestration.yaml` als leeres Stub, Inhalt mit Phase 6 |

Das ist die **schlanke Variante**: ein klar messbarer Mehrwert pro Phase, kein vorgezogenes Komplexitäts-Investment.

---

## Wie das System mit Claude Code zusammenarbeitet

Claude Code ist nicht ersetzt — es ist der **Default-Agent-Runner**. Was Firma OS hinzufügt:

- Vor jedem Call: Context-Bus liefert komprimierten, interpretierten, memory-angereicherten Kontext.
- Nach jedem Call: Output wird in Memory + State geschrieben, Audit-Log + Token-Tracker aktualisiert.
- Bei Multi-Agent-Aufgaben: Ruflo dispatcht an die richtige Spezial-Agent-Spec, die ihrerseits Claude Code als Backend nutzt.

→ Du arbeitest weiterhin mit Claude Code. Aber Claude Code arbeitet mit deutlich besserem Kontext und braucht weniger Tokens.

---

## Sicherheit + DSGVO

Alle 4 Bausteine laufen **lokal** (auf deiner Maschine oder deinem Server). Keine SaaS-Anbindung nötig.

- rtk-ai: lokales Caching
- Interpreted-CM: lokal angewandt
- MemPalace: lokale SQLite + JSON
- Ruflo: lokale Prozess-Orchestration

Bei DSGVO-Löschung eines Kunden:
```
firma customer forget <slug>
```
löscht Memory-Palace, Interpretationen, Tickets, Audit-Pseudonymisierung — alles in einem.

---

## Erweiterungen über die 4 Bausteine hinaus

Sobald der Core-Stack steht, können die anderen Tools aus [TOOL_RECOMMENDATIONS.md](TOOL_RECOMMENDATIONS.md) sauber andocken:

- **PDFCraft** für Angebote/Rechnungen (P0 monetarisierungs-relevant)
- **Graphify** für Beziehungs-Visualisierung im Dashboard
- **agent-browser** für UI-Smoke-Tests
- **ViMax** für Multimodal-Inputs (Mockups, Screenshots)
- **deer-flow** als Alternative/Ergänzung zu Ruflo (later)

---

## Vergleich zu Frameworks wie Roflow / LangGraph

| Anspruch | Roflow / LangGraph | Firma OS |
|----------|--------------------|----------|
| Multi-Agent | ✅ | ✅ via Ruflo |
| Memory | teils | ✅ via MemPalace |
| Strukturierter Context | nein | ✅ via Interpreted-CM |
| Token-Bewusstsein | nein | ✅ via rtk-ai |
| .firma/-State-Modell | nein | ✅ Single Source of Truth |
| Dashboard + CLI für Endnutzer | nein | ✅ first-class |
| Approval-Center (Human-in-Loop) | nein | ✅ Hard-Stop-Rule |
| Lokal-only / DSGVO | abhängig | ✅ vollständig lokal |
| 1-Person-Optimiert | nein | ✅ |

Firma OS ist **kein Konkurrent** zu Roflow oder LangGraph — es ist eine **engere, fokussierte Schicht oben drauf**, die genau auf die Anforderungen einer 1-Person-AI-Native-Firma zugeschnitten ist.

---

## Nächste Schritte konkret

Phase 2 startet mit (in dieser Reihenfolge, je 1-3 Tage):

1. **rtk-ai cloning + PoC** — `firma cache test` zeigt Fingerprint-Hits
2. **MemPalace-Skelett** — `.firma/memory/palaces/` initial, 1 Kunde anlegen
3. **Interpreted-CM-Schema** — Inbox-Triage-Wizard nutzt erste ICM-JSON
4. **Ruflo-Routing-Stub** — `.firma/agents/orchestration.yaml` mit 2 Triggern
5. **Dashboard-Anbindung** — 4 neue Seiten im Dashboard: `/cache`, `/interpretations`, `/memory`, `/agents/runs`
6. **CLI-Erweiterung** — `firma cache`, `firma memory`, `firma interpret <file>`, `firma run <agent>`

Aufwand insgesamt für Phase 2: 7–14 Sim-Tage Real-Arbeit (deine Verfügbarkeit + Tool-Reifegrad).

---

## Lizenz-Hinweis

Die 4 Core-Bausteine haben ihre eigenen Open-Source-Lizenzen (jeweils im Upstream-Repo zu prüfen). Firma OS **integriert** sie, **verändert** sie nicht. Eigene Anpassungen werden in `tools/<name>/firma-adapter/` gehalten — nur dieser Adapter-Code fällt unter die proprietäre Firma-OS-Lizenz.

Bei Lizenz-Konflikten (z.B. Copyleft-AGPL in einem Baustein): vorrangig **nicht integrieren** oder Lizenz-Anwalt einbeziehen vor Einbau.

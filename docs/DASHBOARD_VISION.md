# Dashboard-Vision · Mission Control

> **Status:** Planungsdokument für Iteration B. Noch nicht gebaut.
> Dieses Dokument ergänzt [`DASHBOARD.md`](DASHBOARD.md) (die 12-Screen-Spec) um
> die **Herzstück-Vision**: das Dashboard wird die zentrale Oberfläche, über die
> *alles* sichtbar und steuerbar ist — ohne CLI, ohne Datei-Ablegen, bedienbar
> auch ohne technisches Wissen.

## 1. Leitsatz

> Wer das Dashboard öffnet, sieht in **einem Blick**: was läuft gerade, was wird
> getan, was kommt als Nächstes, wo steht das Geld, wo wartet eine Entscheidung.
> Jede Arbeit, jeder Vorgang, jeder Status — eine Oberfläche.

Das Dashboard ist nicht *ein* Werkzeug neben CLI und Chat. Es ist **die**
Steuerzentrale. CLI bleibt für Automation/Scripting, Chat für echte
Entscheidungen — aber der Mensch arbeitet im Dashboard.

## 2. Anerkannte Design-Standards (Recherche)

Die Vision folgt etablierten Mustern, keine Eigenerfindung:

| Prinzip | Quelle / Standard | Konsequenz für Firma OS |
|---------|-------------------|--------------------------|
| **Single Pane of Glass** | NOC-/Operations-Dashboard-Praxis | *Eine* Fläche verdichtet alle `.firma/`-Quellen zu einem Live-Bild |
| **Transparenz-Layer** | Agent-UX-Prinzipien 2026 (Reasoning sichtbar, nicht nur Output) | JETZT-Feed zeigt *was* ein Agent tut + *warum*, nicht nur das Ergebnis |
| **Timeline-Visualisierung** | Temporal Workflow Timeline View | Horizontales Ereignisband: sequenziell, mit Fehler-/Retry-Markern |
| **Echtzeit via SSE** | Real-Time-Event-Infrastruktur (WebSocket/SSE) | Statusänderung in Sekunden sichtbar, kein manuelles Reload |
| **Informations-Hierarchie (3 Tiers)** | KPI-Dashboard-Best-Practices | Tier 1: 5 North-Star-Zahlen · Tier 2: Spalten · Tier 3: Drilldowns |
| **KPI-Karten-Schema** | KPI-Card-Standard *Label → Wert → Δ → Zeitraum* | Jede Kennzahl-Karte identisch aufgebaut, Ampel grün/gelb/rot |
| **„Less is more"** | Dashboard-Design-Best-Practices (max ~9 Views/Screen) | Mission Control hat genau 5 Zonen, Rest sind Drilldowns |
| **Human-in-the-Loop-Inbox** | AI-Agent-Orchestration-Dashboards (Kernview) | Approvals + untriagierte Inbox-Items prominent in NÄCHSTES |

## 3. Die neue Home-Seite — „Mission Control"

Eine scrollbare Fläche, fünf Zonen. ASCII-Wireframe (Desktop):

```
┌──────────────────────────────────────────────────────────────────────┐
│  ● Firma OS · Belkis Aslani          [Home][Inbox][…]   2026-05-14   │  Header (existiert)
├──────────────────────────────────────────────────────────────────────┤
│ ZONE 1 · STATUS-ZEILE (Tier-1 North-Star, 5 KPI-Karten)              │
│ ┌────────────┐┌────────────┐┌────────────┐┌────────────┐┌──────────┐ │
│ │Kontostand  ││Offene      ││Tickets     ││Approvals   ││Token-    │ │
│ │real        ││Angebote €  ││offen       ││wartend  🔴 ││Budget    │ │
│ │ 4.200 €    ││ 2.225 €    ││    3       ││    1       ││ 38 %     │ │
│ │ ▲ +500 7d  ││ ▲ +2.225   ││ ▬ 0        ││ ! Aktion   ││ ▬ heute  │ │
│ └────────────┘└────────────┘└────────────┘└────────────┘└──────────┘ │
├──────────────────────────────────────────────────────────────────────┤
│ ZONE 2 · DREI SPALTEN                                                │
│ ┌─────────────────┐┌─────────────────┐┌─────────────────────────────┐│
│ │ JETZT           ││ NÄCHSTES        ││ LETZTES                     ││
│ │ (Live-Feed)     ││ (Aktion nötig)  ││ (abgeschlossen)             ││
│ │                 ││                 ││                             ││
│ │ ▸ Agent auditor ││ 🔴 Approval #12 ││ ✓ QT-…001 gerendert         ││
│ │   läuft · 1.2k  ││   Outreach Mail ││ ✓ Ticket T-04 → done        ││
│ │ ▸ inbox/maria…  ││ ⚠ inbox: 2 neu  ││ ✓ Triage maria-kessler      ││
│ │   triagiert     ││ ▸ plan: 3 Tasks ││ ✓ bench:pdfa PASS           ││
│ │ ▸ state.json    ││   nächste 7 Tg  ││                             ││
│ │   geschrieben   ││ ⏳ QT-…001 läuft││  [mehr …]                   ││
│ │                 ││   ab in 28 Tg   ││                             ││
│ └─────────────────┘└─────────────────┘└─────────────────────────────┘│
├──────────────────────────────────────────────────────────────────────┤
│ ZONE 3 · VERTRIEBS-PIPELINE (Funnel mit Anzahl + €)                  │
│  Inbox ──▶ Triage ──▶ Angebot ──▶ Rechnung ──▶ Bezahlt               │
│   2         1          1 (2.225€)   0           0                     │
├──────────────────────────────────────────────────────────────────────┤
│ ZONE 4 · TIMELINE-BAND (audit.log, farbcodiert, Fehler/Retry sichtbar)│
│  ├──●────●──────●──✕──●────────●──▶  (heute)                          │
│    09:0  10:3   11:4 12:0  12:1                                       │
├──────────────────────────────────────────────────────────────────────┤
│ ZONE 5 · VIER-SÄULEN-HEALTH                                          │
│ ┌──────────┐┌──────────┐┌──────────┐┌──────────────────────────────┐ │
│ │Vertrieb🟢││Compliance││Operations││Wirtschaftlichkeit            │ │
│ │1 Angebot ││🟢 Audit  ││🟡 2 Inbox││🟡 Runway aus Real-Daten      │ │
│ │offen     ││ok, PDF/A ││untriagrt ││  noch nicht berechenbar      │ │
│ └──────────┘└──────────┘└──────────┘└──────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

Mobile: Zonen stapeln vertikal, Zone 2 wird zu Tabs (JETZT / NÄCHSTES / LETZTES).

### Zonen im Detail

**Zone 1 · Status-Zeile** — 5 KPI-Karten, jede nach Schema *Label → Wert → Δ →
Zeitraum*, Ampelfarbe. Quelle: `state.json` (real-Block) + abgeleitete Zählungen.
Karte ist anklickbar → führt zur Detail-Seite. `null`-Werte zeigen
„nicht angebunden" statt einer erfundenen Zahl (Hard-Regel aus CLAUDE.md §14).

**Zone 2 · JETZT / NÄCHSTES / LETZTES** — das Herz.
- **JETZT** — Live-Feed der laufenden/jüngsten Ereignisse aus `audit.log`.
  Zeigt *was* passiert (Agent-Run, Datei-Schreibvorgang, Triage) — mit
  Transparenz: bei Agent-Runs auch das Token-Budget + der Zweck.
- **NÄCHSTES** — alles, was Aufmerksamkeit braucht: wartende Approvals (🔴, ganz
  oben), untriagierte Inbox-Items, `firma plan`-Tasks der nächsten 7 Tage,
  Angebote die bald ablaufen. Jede Zeile mit GUI-Aktion (Approve, Triagieren …).
- **LETZTES** — abgeschlossene Vorgänge der letzten 24-48 h. Gibt Ruhe + Beleg
  („das ist erledigt").

**Zone 3 · Vertriebs-Pipeline** — visueller Funnel. Macht sofort sichtbar, wo
Geld feststeckt: viele Angebote, keine Rechnungen = Nachfass-Problem.
Quelle: `.firma/inbox/`, `.firma/tickets/`, `.firma/finance/quotes/`,
`.firma/finance/real/`.

**Zone 4 · Timeline-Band** — horizontaler Zeitstrahl der `audit.log`-Events des
Tages. Farbcodiert nach Typ (Agent-Run, Datei, Approval, Render). Fehler/Retry
als ✕-Marker. Hover → Detail. Beantwortet „was lief, was hakte".

**Zone 5 · Vier-Säulen-Health** — je eine Ampel-Kachel für die vier Säulen einer
realen Firma (CLAUDE.md-Vision): **Vertrieb · Compliance · Operations ·
Wirtschaftlichkeit**. Verdichtet den Gesamtzustand auf vier Signale.

## 4. Die Detail-Seiten bleiben — als Drilldowns

Inbox, Approvals, Tokens, Tools, Reports (und später Tickets, Customers, Finance,
Agents …) bleiben wie in [`DASHBOARD.md`](DASHBOARD.md) spezifiziert. **Neu:** Jede
Karte und jede Feed-Zeile auf Mission Control ist anklickbar und führt in die
passende Detail-Seite. Mission Control ist die Übersicht, die Detail-Seiten sind
die Tiefe.

## 5. Alles GUI-steuerbar — kein CLI-Zwang

Leitprinzip des Inhabers: **nutzbar auch ohne technisches Wissen.** Jede Aktion,
die heute CLI oder Datei-Ablegen verlangt, bekommt einen GUI-Pfad:

| Heute (CLI / Datei) | Künftig (GUI) |
|----------------------|---------------|
| Datei in `.firma/inbox/` ablegen | Button „+ Inbox-Item" → Formular / Datei-Upload / Text-Paste |
| `firma triage <file>` | „Triagieren"-Button am Inbox-Item → Wizard (Ticket / Reply / Archiv / Spam) |
| `firma approve <id>` | „Approve" / „Reject"-Button + Notizfeld auf der Approval-Karte |
| `firma report quote …` | „Angebot erstellen"-Wizard → Formular → PDF-Download |
| `firma plan` | NÄCHSTES-Spalte zeigt es automatisch |
| `firma status` | Mission Control *ist* der Status |

Schreibvorgänge laufen über **Next.js Server Actions** (existiert schon im Stack),
die nach `.firma/` schreiben. Jeder Schreibvorgang erzeugt einen `audit.log`-
Eintrag → erscheint sofort im JETZT-Feed. Externe Aktionen (Mail, Domain, Kauf)
bleiben hinter dem **Approval-Hard-Stop** (CLAUDE.md §6) — der GUI-Button erzeugt
nur den Approval-Eintrag, sendet nichts.

## 6. Technische Grundlage

- **Server Components** lesen `.firma/` schon direkt — bleibt so.
- **Server Actions** für alle Schreibvorgänge (Inbox anlegen, triagieren,
  approven, Report triggern).
- **`audit.log` als Event-Quelle** — hash-chained JSONL (das ist die
  ursprüngliche Iteration C). Jedes reale Ereignis wird dort angehängt. JETZT-Feed
  + Timeline-Band lesen daraus. → **Iteration C zieht nach vorn und wird B.1.**
- **SSE-Endpoint** (`/api/events`) + File-Watcher auf `.firma/` — pusht
  Änderungen ins Dashboard, kein Polling-Reload.
- Kein neuer Stack, keine neue DB. Alles bleibt Filesystem + Next.js.

## 7. Implementierungsplan — B.1 bis B.5

Geschnitten so, dass nach **jedem** PR etwas Sichtbares im Dashboard ist.

### B.1 · Audit-Log als Event-Quelle (Daten-Fundament)
- `.firma/audit.log` als **hash-chained JSONL** (SHA-256 prev-hash pro Zeile).
- Writer-Helper `lib/audit.mjs` — alle realen Events (Agent-Run, Datei-Schreiben,
  Triage, Approval, Render) hängen an.
- `firma audit chain --verify` — Kette validieren.
- Smoke-Test für Append + Verify.
- *Sichtbar:* noch nichts im GUI, aber `firma audit` zeigt die Kette.

### B.2 · Mission-Control-Layout (statisch)
- Home-Seite neu: Zone 1 (Status-Zeile) + Zone 2 (JETZT/NÄCHSTES/LETZTES),
  zunächst aus vorhandenen Quellen + `audit.log` server-side gerendert.
- KPI-Karten-Komponente nach Standard-Schema.
- *Sichtbar:* die neue Oberfläche steht, Daten aktualisieren sich beim Reload.

### B.3 · Live (SSE + Timeline)
- `/api/events` SSE-Endpoint + File-Watcher auf `.firma/`.
- JETZT-Feed + Status-Zeile aktualisieren sich ohne Reload.
- Zone 4 · Timeline-Band aus `audit.log`.
- *Sichtbar:* das Dashboard „lebt" — Änderungen erscheinen in Sekunden.

### B.4 · GUI-Aktionen (kein CLI-Zwang mehr)
- Server Actions: Inbox-Item anlegen (Formular/Upload/Paste), triagieren,
  Approval approve/reject, Report-Wizard.
- Jede Aktion schreibt nach `.firma/` + `audit.log`.
- *Sichtbar:* die Inbox + Approvals sind voll über das GUI bedienbar.

### B.5 · Pipeline-Funnel + Vier-Säulen-Health
- Zone 3 · Vertriebs-Pipeline (Funnel mit Anzahl + €).
- Zone 5 · Vier-Säulen-Health-Kacheln.
- *Sichtbar:* Mission Control ist vollständig.

Jeder Schritt: eigener Branch, eigener Draft-PR, voller System-Test
(`npm run test:smoke` + `bench:*` + `website build`) grün vor dem Commit.

## 8. Was dieses Dokument NICHT festlegt

- Konkrete Farb-/Pixel-Werte — das entsteht beim Bauen, WCAG 2.1 AA bleibt Pflicht
  (axe-core-Benchmark aus Iteration A.2 wacht darüber).
- Den genauen `audit.log`-Event-Schema-JSON — wird in B.1 mit der Implementierung
  festgelegt und in [`STATE_MODEL.md`](STATE_MODEL.md) dokumentiert.
- Reihenfolge gegenüber anderen Phasen — Iteration B läuft, sobald der Inhaber
  dieses Dokument freigibt.

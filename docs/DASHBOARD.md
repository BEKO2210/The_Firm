# Dashboard Specification (Firma OS)

## Ziel

Eine zentrale GUI, die ein Nicht-Techniker in 10 Minuten verstehen + bedienen kann. Web-basiert, läuft lokal (`firma start` → `localhost:3000`). Später optional deploybar.

## Stack-Entscheidung

**Wiederverwendung des bestehenden `website/`-Next.js-Stacks**, aber:
- Anbindung an `.firma/state.json` (real) statt simulierte 50-MA-Daten
- Klare Sim/Real-Trennung pro Seite
- Mobile-tauglich (Belkis arbeitet auch vom Phone)

## Screens

### 1. `/` Home / Today

**Inhalt:**
- Begrüßung: „Hallo Belkis, heute ist [Datum]."
- 3 Karten: „Approvals offen" / „Inbox neu" / „Tickets aktiv"
- 3 Karten: „Heute zu tun" (aus `.firma/plan/today.yaml`)
- Token-Verbrauch heute (Gauge)
- Big-Button: „Was möchtest du machen?" → Wizard mit 5 Optionen (Lead bearbeiten, Angebot machen, Status reviewen, Code committen, Pause)

**Datenquelle:** `.firma/state.json` + `.firma/inbox/` + `.firma/approvals/` + `.firma/tickets/`

### 2. `/inbox`

**Inhalt:**
- Liste eingegangener Mails + Files (aus `.firma/inbox/`)
- Triage-Status pro Item: new / in_progress / done / parked
- Click → Detail-View mit Triage-Wizard (Make ticket / Reply / Archive / Mark spam)

**Quelle:** `.firma/inbox/*.md` (mit YAML-Frontmatter)

### 3. `/tickets`

**Inhalt:**
- Open / In-Progress / Blocked / Done Spalten (Kanban)
- Pro Ticket: Customer, Type, Effort, Quote, Status
- Filter: customer, type, status
- Click → `tickets/<id>/` Detail mit Aktivitäts-Stream

**Quelle:** `.firma/tickets/<id>/ticket.yaml`

### 4. `/customers`

**Inhalt:**
- Lead → Qualified → Customer Pipeline (3-Spalten)
- Pro Customer: Name, Last contact, Open quotes, Open invoices, MRR (real!)
- Click → Customer-Profil mit Historie

**Quelle:** `.firma/customers/<slug>/profile.yaml`

### 5. `/finance/real`

**Inhalt:**
- Big Banner: „🟢 ECHTE DATEN — Stand [Sync-Datum]"
- Cash on hand (manuell oder via Banking-API)
- Revenue Monat (aus realen Invoices)
- Costs Monat (aus realen Expenses)
- Runway (real)
- MRR (Maintenance-Customers)

**Quelle:** `.firma/finance/real/*.jsonl`

### 6. `/finance/forecast`

**Inhalt:**
- Big Banner: „📊 PLAN-DATEN — keine echten Beträge"
- 3-/6-/12-Monats-Forecast
- Was-wäre-wenn-Szenarien

**Quelle:** `.firma/finance/forecast/*.yaml`

### 7. `/agents`

**Inhalt:**
- Liste verfügbarer Agent-Specs (aus `.firma/agents/`)
- Aktive Runs + Token-Verbrauch + Status
- Button: „Run Agent" → Wizard mit Auswahl + Token-Budget

**Quelle:** `.firma/agents/*.md` + `.firma/agents/runs/*.json`

### 8. `/graph`

**Inhalt:**
- Beziehungsgraph: Customers ↔ Tickets ↔ Agents ↔ Docs
- Filter: Zeitraum, Customer
- Click auf Node → Detail-Drawer

**Quelle:** abgeleitet aus state.json + tickets/ + customers/
**Tool:** [graphify](https://github.com/safishamsi/graphify) (P1-Integration)

### 9. `/documents`

**Inhalt:**
- Generierte Reports, Angebote, Rechnungen (PDFs)
- Filter: type, customer, date
- Click → Vorschau + Download

**Quelle:** `.firma/reports/*.pdf` + Metadata-YAML

### 10. `/approvals` 🔴 wichtigste Seite

**Inhalt:**
- Pending Approvals oben (groß, mit Risk-Pill, Cost, Description)
- Pro Approval: „Approve" / „Reject" Button + Note-Feld
- Decided: History (read-only)

**Quelle:** `.firma/approvals/*.yaml`

**Regel:** Externe Aktionen warten auf diese Approvals — siehe Hard-Stop-Rule.

### 11. `/tokens`

**Inhalt:**
- Heutiger Verbrauch (Gauge gegen Budget)
- Top-10 Verbraucher-Events
- Trend 7d / 30d
- Empfehlungen (z.B. „Datei X wird zu oft geladen")

**Quelle:** `.firma/tokens/spend.jsonl`

### 12. `/settings`

**Inhalt:**
- Token-Budget setzen
- Integrations aktivieren (Stripe, Resend, Supabase, Graphify, PDFCraft)
- Approval-Policy editieren
- ENV-Variables (Schreibschutz, mit „Edit"-Button)

**Quelle:** `.firma/config.yaml`

## UI-Prinzipien

- **Dark Mode default** (Belkis hat aktuell #0F172A/#3B82F6 Brand) — bleibt
- **WCAG AA minimum** (war im alten System schon Standard)
- **Mobile-first** für die ersten 3 Screens (Home, Inbox, Approvals)
- **Keine Sim-Daten ohne Banner**
- **Jeder Real-Datenpunkt hat einen Sync-Timestamp**

## Konkrete erste Iteration (Phase 2 Migration)

Was zuerst gebaut wird:

1. `/` Home mit echten Daten aus `.firma/state.json` v2
2. `/inbox` mit Triage-Wizard
3. `/approvals` mit Approve/Reject
4. `/tokens` mit Gauge

Das reicht für Firma OS v0.1. Andere Seiten in Folge-Iterationen.

## Tech-Stack

Nahezu identisch zu altem `website/`:
- Next.js 15 / React 19 / Tailwind 4 / shadcn/ui
- File-system reads aus `../.firma/` (server-side, in lib/)
- Optional: Drizzle für eine kleine SQLite (`.firma/cache.sqlite`) für Token-Tracking
- Optional später: Stripe API für echte Finanzdaten

## Wichtig

Dashboard zeigt **nie** automatisch eine €2.35M Bank, weil die nicht existiert. Wenn `real.bank_eur` null ist, zeigt es: „Kein Bankkonto angebunden — [Anbinden]-Button → Settings".

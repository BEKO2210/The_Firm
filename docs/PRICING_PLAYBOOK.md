# Finance & Pricing Review

**Frage:** Verdient Belkis mit dem aktuellen System Geld, oder nur die Sim-Firma?

## 1. Aktuelle (Sim-)Finanzlage — Realität-Check

| Posten in state.json | Wert (Sim) | Realer Status |
|----------------------|-----------:|---------------|
| Bank | €2.350.042 | **Existiert nicht** (kein Geschäftskonto eröffnet) |
| Monatlicher Burn | €572.695 | **Existiert nicht** (50 Sim-Mitarbeiter haben keine Gehälter) |
| AR offen | €0 | korrekt |
| USt-Verbindlichkeit | €9.462 | **Existiert nicht** (keine echte Rechnung) |
| Runway | 4.10 Monate | **Bedeutungslos** ohne echtes Geld |

**Was Belkis bisher real ausgegeben hat:**

- Claude-Code-API-Tokens (vermutlich €10–80, je nach Plan)
- Zeit für ~10 Sim-Tage Chat
- **kein Hosting, kein Tool-Abo, keine Domain**

**Was Belkis real eingenommen hat:**

- €0

## 2. Welche Gehälter / Rollen sind simuliert?

Alle 50. CEO, CTO, CFO, DPO, 24 Maker, etc. — niemand davon existiert. Die Gehaltstabelle (`hr/salary-bands.md`, €469k/Monat Payroll) ist 100% Fiktion.

**Realer Zustand:** 1 Mensch (Belkis) + KI-Assistent.

## 3. Was wäre bei echter Firma realistisch?

Für eine 1-Person-AI-Native-Beratung in Stuttgart:

| Posten | Realer Monatsbetrag |
|--------|---------------------:|
| Gehalt Belkis (Mindest-Entnahme) | €3.500–6.500 brutto-äquivalent |
| Krankenversicherung (KSK falls qualifiziert, sonst privat) | €450–900 |
| Renten-/Sozialvorsorge | €400–800 |
| Tools (Claude Pro, GitHub, Cursor, etc.) | €100–300 |
| Hosting (für Demos, kein Salon-Kunde) | €0–50 |
| Buchhaltungs-Software (Lexware/sevdesk) | €15–50 |
| Steuerberater | €100–300 |
| **Realistischer Monatsbedarf** | **€4.500–8.900** |

**Diese Zahlen gehören in `state.json` unter `real.monthly_costs_eur`**, nicht die €572k-Sim.

## 4. Was darf nicht als echter Kontostand dargestellt werden?

**Hard Rule:** `state.json.real.bank_eur` darf nur befüllt werden, wenn:
1. Geschäftskonto eröffnet
2. API-Anbindung an Bank-API (Finapi, GoCardless, etc.) oder manueller Eintrag mit Beleg
3. Audit-Log-Eintrag `real_bank_sync` mit Quellen-Referenz

Sonst bleibt der Wert `null`.

## 5. Realer Kundenpreis-Aufbau

### 5.1 Faustregel für Service-Pricing (1-Person-Firma + KI-Unterstützung)

```
Verkaufspreis = (Echte Stunden × Stundensatz) × (1 + Marge) + Direktkosten
```

| Komponente | Belkis 2026 (Empfehlung) |
|------------|--------------------------|
| Echte Stunden | konservativ schätzen, +30% Buffer |
| Stundensatz Belkis (intern für Kalkulation) | €60–90 (was Belkis sich pro Stunde gut hinhalten kann) |
| Stundensatz verkauft | €120–250 (je nach Komplexität + Wert für Kunden) |
| Marge | 20–40% bei Software, 50–70% bei Beratung |
| Direktkosten | Hosting, Lizenz-Anteile, ggf. Subkontraktoren |

### 5.2 Realistische Pakete (das, was Belkis morgen anbieten kann)

#### Paket A · Salon-Webseite Starter — **€1.500–3.500**

- Responsive Webseite (5 Seiten: Home, Services, Team, Galerie, Kontakt)
- Buchungs-Widget (Calendly/SimplyBook eingebettet, kein Eigenbau)
- Domain + Hosting für 12 Monate inkl.
- Branding-Beratung 2h
- 1 Iterationsrunde nach Launch

Aufwand: 8–20 Stunden. Marge: 60–75%.

#### Paket B · Salon-Buchungs-App Single-Tenant — **€15.000–35.000**

- Eigene Buchungs-Webseite + Admin-Dashboard
- Slot-Engine (aus Spezifikation aufbauen!)
- Postgres + Drizzle + Next.js
- Multi-Mitarbeiter
- E-Mail-Erinnerungen
- DSGVO-Basis

Aufwand: 4–8 Wochen. Marge: 40–55%.

#### Paket C · Multi-Tenant SaaS — **€60.000–120.000**

- Was die alte Discovery v2 als „Premium MVP" beschrieb — aber **realer Preis**
- 1 Salon Pilot + erste Mandantenstruktur
- DPIA, AVVs, SOC-2-Ready-State (nicht zertifiziert)
- 12 Wochen Build + Harden

Aufwand: 12–20 Wochen. Marge: 25–40%.

#### Paket D · Maintenance — **€150–800/Salon/Monat**

| Tier | Preis | Inklusive |
|------|------:|-----------|
| Basic | €150 | Hosting, Backups, 1× Bugfix/Mo |
| Pro | €400 | + Email-Versand, kleine Features, Telefon-Support 2h |
| Premium | €800 | + Reporting-Anpassungen, monatlicher Review-Call, On-Call P1 |

Aufwand pro Salon: 1–4 Std/Monat. Marge: 70–85%.

#### Paket E · KI-Beratungs-Stunde — **€120–250/Std**

- Konfiguration von Claude-Code-Setup für andere Firmen
- Prompt-Engineering-Sessions
- Code-Reviews mit KI-Lens
- Audit-Workshops

Aufwand: direkt 1:1. Marge: 80%+.

## 6. Welche Maintenance-Preise sind verkaufbar?

Vergleich Markt 2026 in DACH:

| Anbieter | Preis/Salon/Mo |
|----------|---------------:|
| Treatwell SaaS | €0 (taking commission) |
| Booksy | €19.99 + Add-ons |
| Setmore | €0–25 |
| Fresha | €0 (taking %) |
| Eigener Salon-Anbieter (custom) | €150–800 |

**Realer Marktpreis** für eigen-gehostete Lösung in DACH: **€150–500/Salon/Mo**, ohne %-Cut auf Buchungen.

Die Sim-Welt-Zahl **€12.000/Monat Retainer** war für 1 Plattform absolut überdimensioniert.

## 7. Welche Marge braucht Belkis?

Damit Belkis bei 4-8k€/Mo Lebenshaltungs-Bedarf realistisch leben kann:

- Mindestens **2 zahlende Kunden in Paket B** (15k×2 = 30k einmalig) **+ 8-10 Paket-D-Salons** (€2k–4k/Mo wiederkehrend)
- Oder: **3-5 Paket-A-Webseiten/Quartal** (€7.5k–17.5k Quartalsumsatz)
- Oder: **10–15 KI-Beratungs-Std/Woche** (€4.8k–10k/Mo)

Erfolgs-Schwelle: **€5.000/Monat netto-Marge**. Realistisch in 3–6 Monaten bei aktiver Akquise.

## 8. Welche Leistungen kann man paketieren?

| Paket | Trigger | Upsell-Pfad |
|-------|---------|-------------|
| „Salon-Online-in-7-Tagen" (Webseite + Buchungs-Widget) | Erst-Lead | → Buchungs-App nach 6 Mo |
| „DSGVO-Audit für Salons" (3h Workshop + Report) | nervige Compliance | → Maintenance-Vertrag |
| „KI für Friseure: 1-Tag-Workshop" | Interesse, kein Budget | → Beratungs-Stunden |

## 9. Was soll die Firma als erstes verkaufen?

**Realistische 90-Tage-Roadmap:**

| Woche | Ziel | Output |
|-------|------|--------|
| 1-2 | Webseite mit Angebot, eigene Marke | salonio.de (oder Wahl) — eine Landing-Page mit den 5 Paketen |
| 3-4 | 5 Cold-Outreach-Tests mit Belkis-Approval | nach Hard-Stop-Rule der INC-Standards-Patch |
| 5-6 | 1 Salon-Demo + 1 Angebot-PDF | mit PDFCraft |
| 7-10 | 1 Salon als Kunde gewinnen | Paket A oder B |
| 11-12 | Pilot starten | echtes Engagement → echtes Ticket im System |

**Realistische Ziel-Umsätze:**

- Monat 1: €0
- Monat 2: €1.500 (1 × Paket A Anzahlung)
- Monat 3: €5.000 (1 × Paket A komplett + 1 × Paket D start)
- Monat 6: €8.000–15.000/Mo
- Monat 12: €15.000–30.000/Mo (sustained)

## 10. Klare Trennung zwischen real / geplant / simuliert / Beispiel / Angebot / interne Kalkulation

**Vorschlag für Datenstruktur:**

```
.firma/finance/
  real/
    bank-snapshots.jsonl       (nur mit Beleg/API-Sync, manuell oder automatisch)
    invoices.jsonl             (Stripe-IDs oder echte Rechnungsnummern)
    expenses.jsonl             (Buchhaltungs-Export)
  forecast/
    monthly-plan.yaml          (geplanter Burn / Umsatz pro Monat, klar als Plan markiert)
    scenarios.yaml             (lean / standard / premium-Szenarien)
  quotes/
    QT-2026-001.pdf           (Angebot an Kunde, generiert via PDFCraft)
    QT-2026-001.yaml          (Quote-Daten als YAML für Re-Render)
  examples/
    sample-pricing.md         (Beispielrechnungen, klar als „nur Demo")
```

Dashboard:
- `/finance/real` zeigt nur `real/*`
- `/finance/forecast` zeigt nur `forecast/*` mit großem „PLAN — KEINE ECHTEN DATEN"-Banner
- Niemals mischen.

## 11. Konkrete Empfehlung für Belkis

1. **Lösche die €2.35M aus dem Dashboard.** Setze `real.bank_eur = null` bis du es manuell/per API einträgst.
2. **Nimm die alte Discovery v2 als Verkaufs-Whitepaper** für potenzielle Kunden — der Inhalt ist gut, nur der Preis war fiktiv.
3. **Setze realistische Pakete A–E** auf eine echte Landing-Page.
4. **Plane Akquise** mit Hard-Stop-Rule (Outreach-Text-Approval).
5. **Erster echter Kunde** in 4–6 Wochen Realzeit, nicht Sim-Zeit.
6. **Stripe-Account** eröffnen, damit überhaupt etwas eingehen kann.

## 12. Bottom-Line

Das alte System hat Belkis €59.262 „Rechnung" für Discovery + Planung verkauft. Wenn das real wäre, wäre Belkis pleite, ohne dass eine Zeile produktionsfähige Software entstanden ist.

Das neue System soll:
- Belkis helfen, **echte €15.000-Aufträge** zu verkaufen
- mit **realistischer Marge** (40–60% bei Software, 70%+ bei Beratung)
- bei **realer Lieferung** (Code, nicht Spezifikation)
- in **klarer Buchführung** (Real vs Plan vs Beispiel)

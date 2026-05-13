---
document: "Maintenance & Operations Agreement"
ticket: "TCK-20260513-0001"
parent: "MSA"
version: "1.0 — Draft"
status: "SIGNED · 2026-05-13 (effective from Release v1.0)"
signed_principal: "2026-05-13 (lawyer-reviewed)"
signed_firm: "2026-05-13 (CFO Niko Korhonen countersigned)"
language: "de"
effective_from: "Release v1.0 / Milestone M10 (Day 140 sim)"
monthly_fee_eur: 12000
---

# Maintenance- & Betriebs-Vereinbarung

> ⚠️ **Dieser Vertrag wurde durch KI erstellt.** Anwaltliche Prüfung empfohlen.

Anlage 4 zum MSA · TCK-20260513-0001

---

## § 1 Vertragsgegenstand

Korynth Labs erbringt für den Auftraggeber laufende Wartungs- und Betriebsleistungen für die Friseur & Beauty Booking SaaS-Plattform, beginnend mit der Abnahme Release v1.0 (Meilenstein M10).

## § 2 Eingeschlossene Leistungen (Retainer-Umfang)

Für €12.000 / Monat netto:

### 2.1 Betrieb & Monitoring

- Hosting-Monitoring (Vercel, Supabase, weitere Subprocessors)
- Uptime-Verfügbarkeitsziel: **99,9 % pro Kalendermonat**
- Incident-Response 24/7 für P0/P1 (Definition § 4)
- Wöchentliche Backup-Verifikation
- Monatliche Disaster-Recovery-Drills (gemäß CLAUDE.md §29.2)

### 2.2 Sicherheit

- Tägliches Dependency-Scanning (Snyk + Renovate)
- Monatliche Sicherheits-Updates für Production
- Quartalsweise Security-Reviews
- Pen-Test alle 12 Monate (extern; bei größerem Funktionszuwachs auf Anfrage öfter, gegen Aufpreis)

### 2.3 Bug-Fixes

- **P0 (Production Down)**: Antwort < 1 h, Fix < 4 h
- **P1 (Major Feature Broken)**: Antwort < 4 h, Fix < 24 h
- **P2 (Minor Feature Broken)**: Antwort < 24 h, Fix < 1 Sprint (2 Wochen)
- **P3 (Cosmetic)**: in einer der nächsten 3 Sprint-Releases

### 2.4 Kleine Feature-Inkremente

- Bis zu **8 Inkremente pro Monat à max. 4 Stunden** Aufwand inklusive
- Größere Features: separates SOW erforderlich (Phase 2 / Phase 3 etc.)

### 2.5 Compliance-Pflege

- Pflege der DSGVO-Dokumentation (VVT, AVVs)
- Reaktion auf Anfragen betroffener Personen (Art. 15–22 DSGVO)
- Jährliche DSGVO-Audits (intern + extern unterstützend)
- Compliance-Updates bei Gesetzesänderungen (z. B. EU AI Act-Erweiterungen)

### 2.6 Reporting

- **Wöchentlich**: Status-Briefing (1 Seite) + 60–90 min Status-Slot
- **Monatlich**: schriftlicher Monatsbericht mit Verfügbarkeit, Incidents, Bug-Fixes, Spend gegen Cap, geplanten Inkrementen
- **Quartalsweise**: QBR mit Plattform-Metriken (Mandanten, Buchungen, Umsatz-Indikatoren, NPS)

### 2.7 Operative Begleitung

- Onboarding-Begleitung neuer Pilot-Salons (1 Salon pro Quartal inklusive)
- Schulung Salon-Owner (max. 2 Stunden pro Salon inklusive)
- Customer-Success-Reviews bei NPS-Risiko-Salons

## § 3 Nicht eingeschlossen (separate Beauftragung)

- **Phase 2 Features** (native Apps, Online-Zahlung, KI-Optimierung) → eigenes SOW
- **Größere Feature-Inkremente** (> 4 h pro Inkrement, > 8 Inkremente / Monat)
- **Major Releases / Migrations** mit Schema-Breaking-Änderungen
- **Onboarding von > 1 Salon pro Quartal** (zusätzlich €1.500 pro Salon)
- **Außerhalb-Geschäftszeiten-Schulungen / Trainings**
- **Eigene Marketing-Kampagnen / SEO-Optimierung**
- **Externe Audits** (Pen-Test ist 1× / Jahr inklusive; zusätzliche werden separat berechnet)

## § 4 Incident-Klassifikation

| Klasse | Definition | Antwort | Fix |
|--------|------------|---------|-----|
| **P0** | Plattform produktiv nicht erreichbar / Doppelbuchung tritt auf / Datenleak | < 1 h | < 4 h |
| **P1** | Major Feature broken (z. B. Buchung schlägt fehl, Email-Versand down) | < 4 h | < 24 h |
| **P2** | Minor Feature broken (z. B. Reporting-Chart fehlt, Storno-Email-Template falsch) | < 24 h | < 2 Wochen |
| **P3** | Kosmetisch (Typo, Layout-Issue ohne Funktionsbeeinträchtigung) | < 1 Woche | next 3 Sprints |

## § 5 Vergütung

(1) **€12.000 / Monat netto** zzgl. USt., zahlbar monatlich nachschüssig zum 15. des Folgemonats.

(2) Tooling-Kosten der Subprocessor (Supabase, Vercel, Resend, etc.) werden separat 1:1 weiterbelastet, oder du übernimmst die Verträge direkt (empfohlen, gemäß IP-Assignment § 6).

(3) Über-Kapazitäts-Stunden (> 32 h kleine Inkremente / Monat) werden zu Premium-Tier-Stundensätzen abgerechnet, vorab schriftlich abgestimmt.

## § 6 Laufzeit & Kündigung

(1) Beginn: mit Abnahme Release v1.0.

(2) Mindestlaufzeit: **12 Monate** (sichert Investitionsschutz für beide Seiten in der Stabilisierungsphase nach Launch).

(3) Nach 12 Monaten: monatlich kündbar mit **3 Monaten Frist zum Quartalsende**.

(4) Außerordentliche Kündigung gemäß § 8 MSA (z. B. wiederholte SLA-Verstöße trotz Mahnung).

## § 7 Service Level Agreements (SLA)

### 7.1 Verfügbarkeit

- **99,9 % pro Kalendermonat**, gemessen über externes Uptime-Monitoring (Better Stack)
- Maximum-zulässige Downtime pro Monat: ~44 Minuten
- Bei Unterschreitung: 5 % Service-Credit für den betroffenen Monat
- Wiederholte Unterschreitung (3 Monate in 6) berechtigt zu außerordentlicher Kündigung

### 7.2 Antwortzeit

- Incident-Antwortzeiten gemäß § 4
- Bei Unterschreitung > 2× / Quartal: schriftliche RCA + Action-Plan

### 7.3 Datenintegrität

- 0 Toleranz für Doppelbuchungen (durch DB-Constraint garantiert; bei Auftreten = P0)
- 0 Toleranz für Cross-Tenant-Datenlecks (durch RLS garantiert; bei Auftreten = P0 + sofortige DSGVO-Meldung)

## § 8 Schlussbestimmungen

Es gelten die Schlussbestimmungen des MSA (§ 12 MSA).

---

## Unterschriften

Stuttgart, **2026-05-13** (Sim-Tag 1)

Auftraggeber:   ✅ **UNTERSCHRIEBEN** — Belkis Aslani
                Anwaltlich geprüft. SLA + Mindestlaufzeit 12 Monate akzeptiert.

Auftragnehmer:  ✅ **UNTERSCHRIEBEN** — Niko Korhonen, CFO Korynth Labs (#049)
                Maintenance-Pflichten ab Release v1.0 ausdrücklich übernommen.

**Vertrag rechtskräftig ab:** Release v1.0 (geplant Sim-Tag 140).
**Rechnungsstellung:** monatlich nachschüssig €12.000 netto ab Release v1.0.

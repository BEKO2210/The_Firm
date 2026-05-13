---
real: 2026-05-13T18:55:00Z
sim:  Day 1, 14:00 (Sprint 1 · Q1 2026)
ticket: TCK-20260513-0001
audience: "Belkis Aslani (Principal)"
language: "de"
version: "1.0 — Discovery Output"
authors_internal:
  - "003 — Mira Lundberg (Principal Engineer, Discovery Lead)"
  - "002 — Jonas Weber (CTO)"
  - "005 — Eilidh MacKenzie (AI Research Lead)"
  - "017 — Yasmin El-Sayed (DPO)"
  - "049 — Niko Korhonen (CFO)"
  - "027 — Devil's Advocate / Architecture Critic (independent review)"
---

# Friseur & Beauty-Salon Buchungsplattform — Discovery-Antwort

**Hallo Belkis,**

vielen Dank für den ausführlichen Projektauftrag. Du hast uns wirklich alles gegeben, was wir für eine seriöse Einschätzung brauchen — Zielgruppe, Funktionsumfang, MVP-Abgrenzung, Buchungslogik, Datenschutzanforderungen, Geschäftsmodell. Im Folgenden findest du unsere fundierte Antwort auf alle 14 Fragen aus Abschnitt 13 deines Briefs sowie die 7 Liefergegenstände aus Abschnitt 15 (Aufwand, Architektur, MVP-Plan, Module, Kosten/Zeit, Risiken, Phasenplan).

Wir empfehlen, dass du dieses Dokument in Ruhe liest und uns danach kurz Bescheid gibst, ob wir in die Design-Phase übergehen sollen. Falls du noch Fragen oder Änderungswünsche hast, dokumentieren wir das in einer V1.1.

---

## Zusammenfassung in 60 Sekunden

| | |
|---|---|
| **Was wir bauen** | Multi-Tenant Buchungsplattform für Salons: Web-Frontend für Kunden + Admin-Dashboard für Betreiber + native Apps (Phase 2) |
| **Tech-Empfehlung** | Next.js 15 + Supabase (Postgres + Auth + Storage + RLS) + Expo (React Native für iOS/Android) auf Vercel |
| **Wichtigster Punkt** | Slot-Engine = Kern. Server-seitig, transaktional, mit Locking. Doppelbuchung ist unmöglich. |
| **MVP-Dauer** | ~20 Wochen (5 Monate) bis Pilot-Salon live |
| **MVP-Kosten** | Ziel **€415.000** · Cap **€485.000** (Premium-Tier Korynth Labs) |
| **Maintenance** | €12.000 / Monat Retainer ab Launch (Hosting + Support + Feature-Inkrement) |
| **DSGVO/AI-Act** | DPIA + AVVs vor Build-Start, Transparenz bei Mitarbeiter-Auto-Zuordnung |
| **Risiken** | Slot-Engine-Korrektheit, App-Store-Reviews, Multi-Tenancy-Datenisolation |

---

## 1 · Empfohlene technische Architektur (Antwort auf Frage 1 + 5)

### 1.1 Stack

```
┌────────────────────────────────────────────────────────────────┐
│                        END USERS                                │
│   Kunde Web       Kunde iOS       Kunde Android     Betreiber  │
│   (Next.js 15)    (Expo)          (Expo)            (Next.js)   │
└─────────────────────┬──────────────────────────────────────────┘
                      │  HTTPS · JWT-Auth · tRPC + REST
                      ▼
┌────────────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER (TypeScript)                 │
│  Next.js Server Actions · tRPC routers · Cron Jobs              │
│  • Auth (Supabase Auth)                                          │
│  • Slot-Engine (Constraint Solver, transaktional)                │
│  • Booking Service (RLS-enforced)                                │
│  • Notification Worker (Resend + FCM + APNS)                     │
│  • Reporting / Analytics                                         │
└─────────────────────┬──────────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────────────────────┐
│              DATA LAYER (Supabase / Postgres 16)                │
│  • Row-Level Security (RLS) per tenant_id                       │
│  • Tabellen: salons, staff, services, packages, bookings, ...   │
│  • Realtime Channels (Live-Kalender für Admin-Dashboard)         │
│  • Storage Buckets (Salon-Logos, Bilder)                         │
│  • Audit-Log-Tabelle (Append-only, getriggert)                   │
└────────────────────────────────────────────────────────────────┘

   Vercel (Hosting · Edge · Cron)     Cloudflare R2 (Backups)
   Resend (Email)                     Sentry (Errors)
   Better Stack (Uptime)              Stripe (Phase 2, Payments)
   Expo EAS Build (App Distribution)  Plausible (Privacy-Analytics)
```

### 1.2 Warum dieser Stack?

| Komponente | Alternative geprüft | Warum diese Wahl |
|------------|---------------------|------------------|
| **Next.js 15** | Remix, SvelteKit, plain React + Node | Größtes Ökosystem, perfekt für Web + Admin in einem, gute Performance auf Vercel, App Router stabil seit ein Jahr |
| **Supabase (Postgres + Auth + RLS)** | Firebase, AWS RDS + Cognito, eigene Auth | Multi-Tenancy via Postgres RLS ist battle-tested. Auth out-of-the-box. EU-Hosting (Frankfurt). DSGVO-Auftragsverarbeitung dokumentiert. Open-Source-Kern → kein Lock-in. |
| **Expo (React Native)** | Native Swift + Kotlin, Flutter | 80–90% Code-Sharing mit Web möglich (gleiche TypeScript-Logik, gleiche tRPC-Clients). Ein Team, zwei Apps. EAS Build vereinfacht App-Store-Submission. |
| **Vercel** | AWS, Cloudflare, eigener Server | DSGVO-freundlich (EU-Region), Edge Functions für Slot-Engine, Vorschau-Deploys pro PR, sehr gute Next.js-Integration |
| **Resend** | SendGrid, Postmark, AWS SES | EU-Hosting, schöne API, DSGVO-konform per AVV |

### 1.3 Multi-Tenancy-Modell

Wir empfehlen **Shared Database + Row-Level Security**, kein eigenes Schema pro Salon:

- Eine `tenants`-Tabelle (= "Salons").
- Jede andere Tabelle hat eine `tenant_id`-Spalte mit Foreign Key.
- Postgres RLS-Policies sorgen automatisch dafür, dass ein Salon-Owner nur seine eigenen Daten sieht.
- Super Admin (du) bekommt eine separate Policy mit Vollzugriff.

**Vorteile**:
- Skaliert problemlos auf hunderte Mandanten ohne Schema-Management.
- Backups, Migrationen, Monitoring zentral.
- Kostenvorteil: keine Pro-Tenant-Datenbankgebühr.

**Risiko & Mitigation**:
- Datenleck zwischen Mandanten = Worst Case. → Mitigation: jeder Schreib- und Lesepfad muss durch RLS, automatisierte Tests prüfen Cross-Tenant-Isolation pro PR, jährlicher Pen-Test fokussiert darauf.

---

## 2 · Modulübersicht (Antwort auf Frage 2)

13 Module. **Fett = MVP-kritisch**.

| Modul | MVP? | Zweck | Komplexität |
|-------|:----:|-------|:-----------:|
| **Identität & Auth** | ✅ | Registrierung, Login, Passwort-Reset, Rollen | M |
| **Salon-Mandant** | ✅ | Salon-Profil, Branding, Öffnungszeiten, Feiertage | S |
| **Service-Katalog** | ✅ | Leistungen + Pakete CRUD, Dauer, Preis, Skill-Anforderung | M |
| **Mitarbeiter** | ✅ | Personen, Skills, Arbeitszeiten, Pausen, Urlaub | M |
| **Slot-Engine** | ✅ | Verfügbarkeits-Berechnung, Constraint-Solving (s. §10) | **XL** |
| **Buchung** | ✅ | Buchen, Stornieren, Umbuchen, Status-Maschine | L |
| **Kunden-Buchungs-Frontend** | ✅ | Web-UI für Endkunden | L |
| **Admin-Dashboard** | ✅ | Web-UI für Salonbetreiber: Kalender, KPIs, Verwaltung | L |
| **Benachrichtigungen** | ✅ | Email-Bestätigung + Erinnerungen (24h & 2h vor Termin) | M |
| **Kundenverwaltung (CRM)** | ✅ | Kundendaten, Buchungshistorie, No-Show-Tracking | M |
| **Native Apps (iOS + Android)** | ❌ Phase 2 | Kunden-App mit Push, später Mitarbeiter-App | L |
| **Online-Zahlung** | ❌ Phase 2 | Stripe + SCA, Anzahlung, Storno-Gebühr, Gutscheine | M |
| **Reporting & Analytics** | ❌ Phase 2 | Umsatz, Auslastung, Statistik | M |
| **Marketing-Automation** | ❌ Phase 3 | Geburtstagsmails, Wiederaktivierung, Treueprogramme | M |
| **KI-Optimierung** | ❌ Phase 4 | ML-basierte Slot-Vorschläge, No-Show-Vorhersage | L |
| **Multi-Location** | ❌ Phase 3 | Mehrere Filialen pro Salonbetreiber | M |
| **POS / Kasse-Integration** | ❌ Phase 4 | Anbindung an gängige Kassensysteme | L |
| **WhatsApp / SMS** | ❌ Phase 2 | Twilio o.ä. — kostenpflichtig pro Nachricht | S |

---

## 3 · MVP-Definition (Antwort auf Frage 3 + 4)

### 3.1 MVP-Scope (was DRIN ist)

Eine Web-App, die EINEN Pilot-Salon vollständig betreiben kann. Genauer:

**Kundenseite (responsive Web, kein App-Store)**:
- Registrierung mit Email + Passwort (Gastbuchung optional pro Salon einstellbar)
- Salon-Profil (Logo, Adresse, Öffnungszeiten, Beschreibung, Bildergalerie)
- Leistungs- und Paket-Liste
- "Mitarbeiter auswählen" oder "beliebiger Mitarbeiter"
- Slot-Auswahl mit echter, blitzschneller Verfügbarkeitsprüfung
- Buchungsbestätigung per Email
- Eigene Buchungs-Übersicht: ansehen, stornieren, umbuchen (innerhalb der Salon-Regeln)
- Erinnerungs-Mail 24h und 2h vor Termin (Cronjob)

**Betreiberseite (Admin-Dashboard, Web)**:
- Mehrere Rollen: Salon-Owner und Mitarbeiter
- Mitarbeiter anlegen, Skills setzen, Arbeitszeiten + Pausen + Urlaub pflegen
- Service- und Paket-Katalog verwalten
- Live-Kalender (Tages-, Wochen-, Monats- und Mitarbeiter-Ansicht)
- Drag-and-Drop für Termin-Verschieben
- Status-Workflow: gebucht → bestätigt → erschienen → bezahlt
- Kundenliste mit Historie und No-Show-Counter
- Salon-Einstellungen (Vorlaufzeit, Storno-Regeln, Branding)
- DSGVO-Tools: Kunden-Daten exportieren, löschen

**Super-Admin (du, Plattformbetreiber)**:
- Salons anlegen / freischalten / suspendieren
- Übersicht über alle Mandanten + System-Metriken
- Tarifverwaltung (Stub im MVP, voll in Phase 2 mit Stripe)

### 3.2 Was bewusst NICHT im MVP ist

| Verschoben auf | Was | Warum nicht im MVP |
|----------------|-----|---------------------|
| Phase 2 | Native iOS + Android Apps | App-Store-Submission verzögert Launch um 4–8 Wochen; mobile Web mit Add-to-Homescreen reicht für Pilot |
| Phase 2 | Online-Zahlung + Anzahlung | Stripe + PSD2/SCA-Integration ist eigenes Modul mit eigenem Risiko (Stripe-Compliance) |
| Phase 2 | Gutscheine, Pakete-Verkauf, Abos | Wartet auf Stripe |
| Phase 3 | Multi-Location | erstmal: 1 Salon = 1 Mandant. Multi-Location ist 1-Mandant-mit-N-Filialen → eigene Datenstruktur |
| Phase 3 | Bewertungen | Polit-/Spam-Probleme erfordern Moderation, das ist eigenes Modul |
| Phase 3 | Marketing-Automation | nice-to-have, nicht launch-kritisch |
| Phase 4 | KI-Optimierung | erst sinnvoll, wenn echte Buchungsdaten existieren (≥ 6 Monate Pilotbetrieb) |
| Phase 4 | POS / Kasse-Anbindung | Standards in DE sind fragmentiert (DATEV, MeinBüro, etc.) → eigene Integration pro System |
| Phase 4 | Mitarbeiter-App | erst, wenn das System bewiesen hat, dass es im Salon-Alltag akzeptiert wird |

---

## 4 · Slot-Engine — Wie wir Doppelbuchungen verhindern (Antwort auf Frage 10)

Das ist das **wichtigste Kapitel** dieses Dokuments. Der Slot-Engine ist die Lebensader der Plattform.

### 4.1 Algorithmus

Bei jeder Anfrage `getAvailableSlots(salon_id, service_or_package_id, staff_preference, time_range)`:

1. Lade alle Mitarbeiter, die die Leistung können (Skill-Match).
2. Filtere auf solche, die im Zeitraum laut Stammdaten arbeiten (Öffnungszeiten ∩ Arbeitszeiten ∩ keine Pausen).
3. Schließe Mitarbeiter mit Urlaub oder Krankheit im Zeitraum aus.
4. Lade bestehende Buchungen im Zeitraum (mit Vor- und Nachbereitungszeit).
5. Für jeden 5-Minuten-Slot im Zeitraum: prüfe ob `Dauer + Pufferzeit` in den Kalender passt.
6. Sortiere Mitarbeiter pro Slot nach Lastausgleich (wer hat aktuell am wenigsten gebucht).
7. Liefere die ersten N Slots zurück, mit dem optimalen Mitarbeiter.

### 4.2 Schutz vor Doppelbuchungen

**Server-seitig, transaktional, mit Postgres-Locks.** Der Client kann hier nichts kaputt machen.

```sql
BEGIN ISOLATION LEVEL SERIALIZABLE;

-- 1. Re-verify availability with FOR UPDATE lock
SELECT id FROM staff_calendar
WHERE staff_id = $1
  AND ts_range && tsrange($2, $3)
FOR UPDATE;  -- locks any conflicting row

-- 2. If 0 rows = available, insert booking
INSERT INTO bookings (tenant_id, staff_id, service_id, customer_id,
                      starts_at, ends_at, ...)
VALUES (...)
RETURNING id;

-- 3. Insert into staff_calendar denormalized table (trigger could do this)
INSERT INTO staff_calendar (staff_id, ts_range, booking_id) VALUES (...);

COMMIT;
```

Wenn zwei Kunden gleichzeitig versuchen, denselben Slot zu buchen:
- Beide erreichen `BEGIN`.
- Beide rufen `FOR UPDATE` auf — einer kommt durch, der andere wartet.
- Der erste committet erfolgreich.
- Der zweite kommt durch, sieht den Konflikt (1 row statt 0), wird zurückgerollt.
- Die zweite Anfrage bekommt einen `409 Conflict` mit "Slot bereits vergeben, hier sind die nächsten Alternativen".

**Zusätzlich**: ein Postgres-Exclusion-Constraint stellt sicher, dass auch bei einer Race Condition zwischen DB-Sessions niemals zwei überlappende Buchungen für denselben Mitarbeiter existieren können. Das ist die letzte Verteidigungslinie auf DB-Ebene und wird durch eine `GIST`-Index-Bedingung erzwungen.

### 4.3 Tests

- 50+ Unit-Tests für die Engine (Skill-Match, Zeitfenster, Pufferzeiten).
- 20+ Integration-Tests mit echter DB.
- 10+ Concurrency-Tests, die parallele Buchungsversuche simulieren.
- Property-based testing mit `fast-check`: keine fünf zufällig generierten Mitarbeiter/Skill/Zeit-Konfigurationen dürfen je doppelt buchen lassen.

---

## 5 · Mobile-Apps (Antwort auf Frage 11)

**Empfehlung**: Im MVP nur responsive Web. Native Apps in **Phase 2**.

### 5.1 Native Apps in Phase 2

Wir nutzen **Expo + React Native** für gemeinsame Codebasis für iOS und Android.

- Ein Team kann beide Apps pflegen.
- 80–90% Code-Sharing mit dem Web-Frontend (gleiche tRPC-Clients, gleiche Validierungs-Schemas, gleiche Business-Logik).
- Native-spezifische Komponenten (Kamera, Push, Biometrische Auth) bleiben dünn.
- **EAS Build** automatisiert die Builds + Submission an App Store und Google Play.
- Push-Benachrichtigungen via **Expo Push API** (intern FCM + APNS).

### 5.2 App-Store-Reviews — bekannte Risiken

- Apple lehnt häufig ab wegen: Account-Löschung nicht im App selbst → wir bauen das von Anfang an ein. App-Store-Reviews dauern 24h–7 Tage; wir planen 4 Wochen Buffer für den ersten Submit.
- Google ist schneller (typischerweise 24h).
- Native Apps brauchen eigenes Datenschutz-Disclaimer in App Store und Play Store (Apple "Privacy Nutrition Labels"). Wir liefern das.

### 5.3 Alternative geprüft: Native Swift + Kotlin

→ Abgelehnt: 3× Aufwand bei minimalem UX-Vorteil. Buchungs-Apps profitieren nicht messbar von 100% nativem Look-and-Feel.

---

## 6 · SaaS-Skalierung (Antwort auf Frage 12)

### 6.1 Mandantenfähigkeit von Tag 1

Jede Anfrage trägt einen Mandanten-Kontext (`tenant_id`), entweder aus dem JWT (Logged-in-Nutzer) oder aus dem Subdomain-Mapping. Beispiel: `mariana-friseure.korynth-bookings.app` → tenant_id = 42. Custom Domains in Phase 2 (`buchen.mariana-friseure.de`).

### 6.2 Tarif-Modell

Wir empfehlen den Tarifaufbau, den du im Brief skizziert hast:

| Tarif | Preis / Monat | Limits / Features |
|-------|---------------:|--------------------|
| **Basic** | €29 | 1 Mitarbeiter, 100 Buchungen/Monat, Email-Erinnerungen, Web nur |
| **Pro** | €69 | bis 5 Mitarbeiter, unbegrenzte Buchungen, Email + Push, Branding |
| **Premium** | €149 | bis 15 Mitarbeiter, Online-Zahlung, Pakete, Reporting |
| **Enterprise** | individuell | Multi-Location, dedicated Support, SLA, API-Zugriff |

Beim Übergang von einem Tarif auf den nächsten passen Feature-Flags + Limits sich automatisch an. Tarif-Wechsel ist in der Plattform-UI möglich.

### 6.3 Skalierungs-Erwartungen

| Mandanten | Buchungen/Tag (Summe) | Infrastruktur |
|----------:|----------------------:|----------------|
| 10 | ~100 | Supabase Free Tier reicht aus, Vercel Hobby Plan |
| 100 | ~1.000 | Supabase Pro ($25/mo), Vercel Pro ($20/mo) |
| 1.000 | ~10.000 | Supabase Team Plan, Vercel Pro, vielleicht ein Read-Replica |
| 10.000+ | ~100.000+ | Eigenes Konzept, ggf. Wechsel auf eigenes Postgres-Cluster (RDS / Neon) |

Architektur kommt mit der Skalierung mit, ohne Big-Bang-Rewrite.

---

## 7 · Aufwands- und Zeitschätzung (Antwort auf Frage 6 + 7)

### 7.1 Zeitplan zum MVP-Launch

| Phase | Sim-Wochen | Real-Wochen (parallelisierbar) | Output |
|-------|:----------:|:------------------------------:|--------|
| **Discovery** (jetzt) | 2 | 2 | Dieses Dokument + Verträge + DPIA-Plan |
| **Design** | 3 | 3 | ADRs, Datenmodell, Slot-Engine-Algorithmus-Spec, UI-Prototyp |
| **Build MVP** | 12 | 10 | Web-App + Admin-Dashboard + Slot-Engine + Buchung |
| **Harden** | 2 | 2 | Pen-Test, Last-Test, Pilot-Salon-Onboarding |
| **Release v1.0** | 1 | 1 | Production-Deploy, erster Salon live |
| **Total** | 20 | **~18 Wochen** | (Phasen 2–4 überlappen 2 Wochen) |

**Pilot-Live-Datum** (real, basierend auf Korynth-Labs-internem Sim-Wallclock): ~Mitte Oktober 2026.

### 7.2 Teamgröße

| Phase | Team (FTE) |
|-------|------------|
| Discovery | Principal Engineer 50%, Designer 25%, Product Owner 50%, DPO 25%, CFO 10% |
| Design | Principal Engineer 75%, Designer 100%, Product Owner 50%, AI Research Lead 25%, DPO 25% |
| Build MVP | 2× Backend (100%), 2× Frontend (100%), 1× Designer (50%), 1× QA (75%), 0.5× DevOps, 0.25× Security |
| Harden | 1× Backend, 1× Frontend, 1× QA, 1× DevOps, 0.5× Security |
| Maintenance (post-launch) | 0.5× Backend, 0.5× Frontend, 0.25× Designer, 0.25× DevOps, on-call rotation |

Insgesamt **~7–8 Personen Teilzeit** über die MVP-Phase. Auf Korynth-Labs-interner Seite: Mira, Jonas, Eilidh, Sander, Yasmin, Omar, Priya plus 2 Maker — alle bereits eingestellt, kein Recruiting nötig.

---

## 8 · Kostenrahmen (Antwort auf Frage 8)

### 8.1 Projektkosten zum MVP

| Position | Preismodell | Betrag (EUR, netto) |
|----------|-------------|--------------------:|
| Discovery | Fixed | 40.000 |
| Design | Fixed | 60.000 |
| Build MVP | T&M mit Cap | Ziel 280.000 · **Cap 350.000** |
| Harden | Fixed | 35.000 |
| **Summe bis MVP-Launch** | | **Ziel 415.000 · Cap 485.000** |

### 8.2 Laufende Kosten ab Launch

| Position | Betrag/Monat (EUR, netto) |
|----------|----------------------:|
| Korynth-Labs-Maintenance-Retainer | 12.000 |
| Hosting (Vercel + Supabase) | 200–800 (skaliert mit Mandanten) |
| Email-Versand (Resend) | 100–300 |
| Monitoring (Sentry + Better Stack) | 150 |
| Security-Tools (Snyk, etc.) | 100 |
| Domains + SSL | 10 |
| Backups (Cloudflare R2) | 30 |
| Push-Benachrichtigungen (Phase 2) | 50–200 |
| Zahlungsabwicklung Stripe (Phase 2) | ~1,5% Transaktionsvolumen |
| **Summe Infrastruktur** | **600–1.500** |
| **Summe Total laufend** | **~12.600–13.500** |

### 8.3 Mandantenkosten — Margenrechnung

Bei 100 zahlenden Salons (Mischung der Tarife, durchschnittlich €70 / Salon / Monat):
- Umsatz: 100 × €70 = €7.000 / Monat → ungenügend zur Deckung des Maintenance-Retainers.
- Bei 200 Salons (€14.000) ist die Plattform self-sustaining.
- Bei 500 Salons (€35.000) ist sie hochprofitabel.

**Empfehlung**: ersten 10 Salons als Pilotpartner zu vergünstigten Konditionen (z.B. €15 / Monat im ersten Jahr) gewinnen, dann ausrollen.

---

## 9 · Risiken (Antwort auf Frage 9)

| Risiko | Wahrscheinlichkeit | Auswirkung | Mitigation |
|--------|:-------------------:|:-----------:|------------|
| Slot-Engine produziert Doppelbuchung | mittel | **kritisch** | Server-Authoritative, Postgres-SERIALIZABLE + Exclusion-Constraint, 100+ Tests, Pen-Test in Harden |
| Cross-Tenant-Datenleck | niedrig | **kritisch** | Postgres RLS für 100% der Schreib/Lese-Pfade, automatisierte Tests pro PR, Pen-Test fokussiert darauf |
| Apple App Store-Review-Ablehnung | mittel | mittel | Phase 2 mit 4 Wochen Buffer, Account-Löschung im App von Tag 1 |
| Schlechte Salon-Onboarding-UX → niedrige Adoption | mittel | hoch | Pilotsalon eng begleiten, UX-Iterationen in Phase 2 |
| Stripe SCA-Integration komplex (Phase 2) | mittel | mittel | Stripe-Spezialist on Korynth-Labs-Team oder externe Spezialberatung |
| DSGVO-Audit findet Mängel | niedrig | hoch | DPIA in Design-Phase, AVV mit allen Sub-Processors, jährlicher externer DSGVO-Audit |
| Scope-Creep im Build | hoch | mittel | T&M-Cap schützt dich, Change-Request-Verfahren bei jeder Änderung > 8h |
| Konkurrenz (Treatwell, Booksy, Setmore) schneller | mittel | mittel | Differenzierung über DACH-Lokalisierung + Premium-UX, nicht über Feature-Anzahl |
| Anti-Pattern A.8 — Toxic Customer (Salon-Betreiber wird abusiv) | niedrig | mittel | Konflikt-Policy nach 3 Vorfällen pro Quartal greift (CLAUDE.md §39.A.8) |

---

## 10 · Wartungs- und Betriebskosten (Antwort auf Frage 13)

Siehe Tabelle 8.2 oben. Zusätzlich:

- **Updates / Sicherheits-Patches**: monatliche Dependency-Updates (Renovate-Bot, ~4h/Monat).
- **Incident-Response**: SRE-On-Call-Rotation, abgedeckt durch Retainer.
- **Backups**: tägliche automatisierte Postgres-Backups (Supabase) + wöchentliche kalte Kopie auf Cloudflare R2 in einer separaten Region.
- **DR-Drills**: monatlich (Korynth Labs §29.2).
- **Externe Audits**: jährlich (Finance + Security-Pentest + DSGVO) — abgedeckt durch Retainer in Korynth Labs Premium-Tier.

---

## 11 · Rechtliches und Datenschutz (Antwort auf Frage 14)

### 11.1 Pflicht-Verträge

| Vertrag | Mit | Wann |
|---------|-----|------|
| **MSA** (Master Service Agreement) | Belkis ↔ Korynth Labs | vor Build-Start |
| **SOW-001** | Belkis ↔ Korynth Labs | vor Build-Start |
| **DPA** (Data Processing Agreement, DSGVO Art. 28) | Belkis ↔ Korynth Labs | vor Build-Start |
| **AVV** mit Supabase, Vercel, Stripe (Phase 2), Resend, Sentry | Belkis ↔ Sub-Processor | vor Production-Deploy |
| **IP-Assignment** | Code-Eigentum vollständig bei dir | vor Build-Start |
| **Auftragsverarbeitung mit Salons** | jeder Salon ↔ Belkis (Plattform-AVV) | vor Salon-Onboarding (Vorlage liefern wir) |

### 11.2 DSGVO-Maßnahmen im Produkt

- Datenminimierung: Felder bei Kunden-Registrierung auf Pflicht-Minimum (Name, Email).
- Einwilligungen explizit: Marketing-Mails separat opt-in.
- Datenexport-Tool im Admin-Dashboard (Kunde fordert Salon-Owner zur Bereitstellung auf).
- Lösch-Tool im Admin-Dashboard.
- Optional: Allergien-Feld ist **special-category data** (Art. 9 DSGVO) → standardmäßig deaktiviert, nur mit zusätzlicher Einwilligung des Kunden aktivierbar.
- Audit-Log für alle Daten-Operationen (welcher Nutzer hat wann was geändert/gelöscht).
- Cookie-Banner gemäß TTDSG + ePrivacy.

### 11.3 EU AI Act

- Automatische Mitarbeiter-Zuordnung ist ein automatisiertes Entscheidungs-System nach Art. 22 DSGVO und potenziell Art. 5/6 EU AI Act.
- Transparenz: Kunde sieht, dass Auto-Zuordnung verwendet wurde, und kann jederzeit manuell wählen.
- Mitarbeiter haben ein Recht auf Information, welche Kriterien zur Zuordnung dienen.
- Keine personenbezogene Bewertung — wir nutzen nur Skill + Verfügbarkeit + Lastausgleich.

### 11.4 Rechtsrahmen Salons

Im B2C-Verhältnis (Salon ↔ Endkunde) ist der Salon Verantwortlicher, du als Plattformbetreiber bist Auftragsverarbeiter. Diese Verteilung dokumentieren wir in der AVV-Vorlage, die jeder Salon vor Inbetriebnahme unterschreibt. Salons werden in den AGB informiert, dass sie Verantwortlich für eigene rechtssichere AGB + Datenschutzerklärung gegenüber ihren Kunden sind. Wir liefern eine Vorlage als Service.

---

## 12 · Phasenplan (Antwort auf Liefergegenstand 7)

```
┌─────────────────────────────────────────────────────────────────┐
│                         PHASE 0 — DISCOVERY                       │
│                       Wochen 1–2  ·  Day 1–14                     │
│  • Diese Antwort  • Verträge erstellen  • Sign-off                 │
│  • DPIA-Plan      • Kick-off mit dir                               │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                          PHASE 1 — DESIGN                         │
│                       Wochen 3–5  ·  Day 15–35                    │
│  • ADRs           • Datenmodell      • Slot-Engine-Spec            │
│  • UI-Prototyp    • Stripe-Mock      • DPIA filed                  │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                       PHASE 2 — BUILD MVP                         │
│                      Wochen 6–17  ·  Day 36–119                    │
│  Sprint 1: Auth + Mandanten + Salon-Profil + Service-Katalog      │
│  Sprint 2: Mitarbeiter + Slot-Engine (Kern-Logik + Tests)         │
│  Sprint 3: Buchungsflow + Admin-Kalender                          │
│  Sprint 4: Benachrichtigungen + CRM + Admin-Dashboard polish      │
│  Sprint 5: i18n (DE/EN) + Branding + Restpolish                   │
│  Sprint 6: Pilot-Salon-Onboarding-Vorbereitung                    │
│  → Meilenstein-Demo nach Sprint 2 (Slot-Engine Live)              │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                         PHASE 3 — HARDEN                          │
│                      Wochen 18–19  ·  Day 120–133                  │
│  • Pen-Test (extern)  • Load-Test  • Pilot-Salon onboarden        │
│  • B-Gates A1–A6, B1–B6 durchlaufen                                │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                       PHASE 4 — RELEASE v1.0                      │
│                          Woche 20  ·  Day 134–140                  │
│  • Production-Deploy  • Erste Buchung live  • NPS-Workflow         │
│  • B6 Human-in-Loop: dein Sign-off                                  │
└─────────────────────────────────────────────────────────────────┘

         POST-LAUNCH ROADMAP (parallel zur Maintenance)

  PHASE 5 — Wochen 21–40 ·  Native iOS + Android + Online-Zahlung
  PHASE 6 — Wochen 41–60 ·  Multi-Location + Reporting + Marketing-Automation
  PHASE 7 — Wochen 61+   ·  KI-Optimierung + POS-Anbindungen
```

---

## 13 · Offene Fragen an dich (Belkis)

Bitte beantworte uns folgende Punkte, damit wir die Design-Phase präzise planen können:

1. **Pilotsalon vorhanden?** Hast du einen konkreten Saloninhaber, der uns als erster Pilot dient (idealerweise mit unter 8 Mitarbeitern, dialogbereit, in Stuttgart-Region)?
2. **Branding**: Soll die Plattform unter eigenem Namen laufen (z.B. "Korynth Bookings", "salon-zeit.de") oder als White-Label, wo der Salon das Branding bestimmt?
3. **Region zum Start**: DACH-only (DE-AT-CH), oder ist EU/international ab Tag 1 geplant?
4. **Payment-Provider in Phase 2**: Präferenz für Stripe (sehr Developer-freundlich) oder Mollie (in DE bekannter, niedrigere Gebühren)?
5. **Gastbuchung**: Sollen Endkunden ohne Account buchen können, oder ist Registrierung Pflicht?
6. **Mehrsprachigkeit MVP**: Reicht Deutsch im MVP, oder soll Englisch von Anfang an?
7. **Datenresidenz**: Akzeptierst du Supabase mit Frankfurt-Region (DSGVO-konform aber US-Mutter), oder verlangen wir EU-only Anbieter? Letzteres ist ~30% teurer und verlangsamt uns ggf. um 2–3 Wochen.
8. **Kapazität bei dir**: Bist du als Principal bereit, wöchentlich 60–90 Min für Status + Entscheidungen zu reservieren?

---

## 14 · Empfehlung & Nächste Schritte

Wir empfehlen:

1. **Diese Discovery-Antwort zu lesen** und Rückmeldung an `account@korynth-labs.internal` zu geben (Antwort via Email-Client im Dashboard).
2. **Verträge unterschreiben** (MSA + SOW-001 + DPA + IP-Assignment) — Drafts liegen ab Day 7 bereit unter `legal/contracts/per-ticket-contracts/TCK-20260513-0001/`.
3. **Design-Phase-Kick-off** in Woche 3 (Day 15 sim).
4. **Wöchentlicher Status** ab Day 7 (Account-Manager Priya Sharma).
5. **Erster Meilenstein-Demo** nach Sprint 2 (Day 67 sim) — Slot-Engine läuft, Buchung funktioniert end-to-end mit Test-Salon.

Falls du eine oder mehrere der 8 offenen Fragen nicht jetzt beantworten kannst, halten wir die Discovery-Phase mit den getroffenen Annahmen ab und finalisieren in der ersten Design-Woche.

---

**Wir freuen uns auf dein Go.**

Mit besten Grüßen,
das Korynth-Labs-Team

- *003 Mira Lundberg* — Principal Engineer
- *002 Jonas Weber* — CTO
- *021 Priya Sharma* — Account Manager (deine Ansprechperson)
- *017 Yasmin El-Sayed* — Data Protection Officer
- *049 Niko Korhonen* — CFO

---

*Dokument-Pfad: `workspace/tickets/TCK-20260513-0001/02-discovery/discovery-output.md`*
*Audit-Log-Eintrag: ticket_created seq=2 · triage_complete seq=3 · discovery_complete seq=4*

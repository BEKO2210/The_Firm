---
document: "Statement of Work · SOW-001 Premium MVP"
ticket: "TCK-20260513-0001"
parent: "MSA"
version: "1.0 — Draft"
draft_real: "2026-05-13"
draft_sim: "Day 1, 15:00"
status: "DRAFT — awaiting principal signature"
language: "de"
total_target_eur: 415000
total_cap_eur: 485000
maintenance_eur_per_month: 12000
duration_sim_weeks: 20
---

# SOW-001 · Premium MVP · Friseur & Beauty Booking SaaS

> ⚠️ **Dieser Vertrag wurde durch KI erstellt.** Anwaltliche Prüfung vor Unterzeichnung empfohlen.

Anlage 1 zum MSA · TCK-20260513-0001

---

## 1. Projektbezeichnung

**Friseur & Beauty Booking SaaS** — Multi-Tenant SaaS-Plattform für Friseure, Barbershops und Beauty-Salons, Premium-MVP-Variante (Web-MVP mit App-Readiness für Phase 2).

## 2. Vertragsparteien

- **Auftraggeber:** Belkis Aslani
- **Auftragnehmer:** Korynth Labs
- **Account Manager (deine Ansprechperson):** Priya Sharma (#021)
- **Discovery / Build Lead:** Mira Lundberg (#003)
- **CTO / Architecture-Verantwortung:** Jonas Weber (#002)
- **DPO:** Yasmin El-Sayed (#017)

## 3. Leistungsumfang (Scope)

### 3.1 Im Scope (Premium MVP — DRIN)

**Plattform-Funktionen:**

1. **Identität & Auth**: Email/Passwort, Passwort-Reset, Magic-Link für Gastbuchungs-Stornos, 4 Rollen (Super-Admin, Salon-Owner, Mitarbeiter, Kunde)
2. **Multi-Tenancy**: Postgres Row-Level Security (RLS) für sämtliche Datenobjekte, Subdomain pro Salon (`<slug>.korynth-bookings.app` initial)
3. **Salon-Profil**: Name, Adresse, Öffnungszeiten, Feiertage, Logo, Farben, Bilder, Beschreibung, Einstellungen (Vorlaufzeit, Storno-Regeln, max. Buchungsfenster, Gastbuchung ja/nein)
4. **Service- und Paket-Katalog**: CRUD für Leistungen + Pakete, Dauer, Preis, Skill-Anforderung, Vor-/Nachbereitungszeit, Pufferzeit, online sichtbar / intern
5. **Mitarbeiter-Verwaltung**: Profile, Skills, Arbeitszeiten, Pausen, Urlaub, Krankheit, Aktiv/Inaktiv
6. **Slot-Engine (Kernmodul, gehärtet)**: Server-authoritative, SERIALIZABLE-Transaktionen, GIST Exclusion Constraint, Algorithmus mit Skill-Match + Last-Ausgleich + frühester-Termin-Bevorzugung; gemäß Anlage 7 (Slot-Engine-Final-Spec)
7. **Buchungsflow Kunde**: Salon-Wahl → Leistung/Paket → Mitarbeiter (oder „beliebig") → Slot → Buchung → Bestätigung; Storno + Umbuchung innerhalb Salon-Regeln; **Gastbuchung optional pro Salon**
8. **Admin-Dashboard Salon**: Kalender (Tag, Woche, Monat, pro Mitarbeiter, gesamt), Drag-and-Drop, Status-Workflow (gebucht → bestätigt → erschienen → bezahlt → storniert), CRUD aller Stammdaten, Reporting (Buchungszahlen, Auslastung, Top-Leistungen, Umsatz, No-Show-Rate)
9. **CRM**: Kundenliste mit Buchungshistorie, Notes, No-Show-Counter, Tags, bevorzugter Mitarbeiter, **optional Allergien-Feld mit zusätzlicher Einwilligung** (Art. 9 DSGVO)
10. **Benachrichtigungen**: Email-Bestätigung sofort + Erinnerung 24h + 2h vor Termin + bei Status-Änderungen
11. **Super-Admin**: Salons anlegen / suspendieren / einsehen, System-Metriken, Tarif-Stubs (volle Tarif-Verwaltung in Phase 2 mit Stripe)
12. **Salon-Branding**: Logo, Farben, Bilder, Beschreibung pro Salon — gilt für die Buchungs-URL und Email-Templates
13. **DSGVO-Tools**: Daten-Export pro Kunde, Lösch-Funktion, Consent-Management, Audit-Log pro Daten-Operation
14. **Responsive Web (mobile-first)**: optimiert wie eine App, PWA-tauglich (Add-to-Home-Screen)
15. **i18n vorbereitet**: alle Strings als Translation-Keys, vollständige DE-Übersetzung im MVP, EN als Scaffold (Schlüssel ohne Text)

**Architektur- & App-Readiness (gemäß deiner Klarstellung):**

16. **API-Struktur für native Apps**: alle Backend-Endpunkte (tRPC + REST-Fallback) so designt, dass mobile Clients sie gleich nutzen — keine Web-only-Endpoints
17. **Auth- und Rollenlogik mobile-tauglich**: JWT-basiert, Magic-Link für Gastbuchung, Refresh-Token-Strategie für lange Sessions
18. **Expo / React-Native-Vorbereitung**: Frontend-Code in `apps/web` mit klarer Trennung zu zukünftigem `apps/mobile`; gemeinsamer Code in `packages/core` (Schemas, Business-Logik, tRPC-Clients)
19. **Push-Notification-Fähigkeit**: Datenmodell und Notification-Worker so designt, dass Push (FCM/APNS) ohne Refactoring ergänzt werden kann
20. **Payment-Fähigkeit (Provider-neutral)**: Daten-Modell enthält `payment_provider`-Abstraktion, Interfaces (`IPayment`) ab Tag 1 vorhanden, konkrete Stripe-Implementation in Phase 2

**Qualitätssicherung:**

21. **Testing**: Unit ≥ 60%, Integration ≥ 30%, E2E ≥ 10% des Test-Counts; Coverage ≥ 80% für neuen Code, ≥ 70% Projekt-weit. Slot-Engine: 100% Coverage + Property-Based Tests
22. **WCAG 2 AAA wo möglich**, mindestens AA voll
23. **DPIA (DSGVO Art. 35)** in Design-Phase erstellt und an dich übergeben
24. **Externer Pen-Test** in Harden-Phase
25. **Last-Test**: 10.000 simulierte Concurrent Bookings → keine Doppelbuchung
26. **Audit-Log pro DB-Operation** für alle Schreibvorgänge
27. **CI/CD**: jeder PR durchläuft alle A-Gates (A1–A6), automatisch
28. **Alle 12 CLAUDE.md-Gates exercised** (A1–A6, B1–B6) — siehe Anlage 6 (Security + Testing Concept)

### 3.2 Ausdrücklich NICHT im Scope (Phase 2+)

Die folgenden Punkte sind **bewusst nicht** Teil dieses SOW. Sie werden architektonisch vorbereitet, aber nicht implementiert ohne separates SOW und schriftliche Freigabe von dir:

- ❌ Native iOS-App (Phase 2 — separates SOW)
- ❌ Native Android-App (Phase 2 — separates SOW)
- ❌ Mitarbeiter-App (Phase 3)
- ❌ Online-Zahlung (Stripe/Mollie-Integration) (Phase 2)
- ❌ Anzahlung / Storno-Gebühren / Gutscheine / Rechnungen (Phase 2)
- ❌ SMS- / WhatsApp-Erinnerung (Phase 2, kostenpflichtig pro Nachricht)
- ❌ Push-Notifications **Live** (Phase 2 — Voraussetzungen sind im MVP enthalten, Aktivierung nicht)
- ❌ Marketing-Automation, Treuepunkte, Kundenbindungsprogramme (Phase 3)
- ❌ Bewertungen / Reviews (Phase 3)
- ❌ Multi-Location pro Salon (Phase 3)
- ❌ POS- / Kassensystem-Anbindung (Phase 4)
- ❌ KI-Optimierung, No-Show-Vorhersage (Phase 4)
- ❌ Custom Domain pro Salon (Phase 2)
- ❌ Wartelisten-Feature (Phase 3)
- ❌ Tarif-Self-Service-Verwaltung für Salons (Phase 2)
- ❌ EN-Sprache vollständig (Phase 2 — Scaffold ist drin)

**Wichtig:** Folgefeatures werden vorbereitet (API-Struktur, Datenmodell, Auth-Architektur), aber **nicht ohne deine separate schriftliche Freigabe und ohne ein neues SOW umgesetzt**. Korynth Labs startet Phase 2 **nicht automatisch**.

## 4. Liefergegenstände pro Phase

| Phase | Liefergegenstände |
|-------|-------------------|
| **Discovery** (abgeschlossen) | (a) Discovery v1, (b) Discovery v2 mit drei Varianten, (c) alle 10 Pre-Sign-Off-Dokumente, (d) Verträge zur Zeichnung (dieses SOW + MSA + DPA + IP + Maintenance) |
| **Design** (Sim-Wochen 3–5) | (a) ADRs für Stack-Wahl, Multi-Tenancy, Auth, Email, Payment-Abstraktion; (b) Vollständiges Datenmodell (ER + DDL + Migrations-Skripte); (c) Slot-Engine-Final-Algorithmus-Spec mit Pseudocode + Tests-Plan; (d) UI-Wireframes in Figma (Kunde-Web + Admin-Dashboard); (e) **DPIA-Dokument**; (f) Subprocessor-Liste mit AVVs in Vorbereitung |
| **Build MVP** (Sim-Wochen 6–17) | Pro Sprint: (a) Lauffähige Inkremente, (b) Sprint-Demo-Video (5 Min), (c) Sprint-Report, (d) Updated Tests + Coverage-Report; **Sprints im Detail:** S1 Auth+Mandanten+Profil+Service-Katalog · S2 Mitarbeiter+Slot-Engine+Buchung (Meilenstein-Demo!) · S3 Admin-Dashboard+Kalender+Status-Workflow · S4 CRM+Benachrichtigungen · S5 Reporting+i18n+Branding · S6 Pilot-Salon-Onboarding-Vorbereitung |
| **Harden** (Sim-Wochen 18–19) | (a) Pen-Test-Report (extern), (b) Lasttest-Report (10k Concurrent Bookings), (c) Pilot-Salon vollständig eingerichtet, (d) Runbook für Incidents, (e) DSGVO-AVVs unterschrieben, (f) Backup-Konzept dokumentiert |
| **Release v1.0** (Sim-Woche 20) | (a) Production-URL live, (b) erste Test-Buchung dokumentiert, (c) Onboarding-Email an Pilot-Salon, (d) NPS-Workflow aktiv, (e) Übergabe-Dokumentation, (f) Source-Code-Übergabe + IP-Übertragung formell vollzogen |

## 5. Zeitplan & Meilensteine (Sim-Wochen / Sim-Tage)

| # | Meilenstein | Sim-Tag | Anteil | EUR netto |
|---|-------------|---------|:------:|---------:|
| M1 | Vertragsunterzeichnung (MSA + SOW + DPA + IP + Maintenance) — Design startet | Day 7 | 12 % | 49.800 |
| M2 | Design-Phase Abschluss + Sign-off (Datenmodell, Slot-Engine-Spec, UI-Wireframes, DPIA) | Day 35 | 13 % | 53.950 |
| M3 | Sprint 1 Abnahme (Auth + Mandanten + Salon-Profil + Service-Katalog) | Day 49 | 10 % | 41.500 |
| M4 | Sprint 2 Abnahme (Mitarbeiter + Slot-Engine voll + Buchung end-to-end) — **Meilenstein-Demo** | Day 63 | 15 % | 62.250 |
| M5 | Sprint 3 Abnahme (Admin-Dashboard + Kalender + Status-Workflow) | Day 77 | 10 % | 41.500 |
| M6 | Sprint 4 Abnahme (CRM + Benachrichtigungen + Audit-Log + DSGVO-Tools) | Day 91 | 10 % | 41.500 |
| M7 | Sprint 5 Abnahme (Reporting + i18n + Branding + Polish) | Day 105 | 10 % | 41.500 |
| M8 | Sprint 6 Abnahme (Pilot-Onboarding-Vorbereitung) | Day 119 | 7 % | 29.050 |
| M9 | Harden Abnahme (Pen-Test grün + Lasttest 10k grün + Pilot-Salon eingerichtet) | Day 133 | 8 % | 33.200 |
| M10 | **Release v1.0 — Production live + B6 Sign-off** | Day 140 | 5 % | 20.750 |
| | **Summe Ziel** | | **100 %** | **415.000** |
| | **Cap (Build-Phase T&M)** | | | **485.000** |

Differenz Ziel/Cap (€70.000) ist die T&M-Reserve für die Build-Phase. Sie wird nur verwendet, wenn der Scope unverändert bleibt, der Aufwand sich aber durch unvorhergesehene technische Komplexität erhöht. **Jede Cap-Nutzung > €5.000 erfordert deine explizite schriftliche Freigabe (Anti-Surprise-Klausel).**

Zahlungsziel: 14 Tage netto nach Meilenstein-Abnahme.

## 6. Abnahmekriterien pro Meilenstein

### 6.1 Design (M2)

- [ ] Datenmodell mit ER-Diagramm + DDL-Skripten ist vollständig
- [ ] Slot-Engine-Algorithmus als formales Spec-Dokument vorhanden (mit SQL, Pseudocode, Test-Plan)
- [ ] UI-Wireframes für alle MVP-Screens (Kunde-Web + Admin-Dashboard) in Figma freigegeben
- [ ] DPIA-Dokument vollständig
- [ ] Mind. 5 ADRs vorhanden (Stack, Multi-Tenancy, Auth, Email, Payment-Abstraktion)
- [ ] Subprocessor-Liste vollständig, AVVs in Vorbereitung

### 6.2 Sprint-Abnahme (M3–M8)

Pro Sprint:

- [ ] Alle geplanten Tickets in der Sprint-Liste auf „done"
- [ ] A1 QA (Tests grün, Coverage ≥ 80% neu / ≥ 70% gesamt) ✓
- [ ] A2 Security (kein Critical/High in Snyk, keine Secrets im Code) ✓
- [ ] A3 Quality (Code-Reviews bestanden, Linting clean) ✓
- [ ] A4 Finance (Spend ≤ Sprint-Budget × 110%) ✓
- [ ] A5 DPIA (für Sprints mit Datenmodelländerung) ✓
- [ ] A6 AI-Ethics (alle kritischen Entscheidungen logged) ✓
- [ ] Demo-Video (5 Min)
- [ ] Sprint-Report (schriftlich, max 1 Seite)
- [ ] Funktioniert mit Test-Salon

### 6.3 Harden (M9)

- [ ] Pen-Test-Report extern: keine Critical, keine High, alle Medium adressiert oder dokumentiert
- [ ] Lasttest-Report: 10.000 Concurrent Bookings, 0 Doppelbuchungen
- [ ] Pilot-Salon mit Stammdaten und Test-Buchungen eingerichtet
- [ ] DSGVO: alle AVVs unterschrieben
- [ ] Backup-Konzept dokumentiert + getestet
- [ ] Incident-Runbook vorhanden

### 6.4 Release v1.0 (M10)

Alle B-Gates erfüllt:

- [ ] B1 Regression: vollständiger Test-Run grün
- [ ] B2 Privacy: DSGVO-Compliance verifiziert (DPIA, AVVs, DSR-Tools)
- [ ] B3 Compliance: Lizenz-Übersicht, Docs vollständig, Audit-Trail-Integrität
- [ ] B4 UX Acceptance: Acceptance-Criteria pro Screen 1:1 erfüllt, AA-Accessibility geprüft
- [ ] B5 Customer Sign-Off: schriftliche Freigabe durch **dich**
- [ ] B6 Human-in-Loop: Production-Release durch **dich** approved (Email oder Dashboard-Button)

## 7. Vergütung und Zahlungsmodell

(siehe § 5 dieses SOW)

- Discovery + Design + Harden + Release: **Festpreis**
- Build (Sprints 1–6): **T&M mit Cap** (Cap €70.000 über Ziel; Cap-Nutzung > €5.000 erfordert deine Freigabe pro Vorgang)
- Maintenance ab Release: **Retainer €12.000 / Monat** (separater Maintenance-Vertrag, Anlage 4 zum MSA)

Stundensätze (Premium-Tier, 1.3×):

| Rolle | EUR / Stunde |
|-------|:------------:|
| Junior | 130 |
| Mid | 170 |
| Senior | 220 |
| Lead / Staff | 280 |
| Exec / Principal Engineer | 380 |

## 8. Mitwirkungspflichten

Du verpflichtest dich:

- Wöchentlich 60–90 Min Status-Slot wahrzunehmen
- Sign-offs für Meilensteine binnen 5 Werktagen zu erteilen oder Mängel klar zu benennen
- Den Pilotsalon vor Build-Sprint 6 zu identifizieren und zu vermitteln
- Rechtsverbindliche Entscheidungen (Verträge, Drittanbieter-Accounts) selbst zu zeichnen
- Markenrechtliche Schritte (z. B. DPMA-Anmeldung) selbst zu beauftragen oder uns dafür ein separates SOW zu erteilen

## 9. Reporting

- **Wöchentlich** (Donnerstag 12:00, vor dem Status-Slot): Briefing-Doc (max. 1 Seite) mit Stand, Risiken, Entscheidungsbedarf
- **Pro Sprint-Ende**: Demo-Video + Sprint-Report
- **Pro Meilenstein**: schriftliche Meilenstein-Abnahme
- **Quartalsweise**: QBR-Doc (im MVP-Zeitraum vermutlich nur 1× zum Quartalsende Q2)
- **Bei kritischen Ereignissen** (Sicherheitsvorfall, Datenschutzverletzung, Budget-Über-Wahrscheinlichkeit > 10%): innerhalb von 24 Stunden Eskalation per E-Mail

## 10. Change Requests

(1) Scope-Änderungen sind nur per schriftlichem Change Request möglich.
(2) Jeder CR wird mit Aufwand (Stunden), Kosten (EUR), und Auswirkung auf Zeitplan dokumentiert.
(3) CRs > 4 Stunden Aufwand erfordern deine Freigabe vor Umsetzung.
(4) CRs werden in `workspace/tickets/TCK-20260513-0001/change-requests/` archiviert.

## 11. App-Readiness-Garantien (gemäß deiner Klarstellung)

Korynth Labs garantiert, dass am Ende des Premium MVP:

- [ ] Alle Backend-APIs identisch von Web, iOS und Android nutzbar sind
- [ ] Auth + Rollen-System mobile-tauglich ist (JWT + Refresh-Tokens, keine Cookie-only-Sessions)
- [ ] Frontend-Code in `apps/web` + `packages/core` strukturiert ist, sodass ein neues `apps/mobile`-Workspace mit Expo eingerichtet werden kann, ohne `packages/core` zu ändern
- [ ] Daten-Schema für Push-Notifications vorbereitet ist (Tabelle `device_tokens`, Worker-Hook)
- [ ] Daten-Schema für Payments vorbereitet ist (`payment_provider`-Spalte, `IPayment`-Interface, Stub-Implementation)

Diese Garantien werden in der Harden-Phase auditiert und im Release-Manifest dokumentiert.

## 12. Eigentum und Lizenzen

(siehe IP-Assignment, Anlage 3 zum MSA)

Quintessenz: Code, Designs, Datenmodell, Dokumentation, Brand-Assets, generierte Inhalte = **dein Eigentum** ab vollständiger Zahlung des jeweiligen Meilensteins.

## 13. Maintenance nach Release

Beginnt mit Release v1.0. Geregelt im separaten **Maintenance-Vertrag (Anlage 4 zum MSA)**.

Eckdaten:

- €12.000 / Monat (Retainer)
- Inklusive: Hosting-Monitoring, Security-Updates, Bug-Fixes (P0–P2), Sprint-Wartung, kleine Feature-Inkremente (≤ 4h / Inkrement)
- Größere Features = neues SOW
- Kündigungsfrist: 3 Monate zum Quartalsende

## 14. Beendigung dieses SOW

(1) Dieses SOW endet mit Abnahme des Release v1.0 (M10) oder mit Übergang in den Maintenance-Vertrag.
(2) Außerordentliche Kündigung gemäß § 8 MSA.
(3) Bei vorzeitiger Beendigung erfolgt anteilige Vergütung der bereits abgeschlossenen Meilensteine.

## 15. Schlussbestimmungen

Es gelten die Schlussbestimmungen des MSA (§ 12 MSA).

---

## Unterschriften

Stuttgart, ____________________

Auftraggeber: ____________________________________
              Belkis Aslani

Auftragnehmer: ___________________________________
              Korynth Labs · vertreten durch CEO Lina Bergmann (#001)

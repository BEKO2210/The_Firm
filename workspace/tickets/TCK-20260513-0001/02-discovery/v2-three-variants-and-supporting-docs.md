---
real: 2026-05-13T19:30:00Z
sim:  Day 1, 14:30 (Sprint 1 · Q1 2026)
ticket: TCK-20260513-0001
version: "2.0 — Three Variants + Pre-Sign-Off Deliverables"
in_response_to: "EM-2026-05-13T19-05-00Z-principal-reply-v1"
audience: "Belkis Aslani (Principal)"
language: "de"
authors_internal:
  - "003 — Mira Lundberg (Principal Engineer, Discovery Lead)"
  - "002 — Jonas Weber (CTO)"
  - "049 — Niko Korhonen (CFO)"
  - "017 — Yasmin El-Sayed (DPO)"
  - "005 — Eilidh MacKenzie (AI Research Lead)"
  - "027 — Devil's Advocate / Architecture Critic (independent review)"
  - "021 — Priya Sharma (Account Manager)"
---

# Discovery v2 · Drei Varianten + Pre-Sign-Off-Dokumente

**Hallo Belkis,**

danke für deine Rückmeldung und die klaren Antworten auf die 8 Fragen. Wir haben deine Antworten als Anforderungen ins Ticket übernommen und liefern dir hier:

- **drei MVP-Varianten** (Lean / Standard / Premium) mit dem geforderten Vergleich
- **alle 10 Pre-Sign-Off-Dokumente**, die du angefordert hast (Datenmodell, Slot-Engine-Spec, Rollen, Modul-Kostenaufteilung, Exit-Strategie, IP-Klärung, Zahlungsplan, Abnahmekriterien, MVP-Scope, Nicht-MVP-Scope)

Wir empfehlen die **Lean MVP**-Variante als Einstieg. Begründung am Ende.

---

## Teil A · Deine Antworten als verbindliche Anforderungen

| # | Frage | Deine Antwort | Auswirkung auf Plan |
|---|-------|---------------|----------------------|
| 1 | Pilotsalon | Raum Stuttgart/Ludwigsburg/Freiberg a.N., 3–8 MA | Pilot-Onboarding-Checkliste wird Teil der Design-Phase. Wir suchen aktiv mit dir nach einem Salon ab Design-Tag 1. |
| 2 | Branding | Plattformmarke + Salon-Branding pro Buchungsseite | Salon-Branding (Logo, Farben, Bilder, Beschreibung) ist im **Lean-MVP enthalten**. Voll-White-Label = Phase 3. |
| 3 | Region | DACH, Fokus DE | i18n technisch vorbereitet, aber nur DE-Übersetzung im MVP. Steuersystem nur DE im MVP. |
| 4 | Payment | Stripe OK, aber Provider-neutrale Architektur | Datenmodell enthält `payment_provider`-Abstraktion ab MVP. Konkrete Implementierung erst in Phase 2. |
| 5 | Gastbuchung | Ja, pro Salon einstellbar; min. Name+Email+Tel | Im **Lean-MVP enthalten**. Setting auf Salon-Ebene: `guest_booking_enabled` (bool). |
| 6 | Sprache MVP | DE only, EN später ohne Umbau | `next-intl` + Translation-Keys von Tag 1, aber nur DE-Bundle geliefert. |
| 7 | Datenresidenz | Supabase Frankfurt OK + bitte EU-only-Alternative zeigen | Beide Optionen im "Exit-Strategie"-Abschnitt unten ausgearbeitet. Wir empfehlen Supabase Frankfurt, du entscheidest. |
| 8 | Kapazität | 60–90 Min/Woche + klare Unterlagen vorab | Jeden Freitag bekommst du einen Status-Briefing-Doc (max 1 Seite) bis Donnerstag 12:00 für unseren Slot. |

Diese Antworten werden in `workspace/tickets/TCK-20260513-0001/ticket.yaml` als verbindliche Anforderungen festgehalten und gelten ab Sign-off vertraglich.

---

## Teil B · Die drei MVP-Varianten im Vergleich

### B.1 Vergleichsmatrix (Überblick)

| Dimension | **Lean MVP** (empfohlen) | **Standard MVP** | **Premium MVP** (v1.0) |
|-----------|:------------------------:|:-----------------:|:----------------------:|
| **Ziel** | Pilot mit 1–3 Salons, schneller Lerneffekt | Kommerzieller Start für 10–50 Salons | Enterprise-grade Launch + Audit-ready |
| **Dauer bis Live** | **12 Wochen** (Day 84) | 17 Wochen (Day 119) | 20 Wochen (Day 140) |
| **Effektive FTE** | 3–4 (Teilzeit) | 5–6 (Teilzeit) | 7–8 (Teilzeit) |
| **Kosten Ziel** | **€185.000** | €300.000 | €415.000 |
| **Kosten Cap** | **€235.000** | €355.000 | €485.000 |
| **Maintenance/Monat** | €7.500 | €10.000 | €12.000 |
| **Native Apps** | nein (responsive Web wie PWA) | nein (Phase 2) | nein (Phase 2) |
| **Slot-Engine** | ✅ voll (gleiche Logik in allen Varianten) | ✅ voll | ✅ voll |
| **Salon-Branding** | ✅ (Logo, Farben, Bilder) | ✅ | ✅ |
| **Gastbuchung** | ✅ (pro Salon einstellbar) | ✅ | ✅ |
| **Kundenkonto** | optional | optional + erweiterte Profile | optional + vollständig |
| **Email-Bestätigung + Erinnerung** | ✅ (24h) | ✅ (24h + 2h) | ✅ (24h + 2h + Statusänderungen) |
| **Admin-Dashboard** | ✅ basics | ✅ + Reporting | ✅ + erweitertes Reporting + AAA-A11y |
| **CRM (Kundenliste)** | ✅ minimal (Historie) | ✅ + Notes + No-Show-Counter | ✅ + Tags + Allergien (consent) |
| **Super-Admin** | ✅ basics | ✅ + Tarif-Stubs | ✅ + voll |
| **DSGVO-Tools** | ✅ Export + Löschung | ✅ + Consent-Manager | ✅ + audit-log pro Operation |
| **Tests** | ~70% Coverage, Slot-Engine 100% | ~80%, alle Module 80%+ | ~85%, Property-Tests, Load-Tests |
| **Pen-Test** | nein (interner Review only) | nein (kann nach Launch) | ✅ extern |
| **Accessibility** | WCAG AA-Basis | WCAG AA voll | WCAG AAA wo möglich |
| **Audit-Log pro DB-Operation** | nein (nur kritische Aktionen) | partiell | voll |
| **i18n vorbereitet** | ✅ Keys + DE only | ✅ Keys + DE only | ✅ Keys + DE + EN scaffolding |
| **Pilotsalon-Onboarding-Service** | inkludiert (1 Salon) | inkludiert (bis 3 Salons) | inkludiert (bis 5 Salons) |
| **CLAUDE.md-Gates** | A1/A3/A4 + B1/B5/B6 (6 Gates) | + A2/A5 (8 Gates) | alle 12 Gates |

### B.2 Lean MVP — Details

**Funktionsumfang** (was DRIN ist):
- Auth: Email + Passwort, Passwort-Reset, Rollen (Super-Admin, Salon-Owner, Mitarbeiter, Kunde)
- Mandanten: Multi-Tenancy via Postgres RLS, Subdomain pro Salon
- Salon-Profil: Name, Adresse, Öffnungszeiten, Logo, Farben, 3–10 Bilder, Beschreibung
- Service-Katalog: CRUD Leistungen + Pakete, Dauer, Preis, Skill-Anforderung, Pufferzeit
- Mitarbeiter: CRUD, Skills, Arbeitszeiten, Pausen, Urlaub, Krankheit
- **Slot-Engine**: voll (SERIALIZABLE + GIST exclusion constraint, s. Teil D), inklusive "beliebiger Mitarbeiter" + Lastausgleich
- Buchungsflow: Slot-Auswahl → Buchung → Bestätigung; Storno + Umbuchung innerhalb Salon-Regeln
- Gastbuchung (Name+Email+Tel) oder Kundenkonto, pro Salon einstellbar
- Email-Bestätigung + 24h-Erinnerung via Resend
- Admin-Dashboard: Kalender (Tag/Woche/Monat/Mitarbeiter), CRUD aller Stammdaten, Status-Workflow
- Super-Admin-Grundlage: Salons auflisten, anlegen, suspendieren
- Responsive Web (mobile-first) — auf Mobile fühlt sich die Kundenbuchung wie eine App an (Add-to-Homescreen empfohlen)
- DSGVO-Tools: Kundenexport, Löschung
- 6 von 12 CLAUDE.md-Gates: A1 QA · A3 Quality · A4 Finance · B1 Regression · B5 Customer Sign-Off · B6 Human-in-Loop

**Was bewusst NICHT drin ist** (Phase 2+):
- Native iOS/Android Apps → responsive Web als PWA reicht für Pilot
- Online-Zahlung (Stripe-Integration)
- SMS / WhatsApp / Push-Notifications
- Erinnerung 2h vor Termin (nur 24h-Erinnerung im MVP)
- Multi-Location (1 Salon = 1 Mandant im MVP)
- Bewertungen / Reviews
- Marketing-Automation
- KI-Optimierung
- POS-/Kassensystem-Integration
- Externer Pen-Test (interner Sec-Review only)
- Audit-Log pro DB-Operation (nur kritische Aktionen logged)
- Voll-AAA-Accessibility (AA-Basis im MVP)
- A2 Security / A5 DPIA als formelle Gates (DSGVO-Maßnahmen sind eingebaut, aber nicht audit-fertig dokumentiert)

**Zeitplan** (12 Wochen real = ~12 Sim-Wochen):

| Phase | Dauer | Output |
|-------|:-----:|--------|
| Discovery (jetzt) | 1 Wo | Dieses Dokument + Vertrags-Drafts |
| Design | 2 Wo | Datenmodell-Detail, UI-Wireframes, Slot-Engine-Algorithmus-Spec finalisiert |
| Build | 8 Wo | 4 Sprints: (1) Auth+Mandanten+Profil (2) Slot-Engine+Buchung (3) Admin-Dashboard+Kalender (4) Polish+Pilot-Onboarding-Vorb. |
| Harden | 1 Wo | Lasttest mit synthetischen Buchungen, Pilotsalon-Onboarding |
| Release v1.0 | <1 Wo | Production-Deploy + dein Sign-off (B6) |

**Teamgröße** (3–4 effektive FTE Teilzeit):
- 1× Principal Engineer (Mira #003) — 50%
- 2× Maker Backend+Frontend — 100% (2 Personen aus Pool)
- 1× Designer (Omar #020) — 50%
- 0.5× QA (Lina-Reviewer-Pool)
- 0.25× DevOps + Releaser (Bashir #047)
- 0.25× DPO (Yasmin #017) — DSGVO-Reviews

**Kostenrahmen**:

| Phase | Modell | Betrag (EUR netto) |
|-------|--------|-------------------:|
| Discovery | Fixed | 15.000 |
| Design | Fixed | 25.000 |
| Build | T&M mit Cap | Ziel 130.000 · **Cap 175.000** |
| Harden | Fixed | 15.000 |
| **Summe** | | **Ziel 185.000 · Cap 235.000** |
| Maintenance | Retainer | **7.500 / Monat** |

**Technische Risiken im Lean-Scope**:

| Risiko | Wahrsch. | Wirkung | Mitigation |
|--------|:--------:|:-------:|------------|
| Slot-Engine produziert Doppelbuchung | mittel | **kritisch** | Gleiche Engine wie in Premium — 100% Coverage, SERIALIZABLE + GIST. Identisch in allen Varianten. |
| Pilotsalon-UX überzeugt nicht | mittel | hoch | Enge Pilot-Begleitung (Stand-up wöchentlich mit dem Salon), 2 Iterations-Zyklen geplant |
| Kein Pen-Test → Sec-Lücken | niedrig-mittel | mittel | Interner Sec-Review durch CISO #018, Snyk + Renovate aktiv, OWASP Top 10 Checkliste |
| Skalierung jenseits 5–10 Salons | niedrig | mittel | Bei 5+ Salons → Upgrade zu Standard MVP in Phase 2 (siehe "Erweiterungspfad") |
| DSGVO-Maßnahme reicht nicht für €€-Audit | niedrig | hoch | Lean MVP ist **nicht audit-zertifiziert**. Wenn du SOC2/ISO27001 brauchst, Standard oder Premium wählen |

**Erweiterungspfad** (was später einfach ergänzt werden kann ohne Big-Bang-Rewrite):
- Native Apps via Expo: ~6 Wochen / €80k (gleiche Codebase, neue Wrapper)
- Stripe + SCA: ~3 Wochen / €40k (Datenmodell ist ab MVP vorbereitet)
- 2h-Erinnerung: ~1 Woche / €8k (gleiche Worker, anderer Cron)
- Reporting: ~3 Wochen / €35k (eigenes Modul oberhalb der bestehenden DB)
- Multi-Location: ~4 Wochen / €50k (Schema-Erweiterung um `locations` unter `tenants`)
- Externer Pen-Test: ~2 Wochen / €15k (Bestellung extern)

→ Vom Lean MVP zum Premium-Stand kostet zusätzlich ~€230–270k über 4–6 Monate, falls Pilot funktioniert.

### B.3 Standard MVP — Details

**Was zusätzlich zu Lean drin ist:**
- Erweiterte Kundenkonten (Profilbild, Präferenzen, bevorzugter Mitarbeiter)
- Erweitertes CRM: Notes, No-Show-Counter, Tags, einfache Segmentierung
- 2h-Erinnerung zusätzlich zur 24h
- Status-Änderungs-Benachrichtigungen (Storno, Umbuchung, Bestätigung)
- Basic Reporting für Salon-Owner (Buchungszahlen, Auslastung, Top-Leistungen, Umsatz)
- Bessere Admin-UX (Drag-and-Drop, Suche, Filter)
- Voll WCAG AA
- A2 Security + A5 DPIA als formelle Gates → DPIA-Dokument liegt vor, AVVs unterschrieben

**Was rausbleibt**: Native Apps, Online-Zahlung (Phase 2)

**Zeitplan**: 17 Wochen (Discovery 1.5 + Design 2.5 + Build 11 + Harden 1.5 + Release 0.5)

**Team**: 5–6 effektive FTE (zusätzlich 1× Frontend für Polish + 0.5× weiteres QA)

**Kosten**: Ziel **€300.000** · Cap **€355.000** · Retainer **€10.000 / Monat**

### B.4 Premium MVP — Details (Wiederholung aus v1)

Wie in der ersten Discovery-Antwort. Wichtig: native Apps sind auch in Premium noch nicht drin — die kommen explizit in Phase 2 (ab ~Woche 21).

**Zeitplan**: 20 Wochen
**Team**: 7–8 FTE Teilzeit
**Kosten**: Ziel **€415.000** · Cap **€485.000** · Retainer **€12.000 / Monat**

---

## Teil C · MVP-Scope-Liste & Nicht-MVP-Liste (kanonisch, gilt für die gewählte Variante)

Bitte einen der drei Scopes auswählen — die folgende Liste zeigt die LEAN-Variante als unsere Empfehlung. Für Standard und Premium siehe die jeweiligen "+"-Ergänzungen in §B.

### C.1 MVP-Scope (Lean — drin)

✅ Auth (Email/Passwort, Rollen, Passwort-Reset)
✅ Multi-Tenancy (Postgres RLS, Salon-Subdomain)
✅ Salon-Profil (Name, Adresse, Öffnungszeiten, Logo, Farben, Bilder, Beschreibung)
✅ Leistungen + Pakete (CRUD, Dauer, Preis, Skill, Pufferzeit)
✅ Mitarbeiter (CRUD, Skills, Arbeitszeiten, Pausen, Urlaub)
✅ Slot-Engine (voll, transaktional, server-authoritative, alle Constraints)
✅ Buchungsflow (Slot wählen, buchen, stornieren, umbuchen)
✅ Gastbuchung (einstellbar pro Salon)
✅ Kundenkonto (optional, mit Buchungshistorie)
✅ Email-Bestätigung + 24h-Erinnerung
✅ Admin-Dashboard mit Kalender (Tag/Woche/Monat/Mitarbeiter) + Drag-and-Drop
✅ Status-Workflow (gebucht→bestätigt→erschienen→bezahlt→storniert)
✅ Kundenliste mit Historie
✅ Super-Admin-Basis (Salon anlegen/suspendieren)
✅ Responsive Web (mobile-first, PWA-tauglich)
✅ Salon-Branding pro Buchungsseite (Logo, Farben, Bilder)
✅ DSGVO-Tools (Datenexport, Löschung, Consent-Banner)
✅ Salon-Einstellungen (Vorlaufzeit, Storno-Regeln, Buchungsfenster)
✅ Audit-Log für kritische Aktionen (Login, Buchung, Stammdaten-Änderungen)
✅ DE-Sprache (i18n-Keys bereit für später)
✅ Pilotsalon-Onboarding (1 Salon inklusive)

### C.2 Nicht-MVP-Liste (Lean — DRAUSSEN, kommt später)

❌ Native iOS-App (Phase 2)
❌ Native Android-App (Phase 2)
❌ Mitarbeiter-App (Phase 3)
❌ Online-Zahlung (Stripe, Mollie) (Phase 2)
❌ Anzahlung / Storno-Gebühren (Phase 2)
❌ Gutscheine / Pakete-Verkauf / Abos (Phase 2)
❌ Rechnungen / Belege (Phase 2)
❌ SMS-Erinnerung (Phase 2, kostenpflichtig pro Nachricht)
❌ WhatsApp-Erinnerung (Phase 2)
❌ Push-Notifications (Phase 2, braucht native Apps)
❌ 2h-vor-Termin-Erinnerung (Standard MVP)
❌ Bewertungen / Reviews (Phase 3)
❌ Marketing-Automation (Phase 3)
❌ Kundenbindungsprogramme / Treuepunkte (Phase 3)
❌ Multi-Location pro Salon (Phase 3)
❌ POS-/Kassensystem-Anbindung (Phase 4)
❌ KI-gestützte Terminoptimierung (Phase 4)
❌ KI-No-Show-Vorhersage (Phase 4)
❌ Allergien-Feld (Special-Category-Data, Standard MVP mit Extra-Consent)
❌ Reporting / Statistik (Standard MVP)
❌ Tarif-Verwaltung / Stripe-Billing für Plattform (Phase 2)
❌ Custom Domain pro Salon (Phase 2)
❌ Wartelisten-Feature (Phase 3)
❌ Externer Pen-Test (Standard MVP)
❌ SOC 2 / ISO 27001 / B-Corp (Phase 3)
❌ Vollständige WCAG AAA (Premium MVP)
❌ EN-Sprache fertig (Standard MVP, EN-Strings im MVP nur als Scaffold)

---

## Teil D · Datenmodell (grob visualisiert)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         tenants (= Salons)                            │
│   id · slug (subdomain) · name · plan · created_at · status           │
└────┬────────────────────────────────────────────────────────────────┘
     │ 1:1
     ├──> salon_profile (name, address, hours_template, logo_url, colors_jsonb, description, settings_jsonb)
     │
     ├──> staff ──────────────────────┬───> staff_skills (n:m → skills)
     │   id · tenant_id · name · …    ├───> working_hours (weekday, start, end)
     │                                ├───> staff_breaks (weekday, start, end)
     │                                ├───> time_off (start_at, end_at, type: vacation|sick|personal)
     │                                └───> staff_calendar (DENORMALIZED · staff_id · ts_range · booking_id)
     │                                                     ↑ GIST exclusion constraint here
     │
     ├──> services ──────────┬───> service_skills (n:m → skills)
     │   id · tenant_id ·    ├───> service_pricing (variants)
     │   duration · price ·  └───> service_visibility (online|internal)
     │   buffer_before/after
     │
     ├──> packages ──> package_services (n:m, with order)
     │
     ├──> customers ───────────┬───> consents (marketing, allergies, special)
     │   id · tenant_id ·       ├───> customer_tags (n:m)
     │   guest|registered ·     ├───> bookings (history)
     │   email · phone · name   └───> no_show_count
     │
     ├──> bookings ─────────────────┬───> booking_services (n:m for packages)
     │   id · tenant_id ·            ├───> booking_status_history (audit, append-only)
     │   customer_id · staff_id ·    └───> notifications_sent (when, channel, status)
     │   starts_at · ends_at ·
     │   status · price_eur ·
     │   payment_status · …
     │
     ├──> notifications (queue: when, to, channel, template, payload)
     │
     ├──> audit_log (tenant_id, actor, action, target_table, target_id, diff_jsonb, at)
     │   ↑ alle kritischen Aktionen
     │
     └──> super_admin_log (no tenant_id, system-wide)
```

**Mandantentrennung**: Jede Tabelle (außer `super_admin_log`) hat `tenant_id` FK + Postgres RLS-Policy `tenant_id = current_setting('app.tenant_id')::uuid`. JWT setzt `app.tenant_id` beim Request-Start.

**Skill-System**: zentrale Tabelle `skills` (z.B. "Haarschnitt Damen", "Färben", "Bart") mit n:m-Beziehung zu Mitarbeiter (Wer kann?) und Service (Wofür gebraucht?). Slot-Engine matcht über die `skills`.

---

## Teil E · Slot-Engine-Spezifikation

### E.1 API

```
GET  /api/v1/availability
  ?salon_id=...
  &service_or_package_id=...
  &staff_preference=any|specific:<id>
  &start=2026-06-01T00:00:00Z
  &end=2026-06-07T23:59:59Z
  &timezone=Europe/Berlin
→ 200 OK [
    { staff_id, starts_at, ends_at, duration_min },
    …
  ]

POST /api/v1/bookings
  body: { salon_id, service_or_package_id, staff_id|null, starts_at,
          customer: { id|guest_data }, idempotency_key }
→ 201 Created { booking_id, confirmation_url, calendar_ics_url }
→ 409 Conflict (slot taken since availability check) + alternatives[]
```

### E.2 Algorithmus `getAvailableSlots(...)`

```
1. eligibleStaff = staff WHERE tenant_id = $1
                   AND active = true
                   AND skills ⊇ service.required_skills
                   AND staff_id MATCHES preference
2. workingWindows = for each eligible staff member:
       (opening_hours ∩ staff.working_hours) \ (staff.breaks ∪ staff.time_off)
3. existingBookings = lookup overlapping bookings + buffers
4. for each working window, slot every 5 min:
     candidate = (staff, start, start + service.duration + buffer_after)
     skip if candidate overlaps existingBookings OR window boundary
5. score each candidate by:
     - load balance: prefer staff with fewer bookings today
     - proximity: prefer slots adjacent to other bookings (avoid gaps)
     - customer preference: explicit staff > any
6. return top-N (default 5)
```

### E.3 Buchungs-Commit (transaktional)

```sql
BEGIN ISOLATION LEVEL SERIALIZABLE;

-- Re-verify availability with lock
INSERT INTO staff_calendar (tenant_id, staff_id, ts_range, booking_id)
VALUES ($1, $2, tsrange($3, $4), gen_random_uuid())
RETURNING booking_id;
-- ↑ GIST EXCLUDE constraint will REJECT if any overlap exists

-- Create booking
INSERT INTO bookings (id, tenant_id, customer_id, staff_id, service_id,
                      starts_at, ends_at, status, price_eur, …)
VALUES (...)
RETURNING id;

COMMIT;
```

**Schema-Garantie** (auf DB-Ebene, letzte Verteidigungslinie):
```sql
ALTER TABLE staff_calendar
  ADD CONSTRAINT no_overlap_per_staff
  EXCLUDE USING GIST (
    tenant_id WITH =,
    staff_id  WITH =,
    ts_range  WITH &&
  );
```

→ Selbst wenn die Applikationslogik komplett versagen würde, kann die Datenbank physikalisch keine zwei überlappenden Buchungen für denselben Mitarbeiter haben.

### E.4 Race-Condition-Verhalten

- Zwei Kunden tippen "Buchen" zur exakt gleichen Millisekunde: einer bekommt `201 Created`, der andere bekommt `409 Conflict` mit den nächsten freien Slots.
- Bei `409` schlagen wir automatisch 3 Alternativen vor (gleicher Mitarbeiter +15min, anderer Mitarbeiter gleiche Zeit, gleicher Mitarbeiter nächstmöglich).
- Idempotency-Key verhindert Doppel-Buchung beim Klick-Stuttering.

### E.5 Tests (in jeder Variante)

- 50+ Unit-Tests (Skills, Zeitfenster, Pufferzeiten, Pausen, Urlaub)
- 20+ Integration-Tests gegen echte Postgres-DB
- 10+ Concurrency-Tests (parallele Buchungsversuche via `pgbench`)
- Property-based Tests: 1000 zufällige Konfigurationen pro CI-Run
- Pre-Production: 10.000 simulierte Concurrent Bookings als Last-Test

### E.6 Performance-Ziele

- Availability-Query: < 200ms p95 für 7-Tage-Range
- Booking-Commit: < 500ms p99
- Skaliert linear bis ~50 Mitarbeiter pro Salon, ~5.000 Buchungen/Monat pro Salon

---

## Teil F · Rechte- und Rollenmodell

| Rolle | Erstellen | Lesen | Aktualisieren | Löschen | Buchen | Bezahlen | Admin |
|-------|:---------:|:-----:|:-------------:|:-------:|:------:|:--------:|:-----:|
| **Super Admin** (Plattformbetreiber, du) | alle Tenants | alle Daten | alle Daten | alle Daten (mit Audit) | nein | nein | alles |
| **Salon Owner** | eigene Stammdaten | eigener Tenant | eigene Stammdaten | eigene Stammdaten | im Namen | optional | eigener Tenant |
| **Mitarbeiter (Staff)** | eigene Verfügbarkeit | eigener Tenant, eigener Kalender + Kundennotizen (falls erlaubt) | eigene Verfügbarkeit + Termin-Status | nein | eigene Termine | nein | nein |
| **Kunde (registriert)** | eigene Buchungen | eigene Buchungen + Salon-Info | eigene Buchungen + eigenes Profil | eigene Buchungen (storno) | eigene | ja (Phase 2) | nein |
| **Kunde (Gast)** | nur diese Buchung | nur diese Buchung (via Magic-Link) | nur diese Buchung | nur diese Buchung (storno) | nur diese | ja (Phase 2) | nein |

**Implementation**: jede Tabelle hat eine RLS-Policy pro Rolle. JWT enthält `tenant_id`, `role`, `user_id`. Tests stellen sicher, dass Cross-Tenant- und Cross-Role-Zugriffe abgewiesen werden.

**Sonderfall "Mitarbeiter sehen Kundennotizen"**: Salon-Owner kann pro Mitarbeiter ein Flag `can_read_customer_notes` setzen.

---

## Teil G · Kostenaufteilung nach Modulen (Lean MVP)

| Modul | Aufwand (Person-Wochen) | Anteil Build-Budget | EUR (Ziel) |
|-------|:------------------------:|:--------------------:|-----------:|
| Auth + Identität | 1.5 | 5% | 6.500 |
| Multi-Tenancy + RLS | 2.0 | 6% | 7.800 |
| Salon-Profil + Branding | 2.0 | 6% | 7.800 |
| Service-Katalog | 1.5 | 5% | 6.500 |
| Mitarbeiterverwaltung | 2.5 | 8% | 10.400 |
| **Slot-Engine** | **6.0** | **20%** | **26.000** |
| Buchungsflow (Kunde) | 3.0 | 10% | 13.000 |
| Admin-Kalender + Drag-Drop | 3.5 | 12% | 15.600 |
| Admin-Stammdaten-UI | 2.0 | 7% | 9.100 |
| Email-Benachrichtigungen | 1.5 | 5% | 6.500 |
| Kundenkonto + Historie | 1.5 | 5% | 6.500 |
| Super-Admin-Basis | 1.0 | 3% | 3.900 |
| DSGVO-Tools | 1.5 | 5% | 6.500 |
| i18n + DE-Übersetzung | 1.0 | 3% | 3.900 |
| **Summe Build** | **30 PW** | **100%** | **130.000** |
| Discovery (separat) | | | 15.000 |
| Design (separat) | | | 25.000 |
| Harden (separat) | | | 15.000 |
| **Total Lean MVP** | | | **185.000** |

→ Slot-Engine ist mit 20% des Build-Budgets der größte Brocken — und korrekt so, weil es das geschäftskritische Modul ist.

---

## Teil H · Exit-Strategie (Supabase + Vercel ersetzbar machen)

### H.1 Lock-in-Bewertung

| Komponente | Lock-in-Grad | Ersatz | Migrations-Aufwand |
|------------|:------------:|--------|:------------------:|
| **Supabase (Postgres)** | niedrig | Neon, Crunchy, AWS RDS, self-hosted Postgres | 1–2 Wochen (DB-Dump + Schema) |
| **Supabase Auth** | mittel | Auth0, Clerk, NextAuth, self-hosted Keycloak | 2–4 Wochen (User-Migration) |
| **Supabase Storage** | niedrig | S3, R2, Backblaze | 1 Woche (Bucket-Sync) |
| **Supabase RLS** | niedrig | Standard Postgres-Feature, läuft überall | 0 (pure SQL) |
| **Supabase Realtime** | mittel (im MVP nicht genutzt) | Pusher, Ably, eigener WebSocket | nicht relevant für MVP |
| **Vercel** | niedrig | Cloudflare Pages, Netlify, AWS (ECS/Lambda), eigener Server | 1 Woche (Next.js läuft überall) |
| **Resend** | sehr niedrig | Postmark, AWS SES, Sendgrid | 2 Tage (API-Wechsel) |

**Wir entwerfen die Codebase so, dass ALLE Provider-spezifischen Aufrufe in `lib/providers/` gekapselt sind.** Dort liegen Interfaces:
- `IDatabase` (gerade Supabase, könnte Drizzle direkt sein)
- `IAuth` (gerade Supabase Auth)
- `IStorage` (gerade Supabase Storage)
- `IEmail` (gerade Resend)
- `IPayment` (gerade Stub, später Stripe oder Mollie)

→ Ein Wechsel ist **immer eine neue Implementation der Interface**, niemals ein Rewrite der Business-Logik.

### H.2 EU-only-Alternative (Anforderung Q7)

| Aspekt | Supabase Frankfurt (Empfehlung) | EU-only-Stack (z.B. Scaleway + Auth0 EU) |
|--------|:--------------------------------:|:------------------------------------------:|
| Hosting Postgres | Supabase EU Region (Frankfurt) — DE-Server, US-Mutter (AVV vorhanden) | Scaleway EU oder Aiven (EU-only) — keine US-Beteiligung |
| Auth | Supabase Auth (EU Region) | Auth0 EU oder eigene Implementation (NextAuth + DB) |
| Hosting App | Vercel (EU-Region) — US-Mutter | OVHcloud / Scaleway / Hetzner — keine US-Beteiligung |
| Email | Resend (EU Region) — US-Mutter | Mailjet (FR) — EU-only |
| **MVP-Kosten-Auswirkung** | Lean €185k (Basis) | Lean **€215k–230k** (+€30–45k = +16–24%) |
| **MVP-Zeit-Auswirkung** | 12 Wochen | **14 Wochen** (+2 Wochen für eigene Auth + Scaleway-Setup) |
| **DSGVO-Position** | klar konform, Standard-AVVs | etwas stärker (kein Schrems-II-Risiko) |
| **Operativ-Wartung** | einfacher (Supabase managed) | manueller (mehr Self-Hosting) |
| **Empfehlung** | ✅ für 95% aller Use-Cases | ✅ wenn explizite Vorgaben (z.B. öffentlicher Sektor) |

**Unsere Empfehlung**: Supabase Frankfurt. Schrems-II-Risiko bei EU-Sub mit US-Mutter ist nach aktuellem Rechts-Stand (Trans-Atlantic Data Privacy Framework, gültig seit 2023) **gering**. Falls du später öffentliche Aufträge oder Behörden-Kunden bedienen willst, ist die Migration zum EU-only-Stack jederzeit machbar (siehe H.1).

---

## Teil I · Eigentum von Code, Marke und Produktrechten

| Asset | Eigentümer ab Sign-off | Begründung / Vertragsklausel |
|-------|:-----------------------:|------------------------------|
| **Quellcode** | **du, Belkis Aslani** | IP-Assignment im MSA: "Work-for-hire". Korynth Labs überträgt sämtliche Urheberrechte (soweit übertragbar) und alle Verwertungsrechte uneingeschränkt an dich, zeitlich und räumlich unbeschränkt. |
| **Datenbankschema + Migrations** | du | Teil des Codes. |
| **Designs (Figma-Files, Wireframes, Brand-Assets)** | du | IP-Assignment auch auf Designs. |
| **Plattformname / Marke / Logo** | **du** | wenn du eine eigene Marke wählst (z.B. "Salonzeit", "Korynth Bookings"), gehört die Marke dir. Korynth Labs unterstützt die Markenanmeldung beim DPMA optional. |
| **Konten bei Sub-Processors** (Supabase, Vercel, Stripe, etc.) | **du** | wir bauen die Plattform IN DEINEN Accounts. Du behältst Vendor-Beziehung + Zugang. |
| **Dokumentation (ADRs, Architecture-Docs, Runbooks)** | du | Teil des Lieferumfangs. |
| **Generische Patterns + Bibliotheken** (z.B. Slot-Engine-Algorithmus an sich) | Korynth Labs (mit Lizenz an dich) | Korynth Labs darf das Slot-Engine-Pattern in zukünftigen Projekten wieder verwenden, aber NICHT deine spezifische Implementation, deine Brand oder deine Daten. |
| **Deine Salon-Pilot-Vertragsbeziehungen** | du | Korynth Labs ist nie Partei der B2B-Verträge mit deinen Salons. |
| **Daten der Endkunden** | Salon (Verantwortlicher) → du (Auftragsverarbeiter) | DSGVO-Standard für SaaS. Detail in DPA. |

**Quintessenz**: Du bist Eigentümer ALLER projekt-spezifischen Assets. Korynth Labs ist ausschließlich Dienstleister.

---

## Teil J · Zahlungsplan nach Meilensteinen (Lean-MVP-Beispiel)

| # | Meilenstein | Sim-Tag | Anteil | Betrag (EUR) |
|---|-------------|---------|:------:|-------------:|
| 1 | Vertragsunterzeichnung (MSA+SOW+DPA+IP) → Start Design | Day 7 | 15% | 27.750 |
| 2 | Design-Phase Abschluss + Sign-off Datenmodell + Slot-Engine-Spec | Day 21 | 15% | 27.750 |
| 3 | Sprint 1 Abnahme (Auth + Mandanten + Salon-Profil + Service-Katalog) | Day 35 | 12.5% | 23.125 |
| 4 | Sprint 2 Abnahme (Slot-Engine + Buchung end-to-end mit Test-Salon) — **Meilenstein-Demo** | Day 49 | 15% | 27.750 |
| 5 | Sprint 3 Abnahme (Admin-Dashboard + Kalender + Status-Workflow) | Day 63 | 12.5% | 23.125 |
| 6 | Sprint 4 Abnahme (Polish + Pilotsalon-Onboarding-Vorb.) | Day 77 | 12.5% | 23.125 |
| 7 | Harden Abnahme (Lasttest grün + Pilot-Salon eingerichtet) | Day 84 | 7.5% | 13.875 |
| 8 | **Release v1.0 + Sign-off durch dich (B6)** | Day 84 | 10% | 18.500 |
| | **Summe** | | **100%** | **185.000** |

Zahlung jeweils 14 Tage netto nach Meilenstein-Abnahme. Bei Standard MVP und Premium MVP analog skaliert mit gleichen Prozentsätzen.

Maintenance-Retainer: monatlich nachschüssig, beginnt im Monat nach Release.

**Geld-zurück-Klausel**: bei Verfehlen eines Meilensteins um mehr als 14 Sim-Tage ohne von dir genehmigtem Change-Request können wir den Meilenstein neu verhandeln oder du kannst den Vertrag mit anteiliger Rückerstattung des nicht erbrachten Teils kündigen.

---

## Teil K · Abnahmekriterien pro Phase

### K.1 Discovery (jetzt — diese Antwort ist der Output)

✅ Diese drei Dokumente liegen vor: dieses Doc + ursprünglicher Discovery-Output (v1) + Triage-Doc
✅ Du hast die offenen Fragen beantwortet (E-Mail vom 13.05.2026)
✅ Eine Variante ist von dir gewählt
✅ Vertrags-Drafts hinterlegt in `legal/contracts/per-ticket-contracts/TCK-20260513-0001/`

**Sign-off-Aktion**: E-Mail mit "Go für Variante X" + unterschriebene Verträge.

### K.2 Design

Output:
- Vollständiges Datenmodell (ER-Diagramm + DDL-Skript)
- Slot-Engine-Algorithmus in `02-discovery/slot-engine-final-spec.md` mit Pseudocode + SQL + Tests-Plan
- UI-Wireframes (Figma-Link) für Kunde-Web + Admin-Dashboard
- ADRs (Architecture Decision Records) zu: Stack-Wahl, Multi-Tenancy-Modell, Auth-Provider, Email-Provider, Payment-Abstraction
- DPIA-Dokument (DSGVO Art. 35) (ab Standard MVP zwingend)

**Sign-off-Aktion**: E-Mail mit "Design freigegeben".

### K.3 Build (pro Sprint)

Jeder Sprint endet mit:
- alle geplanten Tickets in der Sprint-Liste auf "done"
- A1 QA + A3 Quality + A4 Finance Gates grün
- Demo-Video (5 Min) + schriftlicher Sprint-Report
- Test-Salon-Daten zeigen: alle geplanten Flows funktionieren

**Sign-off-Aktion**: E-Mail mit "Sprint X abgenommen" (oder Liste von Fixes).

### K.4 Harden

Output:
- Pen-Test-Report (nur Standard und Premium) oder Sec-Review-Report (Lean)
- Lasttest-Ergebnisse (10.000 simulierte Buchungen ohne Doppelbuchung)
- Pilotsalon vollständig eingerichtet mit Live-Daten
- Runbook für Incidents

**Sign-off-Aktion**: E-Mail "Harden abgenommen, Release-Freigabe erteilt".

### K.5 Release v1.0

**Voraussetzungen (alle Gates)**:
- B1 Regression ✓
- B2 Privacy ✓
- B3 Compliance ✓
- B4 UX Acceptance ✓
- B5 Customer Sign-Off ← **deine Aktion**
- B6 Human-in-Loop ← **deine Aktion**

Output:
- Production-URL live
- Erste Test-Buchung dokumentiert
- Onboarding-Email an Pilot-Salon
- NPS-Mail-Trigger aktiv

**Sign-off-Aktion**: B6-Approval per E-Mail oder Dashboard-Button.

---

## Teil L · Empfehlung

Wir empfehlen die **Lean MVP**-Variante. Drei Gründe:

1. **Risiko-Management**: Bei einer noch nicht validierten Idee ist ein 12-Wochen-Pilot mit €185k sinnvoller als 20 Wochen mit €415k. Falls der erste Pilot-Salon das System nicht annimmt, ist der Verlust überschaubar.
2. **Lerneffekt**: Du bekommst nach 12 Wochen echte Salon-Daten, echte Kunden, echte Nutzungsmuster. Diese Daten lenken die Phase-2-Investitionen viel präziser als jede Antizipation.
3. **Erweiterungspfad ist günstig**: Vom Lean MVP zum Standard- oder Premium-Stand kostet ~€100–270k zusätzlich verteilt über 4–6 Monate — und du machst das mit echten Daten, nicht im Vorausgriff.

**Konkreter Plan, falls du Lean wählst**:

| Phase | Sim-Wochen | Output | Kosten |
|-------|:----------:|--------|-------:|
| Discovery + Design | 3 | Vertrags-Sign-off, Datenmodell, Slot-Engine-Spec, Wireframes | €40k |
| Build | 8 | Lauffähige Plattform, 1 Pilotsalon eingerichtet | €130k (Ziel), €175k (Cap) |
| Harden + Release v1.0 | 1 | Production live, erste echte Buchung | €15k |
| **MVP Total** | **12** | | **€185k Ziel · €235k Cap** |
| Maintenance (ab Release) | - | Hosting + Support + Mini-Features | €7.500 / Mo |

Danach (Monat 4+): wir lernen mit dir + Pilot, planen Phase 2 (z.B. native Apps, Stripe) auf Basis echter Nutzungssignale.

---

## Teil M · Nächste Schritte

1. **Antwort von dir**, welche Variante du willst (oder ob du noch Anpassungen brauchst).
2. **Wir entwerfen die Verträge** (MSA + SOW + DPA + IP-Assignment) — Drafts liegen 5 Sim-Tage nach deiner Wahl.
3. **Discovery-Sign-off + Vertragsunterschrift** = Meilenstein 1 → Design startet.
4. **Wöchentliche Status-Slots** ab Design-Start, Donnerstag 12:00 Status-Doc, Freitag Slot.

Falls noch Fragen oder Änderungswünsche bestehen — gib einfach in der nächsten Antwort Bescheid, wir iterieren V3.

---

Mit besten Grüßen,
das Korynth-Labs-Team

— *003 Mira Lundberg* (Principal Engineer / Discovery Lead)
— *002 Jonas Weber* (CTO)
— *049 Niko Korhonen* (CFO)
— *017 Yasmin El-Sayed* (DPO)
— *005 Eilidh MacKenzie* (AI Research Lead)
— *027 Devil's Advocate* (independent review · "Empfehlung Lean MVP geprüft + bestätigt — die Slot-Engine ist gleichermaßen risikoarm wie in Premium, weil der Algorithmus identisch ist")
— *021 Priya Sharma* (Account Manager, deine Ansprechperson)

---

*Dokument: `workspace/tickets/TCK-20260513-0001/02-discovery/v2-three-variants-and-supporting-docs.md`*
*Antwortet auf: `workspace/communication/inbox/EM-2026-05-13T19-05-00Z-principal-reply-v1.md`*
*Audit-Log: triage_updated · discovery_v2_complete · proposal_sent (alle in dieser Session)*

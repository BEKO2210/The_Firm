---
document: "Slot-Engine Final Spec"
ticket: "TCK-20260513-0001"
parent: "SOW-001"
version: "1.0 — Draft"
status: "DRAFT (final spec wird in Design-Phase verfeinert)"
language: "de"
critical_module: true
---

# Slot-Engine · Finale technische Spezifikation

Anlage 7 zum MSA · TCK-20260513-0001 · Critical Module

---

## 1. Zweck

Die Slot-Engine ist der **technische Kern** der Plattform. Sie beantwortet zwei Fragen:

1. **Welche Zeitfenster sind buchbar?** (read path)
2. **Kann ich diese Buchung jetzt durchführen, ohne dass Doppelbuchungen entstehen?** (write path)

Sie ist server-authoritativ, transaktional, und unter Last gegen Race Conditions abgesichert.

---

## 2. Datenmodell (Auszug, relevant für Slot-Engine)

```sql
-- Mitarbeiter und ihre Fähigkeiten
CREATE TABLE skills (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  name            text NOT NULL,
  UNIQUE(tenant_id, name)
);

CREATE TABLE staff (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  name            text NOT NULL,
  active          boolean NOT NULL DEFAULT true,
  ...
);

CREATE TABLE staff_skills (
  staff_id        uuid NOT NULL REFERENCES staff(id),
  skill_id        uuid NOT NULL REFERENCES skills(id),
  PRIMARY KEY (staff_id, skill_id)
);

CREATE TABLE staff_working_hours (
  staff_id        uuid NOT NULL REFERENCES staff(id),
  weekday         smallint NOT NULL,  -- 0=Mo .. 6=So
  start_time      time NOT NULL,
  end_time        time NOT NULL,
  PRIMARY KEY (staff_id, weekday, start_time)
);

CREATE TABLE staff_breaks (
  staff_id        uuid NOT NULL REFERENCES staff(id),
  weekday         smallint NOT NULL,
  start_time      time NOT NULL,
  end_time        time NOT NULL,
  PRIMARY KEY (staff_id, weekday, start_time)
);

CREATE TABLE staff_time_off (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id        uuid NOT NULL REFERENCES staff(id),
  starts_at       timestamptz NOT NULL,
  ends_at         timestamptz NOT NULL,
  type            text NOT NULL CHECK (type IN ('vacation','sick','personal')),
  CONSTRAINT valid_range CHECK (ends_at > starts_at)
);

-- Services und Pakete
CREATE TABLE services (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  name            text NOT NULL,
  duration_min    smallint NOT NULL CHECK (duration_min > 0),
  buffer_before   smallint NOT NULL DEFAULT 0,
  buffer_after    smallint NOT NULL DEFAULT 0,
  price_eur       numeric(10,2) NOT NULL,
  ...
);

CREATE TABLE service_required_skills (
  service_id      uuid NOT NULL REFERENCES services(id),
  skill_id        uuid NOT NULL REFERENCES skills(id),
  PRIMARY KEY (service_id, skill_id)
);

-- Denormalisierter Kalender (Performance + Garantie)
CREATE TABLE staff_calendar (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  staff_id        uuid NOT NULL REFERENCES staff(id),
  ts_range        tstzrange NOT NULL,
  booking_id      uuid REFERENCES bookings(id),  -- null = block (break/vacation)
  block_type      text CHECK (block_type IN ('booking','vacation','break','sick','other'))
);

-- KERNGARANTIE: keine zwei überlappenden Slots pro Mitarbeiter
ALTER TABLE staff_calendar
  ADD CONSTRAINT no_overlap_per_staff
  EXCLUDE USING GIST (
    tenant_id WITH =,
    staff_id  WITH =,
    ts_range  WITH &&
  );
```

Diese GIST EXCLUDE Constraint ist die **physikalische Garantie** auf Datenbankebene: Die DB lehnt jede INSERT-Operation ab, die zu einer Überlappung führen würde. Selbst bei kompletter Anwendungsfehlerhaftigkeit kann nichts doppelt gebucht werden.

---

## 3. Read Path: `getAvailableSlots()`

### 3.1 API

```ts
POST /api/v1/availability
{
  tenant_id:          uuid,
  service_or_package_id: uuid,
  staff_preference:   "any" | { specific: uuid },
  range_start:        ISO 8601,
  range_end:          ISO 8601,
  timezone:           "Europe/Berlin"
}
→ 200 OK
[
  {
    staff_id:    uuid,
    staff_name:  string,
    starts_at:   ISO 8601,
    ends_at:     ISO 8601,
    duration_min: number,
    score:       number  // optional: 0..100, höher = empfohlener
  }
]
```

### 3.2 Algorithmus (Pseudocode)

```
function getAvailableSlots(req):
  # 1. Kandidaten-Mitarbeiter ermitteln
  service = lookup(req.service_or_package_id)
  required_skills = service.required_skills

  if req.staff_preference == "any":
    eligible = staff
              .where(tenant_id == req.tenant_id)
              .where(active == true)
              .where(skills ⊇ required_skills)
  else:
    eligible = [lookup_staff(req.staff_preference.specific)]
    if not eligible[0].skills.contains_all(required_skills):
      return []

  # 2. Working-Windows pro Mitarbeiter im Range berechnen
  candidates = []
  for s in eligible:
    windows = (s.working_hours_in_range(req.range_start, req.range_end)
               minus s.breaks
               minus s.time_off
               minus s.calendar_blocks  # bereits gebucht
               intersect tenant.opening_hours
               minus tenant.holidays)

    # 3. Slots in 5-Min-Schritten generieren
    for w in windows:
      ts = w.start
      while ts + service.total_duration <= w.end:
        if no_conflict(s, ts, service.total_duration):
          candidates.append({
            staff: s,
            start: ts,
            end:   ts + service.duration_min,
            score: scoring(s, ts)
          })
        ts += 5_min

  # 4. Sortieren + Top-N
  candidates.sort_by(score desc, start asc)
  return candidates.first(20)


function no_conflict(staff, ts, duration_total):
  range = (ts - buffer_before, ts + duration + buffer_after)
  return not exists(staff_calendar where
    staff_id == staff.id and
    ts_range overlaps range)


function scoring(staff, ts):
  # Load balance: bevorzuge Mitarbeiter mit weniger Buchungen heute
  load = bookings_today(staff)  # 0..N
  load_score = max(0, 100 - load * 10)

  # Gap-Minimization: bevorzuge Slots, die direkt an existing-bookings angrenzen
  gap_score = if (ts adjacent_to existing_booking(staff)) 20 else 0

  # Earliest-first für Customer-Convenience
  recency_score = max(0, 50 - hours_from_now(ts) / 2)

  return load_score * 0.5 + gap_score + recency_score
```

### 3.3 Performance-Ziele

- p50 < 80 ms · p95 < 200 ms · p99 < 500 ms (für 7-Tage-Range, 10 Mitarbeiter)
- Skaliert linear bis 50 Mitarbeiter / Salon
- Caching: kein Caching, da Konsistenz wichtiger als Latenz; Performance kommt aus Indexen + RLS-optimierten Queries

### 3.4 Indizes

```sql
CREATE INDEX idx_staff_calendar_lookup
  ON staff_calendar USING GIST (tenant_id, staff_id, ts_range);

CREATE INDEX idx_staff_active
  ON staff (tenant_id, active);

CREATE INDEX idx_staff_skills_lookup
  ON staff_skills (staff_id, skill_id);

CREATE INDEX idx_service_required_skills_lookup
  ON service_required_skills (service_id, skill_id);
```

---

## 4. Write Path: `createBooking()` — Transaktional und konflikt-sicher

### 4.1 API

```ts
POST /api/v1/bookings
{
  idempotency_key:    uuid,  // PFLICHT — verhindert Doppel-POST
  tenant_id:          uuid,
  service_or_package_id: uuid,
  staff_id:           uuid | null,  // null = "any", System wählt
  starts_at:          ISO 8601,
  customer: {
    type: "registered" | "guest",
    id_or_data: ...
  }
}
→ 201 Created { booking_id, confirmation_url, ics_url }
→ 409 Conflict  { reason: "slot_taken", alternatives: [3 nearest slots] }
→ 422 Unprocessable Entity { reason: "..." }
```

### 4.2 SQL Commit-Sequenz

```sql
BEGIN ISOLATION LEVEL SERIALIZABLE;

-- 1. Idempotency check
INSERT INTO booking_attempts (idempotency_key, tenant_id, status)
VALUES ($idempotency_key, $tenant_id, 'in_progress')
ON CONFLICT (idempotency_key) DO NOTHING
RETURNING id;
-- Wenn 0 rows zurück: laufender Versuch existiert bereits → 409 mit dem
-- Status des laufenden Versuchs.

-- 2. Calendar block einfügen (atomare Konfliktprüfung via GIST)
INSERT INTO staff_calendar (tenant_id, staff_id, ts_range, block_type)
VALUES (
  $tenant_id,
  $resolved_staff_id,
  tstzrange($starts_at - $buffer_before, $ends_at + $buffer_after, '[)'),
  'booking'
)
RETURNING id;
-- Wenn GIST EXCLUDE Constraint feuert: Postgres wirft 23P01 → rollback,
-- API gibt 409 Conflict mit Alternativen-Suche.

-- 3. Buchung erzeugen
INSERT INTO bookings (id, tenant_id, customer_id, staff_id, service_id,
                      starts_at, ends_at, price_eur, status, created_at)
VALUES (...)
RETURNING id;

-- 4. staff_calendar.booking_id auf neue Buchung setzen
UPDATE staff_calendar SET booking_id = $booking_id WHERE id = $calendar_block_id;

-- 5. booking_attempt auf success setzen
UPDATE booking_attempts SET status = 'success', booking_id = $booking_id
WHERE idempotency_key = $idempotency_key;

-- 6. notification queue eintragen (Bestätigungsmail)
INSERT INTO notifications (booking_id, channel, template, send_at)
VALUES ($booking_id, 'email', 'booking_confirmation', now());

-- 7. Audit log
INSERT INTO audit_log (tenant_id, actor, action, target_table, target_id, diff_jsonb)
VALUES (...);

COMMIT;
```

### 4.3 Verhalten bei Konkurrenz

Szenario: **Zwei Kunden buchen gleichzeitig denselben Slot.**

```
Kunde A: POST /bookings  →  BEGIN  →  Idempotency-Check OK
Kunde B: POST /bookings  →  BEGIN  →  Idempotency-Check OK (anderer Key)

Kunde A: INSERT staff_calendar (Slot X)
         → Postgres acquired GIST exclusive lock auf Range
         → INSERT erfolgreich
Kunde B: INSERT staff_calendar (Slot X)
         → wartet auf Lock von A
         → A committet
         → B's INSERT versucht erneut
         → GIST EXCLUDE Constraint feuert: 23P01
         → ROLLBACK
         → API B: 409 Conflict + Alternativen
```

**Garantie**: Selbst bei perfekter Millisekunden-Gleichzeitigkeit kann nur einer der beiden Kunden den Slot bekommen. Postgres serialisiert den Zugriff via GIST-Lock + EXCLUDE-Constraint.

### 4.4 Idempotency

Idempotency-Key (UUID v4) wird vom Client generiert. Wiederholtes POST mit gleichem Key (z. B. Netzwerk-Retry) erzeugt nicht doppelt:

- Erster POST: erzeugt Eintrag, returnt `201`
- Wiederholter POST mit gleichem Key + selbst-konsistenten Daten: returnt `200 OK` mit existierender Buchung
- Wiederholter POST mit gleichem Key + abweichenden Daten: returnt `409 Conflict idempotency_key_mismatch`

### 4.5 Storno und Umbuchung

- **Storno**: `DELETE` auf `bookings.status` (soft delete: `status='cancelled'`), `staff_calendar`-Block wird gelöscht → Slot wieder frei
- **Umbuchung**: ist atomar = Storno + Neu-Buchung in einer Transaktion (mit GIST-Check)

---

## 5. Race-Condition Test-Plan

### 5.1 Unit-Tests (vitest)

- Skill-Match korrekt
- Working-Hours korrekt
- Time-off blockt korrekt
- Buffer-Time korrekt
- Lastausgleich-Scoring korrekt
- "Any"-Resolver wählt richtigen Mitarbeiter
- Edge Cases: Mitternacht, Zeitumstellung, Feiertag

→ ≥ 50 Tests, 100 % Statement-Coverage für `slot_engine/*`

### 5.2 Integration-Tests (vitest + Postgres Test-Container)

- Slot-Liste konsistent zwischen `getAvailableSlots` und tatsächlichem `createBooking`
- DB-Constraints feuern korrekt
- RLS verhindert Cross-Tenant-Buchungen
- Idempotency-Key funktioniert

→ ≥ 20 Tests

### 5.3 Concurrency-Tests (pgbench + Custom-Skripte)

```bash
# 50 parallele Buchungs-Versuche auf denselben Slot
pgbench -c 50 -t 1 -f scripts/concurrent_booking.sql

# Erwartung: 1 success, 49 conflicts, 0 Doppelbuchungen
```

→ ≥ 10 Szenarien (selber Slot, überlappende Slots, verschiedene Staff)

### 5.4 Property-Based Tests (fast-check)

```ts
fc.assert(fc.property(
  fc.array(arbitrarySalon()), // zufällige Salons
  fc.array(arbitraryBookingRequest()),
  (salons, requests) => {
    // Property: nach allen Requests gibt es keine
    // überlappenden Bookings für irgendeinen Staff
    runAllRequests(salons, requests);
    expect(findOverlappingBookings()).toEqual([]);
  }
), { numRuns: 1000 });
```

→ 1000 Runs pro CI-Build, deterministisch reproduzierbar mit Seed

### 5.5 Last-Test (in Harden-Phase)

- k6 oder Artillery, 10.000 Concurrent Bookings über 60 Minuten
- Targets: 0 Doppelbuchungen, p99 < 1s, Fehlerrate < 1 %
- Wiederholt nach jedem Major Release

---

## 6. Beobachtbarkeit

- Trace pro `availability` und `createBooking` Call (OpenTelemetry)
- Metriken: `availability_query_duration`, `booking_commit_duration`, `booking_conflict_count`
- Alerts:
  - Doppelbuchung detected (sollte NIE feuern) → P0
  - Konflikt-Rate > 5 % in 5 Min Window → P1 (deutet auf Hotspot-Salon)
  - Availability-p99 > 1s → P2

---

## 7. Edge Cases / bekannte Komplexitäten

| Edge Case | Verhalten |
|-----------|-----------|
| **Pakete (mehrere Services, sequenziell)** | Ein Paket = Block mit `start..start+sum(durations)+sum(buffers)`. Slot-Engine prüft, dass _alle_ Services zusammenhängend passen. Optional in Phase 2: Splitting auf mehrere Mitarbeiter |
| **Sommerzeit-Umstellung** | Alle Zeiten in UTC, Anzeige in `Europe/Berlin`. tstzrange behandelt das korrekt. |
| **Feiertage (BW-regional)** | Salon-Owner pflegt `tenant.holidays`. Slot-Engine respektiert. |
| **Kurzfristige Abwesenheit** | Salon-Owner trägt im Mitarbeiter-Profil ein → Engine respektiert sofort, Re-Booking-Vorschläge automatisch generiert |
| **Buchung außerhalb Vorlaufzeit** | Frontend filtert; Backend prüft als Belt-and-Suspenders |
| **Buchung über max Vorausbuchung** | Backend lehnt mit 422 ab |
| **Mitarbeiter krank, hat aber Buchungen** | Salon-Owner setzt Mitarbeiter auf `inactive` + erstellt `time_off`. Bestehende Buchungen werden automatisch geflaggt, Kunden via Email-Template informiert (Admin bestätigt). |

---

## 8. Abnahmekriterien dieser Spec (vor Build)

In Design-Phase (M2) ist diese Spec final überarbeitet:

- [ ] Datenmodell stimmt mit ER-Diagramm überein
- [ ] Algorithmus ist als Pseudocode + Reference-Implementation in TypeScript vorhanden
- [ ] GIST EXCLUDE Constraint ist im Migration-Skript enthalten
- [ ] Test-Plan ist in Tickets übersetzt (Sprint 2 — Slot-Engine-Sprint)
- [ ] Performance-Ziele sind als Smoke-Tests in CI verankert
- [ ] Edge Cases sind dokumentiert mit Akzeptanz-Tests

## 9. Liefergegenstand der Slot-Engine zum Release v1.0

- Vollständige Implementation in `packages/core/slot-engine`
- 100 % Test-Coverage auf Statement + Branch
- Last-Test-Report (10k Concurrent ohne Doppelbuchung)
- Pen-Test-Report (extern) ohne kritische Findings für die Engine
- API-Dokumentation in OpenAPI 3.1
- ADR `ADR-005-Slot-Engine-Architecture.md` als Erklärung der Design-Entscheidungen

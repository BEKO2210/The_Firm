---
document: "Datenmodell + Rollen- und Rechtemodell"
ticket: "TCK-20260513-0001"
parent: "SOW-001"
version: "1.0 — Draft"
status: "DRAFT (Datenmodell wird in Design-Phase verfeinert mit vollständigen DDL)"
language: "de"
---

# Datenmodell & Rollen-/Rechtemodell

Anlagen 8 + 9 zum MSA · TCK-20260513-0001

---

## Teil A · Datenmodell

### A.1 Übersicht (ER-Diagramm)

```
   ┌──────────────────────────────────────────────────────────────────┐
   │                            tenants                                │
   │  id · slug (subdomain) · name · plan · created_at · status        │
   └──┬──────────────────────────────────────────────────────────────┘
      │ 1:1
      ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │                       salon_profile                               │
   │  tenant_id · name · address · timezone · phone · email ·          │
   │  logo_url · primary_color · secondary_color · description ·       │
   │  branding_settings_jsonb · booking_settings_jsonb                 │
   └──────────────────────────────────────────────────────────────────┘
      │
      ├─→ opening_hours      (weekday, start, end)
      ├─→ tenant_holidays    (date, name)
      │
      ├─→ skills             (tenant_id, name)
      │
      ├─→ staff              (tenant_id, name, profile, active)
      │     ├─→ staff_skills           (m:n → skills)
      │     ├─→ staff_working_hours    (weekday, start, end)
      │     ├─→ staff_breaks           (weekday, start, end)
      │     ├─→ staff_time_off         (range, type)
      │     └─→ staff_calendar         (range, booking_id, block_type)
      │                                 ↑ GIST EXCLUDE
      │
      ├─→ services           (name, duration, price, buffers)
      │     ├─→ service_required_skills (m:n → skills)
      │     └─→ service_settings        (visibility, etc.)
      │
      ├─→ packages           (name, total_price)
      │     └─→ package_services        (m:n + order)
      │
      ├─→ customers          (name, email, phone, kind=registered|guest)
      │     ├─→ customer_consents       (purpose, granted, granted_at)
      │     ├─→ customer_tags
      │     ├─→ customer_notes          (only readable if salon enabled)
      │     └─→ no_show_count           (denormalized)
      │
      ├─→ bookings           (customer, staff, service|package, range, status, price)
      │     ├─→ booking_services        (m:n for packages — actual order)
      │     ├─→ booking_status_history  (audit, append-only)
      │     ├─→ notifications_sent      (when, channel, status)
      │     └─→ payment                 (Phase 2; column present from MVP)
      │
      ├─→ notifications      (queue: send_at, to, channel, template)
      │
      ├─→ audit_log          (actor, action, target, diff_jsonb, at)
      │
      └─→ device_tokens      (Phase 2 ready; for push notifications)


   ┌──────────────────────────────────────────────────────────────────┐
   │                    super_admin_log                                 │
   │   (system-wide; kein tenant_id)                                    │
   └──────────────────────────────────────────────────────────────────┘
```

### A.2 Mandantentrennung (Multi-Tenancy)

**Strategie:** Shared Database + Row-Level Security (RLS) in Postgres.

- Jede Tabelle (außer `super_admin_log`, `tenants`-Metadata) hat `tenant_id uuid NOT NULL`.
- RLS-Policies erzwingen `tenant_id = current_setting('app.tenant_id')::uuid`.
- JWT-Auth setzt `SET LOCAL app.tenant_id = '...'` zu Beginn jedes Requests.

Beispiel:

```sql
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON bookings
  FOR ALL
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE POLICY super_admin_bypass ON bookings
  FOR ALL
  USING (current_setting('app.role', true) = 'super_admin');
```

### A.3 Schlüssel-Tabellen mit Kern-Spalten

```sql
-- tenants
CREATE TABLE tenants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,           -- subdomain
  name        text NOT NULL,
  plan        text NOT NULL DEFAULT 'basic',  -- basic|pro|premium|enterprise
  status      text NOT NULL DEFAULT 'active', -- active|suspended
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- bookings (zentrale Tabelle)
CREATE TABLE bookings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id),
  customer_id     uuid NOT NULL REFERENCES customers(id),
  staff_id        uuid NOT NULL REFERENCES staff(id),
  service_id      uuid REFERENCES services(id),
  package_id      uuid REFERENCES packages(id),
  starts_at       timestamptz NOT NULL,
  ends_at         timestamptz NOT NULL,
  status          text NOT NULL DEFAULT 'booked',
                  -- booked|confirmed|arrived|paid|cancelled|no_show|rescheduled
  price_eur       numeric(10,2) NOT NULL,
  -- Phase-2-ready Payment fields (no UI in MVP)
  payment_provider text,                       -- 'stripe' | 'mollie' | etc.
  payment_intent_id text,
  payment_status  text DEFAULT 'unpaid',
  -- Notes
  notes_customer  text,
  notes_internal  text,
  -- Audit
  created_at      timestamptz NOT NULL DEFAULT now(),
  created_by      uuid REFERENCES users(id),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  -- Idempotency
  idempotency_key uuid UNIQUE,
  CHECK (ends_at > starts_at),
  CHECK ((service_id IS NULL) <> (package_id IS NULL))  -- exact one
);

-- customers (B2C-Endkunden)
CREATE TABLE customers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id),
  kind        text NOT NULL CHECK (kind IN ('registered','guest')),
  user_id     uuid REFERENCES users(id),       -- null for guests
  name        text NOT NULL,
  email       text NOT NULL,
  phone       text,                            -- Pflicht für Gast (vgl. SOW § 3.1)
  -- DSGVO
  marketing_consent boolean DEFAULT false,
  allergy_consent boolean DEFAULT false,
  allergies   text,                            -- nur befüllbar wenn allergy_consent
  -- Stats
  no_show_count integer NOT NULL DEFAULT 0,
  total_bookings integer NOT NULL DEFAULT 0,
  -- Audit
  created_at  timestamptz NOT NULL DEFAULT now(),
  last_booking_at timestamptz,
  UNIQUE(tenant_id, email)
);

-- audit_log (alle Schreiboperationen)
CREATE TABLE audit_log (
  id          bigserial PRIMARY KEY,
  tenant_id   uuid REFERENCES tenants(id),     -- null for super-admin actions
  actor_user_id uuid REFERENCES users(id),
  actor_role  text NOT NULL,
  action      text NOT NULL,                   -- 'insert' | 'update' | 'delete' | 'login' | ...
  target_table text NOT NULL,
  target_id   uuid,
  diff_jsonb  jsonb,                           -- before/after
  ip_address  inet,
  user_agent  text,
  at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_log_lookup ON audit_log (tenant_id, at DESC);
```

### A.4 Vollständiges DDL

Wird in Design-Phase finalisiert (M2) und liegt dann als `apps/web/db/migrations/0001_initial_schema.sql` im Repository — inklusive aller Indizes, Constraints, RLS-Policies und Seed-Daten für Test-Salon.

---

## Teil B · Rollen- und Rechtemodell

### B.1 Rollen-Übersicht

| Rolle | Kürzel | Wer? | Wofür? |
|-------|--------|------|--------|
| **Super Admin** | `super_admin` | Du (Belkis) | Plattformbetreiber, sieht und verwaltet alle Tenants |
| **Salon Owner** | `salon_owner` | Salonbesitzer | Verwaltet einen Salon (Stammdaten, Mitarbeiter, Buchungen, Reporting) |
| **Salon Manager** | `salon_manager` (optional Phase 2) | Filialleiter | Wie Owner aber ohne Tarif-Wechsel |
| **Staff** | `staff` | Mitarbeiter:in | Sieht eigene Termine + ggf. Notes (falls erlaubt) |
| **Customer (registered)** | `customer` | Endkunde mit Account | Bucht, sieht eigene Buchungshistorie |
| **Customer (guest)** | `guest` | Einmal-Buchung | Bucht, sieht via Magic-Link nur diese eine Buchung |

### B.2 Rechtematrix (Premium MVP)

Legende: ✅ erlaubt · ⚠️ konditional · ❌ verboten

| Aktion | Super Admin | Salon Owner | Staff | Customer | Guest |
|--------|:-----------:|:-----------:|:-----:|:--------:|:-----:|
| Tenant anlegen / suspendieren | ✅ | ❌ | ❌ | ❌ | ❌ |
| Alle Tenants sehen | ✅ | ❌ | ❌ | ❌ | ❌ |
| Eigenen Tenant sehen | ✅ | ✅ | ✅ | ❌ | ❌ |
| Salon-Profil ändern | ✅ | ✅ | ❌ | ❌ | ❌ |
| Salon-Einstellungen ändern | ✅ | ✅ | ❌ | ❌ | ❌ |
| Mitarbeiter anlegen / ändern / deaktivieren | ✅ | ✅ | ❌ | ❌ | ❌ |
| Eigene Verfügbarkeit (Arbeitszeiten / Urlaub) | ✅ | ✅ | ⚠️ (falls erlaubt) | ❌ | ❌ |
| Mitarbeiter-Status ändern (krank, urlaub) | ✅ | ✅ | ⚠️ (selbst) | ❌ | ❌ |
| Services / Pakete CRUD | ✅ | ✅ | ❌ | ❌ | ❌ |
| Termine alle einsehen (Salon) | ✅ | ✅ | ❌ | ❌ | ❌ |
| Eigene Termine einsehen (Staff) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Termin-Status ändern (erschienen, bezahlt) | ✅ | ✅ | ⚠️ (eigene) | ❌ | ❌ |
| Termin manuell anlegen (Telefon-Buchung) | ✅ | ✅ | ⚠️ (falls erlaubt) | ❌ | ❌ |
| Buchung verschieben (Drag-and-Drop) | ✅ | ✅ | ⚠️ (eigene, falls erlaubt) | ❌ | ❌ |
| Kundenliste einsehen | ✅ | ✅ | ⚠️ (nur eigene Kunden, falls erlaubt) | ❌ | ❌ |
| Kunden-Notizen einsehen | ✅ | ✅ | ⚠️ (falls Flag gesetzt) | ❌ | ❌ |
| Kunden-Notizen schreiben | ✅ | ✅ | ⚠️ (falls Flag gesetzt) | ❌ | ❌ |
| Allergien-Feld einsehen | ✅ | ✅ | ⚠️ (falls Flag + consent) | ⚠️ (eigene) | ❌ |
| Kunden DSGVO-Datenexport | ✅ | ✅ | ❌ | ❌ | ❌ |
| Kunden DSGVO-Löschung | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Booking erstellen** (eigene) | ✅ | ✅ | ❌ | ✅ | ✅ |
| Booking stornieren (eigene) | ✅ | ✅ | ❌ | ✅ | ⚠️ (via Magic-Link) |
| Booking umbuchen (eigene) | ✅ | ✅ | ❌ | ⚠️ (innerhalb Salon-Regeln) | ⚠️ |
| Reporting einsehen | ✅ | ✅ | ❌ | ❌ | ❌ |
| Audit-Log einsehen | ✅ | ⚠️ (eigener Tenant) | ❌ | ❌ | ❌ |
| Subprocessor / AVV-Status einsehen | ✅ | ✅ (read-only) | ❌ | ❌ | ❌ |
| Tarif wechseln (Phase 2 Self-Service) | ✅ | ✅ | ❌ | ❌ | ❌ |

### B.3 Implementation

```sql
-- Beispiel: RLS-Policy für staff-Tabelle
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Super-Admin sieht alles
CREATE POLICY staff_super_admin ON staff
  FOR ALL
  USING (current_setting('app.role', true) = 'super_admin');

-- Salon-Owner/Manager: eigener Tenant
CREATE POLICY staff_owner ON staff
  FOR ALL
  USING (
    tenant_id = current_setting('app.tenant_id', true)::uuid
    AND current_setting('app.role', true) IN ('salon_owner','salon_manager')
  );

-- Staff: kann sich selbst sehen (Read)
CREATE POLICY staff_self_read ON staff
  FOR SELECT
  USING (
    tenant_id = current_setting('app.tenant_id', true)::uuid
    AND current_setting('app.role', true) = 'staff'
    AND user_id = current_setting('app.user_id', true)::uuid
  );

-- Staff: kann eigene Verfügbarkeit ändern (falls Flag)
CREATE POLICY staff_self_update_availability ON staff
  FOR UPDATE
  USING (
    tenant_id = current_setting('app.tenant_id', true)::uuid
    AND current_setting('app.role', true) = 'staff'
    AND user_id = current_setting('app.user_id', true)::uuid
    AND current_setting('app.can_edit_availability', true) = 'true'
  );
```

Jede Tabelle bekommt analoge Policies. Im Code wird vor jedem Request aus dem JWT `app.role`, `app.tenant_id`, `app.user_id` und Feature-Flags wie `app.can_edit_availability` gesetzt.

### B.4 RLS-Tests (Pflicht)

Im Test-Suite gibt es für **jede Tabelle** automatisierte Tests:

- ✅ Super-Admin liest alles
- ✅ Salon-Owner liest nur eigenen Tenant
- ✅ Salon-Owner schreibt nur eigenen Tenant
- ✅ Staff liest nur eigene Daten + ggf. eigene Bookings
- ✅ Customer liest nur eigene Bookings
- ✅ Guest liest nur via Magic-Link
- ❌ Cross-Tenant-Read schlägt fehl
- ❌ Cross-Tenant-Write schlägt fehl
- ❌ Privilege-Escalation (Staff → Owner-Action) schlägt fehl

Diese Tests laufen in CI bei jedem PR.

### B.5 Auth-Token-Inhalte (JWT-Claims)

```json
{
  "sub": "user_uuid",
  "tenant_id": "tenant_uuid",      // null für Super-Admin und Customers
  "role": "salon_owner",
  "user_id": "user_uuid",
  "can_edit_availability": true,
  "can_read_customer_notes": false,
  "iat": 1736790000,
  "exp": 1736790900,                // 15 Min
  "jti": "..."                       // refresh-Token-Tracking
}
```

Refresh-Tokens haben 30 Tage Gültigkeit, sind opaque (DB-Lookup, kann revoked werden).

-- ============================================================================
-- Migration 0002: Business Schema · Staff + Services + Bookings + Slot-Engine
-- ============================================================================
-- Status: DRAFT (Design phase Day 8) — finale Version Day 22
-- Ticket: TCK-20260513-0001
-- ADRs angewandt: 001, 002 (RLS), 003 (Auth), 005 (Slot-Engine GIST), 006 (Payment)
-- Vorbedingung: Migration 0001 erfolgreich angewandt
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- HELPER: Set updated_at on each UPDATE
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- SKILLS (z. B. „Haarschnitt Damen", „Färben", „Bart-Trimm")
-- ---------------------------------------------------------------------------
CREATE TABLE skills (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name        text NOT NULL,
    description text,
    created_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, name)
);

CREATE INDEX idx_skills_tenant ON skills (tenant_id);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills FORCE ROW LEVEL SECURITY;
CREATE POLICY default_deny ON skills FOR ALL USING (false);
CREATE POLICY super_admin_full ON skills FOR ALL USING (current_setting('app.role', true) = 'super_admin');
CREATE POLICY tenant_isolation ON skills FOR ALL USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ---------------------------------------------------------------------------
-- STAFF
-- ---------------------------------------------------------------------------
CREATE TABLE staff (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id         uuid UNIQUE REFERENCES app_users(user_id) ON DELETE SET NULL,
    name            text NOT NULL,
    profile_image_url text,
    role_label      text,           -- z. B. „Stylist", „Coloristin", „Barber"
    active          boolean NOT NULL DEFAULT true,
    can_edit_availability boolean NOT NULL DEFAULT false,
    can_read_customer_notes boolean NOT NULL DEFAULT false,
    visible_online  boolean NOT NULL DEFAULT true,
    sort_order      smallint NOT NULL DEFAULT 0,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_staff_tenant_active ON staff (tenant_id, active);
CREATE TRIGGER trg_staff_updated BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff FORCE ROW LEVEL SECURITY;
CREATE POLICY default_deny ON staff FOR ALL USING (false);
CREATE POLICY super_admin_full ON staff FOR ALL USING (current_setting('app.role', true) = 'super_admin');
CREATE POLICY tenant_isolation ON staff FOR ALL USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE POLICY staff_self_read ON staff FOR SELECT USING (
    user_id = current_setting('app.user_id', true)::uuid
);
CREATE POLICY staff_self_update_availability ON staff FOR UPDATE
    USING (
        user_id = current_setting('app.user_id', true)::uuid
        AND current_setting('app.can_edit_availability', true) = 'true'
    );

-- ---------------------------------------------------------------------------
-- STAFF SKILLS (n:m)
-- ---------------------------------------------------------------------------
CREATE TABLE staff_skills (
    staff_id    uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    skill_id    uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    tenant_id   uuid NOT NULL REFERENCES tenants(id),
    PRIMARY KEY (staff_id, skill_id)
);

CREATE INDEX idx_staff_skills_skill ON staff_skills (skill_id);

ALTER TABLE staff_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_skills FORCE ROW LEVEL SECURITY;
CREATE POLICY default_deny ON staff_skills FOR ALL USING (false);
CREATE POLICY super_admin_full ON staff_skills FOR ALL USING (current_setting('app.role', true) = 'super_admin');
CREATE POLICY tenant_isolation ON staff_skills FOR ALL USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- ---------------------------------------------------------------------------
-- STAFF WORKING HOURS / BREAKS / TIME OFF
-- ---------------------------------------------------------------------------
CREATE TABLE staff_working_hours (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id        uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    tenant_id       uuid NOT NULL REFERENCES tenants(id),
    weekday         smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
    start_time      time NOT NULL,
    end_time        time NOT NULL,
    CHECK (end_time > start_time),
    UNIQUE (staff_id, weekday, start_time)
);

CREATE INDEX idx_swh_staff_weekday ON staff_working_hours (staff_id, weekday);

ALTER TABLE staff_working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_working_hours FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON staff_working_hours FOR ALL USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE POLICY super_admin_full ON staff_working_hours FOR ALL USING (current_setting('app.role', true) = 'super_admin');

CREATE TABLE staff_breaks (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id        uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    tenant_id       uuid NOT NULL REFERENCES tenants(id),
    weekday         smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
    start_time      time NOT NULL,
    end_time        time NOT NULL,
    CHECK (end_time > start_time),
    UNIQUE (staff_id, weekday, start_time)
);

ALTER TABLE staff_breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_breaks FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON staff_breaks FOR ALL USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE POLICY super_admin_full ON staff_breaks FOR ALL USING (current_setting('app.role', true) = 'super_admin');

CREATE TABLE staff_time_off (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id        uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    tenant_id       uuid NOT NULL REFERENCES tenants(id),
    starts_at       timestamptz NOT NULL,
    ends_at         timestamptz NOT NULL,
    off_type        text NOT NULL CHECK (off_type IN ('vacation', 'sick', 'personal', 'other')),
    note            text,
    created_at      timestamptz NOT NULL DEFAULT now(),
    CHECK (ends_at > starts_at)
);

CREATE INDEX idx_sto_staff_range ON staff_time_off (staff_id, starts_at, ends_at);

ALTER TABLE staff_time_off ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_time_off FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON staff_time_off FOR ALL USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE POLICY super_admin_full ON staff_time_off FOR ALL USING (current_setting('app.role', true) = 'super_admin');

-- ---------------------------------------------------------------------------
-- SERVICES + REQUIRED SKILLS
-- ---------------------------------------------------------------------------
CREATE TABLE services (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            text NOT NULL,
    category        text,                      -- z. B. „Haar", „Bart", „Kosmetik"
    description     text,
    duration_min    smallint NOT NULL CHECK (duration_min > 0 AND duration_min <= 480),
    buffer_before_min smallint NOT NULL DEFAULT 0 CHECK (buffer_before_min >= 0),
    buffer_after_min  smallint NOT NULL DEFAULT 0 CHECK (buffer_after_min >= 0),
    price_eur       numeric(10, 2) NOT NULL CHECK (price_eur >= 0),
    bookable_online boolean NOT NULL DEFAULT true,
    visible_online  boolean NOT NULL DEFAULT true,
    sort_order      smallint NOT NULL DEFAULT 0,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_services_tenant_visible ON services (tenant_id) WHERE bookable_online = true;
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE services FORCE ROW LEVEL SECURITY;
CREATE POLICY default_deny ON services FOR ALL USING (false);
CREATE POLICY super_admin_full ON services FOR ALL USING (current_setting('app.role', true) = 'super_admin');
CREATE POLICY tenant_isolation ON services FOR ALL USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE service_required_skills (
    service_id  uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    skill_id    uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    tenant_id   uuid NOT NULL REFERENCES tenants(id),
    PRIMARY KEY (service_id, skill_id)
);

ALTER TABLE service_required_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_required_skills FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON service_required_skills FOR ALL USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE POLICY super_admin_full ON service_required_skills FOR ALL USING (current_setting('app.role', true) = 'super_admin');

-- ---------------------------------------------------------------------------
-- PACKAGES (Kombinationen aus Services)
-- ---------------------------------------------------------------------------
CREATE TABLE packages (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            text NOT NULL,
    description     text,
    total_price_eur numeric(10, 2) NOT NULL CHECK (total_price_eur >= 0),
    bookable_online boolean NOT NULL DEFAULT true,
    visible_online  boolean NOT NULL DEFAULT true,
    created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON packages FOR ALL USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE POLICY super_admin_full ON packages FOR ALL USING (current_setting('app.role', true) = 'super_admin');

CREATE TABLE package_services (
    package_id  uuid NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    service_id  uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    tenant_id   uuid NOT NULL REFERENCES tenants(id),
    sort_order  smallint NOT NULL DEFAULT 0,
    PRIMARY KEY (package_id, service_id)
);

ALTER TABLE package_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_services FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON package_services FOR ALL USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE POLICY super_admin_full ON package_services FOR ALL USING (current_setting('app.role', true) = 'super_admin');

-- ---------------------------------------------------------------------------
-- CUSTOMERS
-- ---------------------------------------------------------------------------
CREATE TABLE customers (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    kind                text NOT NULL CHECK (kind IN ('registered', 'guest')),
    user_id             uuid REFERENCES app_users(user_id) ON DELETE SET NULL,
    name                text NOT NULL,
    email               text NOT NULL,
    phone               text,
    marketing_consent   boolean NOT NULL DEFAULT false,
    marketing_consent_at timestamptz,
    allergy_consent     boolean NOT NULL DEFAULT false,
    allergy_consent_at  timestamptz,
    allergies           text,
    preferred_staff_id  uuid REFERENCES staff(id) ON DELETE SET NULL,
    no_show_count       integer NOT NULL DEFAULT 0,
    total_bookings      integer NOT NULL DEFAULT 0,
    last_booking_at     timestamptz,
    notes_internal      text,
    tags                text[] NOT NULL DEFAULT ARRAY[]::text[],
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now(),
    -- Allergies require explicit consent (Art. 9 DSGVO)
    CHECK (allergies IS NULL OR allergy_consent = true),
    UNIQUE (tenant_id, email)
);

CREATE INDEX idx_customers_tenant_email ON customers (tenant_id, lower(email));
CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers FORCE ROW LEVEL SECURITY;
CREATE POLICY default_deny ON customers FOR ALL USING (false);
CREATE POLICY super_admin_full ON customers FOR ALL USING (current_setting('app.role', true) = 'super_admin');
CREATE POLICY tenant_isolation ON customers FOR ALL USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE POLICY customer_self_read ON customers FOR SELECT USING (
    user_id = current_setting('app.user_id', true)::uuid
);

-- ---------------------------------------------------------------------------
-- BOOKINGS (zentrale Tabelle)
-- ---------------------------------------------------------------------------
CREATE TABLE bookings (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id         uuid NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    staff_id            uuid NOT NULL REFERENCES staff(id) ON DELETE RESTRICT,
    service_id          uuid REFERENCES services(id) ON DELETE RESTRICT,
    package_id          uuid REFERENCES packages(id) ON DELETE RESTRICT,
    starts_at           timestamptz NOT NULL,
    ends_at             timestamptz NOT NULL,
    status              text NOT NULL DEFAULT 'booked'
                        CHECK (status IN ('booked','confirmed','arrived','paid','cancelled','no_show','rescheduled')),
    price_eur           numeric(10, 2) NOT NULL,
    -- Payment fields (Phase-2-ready per ADR-006)
    payment_provider    text DEFAULT 'stub' CHECK (payment_provider IN ('stub','stripe','mollie')),
    payment_intent_id   text,
    payment_status      text NOT NULL DEFAULT 'unpaid'
                        CHECK (payment_status IN ('unpaid','pending','authorized','paid','refunded','failed')),
    -- Notes
    notes_customer      text,
    notes_internal      text,
    -- Audit + idempotency
    idempotency_key     uuid UNIQUE,
    created_at          timestamptz NOT NULL DEFAULT now(),
    created_by          uuid REFERENCES app_users(user_id),
    updated_at          timestamptz NOT NULL DEFAULT now(),
    -- Constraints
    CHECK (ends_at > starts_at),
    CHECK ((service_id IS NULL) <> (package_id IS NULL))  -- exactly one
);

CREATE INDEX idx_bookings_tenant_time ON bookings (tenant_id, starts_at);
CREATE INDEX idx_bookings_customer ON bookings (customer_id, starts_at DESC);
CREATE INDEX idx_bookings_staff_time ON bookings (staff_id, starts_at);
CREATE INDEX idx_bookings_status ON bookings (tenant_id, status);

CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings FORCE ROW LEVEL SECURITY;
CREATE POLICY default_deny ON bookings FOR ALL USING (false);
CREATE POLICY super_admin_full ON bookings FOR ALL USING (current_setting('app.role', true) = 'super_admin');
CREATE POLICY tenant_isolation ON bookings FOR ALL USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE POLICY customer_self_bookings ON bookings FOR SELECT USING (
    customer_id IN (
        SELECT id FROM customers WHERE user_id = current_setting('app.user_id', true)::uuid
    )
);
CREATE POLICY staff_self_bookings ON bookings FOR SELECT USING (
    staff_id IN (
        SELECT id FROM staff WHERE user_id = current_setting('app.user_id', true)::uuid
    )
);

-- ---------------------------------------------------------------------------
-- BOOKING SERVICES (für Packages: welche Services in welcher Reihenfolge)
-- ---------------------------------------------------------------------------
CREATE TABLE booking_services (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id      uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    service_id      uuid NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    tenant_id       uuid NOT NULL REFERENCES tenants(id),
    sort_order      smallint NOT NULL DEFAULT 0,
    UNIQUE (booking_id, sort_order)
);

ALTER TABLE booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_services FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON booking_services FOR ALL USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE POLICY super_admin_full ON booking_services FOR ALL USING (current_setting('app.role', true) = 'super_admin');

-- ---------------------------------------------------------------------------
-- BOOKING STATUS HISTORY (append-only Audit)
-- ---------------------------------------------------------------------------
CREATE TABLE booking_status_history (
    id              bigserial PRIMARY KEY,
    booking_id      uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    tenant_id       uuid NOT NULL REFERENCES tenants(id),
    old_status      text,
    new_status      text NOT NULL,
    changed_by      uuid REFERENCES app_users(user_id),
    reason          text,
    at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_bsh_booking ON booking_status_history (booking_id, at DESC);

ALTER TABLE booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_status_history FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON booking_status_history FOR ALL USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE POLICY super_admin_full ON booking_status_history FOR ALL USING (current_setting('app.role', true) = 'super_admin');

-- ---------------------------------------------------------------------------
-- STAFF CALENDAR (denormalisiert + GIST EXCLUDE = die zentrale Garantie)
-- ---------------------------------------------------------------------------
CREATE TABLE staff_calendar (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    staff_id        uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    ts_range        tstzrange NOT NULL,
    booking_id      uuid REFERENCES bookings(id) ON DELETE CASCADE,
    block_type      text NOT NULL CHECK (block_type IN ('booking','vacation','break','sick','manual')),
    created_at      timestamptz NOT NULL DEFAULT now(),

    -- *** PHYSIKALISCHE GARANTIE GEGEN DOPPELBUCHUNGEN ***
    -- Postgres lässt keine zwei überlappenden ts_range für (tenant, staff) zu.
    -- Selbst bei kompletter App-Layer-Fehlfunktion ist Double-Booking unmöglich.
    CONSTRAINT no_overlap_per_staff
        EXCLUDE USING GIST (
            tenant_id WITH =,
            staff_id  WITH =,
            ts_range  WITH &&
        )
);

CREATE INDEX idx_staff_cal_lookup ON staff_calendar USING GIST (tenant_id, staff_id, ts_range);
CREATE INDEX idx_staff_cal_booking ON staff_calendar (booking_id) WHERE booking_id IS NOT NULL;

ALTER TABLE staff_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_calendar FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON staff_calendar FOR ALL USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE POLICY super_admin_full ON staff_calendar FOR ALL USING (current_setting('app.role', true) = 'super_admin');

-- ---------------------------------------------------------------------------
-- BOOKING ATTEMPTS (Idempotency-Tracking für Slot-Engine-Write-Path)
-- ---------------------------------------------------------------------------
CREATE TABLE booking_attempts (
    idempotency_key uuid PRIMARY KEY,
    tenant_id       uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    booking_id      uuid REFERENCES bookings(id) ON DELETE SET NULL,
    status          text NOT NULL CHECK (status IN ('in_progress','success','failed')),
    failure_reason  text,
    created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ba_tenant ON booking_attempts (tenant_id, created_at DESC);

ALTER TABLE booking_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_attempts FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON booking_attempts FOR ALL USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE POLICY super_admin_full ON booking_attempts FOR ALL USING (current_setting('app.role', true) = 'super_admin');

-- ---------------------------------------------------------------------------
-- NOTIFICATIONS QUEUE
-- ---------------------------------------------------------------------------
CREATE TABLE notifications (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    booking_id      uuid REFERENCES bookings(id) ON DELETE CASCADE,
    recipient_email text NOT NULL,
    recipient_user_id uuid REFERENCES app_users(user_id),
    channel         text NOT NULL CHECK (channel IN ('email','push','sms')),
    template        text NOT NULL,           -- z. B. „booking_confirmation"
    payload         jsonb NOT NULL DEFAULT '{}'::jsonb,
    send_at         timestamptz NOT NULL DEFAULT now(),
    sent_at         timestamptz,
    status          text NOT NULL DEFAULT 'queued'
                    CHECK (status IN ('queued','sent','failed','bounced')),
    error_message   text,
    attempt_count   smallint NOT NULL DEFAULT 0,
    provider_message_id text,                -- Resend message_id für Tracking
    created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notif_pending ON notifications (send_at) WHERE status = 'queued';
CREATE INDEX idx_notif_tenant_recent ON notifications (tenant_id, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON notifications FOR ALL USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE POLICY super_admin_full ON notifications FOR ALL USING (current_setting('app.role', true) = 'super_admin');

-- ---------------------------------------------------------------------------
-- DEVICE TOKENS (Phase-2-Ready für native Apps Push-Notifications)
-- ---------------------------------------------------------------------------
CREATE TABLE device_tokens (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       uuid REFERENCES tenants(id) ON DELETE CASCADE,
    user_id         uuid NOT NULL REFERENCES app_users(user_id) ON DELETE CASCADE,
    token           text NOT NULL,
    platform        text NOT NULL CHECK (platform IN ('ios','android','web')),
    is_active       boolean NOT NULL DEFAULT true,
    last_seen_at    timestamptz NOT NULL DEFAULT now(),
    created_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, token, platform)
);

CREATE INDEX idx_dt_user ON device_tokens (user_id) WHERE is_active = true;

ALTER TABLE device_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_tokens FORCE ROW LEVEL SECURITY;
CREATE POLICY user_self_only ON device_tokens FOR ALL USING (user_id = current_setting('app.user_id', true)::uuid);
CREATE POLICY super_admin_full ON device_tokens FOR ALL USING (current_setting('app.role', true) = 'super_admin');

-- ---------------------------------------------------------------------------
-- TRIGGER: Booking → Status History (auto-track)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.track_booking_status_change()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'INSERT' OR NEW.status <> OLD.status THEN
        INSERT INTO booking_status_history (booking_id, tenant_id, old_status, new_status, changed_by)
        VALUES (
            NEW.id, NEW.tenant_id,
            CASE WHEN TG_OP = 'UPDATE' THEN OLD.status ELSE NULL END,
            NEW.status,
            COALESCE(NULLIF(current_setting('app.user_id', true), '')::uuid, NULL)
        );
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_booking_status_history
    AFTER INSERT OR UPDATE OF status ON bookings
    FOR EACH ROW EXECUTE FUNCTION track_booking_status_change();

-- ---------------------------------------------------------------------------
-- TRIGGER: Booking-CASCADE → staff_calendar block delete
-- (Wenn booking gelöscht/storniert wird, GIST-Range freigeben)
-- ---------------------------------------------------------------------------
-- Cancellation = status = 'cancelled', kein DELETE.
-- Bei Storno entfernen wir den Kalender-Block separat in der App.
-- ON DELETE CASCADE auf staff_calendar.booking_id räumt bei Hard-Delete (selten).

COMMIT;

-- ============================================================================
-- ROLLBACK 0002
-- ============================================================================
-- Reverse-order DROP. Siehe `0002_rollback.sql`.

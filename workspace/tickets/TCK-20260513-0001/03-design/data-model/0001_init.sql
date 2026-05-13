-- ============================================================================
-- Migration 0001: Initial Schema · Tenants + Auth + Salon-Profile
-- ============================================================================
-- Status: DRAFT (Design phase Day 5) — finale Version mit allen Tabellen am Day 22
-- Ticket: TCK-20260513-0001
-- ADRs angewandt: 001 (Stack: Postgres 16), 002 (RLS), 003 (Auth-Hooks)
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "btree_gist"; -- GIST EXCLUDE für Slot-Calendar

-- ---------------------------------------------------------------------------
-- Postgres Roles
-- ---------------------------------------------------------------------------
-- app_user: Runtime-Role für die App. Keine RLS-Bypass-Rechte.
-- app_admin: Migrations + System-Jobs. Hat BYPASSRLS (intern).
-- Wird in Supabase über Configuration gemanaged; hier nur dokumentiert.

-- ---------------------------------------------------------------------------
-- TENANTS
-- ---------------------------------------------------------------------------
CREATE TABLE tenants (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        text UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9][a-z0-9-]{1,50}$'),
    name        text NOT NULL,
    plan        text NOT NULL DEFAULT 'basic'
                CHECK (plan IN ('basic', 'pro', 'premium', 'enterprise')),
    status      text NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'suspended', 'pending', 'closed')),
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tenants_slug ON tenants (slug) WHERE status = 'active';

-- RLS deaktiviert für tenants — nur Super-Admin direkt sieht das (per App-Logic).

-- ---------------------------------------------------------------------------
-- APP USERS (Mapping zwischen Supabase Auth User-IDs und unseren Rollen/Tenants)
-- ---------------------------------------------------------------------------
CREATE TABLE app_users (
    user_id     uuid PRIMARY KEY,                       -- == auth.users.id
    tenant_id   uuid REFERENCES tenants(id) ON DELETE RESTRICT,  -- null for super_admin
    role        text NOT NULL
                CHECK (role IN ('super_admin', 'salon_owner', 'salon_manager', 'staff', 'customer', 'guest')),
    display_name text,
    email       text NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now(),
    last_login_at timestamptz,
    CONSTRAINT super_admin_no_tenant
        CHECK (role <> 'super_admin' OR tenant_id IS NULL)
);

CREATE INDEX idx_app_users_tenant_role ON app_users (tenant_id, role);

ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_users FORCE ROW LEVEL SECURITY;

CREATE POLICY default_deny ON app_users FOR ALL USING (false);

CREATE POLICY super_admin_full ON app_users
    FOR ALL
    USING (current_setting('app.role', true) = 'super_admin');

CREATE POLICY salon_owner_tenant_users ON app_users
    FOR ALL
    USING (
        tenant_id = current_setting('app.tenant_id', true)::uuid
        AND current_setting('app.role', true) IN ('salon_owner', 'salon_manager')
    );

CREATE POLICY user_self_read ON app_users
    FOR SELECT
    USING (
        user_id = current_setting('app.user_id', true)::uuid
    );

-- ---------------------------------------------------------------------------
-- SALON PROFILE
-- ---------------------------------------------------------------------------
CREATE TABLE salon_profile (
    tenant_id          uuid PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
    name               text NOT NULL,
    address_line1      text,
    address_line2      text,
    postal_code        text,
    city               text,
    country            text NOT NULL DEFAULT 'DE',
    phone              text,
    email              text,
    website            text,
    timezone           text NOT NULL DEFAULT 'Europe/Berlin',
    logo_url           text,
    primary_color      text DEFAULT '#0F172A' CHECK (primary_color ~ '^#[0-9A-Fa-f]{6}$'),
    secondary_color    text CHECK (secondary_color IS NULL OR secondary_color ~ '^#[0-9A-Fa-f]{6}$'),
    description        text,
    booking_settings   jsonb NOT NULL DEFAULT jsonb_build_object(
        'guest_booking_enabled', true,
        'min_lead_time_minutes', 60,
        'max_lead_time_days', 90,
        'cancellation_window_hours', 24,
        'auto_confirm', true
    ),
    images             text[] NOT NULL DEFAULT ARRAY[]::text[],
    created_at         timestamptz NOT NULL DEFAULT now(),
    updated_at         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE salon_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_profile FORCE ROW LEVEL SECURITY;

CREATE POLICY default_deny ON salon_profile FOR ALL USING (false);

CREATE POLICY super_admin_full ON salon_profile
    FOR ALL
    USING (current_setting('app.role', true) = 'super_admin');

CREATE POLICY tenant_isolation ON salon_profile
    FOR ALL
    USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- Public read für Kunden-Buchungsseite (über separaten read-only User in Phase 2)
-- Im MVP: SSR-Frontend liest mit Salon-Owner-Context.

-- ---------------------------------------------------------------------------
-- OPENING HOURS (separate Tabelle für sauberes Modell)
-- ---------------------------------------------------------------------------
CREATE TABLE tenant_opening_hours (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    weekday         smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
    open_at         time NOT NULL,
    close_at        time NOT NULL CHECK (close_at > open_at),
    is_open         boolean NOT NULL DEFAULT true,
    UNIQUE (tenant_id, weekday, open_at)
);

CREATE INDEX idx_opening_hours_tenant ON tenant_opening_hours (tenant_id, weekday);

ALTER TABLE tenant_opening_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_opening_hours FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON tenant_opening_hours
    FOR ALL
    USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE POLICY super_admin_full ON tenant_opening_hours
    FOR ALL
    USING (current_setting('app.role', true) = 'super_admin');

-- ---------------------------------------------------------------------------
-- TENANT HOLIDAYS (Feiertage, an denen Salon geschlossen)
-- ---------------------------------------------------------------------------
CREATE TABLE tenant_holidays (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    holiday_date    date NOT NULL,
    name            text NOT NULL,
    UNIQUE (tenant_id, holiday_date)
);

ALTER TABLE tenant_holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_holidays FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON tenant_holidays
    FOR ALL
    USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE POLICY super_admin_full ON tenant_holidays
    FOR ALL
    USING (current_setting('app.role', true) = 'super_admin');

-- ---------------------------------------------------------------------------
-- AUDIT LOG (zentral, append-only)
-- ---------------------------------------------------------------------------
CREATE TABLE audit_log (
    id              bigserial PRIMARY KEY,
    tenant_id       uuid REFERENCES tenants(id) ON DELETE SET NULL,
    actor_user_id   uuid,
    actor_role      text NOT NULL,
    action          text NOT NULL,
    target_table    text NOT NULL,
    target_id       uuid,
    diff_jsonb      jsonb,
    ip_address      inet,
    user_agent      text,
    at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_tenant_time ON audit_log (tenant_id, at DESC);
CREATE INDEX idx_audit_log_target ON audit_log (target_table, target_id);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log FORCE ROW LEVEL SECURITY;

CREATE POLICY super_admin_full ON audit_log
    FOR ALL
    USING (current_setting('app.role', true) = 'super_admin');

CREATE POLICY tenant_isolation_read ON audit_log
    FOR SELECT
    USING (
        tenant_id = current_setting('app.tenant_id', true)::uuid
        AND current_setting('app.role', true) IN ('salon_owner', 'salon_manager')
    );

-- Audit-Log ist append-only — keine UPDATE / DELETE Policies.

-- ---------------------------------------------------------------------------
-- SUPABASE AUTH HOOK (Custom Claims, gemäß ADR-003)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    claims jsonb;
    v_tenant_id uuid;
    v_role text;
BEGIN
    claims := event->'claims';

    SELECT tenant_id, role
    INTO v_tenant_id, v_role
    FROM public.app_users
    WHERE user_id = (event->>'user_id')::uuid;

    IF v_role IS NOT NULL THEN
        claims := jsonb_set(claims, '{tenant_id}', COALESCE(to_jsonb(v_tenant_id), 'null'::jsonb));
        claims := jsonb_set(claims, '{role}', to_jsonb(v_role));
    END IF;

    RETURN jsonb_set(event, '{claims}', claims);
END;
$$;

-- Trigger registration in Supabase Auth: separater Schritt im Dashboard
-- oder via Supabase-Mgmt-API. Hier nur die Function.

COMMIT;

-- ============================================================================
-- ROLLBACK 0001
-- ============================================================================
-- BEGIN;
-- DROP FUNCTION IF EXISTS public.custom_access_token_hook(jsonb);
-- DROP TABLE IF EXISTS audit_log;
-- DROP TABLE IF EXISTS tenant_holidays;
-- DROP TABLE IF EXISTS tenant_opening_hours;
-- DROP TABLE IF EXISTS salon_profile;
-- DROP TABLE IF EXISTS app_users;
-- DROP TABLE IF EXISTS tenants;
-- COMMIT;

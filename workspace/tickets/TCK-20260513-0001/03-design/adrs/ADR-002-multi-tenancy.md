---
adr: 002
title: Multi-Tenancy-Modell — Shared DB + Postgres Row-Level Security
ticket: TCK-20260513-0001
status: "PROPOSED — awaiting principal information (no veto required, but visible)"
real: 2026-05-13T20:45:00Z
sim:  Day 3, 11:00 (Sprint 1 · Q1 2026)
authors:
  - "003 Mira Lundberg (Principal Engineer)"
  - "002 Jonas Weber (CTO)"
reviewers:
  - "017 Yasmin El-Sayed (DPO) — DSGVO cross-tenant risk"
  - "018 Karim Haddad (CISO)"
  - "027 Devil's Advocate / Architecture Critic"
decision_class: "Type-1 Critical (one-way door, data layout)"
depends_on: ADR-001
---

# ADR-002 · Multi-Tenancy-Modell

## Kontext

Korynth Bookings ist Multi-Tenant von Tag 1 (siehe SOW-001 § 3.1, Punkt 2). Pro Mandant = 1 Salon. Skalierungsziel: 100+ Salons in 12 Monaten, perspektivisch 1.000+.

Drei klassische Ansätze:

1. **Shared DB + Shared Schema + Row-Level Security (RLS)** ← unsere Wahl
2. **Shared DB + Schema-per-Tenant**
3. **DB-per-Tenant**

Der gewählte Ansatz hat massive Konsequenzen für: Sicherheit (Cross-Tenant-Leak), Operations (Backups, Migrations), Kosten (Hosting pro Tenant), Skalierung (max. Tenants), und DSGVO (Datenisolation gerichtsfest dokumentierbar).

## Entscheidung

**Shared Database + Shared Schema + Row-Level Security (RLS) in Postgres 16.**

Alle Mandanten-Daten liegen in derselben Postgres-Datenbank, in denselben Tabellen. Jede Mandanten-spezifische Tabelle hat eine `tenant_id uuid NOT NULL` mit Foreign Key auf `tenants(id)`. RLS-Policies erzwingen auf Datenbankebene, dass jede Query nur die Daten des aktuellen Mandanten sieht.

## Implementierung

### Schema-Konvention

```sql
-- Mandanten-Tabelle (kein RLS — nur Super-Admin liest)
CREATE TABLE tenants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,        -- subdomain
  name        text NOT NULL,
  plan        text NOT NULL DEFAULT 'basic',
  status      text NOT NULL DEFAULT 'active',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Jede andere Tabelle hat tenant_id + RLS
CREATE TABLE bookings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  ...
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings FORCE ROW LEVEL SECURITY;  -- gilt auch für Table-Owner
```

### Session-Context-Setup

Jede authentifizierte Request setzt zu Beginn (in tRPC-Middleware):

```sql
SELECT set_config('app.tenant_id', $1, true);  -- true = transactional
SELECT set_config('app.user_id',   $2, true);
SELECT set_config('app.role',      $3, true);
```

Werte stammen aus dem verifizierten JWT.

### RLS-Policies (Vorlage pro Tabelle)

```sql
-- 1. Default DENY (sicher per Default)
CREATE POLICY default_deny ON bookings FOR ALL USING (false);

-- 2. Super-Admin Bypass
CREATE POLICY super_admin_full ON bookings
  FOR ALL
  USING (current_setting('app.role', true) = 'super_admin');

-- 3. Tenant-Isolation für alle anderen
CREATE POLICY tenant_isolation ON bookings
  FOR ALL
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- 4. Optional: feinere Rollen-Policies (s. Roles-Doc)
CREATE POLICY staff_self_read ON bookings
  FOR SELECT
  USING (
    tenant_id = current_setting('app.tenant_id', true)::uuid
    AND current_setting('app.role', true) = 'staff'
    AND staff_id = current_setting('app.user_id', true)::uuid
  );
```

### Konnex-Profile (zwei Postgres-Roles)

- **`app_user`** — von der App-Layer benutzt. Hat keine RLS-Bypass-Rechte. Alle Anfragen unterliegen RLS.
- **`app_admin`** — nur für Migrations + System-Jobs (Cron, Reports). Hat RLS-Bypass via `BYPASSRLS`. Wird **nie** vom Web-/Mobile-Code verwendet.

## Sicherheits-Architektur — Defense in Depth

Drei voneinander unabhängige Schichten:

```
┌──────────────────────────────────────────────────┐
│ LAYER 1: Application Middleware (tRPC)           │
│  · Validiert JWT, extrahiert tenant_id           │
│  · Verbietet Cross-Tenant-Queries explizit       │
└────────────────────┬─────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────┐
│ LAYER 2: SET LOCAL Session-Variables             │
│  · app.tenant_id, app.role, app.user_id          │
│  · Transactional scope (auto-rollback)           │
└────────────────────┬─────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────┐
│ LAYER 3: Postgres RLS-Policies                   │
│  · Database-erzwungene Isolation                 │
│  · Default DENY                                  │
│  · FORCE ROW LEVEL SECURITY auch für Owner       │
└──────────────────────────────────────────────────┘
```

Wenn auch nur eine Schicht fehlerfrei funktioniert, kommt es nicht zu Cross-Tenant-Lecks. Beide andere Schichten als Belt-and-suspenders.

## Subdomain-Routing

| Pfad | Verhalten |
|------|-----------|
| `app.korynth-bookings.de` | Plattform-Marketing + Super-Admin-Login |
| `<salon-slug>.korynth-bookings.de` | Salon-Buchungsseite + Salon-Admin-Login |
| `/admin` (innerhalb Subdomain) | Salon-Owner/Mitarbeiter |
| `/` (innerhalb Subdomain) | Kunde |

Subdomain-Resolution geschieht im Next.js `middleware.ts`:

```ts
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const slug = extractSubdomain(host);  // 'mariana' from 'mariana.korynth-bookings.de'
  if (!slug || slug === 'app') return NextResponse.next();
  // Lookup tenant by slug, attach to request context
  const tenantId = await lookupTenantIdBySlug(slug);
  if (!tenantId) return new NextResponse('Salon not found', { status: 404 });
  // Forward into the app with tenant context
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-tenant-id', tenantId);
  return NextResponse.next({ request: { headers: requestHeaders } });
}
```

## Alternativen geprüft

### Alternative A: Shared DB + Schema-per-Tenant (Postgres `CREATE SCHEMA tenant_42`)

| Aspekt | Bewertung |
|--------|-----------|
| Pro | Stärkere logische Trennung |
| Pro | Schema-Migration kann pro Tenant gestaffelt werden |
| Contra | Migrations werden komplex (loop über alle Schemen) |
| Contra | Connection-Pooling härter (pro-Schema Connection-State) |
| Contra | Skaliert nicht über ~500 Schemata in Postgres ohne Spür-Performance-Issues |

→ **Abgelehnt**: zu viel Operations-Overhead für unsere Skalierungs-Erwartung.

### Alternative B: DB-per-Tenant (eigene Postgres-DB pro Salon)

| Aspekt | Bewertung |
|--------|-----------|
| Pro | Maximale Isolation (kein Cross-Tenant-Risk per Definition) |
| Pro | Salons können in unterschiedliche Regions deployed werden (data residency per Tenant) |
| Pro | Tenant-Backup/Restore atomar |
| Contra | Hosting-Kosten: 100 DBs statt 1 (€€€) |
| Contra | Migrations massiv komplex |
| Contra | Cross-Tenant-Queries (z. B. Super-Admin-Report) sehr aufwendig |
| Contra | Übersteigt MVP-Budget |

→ **Abgelehnt**: zu teuer für MVP-Skala. Mittel-fristige Option für Enterprise-Tier (Phase 3+).

### Alternative C: App-Layer-Isolation (kein RLS)

| Aspekt | Bewertung |
|--------|-----------|
| Pro | DB-agnostisch (auch MySQL möglich) |
| Pro | Performance-Vorteil bei vielen Tabellen (kein RLS-Overhead) |
| Contra | **Ein vergessener `WHERE tenant_id = ?` reicht für Datenleak** — Hauptrisiko |
| Contra | SOC 2 / ISO 27001-Audits empfehlen DB-erzwungene Isolation |
| Contra | DSGVO-Argument vor Aufsicht schwieriger zu führen |

→ **Abgelehnt**: zu fehleranfällig. RLS ist gerichtsfest, App-Layer-Isolation ist nicht.

### Alternative D: Hybrid (RLS + Schema-per-Tenant für Hot-Salons)

→ Hinausgezögert (Phase 4 optional). Falls einzelne Salons > 100k Buchungen/Monat erreichen, können wir sie auf eigenes Schema migrieren ohne MVP-Wechsel.

## Datenmigrationen mit RLS

Migrations werden über die `app_admin`-Role gefahren (RLS-Bypass). In Drizzle:

```ts
// drizzle.config.ts
export default {
  ...
  dbCredentials: {
    // app_admin role with BYPASSRLS, only in CI/migration context
    url: process.env.DATABASE_MIGRATIONS_URL!,
  },
};
```

Runtime-App benutzt strikt `app_user` ohne Bypass.

## Cross-Tenant-Operationen (Super-Admin)

Super-Admin braucht zwangsläufig Cross-Tenant-Zugriff (Salon-Liste, System-Metriken). Implementation:

- Super-Admin-User hat `role='super_admin'` im JWT.
- RLS-Policies prüfen `current_setting('app.role') = 'super_admin'` und bypassen Tenant-Filter.
- **Jede Super-Admin-Aktion** wird in `super_admin_log` festgehalten (zusätzlich zum normalen audit_log) mit IP, User-Agent, Aktion.
- 2FA Pflicht für Super-Admin (Phase 1) und Annual Re-Auth (Phase 2).

## Cross-Tenant-Reporting / Analytics

Für Plattform-übergreifende Metriken (z. B. „wie viele Buchungen wurden auf der gesamten Plattform diese Woche getätigt?"):

- Read-Replica oder dedizierter Analytics-User mit BYPASSRLS
- Aggregations-Queries laufen nie in Salon-Owner-Kontext
- Zugriff auf solche Aggregations-Endpoints nur für `super_admin`

## DSGVO-Implikationen

- **Auftragsverarbeiter-Setup**: Korynth Bookings (Belkis) ist Verantwortlicher gegenüber Endkunden. Korynth Labs ist Auftragsverarbeiter (DPA gilt).
- **Mandantentrennung gerichtsfest**: RLS in Postgres ist eine technisch-organisatorische Maßnahme i.S.v. Art. 32 DSGVO. Wir dokumentieren die Implementation in den TOMs der DPA.
- **Datenlöschung**: `DELETE FROM tenants WHERE id = ?` triggert `ON DELETE RESTRICT` (sicher), eigentlicher Löschworkflow geht über Soft-Delete + manuelles Audit-Review + Hard-Delete nach Aufbewahrungspflicht-Ablauf.
- **Datenexport**: `SELECT * FROM <tabelle> WHERE tenant_id = ?` als JSON-Export pro Salon einfach machbar.

## Testing-Strategie für RLS

Pro Tabelle automatisierte Tests:

1. **Tenant A schreibt → Tenant B liest ⇒ 0 Zeilen** (sollte NIE Daten zeigen)
2. **Tenant A schreibt → Tenant A liest ⇒ N Zeilen** (sollte funktionieren)
3. **Staff-User innerhalb Tenant A liest fremde Mitarbeiter-Daten ⇒ Abweisung** (Rollen-Test)
4. **Super-Admin liest Tenant A + B ⇒ alle Zeilen** (Bypass-Test)
5. **App-User versucht direkt SQL → Schreibversuch ohne tenant_id ⇒ DB-Constraint fails** (sicher)

Diese Tests laufen in CI bei jedem PR. **0 Toleranz für Cross-Tenant-Lecks.**

## Performance-Überlegungen

RLS hat einen messbaren Overhead (~5–15 %). Mitigation:

- Indizes auf `(tenant_id, <häufig gefiltertes Feld>)` für Hot-Tabellen
- `EXPLAIN ANALYZE` für jede neue Query in Code-Review-Pflicht
- Bei Slow-Queries: prüfen ob RLS-Filter im Plan early genug greift (`pg_stat_statements`)

## Migrations-Pfad falls wir das Modell später ändern wollen

Falls in Phase 3 ein Hot-Salon DB-per-Tenant braucht:

1. `pg_dump` der Tenant-Daten
2. Neuer DB-Cluster für diesen Salon
3. `pg_restore` mit tenant_id-Filter (wird via View vorbereitet)
4. App-Code: tenant→connection-String-Map einführen (Routing-Layer)
5. Original-DB: `DELETE FROM ... WHERE tenant_id = ?`

Aufwand: ~2 Wochen pro migriertem Salon. Akzeptabel als One-Off für Enterprise-Kunden.

## Devil's-Advocate-Review (#027)

**Q1:** „Was passiert wenn ein App-Code-Bug `app.tenant_id` nicht setzt?"

**A:** `current_setting('app.tenant_id', true)` returnt NULL. `tenant_id = NULL` ist nie wahr → 0 Zeilen. Default-DENY-Policy. App-Code würde direkt 0-Result-Bug zeigen, was im Test sofort auffällt.

**Q2:** „Was passiert bei einer SQL-Injection?"

**A:** Drizzle ORM verwendet Parameter, keine String-Konkatenation. Selbst bei einer hypothetischen Injection in einer Query: RLS feuert. Angreifer müsste BYPASSRLS-Connection bekommen → das geht nur über `app_admin`-Connection, die niemals public exposed ist.

**Q3:** „Was passiert wenn Supabase eine Migration unsicher ausführt?"

**A:** Wir verwenden Drizzle-eigene Migrations, kein Supabase-Auto-Migration. Migrations werden in CI gegen einen Test-Stack gefahren mit RLS-Test-Suite davor und danach.

**Verdikt:** Approved. Default-DENY + FORCE RLS schließt die häufigsten Lücken.

## Entscheidung

✅ **Approved (Quorum: Mira #003, Jonas #002, Yasmin #017, Karim #018, Critic #027)**, 24h-Soak läuft.

Hinweis an Belkis: Diese Entscheidung muss nicht von dir bestätigt werden (sie folgt aus ADR-001 + Premium-MVP-Scope), aber sie ist vollständig dokumentiert für deinen Einblick und das spätere DSGVO-Audit.

## Konsequenzen

### Positiv
- Cross-Tenant-Leck praktisch ausgeschlossen (3 Schichten Defense)
- Skaliert problemlos auf 1.000+ Tenants
- DSGVO-Argumentation für Aufsichtsbehörden klar
- Backups + Migrations zentral

### Negativ / Mitigation
- ~5–15% RLS-Overhead → Indizes + Code-Review-Pflicht
- Cross-Tenant-Reporting muss explizit gebaut werden → ist in MVP-Reporting-Modul vorgesehen
- Hot-Salon-Sonderfall in Phase 3+ → dokumentierter Migrations-Pfad

## Audit

Audit-Log-Eintrag bei Approval: `adr_approved · 002 · multi_tenancy_rls`.

## Folge-ADRs

- ADR-003 Auth-Provider (Day 14, jetzt vorgezogen auf Day 4)
- ADR-005 Slot-Engine (referenziert ADR-002 für RLS-Constraints in der Slot-Engine)
- ADR-006 Payment-Abstraction (referenziert RLS für Stripe-Webhook-Validation)

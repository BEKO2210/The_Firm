---
adr: 003
title: Auth-Provider — Supabase Auth (mit Custom-Claims-Erweiterung)
ticket: TCK-20260513-0001
status: "PROPOSED — Quorum-approved, soak running"
real: 2026-05-13T21:05:00Z
sim:  Day 4, 11:00
authors: ["003 Mira Lundberg", "002 Jonas Weber"]
reviewers: ["017 Yasmin El-Sayed (DPO)", "018 Karim Haddad (CISO)", "027 Devil's Advocate"]
decision_class: "Type-1 Critical"
depends_on: [001, 002]
---

# ADR-003 · Auth-Provider

## Kontext

Wir brauchen Auth für 5 Rollen (Super-Admin, Salon-Owner, Mitarbeiter, Kunde registered, Kunde guest), Web + spätere Mobile-Apps, DSGVO-konform, EU-Region.

## Entscheidung

**Supabase Auth** (EU-Region Frankfurt) mit Custom-Claims-Erweiterung in JWT.

## Konfiguration

| Setting | Wert |
|---------|------|
| Provider | Email + Passwort (Argon2id-Hash automatisch) |
| Token-Format | JWT (RS256) |
| Access-Token-TTL | 15 Minuten |
| Refresh-Token-TTL | 30 Tage (rotating) |
| Magic-Link für Gast-Stornos | ja, 7 Tage Gültigkeit |
| Passwort-Reset | ja, Email-Link 2h Gültigkeit |
| Rate Limiting | 5 Login-Versuche/min pro Email, 100/h pro IP |
| HIBP-Check | aktiv (kompromittierte Passwörter blockiert) |
| 2FA TOTP | Phase 1 optional für Owner/Staff, Phase 2 Pflicht für Super-Admin |
| OAuth (Google/Apple) | Phase 2 |
| Server-side Verification | jeder Request via Supabase JWT-Verify |

## Custom Claims im JWT

Supabase Auth lässt Custom Claims via Auth Hook (Postgres-Function) einfügen:

```sql
CREATE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE
  claims jsonb;
  v_tenant_id uuid;
  v_role text;
BEGIN
  claims := event->'claims';
  -- Lookup user → tenant + role from `app_users` table
  SELECT tenant_id, role INTO v_tenant_id, v_role
  FROM public.app_users
  WHERE user_id = (event->>'user_id')::uuid;

  claims := jsonb_set(claims, '{tenant_id}', to_jsonb(v_tenant_id));
  claims := jsonb_set(claims, '{role}',      to_jsonb(v_role));
  RETURN jsonb_set(event, '{claims}', claims);
END;
$$;
```

Damit enthält jedes JWT bereits `tenant_id` und `role` — RLS-Policies können direkt darauf zugreifen.

## Alternativen geprüft

| Alternative | Pro | Contra | Verdict |
|-------------|-----|--------|---------|
| **Clerk** | sehr gute DX, schöne UI, OAuth | US-only Servers, DSGVO-Schwäche, separates Subprocessor-AVV nötig | ❌ Schrems-II-Risiko zu hoch |
| **Auth0** | Enterprise-Standard | Teurer, weniger Postgres-integriert | ❌ overkill für MVP |
| **NextAuth + own DB** | volle Kontrolle, kostenlos | gesamter Auth-Stack selbst maintainen | ❌ Auth-Bugs sind teuer |
| **Keycloak self-hosted** | OSS, EU-Hosting trivial | Operations-Aufwand hoch | ❌ Aufwand übersteigt MVP-Wert |

→ Supabase Auth: native Integration mit unserem DB-Stack, EU-Region, AVV existiert, JWT-basiert (mobile-tauglich), Custom Claims für Multi-Tenancy einfach.

## App-Readiness (Phase 2 Mobile)

JWT-basiert + Refresh-Token = funktioniert sofort in React Native/Expo ohne Änderungen. Supabase JS-Client läuft identisch in Web + Mobile.

## Sicherheits-Maßnahmen

- HIBP-Pwned-Passwords-Check beim Signup + Passwort-Reset
- Rate Limiting auf Cloudflare-Edge zusätzlich
- Audit-Log für jeden Login (success + failure)
- Suspicious-Login-Detection (Phase 2: unbekannte IP/Device → 2FA-Forced)
- Session-Invalidation bei Passwort-Reset (alle Refresh-Tokens revoked)

## DSGVO-Punkte

- Pflicht-Daten: Email + Passwort-Hash. Keine weiteren PII bei Registration.
- Marketing-Consent: separat, opt-in.
- Account-Löschung: 1-Klick im Profil → soft delete + DSGVO-Tool führt Hard-Delete nach Aufbewahrungs-Ablauf.

## Konsequenzen

✅ Native Multi-Tenancy via Custom Claims
✅ Mobile-tauglich ohne Refactoring
✅ DSGVO-konform (EU-Region + AVV)
❌ Vendor-Lock-in bei Supabase Auth (Mitigation: Exit-Plan dokumentiert, Auth0/Keycloak-Migration 2–4 Wochen möglich)

## Entscheidung

✅ **Approved** (Quorum + 24h-Soak)

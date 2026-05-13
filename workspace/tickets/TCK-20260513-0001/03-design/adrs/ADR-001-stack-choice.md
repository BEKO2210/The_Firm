---
adr: 001
title: Tech-Stack-Wahl für Premium MVP
ticket: TCK-20260513-0001
status: "PROPOSED — awaiting principal nod at 1st status slot (Day 2 Donnerstag)"
real: 2026-05-13T20:35:00Z
sim:  Day 2, 11:00 (Sprint 1 · Q1 2026)
authors:
  - "003 Mira Lundberg (Principal Engineer)"
  - "002 Jonas Weber (CTO)"
reviewers:
  - "005 Eilidh MacKenzie (AI Research Lead) — Slot-Engine-Constraints"
  - "017 Yasmin El-Sayed (DPO) — DSGVO-Konformität"
  - "027 Devil's Advocate / Architecture Critic — pre-mortem"
decision_class: "Type-1 Critical (irreversible, high impact)"
authority: "Quorum (CEO + CTO + Principal Engineer + AI Research Lead) + 24h soak"
---

# ADR-001 · Tech-Stack-Wahl für Premium MVP

## Kontext

Wir bauen für Belkis Aslani eine Multi-Tenant-SaaS-Plattform für Friseur-/Beauty-Salons. Die Plattform muss:

- Web + (Phase 2) iOS + Android bedienen
- Multi-tenant skalieren (Ziel: 100+ Salons in 12 Monaten)
- Eine geschäftskritische Slot-Engine mit harten Doppelbuchungs-Garantien bereitstellen
- DSGVO-konform sein (Region DE), EU-AI-Act-aware, audit-fähig
- App-Readiness ab MVP (Phase-2-Migration ohne Refactoring)
- IP-Eigentum vollständig an Belkis übertragbar

Dieser ADR formalisiert die in der Discovery v1+v2 vorgeschlagene Stack-Wahl und dokumentiert die Alternativen.

## Entscheidung

Wir verwenden:

| Schicht | Wahl | Hauptgrund |
|---------|------|------------|
| **Frontend Web** | **Next.js 15 (App Router) + React 19 + TypeScript strict** | App-Router production-stable, RSC für SEO + Performance, gleiche Sprache wie Backend |
| **UI-Bibliothek** | **Tailwind CSS 4 + shadcn/ui** | Konsistent mit Korynth-Labs-Dashboard, keine Vendor-Lock-Komponenten, voll customizable |
| **Backend (App Layer)** | **TypeScript auf Next.js Server Actions + tRPC** | Type-safe end-to-end, kein API-Schemata-Drift, gleiche Codebase wie Frontend |
| **Mobile (Phase 2)** | **Expo + React Native** | 80–90% Code-Sharing mit `packages/core`, ein Team |
| **Datenbank** | **Supabase Postgres 16 (EU Frankfurt)** | Battle-tested, RLS für Multi-Tenancy nativ, Auth + Storage inklusive, AVV vorhanden |
| **Auth** | **Supabase Auth** | Magic-Link, OAuth-ready, JWT-basiert, mobile-tauglich |
| **Storage** | **Supabase Storage** (Logos, Bilder) + **Cloudflare R2** (Backups) | Beides EU-Region, getrennt für Defense-in-Depth |
| **Email** | **Resend (EU-Region)** | Beste DX, EU-Hosting, transactional + bald marketing |
| **Hosting** | **Vercel (EU-Region Frankfurt)** | Optimal für Next.js 15, Preview-Deploys pro PR, Edge-Functions für Slot-Engine |
| **Observability** | **Sentry (EU)** + **Better Stack (EU)** + **OpenTelemetry** | Errors + Uptime + Tracing, DSGVO-konform |
| **CI/CD** | **GitHub Actions** | Repo-native, Free für unsere Größe |
| **Package Manager** | **pnpm + Turborepo (Monorepo)** | Workspaces für `apps/web`, `apps/mobile` (Phase 2), `packages/core`, `packages/db` |
| **ORM / DB-Toolkit** | **Drizzle ORM** | Type-safe SQL, leichter als Prisma, perfekt für RLS-Mehrfach-Schemen |
| **Validation** | **Zod** | Standard im Stack, gleiche Schemas auf Server + Client + Mobile |
| **Testing** | **Vitest (Unit/Integration)** + **Playwright (E2E)** + **fast-check (Property-Tests)** + **pgbench (Concurrency-Tests)** | Stack-konsistent, gut für CI |

## Repository-Struktur (Monorepo)

```
/
├── apps/
│   ├── web/                       Next.js 15 — Kunde + Admin + Super-Admin
│   └── mobile/  (Phase 2)         Expo — Kunde-App (später)
├── packages/
│   ├── core/                      Geschäftslogik + Slot-Engine + Validation-Schemas
│   ├── db/                        Drizzle Schema + Migrations
│   ├── ui/                        Shared UI primitives (Web + Mobile)
│   └── config/                    Shared ESLint / TS / Prettier configs
├── tools/                         CI helpers, schema-codegen
├── docs/                          ADRs, runbooks, API-Docs (OpenAPI)
└── infra/                         IaC für externe Dienste (env-config, secrets-templates)
```

**App-Readiness-Garantien** (gemäß SOW § 11):

- `packages/core` enthält alle Business-Logik **frei von Web-DOM-Abhängigkeiten** → mobile (Phase 2) verwendet die gleichen Funktionen
- tRPC-Client funktioniert identisch in Web (`@trpc/react-query`) und Mobile (gleiche Library, React-Native-kompatibel)
- Auth: JWT-basiert, kein Cookie-only — funktioniert sofort in Mobile
- Datenschema vorbereitet: `device_tokens`-Tabelle für spätere Push-Notifications (FCM/APNS)

## Alternativen geprüft

### Alternative 1: Remix + tRPC + Postgres-on-eigenem-Hosting

| Aspekt | Bewertung |
|--------|-----------|
| Pro | Hervorragende Web-Stand, RSC, sehr Form-zentriert |
| Pro | Open-Source-Hosting möglich |
| Contra | Mobile-Code-Sharing schwieriger (Remix-spezifische Patterns) |
| Contra | Weniger umfassendes Ökosystem als Next.js |
| Contra | Eigenes Postgres + Auth = mehr Ops-Aufwand (vs Supabase) |

→ **Abgelehnt**: zwingender Mobile-Plan macht Next.js + Expo gemeinsamer Codebase überlegen.

### Alternative 2: SvelteKit + Pocketbase

| Aspekt | Bewertung |
|--------|-----------|
| Pro | Sehr leichtgewichtig, schnelle DX |
| Contra | Mobile-Story unklar (Capacitor o.ä., kein nativer Code-Share) |
| Contra | Kleineres Ökosystem für AI-Native-SaaS-Patterns |

→ **Abgelehnt**: Mobile-Strategie nicht etabliert.

### Alternative 3: Native Apps via Swift + Kotlin + Web getrennt

| Aspekt | Bewertung |
|--------|-----------|
| Pro | Beste native UX |
| Contra | 3× Codebase = 3× Aufwand, 3× Bugs, 3× Maintenance |
| Contra | Slot-Engine müsste in 3 Sprachen reproduziert (oder per API gerufen — dann egal) |
| Contra | Verstößt gegen Belkis' App-Readiness-Anforderung (separates SOW pro Plattform) |

→ **Abgelehnt**: Massive Kostenmultiplikation ohne UX-Vorteil im Buchungs-Use-Case.

### Alternative 4: Flutter + Firebase

| Aspekt | Bewertung |
|--------|-----------|
| Pro | Single-Codebase Web + Mobile |
| Contra | Dart statt TypeScript — Talent-Marktbasis schmaler |
| Contra | Firebase = US-only, schwierige DSGVO-Position |
| Contra | Slot-Engine in Dart neu implementieren = zusätzlicher Aufwand |

→ **Abgelehnt**: DSGVO-Schwäche + kleineres TypeScript-Ökosystem.

### Alternative 5: Standardstack ohne RLS — Tenant-Isolation in App-Layer

| Aspekt | Bewertung |
|--------|-----------|
| Pro | DB-agnostisch (Postgres / MySQL / SQLite) |
| Contra | App-Layer-Isolation ist fehleranfälliger — ein vergessener `where tenant_id =` reicht für Datenleak |
| Contra | Audit-Empfehlung (SOC 2, ISO 27001) bevorzugt DB-erzwungene Isolation |

→ **Abgelehnt**: RLS in Postgres ist robuster + gerichtsfest.

## Konsequenzen

### Positive

- **Eine Sprache (TypeScript)** über den gesamten Stack — Talent-Pool tief, Lernkurve flach
- **App-Readiness ab Tag 1** — Phase-2-Migration ohne Refactor
- **DSGVO-konform** — alle Komponenten EU-Region
- **Slot-Engine in Postgres-natives** GIST-EXCLUDE + SERIALIZABLE — geschäftskritische Garantie auf DB-Ebene
- **Vendor-Lock-in begrenzt** — siehe Exit-Strategie (Anlage 5 zum MSA)
- **Production-ready Stack** — Tausende Firmen nutzen exakt diese Komponenten

### Negative / Mitigation

- **Supabase US-Mutter** (Schrems-II-Risiko). Mitigation: Standardvertragsklauseln, EU-Region zwingend, TADPF-Zertifizierung in Beobachtung; EU-only-Alternative im Exit-Plan dokumentiert
- **Vercel US-Mutter**. Mitigation: gleicher Plan wie Supabase; OVH/Hetzner-Alternative dokumentiert
- **Monorepo-Komplexität** (Turborepo). Mitigation: klare Conventions, gute CI-Caching-Setup
- **Drizzle noch jünger als Prisma**. Mitigation: Aktive Community, Migrations-Tooling solide, Anthropic + viele Tier-1-Firmen produktiv

### Reversibilität

| Komponente | Reversibilitäts-Bewertung | Migrations-Aufwand |
|------------|---------------------------|--------------------|
| Next.js → Remix | Type-2 (reversibel mit Refactor) | 6–8 Wochen |
| Supabase Postgres → Neon | **Type-2** (Standard-Postgres) | 1–2 Wochen |
| Supabase Auth → Auth0/Clerk | **Type-2** | 2–4 Wochen |
| Vercel → Cloudflare Pages | **Type-2** (Next.js läuft überall) | 1 Woche |
| Resend → Postmark/SES | **Type-2** | 2 Tage |
| **Stack insgesamt** | **Type-2 mit gut beherrschbarem Aufwand** | siehe Exit-Strategie |

→ Keine echten Type-1-Komponenten. Jede einzelne Komponente kann später ohne Big-Bang-Rewrite ersetzt werden.

## Devil's-Advocate-Review (#027)

**Frage 1:** „Was ist das #1-Risiko dieser Wahl in 3 Jahren?"

**Antwort:** Supabase übernimmt Politik-/Lizenzwechsel, der unfair für uns wird (z. B. radikale Preiserhöhung). Mitigation: Exit-Strategie ist dokumentiert, Migration zu Neon o.ä. ist 1–2 Wochen Aufwand bei 100 Salons.

**Frage 2:** „Was übersehen wir?"

**Antwort:** Echtzeit-Features (Live-Kalender-Updates) sind im MVP nicht enthalten, aber Supabase Realtime ist kostenlos verfügbar. Wenn wir Realtime-Sync später wollen, ist die Migration trivial.

**Frage 3:** „Würden wir diese Wahl auch ohne den Korynth-Labs-Hausstandard treffen?"

**Antwort:** Ja. Belkis' Anforderungsprofil (App-Readiness, DSGVO, Premium-Tier, Multi-Tenant) matcht diesen Stack unabhängig von unseren internen Präferenzen.

**Verdikt:** Empfehlung Approved.

## Entscheidung

✅ **Approved (Quorum: CTO Jonas Weber, Principal Engineer Mira Lundberg, AI Research Lead Eilidh MacKenzie, DPO Yasmin El-Sayed)** mit 24h-Soak-Phase.

Die endgültige Bestätigung holt sich Korynth Labs beim **1. Status-Slot mit Belkis am Donnerstag (Day 2)** — falls sie Einwände hat, überarbeiten wir den ADR.

## Wenn Belkis zustimmt

Sofortige Aktionen (Day 3–10):
- ADR-002 Multi-Tenancy-Modell finalisieren (auf RLS-Basis)
- Repo-Skeleton mit Monorepo-Setup
- Erste Schemata in Drizzle definieren
- Subprocessor-AVVs in Vorbereitung (Yasmin)
- Dependency-License-Whitelist (siehe IP-Assignment § 8)

## Audit

Audit-Log-Eintrag bei Approval: `adr_approved · 001 · stack_choice`.

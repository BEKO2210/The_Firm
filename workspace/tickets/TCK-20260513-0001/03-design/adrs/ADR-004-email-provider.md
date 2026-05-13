---
adr: 004
title: Email-Provider — Resend + React-Email-Templates
ticket: TCK-20260513-0001
status: "PROPOSED — Quorum-approved"
real: 2026-05-13T21:42:00Z
sim:  Day 5, 11:00
authors: ["003 Mira Lundberg", "002 Jonas Weber"]
reviewers: ["017 Yasmin El-Sayed (DPO)", "027 Devil's Advocate"]
decision_class: "Type-2 (reversible)"
depends_on: [001]
---

# ADR-004 · Email-Provider

## Kontext

Für MVP benötigen wir Transactional Emails:
- Buchungs-Bestätigung (Kunde)
- Erinnerung 24h + 2h vor Termin
- Status-Änderungen (Storno, Umbuchung, Bestätigung)
- Passwort-Reset (Auth-Flow)
- DSGVO-Tools (Datenexport-Link, Lösch-Bestätigung)
- (Phase 2) Marketing-Mails — opt-in

Anforderungen:
- EU-Hosting (DSGVO)
- AVV verfügbar
- Templating mit Brand-Anpassung pro Salon
- Hohe Zustellrate
- Webhook für Bounce/Spam-Reports
- Programmierbar von TypeScript-Stack
- Kostenkontrolle

## Entscheidung

**Resend (EU-Region) + React-Email für Templates.**

## Setup

| Aspekt | Detail |
|--------|--------|
| Provider | Resend Inc. |
| Region | EU (alle PII verbleiben in EU) |
| AVV | unterschrieben vor Production (siehe AVV-Status-Tracking) |
| Sub-Domains | Plattform: `mail.korynth-bookings.de`; pro Salon optional `mail.<slug>.korynth-bookings.de` (Phase 2) |
| DKIM / DMARC / SPF | von Tag 1 konfiguriert, Aufbau in Design-Phase |
| Templating | React Email (TSX-Komponenten in `packages/email-templates`) |
| Branding | Per-Salon Logo + Farben aus `salon_profile` injiziert in Template |
| Localization | DE im MVP, i18n-keys vorbereitet für EN (Phase 2) |
| Bounce Handling | Webhook → eigenes `email_bounces`-Schema → Salon-Admin sieht Hard-Bounces in CRM |
| Rate Limits | Resend default 100 req/sec |
| Cost | ~€0,001 / Mail bei < 50k/Monat. Bei 100 Salons × 1.000 Buchungen × 3 Mails/Buchung = 300k Mails = ~€300/Mo |

## Templates (Skelett, finale Texte in Build)

| Template | Trigger | Empfänger | Brand-Override |
|----------|---------|-----------|:--------------:|
| `booking_confirmation` | sofort nach Buchung | Kunde | Salon |
| `reminder_24h` | Cron, 24h vor Termin | Kunde | Salon |
| `reminder_2h` | Cron, 2h vor Termin | Kunde | Salon |
| `booking_cancelled_by_customer` | Storno-Trigger | Salon-Admin | Plattform |
| `booking_cancelled_by_salon` | Salon-Storno | Kunde | Salon |
| `booking_rescheduled` | Umbuchung | Kunde | Salon |
| `password_reset` | Auth-Flow | User | Plattform |
| `magic_link_guest_storno` | Gastbuchungs-Action-Link | Gast | Salon |
| `dsgvo_export_ready` | DSGVO-Tool fertig | Kunde | Salon |
| `dsgvo_deletion_confirmation` | nach Hard-Delete | Kunde | Salon |
| `salon_welcome` | Salon-Anlage | Salon-Owner | Plattform |
| `staff_invite` | Mitarbeiter eingeladen | neuer Mitarbeiter | Salon |

## Anti-Spam / DSGVO

- **Double Opt-In für Marketing-Mails** (Phase 2 Pflicht)
- **Unsubscribe-Link in jeder Mail** (auch Transactional, falls Kunde wünscht)
- **No-Tracking-Pixel by default** (Open-Rate-Tracking opt-in pro Salon)
- **Datenexport** beinhaltet alle gesendeten Mails (Compliance)
- **Aufbewahrung**: gesendete Mails 90 Tage in Resend, dann gelöscht (Resend-eigene Retention).

## Alternativen geprüft

| Alternative | Pro | Contra | Verdict |
|-------------|-----|--------|---------|
| **Postmark** | EU-Region, hohe Zustellrate, lange am Markt | DX schwächer als Resend, älteres SDK | ❌ marginale Vorteile |
| **Mailjet** (FR) | EU-only (keine US-Mutter), DSGVO-stark | DX schwächer | ⏳ als EU-only-Alternative für Phase 3 dokumentiert |
| **AWS SES** | sehr günstig, AWS-Stack-konsistent | Keine schöne Template-UX, mehr Setup | ❌ Total Cost of Ownership höher als Resend bei unserer Skala |
| **SendGrid** | Marktführer | US-only, DSGVO komplex, teurer | ❌ Schrems-II-Risiko |

→ Resend gewinnt auf DX + EU-Region + Preis.

## Konsequenzen

✅ Schnelle Implementation (React Email Templates wiederverwendbar pro Salon)
✅ EU-konform (AVV unterzeichnet bevor Production)
✅ Per-Salon-Branding möglich
✅ Bounce-Webhook → Salon-CRM sichtbar (besseres Kundenmanagement)
❌ US-Mutter Resend → SCC + TADPF-Mitigation, dokumentiert in Subprocessor-Liste

## Reversibilität

Type-2: Resend → Postmark/Mailjet/AWS SES Migration ≈ 2 Werktage (Provider-Interface in `lib/email/IEmail.ts` abstrahiert; nur Implementation austauschen).

## Entscheidung

✅ **Approved** (Quorum: Mira, Jonas, Yasmin, Critic)

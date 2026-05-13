---
document: "Subprocessor-Liste & Datenresidenz"
ticket: "TCK-20260513-0001"
parent: "DPA"
version: "1.0 — Draft"
status: "DRAFT"
language: "de"
---

# Subprocessor-Liste & Datenresidenz

Anlage 5 zum MSA (Bestandteil der DPA) · TCK-20260513-0001

## 1. Aktive Subprocessors zum Zeitpunkt von Release v1.0

| # | Subprocessor | Zweck | Daten-Region | AVV-Status | Zertifizierungen |
|---|--------------|-------|---------------|-----------|------------------|
| 1 | **Supabase Inc.** | Postgres-DB (Stammdaten, Buchungen, Audit-Log, Customer-Daten), Auth, Storage (Bilder, Logos), RLS | **EU-West / Frankfurt** | AVV unterzeichnet vor Build-Start (Sim-Tag 7) | SOC 2 Type II, ISO 27001 |
| 2 | **Vercel Inc.** | Hosting Next.js App, Edge Functions, Cron Jobs | EU-Region (Frankfurt-fra1) | AVV unterzeichnet vor Build-Start | SOC 2 Type II, ISO 27001 |
| 3 | **Resend Inc.** | Transactional Emails (Bestätigung, Erinnerungen, Status-Mails) | EU-Region | AVV unterzeichnet vor Build-Start | SOC 2 in progress |
| 4 | **Functional Software, Inc. (Sentry)** | Error- und Performance-Monitoring | EU-Region (Frankfurt) | AVV unterzeichnet vor Build-Start | SOC 2 Type II, ISO 27001 |
| 5 | **Cloudflare, Inc.** | R2 Object Storage (Backups), DNS, CDN | EU-Region | AVV unterzeichnet vor Build-Start | SOC 2 Type II, ISO 27001 |
| 6 | **Better Stack** | Uptime-Monitoring, On-Call-Rotation | EU | AVV unterzeichnet vor Production-Deploy | SOC 2 Type II |

## 2. Subprocessors mit US-Muttergesellschaft (Schrems-II-Relevanz)

Folgende Subprocessor haben EU-Tochterunternehmen, aber US-Muttergesellschaft:

- Supabase Inc. (US-Mutter, EU-Region für unsere Daten)
- Vercel Inc. (US-Mutter, EU-Region für unsere Daten)
- Resend Inc. (US-Mutter, EU-Region)
- Sentry (Functional Software Inc., US-Mutter, EU-Region für uns)
- Cloudflare (US-Mutter, EU-Region für uns)

**Schutzmaßnahmen für diese Subprocessor:**

- Standardvertragsklauseln (SCC) nach Beschluss (EU) 2021/914
- EU-only Datenverarbeitung vertraglich zugesichert
- Verschlüsselung at rest (AES-256) und in transit (TLS 1.3)
- Keine Zugriffe von Mitarbeitern außerhalb der EU ohne Verschlüsselung
- Transparency-Reports der Anbieter werden jährlich überprüft

**Trans-Atlantic Data Privacy Framework (TADPF, 2023)**: Alle obigen Subprocessors haben sich für das TADPF zertifiziert oder werden in 2026 zertifizieren. Wir überwachen die Zertifizierungsstati.

## 3. Subprocessors nur in EU (kein US-Bezug)

Geplant für Phase 2 / falls EU-only-Anforderung steigt:

| Anbieter | Zweck | Daten-Region | Verfügbar |
|----------|-------|---------------|-----------|
| Aiven for PostgreSQL | DB-Alternative zu Supabase | EU-only | sofort, gegen Aufpreis |
| Scaleway Object Storage | Storage-Alternative zu R2 | FR (EU-only) | sofort, gegen Aufpreis |
| Mailjet | Email-Alternative zu Resend | FR (EU-only) | sofort |
| OVHcloud / Hetzner | Hosting-Alternative zu Vercel | DE (EU-only) | mit Setup-Aufwand, gegen Aufpreis |

## 4. Datenresidenz-Garantien

(1) **Alle personenbezogenen Daten werden ausschließlich in der EU verarbeitet.**

(2) Backups werden nur in EU-Regionen abgelegt.

(3) Bei Disaster-Recovery erfolgt Wiederherstellung ausschließlich in einer EU-Region.

(4) Mitarbeiter von Korynth Labs greifen nur über verschlüsselte VPN-Verbindungen mit MFA auf Produktivsysteme zu.

## 5. Ankündigung von Subprocessor-Änderungen

Gemäß § 7 DPA werden Änderungen mit 30 Tagen Vorlauf angekündigt. Du hast ein Widerspruchsrecht. Bei begründetem Widerspruch suchen wir gemeinsam eine Alternative oder du kannst das SOW außerordentlich kündigen.

## 6. Audit-Reports der Subprocessor

Wir stellen dir auf Anforderung folgende Reports zur Verfügung:

- Supabase: SOC 2 Type II (jährlich)
- Vercel: SOC 2 Type II (jährlich)
- Cloudflare: SOC 2 Type II + ISO 27001 (jährlich)
- Sentry: SOC 2 Type II (jährlich)

## 7. Liste-Versionierung

| Version | Datum (real) | Änderung |
|---------|--------------|----------|
| 1.0 | 2026-05-13 | Initial-Liste zum SOW-001 Premium MVP |

Aktualisierungen erfolgen nach jedem Subprocessor-Wechsel + jährlich.

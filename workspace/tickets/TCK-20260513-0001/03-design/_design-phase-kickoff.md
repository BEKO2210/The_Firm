---
real: 2026-05-13T20:10:00Z
sim:  Day 2, 09:00 (Sprint 1 · Q1 2026)
ticket: TCK-20260513-0001
phase: Design
start_sim_day: 2
end_sim_day_planned: 29   # 6 Tage vor Original-Plan (35) wegen frühem M1
m2_target_sim_day: 29
duration_sim_weeks: ~4
authors:
  - "003 — Mira Lundberg (Principal Engineer, Design Lead)"
  - "002 — Jonas Weber (CTO)"
  - "020 — Omar Abadi (Designer)"
  - "005 — Eilidh MacKenzie (AI Research Lead — Slot-Engine review)"
  - "017 — Yasmin El-Sayed (DPO — DPIA)"
---

# Design-Phase · Kickoff TCK-20260513-0001

## Trigger

M1 erfüllt am Sim-Tag 1 (6 Tage vor Plan). Design-Phase startet sofort am Sim-Tag 2.

## Liefergegenstände bis M2 (Sim-Tag 29)

| Lieferung | Owner | Ziel-Sim-Tag |
|-----------|-------|:------------:|
| **ADR-001** Stack-Wahl (Next.js 15 + Supabase + Expo + Vercel) | Mira (#003) | Day 10 |
| **ADR-002** Multi-Tenancy-Modell (Postgres RLS) | Jonas (#002) + Mira | Day 12 |
| **ADR-003** Auth-Provider (Supabase Auth vs eigene Implementation) | Mira | Day 14 |
| **ADR-004** Email-Provider (Resend) + Templating-Strategie | Jonas | Day 16 |
| **ADR-005** Slot-Engine-Architecture (Final-Algorithmus + GIST EXCLUDE) | Mira + Eilidh (#005) | Day 18 |
| **ADR-006** Payment-Abstraction (Provider-neutral, IPayment-Interface) | Mira | Day 20 |
| **Datenmodell finalisiert** (DDL-Skripte, alle Tabellen, alle RLS-Policies, Migrations 0001 + 0002) | Mira + Backend-Maker-Team | Day 22 |
| **UI-Wireframes** (Figma): Kunde-Web Customer-Buchungsflow (mobile + desktop) + Admin-Dashboard (alle MVP-Screens) | Omar (#020) | Day 24 |
| **DPIA-Dokument** (DSGVO Art. 35) | Yasmin (#017) | Day 26 |
| **Pilot-Salon-Onboarding-Checkliste** | Sander (#004) Coordinator | Day 27 |
| **Subprocessor-AVVs unterschrieben** (Supabase, Vercel, Resend, Sentry, Cloudflare, Better Stack) | Yasmin + Priya (#021) | Day 28 |
| **Design-Review-Meeting** mit dir (Belkis) | Priya | Day 29 |
| **M2 Sign-off** | Belkis | Day 29 |

## Sprints in der Design-Phase

Design-Phase wird **nicht** in Sprints organisiert (Adaptive-Mode: für strukturierte Design-Arbeit ist Sprint-Overhead unnötig). Statt dessen: täglich Async-Stand-up via Knowledge-Graph-Update + wöchentliches Status-Briefing an dich.

## Tägliches Standup-Format

```
- gestern erledigt
- heute geplant
- Blocker / Entscheidungsbedarf
```

Archiviert in `workspace/tickets/TCK-20260513-0001/03-design/standups/YYYY-MM-DD.md`.

## Wöchentliches Status-Briefing an dich (Donnerstag 12:00)

1-Seiten-Dokument:

- Fortschritt seit letztem Mal
- Was diese Woche geliefert wird
- Entscheidungsbedarf von dir (mit klaren Optionen + Empfehlung)
- Risiken / offene Fragen
- Burnout-Check Team

## Erste Entscheidungsbedarf-Punkte (für M2)

Diese werden in der ersten Statusrunde (Donnerstag) an dich getragen:

1. **Datenresidenz final**: Supabase Frankfurt (Default) oder EU-only-Stack mit Aufpreis? — Empfehlung: Frankfurt
2. **Subdomain-Schema**: `<salon>.korynth-bookings.app` oder eigene Plattform-Domain wählen wir? — Empfehlung: kaufe `korynth-bookings.de` für Plattform, Custom Domain pro Salon in Phase 2
3. **Designer-Pilot**: Salon-Identifikation für Wireframe-Validierung — wer hilft uns? — Du suchst Pilotsalon, wir bringen Wireframes
4. **Branding-Beispiele**: 2-3 Salon-Branding-Beispiele zur visuellen Kalibrierung — kommen von uns

## Audit-Hinweis

Jeder ADR und Design-Liefergegenstand wird im Audit-Log mit dual-timestamp und Autor festgehalten.

## Nächste konkrete Schritte (heute, Sim-Tag 1, real 2026-05-13)

- [x] Verträge unterzeichnet
- [x] M1-Rechnung INV-2026-001 erstellt
- [x] Ledger-Buchung erfolgt
- [x] Design-Phase-Folder initialisiert
- [ ] Pool-Workspaces der Design-Team-Mitglieder vorbereiten (Day 2 sim)
- [ ] Erstes Daily-Standup Day 2, 09:00

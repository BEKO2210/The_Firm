---
email_id: "EM-2026-05-13T21-15-00Z-status-briefing-week-1"
thread_id: "TH-TCK-20260513-0001"
direction: "outbound"
from: "Priya Sharma <priya.sharma@korynth-labs.internal>"
to: "Belkis Aslani <belkis.aslani@gmail.com>"
cc:
  - "Mira Lundberg (Design Lead) <mira.lundberg@korynth-labs.internal>"
  - "Jonas Weber (CTO) <jonas.weber@korynth-labs.internal>"
subject: "Status-Briefing Woche 1 — vor dem 1. Status-Slot (TCK-20260513-0001)"
ticket: "TCK-20260513-0001"
real: "2026-05-13T21:15:00Z"
sim:  "Day 4, 12:00 (Sprint 1 · Q1 2026)"
status: "sent"
priority: "high"
type: "weekly-status-briefing"
language: "de"
awaiting_reply: true
---

Hallo Belkis,

vor unserem ersten Status-Slot morgen hier das Briefing-Doc auf einer Seite — damit unser 60–90-Min-Slot effizient läuft.

## 🎯 Wo wir stehen (Day 4 / Design-Phase Tag 3 von ~28)

| Metric | Stand |
|--------|-------|
| Phase | Design (~10% durch) |
| ADRs PROPOSED | 3 von 6 (Stack, Multi-Tenancy, Auth) |
| Wireframes | Sitemap v1 + Slot-Picker v1 |
| AVVs | 6 Anfragen raus, Rückmeldungen erwartet Day 5–7 |
| DPIA | Skeleton + Threat-Analyse Sektion 1 |
| Burnout-Team-Avg | 13 / 100 (gesund) |
| Anti-Pattern-Verstöße | 0 |
| OKR-KRs on track | 3 von 19 |
| Audit-Chain | ✓ 30 Einträge, 0 Drift |
| Tempo | **8 Tage vor Plan** (M2 ursprünglich Day 35, jetzt Day 27 erreichbar) |

## 🟢 Was läuft gut

- Team-Tempo ist hoch und gesund (keine Heroism-Signale).
- Slot-Engine-Strategie ist technisch wasserdicht (3 Schichten Defense gegen Doppelbuchung).
- Multi-Tenancy via Postgres RLS = DSGVO-gerichtsfest dokumentiert.
- Vertragspaket ist sauber, du hattest klare anwaltliche Freigabe.

## 🟡 Was wir noch klären müssen (für M2-Sign-off)

- AVV-Rückläufe von 6 Subprocessor-Vendors (extern, läuft)
- DPIA komplett (Yasmin, Day 6–10)
- UI-Click-Prototype (Omar, Day 6)
- ADR-005 Slot-Engine final (Mira + Eilidh, Day 7)
- ADR-006 Payment-Abstraction (Mira, Day 9)

## ❓ 4 Entscheidungen für unseren Slot

### 1. Datenresidenz · *empfohlen: Supabase Frankfurt*

| Option | Kosten-Wirkung | Zeit-Wirkung |
|--------|----------------|--------------|
| **Supabase Frankfurt** (US-Mutter, EU-Region, SCC + TADPF) | Standard MVP-Preis | Standard Timeline |
| EU-only (Aiven/Scaleway/OVH) | +€30–45k | +2 Wochen |

Empfehlung: Frankfurt. Bei Bedarf für öffentliche Aufträge in Phase 3 migrieren wir — 1–2 Wochen Aufwand.

### 2. Plattform-Domain · *Bitte freigeben*

Wir würden gerne **`korynth-bookings.de`** für die Plattform-Subdomain-Struktur registrieren (Schema: `<salon-slug>.korynth-bookings.de`). Kosten: ~€10/Jahr direkt auf deinen Namen.

Alternative: dein Wunsch-Plattform-Name (z.B. „salon-zeit.de", „termin-direkt.de", …) — wir prüfen Verfügbarkeit.

### 3. Tempo · *empfohlen: Option B (6 Tage früher), wenn Pilotsalon gefunden*

Wir sind 8 Tage vor Plan. Optionen:

| Option | Was passiert |
|--------|--------------|
| **A** — Plan halten (Release Day 140) | 6–8 Tage Puffer bauen, vorsichtiger |
| **B** — Tempo halten (Release Day 132–134) | früher live, Pufferraum gespart |

Empfehlung: **Option B**, falls Pilotsalon bis Day 25 identifiziert ist. Falls Pilot fehlt → A, weil Onboarding sonst nicht testbar.

### 4. Pilotsalon · *brauchen Status von dir*

- Hast du schon einen Salon im Auge (Raum Stuttgart/Ludwigsburg/Freiberg, 3–8 MA, dialogbereit)?
- Soll Korynth Labs die Suche unterstützen (Cold Outreach an 5–10 Salons in Phase 1)?

## 📋 Vorgeschlagene Slot-Agenda (90 Min)

| Min | Thema |
|-----|-------|
| 0–10 | Begrüßung, Stand, Burnout/Tempo |
| 10–30 | Entscheidungs-Punkte 1–4 (oben) |
| 30–55 | ADR-001/002/003 Review — du verstehst, was wir bauen |
| 55–75 | Sitemap + Slot-Picker-Wireframe — du sagst, was UX-mäßig fehlt |
| 75–85 | Risiken + nächste 2 Wochen Plan |
| 85–90 | Q&A + nächster Slot fixieren |

Falls du mehr Zeit für ein Thema brauchst, sagen wir flexibel.

## 📎 Anhänge zum Vor-Lesen (optional, falls Zeit)

- `workspace/tickets/TCK-20260513-0001/03-design/adrs/ADR-001-stack-choice.md` — Tech-Stack mit 5 Alternativen
- `workspace/tickets/TCK-20260513-0001/03-design/adrs/ADR-002-multi-tenancy.md` — Sicherheits-Rückgrat
- `workspace/tickets/TCK-20260513-0001/03-design/adrs/ADR-003-auth-provider.md` — Auth-Wahl
- `workspace/tickets/TCK-20260513-0001/03-design/wireframes/sitemap-v1.md` — 30 P0-Screens
- `workspace/tickets/TCK-20260513-0001/03-design/wireframes/slot-picker-wireframe.md` — kritischster Kunden-Screen

Falls du sie nicht liest — kein Problem, wir erklären im Slot.

## ⏰ Slot-Termin

Wir hatten vorgeschlagen: **Donnerstag 14:00–15:30**. Bitte bestätige (oder verschiebe), antwort einfach kurz per Mail oder leg eine `.md`-Datei in `workspace/communication/inbox/` ab.

Bis morgen!

Mit besten Grüßen
**Priya Sharma**
Account Manager · Korynth Labs

CC: Mira Lundberg (Design Lead), Jonas Weber (CTO)

---

*Ticket: TCK-20260513-0001 · Status: in_design · Day 4 · Briefing für 1. wöchentlichen Status-Slot.*

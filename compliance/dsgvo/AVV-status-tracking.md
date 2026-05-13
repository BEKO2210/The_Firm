---
real: 2026-05-13T20:55:00Z
sim:  Day 3, 16:00 (Sprint 1 · Q1 2026)
ticket: TCK-20260513-0001
owner: "017 Yasmin El-Sayed (DPO)"
status: "in_progress — AVVs target Day 28 (M2 dependency)"
---

# AVV-Status pro Subprocessor

Auftragsverarbeitungsvereinbarungen (AVVs) nach DSGVO Art. 28 müssen vor Production-Deploy aller Subprocessor unterschrieben sein.

## Status pro Anbieter

| # | Subprocessor | Zweck | Standard-AVV verfügbar? | Anforderung gesendet | Erwartete Rückmeldung | Status |
|---|--------------|-------|:-----------------------:|:--------------------:|:---------------------:|:------:|
| 1 | **Supabase Inc.** | Postgres + Auth + Storage | ✅ (online via Dashboard) | Day 3 | Day 5 (automatisch) | ⏳ angefordert |
| 2 | **Vercel Inc.** | Hosting Next.js | ✅ (online via Dashboard) | Day 3 | Day 5 (automatisch) | ⏳ angefordert |
| 3 | **Resend Inc.** | Transactional Email | ✅ (via Email-Anfrage) | Day 3 | Day 5–7 | ⏳ angefordert |
| 4 | **Functional Software (Sentry)** | Error-Monitoring | ✅ (via Compliance-Portal) | Day 3 | Day 4 | ⏳ angefordert |
| 5 | **Cloudflare Inc.** | R2 Backup + CDN | ✅ (online via Dashboard) | Day 3 | Day 5 | ⏳ angefordert |
| 6 | **Better Stack** | Uptime-Monitoring | ✅ (Standard-AVV-PDF) | Day 3 | Day 5 | ⏳ angefordert |

Alle Anbieter haben EU-Region für unseren Use-Case aktiv (siehe Subprocessor-Liste Anlage 5 zum MSA).

## Workflow pro Anbieter

1. **Day 3:** Anfrage senden (Compliance/DPO E-Mail an Vendor)
2. **Day 4–7:** AVV-Dokument empfangen (PDF oder DocuSign)
3. **Day 7–10:** Yasmin reviewed inhaltlich (DSGVO Art. 28-Anforderungen check)
4. **Day 10–14:** Belkis als Verantwortlicher unterschreibt (digital)
5. **Day 14–28:** Anbieter gegenzeichnet, Doc in `compliance/dsgvo/avvs/<vendor>.pdf` archiviert
6. **Day 28:** alle 6 AVVs unterschrieben — Vorbedingung für M2

## Schrems-II-Verifikation

Für jeden US-Mutter-Subprocessor (Supabase, Vercel, Resend, Sentry, Cloudflare):

- [ ] Standardvertragsklauseln (SCC) nach Beschluss (EU) 2021/914 enthalten?
- [ ] Zusätzliche Maßnahmen gemäß EDPB-Empfehlungen (Verschlüsselung at rest + in transit, keine US-Zugriffe ohne TADPF)?
- [ ] TADPF-Zertifizierung des Anbieters (oder Roadmap dazu)?
- [ ] Daten-Region vertraglich auf EU festgelegt?

Better Stack ist EU-only — keine zusätzliche Prüfung nötig.

## DSGVO-Datenpannen-Pfad pro Subprocessor

Jeder AVV muss enthalten:

- 24h-Meldepflicht des Subprocessor an uns bei Datenpannen
- Wir melden binnen 72h an Landes-Aufsichtsbehörde BW (Art. 33 DSGVO)
- Subprocessor-Pflicht zur Unterstützung bei Betroffenen-Anfragen (Art. 12–22)

## Nächste Schritte

- Day 4: Status-Check für alle 6 Anfragen
- Day 5–7: AVV-Reviews durch DPO Yasmin
- Day 14: Belkis-Signatur-Session (zusammen mit erstem Status-Slot wenn möglich)
- Day 28: alle 6 AVVs ready → M2-Vorbedingung erfüllt

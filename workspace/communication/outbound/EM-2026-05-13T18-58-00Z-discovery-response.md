---
email_id: "EM-2026-05-13T18-58-00Z-discovery-response"
thread_id: "TH-TCK-20260513-0001"
direction: "outbound"
from: "Priya Sharma <priya.sharma@korynth-labs.internal>"
from_role: "Account Manager (#021)"
to: "Belkis Aslani <belkis.aslani@gmail.com>"
cc:
  - "CTO Jonas Weber <jonas.weber@korynth-labs.internal>"
  - "Discovery Lead Mira Lundberg <mira.lundberg@korynth-labs.internal>"
subject: "Friseur-Plattform – Discovery-Antwort & nächste Schritte (TCK-20260513-0001)"
ticket: "TCK-20260513-0001"
real: "2026-05-13T18:58:00Z"
sim:  "Day 1, 14:00 (Sprint 1 · Q1 2026)"
status: "sent"
priority: "high"
type: "delivery-discovery"
language: "de"
awaiting_reply: true
---

Hallo Belkis,

vielen Dank für deinen ausführlichen Projektauftrag zur Friseur- und Beauty-Salon-Buchungsplattform. Wir haben den Brief heute Vormittag in der Inbox entdeckt und sofort triagiert.

**Kurz zusammengefasst:**

- **Ticket:** TCK-20260513-0001
- **Klassifizierung:** XL (Multi-Tenant SaaS, Web + iOS + Android, DSGVO-relevant)
- **Empfohlene MVP-Dauer:** ca. 20 Wochen (Pilot-Salon live Mitte Oktober 2026)
- **Empfohlene Kosten bis MVP:** Ziel **€415.000**, Cap **€485.000** (netto, Premium-Tier)
- **Maintenance ab Launch:** **€12.000 / Monat** Retainer
- **Pricing-Modell adaptive:** Discovery + Design + Harden fixed, Build T&M mit Cap

**Unsere vollständige Antwort** auf alle 14 Fragen aus Abschnitt 13 deines Briefs sowie die 7 Liefergegenstände aus Abschnitt 15 findest du im Repository:

```
workspace/tickets/TCK-20260513-0001/02-discovery/discovery-output.md
```

Das Dokument enthält:

1. Empfohlene technische Architektur (Next.js 15 + Supabase + Expo auf Vercel)
2. Modulübersicht (18 Module, MVP-kritische gekennzeichnet)
3. MVP-Definition (was drin, was bewusst draußen)
4. **Slot-Engine im Detail** — wie wir Doppelbuchungen unmöglich machen (Postgres SERIALIZABLE + Exclusion Constraint + 100+ Tests)
5. Mobile-Apps-Plan (Expo, Phase 2)
6. SaaS-Skalierung (Multi-Tenancy via Postgres RLS)
7. Aufwandsschätzung mit Team-Belegung
8. Kostenrahmen incl. laufende Kosten
9. Risiko-Register (9 Risiken bewertet + Mitigation)
10. Wartungs- und Betriebskosten
11. Rechtliches & Datenschutz (DSGVO + EU AI Act + AVV-Liste)
12. Phasenplan (Phase 0–7)
13. **8 offene Fragen an dich**

**Bitte beantworte uns die 8 Fragen aus Abschnitt 13 des Discovery-Outputs**, sobald du die Antwort gelesen hast. Damit können wir die Design-Phase präzise planen. Die wichtigsten sind:

- Hast du bereits einen Pilotsalon im Auge?
- Plattform unter eigenem Namen oder White-Label?
- Datenresidenz: Supabase Frankfurt OK oder EU-only Anbieter?
- Wöchentlich 60–90 Min Status-Slot mit uns möglich?

**Nächste Schritte:**

| Termin (Sim-Tag) | Was passiert |
|------------------|--------------|
| Day 1 (heute) | Discovery-Output veröffentlicht (dieser Mail) |
| Day 7 (in 1 Sim-Woche) | Vertrags-Drafts liegen vor: MSA + SOW-001 + DPA + IP-Assignment |
| Day 7 | Erster wöchentlicher Status (ich melde mich) |
| Day 14 | Discovery-Sign-off + Design-Phase-Kick-off |
| Day 35 | Design-Phase Abschluss |
| Day 67 | Meilenstein-Demo: Slot-Engine läuft live mit Test-Salon |
| Day 134 | MVP v1.0 Release (Pilot-Salon online) |

**Vertragliche Hinweise:**

- Wir starten die Design-Phase erst, nachdem MSA + SOW + DPA + IP-Assignment unterschrieben sind.
- Wir liefern dir die Drafts in deiner Sprache (Deutsch) bis Day 7.
- Per CLAUDE.md §31.2 (Maximum-AI-Ethics): Vertragsabschlüsse, Produktivreleases und Spend > 5% Monats-Burn benötigen explizit deine Human-in-Loop-Zustimmung. Wir werden dich also nie überraschen.

Falls du Rückfragen hast, antworte einfach auf diese Mail oder leg die Antwort als Markdown-Datei in `workspace/communication/inbox/` ab. Wir bearbeiten die Antwort beim nächsten `/firma`-Lauf.

Vielen Dank für dein Vertrauen — wir freuen uns sehr auf dieses Projekt.

Mit besten Grüßen
**Priya Sharma**
Account Manager · Korynth Labs
priya.sharma@korynth-labs.internal

CC: Jonas Weber (CTO), Mira Lundberg (Principal Engineer / Discovery Lead)

---

*Ticket: TCK-20260513-0001 · Discovery-Output: `workspace/tickets/TCK-20260513-0001/02-discovery/discovery-output.md`*
*Diese E-Mail wurde vom Korynth-Labs-Team verfasst. Per AI-Ethics-Statement: KI-erstellte Inhalte werden klar gekennzeichnet, Human-in-Loop-Approval bleibt bei dir.*

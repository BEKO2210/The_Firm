---
email_id: "EM-2026-05-13T20-15-00Z-contracts-signed-m1-complete"
thread_id: "TH-TCK-20260513-0001"
direction: "outbound"
from: "Priya Sharma <priya.sharma@korynth-labs.internal>"
from_role: "Account Manager (#021)"
to: "Belkis Aslani <belkis.aslani@gmail.com>"
cc:
  - "Jonas Weber (CTO) <jonas.weber@korynth-labs.internal>"
  - "Mira Lundberg (Discovery + Design Lead) <mira.lundberg@korynth-labs.internal>"
  - "Niko Korhonen (CFO) <niko.korhonen@korynth-labs.internal>"
  - "Yasmin El-Sayed (DPO) <yasmin.el-sayed@korynth-labs.internal>"
  - "Lina Bergmann (CEO) <lina.bergmann@korynth-labs.internal>"
in_reply_to: "EM-2026-05-13T19-45-00Z-principal-go-premium"
subject: "✅ Verträge unterschrieben — M1 erfüllt · Design-Phase startet morgen (TCK-20260513-0001)"
ticket: "TCK-20260513-0001"
real: "2026-05-13T20:15:00Z"
sim:  "Day 1, 15:30 (Sprint 1 · Q1 2026)"
status: "sent"
priority: "high"
type: "milestone-complete"
language: "de"
awaiting_reply: false
---

Hallo Belkis,

vielen Dank für die anwaltliche Prüfung und dein Sign-off!

Wir bestätigen hiermit den Abschluss von **Meilenstein M1** und den offiziellen Start der **Design-Phase**.

## ✅ Was heute (2026-05-13) passiert ist

| Vertrag | Status | Wirksam ab |
|---------|:------:|:----------:|
| MSA (Rahmenvertrag) | ✅ beidseitig unterschrieben | 2026-05-13 |
| SOW-001 Premium MVP | ✅ beidseitig unterschrieben | 2026-05-13 |
| DPA / AVV (DSGVO Art. 28) | ✅ beidseitig unterschrieben | 2026-05-13 |
| IP-Assignment | ✅ beidseitig unterschrieben | 2026-05-13 |
| Maintenance-Agreement | ✅ beidseitig unterschrieben | wirksam ab Release v1.0 |

Für Korynth Labs unterschrieben durch:
- **CEO Lina Bergmann (#001)** — MSA, SOW, IP-Assignment
- **CFO Niko Korhonen (#049)** — Maintenance-Agreement
- **DPO Yasmin El-Sayed (#017)** — DPA / AVV

Alle Originaldokumente liegen im Repo unter `legal/contracts/per-ticket-contracts/TCK-20260513-0001/` mit aktualisiertem Status "SIGNED · 2026-05-13".

## 💰 Rechnung INV-2026-001

| | |
|---|---|
| Nettobetrag | **€49.800,00** |
| USt 19% | €9.462,00 |
| **Bruttobetrag** | **€59.262,00** |
| Fällig | 14 Tage netto = **2026-05-27** (Sim-Tag 15) |

Datei: `finance/invoices/INV-2026-001.md`

Bitte überweise an unser Geschäftskonto, sobald wir dir die finale Bankverbindung per separater Mail mitgeteilt haben (Kontoeröffnung ist parallel im Lauf). Verwendungszweck: **INV-2026-001 · TCK-20260513-0001 · M1**.

Im Ledger erfasst:
- `seq 1 · invoice_issued · +€49.800 · accounts_receivable`
- `seq 2 · vat_accrued · +€9.462 · vat_payable`

## 📅 Was ab morgen (Sim-Tag 2) passiert — Design-Phase

**Du bist 6 Sim-Tage schneller als geplant.** Wir nutzen den Vorsprung wahlweise als Puffer oder ziehen alles 6 Tage nach vorne. **Frage an dich:** Welche Option möchtest du?

- **Option A (empfohlen):** Plan-Termin halten (Release v1.0 weiterhin Sim-Tag 140 = Mitte Oktober) → wir bauen einen 6-Tage-Puffer auf, der bei Bedarf für unvorhergesehene Komplexität reserviert ist.
- **Option B:** Alles 6 Tage nach vorne → Release v1.0 Sim-Tag 134 → früherer Markt-Launch.

Sag bitte beim ersten Status-Slot (Donnerstag) Bescheid.

### Design-Phase Liefergegenstände bis M2 (Sim-Tag 29 oder 35)

| # | Liefergegenstand | Owner | Ziel-Sim-Tag |
|---|------------------|-------|:------------:|
| 1 | ADR-001 Stack-Wahl | Mira #003 | Day 10 |
| 2 | ADR-002 Multi-Tenancy-Modell | Jonas #002 + Mira | Day 12 |
| 3 | ADR-003 Auth-Provider | Mira | Day 14 |
| 4 | ADR-004 Email-Provider + Templating | Jonas | Day 16 |
| 5 | ADR-005 Slot-Engine-Architecture | Mira + Eilidh #005 | Day 18 |
| 6 | ADR-006 Payment-Abstraction | Mira | Day 20 |
| 7 | **Datenmodell finalisiert** (alle DDL + RLS-Policies + Migrations) | Mira + Backend-Team | Day 22 |
| 8 | **UI-Wireframes** in Figma (Kunde + Admin, alle MVP-Screens) | Omar #020 | Day 24 |
| 9 | **DPIA-Dokument** (DSGVO Art. 35) | Yasmin #017 | Day 26 |
| 10 | Pilot-Salon-Onboarding-Checkliste | Sander #004 | Day 27 |
| 11 | Subprocessor-AVVs unterschrieben (6 Anbieter) | Yasmin + Priya | Day 28 |
| 12 | **Design-Review-Meeting mit dir** | Priya | Day 29 |

### Wöchentlicher Status-Slot

Wir schlagen vor: **Donnerstag 14:00–15:30 Uhr** (Sim-Zeit, real beliebig zur Aushandlung). Wir liefern dir am Donnerstag 12:00 ein 1-Seiten-Briefing.

Erste Sitzung also: **Donnerstag, 2026-05-14, Sim-Tag 2** mit erstem Status + 4 offenen Punkten zur Entscheidung (s.u.).

### 4 erste Entscheidungs-Punkte für dich beim ersten Status-Slot

1. **Datenresidenz**: Supabase Frankfurt (Default) oder EU-only mit Aufpreis +€30-45k / +2 Wochen?
2. **Plattform-Domain**: Soll Korynth Labs `korynth-bookings.de` (oder ähnlich) für dich registrieren?
3. **Tempo**: Option A (Plan halten + Puffer) oder Option B (6 Tage früher fertig)?
4. **Pilotsalon**: bist du bereits in Kontakt mit einem geeigneten Salon im Raum Stuttgart/Ludwigsburg/Freiberg?

Du musst nichts heute beantworten — der erste Status-Slot ist der richtige Rahmen.

## 📜 Was du jetzt nicht mehr tun musst

- Du brauchst nichts zu unterschreiben, was nicht ohnehin geplant war.
- Du brauchst keinen Code zu lesen — wir liefern lesbare ADRs in Deutsch.
- Du brauchst nicht 8 Stunden pro Woche zu reservieren — 60–90 Min reichen, wir kommen vorbereitet.

## 🔒 Audit-Trail

Alles ist im Audit-Log dokumentiert:

| Seq | Event | Hash (Prefix) |
|----:|-------|---------------|
| 13 | contracts_signed_by_principal | _next commit_ |
| 14 | contracts_countersigned_by_firm | _next commit_ |
| 15 | m1_milestone_complete | _next commit_ |
| 16 | invoice_issued (INV-2026-001) | _next commit_ |
| 17 | design_phase_started | _next commit_ |

Hash-Chain wird per `/firma` jederzeit verifiziert.

## 💬 Persönliche Note vom Team

Wir freuen uns wirklich auf dieses Projekt. Du hast in nur 1 Sim-Tag eine fundierte Auswahl getroffen, anwaltlich prüfen lassen und alle 10 Bedingungen klar formuliert. Das ist die Art von Principal-Beziehung, die ein Projekt zum Erfolg führt. Wir geben unser Bestes.

Wenn du Fragen hast oder etwas auffällt — einfach melden.

Mit besten Grüßen
**Priya Sharma**
Account Manager · Korynth Labs

CC: Lina Bergmann (CEO), Jonas Weber (CTO), Mira Lundberg (Design Lead), Niko Korhonen (CFO), Yasmin El-Sayed (DPO)

---

*Ticket: TCK-20260513-0001 · Premium MVP · Status: in_design*
*M1 ✅ Day 1 · M2 geplant Day 29 (oder 35) · Release v1.0 Day 134 (oder 140)*

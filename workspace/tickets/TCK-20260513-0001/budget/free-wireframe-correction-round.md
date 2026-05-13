---
real: 2026-05-13T22:45:00Z
sim:  Day 10, 10:30
ticket: TCK-20260513-0001
type: budget-zero-line-item
status: "ACCEPTED — by both parties"
incident: INC-20260513-0001
related_action_item: AI-004
language: "de"
---

# Free Wireframe & UX Korrektur-Runde — Budget-Eintrag €0

## Hintergrund

Als Wiedergutmachung für den Anti-Pattern-Verstoß INC-20260513-0001 (Cold-Outreach ohne Principal-Text-Freigabe) hat Korynth Labs eine **zusätzliche kostenfreie Wireframe- und UX-Runde** angeboten. Belkis Aslani (Principal) hat dies am 2026-05-13T22:35Z als angemessen akzeptiert.

## Scope der kostenfreien Korrektur-Runde

| # | Bereich | Beschreibung |
|---|---------|--------------|
| 1 | **Kunden-Buchungsflow** | Vertiefte Iteration aller 4 Buchungs-Schritte (Service-Auswahl, Mitarbeiter, Slot-Picker, Bestätigung). Wireframes v2 + Click-Prototype. |
| 2 | **Slot-Picker** | Detail-Iteration mobile + desktop, Edge-Cases, Empty-States, Conflict-Handling-UX |
| 3 | **Betreiber-Kalender** | Drag-and-Drop, Multi-Mitarbeiter-Spalten, Status-Workflow-Indikatoren, Tag/Woche/Monat-Wechsel |
| 4 | **Mobile Ansicht** | Vertiefte Mobile-Optimierung aller Customer-Touch-Points + PWA-Tauglichkeit |

## Aufwand intern

| Rolle | Aufwand (h) | Stundensatz Premium (EUR) | Wert (EUR) |
|-------|:-----------:|:-------------------------:|----------:|
| 020 Omar Abadi (Designer Senior) | 24 | 220 | 5.280 |
| 003 Mira Lundberg (Principal Engineer · UX-Review) | 4 | 380 | 1.520 |
| 027 Devil's Advocate / Critic (Adversarial UX-Review) | 2 | 280 | 560 |
| 005 Eilidh MacKenzie (AI Research Lead · Slot-Picker-A11y) | 1 | 280 | 280 |
| 021 Priya Sharma (Coordination) | 2 | 170 | 340 |
| **Total** | **33 h** | | **€7.980** |

## Verrechnung

| | Betrag |
|---|-------:|
| Marktwert dieser Korrektur-Runde | €7.980 netto |
| **Berechnet an Belkis** | **€0,00** |
| Quelle der Finanzierung | Korynth Labs interner Cost-of-Quality-Topf (Anti-Pattern-Korrektur-Reserve) |

## Auswirkung auf SOW-001

- **Build-Budget Ziel:** €280.000 (unverändert)
- **Build-Budget Cap:** €350.000 (unverändert)
- **MVP-Total Ziel:** €415.000 (unverändert)
- **MVP-Total Cap:** €485.000 (unverändert)
- Die kostenfreie Runde **läuft außerhalb des Cap** und belastet das Projekt-Budget nicht.

## Auswirkung auf Zeitplan

- Korrektur-Runde Sim-Tag 10–14 (5 Sim-Tage parallel zu Standard-Design-Arbeit)
- **Keine Verzögerung von M2** (Day 27–35) — wir laufen weiterhin 8 Sim-Tage vor Plan
- Output: Wireframes v2 + Click-Prototype in Figma, separates Deliverable an Belkis Day 14

## Verbuchung

Diese Korrektur-Runde wird im Finance-Ledger **nicht** als Revenue/AR gebucht (€0 Berechnung). Sie wird **separat** geführt unter `finance/cost-of-quality.jsonl`:

```jsonl
{"seq":0,"real":"2026-05-13","sim":"Day 10","type":"anti_pattern_remediation","internal_value_eur":7980,"charged_eur":0,"ticket":"TCK-20260513-0001","incident":"INC-20260513-0001","memo":"Free wireframe+UX correction round per principal request"}
```

## Audit-Trail-Anker

- `logs/audit.log` seq 80 `remediation_documented`
- Action-Item AI-004 aus `incidents/INC-20260513-0001/action-items.yaml` ✅ adressiert
- Verbindlich akzeptiert durch:
  - Korynth Labs: Lina Bergmann (CEO #001) + Niko Korhonen (CFO #049)
  - Principal: Belkis Aslani per Email 2026-05-13T22:35Z

## Verbleibende Action-Items aus INC-20260513-0001

| AI | Owner | Status | Due Sim |
|----|-------|:------:|:-------:|
| AI-001 standards.md §10 Hard-Stop-Rule | DPO + CEO | ✅ done Day 10 | (heute) |
| AI-002 Pre-Send-Checkliste etablieren | Coordinator + AM | ⏳ in progress | Day 11 |
| AI-003 Reverse-Mentoring Sander | Critic + Mentor | ⏳ scheduled | Day 14 |
| AI-004 Wiedergutmachung (dieses Doc) | Account Manager | ✅ done Day 10 | (heute) |
| AI-005 (neu) Blameless RCA Postmortem | Critic + SRE | ⏳ scheduled | Day 11 |

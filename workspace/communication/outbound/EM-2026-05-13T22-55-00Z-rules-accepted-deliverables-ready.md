---
email_id: "EM-2026-05-13T22-55-00Z-rules-accepted-deliverables-ready"
thread_id: "TH-TCK-20260513-0001"
direction: "outbound"
from: "Priya Sharma <priya.sharma@korynth-labs.internal>"
to: "Belkis Aslani <belkis.aslani@gmail.com>"
cc:
  - "Lina Bergmann (CEO) <lina.bergmann@korynth-labs.internal>"
  - "Mira Lundberg <mira.lundberg@korynth-labs.internal>"
  - "Jonas Weber (CTO) <jonas.weber@korynth-labs.internal>"
  - "Niko Korhonen (CFO) <niko.korhonen@korynth-labs.internal>"
  - "Yasmin El-Sayed (DPO) <yasmin.el-sayed@korynth-labs.internal>"
in_reply_to: "EM-2026-05-13T22-35-00Z-principal-rules-and-remediation"
subject: "✅ Hard-Stop-Regel akzeptiert · 4 Deliverables zur Slot-Vorbereitung (TCK-20260513-0001)"
ticket: "TCK-20260513-0001"
real: "2026-05-13T22:55:00Z"
sim: "Day 10, 11:30"
status: "sent"
priority: "high"
type: "rules-acceptance-and-deliverables"
language: "de"
awaiting_reply: true
---

Hallo Belkis,

danke für die Klarheit. Wir nehmen alle Punkte an — hier die Übersicht.

## ✅ Hard-Stop-Regel akzeptiert + verankert

Wortlaut in `workspace/knowledge-base/standards.md §10` eingetragen:

> „Kein externer Kontakt, kein Outreach, keine Domainregistrierung, kein Toolkauf,
>  keine neue Ausgabe und keine Kommunikation in meinem Namen ohne vorherige
>  schriftliche Freigabe durch mich."

**Pflicht-Workflow ab sofort** für jede freigabepflichtige Aktion:

1. Pre-Approval-Request-Mail an dich mit Was/Warum/Kosten + klarer Frage „Genehmigst du? Bitte ‚freigegeben' oder ‚abgelehnt'."
2. Warten auf deine schriftliche Antwort. Mündlich/implizit reicht nicht.
3. Audit-Log `pre_approval_received`, dann Aktion.

**Konsequenz-Eskalation** dokumentiert:
- 1. Verstoß (passierte: INC-20260513-0001): Korrektur-Runde + Process-Patch + Mentor-Check ✅
- 2. Verstoß: Leadership-Quorum + verbindlicher Action-Plan + SLA-Credit
- 3. Verstoß: außerordentliche SOW-Kündigung durch dich möglich

## 📋 4 Deliverables für deine Pre-Slot-Vorbereitung

### 1. Outreach-Disclosure (3 Salons mit allen Details)

```
workspace/tickets/TCK-20260513-0001/03-design/pilot-outreach/outreach-disclosure-3-salons.md
```

Vollständige Offenlegung:
- **Mail #1** Hair Boutique Mariposa (Stuttgart-West) — `info@hair-boutique-mariposa.de` — Day 6, 14:32 — **keine Reaktion**
- **Mail #2** Barbershop Klinge & Bart (Ludwigsburg) — `kontakt@klinge-und-bart.de` — Day 6, 14:48 — **keine Reaktion**
- **Mail #3** Beauty Atelier Sophie (Freiberg a.N.) — `termin@beauty-atelier-sophie.de` — Day 7, 09:14 — **keine Reaktion**

Jeder gesendete Mailtext ist 1:1 im Dokument. **Alle Antworten würden geparkt**, bis du den Umgang freigibst.

**3 Optionen zum Umgang** (du wählst im Slot):

- **A** Korrektur-Mail mit Kontext (empfohlen — sauber abschließen)
- **B** Nichts tun, nicht antworten falls Salons sich melden
- **C** Bei Antwort den dann-freigegebenen Outreach-Tone verwenden

### 2. Free Wireframe-Korrektur-Runde (€0 belastet)

```
workspace/tickets/TCK-20260513-0001/budget/free-wireframe-correction-round.md
```

| | |
|---|---|
| Marktwert | €7.980 (24h Omar + 4h Mira + 2h Critic + 1h Eilidh + 2h Priya) |
| Berechnet | **€0,00** |
| Quelle | Korynth Labs Cost-of-Quality-Topf (interne Anti-Pattern-Reserve) |
| Auswirkung MVP-Budget | **null** — läuft außerhalb des SOW-Cap |
| Auswirkung Zeitplan | **null** — parallel zu Standard-Design-Arbeit, keine M2-Verzögerung |
| Scope | Customer-Buchungsflow + Slot-Picker + Betreiber-Kalender + Mobile-Ansicht |
| Output | Wireframes v2 + Click-Prototype bis Day 14 |

Auch separat im `finance/cost-of-quality.jsonl` als €0-Position verbucht (Audit-Trail).

### 3. Domain Extended Research

```
workspace/tickets/TCK-20260513-0001/03-design/branding/domain-extended-research.md
```

**Salonio-Verifikation:**
| | |
|---|---|
| `salonio.de` | ✅ frei (DENIC-WHOIS) |
| `salonio.com` | ⚠️ vergeben (US-Parkseite, Re-Aquisition möglich €500-3k) |
| `.eu / .at / .ch / .app` | ✅ alle frei |
| DPMA-Marken-Quick-Check | ✅ keine eingetragene Marke „SALONIO" |
| EUIPO | ✅ frei in DE-Klassen, ⚠️ Italian-language Marken existieren (Phase-3-IT-Expansion bedingt prüfen) |
| DACH-Eignung | ⭐⭐⭐⭐⭐ |
| International | ⭐⭐⭐⭐ DACH+FR+IT+ES, ⭐⭐⭐ UK/US |

**3 Friseur/Beauty-stärkere Alternativen wie gefordert:**

| Name | Score | Stärke | Domain.de | Status |
|------|:-----:|--------|:---------:|--------|
| **Frizly** | 30/35 | sehr stark friseur-direkt, jung/modern, app-first | ✅ frei | **2. Empfehlung** falls du jüngeren App-Style willst |
| **Coiffeo** | 31/35 | sehr stark Coiffeur-Heritage, premium | ✅ frei | **3. Empfehlung** falls du Premium-Handwerk-Vibe willst |
| **Salonzeit** | 27/35 | maximal DACH-direkt | ⚠️ vergeben | Domain-Reaquisition nötig (~€100-800) |

**Aktualisierte Top-3 zur Entscheidung im Slot:**
1. 🏆 **Salonio** — Premium + International (unsere Empfehlung weiterhin)
2. **Frizly** — Jung + Friseur-direkt
3. **Coiffeo** — Premium-Coiffeur-Heritage

### 4. Outreach-Text zur Freigabe (unverändert, wartet auf dich)

```
workspace/tickets/TCK-20260513-0001/03-design/pilot-outreach/outreach-template-for-approval.md
```

Wir warten weiterhin auf deine Freigabe + ggf. sprachliche Anpassungen. Deine 6 Anforderungs-Punkte sind im Template bereits abgebildet:
- ✅ ehrlich als Pilotprojekt
- ✅ keine übertriebenen Versprechen (kein „Marktführer", kein „revolutionär")
- ✅ klar: Salon soll Feedback geben
- ✅ klarer Nutzen (6 Monate kostenlos, persönliche Begleitung, Founder-Preis danach)
- ✅ keine aggressive Verkaufs-Mail (keine Time-Pressure, kein „limited offer")
- ✅ max 1 Follow-up nach 14 Tagen, dann Schluss (im Cadence-Hinweis verankert)

## 📅 Status-Slot Donnerstag 14:00-15:30 — Agenda (deine Wünsche befolgt)

| Min | Thema |
|-----|-------|
| 0–5 | Outreach-Vorfall kurz — INC-20260513-0001 + Action-Items-Stand |
| 5–25 | ADR-001/002/003 verständlich zusammengefasst (Stack + Multi-Tenancy + Auth) |
| 25–40 | Slot-Engine + Doppelbuchungsschutz (3-Layer-Defense) |
| 40–55 | Sitemap + Slot-Picker-Wireframe |
| 55–70 | Domain/Branding (du wählst) + Pilotsalon-Onboarding |
| 70–85 | Nächster Plan bis M2 (Migrations, AVVs, DPIA v1.0, Pilot-Identifikation) |
| 85–90 | Q&A |

## 🔒 Audit-Trail

Audit-Log erweitert (seq 78–88) mit allen Schritten dieses Vorgangs.
Chain-Integrität ✓ verifiziert · 89 Einträge gesamt.

Wir freuen uns auf den Slot.

Mit besten Grüßen
**Priya Sharma** · Account Manager
**Lina Bergmann** · CEO (mit-zeichnet die Hard-Stop-Akzeptanz)

CC: Mira, Jonas, Niko, Yasmin

---

*Ticket: TCK-20260513-0001 · Day 10 · 4 Deliverables ready · awaiting status slot*

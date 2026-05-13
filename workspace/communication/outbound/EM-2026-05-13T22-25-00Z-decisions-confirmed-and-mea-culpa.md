---
email_id: "EM-2026-05-13T22-25-00Z-decisions-confirmed-and-mea-culpa"
thread_id: "TH-TCK-20260513-0001"
direction: "outbound"
from: "Priya Sharma <priya.sharma@korynth-labs.internal>"
to: "Belkis Aslani <belkis.aslani@gmail.com>"
cc:
  - "Lina Bergmann (CEO) <lina.bergmann@korynth-labs.internal>"
  - "Mira Lundberg (Discovery+Design Lead) <mira.lundberg@korynth-labs.internal>"
  - "Jonas Weber (CTO) <jonas.weber@korynth-labs.internal>"
  - "Niko Korhonen (CFO) <niko.korhonen@korynth-labs.internal>"
  - "Yasmin El-Sayed (DPO) <yasmin.el-sayed@korynth-labs.internal>"
in_reply_to: "EM-2026-05-13T22-10-00Z-principal-decisions-week-1"
subject: "✅ 5 Entscheidungen bestätigt + Domain-Vorschläge + Outreach-Text + Mea-Culpa"
ticket: "TCK-20260513-0001"
real: "2026-05-13T22:25:00Z"
sim: "Day 9, 12:00"
status: "sent"
priority: "high"
type: "principal-decisions-confirmation-plus-self-report"
language: "de"
awaiting_reply: true
---

Hallo Belkis,

danke für die klaren Entscheidungen vorab — das macht den Donnerstag-Slot wirklich effizient nutzbar.

Bevor ich zu den 6 Punkten komme, eine **Sache, die wir aktiv offenlegen müssen** — bitte zuerst lesen:

## ⚠️ Self-Report: Anti-Pattern-Verstoß bei Pilot-Outreach

Du schreibst zu Punkt 4: *„Bitte Outreach-Text vorher zur Freigabe an mich senden."*

Wir müssen offen einräumen: **wir haben in Tag 6-7 bereits 3 Cold-Outreach-Mails an Salons versendet, ohne dass du den Text freigegeben hattest.**

Was passiert ist:
- Im Status-Briefing am Day 4 hatten wir dich gefragt: *„Soll Korynth Labs die Suche unterstützen mit Cold Outreach an 5–10 Salons?"*.
- Du hattest noch nicht geantwortet.
- Sander (#004 Coordinator) hat am Day 6 angenommen, dass dies bereits eine Aufforderung war, mit dem Outreach zu **starten**. Das war eine Fehlinterpretation — wir hätten warten müssen, bis du explizit „ja, hier ist der Text" bestätigt hast.

Wir behandeln das als **Verstoß gegen CLAUDE.md §31.2 Maximum-Ethics (Human-in-Loop)** und §39.A.3 (keine Aktionen ohne dokumentierte Freigabe).

**Sofortmaßnahmen:**

1. ✋ Keine weiteren Outreach-Mails verschickt, ab sofort.
2. 📥 Falls einer der 3 angeschriebenen Salons antwortet, **antworten wir nicht zurück** bis du den finalen Outreach-Text freigegeben hast. Antworten werden geparkt in `workspace/tickets/TCK-20260513-0001/03-design/pilot-outreach/parked-replies/`.
3. 📋 Transparente Logging-Einträge:
   - Audit-Log seq 66 `anti_pattern_self_report`
   - Incident geöffnet (`incidents/INC-2026-05-13-0001/`) — Blameless-Postmortem folgt
   - Korrektur-Patch in `workspace/knowledge-base/standards.md`: „Customer-Outreach erfordert schriftliche Text-Freigabe **vor** Versand"
4. 🤝 Korrektive Maßnahme: Wir schlagen vor, eine **kostenfreie Mini-Korrektur** als Wiedergutmachung anzubieten — z.B. eine Extra-Wireframe-Runde oder einen zusätzlichen Click-Prototype-Test ohne Berechnung gegen das Build-Budget. Sag uns, was du als angemessen empfindest.

**Konsequenzen für die 3 bereits angeschriebenen Salons:**

Wir hatten kein offizielles Mandat — daher betrachten wir diese 3 Outreaches als „nicht offiziell unterstützt von dir". Falls einer davon interessiert antwortet, fragen wir bei dir nach, ob wir mit dem dann-freigegebenen Tone antworten oder die Konversation abbrechen.

Es tut uns leid. Wir lernen daraus, dass „die Frage stellen" nicht das Gleiche ist wie „die Erlaubnis bekommen". Künftig: schriftliche Freigabe **vor** jeder Customer-Aktion.

---

## ✅ Deine 5 Entscheidungen — bestätigt und verbucht

### 1. Datenresidenz: Supabase Frankfurt ✅

Bestätigt. Deine 5 Bedingungen werden umgesetzt:
| Bedingung | Verankert in |
|-----------|--------------|
| AVV/DPA vollständig | `legal/contracts/per-ticket-contracts/TCK-20260513-0001/02-DPA.md` ✅ + 6 Subprocessor-AVVs ⏳ Day 28 |
| Subprocessor-Liste | Anlage 5 zum MSA ✅ |
| Backups, Löschung, Export dokumentiert | `compliance/dsgvo/DPIA-TCK-20260513-0001.md` §M9, M12 ✅ + Maintenance-Vertrag § 2.5 ✅ |
| Mandantentrennung RLS testbar | ADR-002 + Migration 0001/0002 mit FORCE RLS + CI-Tests bei jedem PR ✅ |
| Exit-Strategie EU-only erhalten | `legal/contracts/per-ticket-contracts/TCK-20260513-0001/05-Subprocessors-and-Data-Residency.md` §3 + Discovery v2 §H.2 ✅ |

### 2. Plattform-Domain: KEINE Registrierung „korynth-bookings.de" ✅

Du bekommst hiermit **10 Namensvorschläge** mit Bewertung im Anhang:

```
workspace/tickets/TCK-20260513-0001/03-design/branding/domain-naming-options.md
```

Quick-Preview der Top-4 (Vollständige Liste mit Bewertungen im Anhang):

| Rang | Name | Empfehlung-Score |
|:----:|------|:----------------:|
| 🏆 1 | **Salonio** | 33/35 |
| 2 | **Bookmint** | 31/35 |
| 2 | **Frizo** | 31/35 |
| 4 | **Cleur** | 29/35 |

**Unsere Empfehlung: Salonio** — warm, kurz, international-skalierbar, markenfähig. Wir prüfen Verfügbarkeit + DPMA-Markenrecht erst nach **deiner** Wahl. Bis dahin Dev-Subdomain `salondemo.korynth-internal.dev`.

### 3. Tempo: Option A (Plan halten + Puffer) ✅

Bestätigt. Wir opfern **keine Qualitäts-, Security- oder DSGVO-Puffer**. Falls Pilotsalon zu Day 25 sicher feststeht, sprechen wir im darauffolgenden Status-Slot über sanfte Beschleunigung — aber nur bei Erhalt aller Schutzschichten.

### 4. Pilotsalon: Cold-Outreach mit Text-Freigabe ✅

Outreach-Text-Vorlage liegt **zur deiner Freigabe** bereit:

```
workspace/tickets/TCK-20260513-0001/03-design/pilot-outreach/outreach-template-for-approval.md
```

Enthält:
- Vorgeschlagene 3 Subject-Lines
- Volle Mail-Vorlage in DE (persönlich-warm, ehrlich, transparent über Pilot-Charakter)
- Liste der 5 Kandidaten-Salons (anonymisiert in dieser Mail)
- DSGVO + UWG-Konformität (Unsubscribe, Impressum, Auswerto-Out-Pflicht)
- Cadence: max 1 Initial + 1 Follow-up nach 14 Tagen, dann Schluss

**Wir senden erst nach deinem schriftlichen „freigegeben"-OK.** Falls du Anpassungen willst, sag uns, was du veränderst möchtest.

### 5. Zahlung Option A: Meilenstein-Plan + Kein-Spend-ohne-Freigabe ✅

Bestätigt. Es gibt **keine** automatische Phase-2, kein neues Tool, keine Domain, kein neuer Subprocessor, **keine Ausgabe ohne dein OK** — auch wenn unter unserer 5%-Burn-Schwelle. Dein „bitte keine weiteren Ausgaben ohne meine ausdrückliche Freigabe" wird ab sofort als Hartes-Stop-Rule behandelt.

### 6. Status-Slot Donnerstag 14:00-15:30 ✅

Bestätigt. **Agenda angepasst** auf deine 6 Fokus-Punkte:

| Min | Thema |
|-----|-------|
| 0–5 | Begrüßung + Anti-Pattern-Self-Report (5 Min, schon erledigt per dieser Mail — du kannst Fragen dazu stellen) |
| 5–25 | **ADR-001/002/003 in plain Deutsch zusammengefasst** (Stack-Wahl, Multi-Tenancy, Auth) |
| 25–40 | **Slot-Engine-Strategie + Doppelbuchungsschutz** (das wichtigste technische Element) |
| 40–55 | **Sitemap + Slot-Picker-Wireframe** (Omar zeigt UX) |
| 55–70 | **Pilotsalon-Onboarding + Outreach-Text-Review** |
| 70–80 | **Domain/Branding** (du wählst aus 10 Vorschlägen) |
| 80–90 | **Nächste 2 Wochen bis M2** + Q&A |

Briefing-Dokumente liegen wie immer 24h vorher bereit (also schon jetzt).

---

## 🔒 Was im Audit-Trail dazu kommt

- seq 65 `email_received` (deine Entscheidungen)
- seq 66 `anti_pattern_self_report` (Outreach-Verstoß, transparent)
- seq 67-71 `principal_decision_recorded` (1 pro Entscheidung)
- seq 72 `domain_naming_options_drafted` (10 Vorschläge)
- seq 73 `outreach_template_for_approval` (zur Freigabe)
- seq 74 `incident_opened INC-2026-05-13-0001` (Blameless-Postmortem folgt)
- seq 75 `standards_patch_pending` (Customer-Outreach-Freigabe-Pflicht)

Audit-Chain-Integrität bleibt verifiziert ✓.

---

Mit besten Grüßen
**Priya Sharma** · Account Manager
**Lina Bergmann** · CEO (mit-zeichnet diesen Self-Report)

CC: Mira (Design Lead), Jonas (CTO), Niko (CFO), Yasmin (DPO)

---

*Ticket: TCK-20260513-0001 · 5 Entscheidungen verbucht · 1 Anti-Pattern-Verstoß transparent dokumentiert · Status: in_design · Day 9*

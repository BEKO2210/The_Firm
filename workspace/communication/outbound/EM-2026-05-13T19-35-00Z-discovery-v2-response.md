---
email_id: "EM-2026-05-13T19-35-00Z-discovery-v2-response"
thread_id: "TH-TCK-20260513-0001"
direction: "outbound"
from: "Priya Sharma <priya.sharma@korynth-labs.internal>"
from_role: "Account Manager (#021)"
to: "Belkis Aslani <belkis.aslani@gmail.com>"
cc:
  - "Jonas Weber (CTO) <jonas.weber@korynth-labs.internal>"
  - "Mira Lundberg (Discovery Lead) <mira.lundberg@korynth-labs.internal>"
  - "Niko Korhonen (CFO) <niko.korhonen@korynth-labs.internal>"
in_reply_to: "EM-2026-05-13T19-05-00Z-principal-reply-v1"
subject: "Re: Friseur-Plattform — Drei Varianten + alle Pre-Sign-Off-Dokumente (TCK-20260513-0001)"
ticket: "TCK-20260513-0001"
real: "2026-05-13T19:35:00Z"
sim:  "Day 1, 14:30 (Sprint 1 · Q1 2026)"
status: "sent"
priority: "high"
type: "discovery-v2"
language: "de"
awaiting_reply: true
---

Hallo Belkis,

danke für die schnelle, klare Rückmeldung. Wir haben alles eingearbeitet und liefern dir die V2 der Discovery-Antwort. Sie enthält:

**Drei Varianten zum Direkt-Vergleich** (gleicher Slot-Engine-Kern in allen drei!):

| | **Lean MVP** | Standard MVP | Premium MVP |
|---|:------------:|:------------:|:-----------:|
| **Dauer** | **12 Wochen** | 17 Wochen | 20 Wochen |
| **FTE** | 3–4 (Teilzeit) | 5–6 | 7–8 |
| **Kosten Ziel** | **€185.000** | €300.000 | €415.000 |
| **Kosten Cap** | **€235.000** | €355.000 | €485.000 |
| **Retainer/Monat** | €7.500 | €10.000 | €12.000 |
| **Native Apps** | nein (PWA reicht für Pilot) | nein (Phase 2) | nein (Phase 2) |
| **Slot-Engine** | gleiche, vollständige | gleiche | gleiche |
| **Pen-Test extern** | nein | nein | ja |
| **DSGVO-Tools** | Export+Löschung | + Consent-Manager | + Audit-Log pro Operation |

**Unsere Empfehlung: Lean MVP.**

Begründung: Bei einer noch nicht validierten Geschäftsidee ist ein 12-Wochen-Pilot mit €185k das richtige Risikoprofil. Du bekommst nach 12 Wochen echte Salon-Daten — und kannst dann Phase 2 auf Basis von echtem Signal planen, nicht auf Basis von Vermutungen. Der Slot-Engine-Kern (das technisch riskanteste Modul) ist in Lean **identisch** zu Premium. Die Sparmaßnahmen liegen bei Polish, externen Audits und Reporting-Features.

**Erweiterungspfad**: Vom Lean MVP zum Standard- oder Premium-Stand kostet ~€100–270k zusätzlich verteilt über 4–6 Monate, mit echten Daten als Entscheidungsgrundlage.

Das vollständige Dokument liegt im Repository:

```
workspace/tickets/TCK-20260513-0001/02-discovery/v2-three-variants-and-supporting-docs.md
```

Es enthält ALLE 10 Pre-Sign-Off-Punkte, die du angefordert hast:

1. ✅ **MVP-Scope-Liste** (kanonisch, 21 Punkte für Lean)
2. ✅ **Nicht-MVP-Liste** (26 Punkte, klare Phasen-Zuordnung)
3. ✅ **Datenmodell grob visualisiert** (ER-Diagramm + alle Entitäten + Mandantentrennung)
4. ✅ **Slot-Engine-Spezifikation** (API, Algorithmus, SQL, Race-Condition-Verhalten, Tests, Performance-Ziele)
5. ✅ **Rechte- und Rollenmodell** (5 Rollen × 7 Operationen, RLS-Implementation)
6. ✅ **Kostenaufteilung nach Modulen** (15 Module mit Person-Wochen + EUR-Anteil)
7. ✅ **Exit-Strategie** (Lock-in-Bewertung pro Komponente, Provider-Wechsel-Aufwand, **EU-only-Alternative** mit +€30–45k / +2 Wochen)
8. ✅ **Eigentum von Code/Marke/Produktrechten** (Tabelle: alle Assets gehören DIR, Korynth Labs ist reiner Dienstleister)
9. ✅ **Zahlungsplan nach Meilensteinen** (8 Meilensteine, % vom Gesamt-Budget, Geld-zurück-Klausel bei Verfehlen >14 Tage)
10. ✅ **Abnahmekriterien pro Phase** (Discovery, Design, Build pro Sprint, Harden, Release — jeweils messbar)

**Zu deinen Antworten auf unsere 8 Fragen**: alle in die Anforderungen übernommen (Pilot-Raum Stuttgart/Ludwigsburg/Freiberg, Plattformmarke + Salon-Branding, DACH-Fokus, Payment-Provider-neutral, Gastbuchung einstellbar, DE-only mit i18n-Vorbereitung, Supabase Frankfurt + EU-only-Alternative gezeigt, wöchentlicher Status-Slot mit Vorab-Briefing).

**Nächster Schritt**:

Bitte schreib uns kurz, welche Variante du wählst — oder ob du noch Punkte anpassen möchtest. Sobald die Wahl steht, machen wir innerhalb von 5 Sim-Tagen die Verträge fertig (MSA + SOW + DPA + IP-Assignment, alle in Deutsch).

Falls du noch Fragen hast — einfach antworten oder eine .md-Datei in `workspace/communication/inbox/` ablegen, wir bearbeiten es beim nächsten `/firma`-Lauf.

Mit besten Grüßen
**Priya Sharma**
Account Manager · Korynth Labs

CC: Jonas Weber (CTO), Mira Lundberg (Principal Engineer), Niko Korhonen (CFO)

---

*Ticket: TCK-20260513-0001 · Discovery v2 · Drei Varianten + 10 Pre-Sign-Off-Dokumente.*
*Wartet auf: deine Wahl der Variante (Lean / Standard / Premium).*

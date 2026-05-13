---
email_id: "EM-2026-05-13T22-10-00Z-principal-decisions-week-1"
thread_id: "TH-TCK-20260513-0001"
direction: "inbound"
from: "Belkis Aslani <belkis.aslani@gmail.com>"
to:
  - "Priya Sharma <priya.sharma@korynth-labs.internal>"
  - "Mira Lundberg <mira.lundberg@korynth-labs.internal>"
  - "Jonas Weber <jonas.weber@korynth-labs.internal>"
  - "Niko Korhonen <niko.korhonen@korynth-labs.internal>"
in_reply_to: "EM-2026-05-13T21-15-00Z-status-briefing-week-1"
subject: "Re: Status-Briefing Woche 1 — Entscheidungen vorab"
ticket: "TCK-20260513-0001"
real: "2026-05-13T22:10:00Z"
sim: "Day 9, 09:30"
status: "unread"
priority: "high"
type: "principal-decisions"
language: "de"
---

Hallo Priya, hallo Mira, hallo Jonas, hallo Niko,

vielen Dank für das Status-Briefing und die Zahlungsbestätigung.

Der Termin Donnerstag 14:00–15:30 ist für mich bestätigt.

Zu den offenen Punkten gebe ich euch vorab meine Entscheidungen, damit wir den Status-Slot effizient nutzen können.

## 1. Datenresidenz

Ich gebe **Supabase Frankfurt** als Startbasis frei.

Bedingungen:
- AVV / DPA muss vollständig dokumentiert sein.
- Subprocessor-Liste muss sauber vorliegen.
- Backups, Datenlöschung und Datenexport müssen dokumentiert sein.
- Mandantentrennung über Postgres RLS muss testbar nachgewiesen werden.
- Exit-Strategie zu EU-only muss im Architekturpaket erhalten bleiben.

EU-only behalten wir als spätere Option, falls wir öffentliche Auftraggeber oder besonders strenge Datenschutzanforderungen bedienen wollen.

## 2. Plattform-Domain

**Bitte noch nicht "korynth-bookings.de" registrieren.**

Ich möchte nicht, dass die Plattform dauerhaft nach Korynth Labs aussieht, weil das Produkt und die Marke später mir gehören sollen.

Bitte bereitet stattdessen eine kurze Domain-/Branding-Auswahl vor mit:
- 10 passenden Namensvorschlägen
- Verfügbarkeitsprüfung ".de"
- kurze Bewertung pro Name
- Empfehlung aus Produkt-/SaaS-Sicht

Bis zur finalen Markenentscheidung könnt ihr gerne mit einer internen Dev-Subdomain arbeiten.

## 3. Tempo

Ich entscheide mich aktuell für:

**Option A — Plan halten und Puffer behalten.**

Da ich die Premium-MVP-Variante gewählt habe, ist mir Qualität wichtiger als ein paar Tage früher live zu sein.

Wenn der Pilotsalon bis Day 25 sicher feststeht und keine Qualität leidet, können wir später noch einmal über eine vorsichtige Beschleunigung sprechen. Aber bitte keinen Qualitäts-, Security- oder DSGVO-Puffer opfern.

## 4. Pilotsalon

Ich habe noch keinen final bestätigten Pilotsalon.

Bitte unterstützt die Suche aktiv mit Cold Outreach an 5–10 passende Salons im Raum Stuttgart / Ludwigsburg / Freiberg am Neckar.

Wichtig:
- **Bitte Outreach-Text vorher zur Freigabe an mich senden.**
- Fokus auf kleine bis mittlere Salons mit ca. 3–8 Mitarbeitern.
- Der Pilot soll dialogbereit sein und ehrliches Feedback geben.
- Ziel ist nicht nur ein Testkunde, sondern ein echter Salon-Alltag mit realistischen Buchungen.

## 5. Zahlung / Meilensteinplan

Ich bestätige nochmals: **Option A bleibt gültig.**

Wir bleiben beim meilensteinbasierten Zahlungsplan. Keine Vorauszahlung des gesamten Restbetrags.

Bitte keine weiteren Ausgaben, Zusatzmodule, Domains, Tools oder Folgephasen ohne meine ausdrückliche Freigabe starten.

## 6. Fokus für den Status-Slot

Für den Termin möchte ich besonders diese Punkte besprechen:
- ADR-001 bis ADR-003 verständlich zusammenfassen
- Slot-Engine-Strategie und Doppelbuchungsschutz
- Sitemap und Slot-Picker-Wireframe
- Pilotsalon-Onboarding
- Domain-/Branding-Strategie
- nächste 2 Wochen bis M2-Sign-off

Vielen Dank für die gute Vorbereitung. Wir sprechen morgen im Status-Slot.

Mit freundlichen Grüßen
Belkis Aslani

---
email_id: "EM-2026-05-13T19-05-00Z-principal-reply-v1"
thread_id: "TH-TCK-20260513-0001"
direction: "inbound"
from: "Belkis Aslani <belkis.aslani@gmail.com>"
to:
  - "Priya Sharma <priya.sharma@korynth-labs.internal>"
  - "Jonas Weber <jonas.weber@korynth-labs.internal>"
  - "Mira Lundberg <mira.lundberg@korynth-labs.internal>"
subject: "Re: Friseur-Plattform – Discovery-Antwort & nächste Schritte (TCK-20260513-0001)"
ticket: "TCK-20260513-0001"
real: "2026-05-13T19:05:00Z"
sim:  "Day 1, 14:30 (Sprint 1 · Q1 2026)"
status: "unread"
priority: "high"
type: "discovery-response-from-principal"
language: "de"
awaiting_reply: false
---

Hallo Priya, hallo Jonas, hallo Mira,

vielen Dank für die ausführliche Discovery-Antwort und die strukturierte Einschätzung zum Projekt TCK-20260513-0001.

Ich habe die Antwort gelesen. Grundsätzlich passt die Richtung: Multi-Tenant SaaS, automatische Terminvergabe, Betreiber-Dashboard, Kundenbuchung, saubere Slot-Engine und später native Apps sind genau die richtige Basis.

Bevor ich aber ein vollständiges Go für die Design- oder Build-Phase gebe, möchte ich ein paar Punkte sauber klären und den MVP noch etwas realistischer zuschneiden.

## Antworten auf eure 8 offenen Fragen

1. **Pilotsalon vorhanden?**
   Aktuell habe ich noch keinen final bestätigten Pilotsalon. Ich würde aber im Raum Stuttgart / Ludwigsburg / Freiberg am Neckar mit einem kleinen bis mittleren Salon starten. Ideal wäre ein Pilot mit ca. 3–8 Mitarbeitern, damit die Mitarbeiter- und Slotlogik realistisch getestet werden kann. Bitte plant in der Design-Phase ein klares Pilotsalon-Onboarding-Konzept mit Checkliste.

2. **Branding**
   Ich möchte grundsätzlich eine eigene Plattformmarke aufbauen. Die Salons sollen aber innerhalb ihrer Buchungsseite eigenes Logo, Farben, Bilder und Beschreibung verwenden können. Also: Plattformmarke im Kern, aber salonbezogenes Branding für die Kundenseite. Komplettes White-Label ist für später interessant, aber nicht zwingend im MVP.

3. **Region zum Start**
   Zum Start reicht DACH, mit Fokus auf Deutschland. Internationalisierung ist später möglich, aber der MVP soll zuerst für deutsche Friseure / Beauty-Salons sauber funktionieren.

4. **Payment-Provider Phase 2**
   Stripe ist für mich als technische Basis okay. Wichtig ist aber, dass die Architektur Payment-provider-neutral geplant wird, damit später auch Mollie oder ein anderer Anbieter möglich bleibt. Zahlung muss nicht zwingend in den MVP, aber das Datenmodell soll vorbereitet sein.

5. **Gastbuchung**
   Ja, Gastbuchung soll möglich sein, weil viele Kunden keine Lust auf Registrierung haben. Betreiber sollen aber einstellen können, ob Gastbuchung erlaubt ist oder ob ein Kundenkonto Pflicht ist. Mindestens Name, E-Mail und Telefonnummer sollten bei Gastbuchung möglich sein.

6. **Mehrsprachigkeit MVP**
   Deutsch reicht im MVP. Die Plattform sollte aber technisch so gebaut werden, dass Englisch später ohne großen Umbau ergänzt werden kann.

7. **Datenresidenz**
   Supabase Frankfurt ist für mich grundsätzlich in Ordnung, solange DSGVO, AVV, Backups, Datenexport, Löschung und Mandantentrennung sauber umgesetzt sind. Bitte zeigt mir aber zusätzlich eine EU-only Alternative mit grobem Kosten- und Zeitunterschied, damit ich bewusst entscheiden kann.

8. **Meine Kapazität**
   Ja, ich kann wöchentlich 60–90 Minuten für Status, Entscheidungen und Review einplanen. Ich möchte aber klare Entscheidungsunterlagen vorab bekommen, damit Termine effizient bleiben.

## Wichtige Rückfrage zum MVP und Budget

Die geschätzten Kosten von Ziel 415.000 € und Cap 485.000 € sind für mich aktuell sehr hoch. Außerdem war meine ursprüngliche Idee Website plus Android- und iOS-App. In eurer Empfehlung sind native Apps aber erst Phase 2.

Bitte erstellt mir deshalb zusätzlich eine Lean-MVP-Variante mit folgenden Zielen:

- Fokus auf responsive Web-App zuerst
- Kundenbuchung mobil optimiert wie eine App
- Betreiber-Dashboard
- Mitarbeiterverwaltung
- Leistungen / Pakete
- echte Slot-Engine ohne Doppelbuchungen
- E-Mail-Bestätigung und Erinnerungen
- Super-Admin-Grundlage
- Apps, Payment, KI und Marketing erst später

Bitte zeigt mir dafür drei Varianten:

1. Lean MVP: minimal, aber sauber nutzbar für 1–3 Pilotsalons
2. Standard MVP: guter kommerzieller Start
3. Premium MVP: eure aktuelle Variante mit allen Qualitätsmaßnahmen

Zu jeder Variante hätte ich gerne:

- Funktionsumfang
- Zeitplan
- Teamgröße
- Kostenrahmen
- was bewusst nicht enthalten ist
- technische Risiken
- was später einfach erweitert werden kann

## Weitere Punkte, die ich vor Vertragsfreigabe sehen möchte

Bitte liefert mir vor einem Sign-off:

- klare MVP-Scope-Liste
- klare Nicht-MVP-Liste
- Datenmodell grob visualisiert
- Slot-Engine-Spezifikation als eigenes Dokument
- Rechte- und Rollenmodell
- Kostenaufteilung nach Modulen
- Exit-Strategie, falls Supabase/Vercel später ersetzt werden sollen
- Erklärung, wem der Code, die Marke und die Produktrechte gehören
- Zahlungsplan nach Meilensteinen
- Abnahmekriterien pro Phase

Ich möchte ausdrücklich vermeiden, dass wir zu groß starten und später zu viel Budget verbrennen. Mir ist wichtiger, dass zuerst ein kleiner, echter Pilot funktioniert und bewiesen wird, dass Salons und Kunden das System wirklich benutzen.

Grundsätzlich bin ich interessiert, weiterzugehen — aber bitte zunächst mit einer überarbeiteten, schlankeren MVP-Planung und Budget-Alternative.

Mit freundlichen Grüßen
Belkis Aslani

# Projektauftrag / Prompt an die Firma

**Absender:** Belkis Aslani  
**Projekt:** Website + App für Friseure / Beauty-Salons mit automatischer Termin- und Paketbuchung  
**Ziel:** Entwicklung einer professionellen Plattform, über die Friseure und Beauty-Betreiber ihre Termine, Mitarbeiter, Pakete, Kundendaten und Buchungen weitgehend automatisch verwalten können.

---

## 1. Kurzbeschreibung

Ich möchte eine moderne Website und eine App für Android und Apple entwickeln lassen, die speziell für Friseure, Barbershops und Beauty-Salons gedacht ist.

Kunden sollen online Termine buchen können, ohne telefonisch anrufen zu müssen. Sie sollen Dienstleistungen oder Pakete auswählen, freie Zeitfenster sehen, optional einen bestimmten Mitarbeiter auswählen und direkt buchen können.

Für die Betreiber soll das System möglichst automatisch laufen: Termine sollen intelligent vergeben werden, basierend auf Öffnungszeiten, verfügbaren Mitarbeitern, deren Fähigkeiten, gebuchten Leistungen, Dauer, Pausen, Urlaub, Auslastung und bestehenden Terminen.

Das Ziel ist eine Plattform, die den Salon-Alltag vereinfacht, weniger Telefonaufwand erzeugt und Kunden eine einfache, moderne Buchungserfahrung bietet.

---

## 2. Zielgruppen

### Betreiber
- Friseursalons
- Barbershops
- Kosmetikstudios
- Beauty-Salons
- Nagelstudios
- Einzelunternehmer im Beauty-Bereich
- Filialbetriebe mit mehreren Mitarbeitern oder Standorten

### Endkunden
- Kunden, die online Termine buchen möchten
- Kunden, die bestimmte Mitarbeiter bevorzugen
- Kunden, die Pakete oder Kombi-Angebote buchen möchten
- Kunden, die Erinnerungen und einfache Umbuchungen wünschen

---

## 3. Hauptfunktionen für Kunden

Die Kunden-App und Website sollen folgende Funktionen enthalten:

### Registrierung / Login
- Registrierung per E-Mail
- Login per E-Mail
- Optional später: Google / Apple Login
- Gastbuchung optional möglich, wenn Betreiber das erlaubt

### Salon auswählen
- Salonprofil mit Name, Logo, Adresse, Öffnungszeiten, Bildern und Beschreibung
- Leistungen und Pakete sichtbar
- Mitarbeiter sichtbar, falls vom Betreiber freigegeben
- Bewertungen optional für spätere Version

### Leistung oder Paket buchen
Kunden sollen einzelne Leistungen oder Pakete auswählen können, z. B.:

- Herrenhaarschnitt
- Damenhaarschnitt
- Kinderhaarschnitt
- Bart trimmen
- Waschen / Schneiden / Föhnen
- Färben
- Strähnen
- Styling
- Hochzeitsstyling
- Pflegebehandlung
- Kombi-Pakete wie „Haarschnitt + Bart“, „Farbe + Schnitt + Pflege“

Jede Leistung braucht:
- Name
- Beschreibung
- Dauer
- Preis
- benötigte Mitarbeiterfähigkeit
- optional Vorbereitungszeit
- optional Nachbereitungszeit
- optional Pufferzeit

### Mitarbeiter auswählen
Der Kunde soll auswählen können:

1. „Beliebiger Mitarbeiter“
2. Einen bestimmten Mitarbeiter
3. Optional: nur Mitarbeiter mit bestimmter Spezialisierung

Wenn „beliebiger Mitarbeiter“ ausgewählt wird, soll das System automatisch den besten freien Mitarbeiter auswählen.

### Zeitfenster buchen
Das System soll automatisch freie Zeitfenster anzeigen.

Wichtig:
- Keine Doppelbuchungen
- Berücksichtigung der Öffnungszeiten
- Berücksichtigung von Pausen
- Berücksichtigung von Urlaub / Krankheit / Abwesenheiten
- Berücksichtigung der Leistungsdauer
- Berücksichtigung von Pufferzeiten
- Berücksichtigung der Mitarbeiterqualifikation
- Optional: intelligente Vorschläge wie „frühester Termin“, „heute noch frei“, „beliebtester Slot“

### Terminverwaltung für Kunden
Kunden sollen:
- Termine einsehen
- Termine stornieren
- Termine umbuchen
- Erinnerungen erhalten
- Buchungsbestätigung erhalten
- Optional Pakete / Gutscheine kaufen

### Benachrichtigungen
- E-Mail-Bestätigung
- Push-Benachrichtigung in der App
- SMS optional später
- Erinnerungen z. B. 24 Stunden und 2 Stunden vor Termin
- Benachrichtigung bei Änderung oder Stornierung

---

## 4. Hauptfunktionen für Betreiber / Salon-Admin

Es soll ein Betreiber-Dashboard geben, am besten als Web-Dashboard.

### Dashboard
Übersicht über:
- heutige Termine
- kommende Termine
- freie Zeitfenster
- Auslastung pro Mitarbeiter
- Umsatzübersicht
- Stornierungen
- neue Kunden
- offene Aufgaben

### Mitarbeiterverwaltung
Betreiber sollen Mitarbeiter anlegen und verwalten können:

- Name
- Profilbild optional
- Rolle
- Arbeitszeiten
- Pausen
- Urlaub / Abwesenheiten
- Fähigkeiten / Spezialisierungen
- Leistungen, die der Mitarbeiter ausführen darf
- Kalenderansicht pro Mitarbeiter
- Aktiv / inaktiv

### Automatische Terminvergabe
Das wichtigste Kernfeature:

Das System soll Termine automatisch vergeben können.

Logik:
- Kunde wählt Leistung oder Paket
- System prüft Dauer
- System prüft benötigte Fähigkeit
- System prüft verfügbare Mitarbeiter
- System prüft Öffnungszeiten
- System prüft bestehende Buchungen
- System prüft Pausen / Urlaub / Abwesenheiten
- System sucht passende Zeitfenster
- Bei „beliebiger Mitarbeiter“ wählt das System automatisch den passenden Mitarbeiter

Optimierungslogik:
- Möglichst keine unnötigen Lücken im Kalender
- Mitarbeiter gleichmäßig auslasten
- früheste passende Termine vorschlagen
- zusammenhängende Pakete korrekt einplanen
- bei langen Behandlungen nur realistische Zeitfenster anbieten
- optional: Priorisierung bestimmter Mitarbeiter oder Leistungen

### Leistungen und Pakete verwalten
Betreiber sollen Leistungen und Pakete selbst anlegen können:

- Name
- Kategorie
- Beschreibung
- Preis
- Dauer
- Pufferzeit
- erforderliche Fähigkeit
- buchbar / nicht buchbar
- online sichtbar / intern
- Paket aus mehreren Leistungen zusammenstellen

Beispiele:
- „Basic Cut“
- „Premium Cut + Styling“
- „Color Paket“
- „Bride Paket“
- „Bart + Haarschnitt Paket“

### Kalender
Kalenderansicht:
- Tagesansicht
- Wochenansicht
- Monatsansicht
- Ansicht pro Mitarbeiter
- Ansicht für ganzen Salon
- Drag & Drop für Terminverschiebung
- Farbliche Kennzeichnung nach Status

Terminstatus:
- Gebucht
- Bestätigt
- Kunde erschienen
- Kunde nicht erschienen
- Bezahlt
- Storniert
- Umgebucht

### Kundenverwaltung / CRM
Betreiber sollen Kundendaten verwalten können:

- Name
- Telefonnummer
- E-Mail
- Buchungshistorie
- bevorzugter Mitarbeiter
- Notizen
- Allergien / Hinweise optional
- No-Show-Historie
- Kundenstatus
- DSGVO-konforme Löschfunktion

### Zahlungen
Optional im MVP oder später:

- Online-Anzahlung
- vollständige Online-Zahlung
- Zahlung vor Ort markieren
- Stornogebühren
- Gutscheine
- Pakete / Abos
- Rechnungen / Belege

### Einstellungen
Betreiber sollen einstellen können:

- Öffnungszeiten
- Feiertage
- Stornierungsregeln
- maximale Buchungszeit im Voraus
- minimale Vorlaufzeit für Buchungen
- Buchung ohne Registrierung erlauben ja/nein
- automatische Bestätigung oder manuelle Freigabe
- Anzahlungsregeln
- Sprache
- Logo / Farben / Branding

---

## 5. Rollen und Rechte

Das System soll Rollen haben:

### Super Admin
Für mich / Plattformbetreiber:
- alle Salons verwalten
- Tarife verwalten
- Nutzer verwalten
- Systemstatistiken sehen
- Supportzugriff

### Salon Owner
Für Saloninhaber:
- Salon verwalten
- Mitarbeiter verwalten
- Leistungen verwalten
- Termine verwalten
- Umsätze sehen
- Einstellungen ändern

### Mitarbeiter
Für Salonmitarbeiter:
- eigene Termine sehen
- eigene Verfügbarkeit pflegen, falls erlaubt
- Terminstatus ändern
- Kundennotizen sehen, falls erlaubt

### Kunde
- Termine buchen
- Termine verwalten
- Profil verwalten
- Buchungshistorie sehen

---

## 6. Plattformen

Ich möchte:

### Website
- Marketing-Website für die Plattform
- Salon-Buchungsseite für Kunden
- Admin-Dashboard für Betreiber

### Mobile Apps
- Android-App für Kunden
- iOS-App für Kunden
- Optional später: Mitarbeiter-App oder Betreiber-App

Wichtig: Die Website muss auch auf dem Handy sehr gut funktionieren, falls die Apps später kommen.

---

## 7. Design und Benutzererlebnis

Das Design soll modern, hochwertig und einfach sein.

Stil:
- Premium
- sauber
- mobil optimiert
- leicht verständlich
- ähnlich moderne Booking-, Beauty- und SaaS-Plattformen
- keine überladene Oberfläche

Wichtig:
- Kunden müssen in wenigen Schritten buchen können
- Betreiber müssen ohne technische Kenntnisse alles bedienen können
- Kalender und Zeiten müssen sehr klar dargestellt werden
- App soll professionell wirken, nicht wie eine einfache Bastellösung

---

## 8. Technische Anforderungen

Bitte eine sinnvolle technische Architektur vorschlagen.

Gewünscht:
- skalierbares Backend
- saubere Datenbankstruktur
- API für Website und Apps
- Admin-Dashboard
- Android und iOS App
- sichere Authentifizierung
- DSGVO-freundliche Datenverarbeitung
- Rollen- und Rechteverwaltung
- Buchungslogik serverseitig, damit keine Doppelbuchungen entstehen
- Audit-Logs für wichtige Änderungen
- Backup-Konzept
- saubere Dokumentation

Mögliche Technologien können vorgeschlagen werden. Wichtig ist nicht die konkrete Programmiersprache, sondern dass das System stabil, wartbar und erweiterbar ist.

---

## 9. MVP — Erste Version

Die erste Version soll nicht alles auf einmal können, sondern professionell starten.

### MVP muss enthalten:
- Kundenregistrierung / Login
- Salonprofil
- Leistungen und Pakete
- Mitarbeiterverwaltung
- Arbeitszeiten
- Verfügbarkeiten
- automatische Slot-Berechnung
- Terminbuchung
- Terminbestätigung
- Stornierung / Umbuchung
- Betreiber-Dashboard
- Kalenderansicht
- E-Mail-Benachrichtigungen
- Admin-Rollen
- responsive Website
- Grundlage für Android/iOS Apps

### Spätere Versionen:
- Online-Zahlung
- Gutscheine
- Bewertungen
- Warteliste
- KI-gestützte Terminoptimierung
- Marketing-Automation
- Kundenbindungsprogramme
- mehrere Standorte
- POS-/Kassensystem-Anbindung
- WhatsApp- oder SMS-Erinnerungen
- Mitarbeiter-App

---

## 10. Wichtige Buchungslogik

Bitte besonders sauber planen:

Ein Termin darf nur buchbar sein, wenn:

1. der Salon geöffnet ist,
2. ein passender Mitarbeiter verfügbar ist,
3. der Mitarbeiter die Leistung ausführen kann,
4. die Dauer inklusive Pufferzeit in den Kalender passt,
5. keine Pause, kein Urlaub und keine bestehende Buchung blockiert,
6. die minimale Vorlaufzeit eingehalten wird,
7. die maximale Vorausbuchung nicht überschritten wird,
8. Stornierungs- und Umbuchungsregeln berücksichtigt werden.

Beispiel:
Kunde bucht „Haarschnitt + Bart“ mit Dauer 60 Minuten plus 10 Minuten Puffer.
Das System darf nur Mitarbeiter anzeigen, die Haarschnitt und Bart anbieten und in diesem Zeitraum wirklich frei sind.

---

## 11. Geschäftsmodell

Das System soll später als Software-as-a-Service angeboten werden können.

Mögliche Tarife:
- Basic: Einzelunternehmer
- Pro: kleiner Salon mit mehreren Mitarbeitern
- Premium: mehrere Mitarbeiter, Pakete, Online-Zahlung, erweiterte Statistiken
- Enterprise / Multi-Location: mehrere Filialen

Bitte die Architektur so planen, dass mehrere Salons getrennt voneinander verwaltet werden können.

Wichtig:
- Mandantenfähigkeit
- jeder Salon hat eigene Daten
- jeder Salon hat eigene Mitarbeiter, Leistungen, Kunden und Termine
- Super Admin kann alles verwalten
- Salonbetreiber sehen nur ihre eigenen Daten

---

## 12. Datenschutz und Sicherheit

Bitte von Anfang an ein sicheres Konzept einplanen:

- DSGVO-freundliche Datenhaltung
- klare Einwilligungen
- Datenschutzerklärung vorbereitbar
- Datenexport für Kunden
- Löschfunktion
- Rollenrechte
- sichere Passwörter / Auth
- verschlüsselte Kommunikation
- keine unnötige Speicherung sensibler Daten
- Backups
- Protokollierung wichtiger Änderungen

---

## 13. Erwartete Lieferung der Firma

Ich möchte von euch bitte eine klare technische und geschäftliche Einschätzung:

1. Wie würdet ihr das System technisch umsetzen?
2. Welche Module würdet ihr bauen?
3. Was gehört in den MVP?
4. Was sollte erst später kommen?
5. Welche Architektur empfehlt ihr?
6. Wie lange würde eine erste professionelle Version ungefähr dauern?
7. Wie viele Entwickler / Designer / Tester wären nötig?
8. Welche Kostenrahmen wären realistisch?
9. Welche Risiken seht ihr?
10. Wie verhindert ihr Doppelbuchungen und falsche Terminvergaben?
11. Wie wird die App für Android und Apple umgesetzt?
12. Wie wird das System später als SaaS für mehrere Salons skalierbar?
13. Welche Wartungs- und Betriebskosten entstehen?
14. Welche rechtlichen / Datenschutzpunkte müssen berücksichtigt werden?

---

## 14. Zielbild

Am Ende möchte ich ein System, bei dem ein Friseur oder Beauty-Salon sagen kann:

„Meine Kunden buchen online selbstständig, meine Mitarbeiterkalender werden automatisch gefüllt, Doppelbuchungen passieren nicht, Pakete und Leistungen sind sauber verwaltet, Kunden bekommen Erinnerungen, und ich habe im Dashboard jederzeit den Überblick.“

Das System soll nicht nur eine einfache Terminseite sein, sondern eine professionelle Buchungsplattform für Friseure und Beauty-Dienstleister.

---

## 15. Bitte um Antwort

Bitte erstellt mir auf Basis dieses Projektauftrags:

- eine grobe Aufwandsschätzung,
- eine empfohlene Architektur,
- einen MVP-Plan,
- eine Modulübersicht,
- eine Kosten- und Zeitabschätzung,
- Risiken und offene Fragen,
- und einen Vorschlag, wie man das Projekt in Phasen sauber umsetzen kann.

Mit freundlichen Grüßen  
**Belkis Aslani**

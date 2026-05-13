---
document: "Auftragsverarbeitungsvereinbarung (DPA / AVV)"
ticket: "TCK-20260513-0001"
parent: "MSA"
version: "1.0 — Draft"
draft_real: "2026-05-13"
status: "DRAFT — awaiting principal signature"
language: "de"
legal_basis: "Art. 28 DSGVO + § 11 BDSG (a. F. analog)"
---

# Auftragsverarbeitungsvereinbarung (AVV) nach Art. 28 DSGVO

> ⚠️ **Dieser Vertrag wurde durch KI erstellt.** Anwaltliche Prüfung vor Unterzeichnung empfohlen, insbesondere wegen sensibler DSGVO-Anforderungen.

Anlage 2 zum MSA · TCK-20260513-0001

---

## Zwischen

- **Verantwortlicher:** Belkis Aslani (im Folgenden „**du**" / „**Auftraggeber**")
- **Auftragsverarbeiter:** Korynth Labs (im Folgenden „**wir**" / „**Auftragnehmer**")

## § 1 Gegenstand und Dauer

(1) Wir verarbeiten in deinem Auftrag personenbezogene Daten im Rahmen des SOW-001 (Premium MVP) und des nachfolgenden Maintenance-Vertrags.

(2) Diese AVV gilt für die gesamte Laufzeit des MSA und der zugrundeliegenden SOWs bzw. solange wir personenbezogene Daten in deinem Auftrag verarbeiten.

## § 2 Art und Zweck der Verarbeitung

| Aspekt | Details |
|--------|---------|
| **Art der Verarbeitung** | Erfassung, Speicherung, Veränderung, Übermittlung, Löschung |
| **Zweck** | Entwicklung, Betrieb und Wartung der Friseur & Beauty Booking SaaS-Plattform |
| **Verarbeitete Datenkategorien** | Stammdaten (Name, Adresse, Email, Telefon), Buchungsdaten, Mitarbeiterdaten (Arbeitszeiten, Skills), optional Allergien (mit zusätzlicher Einwilligung), technische Daten (IP, Login-Zeitpunkte, Audit-Log) |
| **Betroffene Personen** | Endkunden der Salons (B2C), Salon-Mitarbeiter (B2B/Personal), Salon-Owner |
| **Sensitive Daten (Art. 9 DSGVO)** | Nur optional Allergien — mit gesonderter ausdrücklicher Einwilligung; standardmäßig deaktiviert |

## § 3 Weisungsrechte

(1) Wir verarbeiten personenbezogene Daten ausschließlich im Rahmen der getroffenen Vereinbarungen und nach deinen dokumentierten Weisungen.

(2) Weisungen werden per E-Mail oder via Ticket-System dokumentiert. Mündliche Weisungen sind innerhalb von 5 Werktagen zu bestätigen.

(3) Wir informieren dich unverzüglich, wenn eine Weisung nach unserer Einschätzung gegen geltendes Datenschutzrecht verstößt.

## § 4 Pflichten des Auftragnehmers

(1) Wir verpflichten uns:

- (a) personenbezogene Daten ausschließlich gemäß deiner Weisung zu verarbeiten
- (b) sicherzustellen, dass alle zur Verarbeitung befugten Personen sich zur Vertraulichkeit verpflichtet haben
- (c) angemessene technische und organisatorische Maßnahmen (TOMs, § 6) zu treffen und zu erhalten
- (d) dich bei Anfragen betroffener Personen (Auskunft, Berichtigung, Löschung, Datenübertragbarkeit, Widerspruch) zu unterstützen
- (e) dich bei der Erfüllung deiner Pflichten nach Art. 32–36 DSGVO zu unterstützen (Sicherheit, Meldung von Verletzungen, DSFA, vorherige Konsultation)
- (f) nach Beendigung der Verarbeitung alle personenbezogenen Daten nach deiner Wahl zurückzugeben oder zu löschen, sofern keine Aufbewahrungspflicht besteht
- (g) dir alle für den Nachweis erforderlichen Informationen zur Verfügung zu stellen und Überprüfungen zu ermöglichen

(2) Wir unterstützen dich bei der Wahrnehmung der Rechte betroffener Personen (Art. 12–22 DSGVO).

## § 5 Datenschutzbeauftragter (DPO)

- **Unser DPO:** Yasmin El-Sayed (#017), erreichbar unter `dpo@korynth-labs.internal`
- Antworten auf DSGVO-Anfragen: innerhalb von 72 Stunden Erstbestätigung

## § 6 Technische und organisatorische Maßnahmen (TOMs)

Wir setzen folgende TOMs ein:

### 6.1 Vertraulichkeit (Art. 32 Abs. 1 lit. b DSGVO)

- **Zutrittskontrolle**: physische Server bei Subprocessors mit ISO-27001-zertifizierten Rechenzentren (Supabase EU Frankfurt, Vercel EU)
- **Zugangskontrolle**: 2FA für alle Korynth-Labs-Konten, eindeutige Nutzer-IDs, keine geteilten Accounts
- **Zugriffskontrolle**: Rollen-/Rechtemodell, Need-to-Know-Prinzip, Reviewer-Pflicht für Code-Änderungen, Postgres RLS für Mandantentrennung

### 6.2 Integrität (Art. 32 Abs. 1 lit. b)

- **Eingabekontrolle**: Audit-Log pro Schreiboperation in allen relevanten Tabellen
- **Übertragungskontrolle**: HTTPS / TLS 1.3 für alle Datenübertragungen, signierte JWTs

### 6.3 Verfügbarkeit + Belastbarkeit (Art. 32 Abs. 1 lit. b, c)

- **Tägliche automatisierte Backups** (Supabase PITR + tägliche Postgres-Dumps)
- **Wöchentliche kalte Kopie** auf Cloudflare R2 in separater Region
- **Disaster-Recovery-Drills** monatlich (siehe CLAUDE.md §29.2)
- Verfügbarkeitsziel im Maintenance-Vertrag: 99,9% pro Monat

### 6.4 Wiederherstellbarkeit (Art. 32 Abs. 1 lit. c)

- RPO (Recovery Point Objective): max. 1 Stunde Datenverlust
- RTO (Recovery Time Objective): max. 4 Stunden bis Wiederherstellung
- Restore-Tests quartalsweise

### 6.5 Verfahren zur regelmäßigen Überprüfung (Art. 32 Abs. 1 lit. d)

- **Jährlicher Pen-Test** durch externe Firma (Vor-Release in Harden, dann jährlich)
- **Jährlicher DSGVO-Audit** (internes Audit + externe Validierung pro Jahr)
- **Dependency-Scanning** täglich (Snyk + Renovate)

## § 7 Sub-Auftragsverarbeiter

(1) Wir setzen folgende Sub-Auftragsverarbeiter ein (siehe Anlage 5 zum MSA für Details + AVVs):

| Subprocessor | Zweck | Sitz / Daten-Region | DSGVO-Konformität |
|--------------|-------|---------------------|-------------------|
| **Supabase** | Postgres + Auth + Storage + RLS | Frankfurt (EU-Region) | AVV vorhanden, ISO 27001 |
| **Vercel** | Hosting Next.js App | EU-Region | AVV vorhanden, ISO 27001, SOC 2 |
| **Resend** | E-Mail-Versand | EU-Region | AVV vorhanden |
| **Sentry** | Error-Monitoring | EU-Region | AVV vorhanden |
| **Cloudflare R2** | Backup-Storage | EU-Region | AVV vorhanden |
| **Better Stack** | Uptime-Monitoring | EU | AVV vorhanden |

(2) **Wechsel oder Hinzunahme** weiterer Sub-Auftragsverarbeiter erfordert deine vorherige schriftliche Zustimmung. Wir kündigen geplante Änderungen mindestens 30 Tage vorher an. Du hast ein Widerspruchsrecht.

(3) Wir schließen mit jedem Sub-Auftragsverarbeiter eine eigene AVV mit gleichwertigen Schutzstandards ab.

## § 8 Datenpannen / Verletzungsmeldungen

(1) Wir informieren dich unverzüglich, spätestens innerhalb von **24 Stunden** nach Kenntnis einer Verletzung des Schutzes personenbezogener Daten (Art. 33 DSGVO).

(2) Die Meldung enthält:

- Art und Umfang der Verletzung
- Kategorie und ungefähre Zahl der betroffenen Personen
- Kategorie und ungefähre Zahl der betroffenen Datensätze
- Voraussichtliche Folgen
- Bereits ergriffene oder geplante Maßnahmen

(3) Wir unterstützen dich bei der Meldung an die Aufsichtsbehörde (in BW: Landesbeauftragter für Datenschutz und Informationsfreiheit Baden-Württemberg, **72-Stunden-Frist nach Art. 33 DSGVO**).

## § 9 Rechte der betroffenen Personen

(1) Wir unterstützen dich bei der Erfüllung der Rechte der betroffenen Personen:

- Auskunft (Art. 15) — Tool im Admin-Dashboard
- Berichtigung (Art. 16) — direkt im Admin-Dashboard
- Löschung (Art. 17) — DSGVO-Lösch-Tool
- Einschränkung (Art. 18) — Status-Flag
- Datenübertragbarkeit (Art. 20) — JSON-Export pro Kunde
- Widerspruch (Art. 21) — Consent-Manager

(2) Anfragen, die uns direkt erreichen, leiten wir unverzüglich an dich weiter.

## § 10 Daten-Residenz

Verarbeitung erfolgt **ausschließlich in der EU** (siehe Subprocessor-Tabelle). Schrems-II-Risiken (USA): wir verwenden nur EU-Tochterunternehmen mit Standardvertragsklauseln + EDPB-empfohlenen zusätzlichen Maßnahmen, soweit die Mutter-Gesellschaft eines Subprocessors in den USA sitzt. Eine vollständige EU-only-Variante ist in der Discovery v2 als Alternative dokumentiert (verfügbar gegen Aufpreis).

## § 11 Kontrollrechte

(1) Du hast das Recht, dich oder einen von dir beauftragten Auditor zu vergewissern, dass wir unsere Pflichten aus dieser AVV einhalten.

(2) Audits können nach 5 Werktagen Vorlaufzeit an unseren Geschäftssitz (oder remote) durchgeführt werden, max. 1× pro Jahr. Aufwandskosten dafür trägt der Auftraggeber, soweit der Audit keinen wesentlichen Mangel aufdeckt.

(3) Wir stellen dir auf Anforderung Audit-Reports unserer Subprocessor (SOC 2, ISO 27001) zur Verfügung.

## § 12 Vergütung

Die Erfüllung dieser AVV ist im SOW-Vergütungs-Umfang enthalten. Eine gesonderte Vergütung erfolgt nur für außerordentliche Mehraufwände auf Anweisung (z. B. ein Audit, der über das jährliche Standard-Audit hinausgeht).

## § 13 Beendigung und Datenrückgabe

(1) Nach Beendigung dieser AVV bzw. nach Abschluss der Verarbeitung:

- Rückgabe aller personenbezogenen Daten in maschinenlesbarem Format (JSON / CSV / SQL-Dump)
- **oder** vollständige Löschung mit schriftlicher Bestätigung

— nach deiner Wahl.

(2) Aufbewahrungspflichten gemäß HGB / AO bleiben unberührt (z. B. Buchhaltung).

## § 14 Schlussbestimmungen

Es gelten die Schlussbestimmungen des MSA (§ 12 MSA). Bei Konflikten zwischen MSA und AVV hat die AVV Vorrang im Hinblick auf datenschutzrechtliche Regelungen.

---

## Unterschriften

Stuttgart, ____________________

Verantwortlicher: ____________________________________
                  Belkis Aslani

Auftragsverarbeiter: ___________________________________
                     Korynth Labs · DPO Yasmin El-Sayed (#017)

---
document: "IP-Assignment Vereinbarung"
ticket: "TCK-20260513-0001"
parent: "MSA"
version: "1.0 — Draft"
status: "SIGNED · 2026-05-13"
signed_principal: "2026-05-13 (lawyer-reviewed)"
signed_firm: "2026-05-13 (CEO countersigned)"
language: "de"
---

# IP-Assignment / Übertragung geistiger Eigentumsrechte

> ⚠️ **Dieser Vertrag wurde durch KI erstellt.** Anwaltliche Prüfung vor Unterzeichnung empfohlen.

Anlage 3 zum MSA · TCK-20260513-0001

---

## § 1 Vertragsgegenstand

Diese Vereinbarung regelt die Übertragung sämtlicher gewerblicher Schutzrechte und Urheberrechte (im Folgenden „**IP-Rechte**") an den Arbeitsergebnissen, die Korynth Labs im Rahmen des MSA und der zugehörigen SOWs für Belkis Aslani (im Folgenden „**Auftraggeber**") erbringt.

## § 2 Übertragene Werke

Folgende Werke werden vollumfänglich auf den Auftraggeber übertragen:

| Kategorie | Konkret |
|-----------|---------|
| **Quellcode** | Alle Repositories, Branches, Commits, Tags. Konkret: alles in `apps/*`, `packages/*`, `services/*`, `infra/*` der projektspezifischen Codebase |
| **Datenbankschema** | Migrations-Skripte (Up + Down), DDL, Seed-Skripte |
| **Designs** | Figma-Files, Wireframes, Mockups, Prototypen, Brand-Assets (Logo, Farbpalette, Typografie, falls im Projekt entwickelt) |
| **Dokumentation** | ADRs, RFCs, API-Dokumentation, Runbooks, Onboarding-Materialien, Customer-Success-Playbooks |
| **Konfigurationen** | CI/CD-Pipelines, Infrastructure-as-Code (Terraform/Pulumi), Deployment-Configs, Secrets-Templates (ohne tatsächliche Secrets) |
| **Tests** | Alle Unit-, Integration-, E2E- und Property-Based-Tests |
| **Generative Inhalte** | KI-generierte Texte, Bilder, Vorlagen, sofern speziell für dieses Projekt erstellt |

## § 3 Umfang der Übertragung

(1) Die Übertragung erfolgt **vollständig, ausschließlich, zeitlich und räumlich unbeschränkt**.

(2) Übertragen werden insbesondere:

- alle Nutzungsrechte einschließlich Bearbeitungs-, Übersetzungs-, Vervielfältigungs-, Verbreitungs-, Vorführungs-, Sende-, Online-Zurverfügungstellungs- und Vermarktungsrechte
- das Recht, die Werke zu modifizieren, zu erweitern, zu kombinieren und in andere Werke einzubinden
- das Recht, die Werke kommerziell zu verwerten, zu lizenzieren oder weiterzuverkaufen
- das Recht, Sub-Lizenzen zu vergeben
- Eigentum an allen physischen und digitalen Datenträgern, auf denen die Werke verkörpert sind

(3) Soweit gesetzliche Beschränkungen der Übertragbarkeit bestehen (z. B. Urheberpersönlichkeitsrechte), räumt Korynth Labs dir vollumfängliche, ausschließliche und übertragbare Nutzungsrechte ein.

(4) Korynth Labs verzichtet — soweit gesetzlich zulässig — auf eine Nennung als Urheber.

## § 4 Zeitpunkt der Übertragung

(1) Die Übertragung der IP-Rechte erfolgt **mit vollständiger Zahlung des jeweiligen Meilensteins** des zugrundeliegenden SOW.

(2) Bis zur vollständigen Zahlung räumt Korynth Labs dir ein widerrufliches, nicht exklusives Nutzungsrecht zum Zweck der Begutachtung und Tests ein.

(3) Nach vollständiger Zahlung des letzten Meilensteins (Release v1.0, M10) sind sämtliche IP-Rechte vollständig und endgültig auf dich übertragen.

## § 5 Rückbehaltene Rechte von Korynth Labs

(1) Korynth Labs behält das nicht-ausschließliche, übertragbare, kostenfreie Recht, folgende **generische** Elemente in anderen Projekten zu verwenden:

- allgemeine **Patterns und Methoden** (z. B. „Slot-Engine-Algorithmus als Pattern" — nicht deine konkrete Implementation)
- **Bibliotheken und Frameworks**, die ausdrücklich als wiederverwendbar gekennzeichnet sind (siehe § 5 Abs. 3)
- **Knowledge-Graph-Lerninhalte** in anonymisierter Form (gemäß CLAUDE.md §32)
- **Postmortem-Lerninhalte** in anonymisierter Form

(2) Korynth Labs darf **nicht** verwenden:

- deine konkrete Implementation (Code-Identifikatoren, Geschäftslogik, Datenmodell-Details)
- deine Marke, dein Logo, deinen Plattformnamen
- deine Kundendaten oder Daten der Endkunden
- deine Brand-Assets

(3) Eine Code-Komponente gilt als **wiederverwendbar**, wenn sie:

- (a) in einem separaten Repository unter MIT- oder Apache-2.0-Lizenz veröffentlicht wird, **oder**
- (b) ausdrücklich im Code als generisch markiert ist (Header-Kommentar mit `@reusable`-Annotation), **und**
- (c) keine projekt-spezifischen Geschäftslogiken enthält

Eine Liste konkret wiederverwendbarer Komponenten wird im Projekt-Wiki gepflegt und ist dir jederzeit einsehbar.

## § 6 Marke, Domains, Drittanbieter-Konten

(1) **Plattform-Marke / Logo / Name**: gehören dir. Korynth Labs kann dich auf Wunsch und gegen separate Beauftragung bei der Markenanmeldung (DPMA) unterstützen.

(2) **Domains**: werden auf deinen Namen registriert oder unverzüglich nach Anmeldung auf dich übertragen.

(3) **Drittanbieter-Konten** (Supabase, Vercel, Stripe, Resend, Sentry, etc.): wir richten sie auf deinen Namen ein bzw. mit deiner Email als Eigentümer-Account. Korynth Labs erhält Administrator-Zugang, kein Eigentum.

(4) **Plattform-Daten** (Endkunden, Buchungen, Salon-Stammdaten): jederzeit ausschließlich dein Eigentum.

## § 7 Garantien und Gewährleistung

(1) Korynth Labs garantiert:

- alle übertragenen Werke wurden eigenständig erstellt oder mit dokumentierten Rechten von Dritten erworben
- es bestehen keine Rechte Dritter, die der Übertragung entgegenstehen
- bei Verwendung von Open-Source-Komponenten werden die Lizenzbedingungen eingehalten und in `LICENSES.md` dokumentiert
- KI-generierte Inhalte sind durch unsere Richtlinien und Lizenzen abgedeckt (Anthropic Commercial Use, OpenAI Commercial Use, etc.)

(2) Sollte ein Dritter Ansprüche gegen dich aus angeblichen IP-Rechtsverletzungen geltend machen, stellt Korynth Labs dich von berechtigten Ansprüchen frei (Freistellung gemäß § 7 MSA Haftung).

## § 8 Open-Source-Komponenten

(1) Eine vollständige Liste aller verwendeten Open-Source-Bibliotheken mit Lizenzen wird im Projekt-Root unter `LICENSES.md` gepflegt.

(2) Nur Lizenzen aus der folgenden Whitelist sind zulässig (ohne deine separate Freigabe):

- MIT
- Apache 2.0
- BSD-2/3-Clause
- ISC
- Mozilla Public License 2.0 (mit Dokumentation)

(3) GPL, AGPL, SSPL und andere Copyleft-Lizenzen werden **nicht** verwendet, außer bei deiner ausdrücklichen schriftlichen Freigabe.

## § 9 Schlussbestimmungen

(1) Diese Vereinbarung ergänzt das MSA und ist Anlage 3 zum MSA.
(2) Bei Konflikten zwischen MSA und dieser IP-Assignment-Vereinbarung hat letztere Vorrang.
(3) Es gilt deutsches Recht. Gerichtsstand: Stuttgart.

---

## Unterschriften

Stuttgart, **2026-05-13** (Sim-Tag 1)

Auftraggeber (IP-Empfänger):  ✅ **UNTERSCHRIEBEN** — Belkis Aslani
                              Anwaltlich geprüft. IP-Empfang formell angenommen.

Auftragnehmer (IP-Geber):     ✅ **UNTERSCHRIEBEN** — Lina Bergmann, CEO Korynth Labs (#001)
                              IP-Übertragung gemäß § 4 (Zeitpunkt mit Zahlung) ausdrücklich zugesagt.

**Vertrag rechtskräftig ab:** 2026-05-13. IP-Übertragung erfolgt pro Meilenstein mit Zahlungseingang.

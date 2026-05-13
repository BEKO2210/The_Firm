# Verzeichnis der Verarbeitungstätigkeiten (VVT) — Korynth Labs

> Per DSGVO Art. 30. Updated whenever a new processing activity is added or changed.
> Maintained by DPO. Audited annually.

## Verantwortlicher

- **Name:** Korynth Labs (im Aufbau)
- **Anschrift:** Stuttgart / Ludwigsburg, Baden-Württemberg, Deutschland
- **Vertreter:** Belkis Aslani (Principal / Geschäftsführer)
- **Datenschutzbeauftragter:** (zugewiesen — DPO Subagent, gemappt auf Mitarbeiter Id 017)

## Verarbeitungstätigkeiten

### VVT-001 · Mitarbeiterverwaltung

- **Zweck:** Verwaltung des Beschäftigungsverhältnisses, Lohnabrechnung, Performance-Reviews.
- **Betroffene:** 50 Mitarbeiter (Day 1 Stand).
- **Datenkategorien:** Name, Kontaktdaten, Bankverbindung, Sozialversicherungsnummer, Gehaltsdaten, Performance-Ratings.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b (Vertrag), § 26 BDSG.
- **Empfänger:** Lohnsteueramt, Krankenkassen, Sozialversicherungsträger, Berufsgenossenschaft.
- **Speicherdauer:** 10 Jahre nach Beendigung (HGB/AO).
- **TOMs:** Verschlüsselte Datenbank, Rollen-basierter Zugriff, MFA, Audit-Log.

### VVT-002 · Kundenkommunikation (Principal)

- **Zweck:** Kommunikation mit dem Principal (Belkis Aslani) via Email-Client.
- **Betroffene:** 1 (Principal).
- **Datenkategorien:** Email-Adresse, Inhalt der Kommunikation, ggf. übermittelte Briefs/Dateien.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b (Vertrag).
- **Empfänger:** keine (internal-only).
- **Speicherdauer:** 6 Jahre (kfm. Aufbewahrungspflicht).
- **TOMs:** Lokale Speicherung, Hash-Chain Audit-Log, Backup-Verschlüsselung.

### VVT-003 · Audit-Trail / Logs

- **Zweck:** Forensische Nachvollziehbarkeit aller Firmenoperationen (CLAUDE.md §15).
- **Betroffene:** Mitarbeiter, Principal, ggf. zukünftige Kunden.
- **Datenkategorien:** Aktionen mit Zeitstempel, Hash-verkettet.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. c (rechtliche Verpflichtung) + lit. f (berechtigtes Interesse).
- **Speicherdauer:** unbefristet (für Audit-Zwecke), aber pseudonymisiert nach 7 Jahren.
- **TOMs:** Append-only, SHA-256 Hash-Chain, unveränderlich.

### VVT-004 · KI-Sub-Auftragsverarbeitung (Anthropic, OpenAI etc.)

- **Zweck:** Nutzung von LLMs für interne Operationen.
- **Betroffene:** alle, deren Daten in Prompts auftauchen können.
- **Datenkategorien:** Prompt-Inhalte (Texte, ggf. Code).
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f (berechtigtes Interesse), DSFA-Bewertung dokumentiert.
- **Auftragsverarbeiter:**
  - Anthropic PBC (USA) — AVV: TBD (Day 1 — abzuschließen vor erstem Kundenticket)
  - OpenAI Inc. (USA) — AVV: TBD
  - HuggingFace (FR) — Standard AVV (innerhalb EU)
- **Speicherdauer beim Verarbeiter:** gemäß deren Policies (Anthropic: zero-retention via API mit ZDR-Setting).
- **TOMs:** Datenminimierung (kein Kunden-PII in Prompts ohne Pseudonymisierung), keine Trainingsverwendung (per AVV).

---

*Maintained by DPO. Next review: Day 365 (annual). Material changes trigger immediate update + audit-log entry.*

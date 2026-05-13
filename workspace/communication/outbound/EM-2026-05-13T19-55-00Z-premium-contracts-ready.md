---
email_id: "EM-2026-05-13T19-55-00Z-premium-contracts-ready"
thread_id: "TH-TCK-20260513-0001"
direction: "outbound"
from: "Priya Sharma <priya.sharma@korynth-labs.internal>"
from_role: "Account Manager (#021)"
to: "Belkis Aslani <belkis.aslani@gmail.com>"
cc:
  - "Jonas Weber (CTO) <jonas.weber@korynth-labs.internal>"
  - "Mira Lundberg (Discovery Lead) <mira.lundberg@korynth-labs.internal>"
  - "Niko Korhonen (CFO) <niko.korhonen@korynth-labs.internal>"
  - "Yasmin El-Sayed (DPO) <yasmin.el-sayed@korynth-labs.internal>"
in_reply_to: "EM-2026-05-13T19-45-00Z-principal-go-premium"
subject: "Premium MVP — Vertragspaket bereit zur Prüfung (TCK-20260513-0001)"
ticket: "TCK-20260513-0001"
real: "2026-05-13T19:55:00Z"
sim:  "Day 1, 15:00 (Sprint 1 · Q1 2026)"
status: "sent"
priority: "high"
type: "contract-drafts-delivery"
language: "de"
awaiting_reply: true
---

Hallo Belkis,

vielen Dank für dein klares Go zur **Premium-MVP-Variante** und für die ausführliche Liste deiner 10 Bedingungen. Wir haben alles eingearbeitet und legen dir hiermit das **vollständige Vertragspaket** zur Prüfung vor.

## 📁 Was ab sofort im Repo liegt

Alle Vertragsdokumente unter `legal/contracts/per-ticket-contracts/TCK-20260513-0001/`:

| Datei | Inhalt | Status |
|-------|--------|:------:|
| `00-MSA.md` | Rahmenvertrag · alle Grundsätze, Haftung, IP-Grundsatz, Anti-Pattern-Bekenntnis | DRAFT |
| `01-SOW-001-Premium-MVP.md` | **Hauptdokument**: Scope, Phasen, 10 Meilensteine mit Zahlungsplan, Abnahmekriterien, App-Readiness-Garantien | DRAFT |
| `02-DPA.md` | Auftragsverarbeitungsvereinbarung nach DSGVO Art. 28: TOMs, Subprocessors, 24h-Meldung bei Datenpannen | DRAFT |
| `03-IP-Assignment.md` | IP-Übertragung: Code, Designs, Marke = vollständig deins ab Zahlung; klare Abgrenzung zu generischen Patterns | DRAFT |
| `04-Maintenance-Agreement.md` | Separater Wartungsvertrag €12k/Monat, SLA 99,9 %, Incident-Klassen P0–P3, 8 Inkremente/Monat inklusive | DRAFT |
| `05-Subprocessors-and-Data-Residency.md` | 6 aktive Subprocessors (alle EU-Region), Schrems-II-Mitigations, EU-only-Alternativen | DRAFT |
| `06-Security-and-Testing-Concept.md` | OWASP-Mitigations, Test-Pyramide, Pen-Test, DR-Strategie, EU-AI-Act-Compliance | DRAFT |
| `07-Slot-Engine-Final-Spec.md` | **Kritisches Modul**: Algorithmus, SQL mit GIST EXCLUDE, Race-Condition-Beweis, Test-Plan | DRAFT |
| `08-Data-Model-and-Roles.md` | ER-Diagramm, Schlüssel-Tabellen mit DDL, Multi-Tenancy via RLS, vollständige Rechtematrix | DRAFT |

> ⚠️ Hinweis (gemäß CLAUDE.md §28): Alle Vertragsdokumente wurden **durch KI erstellt**. Wir empfehlen ausdrücklich, sie vor Unterzeichnung durch deinen Anwalt prüfen zu lassen. Korynth Labs ist kein Rechtsdienstleister.

## ✅ Wie wir deine 10 Bedingungen umgesetzt haben

| # | Deine Bedingung | Wo im Vertrag verankert |
|---|------------------|--------------------------|
| 1 | Kein Spend außerhalb Cap ohne Freigabe | MSA § 3 (3); SOW § 5 (Anti-Surprise-Klausel, Cap-Nutzung > €5k = explizit Freigabe) |
| 2 | Kein automatischer Start von Phase 2 | SOW § 3.2 ("Korynth Labs startet Phase 2 **nicht automatisch**"); Maintenance § 3 (größere Features = neues SOW) |
| 3 | Folgefeatures vorbereitet, aber nicht ohne Freigabe umgesetzt | SOW § 11 App-Readiness-Garantien (Daten-Schema vorbereitet, kein Live-Feature) |
| 4 | IP gehört dir | IP-Assignment §§ 1–4 (vollständige, ausschließliche, unbeschränkte Übertragung mit Zahlung) |
| 5 | Zahlung nach Meilenstein | SOW § 5 (10 Meilensteine mit %-Anteilen, 14 Tage netto) |
| 6 | Slot-Engine gegen Doppelbuchung gehärtet | Slot-Engine-Final-Spec §§ 2–5; GIST EXCLUDE Constraint auf DB-Ebene + Property-Tests + 10k-Concurrent-Lasttest |
| 7 | DSGVO, AVV, Backups, Mandantentrennung, Löschung dokumentiert | DPA §§ 6–9; Subprocessor-Liste; Security-Konzept §§ 7–8 |
| 8 | Wöchentlicher Status + 60–90 min Slot | MSA § 2 (3); Donnerstag 12:00 Briefing-Doc, Slot fest |
| 9 | Entscheidungsgrundlage vor Meilensteinen | MSA § 2; SOW § 9 (Wöchentliches Briefing-Doc, Sprint-Reports, Demo-Videos) |
| 10 | Echte SaaS-Basis, kein Wegwerf-Prototyp | SOW § 3.1 (28 Punkte Premium-Scope inkl. App-Readiness + voller Compliance + Pen-Test); SOW § 11 (App-Readiness-Garantien auditiert in Harden-Phase) |

## 💰 Kommerzielle Eckdaten

| Position | Betrag (netto, zzgl. USt.) |
|----------|---------------------------:|
| Discovery | €40.000 (bereits geleistet, ohne Rechnung bisher) |
| Design | €60.000 |
| Build MVP (T&M mit Cap) | Ziel €280.000 · Cap €350.000 |
| Harden | €35.000 |
| Release v1.0 | inkludiert in vorigen Meilensteinen |
| **Summe MVP** | **Ziel €415.000 · Cap €485.000** |
| Maintenance ab Release | €12.000 / Monat, separate Vereinbarung |

10 Meilensteine mit klarem Zahlungsplan in SOW § 5. Jede Cap-Nutzung > €5.000 erfordert deine schriftliche Freigabe.

## 🛡️ App-Readiness-Garantien (gemäß deiner Klarstellung)

In SOW § 11 ausdrücklich verankert. Am Ende des Premium MVP wird auditiert + im Release-Manifest dokumentiert:

- ✅ Alle Backend-APIs identisch von Web, iOS und Android nutzbar
- ✅ Auth + Rollen-System mobile-tauglich (JWT + Refresh-Tokens)
- ✅ Code-Struktur (`apps/web` + `packages/core`) bereit für `apps/mobile` mit Expo
- ✅ Push-Notification-Datenschema vorbereitet (Tabelle, Worker-Hook)
- ✅ Payment-Abstraktion vorbereitet (`payment_provider`-Spalte, `IPayment`-Interface)

Apps werden in **Phase 2** umgesetzt — nur mit deiner separaten Freigabe und neuem SOW. Wir bauen dir die MVP-Plattform aber so, dass dieser Wechsel ohne Refactoring möglich ist.

## 📅 Was als Nächstes passiert

| Sim-Tag | Aktion | Wer |
|---------|--------|-----|
| **jetzt** | Du prüfst die 9 Vertragsdokumente (idealerweise mit deinem Anwalt) | du |
| **+1–5 Tage** | Du gibst Rückfragen / Änderungswünsche zurück (oder direkt grünes Licht) | du |
| **Day 7 sim** | **M1 — Verträge unterschrieben** → Discovery offiziell abgeschlossen, Design startet | beide |
| Day 8–35 | Design-Phase (ADRs, DDL, finale Slot-Engine-Spec, UI-Wireframes, DPIA) | wir |
| Day 35 | **M2 — Design abgenommen** | du + uns |
| Day 36+ | Build startet (Sprint 1) | wir |

## 🔁 Falls du Änderungen brauchst

Schreib uns einfach zurück (Email oder eine .md-Datei in `workspace/communication/inbox/`). Wir machen V2 der Dokumente innerhalb von 24–48 Sim-Stunden. Häufige Anpassungsthemen:

- Haftungssumme (aktuell: 100 % des SOW-Auftragsvolumens pro Jahr)
- Zahlungsmeilenstein-Verteilung (aktuell: 12% / 13% / 10% / 15% / 10% / 10% / 10% / 7% / 8% / 5%)
- Mindestlaufzeit Maintenance (aktuell: 12 Monate, danach quartalsweise)
- Datenresidenz-Wahl (Default: Supabase Frankfurt; Alternative EU-only +€30–45k, +2 Wochen)

## ⚖️ Vor formellem Sign-off — unsere Empfehlung

1. Lass die Drafts von einer Anwaltskanzlei mit IT-Recht-Schwerpunkt prüfen (Stuttgart hat mehrere gute, gerne Empfehlungen).
2. Validiere die DSGVO-Auftragsverarbeitung gegen deine spezifische geplante Datenverarbeitung.
3. Wenn du eine Versicherung gegen Cyber-Risiken / Haftpflicht hast, lass die Beträge mit deinem Versicherer abgleichen.
4. Wenn du einen Wirtschaftsprüfer hast, lass die Zahlungsplan-Struktur kurz gegenchecken (Cashflow).

Sobald du grünes Licht gibst (signierte Verträge oder schriftliche Bestätigung), starten wir **direkt am nächsten Sim-Tag** in die Design-Phase.

Bis dahin sind keine weiteren Kosten für dich entstanden — die bereits geleistete Discovery-Arbeit ist Teil des ersten Meilensteins (M1) und wird mit Sign-off in Rechnung gestellt.

Wir freuen uns darauf, dieses Projekt **professionell und hochwertig** mit dir aufzubauen.

Mit besten Grüßen
**Priya Sharma**
Account Manager · Korynth Labs

CC: Jonas Weber (CTO), Mira Lundberg (Discovery Lead), Niko Korhonen (CFO), Yasmin El-Sayed (DPO)

---

*Ticket: TCK-20260513-0001 · Premium MVP · 9 Vertragsdokumente zur Prüfung*
*Audit-Log seq 9 — 12 (chain intact, alles dokumentiert)*
*Status: awaiting principal signature / approval*

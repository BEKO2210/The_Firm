# Firma OS · Design Rationale

> Warum dieses System existiert, welche Prinzipien es trägt, und warum es so klein ist.

---

## Die Aufgabe

Eine Einzelperson — Designer, Entwicklerin, Beraterin, oder Hybrid — will mit KI-Unterstützung ein Software-Geschäft betreiben. Sie braucht:

- Übersicht über echte Kunden, Tickets, Mails, Aufgaben
- Klarheit, wo Geld real ist und wo es Planung ist
- Werkzeuge, die ohne Schulung bedienbar sind
- Sicherheits-Garantien, damit kein Agent eigenmächtig in ihrem Namen handelt
- Kostenkontrolle bei KI-Tokens
- Eine Plattform, die mit ihr wächst

Firma OS ist die Antwort.

---

## Die 10 Leitprinzipien

### 1. Ehrlichkeit über Theater

Daten sind entweder **real** (mit Beleg, API-Sync, Quittung) oder **forecast** (klar als Plan markiert). Sie werden niemals vermischt. Es gibt keinen fiktiven Bankstand, keine simulierten Mitarbeiter, keinen Sim-Tag, der als Real-Tag verkleidet wird.

### 2. Dashboard ist die Wahrheit

Wer das System nutzt, klickt — schreibt nicht. CLI ist Backup für Power-User. Chat ist für echte Entscheidungen reserviert, nicht für State-Wiederholungen.

### 3. Einfachheit für Nicht-Techniker

Eine Person ohne GitHub-, Markdown- oder Terminal-Kenntnisse muss innerhalb von 10 Minuten verstehen:
- Was läuft gerade
- Was ist heute zu tun
- Wo muss ich entscheiden
- Wie generiere ich ein Angebot

### 4. Markdown nur für Lesbares

Zustand lebt in JSON/YAML. Markdown ist Output, nicht Quelle. Damit ist sicher: ein Report kann jederzeit neu gerendert werden, ohne Wissen zu verlieren.

### 5. Externe Aktionen brauchen Approval

Hard-Stop-Rule: Kein externer Kontakt, kein Outreach, keine Domainregistrierung, kein Toolkauf, keine neue Ausgabe und keine Kommunikation im Namen des Inhabers ohne vorherige schriftliche Freigabe. Verstöße werden auditiert, eskaliert, korrigiert.

### 6. Token-Budget pro Run

Jede KI-Operation hat ein Budget. Default 4.000 Tokens, Hard-Cap 15.000. Bei 80% warnt der Agent und fragt nach. Sparsamkeit ist eine Default-Eigenschaft, kein nachträglicher Wunsch.

### 7. Single-Agent-Default, Multi-Agent on demand

Bei niedrigem Volumen reicht 1 Agent. Multi-Agent-Setups kommen erst, wenn echtes Volumen das rechtfertigt. Komplexität wird nicht vorzeitig eingebaut.

### 8. Reversibilität und Rollback

Alles kann zurückgerollt werden. Jeder Schritt hat einen klaren Vorher-Zustand im Audit-Log. Migrationen erzeugen Backups bevor sie schreiben.

### 9. Reale Wirtschaftlichkeit

Pricing-Pakete sind so kalibriert, dass der Inhaber echtes Geld verdient. Stundenrechnungen, Marge-Targets und Lebenshaltungs-Schwellen sind explizit dokumentiert.

### 10. Repo-Hygiene

Jede neue Datei muss einen klaren Zweck haben. Keine Boilerplate-Mehrfach-Speicherung. Markdown unter 500 Zeilen. State-JSON unter 100 Zeilen. Repo unter 200 MB. Wenn das System wächst, muss es kürzer werden, nicht länger.

---

## Architektur in 60 Sekunden

```
                          ┌──────────────────────────┐
                          │   DASHBOARD (Next.js)     │
                          │   localhost:3000          │
                          └────────────┬─────────────┘
                                       │
                                       ▼
                          ┌──────────────────────────┐
                          │   .firma/ (state truth)   │
                          │   state.json · config     │
                          │   inbox · tickets         │
                          │   customers · finance     │
                          │   approvals · agents      │
                          │   audit · reports         │
                          └────────────┬─────────────┘
                                       │
                                       ▼
                          ┌──────────────────────────┐
                          │   CLI · firma <command>   │
                          │   start · status · run    │
                          │   triage · plan · audit   │
                          │   report · test · token   │
                          └──────────────────────────┘
```

Volle Architektur: [ARCHITECTURE.md](ARCHITECTURE.md).

---

## Was Firma OS nicht ist

- **Kein Multi-Tenant-SaaS** — du bist der einzige Nutzer. Wenn du eine Multi-Tenant-Plattform an Kunden verkaufst, ist das **dein Produkt**, das du **mit Firma OS** baust — nicht Firma OS selbst.
- **Kein Enterprise-Audit-Framework.** Audit-Log ist hash-chained, aber für persönliche Nachvollziehbarkeit, nicht für SOC 2.
- **Kein Auto-Pilot.** Externe Aktionen brauchen immer eine menschliche Freigabe. Niemals werden Mails ohne Klick verschickt.
- **Kein Chat-Loop.** Status kommt aus dem Dashboard oder `firma status`.

---

## Erfolg im ersten Quartal

Für die ersten 90 Tage definierter Erfolg:

| Metrik | Ziel |
|--------|-----:|
| Erstes echtes Angebot-PDF generiert | Tag 14 |
| Erster Cold-Outreach-Versand (nach Approval) | Tag 21 |
| Erstes signiertes Engagement | Tag 30–45 |
| Erste reale Rechnung (Stripe) | Tag 45–60 |
| Erster Pilot-Kunde live | Tag 60–90 |
| Repo-Größe | < 200 MB |
| Tokens pro Routine-Operation | < 4.000 |
| Onboarding-Zeit für Nicht-Techniker | < 10 Min |

Detail: [ROADMAP.md](ROADMAP.md), [TESTING.md](TESTING.md).

---

## Wo Tools helfen

| Tool | Wofür | Priorität |
|------|-------|:---------:|
| [PDFCraft](https://github.com/PDFCraftTool/pdfcraft) | Angebot-, Rechnungs-, Status-PDFs | **P0** |
| [rtk-ai/rtk](https://github.com/rtk-ai/rtk) | Token-Verbrauch reduzieren | P1 |
| [graphify](https://github.com/safishamsi/graphify) | Beziehungs-Visualisierung im Dashboard | P1 |
| [Ruflo](https://github.com/ruvnet/ruflo) | Multi-Agent (bei Volumen) | P2 |
| [agent-browser](https://github.com/vercel-labs/agent-browser) | UI-Smoke-Tests | P2 |

Vollständige Bewertung: [TOOL_RECOMMENDATIONS.md](TOOL_RECOMMENDATIONS.md).

---

## Lizenz

**Proprietär · Alle Rechte vorbehalten · © 2026 Belkis Aslani.**

Firma OS ist kein Open-Source-Projekt. Es ist kommerzielles Eigentum der Inhaberin. Nutzung, Modifikation, Verbreitung oder kommerzielle Verwendung nur mit ausdrücklicher schriftlicher Genehmigung.

Für Lizenz-Anfragen: belkis.aslani@gmail.com.

---

*Diese Datei sagt warum. ARCHITECTURE.md sagt wie. ROADMAP.md sagt wann.*

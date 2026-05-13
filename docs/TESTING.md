# Test & Benchmark Plan

Konkrete Tests, an denen der Erfolg von Firma OS v0.1 gemessen wird.

## Test-Kategorien

| Kategorie | Was gemessen wird | Ziel |
|-----------|-------------------|------|
| Onboarding | Verständlichkeit für Nicht-Techniker | < 10 min bis erste Aktion |
| Token | Token-Verbrauch pro Operation | -60% gegenüber Ist-Zustand |
| Workflow | Schritte von Lead → Angebot → Vertrag | < 5 manuelle Schritte |
| Dashboard | Lädt korrekt, zeigt echte Daten | 100% Real-Sim-Trennung |
| Agent | Korrekter Output, Budget eingehalten | 100% |
| Finance | Real vs Sim sauber getrennt | 0 Vermischungen |
| Safety | Externe Aktionen geblockt | 100% blockiert ohne Approval |

---

## 1. Onboarding-Benchmark

**Test:** Eine Person, die noch nie mit dem System gearbeitet hat, bekommt nur `README.md` + `CLAUDE.md` und das Dashboard.

**Erfolg:** Nach 10 Minuten kann die Person:

- erklären, was Firma OS tut (1 Satz)
- öffnen, wo offene Entscheidungen liegen (`/approvals`)
- starten, was heute zu tun ist (`/` Home Wizard)
- 1 Aktion durchführen (z.B. Lead-Triage)

**Messung:** Stoppuhr + Beobachtung.

**Acceptance:** 4/4 erfolgreich.

---

## 2. Token-Benchmark

### 2.1 Token pro `weiter`-äquivalentem Run

| Metrik | Heute | Ziel | Test-Methode |
|--------|------:|-----:|--------------|
| Tokens In | ~8.000 | ~3.000 | API-Logs prüfen |
| Tokens Out | ~2.500 | ~1.000 | API-Logs prüfen |
| **Total** | **~10.500** | **~4.000** | Summe |

**Test-Script:** `firma test token-benchmark`

**Acceptance:** Total < 5.000 für einen Routine-Status-Update.

### 2.2 Token pro Session-Start

| Metrik | Heute | Ziel |
|--------|------:|-----:|
| CLAUDE.md geladen | ~25.000 (2511 Zeilen × ~10 Tokens/Zeile) | ~2.500 (250 Zeilen) |

**Test:** Erste Token-Reads bei Session-Start messen.

**Acceptance:** < 5.000 Tokens.

### 2.3 Tokens pro Agent-Run

| Agent | Heute | Ziel |
|-------|------:|-----:|
| Auditor (full repo) | n/a | < 30.000 |
| Pricing-Review | n/a | < 15.000 |
| Token-Report | n/a | < 5.000 |

---

## 3. Workflow-Benchmark

### 3.1 Lead → Erstes Angebot

**Schritte heute:**
1. Mail kommt rein
2. `/firma`
3. Discovery v1
4. Discovery v2 (drei Varianten + 10 Pre-Sign-Off-Docs)
5. Verträge ausarbeiten
6. PDFs noch nicht generiert
→ **6+ Schritte, 0 PDFs**

**Schritte mit Firma OS v0.1:**
1. Mail in `inbox/` (automatisch erkannt)
2. `firma triage <mail>` → Ticket
3. `firma report quote --template salon-website --customer X`
4. PDF generiert → in `/approvals`
5. Belkis approved → Versand
→ **5 Schritte, 1 PDF**

**Acceptance:** Workflow ≤ 5 Schritte + mind. 1 verkaufbares Artefakt.

### 3.2 Status-Check „wie geht es mir gerade?"

**Heute:** lange Mail mit „weiter" → ~10.000 Tokens, 30 Sekunden Lesezeit.

**Ziel:** `firma status` → 1 Zeile, 0 Tokens (CLI-only).

**Acceptance:** Status in < 5 Sekunden lesbar.

---

## 4. Dashboard-Benchmark

### 4.1 Funktional

- [ ] Dashboard startet via `firma start` ohne Fehler
- [ ] Lädt < 2 Sekunden
- [ ] Zeigt korrekte `real.*` Werte (oder „nicht angebunden")
- [ ] Zeigt `sim.*` mit großem Banner
- [ ] Mobile-View funktioniert (Test auf 375px Breite)
- [ ] Approvals sichtbar
- [ ] Token-Gauge korrekt

### 4.2 Real/Sim-Trennung

**Test:** Belkis öffnet `/finance/real`. **Erwartung:** Bank-Stand = „kein Konto angebunden" (weil real null ist).

**Test:** Belkis öffnet `/finance/forecast`. **Erwartung:** Großer Banner „PLAN-DATEN".

**Acceptance:** keine Verwirrung zwischen real und sim auf irgendeiner Seite.

---

## 5. Agent-Benchmark

**Test 1:** `firma run auditor` mit `--budget 30000`

- Output: `docs/firma-os-audit/<date>-audit.md`
- Token-Verbrauch < 30.000
- Liefert valides Markdown

**Test 2:** `firma run pricing` mit `--budget 15000`

- Output: aktualisiertes `docs/firma-os-audit/PRICING_PLAYBOOK.md`
- Token-Verbrauch < 15.000

**Test 3:** Doppel-Run-Konsistenz: `firma run auditor` zweimal hintereinander → identische oder konvergente Outputs.

**Acceptance:** alle 3 Tests grün.

---

## 6. Finance-Benchmark

### 6.1 Sim/Real-Trennung

**Test:** `firma status --finance`

**Erwartet:**
```
REAL:
  Bank: kein Konto angebunden
  Revenue this month: €0
  Costs this month: €0 (kein Stripe synced, keine Expenses)
  
FORECAST (Plan-Daten — KEIN echtes Geld):
  Month 1 plan: €0
  Month 3 plan: €5.000
  Month 12 plan: €20.000
```

**Acceptance:** klare visuelle + textuelle Trennung. Kein einziger €-Betrag ohne `real:` oder `(plan)` Label.

### 6.2 Unprofitable Angebote erkennen

**Test:** Belkis lässt ein Angebot generieren für €500 Aufwand 40h.

**Erwartet:** Warnung: „Stundensatz nur €12,50 — unter Lebenshaltungs-Schwelle". Empfehlung höherer Preis oder Scope-Reduktion.

---

## 7. Safety-Benchmark

### 7.1 Externe Aktionen geblockt

**Test:** Agent versucht Email zu versenden ohne Approval.

**Erwartet:** Blockiert → erzeugt `.firma/approvals/pending/<id>.yaml` → wartet.

### 7.2 Domain-Registrierung geblockt

**Test:** `firma domain register salonio.de` ohne Approval.

**Erwartet:** Blockiert mit Hinweis auf Approval-Flow.

### 7.3 Tool-Subscription-Kauf geblockt

**Test:** Agent will Toolschauf machen → muss Approval-Eintrag erzeugen.

**Erwartet:** Blockiert.

**Acceptance:** 3/3 Tests blockieren korrekt.

---

## 8. Audit-Log-Integrity-Benchmark

**Test:** Audit-Chain end-to-end verifizieren.

```bash
firma audit verify-chain
```

**Erwartet:** ✓ chain intact, N entries, alle hash-konsistent.

**Acceptance:** 100% verifiziert.

---

## 9. Repo-Größe-Benchmark

**Test:** `du -sh .` nach Migration.

| Metrik | Heute | Ziel |
|--------|------:|-----:|
| Repo gesamt | 530 MB | < 200 MB |
| Markdown-Dateien | 375 | < 50 |
| Lines of Markdown | 20.400 | < 5.000 |

**Acceptance:** alle 3 Ziele erfüllt.

---

## 10. Belkis-Acceptance-Test

**Fragen, die Belkis selbst beantworten soll:**

- [ ] Kann ich jetzt einen Lead in ein Angebot überführen, ohne Hilfe? (Ziel: ja)
- [ ] Sehe ich klar, was real ist vs simuliert? (Ziel: ja)
- [ ] Bin ich zuversichtlicher, dass ich damit Geld verdienen kann? (Ziel: ja)
- [ ] Würde ich das System weiterempfehlen? (Ziel: ja)

---

## Wie diese Tests integriert sind

```bash
firma test                 # alle Tests ausführen
firma test onboarding      # nur Onboarding-Test
firma test tokens          # nur Token-Benchmark
firma test workflow        # nur Workflow-Benchmark
firma test safety          # nur Safety-Benchmark
```

Output: `.firma/tests/<date>-results.json` + Konsolen-Ausgabe.

CI-Integration (GitHub Actions): bei jedem Push auf `main` → Smoke-Test ausführen.

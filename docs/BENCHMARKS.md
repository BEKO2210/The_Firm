# Benchmarks · Firma OS

> Echte, reproduzierbare Zahlen — keine Marketing-Claims.
> Pflicht-Standard: jede Tool-Integration muss mit einem Benchmark + Methodik dokumentiert sein.

---

## Methodik (Pflicht-Standard für alle Benchmarks)

| Aspekt | Standard | Begründung |
|--------|----------|------------|
| **Tokenizer** | `tiktoken` (`cl100k_base`, OpenAI GPT-4) | Industrie-Referenz, MIT-Lizenz, deterministisch |
| **Workload** | Fixe Command-Liste, im Benchmark-Source hartcodiert | Reproduzierbarkeit, kein Cherry-Picking pro Run |
| **Vergleich** | A/B (control vs treatment), identische cwd + env | Differenzielle Messung statt absoluter Zahlen |
| **Runs** | 3 warmup + 5 measured, Wall-Clock als p50 + p99 | Warmup gleicht Page-Cache an; Median statt Mean |
| **Output** | JSON + Markdown unter `.firma/benchmarks/<ts>/` | Auditierbar; raw + filtered Outputs als Belege |
| **Quellen** | Repo-State (Commit-Hash) + rtk-Version + Node-Version im JSON | Vollständige Provenance |

Wer behauptet, ein Tool spare X %, **muss diese Methodik anwenden** oder die Behauptung als unbelegt kennzeichnen.

---

## Benchmark 1 · rtk-ai vs raw command output

**Ziel:** belegt 60–90 %-Token-Reduktion aus [rtk's README](https://github.com/rtk-ai/rtk) auf unserem realen Workload?

**Harness:** `scripts/firma/benchmarks/rtk-vs-raw.mjs` · Run: `npm run bench:rtk`

### Ergebnis (Run 2026-05-13)

- **rtk-Version:** 0.34.3 (Rust binary, lokal gebaut via `scripts/firma/setup/install-rtk.sh`)
- **Repo:** `claude/read-claude-md-IcJBG` @ `40c9c63`
- **Tokenizer:** `tiktoken cl100k_base`

| Command | raw tok | rtk tok | Δ tok | raw KB | rtk KB | raw p50 ms | rtk p50 ms |
|---------|--------:|--------:|------:|-------:|-------:|-----------:|-----------:|
| `git status`                 |     96 |     55 |  **-42.7 %** |  0.3 |  0.2 |   5.4 |  16.9 |
| `git log -20 --oneline`      |    528 |    520 |   -1.5 %     |  1.6 |  1.6 |   5.9 |  14.9 |
| `git diff HEAD~3..HEAD --stat` | 9 735 | 9 735 |    0.0 %     | 33.9 | 33.9 |  76.5 |  84.4 |
| `ls -la`                     |    336 |     64 |  **-81.0 %** |  0.7 |  0.2 |   4.2 |  14.4 |
| `ls -la .firma`              |    371 |     42 |  **-88.7 %** |  0.8 |  0.1 |   4.1 |  14.3 |
| `find docs -maxdepth 2`      |     92 |     92 |    0.0 %     |  0.3 |  0.3 | 118.6 | 158.6 |
| `grep -rn TODO\|FIXME …`     |     56 |     56 |    0.0 %     |  0.2 |  0.2 | 124.4 | 152.7 |
| `cat .firma/state.json`      |    411 |    411 |    0.0 %     |  1.2 |  1.2 |   4.4 |  34.4 |
| `find . -name '*.md' \| xargs wc -l` | 275 | 275 | 0.0 %  |  0.7 |  0.7 | 128.3 | 165.5 |
| `find scripts -name '*.mjs'` |     52 |     52 |    0.0 %     |  0.2 |  0.2 | 122.1 | 148.7 |
| **TOTAL**                    | **11 952** | **11 302** | **-5.4 %** | — | — | — | — |

### Honest finding

- rtks Werbung (60–90 %) wird auf diesem Workload **nicht erreicht**: Gesamt-Reduktion **5.4 %**.
- **Wo rtk wirkt:** unspezifische, verbose Outputs ohne kompakte Flags
  - `git status` → kompakte Branch + Untracked-Übersicht (-42.7 %)
  - `ls -la` / `ls -la .firma` → nur Filenames, keine Perms/Owner/Size/Date (-81 / -88.7 %)
- **Wo rtk nichts bringt:**
  - Bereits-kompakte Outputs (`git log --oneline`)
  - bash-Subshells (`bash -lc "…"`) → rtk sieht "bash" als unbekanntes Kommando und macht Passthrough
  - `git diff --stat` → rtk filtert `git diff` ohne `--stat` anders; mit `--stat` kein Δ
  - `cat`, `find`, `grep`, `wc` → kein spezifischer Filter implementiert
- **Wall-Clock-Overhead:** rtk addiert konsistent **10–30 ms** pro Aufruf (eigener Prozess-Start).

### Wann rtk lohnt sich

| Szenario | rtk lohnt sich? |
|----------|:---------------:|
| Agent macht viele `git status`, `ls -la` | **ja** |
| Agent macht `cargo test`, `pnpm test` mit Stacktraces | **ja** (laut README -90 %, von uns nicht gemessen) |
| Agent ruft bash-Subshells | nein (Passthrough) |
| Agent ruft eigene Node-CLIs | nein (kein Filter) |
| Reasoning-State-Reminders (state.json) | nein — siehe `token-cache.mjs` Fingerprint-Cache |

### Konsequenz für Firma OS

1. **rtk wird selektiv einsetzt** — nicht für jeden Command, nur wo das Δ messbar ist.
2. **Eigener Token-Cache bleibt notwendig** für wiederkehrende State-Reminders (`lib/token-cache.mjs`).
3. **Kein "rtk löst alle Token-Probleme"-Versprechen** in Doku oder Roadmap.

---

## Reproduzieren

```bash
# Install (einmalig)
bash scripts/firma/setup/install-rtk.sh
npm install

# Benchmark
npm run bench:rtk

# JSON-Form (für Diff-Vergleiche)
node scripts/firma/benchmarks/rtk-vs-raw.mjs --json > /tmp/bench.json
```

Outputs werden unter `.firma/benchmarks/<timestamp>/` mit raw + rtk-Outputs als Belege gespeichert (gitignored).

Stable Snapshot pro Release: `docs/benchmarks/rtk-vs-raw-<datum>.json` (committed).

---

## Anti-Patterns (verboten)

- ❌ Token-Zahlen ohne benannten Tokenizer
- ❌ "X % Einsparung" ohne A/B-Vergleich + Workload-Definition
- ❌ Synthetische statt reale Outputs als Fixtures
- ❌ Single-Run-Messung als "Performance"
- ❌ rtks Marketing-Zahlen zitieren statt eigene messen

---

## Benchmark 2 · ICM (Interpreted-Context-Methodology) vs Monolithic Loading

**Quelle:** [github.com/RinDig/Interpreted-Context-Methdology](https://github.com/RinDig/Interpreted-Context-Methdology)

**Frage:** Wie viel Token-Last spart ICMs Layered-Loading pro Call gegenüber einem monolithischen Prompt, der alles auf einmal lädt?

**Harness:** `scripts/firma/benchmarks/icm-vs-monolithic.mjs` · Run: `npm run bench:icm`

**Workload:** `.firma/icm/triage/` Workspace (3 Stages: `01-classify` → `02-decide` → `03-action`), reale Firma-OS-Konventionen.

### Ergebnis (Run 2026-05-14)

| Stage              | Files | Tokens | KB    |
|--------------------|------:|-------:|------:|
| 01-classify        |     4 |  2 750 |   9.1 |
| 02-decide          |     5 |  2 978 |   9.8 |
| 03-action          |     6 |  3 211 |  10.6 |
| **Σ layered (sum)** | — | **8 939** | — |
| MONOLITHIC          | 10 | **4 462** | 14.7 |

### Honest finding

- **Peak Stage vs Monolithic:** **-28.0 %** weniger Tokens **pro Call** (3 211 vs 4 462)
- **Σ Layered vs Monolithic:** **+100.3 %** mehr Tokens **insgesamt** über die ganze Pipeline (8 939 vs 4 462)

Das ist der **eigentliche Trade-off von ICM**, der in der README nicht so klar steht:

| Effekt | Pro-Call | Pipeline-Total |
|--------|:--------:|:--------------:|
| Token-Last | ↓ (-28 %) | ↑ (+100 %) |
| Mögliche Modell-Qualität | besser (kompakterer Context, weniger "lost in the middle") | nicht in diesem Benchmark gemessen |
| Human-Edit-Surface | klar (pro Stage ein Output-File) | klar |
| Pipeline-Komplexität | höher (3 Calls + Stage-Output-Handoff) | höher |

**Warum sind Σ Tokens höher?**
Jede Stage lädt Layer 0 (`CLAUDE.md`) + Layer 1 (Workspace-CONTEXT.md) + ihre Layer 3 Referenzen erneut. Stage 02 lädt zusätzlich Stage 01 Output, Stage 03 lädt die Outputs von 01+02. Das ist Designed-Behavior in ICM (Stage-Chaining via Layer 4).

### Wichtiger Disclaimer (Output-Qualität)

Wir messen hier **nur Token-Last**, NICHT ob die Antworten besser oder schlechter werden. Output-Qualität braucht:

- echte LLM-Calls
- ein Bewertungs-Schema (z.B. Inter-Rater-Reliability über N Antworten)
- mehrere Modelle für Cross-Validation

Das ist **bewusst nicht Teil dieses Benchmarks**. Wir können nur das messen, was deterministisch zählbar ist. Das ehrlich zu sagen ist der Standard.

### Wann ICM für Firma OS sinnvoll ist

| Szenario | ICM lohnt sich? |
|----------|:---------------:|
| Triage einer Mail mit klaren Stages (klassifiziere → entscheide → handle) | **wahrscheinlich ja** (Edit-Surface + kompaktere Calls) |
| One-shot-Frage an den Agent (z.B. "wie geht's mir heute?") | nein (Pipeline-Overhead nicht wert) |
| Quote-Generation aus strukturiertem Input | **ja** (klares Stage-Modell) |
| Code-Review eines Diffs | nein (passt nicht zum Layer-Modell) |

### Stable Snapshot

`docs/benchmarks/icm-vs-monolithic-2026-05-14.json` (Provenance: commit-hash + node-version).

---

## Benchmark 3 · Lighthouse 12 auf dem Dashboard

**Standard:** Lighthouse 12 (Google, Apache 2.0) + Core Web Vitals (LCP, INP, CLS, TBT, FCP) + axe-core Subset für die Accessibility-Kategorie (Deque, MPL 2.0).
**Harness:** `scripts/firma/benchmarks/lighthouse-dashboard.mjs` mit `@lhci/cli` als Orchestrator · Run: `npm run bench:lighthouse`.
**Methodik:**

- `next build` (Production) wird vorausgesetzt, dann startet `lhci collect` automatisch `next start`
- 3 Routen × 3 Runs · Chrome for Testing via `CHROME_PATH` (z.B. Playwright-Chromium)
- Preset `desktop`, nur die 4 Kategorien Performance/Accessibility/Best-Practices/SEO
- Aggregation: Median pro URL+Kategorie, arithmetisches Mittel über die 3 Routen für Overall

### Ergebnis (Run 2026-05-14)

| Route     | Performance | Accessibility | Best Practices | SEO |
|-----------|------------:|--------------:|---------------:|----:|
| `/`        | 100 | 100 | 100 | 100 |
| `/tools`   | 100 | 100 | 100 | 100 |
| `/reports` | 100 | 100 | 100 | 100 |
| **⌀ mean** | **100** | **100** | **100** | **100** |

Core Web Vitals (Median, Lab, desktop preset):

| Route     | LCP   | TBT  | CLS   | FCP   | TTI   |
|-----------|------:|-----:|------:|------:|------:|
| `/`        | 507 ms | 0 ms | 0.000 | 220 ms | 507 ms |
| `/tools`   | 505 ms | 0 ms | 0.000 | 215 ms | 505 ms |
| `/reports` | 508 ms | 0 ms | 0.000 | 215 ms | 508 ms |

Alle LCP-Werte deutlich unter 2 500 ms (Web-Vitals-Threshold "good"), TBT 0 ms, CLS 0.

### Honest finding

- Der **erste Lauf zeigte 100/97/96/100** — zwei echte Befunde:
  1. **A11y `color-contrast` (WCAG 1.4.3, AA)** — Accent-Farbe `#2563eb` für Link-Text war auf dunklem Surface zu dunkel (~3.5:1, AA fordert ≥4.5:1). Fix: zweite Variable `--color-accent-text: #60a5fa` für Text-Accent, `--color-accent` bleibt für Button-Backgrounds (white-on-blue).
  2. **Best-Practices `errors-in-console`** — fehlende `/favicon.ico` (404). Fix: `app/favicon.ico` (16×16 ICO programmatisch generiert) + `app/icon.svg` für moderne Browser.
- Nach den zwei Fixes: **100/100/100/100 auf allen drei Routen**, drei Runs pro URL stabil.
- Vor jedem Snapshot wird der vorherige `.lighthouseci/`-Output gelöscht — keine Mittelung über alte Runs.

### Stable Snapshot

`docs/benchmarks/lighthouse-dashboard-2026-05-14.json` (Provenance: commit-hash + Chrome-Version + node-version + Lighthouse-Version aus den LHR-Reports).

### Reproduzieren

```bash
# 1. Production Build
(cd website && npm run build)

# 2. Chrome verfügbar machen (Playwright-Chromium reicht)
(cd website && npx playwright install chromium)

# 3. Benchmark
CHROME_PATH=/opt/pw-browsers/chromium-*/chrome-linux64/chrome npm run bench:lighthouse
```

Voraussetzung: Port 3000 frei. `lhci collect` startet `next start` selbst.

---

## Benchmark 4 · axe-core WCAG 2.1 AA auf allen Dashboard-Routen

**Standard:** axe-core 4 (Deque Systems, MPL 2.0) + WCAG 2.1 Level A + AA (W3C Recommendation).
**Begründung (warum zusätzlich zu Lighthouse):** Lighthouse läuft nur einen Subset der axe-Regeln (ca. 30–40 der ~90 Stand 2026). Für eine ehrliche WCAG-2.1-AA-Aussage brauchen wir den vollständigen axe-Run.
**Harness:** `scripts/firma/benchmarks/axe-dashboard.mjs` · Run: `npm run bench:axe`.
**Methodik:**

- Runner spawnt `next start` direkt (nicht via `npm start`, das SIGTERM nicht zuverlässig durchreicht) und schließt das Prozess-Gruppen-Tree am Ende sauber.
- Playwright Chromium headless, Viewport 1280×900, `waitUntil=networkidle` pro Route.
- axe-core mit Tags `wcag2a, wcag2aa, wcag21a, wcag21aa` → die offizielle WCAG-A + AA-Regelmenge in Level 2.0 + 2.1.
- 6 Routen: `/`, `/inbox`, `/approvals`, `/tokens`, `/tools`, `/reports`.

### Ergebnis (Run 2026-05-14)

| Route       | Violations | Critical | Serious | Moderate | Minor | Incomplete | Passes |
|-------------|-----------:|---------:|--------:|---------:|------:|-----------:|-------:|
| `/`          | 0 | 0 | 0 | 0 | 0 | 1 | 19 |
| `/inbox`     | 0 | 0 | 0 | 0 | 0 | 1 | 17 |
| `/approvals` | 0 | 0 | 0 | 0 | 0 | 1 | 17 |
| `/tokens`    | 0 | 0 | 0 | 0 | 0 | 1 | 17 |
| `/tools`     | 0 | 0 | 0 | 0 | 0 | 1 | 19 |
| `/reports`   | 0 | 0 | 0 | 0 | 0 | 2 | 20 |
| **Σ**         | **0** | **0** | **0** | **0** | **0** | **7** | — |

### Honest finding

Der erste Lauf zeigte **1 serious violation auf `/reports`**:

- **`scrollable-region-focusable`** (WCAG 2.1.1 Keyboard, Level A · EN 301 549 9.2.1.1)
  Der `<pre>`-Block mit JSON-Totals hatte `overflow-x-auto`, war aber nicht per Tastatur fokussierbar. Tastatur-Only-Nutzer konnten den abgeschnittenen Inhalt nicht scrollen.
  **Fix:** `tabIndex={0}` + `aria-label={"Totals für …"}` am `<pre>` (`website/app/reports/page.tsx:99`). Re-Run: 0 Violations.

Die 7 `incomplete` Items sind axe-Hinweise auf Regeln, die in Chromium headless nicht abschließend prüfbar sind (typisch: `color-contrast` auf gemischten Backgrounds, `scrollable-region-focusable` auf hover-only Containern). Sie sind **keine** Verletzungen, sondern „bitte manuell verifizieren".

### Wichtiger Disclaimer

> Automatisierte A11y-Audits erfassen typischerweise **~57 % der WCAG-Issues** (Deque-Studie 2021). Vollständige WCAG-AA-Conformance braucht manuelle Prüfung — insbesondere Tastatur-Navigation, Screen-Reader-Flows, kognitive Last, fokus-sichtbare Reihenfolge.

Heißt: 0 axe-violations ≠ „barrierefrei", sondern „kein automatisch findbarer Verstoß". Für die enterprise-Aussage müssen die incomplete-Items + eine manuelle Tastatur-Tour auf allen 6 Routen dokumentiert werden (Iteration A.2-followup, noch offen).

### Stable Snapshot

`docs/benchmarks/axe-dashboard-2026-05-14.json` (Provenance: axe-core-Version + commit-hash + node-version + branch).

### Reproduzieren

```bash
(cd website && npm install && npm run build)
(cd website && npx playwright install chromium)
npm run bench:axe
```

Port 3000 muss frei sein.

---

## Benchmark 5 · Security-Audit (npm audit + Trivy CVE-Scan)

**Standard:** OWASP Top 10 **A06:2021 — Vulnerable and Outdated Components** · CVE / GHSA / OSV-Datenbanken.
**Tools:**
- `npm audit` (GitHub Advisory Database) — root + website, **prod + dev dependencies**
- **Trivy** (Aqua Security, Apache 2.0) — `fs`-Scan über das Repo, Scanner `vuln` + `secret`, `--include-dev-deps`, `node_modules`/`.next` ausgenommen

**Harness:** `scripts/firma/benchmarks/security-audit.mjs` · Run: `npm run bench:security`.
**Trivy-Auflösung:** `$TRIVY_BIN` → `trivy` in PATH → graceful skip (kein Fake-Ergebnis, analog zum Typst-SKIP im Smoke-Test).
**Exit-Code:** nicht-null bei Critical/High — damit CI scharf schalten kann.

### Ergebnis (Run 2026-05-14)

npm audit:

| Scope    | Critical | High | Moderate | Low | Total |
|----------|---------:|-----:|---------:|----:|------:|
| root     | 0 | 0 | 0 | 0 | 0 |
| website  | 0 | 0 | 0 | 0 | 0 |

Trivy 0.70.0 (fs-Scan, vuln + secret, incl. dev-deps):

| Critical | High | Medium | Low | Total | Secrets |
|---------:|-----:|-------:|----:|------:|--------:|
| 0 | 0 | 0 | 0 | 0 | 0 |

### Honest finding

Der **erste `npm audit`-Lauf auf `website/` zeigte 6 Findings** (4 low, 2 moderate):

| Paket | Severity | Kette | CVE-Kern |
|-------|----------|-------|----------|
| `tmp` | low | `@lhci/cli → inquirer → external-editor → tmp@0.0.33` + `@lhci/cli → tmp@0.1.0` | arbitrary temp file/dir write via Symlink (`dir`-Parameter) |
| `external-editor`, `inquirer`, `@lhci/cli` | low | transitiv über `tmp` | — (Root-Cause ist `tmp`) |
| `postcss` | moderate | `next → postcss@8.4.31` | XSS via unescaped `</style>` im CSS-Stringify-Output (< 8.5.10) |
| `next` | moderate | — | nur geflaggt **wegen** des `postcss`-Sub-Deps |

`npm audit fix` schlug für alle einen **destruktiven Major-Downgrade** vor (`@lhci/cli → 0.1.0`, `next → 9.3.3`) — unbrauchbar. Stattdessen sauber gelöst mit `overrides` in `website/package.json`:

```json
"overrides": {
  "postcss": "^8.5.14",
  "tmp": "^0.2.5"
}
```

- `postcss ^8.5.14` — `@tailwindcss/postcss` nutzte bereits 8.5.14; nur `next`s gebündeltes 8.4.31 war alt. 8.4 → 8.5 ist ein Minor-Bump innerhalb Major 8, semver-kompatibel. Build + Typecheck verifiziert grün.
- `tmp ^0.2.5` — `tmp` ist der Root-Cause aller 4 low-Findings; ein Override räumt die komplette Kette. `tmp` wird nur in `inquirer`s interaktivem Editor-Prompt benutzt, den unser nicht-interaktiver `lhci collect`-Flow nie auslöst.

Nach den Overrides: **0/0/0/0** auf root + website. Trivy bestätigt unabhängig **0 CVEs + 0 Secrets**.

### Wichtiger Disclaimer

> Dependency-Scanning erfasst **bekannte CVEs in deklarierten Paketen**. Es ersetzt **keinen** Code-Audit, Pen-Test oder SAST. `0 Findings` heißt „kein bekanntes CVE", nicht „sicher". OWASP A06 ist nur **eine** der zehn Kategorien — A01 (Access Control), A03 (Injection) etc. brauchen eigene Prüfungen.

### Stable Snapshot

`docs/benchmarks/security-audit-2026-05-14.json` (Provenance: tool-Versionen + commit-hash + node/npm-Version + vollständige Advisory-Liste).

### Reproduzieren

```bash
npm install && (cd website && npm install)

# Trivy installieren (Aqua Security, Apache 2.0)
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# Audit
npm run bench:security
# oder mit explizitem Trivy-Pfad:
TRIVY_BIN=/pfad/zu/trivy npm run bench:security
```

Ohne Trivy läuft der Benchmark trotzdem (npm-audit-only), markiert den Trivy-Block aber als `skipped`.

---

## Benchmark 6 · PDF/A-2 Validierung der Typst-Outputs

**Standard:** **ISO 19005-2:2011 (PDF/A-2 Level B)** — Format für revisionssichere Langzeitarchivierung.
**Tool:** **veraPDF** (veraPDF Consortium, MPL 2.0) — die offizielle PDF/A-Referenz-Validierung, getragen von der PDF Association.
**Begründung:** Angebote + Rechnungen unterliegen der GoBD und §147 AO (10 Jahre Aufbewahrungspflicht). PDF/A-2b garantiert: alle Fonts eingebettet, keine externen Abhängigkeiten, deterministisches Rendering über Jahrzehnte.

**Harness:** `scripts/firma/benchmarks/pdfa-validation.mjs` · Run: `npm run bench:pdfa`.
**Methodik:**

- Sammelt alle gerenderten PDFs aus `.firma/finance/quotes/<id>/` + `docs/quotes/`.
- Ruft veraPDF mit `--flavour 2b` (PDF/A-2 Level B) je Datei auf, parst den MRR-XML-Report.
- veraPDF optional: `$VERAPDF_BIN` → `verapdf` in PATH → graceful skip.
- Exit-Code ≠ 0 bei nicht-konformer PDF — CI-tauglich.

### Ergebnis (Run 2026-05-14)

| Datei | PDF/A-2b | Checks ✓ | Checks ✗ |
|-------|:--------:|---------:|---------:|
| `.firma/finance/quotes/QT-20260514-001/QT-20260514-001.pdf` | **PASS** | 6989 | 0 |
| `docs/quotes/QT-20260514-001.pdf` | **PASS** | 6989 | 0 |

### Honest finding

Die **Baseline (vor dem Fix) scheiterte** — aber knapp:

- Typst rendert **ohne** `--pdf-standard` strukturell sauberes PDF (6911 von 6912 Checks bestanden), stempelt aber **nicht** den PDF/A-Identifier.
- Einzige Verletzung: **ISO 19005-2 clause 6.6.4 test 1** — die XMP-Metadaten enthielten keine `pdfaid:part` / `pdfaid:conformance`-Identifikation. Ohne die kann kein Archivsystem die Datei als PDF/A erkennen.

**Fix:** `renderTypst()` in `scripts/firma/lib/pdf.mjs` setzt jetzt per Default `--pdf-standard a-2b`. Typst 0.14.2 (krilla-PDF-Backend) erzeugt damit die vollständige XMP-Identifikation + `OutputIntent`. Re-Render → **6989/0, isCompliant=true** auf beiden PDFs.

Der Default ist bewusst `a-2b`, nicht opt-in: jedes Angebot/jede Rechnung ist damit ab Rendering archivsicher. `pdfStandard: null` übergeben, falls ausnahmsweise Standard-PDF gewünscht ist.

### Wichtiger Disclaimer

> **Level B** ('basic') prüft die **visuelle** Reproduzierbarkeit über die Zeit. **Level A** ('accessible') würde zusätzlich einen Tagged-PDF-Strukturbaum fordern (Screen-Reader-Tauglichkeit des PDFs). Typst 0.14.2 erzeugt **kein** PDF/A-2a — Level A ist daher bewusst nicht Teil dieses Benchmarks. Für die Archivierungs-Pflicht (GoBD) ist Level B ausreichend; für barrierefreie PDF-Dokumente wäre A nötig.

### Stable Snapshot

`docs/benchmarks/pdfa-validation-2026-05-14.json` (Provenance: veraPDF-Version + commit-hash + node-version + per-Datei Check-Counts).

### Reproduzieren

```bash
bash scripts/firma/setup/install-typst.sh    # Typst via cargo, ~5 Min

# veraPDF installieren (veraPDF Consortium, MPL 2.0)
# Auto-Install: https://verapdf.org/software/  → verapdf-installer.zip

# ein Angebot rendern + validieren
node scripts/firma/firma.mjs report quote --data .firma/finance/quotes/QT-20260514-001/data.json --out .firma/finance/quotes/QT-20260514-001/QT-20260514-001.pdf
VERAPDF_BIN=/pfad/zu/verapdf npm run bench:pdfa
```

---

## Geplante Benchmarks

| # | Tool | Methodik | Status |
|--:|------|----------|:------:|
| 1 | rtk-ai (Output-Filter) | A/B raw vs rtk auf 10 Commands | ✅ done |
| 2 | ICM (Layered Loading) | A/B Layered vs Monolithic auf Triage-Workspace | ✅ done |
| 3 | Lighthouse 12 auf Dashboard | 3 Routen × 3 Runs, Perf/A11y/BP/SEO + Web Vitals | ✅ done |
| 4 | axe-core Standalone | Volle WCAG 2.1 AA auf allen 6 Routen | ✅ done |
| 5 | npm audit + Trivy | OWASP A06 / CVE-Datenbank auf Repo + Lockfiles | ✅ done |
| 6 | veraPDF (PDF/A-2) | ISO 19005-2 Validierung der Typst-Outputs | ✅ done (oben) |
| 7 | Manuelle Tastatur-Tour | Tab-Reihenfolge + Focus-Visibility auf allen 6 Routen | offen (Iteration A.2-followup) |
| 8 | token-cache (State-Reminder) | A/B noop vs local-Fingerprint auf 50 `firma status`-Runs | offen (Phase 2.5) |
| 9 | MemPalace (Recall) | Latency p50/p99 + Genauigkeit auf 100 Customer-Queries | offen (Phase 5) |
| 10 | Ruflo (Multi-Agent) | Token-Sum + Time-to-Result auf 1-Agent vs 3-Agent Workflow | offen (Phase 6) |

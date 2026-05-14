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

## Geplante Benchmarks

| # | Tool | Methodik | Status |
|--:|------|----------|:------:|
| 1 | rtk-ai (Output-Filter) | A/B raw vs rtk auf 10 Commands | ✅ done |
| 2 | ICM (Layered Loading) | A/B Layered vs Monolithic auf Triage-Workspace | ✅ done |
| 3 | Lighthouse 12 auf Dashboard | 3 Routen × 3 Runs, Perf/A11y/BP/SEO + Web Vitals | ✅ done (oben) |
| 4 | axe-core Standalone | Volle WCAG 2.1 AA-Regelmenge auf allen 6 Routen | offen (Iteration A.2) |
| 5 | npm audit + Trivy | OWASP Top 10 / CVE-Datenbank auf Repo + Lockfiles | offen (Iteration A.3) |
| 6 | veraPDF (PDF/A-2) | ISO 19005-2 Validierung der Typst-Outputs | offen (Iteration A.4) |
| 7 | token-cache (State-Reminder) | A/B noop vs local-Fingerprint auf 50 `firma status`-Runs | offen (Phase 2.5) |
| 8 | MemPalace (Recall) | Latency p50/p99 + Genauigkeit auf 100 Customer-Queries | offen (Phase 5) |
| 9 | Ruflo (Multi-Agent) | Token-Sum + Time-to-Result auf 1-Agent vs 3-Agent Workflow | offen (Phase 6) |

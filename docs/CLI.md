# Firma OS CLI Commands

Ziel: Einfache Kommandos statt Chat-Magic. Belkis kann das in 5 Minuten lernen.

## Installation

```bash
# Im Repo-Root:
npm install   # falls Node-Stack
chmod +x scripts/firma/firma.mjs
# Optional Symlink für globalen Zugriff:
sudo ln -sf $(pwd)/scripts/firma/firma.mjs /usr/local/bin/firma
```

Danach: `firma <cmd>` von überall im Repo.

## Commands

### `firma start`
- Startet den Next.js Dashboard-Server (Port 3000)
- Startet File-Watcher auf `.firma/`
- Öffnet Browser automatisch
- Stoppen mit Ctrl+C

### `firma status`
- Einzeiler:
  ```
  Tickets: 0 open · Inbox: 0 unread · Approvals: 0 pending · Tokens today: 0
  ```

### `firma inbox`
- Listet alle ungelesenen Inbox-Items
- Mit `--triage <file>` öffnet Triage-Wizard

### `firma triage <file>`
- Triage-Wizard für 1 Inbox-Item
- Optionen: Make Ticket / Reply / Archive / Spam / Park

### `firma plan`
- Zeigt die Top-3-Aktionen für heute (aus `.firma/plan/today.yaml`)
- Mit `--week` für 7-Tage-Plan

### `firma run <agent>`
- Führt einen Agent aus `.firma/agents/<agent>.md` aus
- Beispiel: `firma run auditor`, `firma run pricing`
- Token-Budget aus `.firma/config.yaml` wird respektiert

### `firma audit`
- Führt das Repo-Audit aus (was diese Session manuell gemacht hat)
- Output: `docs/firma-os-audit/<date>-audit.md`

### `firma report [type]`
- `firma report status` → 1-Seiter PDF aktueller Stand
- `firma report quote --customer salon-mariposa` → Angebot-PDF
- `firma report invoice --customer salon-mariposa --amount 1500` → Rechnung
- `firma report weekly` → Wochenbericht
- Nutzt PDFCraft (P0-Integration)

### `firma test`
- Smoke-Tests: Dashboard läuft? State.json valid? Audit-chain intact?
- Output: ✓/✗ pro Test

### `firma token-report [--last 7d]`
- Zeigt Token-Verbrauch
- Top-Verbraucher
- Empfehlungen für Reduktion

### `firma approvals`
- Liste pending approvals
- Mit `--approve <id>` direkte Genehmigung (mit Note)
- Mit `--reject <id> --note "..."` Ablehnung

### `firma approve <id> [--note "..."]`
- Approval erteilen
- Schreibt nach `.firma/approvals/<id>.yaml` `decision: approved_by: <user>`

### `firma agent run <name>`
- Mit `--budget 5000` Token-Budget setzen
- Mit `--dry-run` simulieren ohne External Calls

### `firma sim`
- Klar als Simulation markierter Modus für Lern-Sessions
- Verändert keinen Real-State

### `firma version`, `firma help`
- Standard

## Workflow-Beispiele

### Morgendlicher Check

```bash
firma status
firma inbox
firma plan
```

Zeigt: Wo stehe ich, was kam rein, was sollte ich heute tun.

### Erstes Angebot generieren

```bash
firma triage workspace/communication/inbox/lead-2026-01-15.md
# Wizard: → Make Ticket → TCK-XXXX-0001 created
firma report quote --ticket TCK-XXXX-0001 --template salon-website
# PDF erstellt, Approval nötig zum Versand
firma approvals
firma approve APR-2026-001
# Mail wird (per Resend) versendet, nach Approval
```

### Audit auf Knopfdruck

```bash
firma audit
# Output: docs/firma-os-audit/2026-02-15-audit.md
```

### Tokens prüfen

```bash
firma token-report --last 7d
```

## Was bewusst NICHT gemacht wird

- ❌ Kein `firma` ohne Argument → öffnet Chat (nervig)
- ❌ Kein `firma weiter` → kein Auto-Advance, kein Sim-Theater
- ❌ Kein implizites `firma run --all-agents`

## Falls aus früheren Setups ein /firma-Slash-Command existiert

Der alte `/firma`-Slash-Command in `.claude/commands/firma.md` wird:
- archiviert nach `archive/legacy/firma-slash-command.md`
- ersetzt durch die CLI

In der neuen CLAUDE.md steht: „Statt /firma im Chat → `firma status` im Terminal".

---
agent_id: pricing
purpose: "Prüft Preise, Gehälter, Margen, Verkaufbarkeit"
firm: "Korynth Labs (Belkis Aslani)"
version: "0.1"
token_budget_default: 15000
inputs:
  - "repo path"
  - "task description"
  - "since-commit (optional)"
outputs:
  - "docs/firma-os-audit/<date>-pricing.md  (default)"
  - "structured JSON in .firma/agents/runs/<run-id>.json"
tools_allowed:
  - read_files
  - grep
tools_forbidden:
  - external_api_calls
  - git_push
  - stripe_calls
human_approval_required_for:
  - modifying .firma/finance/real/*
  - any external pricing query
single_agent_default: true
multi_agent_compatible: true  # ruflo, deer-flow (Phase 5)
---

# Agent · pricing

## Mission
Prüft Preise, Gehälter, Margen, Verkaufbarkeit

## Trigger
- Manuell: `firma run pricing`
- Geplant: über Cron (`.firma/cron/`)
- Aus anderen Agenten (Phase 5+, mit ruflo)

## Workflow
1. Liest seinen Auftrag (CLI-Argumente + `.firma/state.json`)
2. Schreibt Output in `docs/firma-os-audit/` oder `.firma/...`
3. Logged Run in `.firma/agents/runs/<id>.json` mit Token-Verbrauch
4. Falls Aktion freigabepflichtig: schreibt nach `.firma/approvals/pending/`

## Pre-flight Checks
- `.firma/state.json` lesbar?
- Token-Budget verfügbar?
- Keine offene Approval die diesen Agent blockiert?

## Erfolgs-Output
Markdown-Bericht oder strukturierte JSON-Aktion, lesbar im Dashboard `/agents`.

## Failure-Mode
- Wenn Token-Budget überschritten → stoppt, schreibt Teil-Output, fragt Belkis nach.
- Wenn Tool-Aufruf forbidden → erzeugt Approval-Request, wartet.
- Wenn Output-Pfad außerhalb erlaubter → schreibt in Sandbox `.firma/agents/runs/`.

## Token-Tracking
Jeder Run schreibt nach `.firma/tokens/spend.jsonl`:
```jsonl
{"real":"<ISO>","source":"agent:pricing","tokens_in":N,"tokens_out":M,"run_id":"<uuid>"}
```

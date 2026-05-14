# Stage 03 · Action

> Layer 2 · Konkrete Files anlegen. Keine externen Aktionen.

## Inputs

| Source | Datei | Scope | Warum |
|--------|-------|-------|-------|
| Layer 0 | `CLAUDE.md` | Hard-Stop-Rule | Was darf ausgeführt werden |
| Layer 1 | `../../CONTEXT.md` | Vollständig | Endprodukt-Erwartung |
| Layer 2 | (selbst) | — | — |
| Layer 3 | `references/file-conventions.md` | Vollständig | Wo welche Datei hin gehört |
| Layer 3 | `references/templates/quote-intro.md` | Vollständig | Reply-Template (Entwurf) |
| Layer 4 | `../01-classify/output/inbound.md` | Vollständig | Original-Mail (für Reply-Personalisierung) |
| Layer 4 | `../01-classify/output/classification.yaml` | Vollständig | Kategorie + Confidence |
| Layer 4 | `../02-decide/output/decision.yaml` | Vollständig | Welche Aktion |
| Layer 4 | `../02-decide/output/approval-request.yaml` | optional | Falls Mail-Versand geplant |

## Process

1. Lade `decision.yaml`. Bei `action: archive` → schreibe `output/archive-note.md` + STOP.
2. Bei `action: create_ticket`: Erstelle `output/ticket.yaml` gemäß Konventionen.
3. Bei Reply: rendere Template aus `references/templates/<slug>.md` in `output/reply.md`. Ersetze `{{first_name}}`, `{{topic}}` etc.
4. Bei `needs_approval=true`: kopiere oder generiere `output/approval-request.yaml` mit `firma approve <id>`-Format.
5. Niemals Mail senden. Niemals Domain registrieren. Niemals Tool kaufen.

## Outputs

Genau eines (+ optional `approval-request.yaml`):

- `output/ticket.yaml`
- `output/reply.md` (Entwurf)
- `output/archive-note.md`
- `output/escalation.md`

## Hard-Stop

Diese Stage darf **keine externen Aktionen** auslösen. Alle Files werden lokal geschrieben.
Versand erfolgt nur über `firma approve` durch den Inhaber.

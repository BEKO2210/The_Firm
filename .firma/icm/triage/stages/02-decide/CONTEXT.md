# Stage 02 · Decide

> Layer 2 · Welche Aktion folgt aus der Klassifikation?

## Inputs

| Source | Datei | Scope | Warum |
|--------|-------|-------|-------|
| Layer 0 | `CLAUDE.md` | Hard-Stop-Rule | Welche Aktionen brauchen Approval |
| Layer 1 | `../../CONTEXT.md` | Vollständig | Endprodukt-Erwartung |
| Layer 2 | (selbst) | — | — |
| Layer 3 | `references/decision-tree.md` | Vollständig | Mapping Kategorie → Aktion |
| Layer 4 | `../01-classify/output/classification.yaml` | Vollständig | Eingangs-Klassifikation |

## Process

1. Lade `classification.yaml`.
2. Wende `decision-tree.md` an: Kategorie+Confidence → Aktion.
3. Falls `requires_human=true` ODER Aktion benötigt Approval (z.B. Mail-Versand): erzeuge `approval-request.yaml`.

## Outputs

`output/decision.yaml`:

```yaml
action: create_ticket | reply_from_template | archive | escalate
needs_approval: true | false
target_template?: <slug aus templates/email/>
note?: einzeiliger Hinweis
```

Falls `needs_approval=true`, zusätzlich `output/approval-request.yaml` mit allen
Feldern, die `firma approve` erwartet.

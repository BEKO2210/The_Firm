# Stage 01 · Classify

> Layer 2 · Stage-Contract für die Klassifikation einer eingegangenen Mail.

## Inputs

| Source | Datei | Scope | Warum |
|--------|-------|-------|-------|
| Layer 0 | `CLAUDE.md` | Hard-Stop-Rule + Schema | Verhindern, dass Agent selbst antwortet |
| Layer 1 | `../../CONTEXT.md` | Vollständig | Routing-Verständnis |
| Layer 3 | `references/categories.md` | Vollständig | Definierte Kategorien |
| Layer 4 | `output/inbound.md` | Vollständig | Die zu klassifizierende Mail |

## Process

1. Lies die Mail in `output/inbound.md`.
2. Lies `references/categories.md` für valide Kategorien.
3. Bestimme genau eine Kategorie + Confidence (low/medium/high).
4. Falls Confidence=low: setze `requires_human=true`.

## Outputs

`output/classification.yaml`:

```yaml
category: lead | existing-customer | spam | personal | escalation
confidence: low | medium | high
requires_human: true | false
rationale: ein Satz, warum diese Kategorie
```

## Was Stage 01 NICHT tut

- Keine Reply schreiben
- Keine Tickets erstellen
- Keine externen Aktionen

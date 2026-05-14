# ICM Workspace · Inbox-Triage

> Layer 1 · Routing für die Triage einer Inbox-Mail nach Firma-OS-Schema.

## Zweck

Eine eingegangene Mail (`.firma/inbox/<file>.md`) durchläuft drei klar getrennte Stages:

1. **01-classify** — Kategorisieren: Lead · Bestandskunde · Spam · Personal · Eskalation
2. **02-decide** — Entscheidung: Ticket erstellen · Reply mit Template · Archivieren · Eskalieren (Approval)
3. **03-action** — Konkrete Aktion ausführen: Files anlegen, Approval-Request schreiben, etc.

## Eingang

Die Triage erwartet als Layer-4-Input für Stage 01:

- die Original-Mail in `stages/01-classify/output/inbound.md`

## Ausgang

Endprodukt liegt in `stages/03-action/output/`:

- `ticket.yaml` (falls Ticket) ODER `reply.md` (falls Reply) ODER `archive-note.md` (sonst)
- Bei Eskalation zusätzlich `approval-request.yaml`

## Hard-Stop-Rule

Externe Aktionen (Mail-Versand, Domain, Toolkauf) werden **nicht** automatisch ausgeführt.
Stage 03 schreibt nur Files. Mail-Versand braucht separate Approval.

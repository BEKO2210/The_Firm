# Firma OS · Datei-Konventionen für Stage 03

## ticket.yaml

```yaml
id: TCK-YYYYMMDD-XXXX
status: awaiting_quote | in_discovery | in_design | …
title: kurzer Klartext-Titel
source_mail: ../01-classify/output/inbound.md
customer:
  name: Vorname Nachname
  email: name@example.com
  company?: Name
created_at_real: 2026-05-14T08:15:00Z
```

## reply.md (Entwurf)

```markdown
# Reply · Entwurf (status: pending_approval)

**To:** <vom Original>
**Cc:** —
**Subject:** Re: <vom Original>

<Body, mit Template-Variablen ersetzt>

—
Belkis Aslani · Firma OS
```

Versand erst nach `firma approve <ticket-id>-reply`.

## approval-request.yaml

```yaml
id: APR-YYYYMMDD-XXXX
type: outbound_email
target: name@example.com
preview_file: ../03-action/output/reply.md
needs: ["principal_signoff"]
expires_at_real: 2026-05-21T08:15:00Z
```

## escalation.md

```markdown
# Escalation

**Source:** ../01-classify/output/inbound.md
**Reason:** (z.B. rechtlicher Begriff erkannt, oder Confidence=low + Kategorie=lead)
**Suggested action by agent:** <kurz>
**Awaiting:** principal review
```

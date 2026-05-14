# Decision-Tree · Kategorie → Aktion

| Kategorie | Confidence | Aktion | Approval nötig? |
|-----------|------------|--------|:----------------:|
| `lead` | high | `create_ticket` (Status: `awaiting_quote`) + Reply mit `quote-intro.md` Template (Entwurf) | **ja** — Mail-Versand |
| `lead` | medium | `create_ticket` + Reply mit `clarifying-questions.md` (Entwurf) | **ja** — Mail-Versand |
| `lead` | low | `escalate` an Inhaber | nein (kein Versand) |
| `existing-customer` | high | `create_ticket` mit Bezug zum bestehenden Engagement | nein (intern) |
| `existing-customer` | medium\|low | `escalate` | nein |
| `spam` | high | `archive` | nein |
| `spam` | medium | `escalate` | nein |
| `personal` | any | `archive` mit Tag `personal` | nein |
| `escalation` | any | `escalate` mit `priority=high` | nein (kein automatischer Versand) |

## Hard-Stop-Reminder

Alle Reply-Entwürfe sind **Entwürfe**. Versand ausschließlich nach `firma approve <id>` durch den Inhaber.

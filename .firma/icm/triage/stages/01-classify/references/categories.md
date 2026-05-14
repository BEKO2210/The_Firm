# Mail-Kategorien für Firma OS

| Kategorie | Definition | Beispiel |
|-----------|------------|----------|
| `lead` | Neue potenzielle Kundschaft, fragt nach Angebot/Demo/Preis | "Können Sie mir ein Angebot für eine Salon-Website machen?" |
| `existing-customer` | Bestandskunde, Bezug zu laufendem Engagement | "SLA-Frage zu Ticket TCK-…" |
| `spam` | Outreach an Belkis, kein echter Bedarf, Massenmail | "We can boost your SEO …" |
| `personal` | Privat, keine Firma-Relevanz | "Hi Belkis, hast du Lust auf Kaffee?" |
| `escalation` | Beschwerde · Vertragsrisiko · Anwalt · Behörde | "Wir sind mit der Lieferung nicht zufrieden…" |

## Confidence-Regeln

- **high**: Subject UND Body lassen exakt eine Kategorie zu.
- **medium**: Ambig zwischen 2 Kategorien, aber eine ist klar wahrscheinlicher.
- **low**: Mehrere plausible Kategorien oder fehlende Information → `requires_human=true`.

## Sicherheitsregel

Wenn eine Mail einen rechtlichen Begriff enthält (Anwalt, Klage, Abmahnung, Frist, BaFin, DSGVO-Beschwerde), kategorisiere als `escalation` mit `high` confidence, unabhängig vom Rest.

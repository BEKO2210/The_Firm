# PDF-Rendering · Phase 4

> Status: **MVP läuft** — erstes Angebot-PDF gerendert.
> Tool: [Typst](https://typst.app/) v0.14.2 (Apache 2.0, proprietary-friendly).

## Warum Typst (und nicht PDFCraft)

PDFCraft war in der Original-Roadmap genannt, scheidet aber aus zwei Gründen aus:

1. **Lizenz:** AGPL-3.0 → inkompatibel mit Firma OS proprietär (Copyleft würde uns zwingen, Firma-OS-Code unter AGPL zu öffnen).
2. **Use-Case-Mismatch:** PDFCraft macht PDF-**Manipulation** (merge/split/compress), wir brauchen PDF-**Generation aus Template**.

Typst ist:
- Apache 2.0 → proprietary-friendly
- Moderne Typesetting-Engine (Nachfolger-Geist von LaTeX, schneller)
- Eine Binary (~59 MB), keine Browser/Chromium-Abhängigkeit
- Markdown-nahe Syntax, JSON-Input via `sys.inputs`

## Install

```bash
bash scripts/firma/setup/install-typst.sh
# → cargo install typst-cli --root tools/typst (~5 Min)
```

Resultat: `tools/typst/bin/typst` (gitignored).

## Erstes Angebot rendern

```bash
node scripts/firma/firma.mjs report quote \
  --data .firma/finance/quotes/QT-20260514-001/data.json \
  --out .firma/finance/quotes/QT-20260514-001/QT-20260514-001.pdf
# ✓ .firma/finance/quotes/QT-20260514-001/QT-20260514-001.pdf (47.9 KB, 98 ms)
```

## Architektur

| Komponente | Datei |
|---|---|
| Template | `scripts/firma/templates/quote.typ` |
| Adapter | `scripts/firma/lib/pdf.mjs` (`renderTypst`, `isTypstAvailable`, `getTypstVersion`) |
| CLI-Command | `firma report quote --data <json> --out <pdf>` |
| Daten-Format | JSON (siehe `data.json`-Schema) |
| Beispiel-Daten | `.firma/finance/quotes/QT-20260514-001/data.json` |

### Daten-Schema (`data.json`)

```json
{
  "firm": { "name", "principal", "email", "address_lines": [..] },
  "customer": { "name", "company?", "email", "address_lines": [..] },
  "quote": { "id", "date", "valid_until", "currency", "subject", "intro" },
  "line_items": [ { "title", "description", "qty", "unit_price", "total" }, .. ],
  "totals": { "subtotal", "vat_rate", "vat_amount", "total" },
  "footer": { "iban?", "ust_id?", "note?" }
}
```

### Datenfluss

```
JSON-Daten ──── lib/pdf.mjs ───► typst --input data=<jsonString>
                                       │
                                       ▼
                                  quote.typ rendert
                                       │
                                       ▼
                                  out.pdf (1 Seite, A4)
```

## Was Phase 4 NICHT macht

- **Kein Mail-Versand.** PDF wird nur lokal geschrieben. Versand an Customer braucht `firma approve <id>` (Hard-Stop-Rule).
- **Keine Rechnung.** `firma report invoice` ist offen für nächste Iteration. Schema-Erweiterung von `quote.typ` zu `invoice.typ` (Fälligkeit + Zahlungsfrist + Bankdaten).
- **Keine Wochen-/Status-Reports.** `firma report weekly` / `status` offen.

## Smoke-Test

`scripts/firma/test/smoke-pdf.mjs` rendert ein minimales Test-Template und prüft:

- `isTypstAvailable()` korrekt
- PDF-Magic-Bytes (`%PDF-`)
- Datei > 1 KB

Wenn Typst nicht installiert ist, läuft der Test mit `SKIP` durch (Exit 0), damit CI ohne Typst-Setup nicht rot wird.

## Erstes echtes Angebot

`docs/quotes/QT-20260514-001.pdf` (committed) ist der erste Angebots-Snapshot:
Maria Kessler · Hairdesign Stuttgart-West · Paket A Starter-Website · 2.225,30 EUR brutto.

Dieser Snapshot ist Beleg, dass das System funktioniert. Bei realer Customer-Anfrage würde ein neues `.firma/finance/quotes/QT-…/` angelegt, gerendert, und nach `firma approve` versendet.

// Firma OS · Angebot-Template (Typst)
//
// Render: typst compile quote.typ quote.pdf --input data=path/to/data.json
//
// Erwartet `data.json` mit folgenden Feldern (siehe scripts/firma/lib/pdf.mjs):
//   firm: { name, principal, email, address_lines: [..] }
//   customer: { name, company, email, address_lines: [..] }
//   quote: { id, date, valid_until, currency, subject, intro }
//   line_items: [ { title, description, qty, unit_price, total } ]
//   totals: { subtotal, vat_rate, vat_amount, total }
//   footer: { iban?, ust_id?, note? }

#let data = json(bytes(sys.inputs.data))

#set page(paper: "a4", margin: (x: 2cm, y: 2cm), numbering: "1 / 1")
#set text(font: "Liberation Sans", size: 10pt, lang: "de")
#set par(justify: true, leading: 0.65em)

#let firm = data.firm
#let customer = data.customer
#let quote = data.quote
#let totals = data.totals

// ─── Header ────────────────────────────────────────────────────────
#grid(
  columns: (1fr, 1fr),
  align: (left, right),
  [
    *#firm.name*\
    #firm.principal\
    #for line in firm.address_lines [#line\ ]
    #firm.email
  ],
  [
    *Angebot* #quote.id\
    Datum: #quote.date\
    Gültig bis: #quote.valid_until
  ],
)

#v(1em)
#line(length: 100%, stroke: 0.4pt)
#v(1em)

// ─── Empfänger ─────────────────────────────────────────────────────
#text(size: 9pt)[An]
\
*#customer.name*\
#if "company" in customer and customer.company != none [#customer.company\ ]
#for line in customer.address_lines [#line\ ]
#customer.email

#v(2em)

// ─── Betreff + Intro ───────────────────────────────────────────────
*Betreff: #quote.subject*

#v(0.5em)

#quote.intro

#v(1.5em)

// ─── Positionen ────────────────────────────────────────────────────
#table(
  columns: (auto, 1fr, auto, auto, auto),
  align: (left, left, right, right, right),
  stroke: 0.3pt,
  fill: (col, row) => if row == 0 { rgb("#e7eaed") },
  inset: 8pt,
  [*Nr*], [*Position*], [*Menge*], [*Einzelpreis*], [*Gesamt*],
  ..data.line_items.enumerate().map(((i, it)) => (
    [#(i + 1)],
    [
      *#it.title* \
      #text(size: 8.5pt, fill: rgb("#555"))[#it.description]
    ],
    [#it.qty],
    [#it.unit_price #quote.currency],
    [#it.total #quote.currency],
  )).flatten()
)

#v(0.8em)

// ─── Totals ────────────────────────────────────────────────────────
#align(right)[
  #table(
    columns: (auto, auto),
    align: (left, right),
    stroke: none,
    inset: 4pt,
    [Zwischensumme], [#totals.subtotal #quote.currency],
    [USt. #totals.vat_rate%], [#totals.vat_amount #quote.currency],
    [*Gesamt*], [*#totals.total #quote.currency*],
  )
]

#v(2em)

// ─── Footer ────────────────────────────────────────────────────────
#line(length: 100%, stroke: 0.4pt)
#v(0.5em)

#text(size: 8.5pt, fill: rgb("#555"))[
  #if "ust_id" in data.footer and data.footer.ust_id != none [USt-ID: #data.footer.ust_id · ]
  #if "iban" in data.footer and data.footer.iban != none [IBAN: #data.footer.iban\ ]
  #if "note" in data.footer and data.footer.note != none [#data.footer.note]
]

#v(1em)

#text(size: 8.5pt, fill: rgb("#999"))[
  Dieses Angebot ist gültig bis zum oben genannten Datum. Es ersetzt frühere Angebote zum gleichen Sachverhalt. Alle Preise sind in #quote.currency angegeben. Externer Mail-Versand erfolgt ausschließlich nach schriftlicher Freigabe durch den Inhaber.
]

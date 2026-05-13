---
real: 2026-05-13T21:10:00Z
sim:  Day 4, 14:00
ticket: TCK-20260513-0001
phase: Design
type: wireframe-detail
screen: slot-picker
author: "020 Omar Abadi"
status: "DRAFT v1 — for Belkis at status slot"
---

# Wireframe · Slot-Picker (kritischster Kunden-Screen)

Der Slot-Picker ist das Herzstück des Kunden-Buchungs-Flows. Wenn er nicht intuitiv ist, springen Kunden ab.

## Mobile Layout (Default — mobile-first)

```
┌─────────────────────────────┐  ┐
│ ←  Mariana Friseure         │  │ Header (sticky)
│    Schritt 3 / 4: Termin    │  │
├─────────────────────────────┤  ┘
│ ⚙ Haarschnitt + Bart  · 60' │  ◀ Service summary
│ 👤 Beliebiger Mitarbeiter   │
├─────────────────────────────┤
│  ◀  Mai 2026             ▶  │  ◀ Month nav
├─────────────────────────────┤
│ Mo Di Mi Do Fr Sa So         │
│ 12 13 14 15 16 17 18         │  ◀ Day picker
│ ●  ●  ●  ⚪ ⚪ ❌ ❌         │      ● = slots verfügbar
│ 19 20 21 22 23 24 25         │      ⚪ = nicht verfügbar
│ ●  ●  ●  ●  ●  ❌ ❌         │      ❌ = geschlossen
├─────────────────────────────┤
│ Dienstag, 13. Mai 2026       │  ◀ Selected day
├─────────────────────────────┤
│  Vormittag                   │
│  ┌──────┐ ┌──────┐ ┌──────┐ │
│  │ 09:00│ │ 09:30│ │ 10:00│ │
│  └──────┘ └──────┘ └──────┘ │
│  ┌──────┐ ┌──────┐           │
│  │ 10:30│ │ 11:00│           │
│  └──────┘ └──────┘           │
│                              │
│  Nachmittag                  │
│  ┌──────┐ ┌──────┐ ┌──────┐ │
│  │ 13:00│ │ 13:30│ │ 14:30│ │
│  └──────┘ └──────┘ └──────┘ │
│  ┌──────┐                    │
│  │ 16:30│ 🔥 letzter freier  │
│  └──────┘                    │
├─────────────────────────────┤
│                              │
│  💡 Tipp: heute noch frei →  │
│      [16:30 wählen]          │
│                              │
└─────────────────────────────┘
```

## Desktop Layout (≥ 768px — 3-Spalten)

```
┌────────────────────────────────────────────────────────────────────────┐
│  ←  Mariana Friseure                          Schritt 3 / 4: Termin     │
├────────────────────────────────────────────────────────────────────────┤
│ ⚙ Haarschnitt + Bart  · 60 Min  · 65 €    👤 Beliebiger Mitarbeiter    │
├──────────────────┬─────────────────────────────────────────────────────┤
│  Kalender         │  Verfügbare Slots am Dienstag, 13. Mai 2026         │
│                   │                                                      │
│  ◀ Mai 2026 ▶    │  Vormittag                                          │
│                   │  [09:00] [09:30] [10:00] [10:30] [11:00]            │
│  Mo Di Mi Do Fr   │                                                      │
│  Sa So            │  Nachmittag                                         │
│                   │  [13:00] [13:30] [14:30] [16:30 🔥]                  │
│  12 13 14 15 16   │                                                      │
│  17 18            │  💡 16:30 ist der letzte freie Slot heute            │
│                   │     bei Mariana Friseure                            │
│  ● 19 20 21       │                                                      │
│  22 23 24 25      │                                                      │
│                   │                                                      │
└──────────────────┴─────────────────────────────────────────────────────┘
```

## Verhalten

- **Slot tippen** → Bestätigungs-Dialog: „16:30 mit Maria (Beliebiger MA: Maria zugeordnet) buchen?"
- **OK** → API call `POST /api/v1/bookings` mit Idempotency-Key
- **409 Conflict** (Slot in Millisekunden vergeben) → Toast: „Slot leider gerade vergeben. Hier sind die nächsten 3 Alternativen: [...]"
- **Erfolg** → Weiter zu Schritt 4 (Daten / Bestätigung)

## Visuelle Hinweise

- Verfügbarer Slot: solid (Brand-Farbe Salon, mind. 3:1 Kontrast für AA)
- Hover-State: Akzent
- Selected: gefüllt + Border-Highlight
- Letzter-Slot-heute-Indikator: 🔥 oder „letzter freier"
- Nächster-Vorschlag bei Konflikt: ghosted/animiert

## Accessibility (WCAG AA pro SOW §3.1.22)

- Slot-Buttons als `<button>` mit `aria-label="Slot 16:30, beliebiger Mitarbeiter"`
- Keyboard-Navigation: Pfeiltasten zwischen Slots, Enter/Space zum Auswählen
- Visible Focus-Ring (2px brand color, 2px offset)
- Screen-Reader: jeder Slot kommuniziert Tag + Zeit + Mitarbeiter
- Live-Region für „Slot vergeben"-Toast

## Edge Cases

| Case | Verhalten |
|------|-----------|
| Keine Slots im gewählten Zeitraum | Empty-State: „Leider keine freien Termine in dieser Woche. Nächste verfügbare: 22. Mai." + auto-jump |
| Slot wird beim Tippen gerade vergeben (race) | 409 Conflict → 3 Alternativen anbieten |
| Salon geschlossen am Tag | Tag grau, nicht klickbar |
| Mitarbeiter krank kurzfristig | bei Auswahl „spezifischer Mitarbeiter" → Hinweis und Vorschlag „beliebiger Mitarbeiter" |
| Buchung außerhalb Vorlaufzeit | Slot nicht angezeigt (Frontend) + Backend lehnt zusätzlich ab |
| User-Storno < min Vorlauf | Storno-Button disabled mit Tooltip „Bitte rufe den Salon direkt an: 0711 ..." |

## Performance-Ziele

- Initial Render: < 100ms (Server-Side Render)
- Day-Wechsel: < 50ms (Client-Side, Daten vorgeladen)
- Slot-Auswahl → Bestätigungsdialog: < 30ms
- Buchungs-Commit: < 500ms p99

## Nächste Schritte

- Click-Prototype in Figma (Day 6)
- User-Test mit 3 Tester:innen aus Korynth-Labs-Team simuliert (Day 8)
- Iteration v2 bei Bedarf (Day 10)
- Implementation als React-Komponente in Sprint 3 (Build-Phase)

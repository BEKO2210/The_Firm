---
real: 2026-05-13T20:50:00Z
sim:  Day 3, 14:30 (Sprint 1 · Q1 2026)
ticket: TCK-20260513-0001
phase: Design
type: information-architecture
version: v1
author: "020 Omar Abadi (Designer)"
status: "DRAFT — for principal review at status slot"
---

# Sitemap v1 — Korynth Bookings (MVP Scope)

## Domain-Struktur

```
korynth-bookings.de
├── app.korynth-bookings.de          ← Plattform-Marketing + Super-Admin
│   ├── /                            Landing (Marketing zur Plattform)
│   ├── /preise                      Tarif-Übersicht
│   ├── /datenschutz                 DSGVO + Impressum
│   ├── /ai-ethik                    KI-Ethik-Statement (public)
│   ├── /transparenz                 Annual Reports + Audits (public)
│   └── /admin                       Super-Admin (Login required)
│       ├── /salons                  Liste aller Salons
│       ├── /salons/<id>             Salon-Detail + suspend/restore
│       ├── /tarife                  Tarif-Verwaltung
│       └── /metriken                System-weite Metriken
│
└── <salon-slug>.korynth-bookings.de  ← Salon-Subdomain (pro Mandant)
    ├── /                            Salon-Landing + Buchung
    │   ├── /                        Salon-Profil + Service-Liste
    │   ├── /buchen                  Buchungsflow
    │   │   ├── Service wählen
    │   │   ├── Mitarbeiter (any / specific)
    │   │   ├── Termin wählen (Slot-Picker)
    │   │   └── Bestätigung (registriert / Gast)
    │   ├── /meine-buchungen         Login required (oder Magic-Link für Gäste)
    │   └── /buchung/<id>            Buchungs-Detail (storno, umbuchen)
    └── /admin                       Salon-Owner / Mitarbeiter (Login required)
        ├── /dashboard               Tages-Overview, KPIs, offene Aufgaben
        ├── /kalender                Tag / Woche / Monat / pro-Mitarbeiter
        ├── /buchungen               Liste mit Filter + Status
        ├── /mitarbeiter             CRUD + Skills + Arbeitszeiten + Urlaub
        ├── /leistungen              Services + Pakete CRUD
        ├── /kunden                  CRM mit Suche + Filter
        │   └── /kunden/<id>         Kunden-Detail + DSGVO-Tools
        ├── /reporting               Buchungen, Auslastung, Top-Leistungen
        └── /einstellungen           Profil, Branding, Öffnungszeiten, Storno-Regeln
```

## Screen-Inventar (MVP)

### Kunde (responsive Web, mobile-first)

| Screen | Priorität | Wireframe-Status |
|--------|:---------:|:----------------:|
| Salon-Landing (Profil + Bilder + Service-Liste) | P0 | in Arbeit |
| Buchungsflow Schritt 1: Service / Paket | P0 | Skelett |
| Buchungsflow Schritt 2: Mitarbeiter | P0 | Skelett |
| Buchungsflow Schritt 3: Slot-Picker (Kalender) | P0 | **kritisch — heute Detail** |
| Buchungsflow Schritt 4: Daten / Bestätigung | P0 | Skelett |
| Bestätigungs-Screen + Email-Link | P0 | Skelett |
| Eigene Buchungen (mit Storno/Umbuchung) | P0 | Skelett |
| Login / Registrierung | P0 | Skelett |
| Gast-Buchung-Magic-Link-Landing | P0 | Skelett |
| Datenschutz / Impressum (Salon-spezifisch) | P0 | Template |

### Salon-Admin (responsive Web, Desktop-first aber mobile-tauglich)

| Screen | Priorität | Wireframe-Status |
|--------|:---------:|:----------------:|
| Dashboard (Tages-Overview) | P0 | Skelett |
| Kalender Tag/Woche/Monat | P0 | **kritisch — Drag-and-Drop** |
| Kalender pro Mitarbeiter | P0 | Skelett |
| Buchungs-Liste mit Status-Workflow | P0 | Skelett |
| Mitarbeiter CRUD + Arbeitszeiten | P0 | Skelett |
| Mitarbeiter Urlaub / Abwesenheit | P0 | Skelett |
| Leistungen + Pakete CRUD | P0 | Skelett |
| Kunden-Liste + Detail | P0 | Skelett |
| DSGVO-Tools (Export, Löschung) | P0 | Skelett |
| Reporting Dashboard | P0 | Skelett |
| Einstellungen (Salon-Profil + Branding) | P0 | Skelett |

### Super-Admin

| Screen | Priorität | Wireframe-Status |
|--------|:---------:|:----------------:|
| Salon-Liste mit Suche/Filter | P0 | Skelett |
| Salon-Detail + Aktionen | P0 | Skelett |
| Tarif-Verwaltung (Stub, voll in Phase 2) | P0 | Skelett |
| System-Metriken | P1 | Skelett |
| Audit-Log-Viewer | P1 | Skelett |

## Design-Tokens (vorläufig)

```
Primary:   #0F172A  (Belkis' brand primary)
Accent:    #3B82F6  (Belkis' brand secondary)
Success:   #10B981  emerald-500
Warning:   #F59E0B  amber-500
Danger:    #EF4444  red-500
Bg-page:   #0A0F1C  (dunkel — passend zum Korynth-Labs-Dashboard)
Bg-card:   rgba(15,23,42,0.7)
Text:      #E2E8F0  (slate-200, AAA-Kontrast)
Muted:     #94A3B8  (slate-400)

Font: Inter Variable (oder system-ui fallback)
Spacing: 4/8/12/16/24/32/48
Radius: 4/8/12/16 (cards), 9999 (pills)
```

**Hinweis:** Für die **Kundensicht pro Salon** wird das Branding **überschrieben** durch das Salon-eigene Logo + Farben + Bilder (gemäß deiner Anforderung — Plattform-Marke im Kern, Salon-Branding auf Buchungsseite).

## Nächste Schritte

- Day 4–6: Wireframes für alle P0-Screens (Figma)
- Day 6–10: Click-Prototype für Buchungsflow + Admin-Kalender
- Day 10–14: Wireframes für Sekundär-Screens
- Day 24: alle MVP-Wireframes final → M2-Sign-off-Material

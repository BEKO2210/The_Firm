# Firma OS · Dashboard

> Phase-2 MVP. Next.js 16 + React 19 + Tailwind 4 + TypeScript.

## Routen (MVP)

| Pfad | Inhalt |
|------|--------|
| `/` | Home: Firma-Name, Stats, Real/Forecast getrennt, Token-Budget-Gauge |
| `/inbox` | `.firma/inbox/*.md` als Liste |
| `/approvals` | `.firma/approvals/pending/*.yaml` + `decided/*.yaml` |
| `/tokens` | Verbrauch aus `.firma/tokens/runs.jsonl` + Top-Commands + Letzte 20 |

Alle Routen sind **Dynamic Server Components**: sie lesen `.firma/` zur Request-Zeit direkt vom Filesystem. Keine API-Routes, kein Client-State (für MVP).

## Lokal starten

```bash
cd website
npm install      # einmalig
npm run dev      # http://localhost:3000
```

## Production-Build

```bash
npm run build    # build optimized output
npm start        # serve on :3000
```

## Architektur-Entscheidungen

- **App Router** (Next 15+ Standard), keine `pages/`-Reste
- **Server Components** lesen direkt aus `../.firma/` — keine Datenbank, keine API-Layer
- **Tailwind 4** via `@tailwindcss/postcss` + `globals.css`
- **No client JS state** im MVP: alle Daten kommen vom Server. Mutations (Approve/Reject) folgen in einer späteren Iteration als Server Actions.

## Was fehlt (Phase 2.5 / Phase 3)

- [ ] File-Watcher / SSE für Auto-Refresh
- [ ] Server-Action: `/approvals` Approve/Reject mit Audit-Log-Schreibvorgang
- [ ] `/customers`, `/tickets`, `/finance` (aus DASHBOARD.md)
- [ ] Mobile-Drawer-Nav (aktuell flex-wrap)
- [ ] WCAG-AA-Audit mit echtem Tooling

# Token-Cache · rtk-ai Adapter (Phase 2)

> PoC-Infrastruktur, um den Token-Verbrauch zu messen und Wiederhol-Kontext zu cachen.
> Vorbereitet auf [rtk-ai/rtk](https://github.com/rtk-ai/rtk), läuft aber auch ohne externe Dependency.

## Was hier liegt

| Datei | Zweck |
|-------|-------|
| `scripts/firma/lib/token-cache.mjs` | Content-Fingerprint (SHA-256) + Disk-Cache unter `.firma/cache/token-cache/` |
| `scripts/firma/lib/token-log.mjs` | Append-only Run-Log unter `.firma/tokens/runs.jsonl` |
| `scripts/firma/test/smoke-token-cache.mjs` | Smoke-Tests für beide Module |

## Modi des Caches

```js
await openCache({ root, mode })
//   mode: "local"  · Default · eigene SHA-256-Implementierung (kein rtk)
//   mode: "rtk"    · Hook für rtk-ai · noch ohne Backend
//   mode: "noop"   · Cache aus (für Vergleichs-Benchmarks)
```

Die Hook-Stelle für rtk-ai ist explizit markiert (`if (mode === "rtk") { ... }`). Sobald rtk-ai lokal evaluiert und freigegeben ist, wird dort delegiert.

## CLI

```bash
firma token-report                 # default: letzte 7 Tage
firma token-report --period day    # heute
firma token-report --period month  # 30 Tage
firma token-report --period all    # alles
```

Ausgabe-Felder:

- **Runs / Tokens total / Avg per run** — gegen `budget_per_run_default` (4 000) und `_hard_cap` (15 000) aus `state.json`
- **Cache hits / misses / Hit rate** — Cache-Effektivität
- **Cache entries / Bytes / Mode** — Disk-Footprint
- **Top commands by tokens** — Top-10 Treiber

## Run-Schema (`runs.jsonl`)

```json
{
  "ts": "2026-05-13T23:50:00.000Z",
  "command": "status",
  "tokens_in": 200,
  "tokens_out": 80,
  "tokens_total": 280,
  "cache_hits": 2,
  "cache_misses": 1,
  "started_at": null,
  "ended_at": null,
  "meta": {}
}
```

Append-only — alte Einträge werden nie verändert. Rotation/Archivierung später.

## Cache-Schema (`.firma/cache/token-cache/<fingerprint>.json`)

```json
{
  "content": "...",
  "meta": {
    "source": "state.json",
    "stored_at": "2026-05-13T23:50:00.000Z"
  }
}
```

Plus `_stats.json` mit aggregierten Zählern (entries, hits, misses, bytes).

## Was als nächstes kommt

1. **Agent-Hook**: `firma run <agent>` schreibt automatisch in `runs.jsonl`
2. **rtk-ai PoC**: nach Approval `tools/rtk` lokal evaluieren, `mode: "rtk"` aktivieren
3. **State-Reminder-Diff**: nur Delta von `state.json` an LLM senden (M1 aus TOKEN_ECONOMY.md)
4. **Dashboard**: `/tokens`-Seite liest `runs.jsonl` und rendert Gauge

Details zum vollen Spar-Plan: [docs/TOKEN_ECONOMY.md](TOKEN_ECONOMY.md).

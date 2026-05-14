// Firma OS · Mission Control · KPI-Karte
//
// Standard-Schema (KPI-Card-Best-Practice): Label → Wert → Δ → Zeitraum.
// Ampel-Status grün/gelb/rot/neutral. Status wird NICHT nur über Farbe
// transportiert — der Δ-Text ("Aktion nötig", "blockiert") trägt die
// Bedeutung mit, der Punkt ist aria-hidden (WCAG 1.4.1).

import Link from "next/link";
import type { Kpi } from "@/lib/firma";

const STATUS_COLOR: Record<Kpi["status"], string> = {
  ok: "var(--color-real)",
  warn: "var(--color-sim)",
  danger: "var(--color-danger)",
  neutral: "var(--color-muted)",
};

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const color = STATUS_COLOR[kpi.status];

  const inner = (
    <div className="card h-full">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-[var(--color-muted)]">{kpi.label}</span>
        <span
          aria-hidden
          className="inline-block w-2 h-2 rounded-full shrink-0"
          style={{ background: color }}
        />
      </div>
      <div
        className="text-2xl font-bold mt-2"
        style={kpi.status === "danger" ? { color } : undefined}
      >
        {kpi.value}
      </div>
      <div className="text-xs mt-1 min-h-[1rem]">
        {kpi.delta ? (
          <span style={{ color }}>{kpi.delta}</span>
        ) : (
          <span className="text-[var(--color-muted)]">▬ keine Vergleichsdaten</span>
        )}
        {kpi.timeframe && <span className="text-[var(--color-muted)]"> · {kpi.timeframe}</span>}
      </div>
    </div>
  );

  return kpi.link ? (
    <Link href={kpi.link} className="block hover:opacity-90 transition-opacity">
      {inner}
    </Link>
  ) : (
    inner
  );
}

// Firma OS · Mission Control (Home)
//
// Das Herzstück: was läuft gerade, was kommt als Nächstes, wo steht es.
// Iteration B.2 — Zone 1 (Status-Zeile) + Zone 2 (JETZT/NÄCHSTES/LETZTES),
// statisch server-side gerendert. Zonen 3-5 (Pipeline, Timeline, Health)
// folgen in B.3/B.5 — bis dahin steht die alte Übersicht darunter.
// Vision: docs/DASHBOARD_VISION.md

import Link from "next/link";
import {
  readState,
  readTokenRuns,
  summarizeRuns,
  getToolStatuses,
  listQuotes,
  getMissionControl,
} from "@/lib/firma";
import { KpiCard } from "@/app/_components/KpiCard";
import {
  JetztColumn,
  NaechstesColumn,
  LetztesColumn,
} from "@/app/_components/MissionColumns";

export const dynamic = "force-dynamic";

function fmt(n: number) {
  return n.toLocaleString("de-DE");
}

export default async function HomePage() {
  const state = await readState();

  if (!state) {
    return (
      <div className="card">
        <h1 className="text-2xl font-bold mb-2">Nicht initialisiert</h1>
        <p className="text-[var(--color-muted)]">
          Bitte zuerst{" "}
          <code className="bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded">
            firma init
          </code>{" "}
          im Repo-Root ausführen.
        </p>
      </div>
    );
  }

  const [mc, runs, tools, quotes] = await Promise.all([
    getMissionControl(),
    readTokenRuns(),
    getToolStatuses(),
    listQuotes(),
  ]);
  const sum = summarizeRuns(runs);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {state.firm.name || "Firma OS"}
            </h1>
            <p className="text-[var(--color-muted)] mt-1">
              {state.firm.principal
                ? `Inhaber: ${state.firm.principal}`
                : "Inhaber-Name in .firma/config.yaml setzen"}
              {state.firm.since_real && (
                <>
                  {" "}
                  · seit{" "}
                  {new Date(state.firm.since_real).toLocaleDateString("de-DE")}
                </>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <span className="pill pill-real">● real</span>
            <span className="pill pill-sim">○ forecast</span>
          </div>
        </div>
      </section>

      {/* Zone 1 · Status-Zeile — 5 North-Star-KPIs */}
      <section
        aria-label="Status-Kennzahlen"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
      >
        {mc?.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </section>

      {/* Zone 2 · JETZT / NÄCHSTES / LETZTES */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <JetztColumn events={mc?.jetzt ?? []} />
        <NaechstesColumn items={mc?.naechstes ?? []} />
        <LetztesColumn items={mc?.letztes ?? []} />
      </section>

      {/* Übergangs-Übersicht — wird in B.3/B.5 durch Zonen 3-5
          (Pipeline-Funnel, Timeline-Band, Vier-Säulen-Health) ersetzt. */}
      <section aria-label="Weitere Übersicht" className="space-y-4">
        <h2 className="text-sm font-semibold text-[var(--color-muted)] uppercase tracking-wide">
          Weitere Übersicht
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <header className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Finance · real</h3>
              <span className="pill pill-real">real</span>
            </header>
            <Row k="Bank-Account" v={state.real.bank_account ? "verbunden" : "—"} />
            <Row k="Stripe" v={state.real.stripe_account ? "verbunden" : "—"} />
            <Row
              k="Monatsumsatz"
              v={`${fmt(state.real.monthly_revenue_eur)} EUR`}
            />
            <Row k="Customers (real)" v={state.real.customers.length} />
            <Row
              k="Engagements aktiv"
              v={state.real.active_engagements.length}
            />
            <Row
              k="Offene Rechnungen"
              v={state.real.outstanding_invoices.length}
            />
          </div>
          <div className="card">
            <header className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Finance · forecast</h3>
              <span className="pill pill-sim">forecast</span>
            </header>
            <p className="text-xs text-[var(--color-muted)] mb-3">
              {state.sim._warning}
            </p>
            <Row
              k="Umsatz Monat 3 (Plan)"
              v={`${fmt(state.sim.forecast_revenue_eur_month_3)} EUR`}
            />
            <Row
              k="Kosten Monat 3 (Plan)"
              v={`${fmt(state.sim.forecast_costs_eur_month_3)} EUR`}
            />
            <Row
              k="Szenarien"
              v={state.sim.planning_scenarios.join(" · ")}
            />
          </div>
        </div>

        <div className="card">
          <header className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Token-Budget heute</h3>
            <Link
              href="/tokens"
              className="text-sm text-[var(--color-accent-text)] hover:underline"
            >
              Details →
            </Link>
          </header>
          <Gauge
            spent={state.tokens.spend_today}
            budget={state.tokens.budget_per_run_default}
            cap={state.tokens.budget_per_run_hard_cap}
          />
          <p className="text-sm text-[var(--color-muted)] mt-3">
            Sessions: {sum.total_runs} · Total Tokens: {fmt(sum.total_tokens)} ·
            Cache hit-rate:{" "}
            {sum.hit_rate === null
              ? "—"
              : `${(sum.hit_rate * 100).toFixed(1)}%`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <header className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Tools</h3>
              <Link
                href="/tools"
                className="text-sm text-[var(--color-accent-text)] hover:underline"
              >
                Details →
              </Link>
            </header>
            <ul className="space-y-1.5 text-sm">
              {tools.map((t) => (
                <li
                  key={t.name}
                  className="flex items-center justify-between"
                >
                  <span className="font-medium">{t.name}</span>
                  <span
                    className={
                      t.installed
                        ? "text-[var(--color-real)]"
                        : "text-[var(--color-danger)]"
                    }
                  >
                    {t.installed ? "● " + (t.version ?? "ok") : "○ fehlt"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <header className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Reports</h3>
              <Link
                href="/reports"
                className="text-sm text-[var(--color-accent-text)] hover:underline"
              >
                Details →
              </Link>
            </header>
            <div className="text-sm space-y-1.5">
              <div className="flex justify-between">
                <span>Angebote</span>
                <span className="font-medium">{quotes.length}</span>
              </div>
              {quotes.slice(0, 3).map((q) => (
                <div
                  key={q.id}
                  className="text-xs text-[var(--color-muted)] truncate"
                >
                  {q.id} · {q.customer ?? "?"} · {q.total ?? "—"}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-[var(--color-border)] last:border-0 text-sm">
      <span className="text-[var(--color-muted)]">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}

function Gauge({
  spent,
  budget,
  cap,
}: {
  spent: number;
  budget: number;
  cap: number;
}) {
  const pctOfBudget = budget > 0 ? Math.min(1, spent / budget) : 0;
  const pctOfCap = cap > 0 ? Math.min(1, spent / cap) : 0;
  const color =
    pctOfBudget >= 1
      ? "var(--color-danger)"
      : pctOfBudget >= 0.8
        ? "var(--color-sim)"
        : "var(--color-real)";
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>
          {fmt(spent)} / {fmt(budget)} (Budget) · cap {fmt(cap)}
        </span>
        <span style={{ color }}>
          {(pctOfBudget * 100).toFixed(0)}% Budget ·{" "}
          {(pctOfCap * 100).toFixed(0)}% Cap
        </span>
      </div>
      <div className="h-3 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
        <div
          className="h-full transition-all"
          style={{ width: `${pctOfCap * 100}%`, background: color }}
        />
      </div>
    </div>
  );
}

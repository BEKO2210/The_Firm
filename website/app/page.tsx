import Link from "next/link";
import { readState, readTokenRuns, summarizeRuns } from "@/lib/firma";

export const dynamic = "force-dynamic";

function fmt(n: number) { return n.toLocaleString("de-DE"); }

export default async function HomePage() {
  const state = await readState();
  const runs = await readTokenRuns();
  const sum = summarizeRuns(runs);

  if (!state) {
    return (
      <div className="card">
        <h1 className="text-2xl font-bold mb-2">Nicht initialisiert</h1>
        <p className="text-[var(--color-muted)]">
          Bitte zuerst <code className="bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded">firma init</code> im Repo-Root ausführen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{state.firm.name || "Firma OS"}</h1>
            <p className="text-[var(--color-muted)] mt-1">
              {state.firm.principal ? `Inhaber: ${state.firm.principal}` : "Inhaber-Name in .firma/config.yaml setzen"}
              {state.firm.since_real && (
                <> · seit {new Date(state.firm.since_real).toLocaleDateString("de-DE")}</>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <span className="pill pill-real">● real</span>
            <span className="pill pill-sim">○ forecast</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label="Inbox unread" value={state.inbox.unread} link="/inbox" />
        <Stat label="Approvals pending" value={state.approvals.pending} link="/approvals" highlight={state.approvals.pending > 0} />
        <Stat label="Tickets offen" value={state.tickets.open + state.tickets.in_progress} sublabel={state.tickets.blocked > 0 ? `${state.tickets.blocked} blocked` : undefined} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <header className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">Finance · real</h2>
            <span className="pill pill-real">real</span>
          </header>
          <Row k="Bank-Account" v={state.real.bank_account ? "verbunden" : "—"} />
          <Row k="Stripe" v={state.real.stripe_account ? "verbunden" : "—"} />
          <Row k="Monatsumsatz" v={`${fmt(state.real.monthly_revenue_eur)} EUR`} />
          <Row k="Customers (real)" v={state.real.customers.length} />
          <Row k="Engagements aktiv" v={state.real.active_engagements.length} />
          <Row k="Offene Rechnungen" v={state.real.outstanding_invoices.length} />
        </div>
        <div className="card">
          <header className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">Finance · forecast</h2>
            <span className="pill pill-sim">forecast</span>
          </header>
          <p className="text-xs text-[var(--color-muted)] mb-3">{state.sim._warning}</p>
          <Row k="Umsatz Monat 3 (Plan)" v={`${fmt(state.sim.forecast_revenue_eur_month_3)} EUR`} />
          <Row k="Kosten Monat 3 (Plan)" v={`${fmt(state.sim.forecast_costs_eur_month_3)} EUR`} />
          <Row k="Szenarien" v={state.sim.planning_scenarios.join(" · ")} />
        </div>
      </section>

      <section className="card">
        <header className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Token-Budget heute</h2>
          <Link href="/tokens" className="text-sm text-[var(--color-accent)] hover:underline">Details →</Link>
        </header>
        <Gauge spent={state.tokens.spend_today} budget={state.tokens.budget_per_run_default} cap={state.tokens.budget_per_run_hard_cap} />
        <p className="text-sm text-[var(--color-muted)] mt-3">
          Sessions: {sum.total_runs} · Total Tokens: {fmt(sum.total_tokens)} · Cache hit-rate: {sum.hit_rate === null ? "—" : `${(sum.hit_rate * 100).toFixed(1)}%`}
        </p>
      </section>
    </div>
  );
}

function Stat({ label, value, sublabel, link, highlight }: { label: string; value: number; sublabel?: string; link?: string; highlight?: boolean }) {
  const inner = (
    <div className="card h-full">
      <div className="text-sm text-[var(--color-muted)]">{label}</div>
      <div className={`text-3xl font-bold mt-1 ${highlight ? "text-[var(--color-danger)]" : ""}`}>{value}</div>
      {sublabel && <div className="text-xs text-[var(--color-muted)] mt-1">{sublabel}</div>}
    </div>
  );
  return link ? <Link href={link} className="block hover:opacity-90 transition-opacity">{inner}</Link> : inner;
}

function Row({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-[var(--color-border)] last:border-0 text-sm">
      <span className="text-[var(--color-muted)]">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}

function Gauge({ spent, budget, cap }: { spent: number; budget: number; cap: number }) {
  const pctOfBudget = budget > 0 ? Math.min(1, spent / budget) : 0;
  const pctOfCap = cap > 0 ? Math.min(1, spent / cap) : 0;
  const color = pctOfBudget >= 1 ? "var(--color-danger)" : pctOfBudget >= 0.8 ? "var(--color-sim)" : "var(--color-real)";
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{fmt(spent)} / {fmt(budget)} (Budget) · cap {fmt(cap)}</span>
        <span style={{ color }}>{(pctOfBudget * 100).toFixed(0)}% Budget · {(pctOfCap * 100).toFixed(0)}% Cap</span>
      </div>
      <div className="h-3 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
        <div className="h-full transition-all" style={{ width: `${pctOfCap * 100}%`, background: color }} />
      </div>
    </div>
  );
}

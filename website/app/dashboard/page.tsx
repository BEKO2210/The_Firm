import { readFirmState } from "@/lib/firmState";

export const dynamic = "force-dynamic";

function pill(label: string, type: "green" | "amber" | "red" | "blue") {
  return <span className={`pill pill-${type}`}>{label}</span>;
}

function runwayPill(months: number) {
  if (months >= 6) return pill(`${months.toFixed(1)} mo`, "green");
  if (months >= 3) return pill(`${months.toFixed(1)} mo`, "amber");
  return pill(`${months.toFixed(1)} mo`, "red");
}

export default async function DashboardPage() {
  const s = await readFirmState();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Operational Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Day {s.wallclock.firm_day}, {s.wallclock.office_hour} · Sprint {s.wallclock.current_sprint} ·{" "}
          {s.wallclock.current_quarter} {s.wallclock.current_year} · {s.firm.industry}
        </p>
      </header>

      <section className="grid md:grid-cols-4 gap-4">
        <div className="card">
          <div className="metric-label">Headcount</div>
          <div className="metric-value">{s.headcount.total}</div>
          <div className="text-xs text-slate-400 mt-1">All 13 archetypes filled</div>
        </div>
        <div className="card">
          <div className="metric-label">Active Tickets</div>
          <div className="metric-value">{s.tickets.active}/{s.tickets.max_parallel}</div>
          <div className="text-xs text-slate-400 mt-1">Halted: {s.tickets.halted}</div>
        </div>
        <div className="card">
          <div className="metric-label">Bank</div>
          <div className="metric-value">€{(s.finance.bank_eur / 1000).toFixed(0)}k</div>
          <div className="text-xs text-slate-400 mt-1">Burn €{(s.finance.monthly_burn_eur / 1000).toFixed(0)}k/mo</div>
        </div>
        <div className="card">
          <div className="metric-label">Runway</div>
          <div className="metric-value">{runwayPill(s.finance.runway_months)}</div>
          <div className="text-xs text-slate-400 mt-1">Target: 3–12 months adaptive</div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-3">Finance</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-400">Bank balance</dt><dd className="text-white">€{s.finance.bank_eur.toLocaleString()}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Monthly burn</dt><dd className="text-white">€{s.finance.monthly_burn_eur.toLocaleString()}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Monthly payroll</dt><dd className="text-white">€{s.finance.payroll_eur.toLocaleString()}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Margin target</dt><dd className="text-white">{(s.finance.margin_target_pct * 100).toFixed(0)}%</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Runway</dt><dd>{runwayPill(s.finance.runway_months)}</dd></div>
          </dl>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-3">HR</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-400">Promotions due</dt><dd className="text-white">{s.hr.promotions_due}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Hiring open</dt><dd className="text-white">{s.hr.hiring_open}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Burnout ≥ 80</dt><dd className="text-white">{s.hr.burnout_over_80}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">On vacation</dt><dd className="text-white">{s.hr.on_vacation}</dd></div>
          </dl>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-3">OKRs · {s.okr.quarter}</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-400">Objectives</dt><dd className="text-white">{s.okr.objectives_count}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">KRs on track</dt><dd className="text-white">{s.okr.krs_on_track}/{s.okr.krs_total}</dd></div>
          </dl>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-3">Principal Trust Loop</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-400">Principal</dt><dd className="text-white">{s.principal.name}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Language</dt><dd className="text-white">{s.principal.language}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Salutation</dt><dd className="text-white">{s.principal.salutation}</dd></div>
          </dl>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-3">AI Ethics</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-400">Decisions logged</dt><dd className="text-white">{s.ai_ethics.decisions_logged}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Human overrides</dt><dd className="text-white">{s.ai_ethics.human_overrides}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Last bias audit</dt><dd className="text-white">{s.ai_ethics.last_bias_audit_sim}</dd></div>
          </dl>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-3">BCDR + Audit</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-400">Last DR drill</dt><dd className="text-white">{s.bcdr.last_dr_drill_sim}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Backup status</dt><dd>{s.bcdr.backup_status === "ok" ? pill("OK", "green") : pill("Stale", "amber")}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Audit chain</dt><dd>{s.audit.chain_intact ? pill(`${s.audit.chain_entries} entries`, "green") : pill("BROKEN", "red")}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Drift alerts</dt><dd className="text-white">{s.audit.drift_alerts}</dd></div>
          </dl>
        </div>
      </section>

      <section className="text-xs text-slate-500">
        Generated from <code className="text-slate-300">.firm/state.json</code> · real: {s.generated_at_real} · sim: {s.generated_at_sim}
      </section>
    </div>
  );
}

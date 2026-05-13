import { readFirmState, readRoster } from "@/lib/firmState";
export const dynamic = "force-dynamic";

export default async function HrPage() {
  const [s, roster] = await Promise.all([readFirmState(), readRoster()]);
  const totalPayroll = roster.reduce((sum, r) => sum + (r.salary_monthly || 0), 0);
  const bySeniority: Record<string, number> = {};
  for (const r of roster) bySeniority[r.seniority] = (bySeniority[r.seniority] || 0) + 1;
  return (
    <div className="space-y-6">
      <header><h1 className="text-3xl font-bold text-white">HR · {s.headcount.total} employees</h1>
        <p className="text-slate-400 mt-1">Radical salary transparency · max-care vacation · max-co-ownership equity.</p>
      </header>
      <section className="grid md:grid-cols-4 gap-4">
        <div className="card"><div className="metric-label">Total payroll / mo</div><div className="metric-value">€{totalPayroll.toLocaleString()}</div></div>
        <div className="card"><div className="metric-label">Promotions due</div><div className="metric-value">{s.hr.promotions_due}</div></div>
        <div className="card"><div className="metric-label">Burnout ≥ 80</div><div className="metric-value">{s.hr.burnout_over_80}</div></div>
        <div className="card"><div className="metric-label">On vacation</div><div className="metric-value">{s.hr.on_vacation}</div></div>
      </section>
      <section className="card">
        <h2 className="text-lg font-semibold text-white mb-3">Seniority distribution</h2>
        <div className="space-y-2">
          {Object.entries(bySeniority).map(([k,v]) => (
            <div key={k} className="flex items-center gap-3">
              <div className="w-24 text-sm capitalize text-slate-300">{k}</div>
              <div className="flex-1 h-4 bg-slate-800 rounded overflow-hidden">
                <div className="h-full bg-[#3B82F6]" style={{ width: `${(v / s.headcount.total) * 100}%` }} />
              </div>
              <div className="w-12 text-right text-sm text-white">{v}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="card">
        <h2 className="text-lg font-semibold text-white mb-3">Salaries (radical transparency)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-slate-400 text-left"><th>ID</th><th>Name</th><th>Role</th><th>Seniority</th><th className="text-right">EUR / mo</th></tr></thead>
            <tbody>
              {roster.map(e => (
                <tr key={e.id} className="border-t border-slate-800">
                  <td className="py-1 text-slate-500">{e.id}</td>
                  <td className="text-white">{e.name}</td>
                  <td className="text-slate-300">{e.role}</td>
                  <td className="text-slate-400">{e.seniority}</td>
                  <td className="text-right text-emerald-400">€{e.salary_monthly?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

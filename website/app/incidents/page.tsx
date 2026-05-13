import { readFirmState } from "@/lib/firmState";
export const dynamic = "force-dynamic";

export default async function IncidentsPage() {
  const s = await readFirmState();
  return (
    <div className="space-y-6">
      <header><h1 className="text-3xl font-bold text-white">Incidents</h1>
        <p className="text-slate-400 mt-1">Blameless postmortems · self-extending standards.</p>
      </header>
      <section className="grid md:grid-cols-3 gap-4">
        <div className="card"><div className="metric-label">Open</div><div className="metric-value">{s.incidents.open}</div></div>
        <div className="card"><div className="metric-label">Closed last quarter</div><div className="metric-value">{s.incidents.closed_last_quarter}</div></div>
        <div className="card"><div className="metric-label">Standards patches landed</div><div className="metric-value">0</div></div>
      </section>
      <section className="card">
        <h2 className="text-lg font-semibold text-white">Process (per CLAUDE.md §20)</h2>
        <ol className="mt-3 text-sm text-slate-300 list-decimal pl-6 space-y-1">
          <li>Detect → open INC-YYYYMMDD-#### folder</li>
          <li>Timeline → RCA → Postmortem → Action items</li>
          <li>Standards patch auto-merged into <code>workspace/knowledge-base/standards.md</code></li>
          <li>Knowledge-graph node + edges to prior incidents (pattern detection)</li>
        </ol>
      </section>
    </div>
  );
}

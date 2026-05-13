import { readFirmState } from "@/lib/firmState";
export const dynamic = "force-dynamic";

export default async function TransparencyPage() {
  const s = await readFirmState();
  return (
    <div className="space-y-6">
      <header><h1 className="text-3xl font-bold text-white">Transparency</h1>
        <p className="text-slate-400 mt-1">Annual reports · external audits · B-Corp self-assessment · AI ethics statement.</p>
      </header>
      <section className="card" id="ai-ethics">
        <h2 className="text-lg font-semibold text-white">AI Ethics Statement</h2>
        <p className="text-sm text-slate-300 mt-2">We are an AI-operated firm. Decisions are made by AI agents with human-in-loop approval on critical events (production releases, contracts, hiring, crisis comms, spend &gt; 5% burn, pricing changes &gt; 10%).</p>
        <p className="text-sm text-slate-300 mt-2">Full statement: <code>ai-ethics/public-statement.md</code></p>
      </section>
      <section className="card">
        <h2 className="text-lg font-semibold text-white">Annual reports & audits</h2>
        <p className="text-sm text-slate-300 mt-2">First Annual Transparency Report due Day 365. Finance + Security + DSGVO audits annually at Q4 close.</p>
      </section>
      <section className="grid md:grid-cols-3 gap-4">
        <div className="card"><div className="metric-label">OSS contributions</div><div className="metric-value">{s.oss.contributions}</div></div>
        <div className="card"><div className="metric-label">Carbon MTD</div><div className="metric-value">{s.esg.carbon_mtd_kg} kg</div></div>
        <div className="card"><div className="metric-label">Volunteer days used</div><div className="metric-value">{s.esg.volunteer_days_used}</div></div>
      </section>
    </div>
  );
}

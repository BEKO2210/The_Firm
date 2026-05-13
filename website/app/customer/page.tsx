import { readFirmState } from "@/lib/firmState";


export default async function CustomerPage() {
  const s = await readFirmState();
  return (
    <div className="space-y-6">
      <header><h1 className="text-3xl font-bold text-white">Principal: {s.principal.name}</h1>
        <p className="text-slate-400 mt-1">Premium tier · adaptive touchpoints · maximum-care escalation policy.</p>
      </header>
      <section className="grid md:grid-cols-3 gap-4">
        <div className="card"><div className="metric-label">Tier</div><div className="metric-value">Premium</div></div>
        <div className="card"><div className="metric-label">Language</div><div className="metric-value">DE</div></div>
        <div className="card"><div className="metric-label">Churn risk</div><div className="metric-value"><span className="pill pill-green">Green</span></div></div>
      </section>
      <section className="card">
        <h2 className="text-lg font-semibold text-white">Touchpoints (adaptive defaults for Premium)</h2>
        <ul className="mt-3 text-sm space-y-1 text-slate-300">
          <li>· Onboarding (Day 1–14)</li>
          <li>· Delivery emails (per ticket)</li>
          <li>· NPS after every delivery</li>
          <li>· Quarterly Business Review — first on Day 90</li>
          <li>· Success plan review (quarterly)</li>
        </ul>
      </section>
      <section className="card text-sm text-slate-300">
        <h2 className="text-lg font-semibold text-white mb-2">Contact</h2>
        <div>Salutation: {s.principal.salutation}</div>
        <div>Email: {s.principal.email}</div>
        <div className="text-xs text-slate-500 mt-2">All correspondence in DE per Q7. Internal communications stay in English.</div>
      </section>
    </div>
  );
}

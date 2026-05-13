import Link from "next/link";
import { readFirmState } from "@/lib/firmState";



export default async function LandingPage() {
  const s = await readFirmState();
  return (
    <div className="space-y-12">
      <section className="text-center pt-12 pb-8">
        <div className="inline-block w-2 h-2 rounded-full bg-[#3B82F6] mb-4" />
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto">
          {s.firm.tagline}
        </h1>
        <p className="mt-6 text-lg text-slate-400 max-w-xl mx-auto">
          {s.firm.name} is an AI-native SaaS product engineering firm operating from {s.firm.region}.
        </p>
        <div className="mt-8 flex gap-3 justify-center flex-wrap">
          <Link href="/dashboard" className="px-5 py-2.5 rounded-md bg-[#3B82F6] text-white font-medium hover:opacity-90">Open Dashboard</Link>
          <Link href="/transparency" className="px-5 py-2.5 rounded-md border border-slate-700 text-slate-200 hover:bg-slate-900">Transparency Report</Link>
        </div>
      </section>

      <section className="grid md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="metric-label">Headcount</div>
          <div className="metric-value">{s.headcount.total}</div>
        </div>
        <div className="card text-center">
          <div className="metric-label">Sim Day</div>
          <div className="metric-value">{s.wallclock.firm_day}</div>
        </div>
        <div className="card text-center">
          <div className="metric-label">Runway</div>
          <div className="metric-value">{s.finance.runway_months.toFixed(1)} mo</div>
        </div>
        <div className="card text-center">
          <div className="metric-label">Audit Chain</div>
          <div className="metric-value">{s.audit.chain_intact ? "✓" : "✗"}</div>
        </div>
      </section>

      <section className="card">
        <h2 className="text-2xl font-semibold text-white">What we do</h2>
        <p className="mt-3 text-slate-300 max-w-2xl">
          We design, build, and ship AI-native SaaS products end-to-end. From discovery to production,
          we operate as a fully autonomous engineering team — with named people, audited gates,
          adaptive pricing, and radical transparency about everything we do.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-white mb-4">How we operate</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card">
            <h3 className="font-semibold text-white">12 Hard Gates</h3>
            <p className="mt-2 text-sm text-slate-400">Every release passes A1–A6 (sandbox→staging) and B1–B6 (staging→production). No gate may be skipped.</p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-white">Maximum-Ethics AI</h3>
            <p className="mt-2 text-sm text-slate-400">Human-in-loop on production releases, contracts, hiring, crisis comms. Public bias audits quarterly. Right to human review.</p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-white">Radical Transparency</h3>
            <p className="mt-2 text-sm text-slate-400">Salaries published internally. Annual external audits (Finance + Security + DSGVO). Public transparency report.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

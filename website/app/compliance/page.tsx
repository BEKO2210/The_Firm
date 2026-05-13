import { readFirmState } from "@/lib/firmState";
export const dynamic = "force-dynamic";

export default async function CompliancePage() {
  const s = await readFirmState();
  return (
    <div className="space-y-6">
      <header><h1 className="text-3xl font-bold text-white">Compliance</h1>
        <p className="text-slate-400 mt-1">DSGVO + EU AI Act + SOC 2 + ISO 27001 + AVV. Maximum-transparency audit level.</p>
      </header>
      <section className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="text-lg font-semibold text-white">DSGVO + Industry Overlays</h2>
          <ul className="mt-3 text-sm space-y-1 text-slate-300">
            <li>✓ VVT maintained (4 initial processing activities)</li>
            <li>✓ DPO assigned</li>
            <li>· DPIA: as-needed at triage</li>
            <li>· AVV: required before first sub-processor used in production</li>
          </ul>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold text-white">AI Ethics</h2>
          <dl className="mt-3 text-sm space-y-1">
            <div className="flex justify-between"><dt className="text-slate-400">Public statement</dt><dd className="text-emerald-400">published</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Decisions logged</dt><dd className="text-white">{s.ai_ethics.decisions_logged}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Human overrides</dt><dd className="text-white">{s.ai_ethics.human_overrides}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Last bias audit</dt><dd className="text-white">{s.ai_ethics.last_bias_audit_sim}</dd></div>
          </dl>
        </div>
      </section>
    </div>
  );
}

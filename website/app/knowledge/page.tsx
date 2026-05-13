import { readFirmState } from "@/lib/firmState";


export default async function KnowledgePage() {
  const s = await readFirmState();
  return (
    <div className="space-y-6">
      <header><h1 className="text-3xl font-bold text-white">Knowledge Graph</h1>
        <p className="text-slate-400 mt-1">Concepts · decisions · learnings · patterns · people. Auto-decay at 180 sim-days.</p>
      </header>
      <section className="grid md:grid-cols-3 gap-4">
        <div className="card"><div className="metric-label">Nodes</div><div className="metric-value">{s.knowledge.nodes}</div></div>
        <div className="card"><div className="metric-label">Edges</div><div className="metric-value">{s.knowledge.edges}</div></div>
        <div className="card"><div className="metric-label">Stale flags</div><div className="metric-value">{s.knowledge.stale_flags}</div></div>
      </section>
      <section className="card">
        <h2 className="text-lg font-semibold text-white">Sources</h2>
        <p className="text-sm text-slate-300 mt-2">Auto-creates from: spec docs (Discovery), ADRs (Design), postmortems → learnings, retros → process-improvement nodes, peer-review comments → patterns.</p>
      </section>
    </div>
  );
}

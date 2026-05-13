import { readRoster, readFirmState } from "@/lib/firmState";


export default async function TeamPage() {
  const [s, roster] = await Promise.all([readFirmState(), readRoster()]);
  const byArchetype: Record<string, typeof roster> = {};
  for (const e of roster) {
    (byArchetype[e.archetype] = byArchetype[e.archetype] || []).push(e);
  }
  const order = ["leader","strategist","coordinator","maker","reviewer","guardian","mentor","communicator","caretaker","recorder","critic","operator","releaser"];
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Team · {s.headcount.total} employees</h1>
        <p className="text-slate-400 mt-1">Dynamic org chart from <code>.firm/employees/_roster.yaml</code>. All 13 archetypes represented.</p>
      </header>
      {order.filter(a => byArchetype[a]).map(arc => (
        <section key={arc} className="card">
          <h2 className="text-lg font-semibold text-white capitalize">{arc} ({byArchetype[arc].length})</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
            {byArchetype[arc].map(e => (
              <div key={e.id} className="text-sm p-2 rounded bg-slate-900/50 border border-slate-800">
                <div className="text-white font-medium">{e.name}</div>
                <div className="text-slate-400 text-xs">{e.role} · {e.seniority}</div>
                <div className="text-slate-500 text-xs mt-1">{e.department}</div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

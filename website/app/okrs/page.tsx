import { promises as fs } from "fs";
import path from "path";
import { readFirmState } from "@/lib/firmState";


export default async function OkrsPage() {
  const s = await readFirmState();
  let okrText = "";
  try {
    okrText = await fs.readFile(path.resolve(process.cwd(), "..", "okrs", `Q1-${s.wallclock.current_year}.md`), "utf-8");
  } catch {}
  return (
    <div className="space-y-6">
      <header><h1 className="text-3xl font-bold text-white">OKRs · {s.okr.quarter} {s.wallclock.current_year}</h1></header>
      <section className="grid md:grid-cols-3 gap-4">
        <div className="card"><div className="metric-label">Objectives</div><div className="metric-value">{s.okr.objectives_count}</div></div>
        <div className="card"><div className="metric-label">KRs on track</div><div className="metric-value">{s.okr.krs_on_track}/{s.okr.krs_total}</div></div>
        <div className="card"><div className="metric-label">15% time allocation</div><div className="metric-value">non-execs</div></div>
      </section>
      <section className="card">
        <h2 className="text-lg font-semibold text-white mb-3">Q1 Plan (full text)</h2>
        <pre className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">{okrText}</pre>
      </section>
    </div>
  );
}

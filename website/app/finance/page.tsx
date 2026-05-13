import { readFirmState } from "@/lib/firmState";
import { promises as fs } from "fs";
import path from "path";
export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const s = await readFirmState();
  let ledger: Array<any> = [];
  try {
    const raw = await fs.readFile(path.resolve(process.cwd(), "..", "finance", "ledger.jsonl"), "utf-8");
    ledger = raw.trim().split("\n").filter(Boolean).map(l => JSON.parse(l));
  } catch {}
  return (
    <div className="space-y-6">
      <header><h1 className="text-3xl font-bold text-white">Finance</h1>
        <p className="text-slate-400 mt-1">Adaptive pricing · autonomous margin · live ledger.</p>
      </header>
      <section className="grid md:grid-cols-4 gap-4">
        <div className="card"><div className="metric-label">Bank</div><div className="metric-value">€{s.finance.bank_eur.toLocaleString()}</div></div>
        <div className="card"><div className="metric-label">Burn / mo</div><div className="metric-value">€{s.finance.monthly_burn_eur.toLocaleString()}</div></div>
        <div className="card"><div className="metric-label">Runway</div><div className="metric-value">{s.finance.runway_months.toFixed(1)} mo</div></div>
        <div className="card"><div className="metric-label">Margin target</div><div className="metric-value">{(s.finance.margin_target_pct * 100).toFixed(0)}%</div></div>
      </section>
      <section className="card">
        <h2 className="text-lg font-semibold text-white">Ledger ({ledger.length} entries)</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-slate-400 text-left"><th>Seq</th><th>Sim</th><th>Type</th><th>Account</th><th className="text-right">Amount EUR</th><th>Memo</th></tr></thead>
            <tbody>
              {ledger.map(e => (
                <tr key={e.seq} className="border-t border-slate-800">
                  <td className="py-1">{e.seq}</td><td className="text-slate-300">{e.sim}</td><td>{e.type}</td><td>{e.account}</td>
                  <td className={"text-right " + (e.amount >= 0 ? "text-emerald-400" : "text-rose-400")}>€{e.amount.toLocaleString()}</td>
                  <td className="text-slate-400 text-xs">{e.memo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

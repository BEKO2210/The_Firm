import { readState, readTokenRuns, summarizeRuns } from "@/lib/firma";

export const dynamic = "force-dynamic";

function fmt(n: number) { return n.toLocaleString("de-DE"); }

export default async function TokensPage() {
  const state = await readState();
  const runs = await readTokenRuns();
  const sum = summarizeRuns(runs);
  const budget = state?.tokens.budget_per_run_default ?? 4000;
  const cap = state?.tokens.budget_per_run_hard_cap ?? 15000;

  const last20 = runs.slice(-20).reverse();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tokens</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Verbrauch aus <code className="bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded">.firma/tokens/runs.jsonl</code>
          </p>
        </div>
        <div className="text-sm text-[var(--color-muted)]">Budget {fmt(budget)} · Cap {fmt(cap)}</div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card label="Runs" value={fmt(sum.total_runs)} />
        <Card label="Tokens total" value={fmt(sum.total_tokens)} />
        <Card label="Cache hit-rate" value={sum.hit_rate === null ? "—" : `${(sum.hit_rate * 100).toFixed(1)}%`} sub={`${sum.cache_hits} hits · ${sum.cache_misses} misses`} />
      </section>

      <section className="card">
        <h2 className="font-semibold mb-3">Top commands by tokens</h2>
        {sum.by_command.length === 0 ? (
          <p className="text-[var(--color-muted)] text-sm">Noch keine Runs erfasst. Sobald <code className="bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded">firma run &lt;agent&gt;</code> oder die CLI Token loggt, erscheinen Daten hier.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--color-muted)] border-b border-[var(--color-border)]">
                <th className="py-2">Command</th>
                <th className="text-right">Runs</th>
                <th className="text-right">Tokens</th>
                <th className="text-right">Ø</th>
              </tr>
            </thead>
            <tbody>
              {sum.by_command.slice(0, 10).map((c) => (
                <tr key={c.command} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="py-2 font-mono">{c.command}</td>
                  <td className="text-right">{fmt(c.runs)}</td>
                  <td className="text-right">{fmt(c.tokens)}</td>
                  <td className="text-right">{c.runs > 0 ? fmt(Math.round(c.tokens / c.runs)) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="card">
        <h2 className="font-semibold mb-3">Letzte 20 Runs</h2>
        {last20.length === 0 ? (
          <p className="text-[var(--color-muted)] text-sm">Keine Runs.</p>
        ) : (
          <ul className="space-y-1 text-sm font-mono">
            {last20.map((r, i) => (
              <li key={`${r.ts}-${i}`} className="flex justify-between border-b border-[var(--color-border)] last:border-0 py-1">
                <span className="text-[var(--color-muted)]">{new Date(r.ts).toLocaleString("de-DE")}</span>
                <span>{r.command}</span>
                <span className="font-semibold">{fmt(r.tokens_total ?? 0)} tok</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card">
      <div className="text-sm text-[var(--color-muted)]">{label}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
      {sub && <div className="text-xs text-[var(--color-muted)] mt-1">{sub}</div>}
    </div>
  );
}

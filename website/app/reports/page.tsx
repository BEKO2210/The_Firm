import { listQuotes, listBenchmarks } from "@/lib/firma";

export const dynamic = "force-dynamic";

function fmtSize(b: number | null) {
  if (b == null) return "—";
  return b < 1024 ? `${b} B` : `${(b / 1024).toFixed(1)} KB`;
}

export default async function ReportsPage() {
  const quotes = await listQuotes();
  const benchmarks = await listBenchmarks();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Generierte PDFs (Angebote, Rechnungen) + Benchmark-Snapshots als Repo-Belege.
        </p>
      </header>

      <section>
        <header className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Angebote · .firma/finance/quotes/</h2>
          <span className="text-xs text-[var(--color-muted)]">{quotes.length} quote{quotes.length === 1 ? "" : "s"}</span>
        </header>
        {quotes.length === 0 ? (
          <div className="card text-[var(--color-muted)] text-sm">
            Keine Angebote. Erzeugen mit{" "}
            <code className="bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded">
              firma report quote --data &lt;json&gt; --out &lt;pdf&gt;
            </code>
          </div>
        ) : (
          <ul className="space-y-2">
            {quotes.map((q) => (
              <li key={q.id} className="card">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-semibold">{q.id}</span>
                      {q.pdf_relpath ? (
                        <span className="pill pill-real">● PDF</span>
                      ) : (
                        <span className="pill pill-danger">○ kein PDF</span>
                      )}
                      {q.created_at && <span className="text-xs text-[var(--color-muted)]">{q.created_at}</span>}
                    </div>
                    {q.subject && <div className="text-sm">{q.subject}</div>}
                    {q.customer && <div className="text-xs text-[var(--color-muted)]">→ {q.customer}</div>}
                  </div>
                  <div className="text-right text-sm space-y-1">
                    {q.total && <div className="font-semibold">{q.total}</div>}
                    {q.pdf_relpath && (
                      <div className="text-xs text-[var(--color-muted)] font-mono">
                        {fmtSize(q.pdf_size)} · {q.pdf_relpath}
                      </div>
                    )}
                    {q.data_relpath && (
                      <div className="text-xs text-[var(--color-muted)] font-mono">
                        data: {q.data_relpath}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <header className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Benchmark-Snapshots · docs/benchmarks/</h2>
          <span className="text-xs text-[var(--color-muted)]">{benchmarks.length} snapshot{benchmarks.length === 1 ? "" : "s"}</span>
        </header>
        {benchmarks.length === 0 ? (
          <div className="card text-[var(--color-muted)] text-sm">
            Noch keine Snapshots. Erzeugen via{" "}
            <code className="bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded">npm run bench:rtk</code>{" "}
            oder{" "}
            <code className="bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded">npm run bench:icm</code>
          </div>
        ) : (
          <ul className="space-y-2">
            {benchmarks.map((b) => (
              <li key={b.filename} className="card">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="font-mono text-sm font-semibold">{b.filename}</div>
                    {b.schema && <div className="text-xs text-[var(--color-muted)] mt-1">schema: {b.schema}</div>}
                    {b.timestamp && (
                      <div className="text-xs text-[var(--color-muted)]">
                        {new Date(b.timestamp).toLocaleString("de-DE")}
                      </div>
                    )}
                  </div>
                  <pre
                    tabIndex={0}
                    aria-label={`Totals für ${b.filename}`}
                    className="text-xs bg-[var(--color-surface-2)] p-2 rounded max-w-xs overflow-x-auto"
                  >
                    {JSON.stringify(b.totals, null, 2)}
                  </pre>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

import { listFiles } from "@/lib/firma";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const pending = await listFiles("approvals/pending", ".yaml");
  const decided = await listFiles("approvals/decided", ".yaml");

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Approvals</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Hard-Stop-Rule: keine externe Aktion ohne schriftliche Freigabe.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="pill pill-danger">{pending.length} pending</span>
          <span className="pill" style={{ color: "var(--color-muted)" }}>{decided.length} decided</span>
        </div>
      </header>

      <section>
        <h2 className="font-semibold mb-3">Pending</h2>
        {pending.length === 0 ? (
          <div className="card text-[var(--color-muted)]">Keine offenen Approvals.</div>
        ) : (
          <ul className="space-y-2">
            {pending.map((f) => (
              <li key={f} className="card flex items-center justify-between gap-3 flex-wrap">
                <span className="font-mono text-sm">{f}</span>
                <code className="text-xs bg-[var(--color-surface-2)] px-2 py-1 rounded">firma approve {f.replace(/\.yaml$/, "")}</code>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-semibold mb-3">Decided</h2>
        {decided.length === 0 ? (
          <div className="card text-[var(--color-muted)]">Noch keine Entscheidungen.</div>
        ) : (
          <ul className="space-y-2">
            {decided.map((f) => (
              <li key={f} className="card text-sm font-mono">{f}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

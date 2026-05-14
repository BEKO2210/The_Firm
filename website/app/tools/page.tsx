import { getToolStatuses } from "@/lib/firma";

export const dynamic = "force-dynamic";

export default async function ToolsPage() {
  const tools = await getToolStatuses();
  const installed = tools.filter((t) => t.installed).length;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tools</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Status der integrierten Bausteine. Detection läuft live beim Seitenaufruf.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="pill pill-real">{installed}/{tools.length} installiert</span>
        </div>
      </header>

      <ul className="space-y-3">
        {tools.map((t) => (
          <li key={t.name} className="card">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="font-semibold text-lg">{t.name}</h2>
                  {t.installed ? (
                    <span className="pill pill-real">● installiert</span>
                  ) : (
                    <span className="pill pill-danger">○ fehlt</span>
                  )}
                  <span className="text-xs text-[var(--color-muted)]">License: {t.license}</span>
                </div>
                <p className="text-sm text-[var(--color-muted)]">{t.role}</p>
                {t.version && (
                  <p className="text-sm font-mono text-[var(--color-text)]">{t.version}</p>
                )}
                {t.binary && (
                  <p className="text-xs font-mono text-[var(--color-muted)]">{t.binary}</p>
                )}
              </div>
              <div className="text-right space-y-1 text-sm">
                {!t.installed && (
                  <code className="bg-[var(--color-surface-2)] px-2 py-1 rounded text-xs whitespace-nowrap">
                    {t.install_cmd}
                  </code>
                )}
                <div>
                  <a href={`/docs/${t.docs.replace(/^docs\//, "")}`} className="text-xs text-[var(--color-accent)] hover:underline">
                    docs →
                  </a>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <section className="card">
        <h2 className="font-semibold mb-2">Postponed</h2>
        <ul className="text-sm space-y-2 text-[var(--color-muted)]">
          <li><strong>MemPalace</strong> (Phase 5) — bis reale Customers Wiederholungs-Queries triggern</li>
          <li><strong>Ruflo</strong> (Phase 6) — bis Volumen Multi-Agent rechtfertigt</li>
        </ul>
        <p className="text-xs text-[var(--color-muted)] mt-3">
          Mehr Tools ≠ mehr Wert. Erst-Verkauf-First. Trigger zum Reaktivieren stehen in <code className="bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded">docs/ROADMAP.md</code>.
        </p>
      </section>
    </div>
  );
}

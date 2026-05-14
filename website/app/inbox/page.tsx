import { listFiles } from "@/lib/firma";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const files = await listFiles("inbox", ".md");

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
        <span className="text-[var(--color-muted)] text-sm">{files.length} Items</span>
      </header>

      {files.length === 0 ? (
        <div className="card text-[var(--color-muted)]">
          Inbox leer. Lege Markdown-Dateien unter <code className="bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded">.firma/inbox/</code> ab, um sie hier zu sehen.
        </div>
      ) : (
        <ul className="space-y-2">
          {files.map((f) => (
            <li key={f} className="card flex items-center justify-between gap-3">
              <span className="font-mono text-sm">{f}</span>
              <span className="text-xs text-[var(--color-muted)]">Triage: <code className="bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded">firma triage {f}</code></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

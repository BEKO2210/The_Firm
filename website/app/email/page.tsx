import { promises as fs } from "fs";
import path from "path";
export const dynamic = "force-dynamic";

async function loadEmails(dir: string) {
  const root = path.resolve(process.cwd(), "..", "workspace", "communication", dir);
  try {
    const files = await fs.readdir(root);
    return files.filter(f => f.endsWith(".md"));
  } catch { return []; }
}

export default async function EmailPage() {
  const [inbox, outbound, drafts] = await Promise.all([loadEmails("inbox"), loadEmails("outbound"), loadEmails("drafts")]);
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Email Client</h1>
        <p className="text-slate-400 mt-1">Primary channel between firm and principal. Files in <code>workspace/communication/</code>.</p>
      </header>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <h2 className="text-lg font-semibold text-white">Inbox ({inbox.length})</h2>
          {inbox.length === 0 ? <p className="text-sm text-slate-400 mt-2">No emails. Drop a file in <code>workspace/communication/inbox/</code> or compose below.</p> :
            <ul className="mt-3 space-y-1 text-sm">{inbox.map(f => <li key={f} className="text-slate-300">{f}</li>)}</ul>}
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold text-white">Sent ({outbound.length})</h2>
          {outbound.length === 0 ? <p className="text-sm text-slate-400 mt-2">No sent emails yet.</p> :
            <ul className="mt-3 space-y-1 text-sm">{outbound.map(f => <li key={f} className="text-slate-300">{f}</li>)}</ul>}
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold text-white">Drafts ({drafts.length})</h2>
          {drafts.length === 0 ? <p className="text-sm text-slate-400 mt-2">No drafts.</p> :
            <ul className="mt-3 space-y-1 text-sm">{drafts.map(f => <li key={f} className="text-slate-300">{f}</li>)}</ul>}
        </div>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold text-white">Compose new email</h2>
        <p className="text-sm text-slate-400 mt-2">In production, this is a form that POSTs to <code>/api/email/send</code>. For now, drop a markdown file into <code>workspace/communication/inbox/</code> directly — Claude Code will process it at next <code>/firma</code>.</p>
      </div>
    </div>
  );
}

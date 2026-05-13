import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json() as { from: string; to: string; subject: string; body: string };
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `EM-${ts}.md`;
  const root = path.resolve(process.cwd(), "..", "workspace", "communication", "inbox");
  await fs.mkdir(root, { recursive: true });
  const md = `---
email_id: "${filename.replace(".md", "")}"
direction: "inbound"
from: "${body.from}"
to: "${body.to}"
subject: "${body.subject}"
real: "${new Date().toISOString()}"
status: "unread"
priority: "normal"
---

${body.body}
`;
  await fs.writeFile(path.join(root, filename), md, "utf-8");
  return NextResponse.json({ ok: true, filename });
}

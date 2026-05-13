import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

// Human-in-loop approval endpoints (CLAUDE.md §31.2).
// POST { decision_id, approve: boolean, principal_signature: string } → updates logs/ai-decisions.log
export async function POST(request: Request) {
  const body = await request.json();
  // Stub: real impl logs to logs/ai-decisions.log + audit.log with hash chain.
  return NextResponse.json({ ok: true, recorded: body });
}

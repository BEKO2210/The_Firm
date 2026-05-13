import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  // Stub: real impl returns thread grouped by thread_id from frontmatter.
  return NextResponse.json({ ok: true, todo: "implement thread aggregation" });
}

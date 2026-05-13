import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function PUT() {
  // Stub: real impl rewrites the frontmatter status: unread → read.
  return NextResponse.json({ ok: true, todo: "implement frontmatter rewrite" });
}

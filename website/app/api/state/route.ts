import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const p = path.resolve(process.cwd(), "..", ".firm", "state.json");
  const data = await fs.readFile(p, "utf-8");
  return new NextResponse(data, {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
}

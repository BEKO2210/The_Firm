import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const statePath = path.resolve(process.cwd(), "..", ".firm", "state.json");
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode("event: hello\ndata: {}\n\n"));
      const watcher = fs.watch(statePath, async () => {
        try {
          const json = await fs.promises.readFile(statePath, "utf-8");
          controller.enqueue(encoder.encode(`event: state\ndata: ${json}\n\n`));
        } catch {}
      });
      return () => watcher.close();
    }
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "Connection": "keep-alive" }
  });
}

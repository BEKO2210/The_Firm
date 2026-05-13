// Firma OS · Token-Cache
//
// Content-Fingerprint (SHA-256) + Disk-Cache für wiederkehrende State-Snapshots.
// Zweck: identische .firma/state.json (oder andere Reminders) nicht mehrfach an das LLM
// senden, sondern via Fingerprint referenzieren.
//
// rtk-ai war ursprünglich als zweiter Modus geplant, ist aber konzeptionell etwas
// anderes: ein Command-Output-Filter, kein KV-Cache. Daher lebt rtk in lib/rtk-exec.mjs.
//
// Modi:
//   "local" (default) — SHA-256-Cache unter .firma/cache/token-cache/
//   "noop"           — komplett inert, für Vergleichs-Benchmarks

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const SUPPORTED_MODES = new Set(["noop", "local"]);

export async function openCache({ root, mode = "local" } = {}) {
  if (!root) throw new Error("token-cache: root path required");
  if (!SUPPORTED_MODES.has(mode)) {
    throw new Error(`token-cache: unsupported mode '${mode}' (use: noop|local)`);
  }

  const dir = path.join(root, ".firma", "cache", "token-cache");
  const statsPath = path.join(dir, "_stats.json");
  await fs.mkdir(dir, { recursive: true });

  let stats = await readStats(statsPath);

  function fingerprint(content) {
    const buf = typeof content === "string" ? content : JSON.stringify(content);
    return crypto.createHash("sha256").update(buf).digest("hex");
  }

  async function recall(fp) {
    if (mode === "noop") return null;
    const entryPath = path.join(dir, fp + ".json");
    try {
      const raw = await fs.readFile(entryPath, "utf-8");
      stats.hits += 1;
      await writeStats(statsPath, stats);
      return JSON.parse(raw);
    } catch {
      stats.misses += 1;
      await writeStats(statsPath, stats);
      return null;
    }
  }

  async function store(fp, content, meta = {}) {
    if (mode === "noop") return;
    const entryPath = path.join(dir, fp + ".json");
    const payload = { content, meta: { ...meta, stored_at: new Date().toISOString() } };
    await fs.writeFile(entryPath, JSON.stringify(payload) + "\n");
    stats.entries += 1;
    stats.bytes += Buffer.byteLength(JSON.stringify(payload));
    await writeStats(statsPath, stats);
  }

  async function getStats() {
    return { ...stats, mode };
  }

  return { mode, fingerprint, recall, store, stats: getStats };
}

async function readStats(p) {
  try {
    const raw = await fs.readFile(p, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { entries: 0, hits: 0, misses: 0, bytes: 0, created_at: new Date().toISOString() };
  }
}

async function writeStats(p, stats) {
  await fs.writeFile(p, JSON.stringify(stats, null, 2) + "\n");
}

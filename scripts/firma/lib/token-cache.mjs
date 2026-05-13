// Firma OS · Token-Cache (rtk-ai Adapter)
//
// Vorbereitung für rtk-ai/rtk Integration (Phase 2).
// Default-Modus: "local" — Content-Fingerprint via SHA-256, Disk-Cache in .firma/cache/token-cache/.
// Wenn rtk-ai später installiert wird, kann mode="rtk" auf den echten Adapter umschalten.
//
// API:
//   const cache = await openCache({ root, mode })
//   const fp    = cache.fingerprint(content)
//   const hit   = await cache.recall(fp)              -> null | { content, meta }
//   await cache.store(fp, content, meta)
//   const stats = await cache.stats()                 -> { entries, hits, misses, bytes }

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const SUPPORTED_MODES = new Set(["noop", "local", "rtk"]);

export async function openCache({ root, mode = "local" } = {}) {
  if (!root) throw new Error("token-cache: root path required");
  if (!SUPPORTED_MODES.has(mode)) {
    throw new Error(`token-cache: unsupported mode '${mode}' (use: noop|local|rtk)`);
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
    if (mode === "rtk") {
      // Hook: when rtk-ai is installed, delegate here.
      return null;
    }
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
    if (mode === "rtk") {
      // Hook: delegate to rtk-ai store when integrated.
      return;
    }
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

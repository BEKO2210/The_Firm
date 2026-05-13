// Firma OS · rtk-exec
//
// Thin wrapper: führt eine Command-Argv via rtk-Filter aus, mit Fallback auf raw.
// rtk ist ein CLI-Proxy (https://github.com/rtk-ai/rtk), kein KV-Cache.
// Begründung: rtks 60-90%-Werbung wird nur bei großen Outputs erreicht; bei kompakten
// Commands ist Δ oft 0%. Siehe Benchmarks in docs/BENCHMARKS.md.
//
// API:
//   const { ok, output, viaRtk, ms } = await execMaybeRtk(argv, { rtkBin })
//
// Default: rtk-Binary unter tools/rtk/target/release/rtk gesucht. Fehlt es,
// fällt der Aufruf transparent auf raw zurück.

import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const DEFAULT_RTK = path.resolve(HERE, "..", "..", "..", "tools", "rtk", "target", "release", "rtk");

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

export async function isRtkAvailable(rtkBin = DEFAULT_RTK) {
  return exists(rtkBin);
}

function runArgv(argv, { cwd, env, maxBufferBytes = 64 * 1024 * 1024 } = {}) {
  return new Promise((resolve) => {
    const t0 = process.hrtime.bigint();
    const child = spawn(argv[0], argv.slice(1), { cwd, env });
    let out = ""; let err = ""; let bytes = 0;
    child.stdout.on("data", (b) => { bytes += b.length; if (bytes < maxBufferBytes) out += b.toString("utf-8"); });
    child.stderr.on("data", (b) => { err += b.toString("utf-8"); });
    child.on("close", (code) => {
      const t1 = process.hrtime.bigint();
      resolve({ output: out + err, code: code ?? -1, ms: Number(t1 - t0) / 1e6 });
    });
    child.on("error", (e) => {
      const t1 = process.hrtime.bigint();
      resolve({ output: String(e.message), code: -1, ms: Number(t1 - t0) / 1e6 });
    });
  });
}

export async function execMaybeRtk(argv, opts = {}) {
  const rtkBin = opts.rtkBin || DEFAULT_RTK;
  const available = await isRtkAvailable(rtkBin);
  if (!available || opts.disableRtk) {
    const r = await runArgv(argv, opts);
    return { ok: r.code === 0, output: r.output, viaRtk: false, ms: r.ms, code: r.code };
  }
  const r = await runArgv([rtkBin, ...argv], opts);
  if (r.code === 0) {
    return { ok: true, output: r.output, viaRtk: true, ms: r.ms, code: r.code };
  }
  // Fallback bei rtk-Fehler: raw command unverändert ausführen.
  const raw = await runArgv(argv, opts);
  return { ok: raw.code === 0, output: raw.output, viaRtk: false, ms: raw.ms, code: raw.code, rtkFailed: true };
}

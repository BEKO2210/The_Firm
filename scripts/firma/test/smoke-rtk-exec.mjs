// Firma OS · Smoke-Test für lib/rtk-exec.mjs
//
// Run: node scripts/firma/test/smoke-rtk-exec.mjs
//
// Prüft:
//   - isRtkAvailable() liefert true wenn Binary gebaut wurde (sonst skip)
//   - execMaybeRtk(["echo", "ok"]) gibt "ok" zurück
//   - Bei nicht vorhandenem rtk-Binary fällt es transparent auf raw zurück

import assert from "node:assert/strict";
import path from "node:path";
import { execMaybeRtk, isRtkAvailable } from "../lib/rtk-exec.mjs";

const available = await isRtkAvailable();
console.log("rtk available:", available);

// echo läuft immer, mit oder ohne rtk
const r = await execMaybeRtk(["bash", "-lc", "echo firma-os-smoke"]);
assert.ok(r.ok, "echo via execMaybeRtk must succeed");
assert.match(r.output, /firma-os-smoke/);
console.log("  echo ok · viaRtk=%s · %sms", r.viaRtk, r.ms.toFixed(1));

// Fallback: erzwungen kein rtk → muss trotzdem raw funktionieren
const r2 = await execMaybeRtk(["bash", "-lc", "echo forced-raw"], { rtkBin: "/non/existent/rtk" });
assert.ok(r2.ok);
assert.equal(r2.viaRtk, false, "with missing rtkBin must fallback to raw");
assert.match(r2.output, /forced-raw/);
console.log("  fallback ok · viaRtk=%s", r2.viaRtk);

console.log("OK · rtk-exec smoke-tests bestanden.");

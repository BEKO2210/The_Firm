// Firma OS · Smoke-Test für token-cache + token-log + token-report
//
// Run:  node scripts/firma/test/smoke-token-cache.mjs
//
// Schreibt in eine temporäre .firma-Struktur unter /tmp, lässt das eigentliche
// Repo unberührt. Bricht mit Exit-Code 1 ab, wenn Erwartungen nicht erfüllt sind.

import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import assert from "node:assert/strict";

import { openCache } from "../lib/token-cache.mjs";
import { logRun, readRuns, summarize } from "../lib/token-log.mjs";

const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "firma-smoke-"));
console.log("smoke-root:", tmp);

// --- token-cache --------------------------------------------------------
const cache = await openCache({ root: tmp, mode: "local" });
const content = "Belkis Aslani · Firma OS · state.json snapshot v1";
const fp = cache.fingerprint(content);

assert.equal(fp.length, 64, "sha256 hex digest must be 64 chars");
assert.equal(await cache.recall(fp), null, "fresh cache must miss");

await cache.store(fp, content, { source: "state.json" });
const hit = await cache.recall(fp);
assert.ok(hit, "recall after store must hit");
assert.equal(hit.content, content, "recalled content must match");
assert.equal(hit.meta.source, "state.json");

const stats = await cache.stats();
assert.equal(stats.entries, 1);
assert.equal(stats.hits, 1);
assert.equal(stats.misses, 1);
console.log("  cache ok · entries=%d hits=%d misses=%d", stats.entries, stats.hits, stats.misses);

// noop-Modus muss komplett inert sein
const noop = await openCache({ root: tmp, mode: "noop" });
await noop.store("xxx", "no-write");
assert.equal(await noop.recall("xxx"), null, "noop mode must never recall");
console.log("  noop ok");

// unbekannter Modus muss früh fehlschlagen
await assert.rejects(() => openCache({ root: tmp, mode: "ufo" }), /unsupported mode/);
console.log("  unknown-mode rejection ok");

// --- token-log ----------------------------------------------------------
await logRun({ root: tmp, command: "status", tokens_in: 400, tokens_out: 120 });
await logRun({ root: tmp, command: "status", tokens_in: 350, tokens_out: 110, cache_hits: 2, cache_misses: 0 });
await logRun({ root: tmp, command: "inbox", tokens_in: 200, tokens_out: 80 });

const runs = await readRuns({ root: tmp });
assert.equal(runs.length, 3);
const sum = summarize(runs);
assert.equal(sum.total_runs, 3);
assert.equal(sum.total_tokens, 400 + 120 + 350 + 110 + 200 + 80);
assert.equal(sum.cache_hits, 2);
assert.equal(sum.cache_misses, 0);
assert.equal(sum.by_command[0].command, "status", "status should be top command");
assert.equal(sum.by_command[0].runs, 2);
console.log("  log+summary ok · total_tokens=%d top=%s", sum.total_tokens, sum.by_command[0].command);

// --- sinceDays-Filter ---------------------------------------------------
const oldFile = path.join(tmp, ".firma", "tokens", "runs.jsonl");
const oldRow = { ts: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), command: "old", tokens_total: 9999, cache_hits: 0, cache_misses: 0 };
await fs.appendFile(oldFile, JSON.stringify(oldRow) + "\n");
const recent = await readRuns({ root: tmp, sinceDays: 7 });
assert.equal(recent.length, 3, "7-day filter must exclude 30-day-old row");
console.log("  sinceDays filter ok");

// --- cleanup ------------------------------------------------------------
await fs.rm(tmp, { recursive: true, force: true });
console.log("OK · alle Token-Cache- und Log-Smoke-Tests bestanden.");

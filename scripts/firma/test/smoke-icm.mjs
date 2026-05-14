// Firma OS · Smoke-Test für lib/icm.mjs
// Run: node scripts/firma/test/smoke-icm.mjs

import assert from "node:assert/strict";
import path from "node:path";
import url from "node:url";
import { get_encoding } from "tiktoken";
import { readWorkspace, loadingProfile, monolithicProfile, tokensForProfile } from "../lib/icm.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..", "..");
const WORKSPACE = path.join(ROOT, ".firma", "icm", "triage");

const ws = await readWorkspace(WORKSPACE);
assert.equal(ws.stages.length, 3, "triage hat genau 3 stages");
assert.equal(ws.stages[0].name, "01-classify");
assert.equal(ws.stages[1].name, "02-decide");
assert.equal(ws.stages[2].name, "03-action");
console.log("  workspace ok · %d stages", ws.stages.length);

// Loading-Profil Stage 02 enthält die outputs von Stage 01
const p2 = loadingProfile(ws, 1);
const hasStage01Output = p2.files.some((f) => f.includes("01-classify") && f.includes("output"));
assert.ok(hasStage01Output, "stage 02 must include stage 01 output via Layer 4 chaining");
console.log("  layered chaining ok · stage 02 sees stage 01 output");

// Token-Counts vergleichen
const enc = get_encoding("cl100k_base");
const t1 = await tokensForProfile(loadingProfile(ws, 0), enc);
const t2 = await tokensForProfile(loadingProfile(ws, 1), enc);
const t3 = await tokensForProfile(loadingProfile(ws, 2), enc);
const mono = await tokensForProfile(monolithicProfile(ws), enc);
enc.free();

assert.ok(t1.tokens > 0 && t2.tokens > 0 && t3.tokens > 0, "all stages must have non-zero token cost");
assert.ok(mono.tokens > Math.max(t1.tokens, t2.tokens, t3.tokens), "monolithic must be larger than any single stage");
console.log("  token-counts ok · s1=%d s2=%d s3=%d mono=%d", t1.tokens, t2.tokens, t3.tokens, mono.tokens);

console.log("OK · icm smoke-tests bestanden.");

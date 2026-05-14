// Firma OS · Smoke-Test für lib/audit.mjs (hash-chained Audit-Log)
//
// Verifiziert: appendEvent verkettet korrekt, verifyChain erkennt eine intakte
// Kette UND eine manipulierte Zeile. Das ist die Compliance-Garantie:
// "ein verändertes altes Event wird gefunden".

import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { appendEvent, readChain, verifyChain, GENESIS_HASH } from "../lib/audit.mjs";

const root = await fs.mkdtemp(path.join(os.tmpdir(), "firma-audit-"));
const logPath = path.join(root, ".firma", "audit.log");

// --- 1. Append verkettet korrekt -------------------------------------------
const e1 = await appendEvent({ root, event: "firma_init", actor: "cli", summary: "init", data: { schema_version: 2 } });
const e2 = await appendEvent({ root, event: "report_rendered", actor: "cli", summary: "quote QT-1", data: { quote_id: "QT-1" } });
const e3 = await appendEvent({ root, event: "approval_granted", actor: "dashboard", summary: "approval #1", data: { id: "A-1" } });

assert.equal(e1.seq, 1, "erstes Event seq=1");
assert.equal(e1.prev_hash, GENESIS_HASH, "erstes Event prev_hash = Genesis");
assert.equal(e2.seq, 2, "zweites Event seq=2");
assert.equal(e2.prev_hash, e1.hash, "e2.prev_hash == e1.hash");
assert.equal(e3.prev_hash, e2.hash, "e3.prev_hash == e2.hash");
assert.notEqual(e1.hash, e2.hash, "verschiedene Events → verschiedene Hashes");
console.log("  append+chain ok · 3 Events verkettet, seq 1..3");

// --- 2. verifyChain erkennt intakte Kette ----------------------------------
const ok = await verifyChain({ root });
assert.equal(ok.intact, true, "intakte Kette → intact=true");
assert.equal(ok.entries, 3, "3 Einträge gezählt");
assert.equal(ok.errors.length, 0, "keine Fehler");
console.log("  verify-intact ok · 3 Einträge, Kette ungebrochen");

// --- 3. Manipulation einer alten Zeile wird gefunden -----------------------
const raw = await fs.readFile(logPath, "utf-8");
const lines = raw.split("\n").filter(Boolean);
const tampered = JSON.parse(lines[1]);
tampered.summary = "quote QT-1 (MANIPULIERT)"; // Inhalt ändern, hash NICHT neu berechnen
lines[1] = JSON.stringify(tampered);
await fs.writeFile(logPath, lines.join("\n") + "\n");

const broken = await verifyChain({ root });
assert.equal(broken.intact, false, "manipulierte Zeile → intact=false");
assert.ok(broken.errors.length > 0, "mindestens ein Fehler gemeldet");
assert.ok(broken.errors.some((e) => e.line === 2), "Fehler auf Zeile 2 lokalisiert");
console.log(`  tamper-detect ok · Manipulation auf Zeile 2 erkannt (${broken.errors.length} Fehler)`);

// --- 4. Kaputte JSON-Zeile bricht readChain nicht --------------------------
await fs.appendFile(logPath, "{kaputtes json\n");
const chain = await readChain({ root });
assert.ok(chain.some((e) => e._parse_error), "kaputte Zeile als _parse_error markiert");
console.log("  parse-resilience ok · kaputte Zeile abgefangen");

await fs.rm(root, { recursive: true, force: true });
console.log("OK · audit smoke-tests bestanden.");

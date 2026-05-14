// Firma OS · Smoke-Test für lib/pdf.mjs (Typst)
//
// Verifiziert: isTypstAvailable, renderTypst end-to-end mit minimalem Template.
// Wirft, wenn Typst nicht gebaut wurde → Test skippt mit klarer Fehlermeldung
// und Exit 0 (nicht-failing), damit CI ohne typst-Setup nicht rot wird.

import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { renderTypst, isTypstAvailable } from "../lib/pdf.mjs";

const available = await isTypstAvailable();
console.log("typst available:", available);

if (!available) {
  console.log("SKIP · Typst not installed. Run: bash scripts/firma/setup/install-typst.sh");
  process.exit(0);
}

const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "firma-pdf-"));
const templatePath = path.join(tmp, "minimal.typ");
const outPath = path.join(tmp, "out.pdf");

const template = `
#let data = json(bytes(sys.inputs.data))
= Hello #data.name
Total: #data.amount #data.currency
`;
await fs.writeFile(templatePath, template);

await renderTypst({
  template: templatePath,
  data: { name: "Firma OS", amount: "1.500,00", currency: "EUR" },
  outPath,
});

const stat = await fs.stat(outPath);
assert.ok(stat.size > 1000, `PDF must be >1KB, got ${stat.size}`);

const buf = await fs.readFile(outPath);
assert.ok(buf.slice(0, 5).toString() === "%PDF-", "Must start with PDF magic bytes");

console.log(`  rendered ok · ${stat.size} bytes · valid PDF magic`);

await fs.rm(tmp, { recursive: true, force: true });
console.log("OK · pdf smoke-tests bestanden.");

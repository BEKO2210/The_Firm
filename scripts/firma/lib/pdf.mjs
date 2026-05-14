// Firma OS · PDF-Rendering via Typst
//
// Typst (Apache 2.0) wird lokal gebaut via scripts/firma/setup/install-typst.sh.
// Default-Binary unter tools/typst/bin/typst.
//
// API:
//   await renderTypst({ template, data, outPath })
//     template: absoluter Pfad zur .typ-Datei
//     data: serialisierbares Objekt (wird als JSON an Typst per sys.inputs übergeben)
//     outPath: absoluter Pfad für die fertige .pdf-Datei
//
// Wirft Error mit stderr, wenn Typst nicht installiert ist oder das Template fehlschlägt.

import { promises as fs } from "node:fs";
import path from "node:path";
import url from "node:url";
import { spawn } from "node:child_process";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const DEFAULT_TYPST = path.resolve(HERE, "..", "..", "..", "tools", "typst", "bin", "typst");

export async function isTypstAvailable(typstBin = DEFAULT_TYPST) {
  try { await fs.access(typstBin); return true; } catch { return false; }
}

export async function getTypstVersion(typstBin = DEFAULT_TYPST) {
  return new Promise((resolve, reject) => {
    const c = spawn(typstBin, ["--version"]);
    let out = "";
    c.stdout.on("data", (b) => { out += b.toString(); });
    c.on("close", (code) => code === 0 ? resolve(out.trim()) : reject(new Error("typst --version failed")));
    c.on("error", reject);
  });
}

export async function renderTypst({ template, data, outPath, typstBin = DEFAULT_TYPST }) {
  if (!template) throw new Error("renderTypst: template path required");
  if (!outPath) throw new Error("renderTypst: outPath required");
  if (!(await isTypstAvailable(typstBin))) {
    throw new Error(`Typst not installed at ${typstBin}. Run: bash scripts/firma/setup/install-typst.sh`);
  }
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  // Daten als JSON-String direkt injecten — Typst's --root sandboxt das
  // Filesystem auf das Template-Verzeichnis, externe Pfade gehen nicht.
  // Im Template: `#let data = json(bytes(sys.inputs.data))`
  const jsonString = JSON.stringify(data);
  const args = [
    "compile",
    template,
    outPath,
    "--root", path.dirname(template),
    "--input", `data=${jsonString}`,
  ];
  await new Promise((resolve, reject) => {
    const c = spawn(typstBin, args);
    let err = "";
    c.stderr.on("data", (b) => { err += b.toString(); });
    c.stdout.on("data", (b) => { err += b.toString(); });
    c.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`typst compile exit ${code}: ${err}`));
    });
    c.on("error", reject);
  });
  return outPath;
}

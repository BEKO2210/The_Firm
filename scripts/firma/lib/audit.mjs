// Firma OS · Audit-Log
//
// Append-only, hash-chained JSONL log of REAL events.
// Stored in .firma/audit.log — eine Zeile pro Event.
//
// Jede Zeile ist über prev_hash kryptografisch mit der vorigen verkettet
// (SHA-256). Manipulation einer alten Zeile bricht die Kette ab dort —
// `verifyChain` findet die Bruchstelle. Das ist die Compliance-Grundlage
// (revisionssicher) UND die Event-Quelle für das Mission-Control-Dashboard
// (JETZT-Feed + Timeline) — siehe docs/DASHBOARD_VISION.md.
//
// Entry-Schema (eine JSONL-Zeile):
//   {
//     seq:       number,   fortlaufend ab 1
//     ts:        string,   ISO 8601
//     event:     string,   Event-Typ, z.B. "firma_init", "report_rendered"
//     actor:     string,   wer hat es ausgelöst: "cli" | "dashboard" | "agent:<name>"
//     summary:   string,   menschenlesbarer Einzeiler
//     data:      object,   strukturierte Payload (frei)
//     prev_hash: string,   hash der Vorzeile (Genesis: 64×"0")
//     hash:      string    SHA-256 über die kanonische Form OHNE das hash-Feld
//   }
//
// WICHTIG (CLAUDE.md §14): hier landen NUR reale Events. Keine Sim-Daten,
// keine Forecast-Werte, keine geplanten Aktionen — nur was wirklich passiert ist.

import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const GENESIS_HASH = "0".repeat(64);

function auditPath(root) {
  return path.join(root, ".firma", "audit.log");
}

// Kanonische, deterministische JSON-Serialisierung: Keys rekursiv sortiert.
// Damit ist der Hash unabhängig von der Key-Reihenfolge im data-Objekt.
function canonical(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return "[" + value.map(canonical).join(",") + "]";
  }
  const keys = Object.keys(value).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + canonical(value[k])).join(",") + "}";
}

// Hash über alle Felder AUSSER hash selbst.
function hashEntry(entry) {
  const { hash, ...rest } = entry;
  return createHash("sha256").update(canonical(rest)).digest("hex");
}

// Liest das Log, parst jede Zeile. Wirft NICHT bei kaputten Zeilen —
// die werden mit _parse_error markiert, damit verifyChain sie melden kann.
export async function readChain({ root }) {
  if (!root) throw new Error("audit: root path required");
  let raw;
  try {
    raw = await fs.readFile(auditPath(root), "utf-8");
  } catch {
    return [];
  }
  return raw
    .split("\n")
    .filter((l) => l.trim().length > 0)
    .map((line, i) => {
      try {
        return JSON.parse(line);
      } catch {
        return { _parse_error: true, _line: i + 1, _raw: line };
      }
    });
}

// Hängt ein Event an die Kette an. Liest die letzte Zeile für prev_hash.
// Für ein 1-Personen-System ist read-last + append ausreichend; bei echtem
// Concurrency-Bedarf müsste ein Lock dazu — bewusst nicht jetzt (YAGNI).
export async function appendEvent({ root, event, actor = "cli", summary = "", data = {} }) {
  if (!root) throw new Error("audit: root path required");
  if (!event) throw new Error("audit: event type required");
  const dir = path.join(root, ".firma");
  await fs.mkdir(dir, { recursive: true });

  const chain = await readChain({ root });
  const last = chain.length > 0 ? chain[chain.length - 1] : null;
  const prev_hash = last && !last._parse_error ? last.hash : GENESIS_HASH;
  const seq = last && !last._parse_error ? (last.seq || chain.length) + 1 : 1;

  const entry = {
    seq,
    ts: new Date().toISOString(),
    event,
    actor,
    summary,
    data,
    prev_hash,
  };
  entry.hash = hashEntry(entry);

  await fs.appendFile(auditPath(root), JSON.stringify(entry) + "\n");
  return entry;
}

// Verifiziert die gesamte Kette:
//   - jede Zeile parsebar?
//   - hash korrekt für den Zeileninhalt?
//   - prev_hash == hash der Vorzeile?
//   - seq fortlaufend?
// Gibt { intact, entries, errors:[{line, reason}] } zurück.
export async function verifyChain({ root }) {
  const chain = await readChain({ root });
  const errors = [];
  let expectedPrev = GENESIS_HASH;
  let expectedSeq = 1;

  for (let i = 0; i < chain.length; i++) {
    const line = i + 1;
    const e = chain[i];
    if (e._parse_error) {
      errors.push({ line, reason: "Zeile nicht parsebar (JSON kaputt)" });
      // Kette ist ab hier nicht mehr verifizierbar
      break;
    }
    const recomputed = hashEntry(e);
    if (recomputed !== e.hash) {
      errors.push({ line, reason: `hash stimmt nicht (Zeile manipuliert?) — erwartet ${recomputed.slice(0, 12)}…, gespeichert ${String(e.hash).slice(0, 12)}…` });
    }
    if (e.prev_hash !== expectedPrev) {
      errors.push({ line, reason: `prev_hash bricht die Kette — erwartet ${expectedPrev.slice(0, 12)}…, gespeichert ${String(e.prev_hash).slice(0, 12)}…` });
    }
    if (e.seq !== expectedSeq) {
      errors.push({ line, reason: `seq nicht fortlaufend — erwartet ${expectedSeq}, gespeichert ${e.seq}` });
    }
    expectedPrev = e.hash;
    expectedSeq = (e.seq || expectedSeq) + 1;
  }

  return {
    intact: errors.length === 0,
    entries: chain.filter((e) => !e._parse_error).length,
    errors,
  };
}

export { GENESIS_HASH };

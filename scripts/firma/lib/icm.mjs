// Firma OS · ICM (Interpreted-Context-Methodology) Adapter
//
// Quelle: https://github.com/RinDig/Interpreted-Context-Methdology
// Zweck: Folder-Konvention für mehrstufige Workflows, bei denen ein Agent
//        pro Stage nur die nötigen Layer lädt (Layer 0..4).
//
// Wir installieren keinen Code von ICM — wir übernehmen das Folder-Pattern:
//
//   .firma/icm/<workspace>/
//     CONTEXT.md                Layer 1 — Task-Routing für den Workspace
//     stages/01-<name>/         erste Stage
//       CONTEXT.md              Layer 2 — Stage-Contract (Inputs/Process/Outputs)
//       references/             Layer 3 — stabile Regeln
//       output/                 Layer 4 — Working-Artefakte (Stage-Outputs)
//     stages/02-…/
//
// Diese Lib parst eine Workspace-Struktur und liefert für jede Stage
// das Loading-Profil + Token-Last (tiktoken cl100k_base).

import { promises as fs } from "node:fs";
import path from "node:path";

export async function readWorkspace(workspaceDir) {
  const layer0Path = await firstExistingPath([
    path.join(workspaceDir, "..", "..", "CLAUDE.md"),
    path.join(workspaceDir, "..", "..", "..", "CLAUDE.md"),
  ]);
  const layer1Path = path.join(workspaceDir, "CONTEXT.md");
  const stagesDir = path.join(workspaceDir, "stages");

  const stageNames = (await safeReaddir(stagesDir)).filter((n) => /^\d{2}-/.test(n)).sort();
  const stages = [];
  for (const name of stageNames) {
    const stageDir = path.join(stagesDir, name);
    const contextPath = path.join(stageDir, "CONTEXT.md");
    const referencesDir = path.join(stageDir, "references");
    const outputDir = path.join(stageDir, "output");
    stages.push({
      name,
      dir: stageDir,
      layer2: contextPath,
      layer3: (await safeReaddir(referencesDir)).map((f) => path.join(referencesDir, f)),
      layer4: (await safeReaddir(outputDir)).map((f) => path.join(outputDir, f)),
    });
  }

  return {
    workspaceDir,
    layer0: layer0Path,
    layer1: layer1Path,
    stages,
  };
}

// Loading-Profil: welche Files lädt eine Stage tatsächlich?
// Konservativ: Stage N lädt Layer 0+1, eigene Layer 2, eigene Layer 3,
// PLUS Layer 4 (output) aller vorherigen Stages (Stage-Chaining).
export function loadingProfile(workspace, stageIndex) {
  if (stageIndex < 0 || stageIndex >= workspace.stages.length) {
    throw new Error(`icm: stageIndex ${stageIndex} out of range`);
  }
  const stage = workspace.stages[stageIndex];
  const previousOutputs = workspace.stages
    .slice(0, stageIndex)
    .flatMap((s) => s.layer4);
  return {
    stage: stage.name,
    files: [
      ...(workspace.layer0 ? [workspace.layer0] : []),
      workspace.layer1,
      stage.layer2,
      ...stage.layer3,
      ...previousOutputs,
    ],
  };
}

// Monolithischer Vergleich: ein einziger Prompt, der ALLES enthält.
// Wir nehmen alle Files aller Stages + Layer 0/1 als Worst-Case-Baseline.
export function monolithicProfile(workspace) {
  const files = [
    ...(workspace.layer0 ? [workspace.layer0] : []),
    workspace.layer1,
    ...workspace.stages.flatMap((s) => [s.layer2, ...s.layer3, ...s.layer4]),
  ];
  return { stage: "MONOLITHIC", files };
}

export async function tokensForProfile(profile, encoder) {
  let total = 0;
  let bytes = 0;
  const perFile = [];
  for (const f of profile.files) {
    try {
      const raw = await fs.readFile(f, "utf-8");
      const tok = encoder.encode(raw).length;
      total += tok;
      bytes += Buffer.byteLength(raw);
      perFile.push({ file: f, tokens: tok, bytes: Buffer.byteLength(raw) });
    } catch {
      perFile.push({ file: f, tokens: 0, bytes: 0, missing: true });
    }
  }
  return { stage: profile.stage, tokens: total, bytes, files: perFile.length, perFile };
}

async function safeReaddir(p) {
  try { return (await fs.readdir(p)).filter((n) => !n.startsWith(".")); } catch { return []; }
}

async function firstExistingPath(paths) {
  for (const p of paths) {
    try { await fs.access(p); return p; } catch { /* try next */ }
  }
  return null;
}

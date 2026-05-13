import { promises as fs } from "fs";
import path from "path";
import { parse as parseYaml } from "yaml";

const ROOT = path.resolve(process.cwd(), "..");

export interface EmployeeFrontmatter {
  id: string;
  name: string;
  archetype: string;
  role: string;
  department: string;
  seniority: string;
  hired_sim_date: string;
  hired_real_date: string;
  salary_currency: string;
  salary_monthly: number;
  equity_vested: number;
  equity_vesting_schedule: string;
  email: string;
  languages: string[];
  origin_background?: string;
  background?: string;
  personality: { thoroughness: number; skepticism: number; warmth: number; speed: number; assertiveness: number };
  communication_style?: string;
  strengths?: string[];
  weaknesses?: string[];
  favorite_tools?: string[];
  quirks?: string[];
  current_load_pct: number;
  burnout_score: number;
  last_review_date: string | null;
  next_review_date: string;
  vacation_days_remaining: number;
  mental_health_days_remaining: number;
  last_sabbatical: string | null;
  next_sabbatical_eligible: string;
  mentor_id: string | null;
  mentees: string[];
  buddy_for: string[];
  onboarding_status: string;
  assigned_pool: string;
}

export interface EmployeeProfile {
  id: string;
  slug: string;
  fileName: string;
  frontmatter: EmployeeFrontmatter;
  sections: { heading: string; body: string }[];
}

export interface PersonalityState {
  base: Record<string, number>;
  deltas: Record<string, number>;
  effective: Record<string, number>;
  history: unknown[];
}

export async function listEmployeeFiles(): Promise<{ id: string; slug: string; fileName: string }[]> {
  const dir = path.join(ROOT, ".firm", "employees");
  const files = await fs.readdir(dir);
  return files
    .filter(f => /^\d{3}-.+\.md$/.test(f))
    .map(f => {
      const match = f.match(/^(\d{3})-(.+)\.md$/);
      if (!match) throw new Error(`unexpected employee filename: ${f}`);
      return { id: match[1], slug: match[2], fileName: f };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

export async function readEmployee(id: string): Promise<EmployeeProfile | null> {
  const files = await listEmployeeFiles();
  const file = files.find(f => f.id === id);
  if (!file) return null;
  const raw = await fs.readFile(path.join(ROOT, ".firm", "employees", file.fileName), "utf-8");
  const match = raw.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;
  const frontmatter = parseYaml(match[1]) as EmployeeFrontmatter;
  const body = match[2].trim().replace(/^# .+\r?\n+/, "");
  const sections: { heading: string; body: string }[] = [];
  // Split by H2 ('## ') headings, preserving the first chunk if any (rare).
  const parts = body.split(/\r?\n## /);
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;
    if (i === 0 && !body.startsWith("## ")) {
      sections.push({ heading: "", body: part });
      continue;
    }
    const lines = part.split(/\r?\n/);
    const heading = lines[0].trim();
    const sectionBody = lines.slice(1).join("\n").trim();
    sections.push({ heading, body: sectionBody });
  }
  return { id: file.id, slug: file.slug, fileName: file.fileName, frontmatter, sections };
}

export async function readPersonalityState(id: string): Promise<PersonalityState | null> {
  try {
    const raw = await fs.readFile(path.join(ROOT, ".firm", "personality-state", `${id}.yaml`), "utf-8");
    return parseYaml(raw) as PersonalityState;
  } catch {
    return null;
  }
}

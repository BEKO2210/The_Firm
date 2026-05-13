import { promises as fs } from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd(), "..");

export interface FirmState {
  firm: { name: string; tagline: string; industry: string; region: string; brand_primary: string; brand_secondary: string };
  principal: { name: string; email: string; salutation: string; language: string };
  wallclock: { firm_day: number; office_hour: string; current_sprint: number; current_quarter: string; current_year: number };
  headcount: { total: number; by_archetype: Record<string, number> };
  finance: { bank_eur: number; monthly_burn_eur: number; runway_months: number; margin_target_pct: number; payroll_eur: number };
  tickets: { active: number; halted: number; max_parallel: number };
  okr: { quarter: string; objectives_count: number; krs_on_track: number; krs_total: number };
  incidents: { open: number; closed_last_quarter: number };
  hr: { promotions_due: number; hiring_open: number; burnout_over_80: number; on_vacation: number };
  ai_ethics: { decisions_logged: number; human_overrides: number; last_bias_audit_sim: string };
  bcdr: { last_dr_drill_sim: string; backup_status: "ok" | "stale" };
  knowledge: { nodes: number; edges: number; stale_flags: number };
  audit: { chain_entries: number; drift_alerts: number; chain_intact: boolean };
  oss: { contributions: number; projects: number; blog_posts: number };
  esg: { carbon_mtd_kg: number; charity_ytd_eur: number; volunteer_days_used: number };
  generated_at_real: string;
  generated_at_sim: string;
}

export async function readFirmState(): Promise<FirmState> {
  const p = path.join(ROOT, ".firm", "state.json");
  const raw = await fs.readFile(p, "utf-8");
  return JSON.parse(raw) as FirmState;
}

export interface RosterEntry {
  id: string;
  name: string;
  archetype: string;
  role: string;
  department: string;
  seniority: string;
  salary_monthly: number;
  email: string;
  current_load_pct: number;
  burnout_score: number;
}

export async function readRoster(): Promise<RosterEntry[]> {
  const p = path.join(ROOT, ".firm", "employees", "_roster.yaml");
  const raw = await fs.readFile(p, "utf-8");
  // Minimal YAML parser: extract list under `employees:` key.
  const out: RosterEntry[] = [];
  const lines = raw.split("\n");
  let inList = false;
  let current: Partial<RosterEntry> = {};
  for (const line of lines) {
    if (/^employees:\s*$/.test(line)) { inList = true; continue; }
    if (!inList) continue;
    const m = line.match(/^\s*-\s+id:\s+"(.+)"/);
    if (m) {
      if (Object.keys(current).length) out.push(current as RosterEntry);
      current = { id: m[1] };
      continue;
    }
    const field = line.match(/^\s+(\w+):\s+"?(.*?)"?\s*$/);
    if (field && current) {
      const [_, key, value] = field;
      if (key === "id") continue;
      if (["salary_monthly", "current_load_pct", "burnout_score"].includes(key)) {
        (current as any)[key] = Number(value);
      } else {
        (current as any)[key] = value;
      }
    }
  }
  if (Object.keys(current).length) out.push(current as RosterEntry);
  return out;
}

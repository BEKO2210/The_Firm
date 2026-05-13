import Link from "next/link";
import { notFound } from "next/navigation";
import { listEmployeeFiles, readEmployee, readPersonalityState } from "@/lib/employees";

export async function generateStaticParams() {
  const files = await listEmployeeFiles();
  return files.map(f => ({ id: f.id }));
}

const TRAIT_LABELS: Record<string, string> = {
  thoroughness: "Thoroughness",
  skepticism: "Skepticism",
  warmth: "Warmth",
  speed: "Speed",
  assertiveness: "Assertiveness",
};

function PersonalityBar({ trait, value, delta }: { trait: string; value: number; delta: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-300">{TRAIT_LABELS[trait] ?? trait}</span>
        <span className="text-white tabular-nums">
          {value}/5
          {delta !== 0 && (
            <span className="text-slate-500 ml-1">
              ({delta > 0 ? "+" : ""}{delta})
            </span>
          )}
        </span>
      </div>
      <div className="h-2 bg-slate-800 rounded overflow-hidden">
        <div className="h-full bg-[#3B82F6]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function burnoutBadge(score: number) {
  if (score >= 80) return { label: `${score} · forced rest`, cls: "pill pill-red" };
  if (score >= 60) return { label: `${score} · monitor`, cls: "pill pill-amber" };
  return { label: `${score}`, cls: "pill pill-green" };
}

function loadBadge(pct: number) {
  if (pct >= 90) return { label: `${pct}% · stretched`, cls: "pill pill-amber" };
  if (pct >= 70) return { label: `${pct}% · engaged`, cls: "pill pill-blue" };
  return { label: `${pct}%`, cls: "pill pill-green" };
}

export default async function EmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employee = await readEmployee(id);
  if (!employee) notFound();
  const personality = await readPersonalityState(id);
  const fm = employee.frontmatter;

  // Prev/next IDs for navigation across the full roster
  const all = await listEmployeeFiles();
  const myIdx = all.findIndex(f => f.id === id);
  const prev = myIdx > 0 ? all[myIdx - 1] : null;
  const next = myIdx < all.length - 1 ? all[myIdx + 1] : null;

  const sectionByHeading = (h: string) => employee.sections.find(s => s.heading === h)?.body ?? "";
  const bio = sectionByHeading("Bio");
  const defaultBehavior = sectionByHeading("Default behavior");
  const notes = sectionByHeading("Notes for collaborators");
  const load = loadBadge(fm.current_load_pct);
  const burn = burnoutBadge(fm.burnout_score);

  return (
    <div className="space-y-6">
      <nav className="flex items-center justify-between text-sm">
        <Link href="/team" className="text-slate-400 hover:text-white">← Back to Team</Link>
        <div className="flex gap-3">
          {prev && (
            <Link href={`/team/${prev.id}`} className="text-slate-400 hover:text-white">
              ← {prev.id}
            </Link>
          )}
          {next && (
            <Link href={`/team/${next.id}`} className="text-slate-400 hover:text-white">
              {next.id} →
            </Link>
          )}
        </div>
      </nav>

      <header className="card flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">#{fm.id}</div>
          <h1 className="text-3xl font-bold text-white">{fm.name}</h1>
          <div className="text-slate-300 mt-1">{fm.role}</div>
          <div className="text-slate-500 text-sm mt-0.5">{fm.department}</div>
          <div className="flex gap-2 mt-3 flex-wrap text-xs">
            <span className="pill pill-blue capitalize">{fm.archetype}</span>
            <span className="pill pill-blue capitalize">{fm.seniority}</span>
            <span className={load.cls}>{load.label}</span>
            <span className={burn.cls}>burnout {burn.label}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Hired</div>
          <div className="text-white">{fm.hired_sim_date}</div>
          <div className="text-xs text-slate-500 mt-2">{fm.hired_real_date}</div>
        </div>
      </header>

      {bio && (
        <section className="card">
          <h2 className="text-lg font-semibold text-white mb-2">Bio</h2>
          <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{bio}</p>
        </section>
      )}

      <section className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <h2 className="text-base font-semibold text-white mb-3">Compensation</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-400">Monthly</dt><dd className="text-white">€{fm.salary_monthly.toLocaleString()}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Annual</dt><dd className="text-white">€{(fm.salary_monthly * 12).toLocaleString()}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Equity vested</dt><dd className="text-white">{fm.equity_vested}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Vesting</dt><dd className="text-slate-300 text-xs">{fm.equity_vesting_schedule}</dd></div>
          </dl>
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-white mb-3">Workload &amp; Wellbeing</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-400">Current load</dt><dd className="text-white">{fm.current_load_pct}%</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Burnout score</dt><dd className="text-white">{fm.burnout_score}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Vacation remaining</dt><dd className="text-white">{fm.vacation_days_remaining} days</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Mental-health days</dt><dd className="text-white">{fm.mental_health_days_remaining}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Onboarding</dt><dd className="text-white">{fm.onboarding_status}</dd></div>
          </dl>
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-white mb-3">Profile</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-400">Email</dt><dd className="text-slate-300 text-xs">{fm.email}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Languages</dt><dd className="text-white">{(fm.languages ?? []).join(", ")}</dd></div>
            {fm.origin_background && (
              <div className="flex justify-between"><dt className="text-slate-400">Origin</dt><dd className="text-white">{fm.origin_background}</dd></div>
            )}
            <div className="flex justify-between"><dt className="text-slate-400">Next review</dt><dd className="text-white">{fm.next_review_date}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Next sabbatical</dt><dd className="text-white">{fm.next_sabbatical_eligible}</dd></div>
          </dl>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="text-base font-semibold text-white mb-3">Personality</h2>
          {personality ? (
            <div className="space-y-3">
              {Object.entries(personality.effective).map(([trait, value]) => (
                <PersonalityBar
                  key={trait}
                  trait={trait}
                  value={value}
                  delta={personality.deltas[trait] ?? 0}
                />
              ))}
              <div className="text-xs text-slate-500 mt-2">
                Effective = base ± deltas (cap ± 2). History: {personality.history.length} events.
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">No personality state on file.</p>
          )}
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-white mb-3">Mentorship</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-400">Mentor</dt>
              <dd className="text-white">
                {fm.mentor_id ? (
                  <Link className="hover:underline" href={`/team/${fm.mentor_id}`}>#{fm.mentor_id}</Link>
                ) : (
                  <span className="text-slate-500">—</span>
                )}
              </dd>
            </div>
            <div className="flex justify-between"><dt className="text-slate-400">Mentees</dt>
              <dd className="text-white">
                {fm.mentees?.length
                  ? fm.mentees.map(m => <Link key={m} href={`/team/${m}`} className="hover:underline mr-2">#{m}</Link>)
                  : <span className="text-slate-500">—</span>}
              </dd>
            </div>
            <div className="flex justify-between"><dt className="text-slate-400">Buddy for (new hires)</dt>
              <dd className="text-white">
                {fm.buddy_for?.length
                  ? fm.buddy_for.map(m => <Link key={m} href={`/team/${m}`} className="hover:underline mr-2">#{m}</Link>)
                  : <span className="text-slate-500">—</span>}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {defaultBehavior && (
        <section className="card">
          <h2 className="text-base font-semibold text-white mb-2">Default behavior</h2>
          <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{defaultBehavior}</p>
        </section>
      )}

      {notes && (
        <section className="card">
          <h2 className="text-base font-semibold text-white mb-2">Notes for collaborators</h2>
          <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">{notes}</div>
        </section>
      )}

      <section className="text-xs text-slate-500">
        Profile: <code className="text-slate-400">.firm/employees/{employee.fileName}</code> ·
        Personality state: <code className="text-slate-400">.firm/personality-state/{fm.id}.yaml</code> ·
        Pool: <code className="text-slate-400">{fm.assigned_pool}</code>
      </section>
    </div>
  );
}

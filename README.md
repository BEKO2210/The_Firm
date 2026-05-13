# Korynth Labs

> *Turning intelligence into systems the world can use.*

**Industry:** AI-Native SaaS Product Engineering · **Region:** Deutschland / Stuttgart / Ludwigsburg (BW)
**Founded:** Day 1 (2026-05-13 real)
**Day** 1, 09:00 · **Sprint** 1 · **Q1 2026**

---

## Live status

| | |
|---|---|
| Headcount | **50** (13 archetypes filled) |
| Tier | Premium (1.3×) |
| Active tickets | 0 / 3 max |
| Bank | **€2,290,780** |
| Monthly burn | €572,695 |
| Runway | **4.0 months** 🟢 |
| Margin target | 30% |
| OKR Q1 progress | 0 / 19 KRs |
| Open incidents | 0 |
| Burnout ≥ 80 | 0 |
| On vacation | 0 |
| Audit chain | ✓ 1 entry, 0 drift alerts |
| Visibility | public |

## How to use

```bash
# Open the operational dashboard
cd website
npm install
npm run dev
# → http://localhost:3000
```

| URL | Purpose |
|-----|---------|
| http://localhost:3000/ | Landing |
| http://localhost:3000/dashboard | Live ops dashboard |
| http://localhost:3000/email | Email client (compose, inbox) |
| http://localhost:3000/team | 50-person org chart |
| http://localhost:3000/finance | Ledger, P&L, runway |
| http://localhost:3000/hr | Salaries, burnout, vacations, equity |
| http://localhost:3000/transparency | AI ethics statement, audits |

## Daily operation

1. Compose an email in the dashboard at `/email` (or drop a file in `inbox/`).
2. Run `/firma` in Claude Code.
3. The firm processes your message, advances tickets, refreshes the dashboard.

## Principles (non-negotiable)

- **12 hard gates** (A1–A6 sandbox→staging · B1–B6 staging→production). No gate may be skipped.
- **Only the Releaser writes production.**
- **Released versions are immutable.** New work = new version.
- **Postmortem standards-patches auto-merge** into `workspace/knowledge-base/standards.md`. The firm gets better.
- **Burnout ≥ 80 = forced rest.** No exceptions.
- **AI decisions flagged critical require human-in-loop approval** before execution.
- **10 anti-patterns enforced** (no burnout, micromanagement, politics, info-hoarding, blame, HiPPO, meeting overload, toxic customer tolerance, tech-debt denial, bikeshedding).
- **Radical transparency** internally on salaries, performance, OKRs, finances.

## Files

- `CLAUDE.md` — the operating system specification (do not edit without principal approval).
- `.firm/identity.yaml` — frozen firm identity (immutable post-bootstrap).
- `.firm/state.json` — **single source of truth** for all dynamic numbers above.
- `.firm/employees/_roster.yaml` — all 50 employees indexed.
- `.firm/archetypes/` — 13 universal role definitions.
- `.firm/industry-mapping/ai-native-saas.yaml` — archetype → concrete role mapping.
- `.claude/agents/` — 28 subagent templates.
- `.claude/commands/firma.md` — `/firma` slash command.
- `pools/` — personal pools per employee.
- `website/` — Next.js 15 dashboard.
- `workspace/` — tickets, sprints, knowledge-base, knowledge-graph, communication.
- `finance/` — ledger, invoices, payroll, reports, pricing, budgets, audits.
- `hr/` — performance reviews, salaries, equity, vacations, burnout, onboarding curriculum.
- `okrs/` — quarterly OKR plans.
- `compliance/` — DSGVO + industry overlays + AI ethics statement.
- `ai-ethics/` — public statement + bias audits.
- `audits-public/` — annual transparency reports.
- `logs/audit.log` — append-only SHA-256-hash-chained audit trail.

## Forking this CLAUDE.md

This file is the operating system of a digital firm. It is licensed MIT. Fork freely, but please credit the original. PRs welcome.

---

*Generated 2026-05-13T00:00:00Z from `.firm/state.json` — zero hardcoded numbers.*

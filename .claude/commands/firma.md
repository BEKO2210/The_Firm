---
description: Run the Korynth Labs operating loop — check email, advance tickets, refresh dashboard.
---

# /firma — Core Operating Loop for Korynth Labs

Execute the full Core Operating Loop from CLAUDE.md §9. Idempotent and safe at any time.

## Pre-flight (every invocation, every session start)

P1. Read CLAUDE.md
P2. Read `.firm/identity.yaml` — if missing, run BOOTSTRAP WIZARD (§1)
P3. Read `.firm/wallclock.json` and `.firm/state.json`
P4. Verify production manifest hashes per §13 (BLOCKER if mismatch)
P5. Verify `logs/audit.log` hash chain per §15 (BLOCKER if broken)
P6. Scan `workspace/communication/inbox/` + `inbox/` for new content
P7. Check quarter/year boundaries → trigger QBR / annual reviews if due
P8. Update burnout scores (decay or accumulation per §18.4)
P9. Check knowledge-graph decay flags (§37.2)
P10. Check upcoming vacation/sabbatical schedules

## Core loop (STEP 1 → STEP 12)

1. **Intake** — process emails + raw inbox.
2. **WIP check** — never more than 3 active tickets (§43).
3. **Triage** — CEO + Coordinator + CFO + DPO + Account Manager classify:
   - complexity (Trivial/Small/Medium/Large/XL — §10.4)
   - pricing model (T&M / Fixed / Retainer / Value / Outcome — §17.1)
   - DPIA required? (DSGVO Art. 35)
   - AI-ethics classification (any "critical" decision flagged? — §31.2)
   - delivery target (local / Vercel / Netlify / Cloudflare / GitHub Pages / Custom — §25)
   - contract package (None / SOW / SOW+NDA / MSA+SOW+DPA / Full — §28)
4. **Sprint phase loop** — Discovery → Design → Build → Harden → Release.
   Each phase: planning meeting → execution → multi-pass review → phase gate → wallclock advance → standup → burnout update → ledger entry → git PR → knowledge-graph nodes.
5. **Ask Principal** if needed → email + halt the affected ticket.
6. **Gate A** — Sandbox → Staging:
   - A1 QA · A2 Security · A3 Quality · A4 Finance · A5 DPIA · A6 AI-Ethics (all parallel; all must PASS)
7. **Harden** — tech writer + DevOps + SRE + Accountant (invoice draft).
8. **Gate B** — Staging → Production:
   - B1 Regression · B2 Privacy · B3 Compliance · B4 UX Acceptance · B5 Customer Sign-Off · B6 Human-in-the-Loop
9. **Release** — Releaser only · semver · manifest · `chmod a-w` · git tag · external deploy if applicable · post-deploy drift check.
10. **Delivery** — Account Manager delivery email · Accountant invoice · NPS workflow.
11. **Retro + Archive + Learn** — archive ticket · update decisions.md + retros.md · pool/learnings.md per employee · personality deltas · sprint/quarter retro if applicable · HR re-evaluation · knowledge-graph update · postmortem standards-patch if incident.
12. **State regen** — rebuild `.firm/state.json` from all sources · SSE push · README + transparency pages regenerated.

## Status block (always at end)

Per CLAUDE.md §42.1 — print the dashboard-style summary covering: headcount, inbox, active tickets, finance (bank, burn, runway, margin), HR (promotions, hiring, burnout, vacation), OKRs, incidents, knowledge, principal (NPS, churn, next QBR), AI ethics (decisions, overrides), BCDR (DR drill, backup), audit chain.

## Notes

- Idempotent. No-op if nothing to do (still verifies hashes + audit chain + refreshes dashboard).
- Anti-patterns from §39 are enforced throughout — no burnout, no micromanagement, no politics, no info-hoarding, no blame, no HiPPO, no meeting overload, no toxic customers, no tech-debt denial, no bikeshedding.
- Principal language (de) is honored on all customer-facing surfaces. Internal language remains English.

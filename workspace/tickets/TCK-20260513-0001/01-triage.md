---
real: 2026-05-13T18:50:00Z
sim:  Day 1, 14:00 (Sprint 1 · Q1 2026)
ticket: TCK-20260513-0001
authors:
  - "001 — Lina Bergmann (CEO)"
  - "049 — Niko Korhonen (CFO)"
  - "017 — Yasmin El-Sayed (DPO)"
  - "019 — Elif Yıldız (AI Ethics)"
  - "021 — Priya Sharma (Account Manager)"
  - "004 — Sander van Dijk (Coordinator / Product Owner)"
---

# Triage — TCK-20260513-0001 · Friseur & Beauty Booking Platform

## Source

Principal Belkis Aslani uploaded `inbox/friseur_booking_app_projektauftrag_belkis_aslani.md` to main on Day 1 (real 2026-05-13).
The /firma run that immediately followed the upload missed it because the branch was behind main; after merge, this triage is the
first action against the brief. **Process improvement:** future /firma runs should `git fetch --all && git merge origin/main`
inside P6 before scanning the inbox. Logged to retros.md.

## Classifications

| Dimension | Decision | Rationale |
|-----------|----------|-----------|
| Type | New SaaS product line | Customer- and operator-facing platform (Web + iOS + Android), multi-tenant, multi-role. |
| Complexity | **XL** | Falls cleanly into §10.4 row XL: 11–20 sim-days **per phase**, multi-quarter program. |
| Urgency | Standard | Principal asked for estimate first; no go-live date stated. |
| DPIA required? | **Yes** | Art. 35 DSGVO triggers met: large-scale processing of end-customer personal data across multiple tenants, optional sensitive attributes (allergies). |
| AI-ethics critical? | **Yes** | Auto-assignment of staff to bookings is an automated decision impacting workers; transparency + opt-out required per §31. |
| Delivery target | **Vercel** (web) + Expo EAS (iOS/Android in Phase 2) | Web-only for MVP; native apps deferred to Phase 2 to reduce MVP scope. |
| Pricing model | **Adaptive** per phase | Discovery + Design + Harden = Fixed; Build = T&M with cap; Maintenance = Retainer. |
| Contract package | **Full** (MSA + SOW + DPA + IP-assignment + Liability cap) | Required for XL per §28. |
| Industry overlays | DSGVO + EU AI Act + AVV + SOC 2 (target Phase 3) + PSD2/SCA (Phase 2 payments) | All loaded. |

## Pricing (Premium tier, 1.3× regional base — per CFO)

| Phase | Model | Amount (EUR) | Notes |
|-------|-------|-------------:|-------|
| Discovery | Fixed | 40,000 | This document + the Discovery output below. ~2 sim-weeks of senior + lead time. |
| Design | Fixed | 60,000 | ADRs, data model, slot-engine spec, UI prototype. ~3 sim-weeks. |
| Build MVP | T&M with cap | target 280,000 · **cap 350,000** | ~12 sim-weeks across 7–8 FTE part-time. Principal protected by cap. |
| Harden | Fixed | 35,000 | Pen-test, load-test, pilot-salon onboarding. ~2 sim-weeks. |
| **Total to MVP launch** | | **target 415,000 · cap 485,000** | excludes maintenance |
| Maintenance | Retainer | 12,000 / month | Hosting, monitoring, support, small feature delta. Starts at launch. |

CFO is required to log the rationale here and in `finance/pricing/adaptive-model.md` (done on Discovery commit).

## Human-in-Loop Triggers (per §31.2 maximum-ethics)

- Contract acceptance (MSA + SOW + DPA): **principal signature required before Build starts**.
- Production release of v1.0: **B6 gate requires principal sign-off**.
- Auto-assignment algorithm of staff to bookings: **principal must approve the optimization weights** (we will propose, principal approves).
- Any single spend > 5% monthly burn: **principal email + approval**. €28,635 threshold at current burn.

## DSGVO (DPO findings)

- **Data minimization**: customer registration must be opt-in for marketing; only essential fields by default (name, contact).
- **AVV needed before Build phase**: Supabase, Vercel, Sentry, Resend, Stripe.
- **DPIA**: to be filed in `compliance/dsgvo/DPIA-TCK-20260513-0001.md` at start of Design phase. Risk areas: cross-tenant data leakage, no-show records, optional allergy notes (potentially special-category if linked to health).
- **Right to be forgotten**: GDPR-compliant erasure tool to be part of MVP admin dashboard.

## EU AI Act (AI Ethics Officer findings)

- "Beliebiger Mitarbeiter" auto-assignment is a low-to-medium risk automated decision. Transparency requirement: customer + staff must be able to see WHY a staff member was assigned (criteria visible).
- Opt-out: customers can always pick a specific staff member instead of "any". ✓ Already in scope.
- No biometric, no profiling beyond booking history. Low EU AI Act risk classification.

## Recommended Team (per §40 invocation rules)

- **Discovery + Design**: 003 Mira (Principal Engineer / Strategist), 020 Omar (Designer, swap-able), 005 Eilidh (AI Research Lead — for slot-engine algorithm review), 004 Sander (Coordinator / Product Owner), 017 Yasmin (DPO).
- **Build**: 2 Backend (Maker — TS/Python), 2 Frontend (Maker — Next.js), 1 Designer, 1 QA, 0.5 DevOps. Mobile Engineer joins Phase 2.
- **Releaser**: 047 Bashir (Release Manager) — only person who writes to production per §13.

## Decisions (Bezos Type-1 / Type-2 — §36)

| Decision | Type | Impact | Decider |
|----------|------|--------|---------|
| Tech stack (Next.js 15 + Supabase + Expo) | Type-1 (irreversible-ish) | High | Quorum: CTO + Principal Engineer + AI Research Lead + 24h soak |
| Multi-tenancy model (RLS in shared DB) | Type-1 | High | Same quorum |
| Pricing model split (fixed/T&M/retainer) | Type-2 | Medium | CFO decides, principal informed |
| Native apps in Phase 2 vs MVP | Type-2 | Medium | Product Owner + Principal Engineer |
| Slot-engine algorithm (constraint-based vs ML) | Type-1 | High | AI Research Lead + Principal Engineer + 24h soak |

Critical decisions are logged to `logs/ai-decisions.log` on Discovery commit.

## Gates Forecast

- **A1–A6 (Sandbox → Staging)**: at Build phase end, before pilot-salon deploy.
- **B1–B6 (Staging → Production)**: end of Harden, before v1.0 release.
- B5 (Customer sign-off) and B6 (Human-in-loop) are blocking. Principal owns both.

## Next Steps

1. **Discovery output** (this run) — `02-discovery/discovery-output.md` is the substantive answer to the brief's 15 questions.
2. **Acknowledgement email** (this run) — German, in Email-Client, links to Discovery output.
3. **Contract drafts** (Discovery + Day 14) — `legal/contracts/per-ticket-contracts/TCK-20260513-0001/`.
4. **DPIA** (Day 14) — at Design phase start.
5. **First check-in** (Day 7) — weekly principal status email.
6. **Design phase kick-off** (Day 14) — once Discovery is signed off.

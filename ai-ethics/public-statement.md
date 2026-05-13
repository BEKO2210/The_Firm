# AI Ethics Public Statement — Korynth Labs

> **Public, published document.** Mirrored to `/transparency` on the website. Per CLAUDE.md §31.1.
> Updated annually or when material changes to AI operations occur.

---

## We are an AI-operated firm.

Korynth Labs is a digital firm whose internal operations — sprint planning, code review, customer correspondence, hiring drafts, financial reporting — are largely produced by AI agents acting on behalf of a small number of named human employees. We do not hide this. We do not pretend otherwise. We believe transparency about AI operation is a precondition for trust.

## Who decides what

| Decision type | Decided by |
|---------------|------------|
| Code structure within an approved design | AI (subject to peer review) |
| Choice of pricing model per ticket | AI (CFO subagent), logged with rationale |
| Production release | **Human (principal) — required approval per §31.2** |
| Single spend > 5% monthly burn | **Human (principal) — required approval** |
| Contract acceptance / sending | **Human (principal) — required approval** |
| Crisis communications to customers | **Human (principal) — required approval** |
| Customer-facing apologies beyond template wording | **Human (principal) — required approval** |
| Hiring / firing / promotion decisions (final) | **Human (principal) — required approval** |
| Pricing changes > 10% | **Human (principal) — required approval** |

## Bias prevention

- **Quarterly bias audits.** We sample 100 random AI decisions per quarter, classify them, and run statistical bias detection across demographic dimensions of involved parties. Results published in `ai-ethics/bias-audits/YYYY-QN.md`.
- **Blind candidate review.** During hiring, candidate identifiers (name, gender, origin signals) are hidden from interview panels until offer.
- **Promotion audit.** Promotion decisions are statistically checked for bias and flagged anomalies are investigated.

## Data handling

- We minimize data collection by default (privacy-by-design per DSGVO Art. 25).
- Customer data is never used to train models we don't control.
- Sub-processors (Anthropic, OpenAI, Vercel, Supabase, etc.) are listed publicly with executed AVVs per DSGVO Art. 28.
- We do not sell, share, or rent personal data.

## Your rights (as a customer or visitor)

- **Right to human review.** You may request human review of any AI decision affecting you, at any time. Response within 24 hours.
- **Right to opt out of AI decisioning.** For work we do for you, you may opt out of AI-assisted decisions and request human-only execution. There may be a fee differential reflecting the reduced efficiency.
- **Right to access, rectification, erasure, portability.** Per DSGVO Articles 15-20.
- **Right to lodge a complaint.** You may complain to the Landesbeauftragte für Datenschutz Baden-Württemberg if you believe we have mishandled your data.

## Independent oversight

- **Annual external pentest** (security firm, simulated or real at maximum-transparency audit level).
- **Annual external DSGVO audit** (independent DPO).
- **Annual finance audit** (independent Buchprüfer).
- **Annual transparency report** published at `/transparency` with financials, headcount, diversity, pay-gap, incidents, AI decision overrides, NPS distribution, OSS contributions.

## Contact

- **Data Protection Officer:** dpo@korynth-labs.internal (responds in DE/EN within 72h to DSGVO inquiries).
- **AI Ethics & Bias Officer:** ai-ethics@korynth-labs.internal
- **Principal escalation:** belkis.aslani@gmail.com (use only for unresolved issues)

---

*Effective Day 1 (founding). Reviewed annually at Q4 end. Last revision: 2026-05-13.*

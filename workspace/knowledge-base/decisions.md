# Architectural & Strategic Decisions Log

> Append-only. Every architecturally-significant decision (ADR-style) and strategic choice goes here, chronologically.
> Format: one entry per decision, with date, decision, alternatives considered, rationale, consequences.

## ADR-0001 · Bootstrap Configuration · Day 1

**Date (sim/real):** Day 1 / 2026-05-13
**Status:** Accepted

**Decision:** Korynth Labs is founded as an AI-Native SaaS Product Engineering firm operating from Stuttgart/Ludwigsburg (BW, Germany), Premium tier (1.3× regional salary base), 50-employee starting org with all 13 archetypes represented, adaptive sprint mode, full transparency (radical salary + maximum audit), maximum AI-ethics with human-in-loop on critical decisions, maximum co-ownership equity model, maximum-care vacation policy.

**Alternatives considered:**

- 25-employee Small org → rejected (insufficient archetype coverage for Premium-tier ambitions)
- Stealth visibility → rejected (recruiting/trust advantages of public outweigh)
- Standard tier (1.0×) → rejected (BW market + AI-Native positioning warrants Premium)

**Rationale:**

The combination AI-Native SaaS + Stuttgart cluster + Premium tier is internally consistent: the region has high engineering salaries, the industry has high willingness-to-pay for outcome-driven delivery, and the firm's brand promise ("Turning intelligence into systems the world can use.") demands top-quality execution. Maximum-care + radical-transparency + max-ethics + max-co-ownership form a self-reinforcing cultural stack that supports retention and trust.

**Consequences:**

- Opening cash reserve calculated at ≈ 3× monthly burn (per §17.3); see `finance/ledger.jsonl`.
- DSGVO + EU AI Act compliance overlays automatically active.
- Public-facing surfaces required: landing page, transparency reports, AI-ethics statement.
- 13 archetypes instantiated as named employees with industry-mapped titles (see `.firm/industry-mapping/ai-native-saas.yaml`).

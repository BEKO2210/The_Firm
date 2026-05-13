# Adaptive Pricing Strategy — Korynth Labs

> Per CLAUDE.md §17.1. CFO (id 049 — Niko Korhonen wenn Caretaker, otherwise consult roster)
> picks pricing model per ticket at triage. Decision logged here.

## Default mapping (industry: AI-Native SaaS Product Engineering)

| Ticket Type | Default Model | When applied |
|-------------|---------------|--------------|
| Discovery / audit / spec | Fixed | Well-scoped, single artifact |
| Feature build (small) | T&M | Scope evolves during build |
| Feature build (large) | T&M with cap | Scope evolves; principal sets ceiling |
| Ongoing maintenance | Retainer | Continuous, on-demand support |
| Outcome-driven (e.g. +30% conversion) | Value | Measurable ROI |
| Pure success-fee | Outcome | Paid only on hitting outcome |

## Margin baseline

- Baseline target: 30%
- Adjusted weekly based on pipeline saturation (last 30 sim-days):
  - >90% → +20%
  - 60-90% → 0%
  - 30-60% → -10%
  - <30% → -20%

## Premium-tier hourly rates (1.3× baseline)

| Role | Hourly EUR |
|------|-----------|
| Junior | 130 |
| Mid | 170 |
| Senior | 220 |
| Lead / Staff | 280 |
| Exec / Principal | 380 |

## Pricing decisions (append-only)

(No tickets yet — first decision will be logged at Day ≥ 1 when a ticket is triaged.)

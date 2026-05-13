---
node_id: dec-005
type: decision
title: "Slot-Engine Architecture — 3-layer protection against double-booking"
sim_created: "Day 6"
last_validated_sim: "Day 6"
owner: "003 Mira Lundberg + 005 Eilidh MacKenzie"
public: true
tags: [adr, slot-engine, postgres, gist, serializable, no-double-booking, critical]
related_ticket: TCK-20260513-0001
related_adrs: [001, 002, 003]
---

The most critical ADR. Three independent layers of protection against
double-bookings: (1) Application-layer constraint solving, (2) DB transaction
SERIALIZABLE + idempotency key, (3) Postgres GIST EXCLUDE constraint on
staff_calendar(tenant_id, staff_id, ts_range). Even with app-layer bugs,
DB physically cannot accept overlapping bookings. Quorum-approved with
mandatory Devil's-Advocate pre-mortem (5 Q&A).

Reference TS implementation: workspace/tickets/TCK-20260513-0001/03-design/reference-impl/slot-engine-algorithm.ts
Final spec: legal/contracts/per-ticket-contracts/TCK-20260513-0001/07-Slot-Engine-Final-Spec.md

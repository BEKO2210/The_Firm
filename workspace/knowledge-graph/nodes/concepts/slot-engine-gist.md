---
node_id: con-002
type: concept
title: "Slot-Engine — GIST EXCLUDE + SERIALIZABLE"
sim_created: "Day 2"
last_validated_sim: "Day 2"
owner: "003 Mira Lundberg"
public: true
tags: [slot-engine, postgres, concurrency, no-double-booking]
---

Database-level guarantee against double bookings via Postgres GIST EXCLUDE
constraint on staff_calendar (tenant_id, staff_id, tstzrange) WITH (=, =, &&).
App layer adds SERIALIZABLE transactions + idempotency keys + retry logic.
Three independent layers of protection.

Spec: legal/contracts/per-ticket-contracts/TCK-20260513-0001/07-Slot-Engine-Final-Spec.md

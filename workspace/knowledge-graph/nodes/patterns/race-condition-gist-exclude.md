---
node_id: pat-002
type: pattern
title: "Race-Condition-safe scheduling via Postgres GIST EXCLUDE"
sim_created: "Day 6"
last_validated_sim: "Day 6"
owner: "005 Eilidh MacKenzie"
public: true
tags: [pattern, postgres, gist, scheduling, concurrency]
related_ticket: TCK-20260513-0001
---

Reusable pattern: use Postgres GIST EXCLUDE constraint on (entity_id, ts_range)
to physically prevent overlapping time-ranges. Combined with SERIALIZABLE
transactions + idempotency keys, gives mathematically race-condition-free
booking semantics. Applies to: appointments, room reservations, equipment
rental, vehicle scheduling, classroom assignments.

This pattern is publishable as a Korynth Labs blog post in Phase 3 (OSS strategy §32).

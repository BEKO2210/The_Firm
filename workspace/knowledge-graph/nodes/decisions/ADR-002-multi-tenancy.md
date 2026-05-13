---
node_id: dec-002
type: decision
title: "Multi-Tenancy via Shared DB + Postgres RLS"
sim_created: "Day 3"
last_validated_sim: "Day 3"
owner: "003 Mira Lundberg + 002 Jonas Weber"
public: true
tags: [adr, multi-tenancy, postgres, rls, security, dsgvo]
related_ticket: TCK-20260513-0001
related_adrs: [001]
---

Shared DB + Shared Schema + Postgres RLS. 3-layer defense-in-depth:
(1) tRPC middleware, (2) SET LOCAL session vars, (3) RLS policies with FORCE.
Default DENY. Scales to 1000+ tenants. DSGVO-court-defensible isolation.

Doc: workspace/tickets/TCK-20260513-0001/03-design/adrs/ADR-002-multi-tenancy.md

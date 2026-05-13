---
node_id: con-001
type: concept
title: "Multi-Tenancy via Postgres RLS"
sim_created: "Day 2"
last_validated_sim: "Day 2"
owner: "002 Jonas Weber"
public: true
tags: [multi-tenancy, postgres, rls, security]
---

Shared database + Row-Level Security policies enforce tenant isolation at the
database layer. Every tenant-scoped table has tenant_id column + RLS policy
that checks current_setting('app.tenant_id'). Belt-and-suspenders: app-layer
also filters explicitly. Audit-tested via cross-tenant access tests in CI.

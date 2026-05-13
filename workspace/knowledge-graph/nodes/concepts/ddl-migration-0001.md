---
node_id: con-003
type: concept
title: "DDL Migration 0001 — Tenants + Auth + Profile"
sim_created: "Day 5"
last_validated_sim: "Day 5"
owner: "003 Mira Lundberg"
public: false
tags: [migrations, postgres, rls, schema]
---

First migration draft. tenants + app_users + salon_profile + opening_hours
+ holidays + audit_log + custom_access_token_hook function. RLS FORCE
on all tenant-scoped tables. Default DENY policies. Final version Day 22.

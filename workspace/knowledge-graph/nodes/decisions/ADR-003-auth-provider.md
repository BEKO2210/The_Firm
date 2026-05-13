---
node_id: dec-003
type: decision
title: "Auth-Provider — Supabase Auth + Custom Claims"
sim_created: "Day 4"
last_validated_sim: "Day 4"
owner: "003 Mira Lundberg"
public: true
tags: [adr, auth, jwt, multi-tenancy]
related_ticket: TCK-20260513-0001
related_adrs: [001, 002]
---

Supabase Auth (EU Frankfurt) with custom_access_token_hook for tenant_id +
role claims. JWT 15min access + 30day refresh rotating. Mobile-compatible
zero-refactor. Argon2id + HIBP-check + rate limiting.

---
node_id: con-005
type: concept
title: "DDL Migration 0002 — Business Schema with GIST EXCLUDE"
sim_created: "Day 8"
last_validated_sim: "Day 8"
owner: "003 Mira Lundberg"
public: false
tags: [migrations, postgres, gist, rls, schema]
---

19 Tabellen inkl. die geschäftskritische staff_calendar mit
EXCLUDE USING GIST (tenant_id, staff_id, ts_range &&) — die physikalische
Garantie gegen Doppelbuchungen aus ADR-005. RLS FORCE auf jeder Tabelle.
Customer-Tabelle mit Special-Category-Check (allergies require explicit consent).
Phase-2-ready: device_tokens, payment_provider/intent_id/status fields.
Trigger track_booking_status_change schreibt automatisch booking_status_history.
Rollback-Script vorhanden.

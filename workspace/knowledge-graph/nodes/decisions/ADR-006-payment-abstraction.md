---
node_id: dec-006
type: decision
title: "Payment-Abstraction — IPayment Interface + Stub/Stripe/Mollie"
sim_created: "Day 7"
last_validated_sim: "Day 7"
owner: "003 Mira Lundberg"
public: true
tags: [adr, payment, abstraction, stripe, mollie, sca]
related_ticket: TCK-20260513-0001
related_adrs: [001, 002]
---

Provider-neutral Payment-Abstraction. IPayment Interface + Registry-Pattern.
MVP ships with Stub (manuelle "vor Ort bezahlt" Markierung). Phase 2:
StripePayment + MolliePayment-Implementierungen. Erfüllt Belkis Condition #4.
Type-2 reversibel.

---
node_id: dec-004
type: decision
title: "Email-Provider — Resend + React-Email"
sim_created: "Day 5"
last_validated_sim: "Day 5"
owner: "003 Mira Lundberg"
public: true
tags: [adr, email, transactional, react-email, dsgvo]
related_ticket: TCK-20260513-0001
related_adrs: [001]
---

Resend (EU-Region) + React Email Templates. 12 templates für MVP.
Per-Salon-Branding via salon_profile injiziert. Type-2 reversible
(Provider-Interface IEmail abstrahiert, Migration <2d zu Postmark/Mailjet).
~€300/Mo bei 100 Salons × 1k Bookings × 3 Mails/Booking.

---
adr: 006
title: Payment-Abstraction — Provider-neutral mit IPayment-Interface
ticket: TCK-20260513-0001
status: "PROPOSED — Quorum-approved"
real: 2026-05-13T22:00:00Z
sim:  Day 7, 11:00
authors: ["003 Mira Lundberg"]
reviewers: ["002 Jonas Weber (CTO)", "049 Niko Korhonen (CFO — payment compliance)", "017 Yasmin El-Sayed (DPO)", "027 Devil's Advocate"]
decision_class: "Type-2 (reversible — Interface designed for swap)"
depends_on: [001, 002]
---

# ADR-006 · Payment-Abstraction

## Kontext

Online-Zahlung kommt erst in **Phase 2**. Trotzdem fordert SOW-001 § 11, dass die MVP-Architektur Payment-ready ist (Belkis' Condition #4 aus der MSA-Verhandlung: „Payment-provider-neutrale Architektur").

Wir müssen:
1. Datenmodell vorbereiten (`payment_provider`, `payment_intent_id`, `payment_status`)
2. Interface `IPayment` definieren
3. **Stub-Implementation** für MVP ("kein Provider", manuelle Salon-Markierung)
4. Sicherstellen, dass spätere Provider (Stripe, Mollie) ohne Refactor angedockt werden können

## Entscheidung

**Drei-Layer-Abstraktion:**

```
┌────────────────────────────────────────────────────┐
│  Business Logic (packages/core/booking, …)         │
│  ruft IPayment.createIntent / refund / etc.        │
└─────────────────────┬──────────────────────────────┘
                      │ (Interface — kein Provider-spezifischer Code)
                      ▼
┌────────────────────────────────────────────────────┐
│  IPayment (packages/core/payment/interface.ts)     │
│  · createIntent(amount, currency, metadata)        │
│  · capture(intentId)                                │
│  · refund(intentId, amount?)                        │
│  · verifyWebhook(signature, body)                   │
│  · listMethods(customerId)                          │
└─────────────────────┬──────────────────────────────┘
                      │ (Implementations registry)
                      ▼
┌─────────────┬──────────────┬──────────────┐
│ StubPayment │ StripePayment│ MolliePayment│
│  (MVP)      │  (Phase 2)   │  (Phase 2)   │
└─────────────┴──────────────┴──────────────┘
```

Pro Salon konfigurierbar via `salon_profile.payment_provider` (default: `'stub'`).

## Datenmodell-Erweiterung (Migration 0002)

```sql
ALTER TABLE salon_profile ADD COLUMN payment_provider text DEFAULT 'stub'
  CHECK (payment_provider IN ('stub', 'stripe', 'mollie'));
ALTER TABLE salon_profile ADD COLUMN payment_settings jsonb DEFAULT '{}'::jsonb;
  -- z. B. { "stripe_account_id": "acct_…", "currency": "EUR" }

-- bookings hatte schon payment_provider / payment_intent_id / payment_status
-- (siehe Datenmodell-Detail, Anlage 8 zum MSA, §A.3)
```

## Interface (TypeScript)

```typescript
// packages/core/payment/interface.ts

export interface PaymentIntent {
  id: string;
  status: 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded' | 'cancelled';
  amountEur: number;
  provider: 'stub' | 'stripe' | 'mollie';
  providerIntentId: string;
  clientSecret?: string;  // Stripe-specific, optional
  metadata: Record<string, string>;
}

export interface RefundResult {
  refundId: string;
  refundedAmountEur: number;
}

export interface IPayment {
  /** Create a payment intent. Returns details for client-side confirmation. */
  createIntent(args: {
    amountEur: number;
    salonId: string;
    bookingId: string;
    customerEmail: string;
    description: string;
    metadata?: Record<string, string>;
  }): Promise<PaymentIntent>;

  /** Capture authorized payment (Stripe two-step). */
  capture(intentId: string): Promise<PaymentIntent>;

  /** Refund full or partial. */
  refund(intentId: string, amountEur?: number): Promise<RefundResult>;

  /** Verify webhook signature (provider-specific). */
  verifyWebhook(signature: string, body: string): Promise<boolean>;

  /** List saved methods for customer (for repeat payments). */
  listMethods(customerId: string): Promise<Array<{ id: string; type: string; last4?: string }>>;
}
```

## Stub-Implementation (MVP)

```typescript
// packages/core/payment/providers/stub.ts
export class StubPayment implements IPayment {
  async createIntent(args): Promise<PaymentIntent> {
    // No real payment — just record intent
    const id = randomUUID();
    return {
      id,
      status: 'pending',
      amountEur: args.amountEur,
      provider: 'stub',
      providerIntentId: `stub_${id}`,
      metadata: args.metadata ?? {},
    };
  }
  async capture(intentId: string): Promise<PaymentIntent> {
    return { id: intentId, status: 'captured', amountEur: 0, provider: 'stub', providerIntentId: intentId, metadata: {} };
  }
  async refund() { throw new Error('Stub: refunds via Salon-Admin marked manually'); }
  async verifyWebhook() { return true; }
  async listMethods() { return []; }
}
```

Im MVP markiert der Salon-Admin Buchungen manuell als „bezahlt vor Ort" über das Admin-Dashboard. Das Datenmodell ist vorbereitet, aber kein automatischer Geldfluss.

## Phase 2 — Stripe Implementation

```typescript
// packages/core/payment/providers/stripe.ts
export class StripePayment implements IPayment {
  constructor(private stripe: Stripe, private webhookSecret: string) {}

  async createIntent(args) {
    const intent = await this.stripe.paymentIntents.create({
      amount: Math.round(args.amountEur * 100),
      currency: 'eur',
      payment_method_types: ['card', 'sepa_debit', 'sofort'],
      capture_method: 'manual',
      description: args.description,
      metadata: { ...args.metadata, bookingId: args.bookingId, salonId: args.salonId },
      receipt_email: args.customerEmail,
    });
    return mapStripeIntent(intent);
  }
  // … capture, refund, verifyWebhook, listMethods analog
}
```

## Sicherheit + DSGVO

- **Webhook-Signature-Verification** Pflicht (Stripe + Mollie unterschreiben Payloads)
- **Idempotency-Keys** für jeden Provider-Call (vermeidet Doppel-Capture)
- **Sub-Processor**: Stripe = US-Mutter mit EU-Datenresidenz. AVV unterzeichnet vor Phase-2-Launch.
- **DSGVO**: Customer-Email + Booking-Metadaten in Provider-Vault. Datenexport beinhaltet Payment-History.
- **PCI-DSS-Scope**: durch Stripe Elements (Card-Daten erreichen nie unsere Server) bleiben wir SAQ-A.

## SCA (Strong Customer Authentication) — PSD2

- Stripe handelt 3D-Secure automatisch ab.
- Frontend zeigt 3DS-Challenge bei Bedarf via Stripe.js.
- Magic-Link für Gast-Storno bleibt unter SCA-Schwelle (kein Geldfluss).

## Reversibilität

Type-2 — Provider-Wechsel ist „neue Implementation" ohne Datenmodell-Änderung. Beispiel: Stripe → Mollie:
1. `MolliePayment implements IPayment` schreiben (~3 Tage)
2. `salon_profile.payment_provider = 'mollie'` setzen
3. Bestehende `stripe`-bookings bleiben unverändert
4. Migration nicht erforderlich

## Alternativen geprüft

| Alt | Pro | Contra | Verdict |
|-----|-----|--------|---------|
| Stripe direkt in Business-Logic | weniger Code | Vendor-Lock-in (Belkis Condition #4 verletzt) | ❌ |
| Provider-Adapter pro Endpoint | flexibel | Boilerplate-Explosion | ❌ |
| **IPayment-Interface + Registry** | Belkis-konform, sauber testbar | etwas Setup-Aufwand | ✅ |

## Konsequenzen

✅ Belkis' Condition #4 erfüllt: Payment-provider-neutrale Architektur
✅ MVP läuft ohne Payment-Provider (Stub) — kein Stripe-Account nötig zum MVP-Launch
✅ Stripe-Migration Phase 2: ~3 Wochen / €40k (siehe Discovery v2 Erweiterungspfad)
✅ Späteres Hinzufügen weiterer Provider trivial
❌ Etwas zusätzlicher Code in MVP (~150 LOC für Stub + Interface) — Vorinvestition für Phase 2

## Entscheidung

✅ **Approved** (Quorum: Mira, Jonas, Niko CFO, Yasmin DPO, Critic)

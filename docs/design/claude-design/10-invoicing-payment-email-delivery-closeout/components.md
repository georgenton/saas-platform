# Slice 10 — component map

How the prototype maps onto the real frontend boundaries. The target components
already exist; this slice redesigns their **content and composition**, not their
location.

## Target components (frozen boundaries)

```
apps/web-platform/src/features/invoicing/workspace-documents.tsx
apps/web-platform/src/features/invoicing/workspace-commercial.tsx
  → InvoicingNotificationsPanel   (email delivery)
  → InvoicingPaymentsPanel        (payments + reversal)
```

Both receive the selected `InvoiceDetailResponse`, the tenant `slug`, the
parent's `actionLoading` / action-message-error pattern, and the permission flag.

## Prototype → real mapping

| Prototype piece (closeout-panel.jsx) | Real home | Reads | Calls |
| --- | --- | --- | --- |
| `VerdictHeader` + `deriveVerdict` | new composed header in the closeout view | invoice.status, electronicStatus, settlement, delivery | — |
| `StatusTriad` (`SRI`/`DELIV`/`PAY`) | shared closeout header | electronicStatus, deliveryStatus, settlement | — |
| `NextStep` + `deriveNextStep` | shared closeout header | full state | routes to the right panel action |
| `DeliveryCard` | **InvoicingNotificationsPanel** | buyerEmail, local email/message form | `sendInvoiceEmail()` |
| `SettlementCard` | **InvoicingPaymentsPanel** (header) | `InvoiceSettlement`, totals | — |
| `PaymentForm` | **InvoicingPaymentsPanel** | local payment form, settlement | `createInvoicePayment()` |
| `PaymentHistory` + `PaymentRow` | **InvoicingPaymentsPanel** | `invoice.payments[]` | `reverseInvoicePayment()` |
| `EvidenceCard` | new quiet card in closeout view | electronicStatus (hint only) | — |
| `NoInvoice` | parent empty state | selection | — |

Mobile (`closeout-mobile.jsx`) is a separate render path that reuses every
derivation exported on `window.Closeout`, plus the bottom-sheet versions
`DeliverySheet` / `PaymentSheet` / `HistorySheet`.

## Shared derivations — `window.Closeout`

Single source of truth so desktop and mobile never diverge:

- `deliveryStatus(s)` → `'no_email' | 'ready' | 'sending' | 'sent' | 'error'`
- `paymentStatus(inv)` → `'unpaid' | 'partial' | 'paid'` (from `InvoiceSettlement`)
- `deriveVerdict(s)` → `{ tone, icon, title, sub }`
- `deriveNextStep(s)` → `{ tone, pill, icon, title, desc, primary?, secondary? }`
- `fmtMoney(cents, currency)`, `fmtDateTime(iso)`, `methodLabel(value)`
- `SRI`, `DELIV`, `PAY` tone/label/icon maps

## Shared shell (unchanged from slices 00 / 02 / 05–09)

- `window.Icon` — Lucide-geometry icon set.
- `window.UI` — `Btn`, `Pill`, `Banner`, `Avatar`, `Brand`, `NavRow`,
  `MoodMenu`, `StateScreen`, `AssistantPanel`.
- `window.Chrome` — `Sidebar`, `TopBar`, `MobileTopBar`, `BottomTabs`, `Sheet`.

In production these are the compiled design-system components
(`window.<Namespace>.*` from `_ds_bundle.js`); the prototype re-implements them
inline so it runs without the bundle. **Do not ship the inline copies** — wire
the real panels to the design-system primitives.

## Status / tone vocabulary

| Truth | Values → tone |
| --- | --- |
| SRI (`electronicStatus`) | authorized→success · submitted→warning · rejected→danger · pending_submission→neutral |
| Entrega (`deliveryStatus`) | sent→success · sending→info · error→danger · no_email→warning · ready→neutral |
| Pago (`paymentStatus`) | paid→success · partial→info · unpaid→neutral |

## Currency input contract

`PaymentForm` keeps the amount as a decimal string in local state and converts
to integer `amountInCents` only on submit. Quick-fill chips derive from
`settlement.balanceDueInCents`. Never surface raw cents to the operator.

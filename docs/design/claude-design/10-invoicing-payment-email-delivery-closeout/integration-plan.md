# Slice 10 — integration plan (React + TypeScript + Vite)

How Codex turns this prototype into the production closeout surface. The backend
is **frozen** — no new endpoints, mutations or fields. Everything below wires to
contracts that already exist.

## 0. Scope guard

Touch only:

```
apps/web-platform/src/features/invoicing/workspace-documents.tsx   (InvoicingNotificationsPanel)
apps/web-platform/src/features/invoicing/workspace-commercial.tsx  (InvoicingPaymentsPanel)
```

Do **not** move customer creation, items composition, document review (slice 08)
or SRI lifecycle (slice 09) into this slice. Do **not** add gateway,
reconciliation, WhatsApp, delivery tracking, resend history, receipt PDF,
accounting or tax behavior.

## 1. Derivations as pure helpers

Port `window.Closeout`'s derivations to a framework-free module
(`invoicing/closeout.ts`) and unit-test them:

```ts
type DeliveryStatus = 'no_email' | 'ready' | 'sending' | 'sent' | 'error';
type PaymentStatus  = 'unpaid' | 'partial' | 'paid';

deliveryStatus(invoice, deliveryForm, actionLoading): DeliveryStatus
paymentStatus(settlement: InvoiceSettlement): PaymentStatus
deriveVerdict(...): { tone; icon; title; sub }
deriveNextStep(...): NextStep
```

`paymentStatus` must read **`InvoiceSettlement`** (`isFullyPaid`,
`paidInCents`, `balanceDueInCents`) — never recompute from the payments array on
the client beyond display. The server owns settlement.

## 2. Wire the three mutations

Use the existing `api.ts` functions and the parent action-loading / message
pattern. Keys used by the prototype:

| Action | Loading key | api.ts |
| --- | --- | --- |
| Send email | `send-invoice-email` | `sendInvoiceEmail(slug, invoiceId, { recipientEmail, message })` |
| Create payment | `create-invoice-payment` | `createInvoicePayment(slug, invoiceId, { amountInCents, currency, method, reference, paidAt, notes })` |
| Reverse payment | `reverse-invoice-payment` (+ `reverseTargetId`) | `reverseInvoicePayment(slug, invoiceId, paymentId, { reason })` |

After each success, **refetch** `GET /invoices/{invoiceId}` so `settlement` and
`payments[]` are authoritative. Surface failures through the parent
action-message/error banner (the prototype's `paymentError` and
`delivery.error` map to that).

## 3. Currency input

- Store the amount as a decimal **string** in form state; parse to integer
  `amountInCents` only at submit (`Math.round(parseFloat(amount) * 100)`).
- Reject `NaN`, `<= 0`, and `> balanceDueInCents` client-side with an inline
  message (matches the `payment_error` scenario). The server remains the final
  authority.
- Quick-fill chips set the string from `settlement.balanceDueInCents`.
- Default `currency` to the invoice currency; do not let the operator change it.

## 4. Delivery form

- Seed `recipientEmail` from `invoice.buyerEmail`; allow override before sending.
- If there is no email anywhere, **block send** and show the missing-email
  banner; keep the payment lane fully usable (independence).
- The "sent" timestamp comes from the action result / refreshed record. Do **not**
  build resend history or delivery tracking — a single sent confirmation only.

## 5. Reversal

- Ghost / secondary action per **posted** payment row (desktop) and inside the
  history sheet (mobile). Hidden for reversed payments.
- Require a `reason` (the reversal scenario shows it persisted). Confirm before
  firing; show row-level loading via `reverseTargetId`.
- Reversed payments remain in the list, struck-through, with reason + timestamp.

## 6. Permissions

Gate every mutation on `invoicing.manage` (the prototype's
`permission.canManage`). Read-only roles see the full closeout, the banner, and
disabled actions — never hidden data.

## 7. States to honor in the merged component

Map each prototype scenario to a real condition: `no_invoice` (no selection),
`loading` (detail query pending), `invoice_draft` (status `draft` → emit first),
`issued_open`, `no_email`, `email_ready/sending/sent/error`,
`unpaid/partial/fully_paid`, `payment_loading/error`,
`one_payment/multiple_payments`, `reversed_payment`, `reverse_loading`,
`permission_limited`, `backend_unavailable` (detail query error → retry).

## 8. Design system, not inline copies

Replace the prototype's inline `window.UI` / `window.Chrome` with the compiled
design-system components and the global `styles.css` tokens. Keep all color and
spacing as tokens so the five moods keep working. Verify mood at the app root
cascades to both shell and the closeout content.

## 9. Definition of done

- [ ] Send / create / reverse wired to the three frozen endpoints; refetch after each.
- [ ] Settlement read from `InvoiceSettlement`; balance never client-invented.
- [ ] Currency input converts to cents at the boundary; over-balance rejected.
- [ ] Email, payment and SRI never imply one another in copy or logic.
- [ ] No gateway / reconciliation / WhatsApp / tracking / receipt PDF / accounting / tax / SRI-mutation code.
- [ ] All 20 states reachable; desktop + mobile; 5 moods intact.
- [ ] Mutations gated on `invoicing.manage`.

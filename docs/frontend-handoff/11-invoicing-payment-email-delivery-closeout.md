# Invoicing Payment + Email Delivery Closeout Handoff

## Goal

Design the post-issue operational closeout surface for Ecuador electronic
invoicing.

This screen answers:

> "The invoice exists. What still needs to happen so the customer receives it,
> payment is tracked, and the invoice can later feed Tax Compliance and
> Accounting without confusion?"

The experience must be calm, professional and explicit about boundaries:

- sending an invoice to the customer is not SRI authorization;
- paying an invoice is not SRI authorization;
- authorizing a document with the SRI is not proof of payment;
- Tax Compliance and Accounting handoff are downstream evidence flows, not
  automatic declarations or accountant replacement.

## Current Frontend State

The real integration targets are:

- `apps/web-platform/src/features/invoicing/workspace-documents.tsx`
- `apps/web-platform/src/features/invoicing/workspace-commercial.tsx`
- `apps/web-platform/src/app/app.tsx`

Real components:

- `InvoicingNotificationsPanel`
- `InvoicingPaymentsPanel`

The current implementation works but feels like two utility forms below the
document review. This slice should turn them into a guided closeout lane without
inventing new backend behavior.

## Product Intent

This should feel like a front-desk closeout checklist:

1. confirm document state;
2. deliver the invoice to the customer;
3. record payment or partial payment;
4. reverse an incorrect payment when needed;
5. preserve evidence for tax/accounting;
6. show what remains open.

## Real Contracts

Use these files as source of truth:

- `InvoiceDetailResponse` in `apps/web-platform/src/app/types.ts`
- `InvoiceSettlement` in `apps/web-platform/src/app/types.ts`
- `PaymentResponse` in `apps/web-platform/src/app/types.ts`
- `sendInvoiceEmail()` in `apps/web-platform/src/app/api.ts`
- `createInvoicePayment()` in `apps/web-platform/src/app/api.ts`
- `reverseInvoicePayment()` in `apps/web-platform/src/app/api.ts`
- `InvoicingNotificationsPanel` in
  `apps/web-platform/src/features/invoicing/workspace-documents.tsx`
- `InvoicingPaymentsPanel` in
  `apps/web-platform/src/features/invoicing/workspace-commercial.tsx`
- OpenAPI contract in `docs/api/openapi.json`

## Endpoints Behind This Surface

- `POST /api/invoicing/tenants/{slug}/invoices/{invoiceId}/send-email`
- `POST /api/invoicing/tenants/{slug}/invoices/{invoiceId}/payments`
- `POST /api/invoicing/tenants/{slug}/invoices/{invoiceId}/payments/{paymentId}/reverse`
- existing read refresh through `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}`

Do not invent new delivery, WhatsApp, resend history, PDF regeneration,
payment gateway, bank reconciliation, accounting posting, tax filing or receipt
endpoints.

## Existing Actions

The current UI already supports:

- recipient email input;
- optional email message;
- send invoice email;
- amount input;
- payment method;
- payment reference;
- paid-at date;
- payment notes;
- payment reversal reason;
- reverse posted payment.

## Data To Surface

From `InvoiceDetailResponse`:

- invoice number;
- invoice status;
- electronic status;
- buyer name;
- buyer email;
- currency;
- totals;
- settlement:
  - `paidInCents`;
  - `balanceDueInCents`;
  - `isFullyPaid`;
- payments;
- authorized/access key fields when available;
- document/RIDE/XML availability from adjacent review surface.

From `PaymentResponse`:

- amount;
- currency;
- status;
- method;
- reference;
- paid at;
- notes;
- reversed at;
- reversal reason.

From local action state:

- `actionLoading === 'send-invoice-email'`
- `actionLoading === 'create-invoice-payment'`
- `actionLoading === reverse-payment:{paymentId}`
- action messages/errors from the parent Invoicing domain.

## Required States

Design explicitly for:

- no selected invoice;
- draft invoice, where payment should not be the primary path;
- issued invoice with open balance;
- issued invoice with no customer email;
- email ready to send;
- email sending;
- email sent success;
- email send error;
- unpaid invoice;
- partial payment;
- fully paid invoice;
- overpayment must not be implied as allowed unless backend allows it;
- payment creation loading;
- payment creation error;
- one posted payment;
- multiple payments;
- reversed payment;
- reverse payment loading;
- permission-limited / read-only;
- backend unavailable;
- mobile closeout flow.

## UX Direction

Make this a closeout lane, not two raw forms.

Preferred hierarchy:

1. closeout verdict header:
   - document state;
   - SRI legal state;
   - customer delivery state;
   - payment state.
2. one recommended next step:
   - send email;
   - record payment;
   - review reversed payment;
   - nothing pending.
3. delivery card:
   - recipient;
   - message;
   - send action;
   - warning if no customer email.
4. settlement card:
   - total;
   - paid;
   - balance;
   - paid/partial/unpaid pill.
5. payment form:
   - amount as currency input, not raw cents in the visual design;
   - method;
   - reference;
   - paid-at;
   - notes.
6. payment history:
   - posted payments;
   - reversed payments;
   - reverse action is secondary and clearly destructive/exceptional.
7. downstream evidence hint:
   - Tax Compliance and Accounting can later consume this evidence;
   - do not imply automatic posting or declaration.

Use Ecuador/LATAM-friendly copy:

- "Enviar al cliente"
- "Entrega del comprobante"
- "Saldo pendiente"
- "Pago parcial"
- "Factura pagada"
- "Registrar pago"
- "Revertir pago"
- "Evidencia para impuestos y contabilidad"

## Critical Guardrails

- Backend is frozen.
- Do not invent delivery history or email open tracking.
- Do not imply SRI authorization from email delivery or payment.
- Do not imply payment gateway settlement, bank reconciliation or automatic
  accounting posting.
- Do not imply automatic tax declarations.
- Keep payment reversal clearly secondary.
- Keep one recommended next action at a time.
- Keep the UI usable even when the current SRI submit path is blocked by XSD.

## Mobile Expectations

Do not shrink desktop.

Mobile should be purpose-built:

- closeout verdict at the top;
- sticky/clear primary action;
- delivery and payment as separate steps or bottom-sheet sections;
- payment history readable without tiny tables;
- reversal path behind a confirmation-like secondary disclosure;
- no long raw forms before the user understands what remains open.

## Mood System

Support existing moods:

- comfort;
- focus;
- calm;
- high-contrast;
- night.

Mood changes must visibly affect:

- closeout verdict;
- delivery card;
- settlement progress;
- payment history;
- warning/error/success states;
- mobile sheets.

## Relationship To Nearby Slices

This slice follows:

- `08-invoicing-document-review.md`
- `09-invoicing-sri-submission-lifecycle.md`
- `10-invoicing-vercel-qa-runbook.md`

It prepares:

- Tax Compliance evidence handoff;
- Accounting evidence handoff;
- future payment gateway or bank reconciliation design only after backend scope
  exists.

## Deliverable Expectations For Claude Design

Save the slice at:

- `docs/design/claude-design/10-invoicing-payment-email-delivery-closeout/`

Include:

- `index.html`
- `src/`
- `mock-data/`
- `README.md`
- `notes.md`
- `components.md`
- `integration-plan.md`

The deliverable should include:

- desktop and mobile;
- all required states;
- 5 moods;
- mock data mapped to the real endpoint shapes;
- clear notes on actions that are real now vs future backlog;
- no new endpoint assumptions.

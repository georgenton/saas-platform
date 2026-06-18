# Claude Design Prompt: Invoicing Payment + Email Delivery Closeout

You are designing the next frontend slice for a multi-product SaaS platform.

Use these files as source of truth:

- `docs/project-freeze-handoff.md`
- `docs/frontend-handoff/README.md`
- `docs/frontend-handoff/02-invoicing.md`
- `docs/frontend-handoff/08-invoicing-document-review.md`
- `docs/frontend-handoff/09-invoicing-sri-submission-lifecycle.md`
- `docs/frontend-handoff/10-invoicing-vercel-qa-runbook.md`
- `docs/frontend-handoff/11-invoicing-payment-email-delivery-closeout.md`
- `docs/frontend-handoff/00-platform-shell.md`
- `docs/api/openapi.json`
- `apps/web-platform/src/features/invoicing/workspace-documents.tsx`
- `apps/web-platform/src/features/invoicing/workspace-commercial.tsx`
- `apps/web-platform/src/app/api.ts`
- `apps/web-platform/src/app/types.ts`

## Product Context

The backend is frozen. Do not invent endpoints, mutations or backend behavior.

The frontend already has real component boundaries for this surface:

```txt
apps/web-platform/src/features/invoicing/workspace-documents.tsx
apps/web-platform/src/features/invoicing/workspace-commercial.tsx
```

Target components:

```txt
InvoicingNotificationsPanel
InvoicingPaymentsPanel
```

This slice follows document review and SRI lifecycle work. The user now needs a
calm post-issue closeout lane: deliver the invoice to the customer, record
payment, understand balance, and preserve evidence for future Tax Compliance
and Accounting handoff.

## Design Goal

Design a premium, friendly, LATAM/Ecuador-ready closeout experience for
operators after an invoice has been created/issued.

The user should feel:

- "I know whether this invoice is ready to deliver."
- "I know whether the customer received it or still needs it."
- "I know what remains unpaid."
- "I can record a partial or full payment without thinking in raw cents."
- "I understand that SRI authorization, email delivery and payment are separate
  truths."
- "I can later use this as evidence for taxes/accounting, but the UI is not
  pretending to file declarations or post journals automatically."

## UX Intent

The current components work, but they read like utility forms:

- send invoice by email;
- register payment;
- reverse payment.

Turn them into a guided closeout lane:

1. closeout verdict;
2. one recommended next step;
3. delivery card;
4. settlement card;
5. payment form;
6. payment history;
7. downstream evidence hint for Tax Compliance and Accounting.

Keep one dominant action at a time.

## Real Functional Scope

This surface can use:

- `InvoiceDetailResponse`
- `InvoiceSettlement`
- `PaymentResponse`
- `sendInvoiceEmail()`
- `createInvoicePayment()`
- `reverseInvoicePayment()`
- selected invoice detail from the parent Invoicing workspace
- parent action message/error pattern

Existing adjacent surfaces:

- document review / RIDE / XML;
- SRI submission lifecycle.

Do not redesign the whole Invoicing workspace. Do not move customer creation,
items composition, document review or SRI lifecycle into this slice.

## Endpoints

Use only these endpoint surfaces for this slice:

- `POST /api/invoicing/tenants/{slug}/invoices/{invoiceId}/send-email`
- `POST /api/invoicing/tenants/{slug}/invoices/{invoiceId}/payments`
- `POST /api/invoicing/tenants/{slug}/invoices/{invoiceId}/payments/{paymentId}/reverse`
- existing refresh through `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}`

Do not add payment gateway, bank reconciliation, WhatsApp delivery, delivery
tracking, resend history, receipt PDF, accounting journal, tax declaration,
certification or SRI mutation behavior.

## Important Behavioral Truth

Email delivery, payment, and SRI authorization are independent.

The design must not imply:

- legal SRI authorization from email delivery;
- legal SRI authorization from payment;
- payment from SRI authorization;
- automatic accounting posting;
- automatic tax filing;
- accountant replacement;
- bank settlement or reconciliation unless a real endpoint exists.

## Data To Represent

Invoice:

- number;
- status;
- electronic status;
- buyer name;
- buyer email;
- currency;
- total;
- paid;
- balance due;
- fully paid boolean;
- authorization/access-key hints when available.

Payment:

- amount;
- currency;
- status;
- method;
- reference;
- paid at;
- notes;
- reversed at;
- reversal reason.

Delivery:

- recipient email;
- optional message;
- sending state;
- success/error feedback;
- missing email blocker.

## States To Design Explicitly

Design desktop and mobile states for:

1. no selected invoice;
2. draft invoice;
3. issued invoice with open balance;
4. issued invoice without customer email;
5. email ready to send;
6. email sending;
7. email sent success;
8. email send error;
9. unpaid invoice;
10. partial payment;
11. fully paid invoice;
12. payment creation loading;
13. payment creation error;
14. one posted payment;
15. multiple payments;
16. reversed payment;
17. reverse payment loading;
18. permission-limited/read-only;
19. backend unavailable;
20. mobile closeout flow.

## Design Direction

Make the surface feel like a front-desk closeout checklist, not a raw finance
console.

Possible structure:

- closeout verdict header;
- compact status triad:
  - SRI;
  - customer delivery;
  - payment;
- recommended next step;
- delivery card;
- settlement/progress card;
- payment form with currency input;
- payment history;
- quiet downstream evidence card.

Use Ecuador/LATAM-friendly copy:

- "Enviar al cliente"
- "Entrega del comprobante"
- "Saldo pendiente"
- "Pago parcial"
- "Factura pagada"
- "Registrar pago"
- "Revertir pago"
- "Evidencia para impuestos y contabilidad"

The tone should be corporate, warm, aspirational and simple. This product is
for Ecuador/LATAM operators who need professionalism without feeling punished by
complexity.

## Mobile Expectations

Do not shrink desktop.

Mobile should be purpose-built:

- closeout verdict at top;
- one primary thumb-friendly action;
- delivery/payment as separate steps or sheets;
- settlement always visible enough to reduce anxiety;
- payment history readable without tiny tables;
- reversal path secondary and clearly exceptional.

## Mood System

Support existing moods:

- comfort;
- focus;
- calm;
- high-contrast;
- night.

Mood changes must visibly affect shell, cards, controls, status, warnings,
success messages and mobile sheets. Do not only tint the main panel.

## Deliverable Expectations

Save the slice at:

```txt
docs/design/claude-design/10-invoicing-payment-email-delivery-closeout/
```

Include:

- `index.html`
- `src/`
- `mock-data/`
- `README.md`
- `notes.md`
- `components.md`
- `integration-plan.md`

The deliverable must include:

- desktop and mobile;
- all required states;
- 5 moods;
- mock data mapped to real endpoint shapes;
- notes on real actions vs future backlog;
- no new endpoint assumptions;
- integration plan for Codex.

After building, run your verifier and report anything it flags.

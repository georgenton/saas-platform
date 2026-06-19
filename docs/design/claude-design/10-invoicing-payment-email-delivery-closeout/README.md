# Invoicing Payment + Email Delivery Closeout — Slice 10

The calm, post-issue **closeout lane**. Once an invoice has been created/issued
(and, ideally, authorized by the SRI in slice 09), the operator needs to do
three independent things and feel in control of each: **deliver** the comprobante
to the customer, **record payment**, and understand the **balance** — while
preserving evidence for a future Tax Compliance / Accounting handoff.

This slice redesigns the two utility forms that exist today
(`InvoicingNotificationsPanel`, `InvoicingPaymentsPanel`) into a guided lane:
**closeout verdict → status triad → one recommended next step → delivery card →
settlement card → payment form → payment history → quiet evidence card.**

> Open `index.html`. Top strip switches **device** (desktop / mobile), **state**
> (20 explicit states) and **mood** (5). Selection persists in `localStorage`.

---

## The critical truth this design protects

**Email delivery, payment and SRI authorization are three independent truths.**
The UI never lets one masquerade as another:

- Sending the email **does not** make the invoice legally authorized, nor paid.
- Recording a payment **does not** authorize it at the SRI, nor file taxes, nor
  post a journal entry.
- SRI authorization **does not** mean the customer received it or paid.

The **status triad** (SRI · Entrega · Pago) renders all three side by side with
the caption *"Tres verdades independientes"* so the operator never conflates them.
The downstream evidence card is an **evidence hint only** — it explicitly says
this surface does not declare taxes or post accounting entries.

---

## Hierarchy (desktop)

A two-column closeout. Left column is the **narrative** (where we are, what to
do, how to deliver); right column is the **money** (settlement, payment form,
history) and stays sticky.

1. **Closeout verdict header** — one headline for the whole invoice
   (*Lista para cerrar · Entregada · pendiente de pago · Cierre en curso ·
   Factura cerrada · Aún no lista para entregar*) + number, buyer, total.
2. **Status triad** — SRI · Entrega · Pago, each a tone + label, with the
   independence caption.
3. **One recommended next step** — a single dominant action derived from the
   state (emit → deliver → collect → done). Delivery is recommended before
   collection; if there's no email, payment becomes the dominant action and the
   missing-email blocker is surfaced in the delivery card.
4. **Delivery card** — *Entrega del comprobante*: recipient email, optional
   message, **Enviar al cliente**, with sent / sending / error / missing-email
   states.
5. **Settlement card** — *Saldo pendiente* as the hero number, a progress bar,
   and Total / Pagado / Saldo figures.
6. **Payment form** — *Registrar pago* with a **currency input** ($ + decimal,
   never raw cents), method, reference, paid-at, notes, and quick-fill chips.
   Collapses to a "Factura pagada" confirmation when fully paid.
7. **Payment history** — posted + reversed payments as cards (never a tiny
   table). Each posted payment has a secondary **Revertir pago**; reversed ones
   show the reversal reason and timestamp.
8. **Quiet downstream evidence card** — *Evidencia para impuestos y contabilidad*,
   muted and dashed, naming the future Tax Compliance EC + Accounting handoff
   without pretending to do their work.

## Mobile is purpose-built (not a shrunk desk)

- **Fixed verdict + saldo** at the very top — settlement is *always visible* to
  reduce anxiety, with a slim progress bar.
- Compact **three-truth triad**.
- Next-step text, then tappable **summary rows** for delivery, payment and
  history that open **bottom sheets** (separate steps, not a cramped form).
- One **thumb-friendly primary action** pinned at the bottom, matching the
  recommended next step.
- **Reversal** lives inside the history sheet — secondary and clearly
  exceptional.

---

## States designed (20 + device toggle)

`no_invoice` · `loading` · `invoice_draft` · `issued_open` · `no_email` ·
`email_ready` · `email_sending` · `email_sent` · `email_error` · `unpaid` ·
`partial` · `fully_paid` · `payment_loading` · `payment_error` · `one_payment` ·
`multiple_payments` · `reversed_payment` · `reverse_loading` ·
`permission_limited` · `backend_unavailable`. Mobile renders every applicable
state via the **Device** toggle.

## Real functional scope

Endpoints used (and only these):

| UI action | Endpoint | api.ts |
| --- | --- | --- |
| Enviar al cliente | `POST …/invoices/{id}/send-email` | `sendInvoiceEmail()` |
| Registrar pago | `POST …/invoices/{id}/payments` | `createInvoicePayment()` |
| Revertir pago | `POST …/invoices/{id}/payments/{paymentId}/reverse` | `reverseInvoicePayment()` |
| Refresh | `GET …/invoices/{id}` | selected invoice detail |

Data shapes: `InvoiceDetailResponse`, `InvoiceSettlement`, `PaymentResponse` —
see `mock-data/`. **Not built** (no backend exists): payment gateway, bank
reconciliation, WhatsApp delivery, delivery tracking, resend history, receipt
PDF, accounting journal, tax declaration, certification, or any SRI mutation.

## Files

```
index.html                  shell + script order + @dsCard / @startingPoint
src/data.js                 window.CLOSEOUT_DATA — shell context + 20 scenarios
src/icons.jsx               window.Icon (shared, Lucide geometry)
src/components.jsx          window.UI primitives (shared)
src/chrome.jsx              window.Chrome shell (shared)
src/closeout-panel.jsx      window.Closeout — desktop + shared derivations
src/closeout-mobile.jsx     window.MobileCloseout — purpose-built mobile
src/app.jsx                 device / state / mood viewer
mock-data/                  invoice-detail · payments · action-requests
README.md notes.md components.md integration-plan.md
```

See `notes.md` for rationale and mood behavior, `components.md` for the
component map against the real boundaries, and `integration-plan.md` for the
Codex wiring steps.

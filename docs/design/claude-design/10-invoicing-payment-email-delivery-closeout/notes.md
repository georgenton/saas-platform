# Slice 10 — design notes

Rationale, the guardrail, hierarchy decisions, mood behavior, and the line
between real actions and backlog.

## The problem with the current surface

`InvoicingNotificationsPanel` and `InvoicingPaymentsPanel` work, but they read as
two unrelated utility forms: "send invoice by email" and "register / reverse
payment". The operator has to assemble the closeout in their head — *Did it go
out? Is it paid? Is any of this legally real?* — and the forms invite mistakes
(typing cents, treating an email as proof of payment, reversing casually).

This slice turns them into **one calm closeout lane** with a single point of
focus at any moment.

## The guardrail: three independent truths

The dominant risk in LATAM e-invoicing UIs is implying that one event proves
another. We refuse that everywhere:

- **SRI ≠ Entrega ≠ Pago.** The status triad shows all three with the caption
  *"Tres verdades independientes: el SRI autoriza, tú entregas, el cliente paga."*
- The delivery card footnote: *"No cambia el estado en el SRI ni registra el pago."*
- The payment form footnote: *"No genera asientos contables ni concilia con el banco."*
- The evidence card states plainly that taxes and accounting live in their own
  modules and are a **future** handoff.

If a future PM asks to "auto-mark paid when authorized" or "file taxes from
here", these copy lines are the contract that says no.

## One dominant action at a time

`deriveNextStep(s)` collapses the whole state into a single recommendation,
prioritized:

1. **Draft** → emit first (navigates to document review; nothing else is valid).
2. **Not delivered + has email** → *Enviar al cliente* (deliver before chasing money).
3. **Not delivered + no email** → delivery is blocked, so payment becomes the
   dominant action (if a balance remains) and the missing-email blocker is shown
   in the delivery card — never a dead end.
4. **Delivered + open balance** → *Registrar pago* (or "registra el saldo
   restante" when partial).
5. **Delivered + paid** → cierre completo; no primary action, just evidence.

The verdict header (`deriveVerdict`) gives the emotional headline for the same
state so the operator feels oriented before reading any control.

## Money without cents

Operators think in dollars, not integer cents. The payment input is a `$ + decimal`
field rendered at display size with tabular numerals; quick-fill chips (*saldo
total*, *50%*) compute from `settlement.balanceDueInCents`. Conversion to cents
happens only at submit. Settlement always leads with **Saldo pendiente** — the
number that answers "what do I still need?" — backed by a progress bar and the
Total / Pagado / Saldo triplet.

## Reversal is exceptional

Reversing a payment is real (`reverseInvoicePayment`) but rare and consequential.
It is never a primary button: on desktop it's a ghost action on each posted
payment row; on mobile it's inside the history sheet. Reversed payments stay
visible (struck-through, muted) with their reason and timestamp — an audit
trail, not a delete.

## Mobile reduces anxiety

The handoff's mobile intent is explicit: settlement always visible, one
thumb-friendly action, delivery/payment as separate steps, reversal secondary.
We pin the **verdict + saldo + progress** to the top so the balance never
scrolls away, route delivery / payment / history into **bottom sheets**, and pin
the single recommended action to the bottom. History reads as cards, never a
shrunk table.

## Mood behavior

Every surface reads design-system mood tokens (`--surface`, `--app-bg`,
`--border`, `--primary`, `--success/-soft`, `--warning/-soft`, `--danger/-soft`,
`--info/-soft`, shadows, radii, `--control-h`, `--gutter`, `--card-pad`). The
five moods — **comfort, focus, calm, high-contrast, night** — visibly change the
shell, cards, the verdict/triad tinted panels, the delivery & payment controls,
status pills, success/error banners, progress bar, and the mobile sheets. Mood
is applied at the `.ds-app` root, so it cascades to chrome and content together
— not just the main panel.

## What is real vs. backlog

**Real (wired to frozen endpoints):**
- Send the comprobante by email (`sendInvoiceEmail`).
- Create a payment (`createInvoicePayment`).
- Reverse a payment (`reverseInvoicePayment`).
- Refresh invoice detail (`GET` invoice) to recompute settlement.

**Backlog / explicitly NOT built (no endpoint):**
- Payment gateway, bank reconciliation / settlement.
- WhatsApp delivery, delivery tracking, resend history, receipt PDF.
- Accounting journal posting, tax declaration filing, certification.
- Any SRI mutation (lives in slice 09).
- Editing the customer record / adding the email (the "agregar correo" step
  hands off to the customer surface — out of this slice).
- Persisting the design mood (frontend-only preference today).

## Prototype honesty

Action buttons (send, register, reverse) are **no-ops** in this prototype —
loading and result states are shown by selecting the corresponding scenario, not
by real network calls. Inputs are controlled and editable so the forms feel
live. This mirrors how slice 09 demoed its lifecycle.

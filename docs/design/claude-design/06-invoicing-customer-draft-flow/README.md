# Invoicing Customer + Draft Invoice Flow — Slice 06

The **first operating lane** for issuing in Ecuador: create or select a fiscal
**buyer**, confirm their fiscal identity, then create a **draft invoice**. This
is the bridge between SRI readiness/settings (slice 05) and day-to-day invoice
creation — the refinement of the real extracted component
`apps/web-platform/src/features/invoicing/workspace-customer-draft-flow.tsx`,
driven by `docs/frontend-handoff/06-invoicing-customer-draft-flow.md` and
`docs/design/prompts/06-invoicing-customer-draft-flow.md`.

It builds on `00-platform-shell`, `02-invoicing` and `05-invoicing-settings-sri`
— same Platform Shell chrome, tokens and SRI vocabulary — and turns a two-card
form stack into a calm, guided lane that answers one practical question:

> "How do I create a valid first invoice without getting lost?"

> **Reconciled to the frozen contract.** Every field, enum and action maps 1:1
> to the real types/functions in `apps/web-platform/src/app/types.ts` and
> `api.ts`: `CustomerResponse`, `createCustomer()`, `listCustomers()`,
> `createInvoice()`, `InvoiceNumberingSettingsResponse.previewNumber`,
> `InvoiceSummaryResponse`. No endpoints, fields or behaviors are invented, and
> **nothing in this slice implies SRI submission, authorization, tax filing or
> payment.**

`index.html` is an **interactive viewer**: switch **device** (desktop / mobile),
**state** (14 explicit states) and **design mood** (comfort / focus / calm /
high-contrast / night) from the top control strip. Selection persists in
`localStorage`.

## The core idea — "a guided lane, not two cards"

The current component renders two disconnected cards (customer directory + create
form, and invoice form). The handoff's risk is that this reads like a generic CRM
contact form bolted to a tax form. The refinement makes it a **three-step lane**
with one dominant action at a time:

```
①  Comprador        choose from the directory OR create a fiscal buyer
②  Identidad fiscal  confirm the selected buyer's fiscal identity
③  Borrador          create the draft invoice (clearly NOT an SRI submission)
```

A **stepper** sits at the top (done ✓ / current / upcoming), the **left column**
shows only the active step, and a persistent **right rail** summarizes the flow
(buyer → identity → draft) and carries the one reassurance that this never
touches the SRI. The clear visual distinction between *"buyer saved"* and
*"draft created"* is built into both the stepper and the rail.

## What's on the screen (desktop)

- **Page header** — `Comprador y borrador`, a plain-language subtitle, a quiet
  "Guía rápida" link. No marketing hero.
- **Stepper** — three steps with numbered/check medallions; completed steps turn
  green, the current step is primary-tinted; reachable steps are clickable.
- **Step 1 · Comprador** — when there are no customers, a **strong empty state**
  ("Aún no tienes compradores") leads straight into the create form; when
  customers exist, a **directory** of selectable buyer rows (avatar · name ·
  mono identification · type pill · radio) with a "Nuevo comprador" toggle that
  reveals the form. The **create-customer form** uses friendly Ecuador labels for
  the five identification types and adapts its identification hint/placeholder to
  the chosen type (incl. the `07` Consumidor final `9999999999999` rule).
- **Step 2 · Identidad fiscal** — the selected buyer as a fiscal-identity card:
  type + identification (mono) + email + address, each missing field shown
  honestly, with a calm note explaining these identify the buyer on the invoice.
  One dominant action: *Confirmar y crear borrador*.
- **Step 3 · Borrador** — the draft form (`customer`, `número` with the suggested
  `previewNumber`, `currency`, `status`, `dueAt`, `notes`). On success it becomes
  a **confirmation** ("Factura 001-001-… creada como borrador") that explicitly
  says it is not yet sent to the SRI and points to *Agregar items*.
- **Right rail** — a live flow summary (buyer / identity / draft), a small
  "borrador a crear" preview (number · currency · status), and the SRI
  reassurance block.

## States covered (state switcher)

| # | State | What it shows |
|---|---|---|
| 1 | `loading` | Skeletons for the lane. |
| 2 | `no_customers` | Strong first-buyer empty state + create form. |
| 3 | `customers_available` | Directory of buyers, none selected. |
| 4 | `buyer_selected` | Identity step for the chosen buyer. |
| 5 | `buyer_form_partial` | Create form partially filled (name + partial RUC). |
| 6 | `customer_creating` | Create button → "Guardando comprador…", inputs disabled. |
| 7 | `customer_failed` | Inline danger banner (duplicate RUC) above the form. |
| 8 | `invoice_disabled_no_buyer` | Draft step locked with "primero necesitas un comprador". |
| 9 | `invoice_ready` | Draft form prefilled for the selected buyer. |
| 10 | `invoice_creating` | Create button → "Creando factura…", inputs disabled. |
| 11 | `invoice_failed` | Inline danger banner (duplicate number) above the form. |
| 12 | `invoice_created` | Success confirmation, clearly "not sent to SRI", next = items. |
| 13 | `permission_limited` | Read-only banner; every action becomes a disabled lock. |
| 14 | `backend_unavailable` | Chrome preserved + retry + correlationId. |

## Mobile

Not a shrunk desktop. Behind the shell top bar: a sub-header with the title and a
**compact step indicator** (1 ✓ — 2 ✓ — 3 Borrador), then **one step at a time**
in a single column, with a **sticky thumb-friendly primary action** pinned above
the bottom tabs. The buyer **directory** is a compact tappable list; **creating a
buyer** happens in a **bottom sheet** (progressive fiscal details); identity is a
compact summary card; the draft is a stacked form. Mood switching is its own
bottom sheet.

## Files

```
index.html              Interactive viewer (loads everything below)
src/
  data.js               window.FLOW_DATA — shell context + 14 scenarios, contract-shaped
  icons.jsx             window.Icon — Lucide-geometry icons (+ users/userPlus/idCard/mapPin/coins/calendar)
  components.jsx        window.UI — shared shell primitives (reused from slices 00/02/05)
  chrome.jsx            window.Chrome — Sidebar, TopBar, mobile frame, bottom sheets
  flow-panel.jsx        window.Flow — desktop lane: Stepper, BuyerStep, IdentityStep, DraftStep, FlowRail
  flow-mobile.jsx       window.MobileFlow — one-hand stepped flow + customer bottom sheet
  app.jsx               Viewer chrome + device/state/mood orchestration
mock-data/              JSON fixtures mapped to the real contracts (see _type/_endpoint)
notes.md                Design rationale · hierarchy · guardrails · tensions · a11y
components.md           The reusable components this slice introduces
integration-plan.md     How Codex folds this into workspace-customer-draft-flow.tsx
README.md               This file
```

## Endpoints (source of truth: `docs/api/openapi.json`)

This slice **invents no endpoints**. It uses only the surfaces the handoff names:

```
GET  /api/invoicing/tenants/{slug}/customers          listCustomers()
POST /api/invoicing/tenants/{slug}/customers          createCustomer()
GET  /api/invoicing/tenants/{slug}/invoices           (directory / suggestion context)
POST /api/invoicing/tenants/{slug}/invoices           createInvoice()
GET  /api/invoicing/tenants/{slug}/numbering/invoice  previewNumber suggestion
```

No customer search / edit / merge / import, no draft autosave, no tax validation,
no SRI authorization, no payments — per the handoff guardrails. See
`integration-plan.md`.

## Guardrails honored

Tenant context always visible · one dominant action per step · friendly
Ecuador-aware identification labels · a strong empty state for the first buyer ·
a clear distinction between "buyer saved" and "draft created" · **no scary SRI
language** — the rail and the draft step repeat that creating a draft is not an
SRI submission/authorization · disabled actions stay visible under permission
limits and say why · no marketing onboarding · tone profesional, calmado, es-EC.

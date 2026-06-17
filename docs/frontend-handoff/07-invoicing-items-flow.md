# Invoicing Items Flow Handoff

## Goal

Design the next operational Invoicing slice after customer + draft creation:
adding invoice line items, reviewing item-level tax impact, and understanding
the invoice totals before moving toward XML/RIDE or SRI lifecycle surfaces.

This is the moment where a draft becomes a useful commercial document. It should
feel simple, guided and professional for Ecuador / LATAM operators.

## Current Frontend State

The current frontend surface is:

- `apps/web-platform/src/features/invoicing/workspace-commercial.tsx`
- exported as `InvoicingInvoiceItemsPanel`

It already receives the real selected invoice, tax rates, formatting helpers and
item form state from the parent. This slice should refine presentation and UX
inside the existing component boundary. It should not move data ownership,
invent routes, or request backend changes.

## Product Intent

This flow answers:

> "What am I charging, what tax applies, and is the draft ready to review?"

The user should be guided through:

1. understanding the current draft and buyer context
2. adding the first service/product line
3. seeing line total and tax impact clearly
4. reviewing subtotal, tax and total
5. handing off to document review / XML/RIDE later

It should not feel like a raw database row editor.

## Real Contracts

Use these files as source of truth:

- `InvoiceDetailResponse` in `apps/web-platform/src/app/types.ts`
- `InvoiceItemResponse` in `apps/web-platform/src/app/types.ts`
- `TaxRateResponse` in `apps/web-platform/src/app/types.ts`
- `createInvoiceItem()` in `apps/web-platform/src/app/api.ts`
- `InvoicingInvoiceItemsPanel` in `apps/web-platform/src/features/invoicing/workspace-commercial.tsx`
- OpenAPI contract in `docs/api/openapi.json`

## Endpoints Behind This Surface

- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}`
- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/items`
- `POST /api/invoicing/tenants/{slug}/invoices/{invoiceId}/items`
- `GET /api/invoicing/tenants/{slug}/taxes`

Do not invent item edit, item delete, product catalog, inventory, discount,
withholding, multi-tax, bulk import, autosave, SRI submission, payment or
accounting posting endpoints for this slice.

## Add Item Fields

Current create item body supports:

- description
- quantity
- unit price in cents
- optional tax rate id

The backend calculates:

- position
- line total
- line tax
- invoice subtotal
- invoice tax
- invoice total

The design can show a client-side preview estimate if it is clearly labeled as a
preview, but it must not imply backend totals are committed until the item is
created and refreshed.

## Data To Surface

From `selectedInvoiceDetail`:

- invoice number
- status
- currency
- buyer name / buyer identification when available
- items
- totals
- electronic status only as quiet context, not as an action here

From each item:

- position
- description
- quantity
- unit price
- tax rate name / percentage
- line tax
- line total

From tax rates:

- active rates in the selector
- empty/no active tax rate state

## Required States

Design explicitly for:

- invoice has no items
- invoice has existing items
- add-item form partially complete
- item creation in progress
- item creation failed
- no active tax rates
- draft invoice ready for items
- non-draft invoice where item adding should feel constrained
- permission-limited / read-only
- backend unavailable / selected invoice failed to load
- mobile one-handed entry

## UX Direction

This should feel like a guided composition lane:

- invoice context first
- line item form second
- totals always understandable
- one dominant add action
- no intimidating accounting language at first glance
- tax impact visible but calm

Use language that is friendly for Ecuador operators:

- "Linea"
- "Cantidad"
- "Precio unitario"
- "Impuesto"
- "Subtotal"
- "IVA / impuesto"
- "Total"

Avoid forcing the user to think in cents. The real frontend stores cents, but
the design should express money in normal currency terms where possible and map
back to the existing `unitPriceInCents` control in integration notes.

## Mobile Expectations

Do not shrink the desktop panel.

Mobile should feel purpose-built:

- compact invoice context
- item list as readable rows
- add item as bottom-sheet or focused panel
- totals sticky or immediately visible after entry
- large thumb-friendly add action

## Mood System

Support existing moods:

- comfort
- focus
- calm
- high-contrast
- night

Mood changes must visibly affect:

- item rows
- add item form
- totals summary
- empty state
- warnings/errors
- disabled/read-only state

## Guardrails

- Backend is frozen.
- Do not invent endpoints or new product scope.
- Do not imply SRI submission, signing or authorization.
- Do not imply payment registration or accounting posting.
- Do not imply automatic tax advice.
- Keep it operational, premium, calm and professional.

## Relationship To Nearby Slices

This slice follows:

- `06-invoicing-customer-draft-flow.md`

It prepares:

- invoice detail / review
- XML/RIDE preview
- electronic document lifecycle
- payment registration

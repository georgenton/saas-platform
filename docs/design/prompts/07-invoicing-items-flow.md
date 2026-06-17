# Claude Design Prompt: Invoicing Items Flow

You are designing the next frontend slice for a multi-product SaaS platform.

Use these files as source of truth:

- `docs/project-freeze-handoff.md`
- `docs/frontend-handoff/README.md`
- `docs/frontend-handoff/02-invoicing.md`
- `docs/frontend-handoff/06-invoicing-customer-draft-flow.md`
- `docs/frontend-handoff/07-invoicing-items-flow.md`
- `docs/frontend-handoff/00-platform-shell.md`
- `docs/api/openapi.json`
- `apps/web-platform/src/features/invoicing/workspace-commercial.tsx`
- `apps/web-platform/src/app/api.ts`
- `apps/web-platform/src/app/types.ts`

## Product Context

The backend is frozen. Do not invent endpoints, mutations or backend behavior.

The frontend already has a real component boundary for this surface:

```txt
apps/web-platform/src/features/invoicing/workspace-commercial.tsx
```

Target component:

```txt
InvoicingInvoiceItemsPanel
```

This slice follows the customer + draft invoice lane. The user now has a draft
and needs to add products/services so the invoice becomes a meaningful document.

## Design Goal

Design a premium, friendly and low-friction invoice item entry experience for
Ecuador / LATAM operators.

The user should feel:

- "I know what I am charging"
- "I can add the first line without accounting anxiety"
- "The tax and total impact is clear"
- "This is still only a draft, not an SRI submission"
- "The interface is professional, warm and simple"

## UX Intent

The current component works, but it feels like a technical form plus a list.
Turn it into a guided composition lane:

1. invoice/buyer context
2. current line items
3. add-item form
4. totals review
5. calm handoff toward document review later

Keep one dominant action: add item.

## Real Functional Scope

Item creation supports:

- description
- quantity
- unit price in cents
- optional tax rate id

Existing data supports:

- selected invoice detail
- existing items
- tax rates
- invoice totals
- invoice currency
- invoice status

## Endpoints

Use only these endpoint surfaces for this slice:

- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}`
- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/items`
- `POST /api/invoicing/tenants/{slug}/invoices/{invoiceId}/items`
- `GET /api/invoicing/tenants/{slug}/taxes`

Do not add item edit, delete, product catalog, inventory, discounts,
withholdings, multi-tax, bulk import, autosave, payments, accounting posting,
SRI submission or authorization behavior.

## Important Behavioral Truth

Adding items is not SRI submission.

The design must not imply:

- legal authorization
- SRI acceptance
- signed XML
- RIDE generation
- payment registration
- accounting journal posting
- automatic tax advice

This flow only composes the commercial/economic content of the draft invoice.

## Money UX

The real frontend currently stores `unitPriceInCents`.

Design for human-friendly currency entry, but document clearly in
`integration-plan.md` how Codex should map the design back to the existing
`newItemUnitPriceInCents` value.

Example:

- visual label: "Precio unitario"
- helper text: "Se guarda internamente en centavos"
- integration note: convert displayed currency value to cents only if frontend
  scope allows; otherwise keep existing cents input but improve copy.

## States To Design Explicitly

Design desktop and mobile states for:

1. no items yet
2. items available
3. add-item form partially complete
4. item creation in progress
5. item creation failed
6. no active tax rates
7. draft invoice ready for items
8. non-draft invoice / constrained editing
9. permission-limited / read-only
10. backend unavailable
11. mobile one-handed entry

## Design Direction

Make the surface feel like composing a document, not editing rows.

Possible structure:

- invoice context strip
- item list / empty state
- add item panel
- totals rail or totals card
- "next after items" hint toward review/XML/RIDE without offering SRI actions

Use Ecuador-friendly copy:

- "Linea"
- "Servicio o producto"
- "Cantidad"
- "Precio unitario"
- "Impuesto"
- "Subtotal"
- "IVA / impuesto"
- "Total"

Keep the tone corporate, friendly and aspirational.

## Mobile Expectations

Do not shrink desktop.

Mobile should be purpose-built:

- invoice context compact at top
- item rows easy to scan
- add item in focused panel or bottom sheet
- totals immediately visible after adding
- primary action thumb-friendly

## Mood System

Support the existing platform moods:

- comfort
- focus
- calm
- high-contrast
- night

Mood changes must visibly affect:

- item rows
- add item form
- totals card
- empty state
- warnings/errors
- disabled/read-only states

## Output Required

Return a complete design delivery in the same format as previous slices:

1. interactive viewer
2. desktop layout
3. mobile layout
4. explicit states
5. component hierarchy
6. interaction notes
7. accessibility notes
8. mood behavior
9. mock JSON mapped to the real contracts
10. integration notes for React/Vite/TypeScript

Save the slice under:

```txt
docs/design/claude-design/07-invoicing-items-flow/
```

## Constraints

- React + TypeScript + Vite target
- no invented backend endpoints
- no new products
- no marketing landing page
- no fake compliance automation
- no SRI authorization in this flow
- no payment or accounting posting in this flow
- preserve the existing platform shell and mood foundations

## Final Design Intent

The user should feel that adding invoice lines is calm and understandable. The
system should behave like a professional assistant: it helps compose the draft,
shows the economic impact, and clearly points to the next review step without
pretending the invoice has been submitted or authorized.

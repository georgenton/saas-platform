# Claude Design Prompt: Invoicing Document Review

You are designing the next frontend slice for a multi-product SaaS platform.

Use these files as source of truth:

- `docs/project-freeze-handoff.md`
- `docs/frontend-handoff/README.md`
- `docs/frontend-handoff/02-invoicing.md`
- `docs/frontend-handoff/06-invoicing-customer-draft-flow.md`
- `docs/frontend-handoff/07-invoicing-items-flow.md`
- `docs/frontend-handoff/08-invoicing-document-review.md`
- `docs/frontend-handoff/00-platform-shell.md`
- `docs/api/openapi.json`
- `apps/web-platform/src/features/invoicing/workspace-documents.tsx`
- `apps/web-platform/src/app/api.ts`
- `apps/web-platform/src/app/types.ts`

## Product Context

The backend is frozen. Do not invent endpoints, mutations or backend behavior.

The frontend already has a real component boundary for this surface:

```txt
apps/web-platform/src/features/invoicing/workspace-documents.tsx
```

Target component:

```txt
InvoicingDocumentPreviewPanel
```

This slice follows customer creation, draft creation and item composition. The
user now needs a calm review checkpoint before XML/RIDE/SRI lifecycle work.

## Design Goal

Design a premium, friendly and low-friction document review experience for
Ecuador / LATAM operators.

The user should feel:

- "I can verify this invoice before artifacts"
- "I understand issuer, buyer, numbering, items and totals"
- "I know whether RIDE/XML are available"
- "I am not accidentally submitting to the SRI"
- "Authorization is only shown when the backend confirms it"

## UX Intent

The current component works, but it mixes printable invoice data, RIDE data,
artifacts and actions with limited hierarchy. Turn it into a review desk:

1. document readiness at a glance
2. issuer and buyer identity
3. numbering / fiscal context
4. line items and totals
5. artifact availability
6. quiet handoff toward XML/RIDE detail or electronic lifecycle later

Keep one dominant action at a time.

## Real Functional Scope

This surface can use:

- `InvoiceDocumentResponse`
- `InvoiceRideResponse`
- `InvoiceElectronicArtifactsResponse`
- printable invoice open action
- RIDE open/download action
- XML download action

Existing adjacent notification component:

- `InvoicingNotificationsPanel`

Keep email adjacent; do not let it dominate the review surface.

## Endpoints

Use only these endpoint surfaces for this slice:

- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/document`
- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/document/html`
- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/ride`
- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/ride/html`
- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/ride/download`
- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/artifacts`
- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/xml`
- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/xml/download`

Do not add generate, sign, submit, authorize, edit, regenerate, certify, file,
payment or accounting posting behavior.

## Important Behavioral Truth

Reviewing a document is not SRI submission.

The design must not imply:

- legal authorization before backend confirmation
- signed XML unless backend says so
- SRI acceptance
- automatic filing
- accountant replacement
- autonomous compliance execution

RIDE may be referential or authorized. Make that distinction very clear.

## Data To Represent

Issuer:

- legal name
- commercial name
- RUC / tenant slug fallback
- environment
- emission type
- accounting obligated / RIMPE / special taxpayer when present
- matrix / establishment address

Buyer:

- name
- email
- identification type
- identification / tax id
- billing address

Invoice:

- document label
- number
- document code
- establishment / emission point / sequence
- status
- currency
- issued date / due date
- notes
- electronic status
- access key
- authorization number / date when present

Lines and totals:

- description
- quantity
- unit price
- line subtotal
- tax rate
- line tax
- line total
- subtotal
- tax
- total

Artifacts:

- printable invoice
- RIDE
- XML
- can download flags
- file names
- access key chunks

## States To Design Explicitly

Design desktop and mobile states for:

1. no selected document / nothing loaded
2. loading document review
3. draft/pre-submission document ready
4. missing issuer fiscal data
5. missing buyer fiscal data
6. invoice has no items
7. totals available
8. RIDE unavailable
9. RIDE available but not authorized
10. RIDE authorized / printable as authorized
11. XML available for preview/download
12. artifacts unavailable
13. backend unavailable
14. mobile review flow

## Design Direction

Make the surface feel like a review desk, not raw debug output.

Possible structure:

- review verdict header
- issuer/buyer cards
- numbering/environment strip
- line items and totals
- artifact availability panel
- access key / authorization evidence only when relevant
- quiet next-step hint toward XML/RIDE detail or electronic lifecycle

Use Ecuador-aware copy:

- "Revision del documento"
- "Version imprimible"
- "RIDE"
- "XML preliminar"
- "Aun no autorizado"
- "Autorizado"
- "Clave de acceso"
- "Numero de autorizacion"

## Mobile Expectations

Do not shrink desktop.

Mobile should be purpose-built:

- review verdict at top
- identity cards stacked
- line items as compact rows
- totals close to line items
- artifact actions grouped together
- access key copy-friendly when present

## Mood System

Support the existing platform moods:

- comfort
- focus
- calm
- high-contrast
- night

Mood changes must visibly affect:

- verdict header
- identity cards
- artifact states
- line rows
- totals
- warnings/blockers
- access key evidence

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
docs/design/claude-design/08-invoicing-document-review/
```

## Constraints

- React + TypeScript + Vite target
- no invented backend endpoints
- no new products
- no marketing landing page
- no fake compliance automation
- no SRI submission in this flow
- no legal authorization unless backend confirms it
- no payment or accounting posting in this flow
- preserve the existing platform shell and mood foundations

## Final Design Intent

The user should feel that document review is clear and safe. The system should
behave like a professional reviewer: it shows what is complete, what is missing,
which artifacts are available, and where the next electronic workflow begins
without pretending that the invoice has been submitted or authorized.

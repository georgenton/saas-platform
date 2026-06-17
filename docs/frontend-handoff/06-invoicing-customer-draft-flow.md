# Invoicing Customer + Draft Invoice Flow Handoff

## Goal

Design the next operational Invoicing slice around the first real issuing path:
create or select a fiscal buyer, then create a draft invoice that can later
receive items, payments, XML/RIDE previews and SRI lifecycle actions.

This is the bridge between SRI readiness/settings and day-to-day invoice
creation. It must feel simple enough for a small Ecuador operator, while still
respecting the fiscal data needed by the backend.

## Current Frontend State

The frontend now has a dedicated component boundary:

- `apps/web-platform/src/features/invoicing/workspace-customer-draft-flow.tsx`

It was extracted from `app.tsx` so Claude Design can refine a real surface
instead of designing against the old monolithic screen.

The component currently renders two linked cards:

1. customer creation / directory
2. draft invoice creation

The parent still owns data fetching, mutations and form state. This slice should
therefore refine UX hierarchy and interaction design without requesting new
backend behavior.

## Product Intent

This flow answers a very practical question:

> "How do I create a valid first invoice without getting lost?"

The user should feel guided through a short sequence:

1. identify the buyer
2. confirm buyer fiscal data
3. create a draft invoice
4. continue to items and SRI preparation in later surfaces

Avoid presenting the flow as a generic CRM contact form or as a technical tax
wall. It is an operating lane for fiscal sales documents.

## Real Contracts

Use these frontend types and API functions as source of truth:

- `CustomerResponse` in `apps/web-platform/src/app/types.ts`
- `createCustomer()` in `apps/web-platform/src/app/api.ts`
- `listCustomers()` in `apps/web-platform/src/app/api.ts`
- `createInvoice()` in `apps/web-platform/src/app/api.ts`
- OpenAPI contract in `docs/api/openapi.json`

## Endpoints Behind This Surface

- `GET /api/invoicing/tenants/{slug}/customers`
- `POST /api/invoicing/tenants/{slug}/customers`
- `GET /api/invoicing/tenants/{slug}/invoices`
- `POST /api/invoicing/tenants/{slug}/invoices`
- `GET /api/invoicing/tenants/{slug}/numbering/invoice`

Do not invent customer search, customer edit, customer merge, draft autosave,
bulk import, tax validation, SRI authorization or payment endpoints for this
slice.

## Customer Fields

Current customer creation supports:

- name
- email
- identification type
- identification / tax ID
- billing address

Ecuador buyer identification types exposed by the UI:

- `04` RUC
- `05` Cedula
- `06` Pasaporte
- `07` Consumidor final
- `08` Exterior

The design should make these understandable without overwhelming the user.

## Draft Invoice Fields

Current draft invoice creation supports:

- customer
- number
- currency
- status
- due date
- notes

The backend can suggest numbering through existing numbering settings. The UI
should make the suggested number feel helpful, but should not imply a legal SRI
authorization at this step.

## Required States

Design explicitly for:

- loading customers / invoices
- no customers yet
- customers available
- customer form partially complete
- customer creation in progress
- customer creation failed
- invoice draft form disabled because no customer exists
- invoice draft form ready
- invoice creation in progress
- invoice creation failed
- permission-limited
- backend unavailable

## UX Direction

The flow should feel like a friendly guided lane:

- one obvious next step
- small number of visible fields at a time
- helpful fiscal labels
- strong empty state for the first buyer
- clear distinction between "buyer saved" and "invoice draft created"
- no scary SRI language before it is relevant

The target experience is rich, unique and simplified so users do not abandon the
product because the accounting process feels too complex.

## Mobile Expectations

Do not shrink the desktop cards.

Mobile should feel purpose-built:

- buyer list or selected buyer as a compact top area
- draft creation as a clear next step
- bottom-sheet or stepped entry for fiscal details if useful
- strong thumb-friendly primary action
- no dense two-column forms

## Mood System

Support existing moods:

- comfort
- focus
- calm
- high-contrast
- night

Mood changes must be visible in form surfaces, empty states, selected buyer
treatment, disabled states, errors and action hierarchy.

## Guardrails

- Backend is frozen.
- Do not invent endpoints or new product scope.
- Do not imply SRI submission or authorization in this flow.
- Do not imply automatic tax advice.
- Do not turn this into a marketing onboarding screen.
- Keep it operational, calm and professional.

## Relationship To Nearby Slices

This slice follows:

- `02-invoicing.md`
- `03-invoicing-sri-progressive-disclosure.md`
- `05-invoicing-settings-sri.md`

It prepares the next likely screens:

- invoice item entry
- invoice detail refinement
- XML/RIDE preview refinement
- electronic submission lifecycle

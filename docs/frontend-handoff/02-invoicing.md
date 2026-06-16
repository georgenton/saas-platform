# Invoicing Handoff

## Goal

Design a professional Ecuador-ready invoicing workspace covering customers,
invoice lifecycle, payments, electronic document readiness and SRI-facing
artifacts.

## Primary User

Owner/operator responsible for issuing and tracking invoices.

## Core Endpoints

- `GET /api/invoicing/tenants/:slug/reports/summary`
- `GET /api/invoicing/tenants/:slug/customers`
- `GET /api/invoicing/tenants/:slug/customers/:customerId`
- `GET /api/invoicing/tenants/:slug/invoices`
- `GET /api/invoicing/tenants/:slug/invoices/:invoiceId`
- `POST /api/invoicing/tenants/:slug/invoices`
- `GET /api/invoicing/tenants/:slug/invoices/:invoiceId/items`
- `GET /api/invoicing/tenants/:slug/invoices/:invoiceId/payments`
- `POST /api/invoicing/tenants/:slug/invoices/:invoiceId/payments`
- `POST /api/invoicing/tenants/:slug/invoices/:invoiceId/payments/:paymentId/reverse`

## Ecuador Electronic Invoicing Endpoints

- `GET /api/invoicing/tenants/:slug/electronic-profile`
- `GET /api/invoicing/tenants/:slug/electronic-document/readiness`
- `GET /api/invoicing/tenants/:slug/electronic-signature`
- `GET /api/invoicing/tenants/:slug/electronic-signature/inspection`
- `GET /api/invoicing/tenants/:slug/electronic-submission`
- `GET /api/invoicing/tenants/:slug/numbering/invoice`
- `GET /api/invoicing/tenants/:slug/taxes`
- `GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/xml`
- `GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/ride`
- `POST /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/submit`
- `POST /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/check-authorization`

## Required Screens

1. Invoicing dashboard.
2. Customer directory.
3. Invoice list.
4. Invoice detail.
5. Invoice creation/editing flow.
6. Payment panel.
7. Electronic document readiness panel.
8. XML/RIDE preview panel.
9. Numbering and tax settings.

## Current Frontend Foundation

The first integrated slice extracts only the top operational summary into
`apps/web-platform/src/features/invoicing/`.

Current feature files:

- `model.ts`: hero, readiness ribbon, metrics, next-action contract and
  lifecycle stage preview for the current workspace shell.
- `adapters.ts`: maps existing `app.tsx` state into the feature model and now
  derives readiness/blockers from issuer, signature, gateway, numbering and
  electronic sandbox signals.
- `invoicing-workspace.tsx`: reusable workspace shell rendered at the top of
  the existing Invoicing domain screen; it now acts as a barrel over smaller
  internal modules for summary, shared lifecycle state, operations, electronic
  controls, documents/notifications, and commercial detail.
- `queries.ts`: TanStack Query key taxonomy plus the extracted read-side
  workspace query for customers, tax rates, invoices, report summary, drafting
  assist, issuer profile, submission settings, numbering and electronic
  readiness.
- `use-invoicing-workspace-model.ts`: memoized model hook.

The existing screen still owns some remaining write-heavy flows, but the main
invoice detail experience is already modularized enough to treat the next work
as refinement rather than first extraction. Claude Design can now assume the
workspace shell, SRI controls, document surfaces, payments, items, and
notifications already have clear frontend boundaries. The summary/entry zone is
also already moving toward the reviewed slice behavior: one dominant hero
action, compact readiness glance, operational KPI row, and a focused "next
operational step" area instead of a generic dashboard stack.

The current design source-of-truth for the next UI integration phase is:

- `docs/design/claude-design/02-invoicing-workspace/`
- `docs/frontend-handoff/03-invoicing-sri-progressive-disclosure.md`

That slice has already been reviewed and is being integrated incrementally. New
design requests should build on it instead of redefining the workspace shell.

## Design Slice 02 Scope

Recommended Claude Design request:

- Web and mobile Invoicing workspace for Ecuador.
- Preserve professional, corporate, friendly tone.
- Show issuer profile, SRI environment, gateway/submission readiness,
  numbering, invoice portfolio metrics and next actions.
- Include states for no issuer profile, no invoices, draft invoices, pending
  authorization, authorized, rejected and electronic readiness blocked.
- Use mood-aware shell primitives and avoid marketing-style hero layouts.
- Distinguish preview, generated artifact, submitted artifact and authorized
  artifact.

## Actions

- create invoice
- add payment
- reverse payment
- preview XML/RIDE
- submit electronic document
- check authorization
- send email

## States

- no customers
- no invoices
- draft invoice
- issued invoice
- partially paid
- paid
- electronic readiness blocked
- submitted/pending authorization
- authorized/rejected

## Guardrails

- UI must distinguish preview, generated artifact, submitted artifact and
  authorized artifact.
- Do not imply SRI authorization before the backend status says so.
- Signature/certificate settings should show inspection results and blockers
  before submit actions.
- The hero should keep a single primary action and use progressive disclosure
  for dense SRI configuration.
- The workspace should feel premium but cognitively light for Ecuador operators:
  one main action at a time, calm hierarchy, and clear operational guidance.

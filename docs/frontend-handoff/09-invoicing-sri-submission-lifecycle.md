# Invoicing SRI Submission Lifecycle Handoff

## Goal

Design the Ecuador SRI lifecycle surface that sits after document review and
before the user treats an invoice as legally authorized.

This screen answers:

> "What is the exact next safe step with the SRI, and what does the current
> electronic status legally mean?"

The experience must reduce anxiety for Ecuador operators. It should explain the
path from prepared document to submitted document to authorized comprobante
without making the flow feel like a technical console.

## Current Frontend State

The real integration target is:

- `apps/web-platform/src/features/invoicing/workspace-electronic.tsx`
- exported as `InvoicingElectronicStatusPanel`
- paired with `InvoicingTechnicalTracePanel`

The component already has the real actions and state. This slice should refine
hierarchy, language, mobile behavior, and progressive disclosure inside the
existing component boundary.

Do not redesign the whole Invoicing workspace. Do not move the customer, items
or document review flows.

## Product Intent

This flow should feel like an SRI control tower with one safe recommendation at
a time.

The user should understand:

1. whether the document can be submitted
2. whether the SRI already received it
3. whether authorization is still pending
4. whether the SRI returned or rejected it
5. whether the document is legally authorized
6. what evidence can be copied or reviewed
7. when manual intervention or fallback is truly needed

## Real Contracts

Use these files as source of truth:

- `InvoiceDetailResponse` in `apps/web-platform/src/app/types.ts`
- `ElectronicSandboxReadinessResponse` in `apps/web-platform/src/app/types.ts`
- `submitInvoiceElectronicDocument()` in `apps/web-platform/src/app/api.ts`
- `submitPresignedInvoiceElectronicDocument()` in `apps/web-platform/src/app/api.ts`
- `checkInvoiceElectronicAuthorization()` in `apps/web-platform/src/app/api.ts`
- `updateInvoiceElectronicStatus()` in `apps/web-platform/src/app/api.ts`
- `fetchInvoiceElectronicXmlPreview()` in `apps/web-platform/src/app/api.ts`
- `InvoicingElectronicStatusPanel` in
  `apps/web-platform/src/features/invoicing/workspace-electronic.tsx`
- `InvoicingTechnicalTracePanel` in
  `apps/web-platform/src/features/invoicing/workspace-electronic.tsx`
- OpenAPI contract in `docs/api/openapi.json`

## Endpoints Behind This Surface

- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/xml`
- `POST /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/submit`
- `POST /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/submit-presigned`
- `POST /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/check-authorization`
- `POST /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-status`

Do not invent new endpoints. Do not invent regenerate, re-sign, certify,
accounting, filing, payment, or automatic tax declaration behavior.

## Existing Actions

The real component already receives these handlers:

- `onLoadXmlPreview`
- `onSubmitElectronicDocument`
- `onSubmitPresignedInvoiceElectronicDocument`
- `onCheckAuthorization`
- `onUpdateElectronicStatus`
- `onInvoiceAccessKeyChange`
- `onInvoiceAuthorizationNumberChange`
- `onInvoiceAuthorizedAtChange`
- `onInvoiceElectronicStatusChange`
- `onInvoiceElectronicStatusMessageChange`
- `onPresignedInvoiceSignerNameChange`
- `onPresignedInvoiceXmlChange`

The primary lane should use only:

- view XML preview
- sign and submit to SRI
- check authorization
- copy access key / authorization number when available

The secondary lane should contain:

- manual reconciliation / status update
- presigned XML fallback
- technical trace

## Data To Surface

From `InvoiceDetailResponse`:

- invoice status
- electronic status
- access key
- authorization number
- authorized at
- submitted at
- submission reference
- electronic status message
- electronic events
- document code

From `ElectronicSandboxReadinessResponse` document support:

- document code
- document label
- submit support
- detail / blocker copy

From local derived state:

- `canSubmitElectronicDocument`
- `documentSupportDetail`
- `actionLoading`
- whether access key is already present
- whether XML preview has been requested
- whether fallback/manual panels are open

## Required States

Design explicitly for:

- no selected invoice
- invoice still in draft
- electronic readiness blocked
- unsupported document type
- ready to submit
- submitting / action loading
- submitted and waiting for authorization
- checking authorization / action loading
- authorized
- rejected / returned with SRI message
- access key available
- authorization number available
- XML preview available
- manual reconciliation open
- presigned XML fallback open
- technical trace collapsed
- technical trace expanded with events
- backend unavailable
- permission-limited / read-only
- mobile lifecycle flow

## UX Direction

This should feel like a calm legal-status assistant, not a raw integration
console.

Preferred hierarchy:

1. verdict header with legal meaning
2. lifecycle stepper: Preparado -> Enviado al SRI -> Autorizado
3. one recommended next step
4. compact evidence panel: access key, authorization number, submitted at
5. blocker or SRI message when relevant
6. advanced disclosure: manual reconciliation
7. advanced disclosure: presigned XML fallback
8. quiet technical trace

Use language like:

- "Listo para enviar"
- "Enviado al SRI"
- "Pendiente de autorización"
- "Autorizado por el SRI"
- "Devuelto por el SRI"
- "Consultar autorización"
- "Ver XML preliminar"
- "Intervención manual"
- "Fallback técnico"
- "Historial técnico"

## Critical Guardrails

- Backend is frozen.
- Do not imply authorization before the backend confirms `authorized`.
- "Submitted" means the SRI received or is processing it; it does not mean
  authorized.
- Do not present the fallback path as the main path.
- Do not make manual reconciliation feel like normal daily operation.
- Do not imply accountant replacement or automatic tax filing.
- Do not imply the UI can certify, legalize or regenerate documents without a
  real endpoint.
- Keep one primary action at a time.
- Keep XML preview separate from submission and authorization.

## Mobile Expectations

Do not shrink desktop.

Mobile should be purpose-built:

- top legal-status verdict
- thumb-friendly primary action
- lifecycle stepper visible without horizontal scrolling
- evidence as copy-friendly rows
- manual/fallback/trace behind bottom-sheet or accordion behavior
- SRI messages readable without dense raw payloads

## Mood System

Support existing moods:

- comfort
- focus
- calm
- high-contrast
- night

Mood changes must visibly affect:

- legal verdict
- lifecycle stepper
- blockers and rejected states
- evidence cards
- fallback/manual panels
- technical trace

## Relationship To Nearby Slices

This slice follows:

- `06-invoicing-customer-draft-flow.md`
- `07-invoicing-items-flow.md`
- `08-invoicing-document-review.md`

It prepares:

- email delivery refinement
- payments refinement
- accounting / tax compliance handoff from authorized invoices

## Deliverable Expectations For Claude Design

Save the slice at:

- `docs/design/claude-design/09-invoicing-sri-submission-lifecycle/`

Include:

- `index.html`
- `src/`
- `mock-data/`
- `README.md`
- `notes.md`
- `components.md`
- `integration-plan.md`

The `integration-plan.md` must map each action to the existing handler names and
explicitly identify what is primary, secondary, advanced, or read-only.

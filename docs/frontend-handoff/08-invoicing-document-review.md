# Invoicing Document Review Handoff

## Goal

Design the review surface that sits after customer, draft and invoice items, and
before XML/RIDE/SRI lifecycle actions. The user should be able to confirm that a
commercial/fiscal document looks complete, understandable and ready for preview
artifacts without feeling that it has already been submitted to the SRI.

This is not the electronic submission screen. It is the calm review checkpoint
between invoice composition and electronic document artifacts.

## Current Frontend State

The current frontend surface is:

- `apps/web-platform/src/features/invoicing/workspace-documents.tsx`
- exported as `InvoicingDocumentPreviewPanel`
- paired with `InvoicingNotificationsPanel`

The current panel already displays printable invoice data, RIDE data, artifacts
and email notification controls. This slice should refine presentation and
hierarchy inside the existing component boundary. It should not invent
submission behavior.

## Product Intent

This flow answers:

> "Is this invoice complete and ready to preview as a document?"

The user should review:

1. issuer identity
2. buyer identity
3. numbering / document type
4. environment and emission mode
5. line items
6. subtotal, tax and total
7. electronic status as quiet context
8. whether printable / RIDE / XML artifacts are available

## Real Contracts

Use these files as source of truth:

- `InvoiceDocumentResponse` in `apps/web-platform/src/app/types.ts`
- `InvoiceRideResponse` in `apps/web-platform/src/app/types.ts`
- `InvoiceElectronicArtifactsResponse` in `apps/web-platform/src/app/types.ts`
- `fetchInvoiceDocument()` in `apps/web-platform/src/app/api.ts`
- `fetchInvoiceDocumentHtml()` in `apps/web-platform/src/app/api.ts`
- `fetchInvoiceElectronicRide()` in `apps/web-platform/src/app/api.ts`
- `fetchInvoiceElectronicArtifacts()` in `apps/web-platform/src/app/api.ts`
- `fetchInvoiceElectronicXmlPreview()` in `apps/web-platform/src/app/api.ts`
- `downloadInvoiceElectronicRideHtml()` in `apps/web-platform/src/app/api.ts`
- `downloadInvoiceElectronicXmlPreview()` in `apps/web-platform/src/app/api.ts`
- `InvoicingDocumentPreviewPanel` in `apps/web-platform/src/features/invoicing/workspace-documents.tsx`
- OpenAPI contract in `docs/api/openapi.json`

## Endpoints Behind This Surface

- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/document`
- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/document/html`
- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/ride`
- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/ride/html`
- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/ride/download`
- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/artifacts`
- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/xml`
- `GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/xml/download`

Do not invent generate, sign, submit, authorize, edit, regenerate, certify,
legalize, payment or accounting endpoints.

## Data To Surface

From `InvoiceDocumentResponse`:

- issuer legal/commercial identity
- issuer RUC / tenant slug fallback
- environment
- emission type
- accounting obligated / RIMPE / special taxpayer when available
- customer identity, email and address
- invoice number, document code, establishment, emission point, sequence
- buyer identification fields
- status, currency, issued/due dates, notes
- line items
- totals

From `InvoiceRideResponse`:

- document label
- environment label
- emission type label
- sequence display
- electronic status label
- whether it can be printed as authorized
- access key chunks
- authorization number / authorized at / message
- additional info fields

From `InvoiceElectronicArtifactsResponse`:

- RIDE HTML file name
- XML file name
- access key
- electronic status
- can download RIDE
- can download XML

## Required States

Design explicitly for:

- no selected document / nothing loaded yet
- loading document review
- document ready as draft/pre-submission
- missing issuer fiscal data
- missing buyer fiscal data
- invoice has no items
- totals available
- RIDE unavailable
- RIDE available but not authorized
- RIDE authorized / printable as authorized
- XML available for preview/download
- artifacts unavailable
- backend unavailable
- mobile review flow

## UX Direction

This should feel like a review desk:

- document readiness at a glance
- issuer and buyer identity side-by-side
- numbering and fiscal context clearly visible
- line items and totals easy to scan
- artifact availability clearly separated from legal authorization
- one primary action at a time

Use careful language:

- "Revision del documento"
- "Version imprimible"
- "RIDE"
- "XML preliminar"
- "Aun no autorizado"
- "Autorizado" only when backend says so

## Guardrails

- Backend is frozen.
- Do not imply SRI submission.
- Do not imply legal authorization before backend status says so.
- Do not invent signing, regeneration, certification or filing.
- Do not imply accountant replacement.
- RIDE and XML are preview/download artifacts here, not autonomous compliance.
- Email notification is adjacent and should not become the main review action.

## Mobile Expectations

Do not shrink desktop.

Mobile should be purpose-built:

- document status at top
- issuer/buyer cards stacked
- line items readable
- totals visible near the bottom
- artifact actions grouped in a focused area
- access key chunks copy-friendly when present

## Mood System

Support existing moods:

- comfort
- focus
- calm
- high-contrast
- night

Mood changes must visibly affect:

- readiness cards
- identity cards
- line rows
- artifact availability states
- warnings / blockers
- access key and technical evidence surfaces

## Relationship To Nearby Slices

This slice follows:

- `06-invoicing-customer-draft-flow.md`
- `07-invoicing-items-flow.md`

It prepares:

- XML/RIDE detailed preview
- electronic submission lifecycle
- email delivery refinement

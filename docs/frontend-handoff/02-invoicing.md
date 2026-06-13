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

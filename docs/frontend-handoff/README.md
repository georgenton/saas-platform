# Frontend Handoff Pack

This folder is the product-to-frontend handoff for Claude Design. The backend is
frozen through Full Accounting completion closeout 1.8, so design work should
consume existing contracts before requesting new backend scope.

## Contract Sources

- Machine-readable API contract: `docs/api/openapi.json`
- Local API contract endpoint: `GET /api/openapi.json`
- Local documentation page: `GET /api/docs`
- Conceptual product model: `docs/saas-conceptual-model.md`
- Manual QA references: `docs/manual-testing.md`
- Claude Design workflow: `docs/design/README.md`
- Claude Design prompts: `docs/design/prompts`

## Implementation Order

0. `00-access-login-gateway.md`
1. `00-platform-shell.md`
2. `01-product-command-center.md`
3. `02-invoicing.md`
4. `03-invoicing-sri-progressive-disclosure.md`
5. `05-invoicing-settings-sri.md`
6. `06-invoicing-customer-draft-flow.md`
7. `07-invoicing-items-flow.md`
8. `08-invoicing-document-review.md`
9. `09-invoicing-sri-submission-lifecycle.md`
10. `10-invoicing-vercel-qa-runbook.md`
11. `11-invoicing-payment-email-delivery-closeout.md`
12. `03-ecommerce.md`
13. `04-tax-compliance-ec.md`
14. `05-accounting.md`
15. `06-ai-console.md`
16. `07-clinics.md`
17. `08-growth.md`

## Current Active Sequence

The current frontend priority is:

1. Access / Login Gateway
2. Product Command Center handoff cleanup as needed
3. Resume Invoicing refinement on top of a real entry experience
4. Mature the Ecuador SRI workspace and settings before expanding other product screens
5. Refine the customer + draft invoice lane before moving to invoice items and detail polish
6. Refine invoice item entry and totals before document review / XML / RIDE
7. Refine document review before deeper XML / RIDE and electronic lifecycle work
8. Refine the SRI submission lifecycle before email delivery, payments and
   cross-product handoff into accounting / tax compliance
9. Preserve the Vercel/Railway QA runbook as the minimum no-regression flow
   before requesting the next Claude Design surface
10. Refine payment, email delivery and evidence closeout before moving into
    Tax Compliance / Accounting handoff screens

This order is intentional. The team should not continue polishing signed-in
product surfaces as if the JWT textarea were the permanent entrance to the app.

## Design Rules For Claude Design

- Build operational product screens, not marketing pages.
- Keep cards for repeated records, modals and framed tools only.
- Prefer dense, scannable layouts for finance, tax, accounting and operations.
- Every screen must define loading, empty, error, ready and blocked states.
- Every action must map to an endpoint and state whether it mutates backend
  data or only requests a packet/preview.
- AI surfaces stay in suggestion, approval or guarded-execution mode as exposed
  by the backend; never imply autonomous execution.
- Tax and accounting screens must preserve professional boundaries: the UI must
  not imply automatic filing, signature, certification, legalization or
  replacement of accountant judgment.

## Handoff Checklist Per Screen

- Screen name
- Primary user
- Goal
- Entry point
- Endpoints
- Primary data
- Actions
- States
- Navigation
- Guardrails
- Open design questions

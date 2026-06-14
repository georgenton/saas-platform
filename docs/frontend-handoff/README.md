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

1. `00-platform-shell.md`
2. `01-product-command-center.md`
3. `02-invoicing.md`
4. `03-ecommerce.md`
5. `04-tax-compliance-ec.md`
6. `05-accounting.md`
7. `06-ai-console.md`
8. `07-clinics.md`
9. `08-growth.md`

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

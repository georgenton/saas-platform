# Product Command Center

## Goal

Give the operator a single first screen that shows what products are active,
which areas need attention and where to continue work.

## Primary User

Owner/operator who needs an at-a-glance operating console.

## Endpoints

- `GET /api/tenancy/tenants/:slug/products`
- `GET /api/invoicing/tenants/:slug/reports/summary`
- `GET /api/ecommerce/tenants/:slug/store-setup-workspace`
- `GET /api/growth/tenants/:slug/conversations/assist/daily-agenda`
- `GET /api/tax-compliance/tenants/:slug/ec/command-center`
- `GET /api/accounting/tenants/:slug/full-accounting-completion-closeout/closeout`
- `GET /api/ai/tenants/:slug/operations-summary`

## Primary Data

- enabled product list
- product readiness/status
- next recommended action
- blocked or needs-review counts
- latest closeout/summary signal

## Required Sections

1. Product status grid.
2. Work queue / next actions.
3. Financial/tax/accounting summary strip.
4. AI operations summary.
5. Recently blocked workflows.

## States

- loading dashboard
- no products enabled
- product ready
- product needs review
- product blocked
- partial backend failure

## Guardrails

- This screen summarizes; it should not expose every endpoint.
- Avoid turning closeout states into legal/compliance claims.
- Show “needs review” and “blocked” as operational signals, not failures.

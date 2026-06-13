# Accounting Handoff

## Goal

Design Accounting as a guided professional workflow, not a giant list of all
backend slices. Full Accounting is frozen through completion closeout 1.8.

## Primary User

Owner/operator working with an accountant or preparing accounting evidence.

## Priority Endpoints

- `GET /api/accounting/tenants/:slug/intake-workspace`
- `GET /api/accounting/tenants/:slug/operational-command-center`
- `GET /api/accounting/tenants/:slug/foundation-closeout-summary`
- `POST /api/accounting/tenants/:slug/ai-review-assistant-packet`
- `GET /api/accounting/tenants/:slug/full-accounting-completion-closeout/closeout`

Use the `Accounting` tag in `docs/api/openapi.json` for detailed drill-down
screens.

## Required Screens

1. Accounting command center.
2. Period intake.
3. Evidence vault/timeline.
4. Journal/ledger workspace.
5. Bank reconciliation workspace.
6. Accountant review room.
7. Period closeout.
8. Full Accounting lifecycle summary.
9. Completion closeout 1.8.

## Guardrails

- Do not expose every 0.1-1.8 slice as a first-level nav item.
- Use progressive disclosure: summary first, drill-down second.
- Never imply official posting, certification, signing, legalization or filing
  unless a future backend contract explicitly supports it.

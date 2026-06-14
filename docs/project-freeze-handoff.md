# Project Freeze Handoff

## Freeze Decision

The product backlog is frozen after Full Accounting completion closeout 1.8.
The next phase is not another backend product. The next phase is contract,
local QA and frontend design handoff.

## Included Product Surface

- Core platform
- Tenancy and commercial access
- Parties
- Invoicing and Ecuador electronic invoicing
- Ecommerce
- Growth and WhatsApp operations
- Tax Compliance EC
- Accounting and Full Accounting through completion closeout 1.8
- AI console, suggestion runs, approval and guarded-execution infrastructure
- Medical Clinics
- Psychology Clinics

## Handoff Outputs

- `docs/api/openapi.json`
- `GET /api/openapi.json`
- `GET /api/docs`
- `docs/frontend-handoff/README.md`
- product-specific handoff files in `docs/frontend-handoff`

## How Claude Design Should Consume This

1. Start with `docs/frontend-handoff/00-platform-shell.md`.
2. Use `docs/api/openapi.json` as the endpoint source of truth.
3. Design one product area at a time.
4. Preserve guardrails from each handoff file.
5. Return implementation questions as contract-hardening requests, not as
   silent frontend assumptions.

## What Not To Do Yet

- Do not open new backend products.
- Do not add autonomous AI execution.
- Do not redesign every screen at once.
- Do not imply tax filing, accounting certification, legal signature or clinical
  diagnosis automation unless a future backend contract explicitly supports it.

## Frontend-First Backlog

The frontend may explore design moods during the Claude Design phase. These
moods are a user-comfort UX layer beyond light/dark theme selection.

Initial moods:

- comfort
- focus
- calm
- high-contrast
- night

Backend persistence is intentionally deferred until after the frontend proves
the experience. Future backend scope may include user preference persistence,
per-device overrides, tenant defaults and accessibility preference sync.

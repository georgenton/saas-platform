# Invoicing SRI Progressive Disclosure Handoff

## Goal

Refine the Ecuador electronic invoicing control area so it feels calm,
professional, and guided for operators who are not SRI specialists.

This is not a new product surface. It is the next refinement pass on the
existing Invoicing workspace already integrated under:

- `apps/web-platform/src/features/invoicing/workspace-electronic.tsx`
- `docs/design/claude-design/02-invoicing-workspace/`

## Product Intent

The SRI area should stop feeling like a technical wall.

Desired hierarchy:

1. Immediate status:
   - document condition
   - legal/SRI condition
   - access key readiness
2. Recommended next step:
   - what the operator should do now
   - why
3. Compact operating mode:
   - keep dense controls hidden by default
4. Detailed intervention mode:
   - open only when there is a blocker, a reconciliation need, or a deliberate
     operator action
5. Advanced fallback:
   - external signed XML / sandbox bridge
   - visibly secondary, never the main path
6. Technical evidence:
   - preserved for support and diagnostics
   - visually quieter than the operational controls

## Current Frontend State

Already integrated:

- top status section
- SRI overview cards
- operational guidance card
- compact cards for:
  - `Configuración y conciliación`
  - `Sandbox real / fallback técnico`
- progressive disclosure toggles for:
  - manual SRI control
  - fallback XML bridge
- technical trace hidden behind an explicit reveal action

Current file:

- `apps/web-platform/src/features/invoicing/workspace-electronic.tsx`

## What Claude Design Should Improve Next

Design a richer, more premium version of this same behavior for web and mobile.

Important: improve the experience, but preserve the behavioral contract.

### Keep

- one calm operational explanation at a time
- distinction between:
  - internal document state
  - legal/SRI state
- dense SRI controls hidden by default
- fallback technical path visually secondary
- technical trace not competing with daily operation

### Improve

- visual polish of compact SRI cards
- clearer affordance for expanding/collapsing detail
- stronger hierarchy between:
  - normal operation
  - blocked state
  - advanced fallback
- more elegant mobile behavior for:
  - compact cards
  - opened detail blocks
  - technical trace reveal

## Core Endpoints Behind This Surface

- `GET /api/invoicing/tenants/:slug/electronic-profile`
- `GET /api/invoicing/tenants/:slug/electronic-document/readiness`
- `GET /api/invoicing/tenants/:slug/electronic-signature/inspection`
- `GET /api/invoicing/tenants/:slug/electronic-submission`
- `GET /api/invoicing/tenants/:slug/numbering/invoice`
- `GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/xml`
- `POST /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/submit`
- `POST /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/check-authorization`

## States To Design Explicitly

- healthy / ready
- blocked by readiness
- pending submission
- submitted / waiting SRI
- authorized
- rejected
- unsupported document path
- fallback XML bridge available
- technical trace with events

## Guardrails

- never imply SRI authorization before backend confirmation
- fallback XML bridge must read as advanced/secondary
- technical trace must feel like evidence, not the main workflow
- no marketing hero language
- copy tone: professional, calm, es-EC, suggestion-first
- optimize for low cognitive load and low abandonment

## Suggested Claude Design Prompt Seed

Design the next refinement of the Ecuador SRI control area inside the existing
Invoicing workspace. Preserve the current behavioral contract: compact mode by
default, progressive disclosure for manual SRI control, advanced fallback XML
bridge as secondary, and technical trace as quiet evidence. Improve hierarchy,
premium feel, mobile behavior, and clarity for non-specialist operators in
Ecuador. Do not invent new endpoints or imply automatic SRI authorization.

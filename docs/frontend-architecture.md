# Frontend Architecture

This document captures the working structure for the SaaS Platform frontend while
the UI is redesigned with Claude Design and integrated incrementally in Codex.

## Current Direction

`apps/web-platform/src/app/app.tsx` should become a thin application composer:

- session and tenant orchestration
- API fan-out until backend aggregate endpoints exist
- route/shell composition
- feature state handoff

Reusable UI, product surfaces, and design-system primitives should move out of
`app.tsx` into focused modules.

## Folder Shape

```txt
apps/web-platform/src/
  app/
    app.tsx
    api.ts
    types.ts
  shared/
    api/
      query-client.ts
      platform-queries.ts
  features/
    command-center/
      adapters.ts
      bff-contract.ts
      command-center.tsx
      model.ts
      queries.ts
      use-command-center-model.ts
    invoicing/
      adapters.ts
      invoicing-workspace.tsx
      model.ts
      queries.ts
      use-invoicing-workspace-model.ts
  shared/
    layout/
      platform-shell.tsx
      platform-shell.model.ts
    design-system/
      banner.tsx
      button.tsx
      card.tsx
      index.ts
      metric.tsx
      mood-selector.tsx
      status-pill.tsx
    product-access/
    tenancy/
```

The `shared/` folders are the intended next landing zones. Create them only when
a second feature needs the same primitive or when the Platform Shell extraction
starts.

## Command Center First

The Product Command Center is the first extracted feature because it is the new
post-login operational home and already has a Claude Design slice under
`docs/design/claude-design/01-product-command-center`.

Current split:

- `features/command-center/model.ts`: product registry, access states, labels,
  and helper functions.
- `features/command-center/adapters.ts`: converts app/server signals into the
  presentational Command Center model: products, access states, readiness,
  evidence, blockers, actions, and access counts.
- `features/command-center/bff-contract.ts`: documents the future read-only BFF
  aggregate path, query key and response DTO types without calling the endpoint
  before the backend exists.
- `features/command-center/command-center.tsx`: presentational sections and
  product cards.
- `features/command-center/queries.ts`: wraps TanStack Query reads for the
  platform catalog and tenant product access needed by the Command Center; it
  also exports the future aggregate query key.
- `features/command-center/use-command-center-model.ts`: memoized feature hook
  that resolves the presentational model from normalized adapter input.
- `shared/layout/platform-shell.model.ts`: shell nav, metric, and mood contracts.
- `shared/layout/platform-shell.tsx`: sidebar, topbar, mood selector, shell
  metrics, and page composition.
- `shared/api/query-client.ts`: TanStack Query client defaults for frontend
  server state.
- `shared/api/platform-queries.ts`: first query hooks for platform catalog and
  tenant product access.
- `shared/design-system/*`: shared primitive components for buttons, banners,
  cards, metrics, mood selection, and status pills. These currently wrap the
  established CSS module classes so visual behavior remains stable while the
  architecture becomes reusable.
- `app/app.tsx`: still composes source data from existing endpoints and passes
  normalized props into `PlatformShell` plus adapter input into Command Center.

## Access Foundation Next

Before continuing deeper product refinement, the frontend should extract the
signed-out and session-entry experience into its own feature boundary.

Why now:

- the deployed app already works in Railway + Vercel
- the current `Bearer token` textarea was acceptable for technical validation
- it is now actively harming realistic UX evaluation
- Invoicing and later product screens should be tested behind a more honest
  access flow

Target feature direction:

- `features/access/model.ts`
- `features/access/adapters.ts`
- `features/access/access-gateway.tsx`
- `features/access/queries.ts`
- `features/access/use-access-model.ts`

Scope of that feature:

- signed-out gateway
- session bootstrap/loading
- invitation review
- tenancy selection
- handoff into authenticated shell
- advanced token bootstrap hidden behind progressive disclosure

Important guardrail:

The backend currently supports `auth/me`, current tenancy selection, and
invitation flows, but not a formal web credential login contract. The frontend
must not fake working password, magic-link, or SSO flows. The access feature
should make room for future auth providers without pretending they already
exist.

## Invoicing First Product Surface

Electronic Invoicing EC is the first product surface being extracted because it
is central for Ecuador and feeds Tax Compliance, Accounting and Ecommerce.

Current split:

- `features/invoicing/model.ts`: frontend workspace contract for hero,
  readiness ribbon, metrics, next actions, and lifecycle stepper preview.
- `features/invoicing/adapters.ts`: converts current `app.tsx` source data into
  the presentational Invoicing foundation model, including derived readiness
  and electronic stage mapping.
- `features/invoicing/invoicing-workspace.tsx`: extracted workspace structure
  for the top of the existing Invoicing domain screen. It now acts as a barrel
  over smaller internal modules:
  - `workspace-summary.tsx`
  - `workspace-shared.tsx`
  - `workspace-operations.tsx`
  - `workspace-electronic.tsx`
  - `workspace-documents.tsx`
  - `workspace-commercial.tsx`
- `features/invoicing/queries.ts`: stable TanStack Query key taxonomy for the
  Invoicing workspace plus issuer profile, electronic submission, numbering,
  invoices and report summary reads.
- `features/invoicing/use-invoicing-workspace-model.ts`: memoized feature hook
  that keeps model creation outside the app composer.

The read-side workspace load now lives in the feature query layer. The invoice
queue, the first operational detail shell, the SRI authorization control
panel, technical trace, and document preview/RIDE panel now live in the
feature surface. Payments, invoice items, and notification/email delivery also
now live in the feature surface. The top summary has already been refined
toward the Claude slice hierarchy: a single dominant status hero, compact
readiness ribbon, calmer KPI row, and a clearer "next operational focus" card.
What remains is less about extracting more UI from `app.tsx` and more about
splitting the Invoicing feature internally into smaller files while aligning
progressive-disclosure behavior with the design slice.

The current design source for the next integration phases lives in:

- `docs/design/claude-design/02-invoicing-workspace/`

That slice should continue to be integrated incrementally, preserving existing
backend contracts and avoiding direct prototype pastes into app source.

## Design System

Use shared primitives before adding new ad hoc markup for common controls:

- `Button` / `ButtonLink`
- `StatusPill`
- `Metric`
- `Banner`
- `Card`
- `MoodSelector`

The first integrated consumers are `PlatformShell` and `CommandCenter`. Broader
replacement inside the legacy `app.tsx` product surfaces should happen
incrementally, feature by feature, after each surface is extracted.

## Server State

TanStack Query is the default foundation for frontend server state. Use it for
API data that is fetched, cached, refreshed, invalidated, or shared across
features.

Initial migrated surfaces:

- platform catalog: plans + products
- tenant enabled products
- Invoicing workspace read-side data: customers, tax rates, invoices, report
  summary, drafting assist, issuer profile, submission settings, numbering and
  electronic readiness.

Keep local `useState` for form drafts, selected UI rows, temporary action
messages, and staged user input. Prefer query hooks for API reads before adding
new manual `useEffect` loading flows.

## Integration Rules

- Do not paste Claude Design prototypes directly into app source.
- Keep backend contracts in `app/api.ts` and generated/local response types in
  `app/types.ts` until a formal OpenAPI client is introduced.
- Disabled, available, and blocked products stay visible; product gating is part
  of the UX.
- AI copy remains suggestion/approval/guarded execution. The interface must not
  imply autonomous execution.
- Tax, accounting, and clinical screens must keep professional handoff language;
  no automatic filing, certification, signature, or diagnosis claims.
- Moods must affect shell, cards, controls, and feedback states, not just the
  page background.

## Next Slices

1. Extract the Access / Login Gateway so the signed-out experience no longer
   depends on the raw JWT textarea as the primary UI.
2. Keep the advanced token bootstrap available, but move it behind explicit
   progressive disclosure for technical users and QA.
3. Resume Invoicing refinement only after the entry flow is calmer and more
   realistic for product evaluation.
4. Continue aligning queue/detail/mobile behavior with the Claude Design
   `02-invoicing-workspace` slice without pasting the prototype into app code.
5. Use `docs/frontend-handoff/03-invoicing-sri-progressive-disclosure.md` as
   the next Invoicing refinement handoff after Access is in place.
6. Implement `/tenancy/tenants/:tenantSlug/command-center` in the API when the
   backend is ready, then switch `useCommandCenterPlatformData` to the BFF.
7. Continue replacing legacy inline controls with shared design-system
   primitives as each product surface moves out of `app.tsx`.

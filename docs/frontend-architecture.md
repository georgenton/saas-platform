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

## Invoicing First Product Surface

Electronic Invoicing EC is the first product surface being extracted because it
is central for Ecuador and feeds Tax Compliance, Accounting and Ecommerce.

Current split:

- `features/invoicing/model.ts`: frontend workspace summary contract for
  metrics, readiness and next actions.
- `features/invoicing/adapters.ts`: converts current `app.tsx` source data into
  the presentational Invoicing foundation model.
- `features/invoicing/invoicing-workspace.tsx`: extracted summary component for
  the top of the existing Invoicing domain screen.
- `features/invoicing/queries.ts`: stable TanStack Query key taxonomy for the
  next migration of issuer profile, electronic submission, numbering, invoices
  and report summary reads.
- `features/invoicing/use-invoicing-workspace-model.ts`: memoized feature hook
  that keeps model creation outside the app composer.

The first slice intentionally leaves write forms, invoice detail, XML/RIDE,
payments and electronic submission actions in `app.tsx`; move them in smaller
subsequent slices.

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
- Invoicing query keys are defined, but existing reads still run through the
  legacy `app.tsx` refresh flow until the next migration slice.

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

1. Move Invoicing read-side data loading to feature TanStack Query hooks.
2. Ask Claude Design for `02-invoicing-workspace` using the handoff contract and
   current extracted summary model.
3. Implement `/tenancy/tenants/:tenantSlug/command-center` in the API when the
   backend is ready, then switch `useCommandCenterPlatformData` to the BFF.
4. Continue replacing legacy inline controls with shared design-system
   primitives as each product surface moves out of `app.tsx`.

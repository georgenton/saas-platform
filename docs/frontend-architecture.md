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
      command-center.tsx
      model.ts
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
- `features/command-center/command-center.tsx`: presentational sections and
  product cards.
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

1. Move Command Center source-data reads into query-backed feature hooks.
2. Introduce an optional backend aggregate contract for
   `/tenancy/tenants/:tenantSlug/command-center` once the API is ready.
3. Extract the next product surface from legacy `app.tsx`, starting with the
   highest-value frontend workflow selected for Claude Design polish.

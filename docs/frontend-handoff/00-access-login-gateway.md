# Access / Login Gateway Handoff

## Goal

Design the signed-out entry flow for the SaaS Platform so the product stops
feeling like a technical demo and starts feeling like a real application.

This slice must replace the current raw JWT textarea as the primary first-run
experience. It should make access feel guided, professional, and low-friction,
while remaining honest about the backend contract that exists today.

## Why This Slice Exists Now

The current deployed frontend opens directly into the platform shell and asks
the operator to paste a Bearer token manually. That has been useful for backend
freeze, OpenAPI validation, and early UI integration, but it distorts UX
evaluation.

Before continuing deeper visual refinement in product surfaces like Invoicing,
we need a real entry layer:

1. signed-out state
2. session bootstrap
3. tenant selection / onboarding bridge
4. post-auth handoff into the Command Center

## Important Contract Truth

The backend currently exposes session inspection and tenant/invitation flows,
but not a full public credential submission contract for the web UI.

Available endpoints today:

- `GET /api/auth/me`
- `PUT /api/auth/me/current-tenancy`
- `POST /api/auth/invitations/:invitationId/accept`
- `GET /api/auth/invitations/:invitationId`
- `GET /api/tenancy/tenants/:slug/invitations`
- `POST /api/tenancy/tenants/:slug/invitations`
- `GET /api/tenancy/tenants/:slug/invitations/:invitationId`
- `DELETE /api/tenancy/tenants/:slug/invitations/:invitationId`
- `POST /api/tenancy/tenants/:slug/invitations/:invitationId/resend`

Design must not invent working backend login mutations such as:

- email/password submit
- magic link request
- SSO callback
- password reset

If the screen needs to anticipate future auth providers, show them only as
future structure or non-interactive placeholders, never as fake working flows.

## Primary User

Owner or operator entering the platform for the first time, or returning to an
existing workspace.

## Entry Point

Web app root before a current authenticated session is resolved.

## Required Screens

1. Signed-out access gateway
2. Session bootstrap/loading state
3. Session error / backend unavailable state
4. Session exists but no current tenant selected
5. Pending invitation review state
6. Tenant picker / workspace selection state
7. Authenticated handoff state into Product Command Center

## Required UX Structure

### Primary Layer

The first screen should feel like a product access gateway, not a developer
tool.

Desired hierarchy:

1. Brand and trust context
2. Clear explanation of what the platform is doing next
3. Primary access action
4. Secondary onboarding/help affordances
5. Advanced technical access hidden behind deliberate disclosure

### Advanced Layer

The existing Bearer token bootstrap still matters for local QA, Railway/Vercel
verification, and controlled pilot operation. Keep it, but move it into an
explicit advanced/developer path:

- collapsed by default
- visually secondary
- never the dominant hero

Suggested label ideas:

- `Acceso avanzado`
- `Ya tengo un token`
- `Modo técnico`

## States

- no session yet
- checking existing session
- session loaded with current tenant
- session loaded without current tenant
- pending invitation present
- multiple tenancies available
- backend unavailable
- invalid/expired token bootstrap
- permission-limited post-auth handoff

## Actions

- bootstrap session from existing token
- clear local session
- inspect invitation detail
- accept invitation
- choose current tenancy
- clear current tenancy preference
- continue into workspace

## Navigation Expectations

After access resolves:

- if session has `currentTenancy`, hand off to Product Command Center
- if session has pending invitations, prioritize invitation review
- if session has tenancies but no current tenancy, prioritize workspace choice
- if session exists but no tenant is available, explain what is missing without
  dumping the entire product shell

## Visual Direction

Use the same brand principles already established for the platform:

- corporate
- very friendly
- calm
- aspirational
- modern
- operational

This screen must reduce intimidation. It should feel like a helpful front desk
for a serious business platform in LATAM, not like a security wall or a
developer console.

The mood system still applies here. Mood changes should affect:

- shell chrome
- form surfaces
- banners
- emphasis hierarchy
- focus states

## Mobile Expectations

Mobile should not inherit the current desktop shell clutter.

The mobile signed-out entry should:

- open with one focused access card or panel
- keep explanations short
- hide advanced token access behind a bottom sheet, drawer, or expandable block
- preserve strong contrast and one-thumb ergonomics

## Guardrails

- Do not imply password, magic-link, or SSO login if the backend does not yet
  expose those flows.
- Do not make the JWT textarea the first thing the user sees.
- Do not dump the full multi-product shell before the session is resolved.
- Do not present unavailable auth providers as clickable actions.
- Keep invitation acceptance and tenancy selection explicit and calm.
- Optimize for low onboarding abandonment and low cognitive friction.

## Relationship To Current Frontend

Today this logic still lives inside:

- `apps/web-platform/src/app/app.tsx`

Specifically:

- the token bootstrap input
- session loading
- invitation review
- tenancy selection

The next frontend architecture pass should extract an `access` feature so
`app.tsx` stops owning the full signed-out/auth-entry experience directly.

## What Comes Immediately After This Slice

Once Access / Login Gateway is integrated, the next resumed product slice is
Invoicing.

That sequence matters:

1. real entry experience
2. authenticated command center handoff
3. resume Invoicing workspace refinement on top of a real product entry flow

## Suggested Claude Design Prompt Seed

Design the Access / Login Gateway for a multi-product SaaS platform used
primarily in Ecuador and LATAM. The backend already supports session inspection,
tenant selection, and invitation acceptance, but it does not yet expose a full
web credential login contract. Therefore, do not invent working email/password,
magic-link, or SSO flows. Design a signed-out entry experience that feels
premium, friendly, and trustworthy, with advanced Bearer-token bootstrap hidden
behind progressive disclosure for technical users. Include web and mobile,
loading/error/no-tenant/pending-invitation/workspace-selection states, and make
the handoff into the Product Command Center feel clear and calm. After this
slice, the next product refinement will continue in Invoicing, so the access
experience should set up that progression cleanly.

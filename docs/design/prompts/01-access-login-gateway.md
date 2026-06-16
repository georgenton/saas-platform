# Claude Design Prompt: Access / Login Gateway

You are designing the next frontend slice for a multi-product SaaS platform.

Use these files as source of truth:

- `docs/project-freeze-handoff.md`
- `docs/frontend-handoff/README.md`
- `docs/frontend-handoff/00-access-login-gateway.md`
- `docs/frontend-handoff/00-platform-shell.md`
- `docs/frontend-handoff/01-product-command-center.md`
- `docs/api/openapi.json`

## Product Context

The backend is frozen. Do not invent endpoints or backend behaviors.

The frontend is already deployed and currently uses a raw Bearer token textarea
to bootstrap the session. That solved local QA and deployment validation, but
it is no longer a good first-run UX.

This slice exists to create a real signed-out entry experience before the team
continues deeper refinement in Invoicing.

## Current Backend Truth

The API currently supports:

- session inspection
- current tenancy selection
- invitation detail / invitation acceptance
- tenant invitation management

The API does **not** yet expose a formal public web login contract for:

- email/password submit
- magic link request
- SSO sign-in
- forgot password

Do not invent those endpoints.

If you need to hint at future auth methods, render them as non-interactive
future structure only, not as active working buttons.

## Design Goal

Design the signed-out access experience for desktop web and mobile so the app
feels like a real premium SaaS product instead of a technical console.

The design must:

- reduce friction
- reduce intimidation
- preserve trust
- guide the user into the correct post-auth state
- keep advanced token bootstrap available, but visibly secondary

## Desired Flow

The entry experience should support this progression:

1. signed-out gateway
2. checking session
3. invitation review if needed
4. workspace selection if needed
5. handoff into Product Command Center

## UX Priorities

Prioritize:

- calm hierarchy
- one dominant action at a time
- short, confident guidance
- minimal abandonment risk
- premium but simple interaction design

This is a business platform for Ecuador/LATAM. It should feel:

- corporate
- approachable
- aspirational
- operational
- trustworthy

Avoid:

- consumer-app fluff
- security-wall harshness
- developer-tool first impression
- giant empty shell with many disabled sections before session resolution

## Required Screens

Design these web and mobile states:

1. signed-out access gateway
2. loading / checking existing session
3. backend unavailable
4. invalid or expired advanced token
5. pending invitation review
6. workspace selection
7. session ready handoff into command center

## Required Access Structure

### Primary Access Layer

The first screen must not open with a raw textarea.

The primary layer should communicate:

- where the user is
- what happens after access
- what kind of work the platform supports
- the next simple action

### Advanced Technical Access

The existing Bearer token bootstrap must remain available for technical users,
but hidden behind progressive disclosure.

Treat it as:

- advanced
- secondary
- explicit
- non-default

Possible interaction patterns:

- collapsed advanced panel
- bottom sheet
- side sheet
- reveal link under primary access card

## Relationship To Existing Frontend

The current shell and command center already exist. Your design should prepare a
clean handoff into them instead of redesigning them from scratch.

This slice should visually precede:

- `00-platform-shell`
- `01-product-command-center`

And it should set up the next resumed product slice:

- `02-invoicing`

## Mood System

The platform already supports moods beyond light/dark. This slice must also
support them.

At minimum reflect:

- comfort
- focus
- calm
- high-contrast
- night

The mood effect must be visible not just in the page background, but also in:

- navigation chrome
- access card surfaces
- banners
- inputs
- buttons
- focus treatment

## Output Required

Return a complete design delivery in the same format as the previous slices:

1. desktop layout
2. mobile layout
3. states
4. component hierarchy
5. interaction notes
6. accessibility notes
7. mood behavior
8. mock JSON where relevant
9. integration notes for React/Vite/TypeScript

## Constraints

- React + TypeScript + Vite target
- no invented backend endpoints
- no fake working auth providers
- no marketing landing page
- no full shell clutter before access resolves

## Final Design Intent

The user should feel:

- “this product is serious”
- “this is easy to enter”
- “I know what happens next”
- “I am not being asked to understand the system before I can use it”

And once this slice is done, the next frontend refinement should continue in
Invoicing on top of this real access flow.

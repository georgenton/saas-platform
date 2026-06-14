# Claude Design Prompt: Platform Shell

You are designing the first frontend slice for a multi-product SaaS platform.

Use these files as source of truth:

- `docs/project-freeze-handoff.md`
- `docs/frontend-handoff/README.md`
- `docs/frontend-handoff/00-platform-shell.md`
- `docs/api/openapi.json`

## Product Context

The backend is frozen through Full Accounting completion closeout 1.8. Do not
invent products, endpoints or backend behavior. The OpenAPI contract is the API
source of truth.

The app supports these product areas:

- Core platform
- Tenancy and commercial access
- Parties
- Invoicing and Ecuador electronic invoicing
- Ecommerce
- Growth and WhatsApp operations
- Tax Compliance EC
- Accounting and Full Accounting
- AI console
- Medical Clinics
- Psychology Clinics

## Design Goal

Design the reusable application shell for desktop web and mobile. This shell
will be used by all future product screens.

The desired visual language is corporate, trustworthy and super friendly. Think
of a polished operations cockpit for a serious SaaS company: calm, elegant,
clear and satisfying to use every day.

The shell must also introduce design moods. These are not only light/dark
themes; they are comfort modes that help different users feel cognitively and
emotionally comfortable while working.

## Visual Direction

Use a refined corporate UI:

- light-first interface with excellent contrast
- restrained dark text, neutral surfaces and one confident primary accent
- subtle secondary accents for status only
- clean navigation, predictable spacing and crisp typography
- dense enough for operational work, but not cramped
- soft friendliness through microcopy, spacing and states, not playful
  decoration
- card radius no larger than 8px unless needed for a specific component
- no decorative gradient blobs, background orbs or marketing hero sections

Suggested tone:

- trustworthy
- calm
- modern
- executive
- approachable
- operational

## Design Moods

Design a mood system with at least these modes:

1. `comfort`
   - default mode
   - corporate, friendly, balanced contrast
   - warm but restrained
2. `focus`
   - for intensive operational work
   - less decoration, stronger hierarchy, slightly denser surfaces
   - keeps tables/work queues easy to scan
3. `calm`
   - for long sessions or sensitive workflows
   - softer surfaces, gentle contrast, less urgent visual language
   - useful for clinical, tax and accounting contexts
4. `high-contrast`
   - accessibility-first
   - strong contrast, clear borders, strong keyboard focus treatment
5. `night`
   - low-glare dark mode
   - not a simple inversion
   - must preserve status readability and chart/card clarity

Provide design tokens for each mood:

- background colors
- surface colors
- text colors
- border/divider colors
- primary accent
- secondary accent
- success/warning/danger/info states
- focus ring
- shadow/elevation behavior
- optional density adjustments

The user should be able to switch moods from the shell UI. For now, represent
this as local UI state and mock JSON only. Do not invent backend endpoints for
theme persistence. Add a note that backend persistence is future backlog.

Avoid:

- landing-page composition
- oversized marketing cards
- cartoonish visuals
- heavy purple/blue gradients
- beige/brown monotone palettes
- tiny unreadable enterprise tables on mobile

## Required Desktop Screens

Design these desktop states:

1. Authenticated app shell
2. Loading current user
3. Tenant missing
4. Product disabled
5. Permission denied
6. Backend unavailable
7. Local/dev environment banner

## Required Mobile Screens

Design equivalent mobile states:

1. Mobile authenticated app shell
2. Mobile product navigation
3. Mobile tenant switch/context
4. Mobile disabled/permission state
5. Mobile backend unavailable state

Mobile must feel native and intentional. Do not simply shrink the desktop
sidebar. Use mobile navigation patterns that are easy to use with one hand.

## Navigation Requirements

The shell must support:

- tenant context
- current user area
- product navigation
- product groups
- disabled product states
- permission-aware states
- global notifications/toasts
- loading and error feedback
- breadcrumbs or section context for deep product screens

Product navigation should be able to scale to:

- Dashboard
- Invoicing
- Ecommerce
- Growth
- Tax Compliance EC
- Accounting
- AI Console
- Medical Clinics
- Psychology Clinics
- Parties
- Settings

## Endpoint References

Use these endpoints from OpenAPI:

- `GET /api/auth/me`
- `GET /api/tenancy/tenants/{slug}/products`
- `GET /api/tenancy/tenants/{slug}/subscription`
- `GET /api/tenancy/tenants/{slug}/entitlements`
- `GET /api/tenancy/tenants/{slug}/feature-flags`
- `GET /api/platform/products`
- `GET /api/platform/plans`

Do not create new endpoint names.

## Mock Data

Provide JSON mock data that maps clearly to the endpoint references above.

Mock data must include:

- one active tenant
- one current user
- enabled products
- disabled products
- permission-limited products
- local/dev environment flag
- one backend error example
- available design moods
- selected design mood

## Output Required

Return a complete design delivery with:

1. Desktop layout
2. Mobile layout
3. Component hierarchy
4. Route map
5. Design tokens
6. Design mood tokens
7. Interaction notes
8. Accessibility notes
9. State matrix
10. Mock JSON files
11. Integration notes for React/Vite/TypeScript

## Implementation Constraints

The target app is React + TypeScript + Vite.

Prefer:

- reusable components
- design tokens
- responsive CSS
- accessible navigation
- icon-ready buttons and navigation items
- clean replacement path from mock JSON to real API calls
- mood switching implemented as local state first

Do not require a full UI framework migration unless absolutely necessary.

## Guardrails

- Do not imply tax filing, accounting certification, legal signature or clinical
  automation from the shell.
- AI surfaces must be presented as suggestion/approval/guarded execution, not
  autonomous execution.
- The shell must make tenant context obvious at all times.
- Disabled products should be visible but clearly unavailable.
- Permission denied states should be calm, explanatory and actionable.
- Mood selection is frontend-only for now; backend persistence belongs in a
  later backlog.

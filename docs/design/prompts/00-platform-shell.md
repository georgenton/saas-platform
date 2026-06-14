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

## Output Required

Return a complete design delivery with:

1. Desktop layout
2. Mobile layout
3. Component hierarchy
4. Route map
5. Design tokens
6. Interaction notes
7. Accessibility notes
8. State matrix
9. Mock JSON files
10. Integration notes for React/Vite/TypeScript

## Implementation Constraints

The target app is React + TypeScript + Vite.

Prefer:

- reusable components
- design tokens
- responsive CSS
- accessible navigation
- icon-ready buttons and navigation items
- clean replacement path from mock JSON to real API calls

Do not require a full UI framework migration unless absolutely necessary.

## Guardrails

- Do not imply tax filing, accounting certification, legal signature or clinical
  automation from the shell.
- AI surfaces must be presented as suggestion/approval/guarded execution, not
  autonomous execution.
- The shell must make tenant context obvious at all times.
- Disabled products should be visible but clearly unavailable.
- Permission denied states should be calm, explanatory and actionable.

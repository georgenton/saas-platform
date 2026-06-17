# Invoicing Settings / SRI Handoff

## Goal

Refine the Ecuador electronic invoicing settings area so it feels operational,
guided, and premium without becoming a technical wall.

This is a refinement of the existing Invoicing frontend already integrated in:

- `apps/web-platform/src/features/invoicing/workspace-settings.tsx`
- `apps/web-platform/src/features/invoicing/workspace-electronic.tsx`
- `docs/design/claude-design/02-invoicing-workspace/`
- `docs/design/claude-design/03-invoicing-sri-progressive-disclosure/`

It is not a new product and it must not invent backend capabilities.

## Product Intent

This area is where an Ecuador operator prepares the tenant to issue and submit
electronic documents correctly.

It should feel like:

- a guided setup and operating console
- calm and trustworthy
- professional for LATAM / Ecuador business operators
- powerful without feeling dense at first glance

It should not feel like:

- raw infrastructure
- certificate debugging software
- a giant compliance wall
- a generic settings dump

## Current Frontend State

Already integrated in code:

- issuer profile card
- Ecuador numbering card
- electronic signature configuration card
- SRI gateway configuration card
- readiness / blockers / warnings / document support matrix

Current file:

- `apps/web-platform/src/features/invoicing/workspace-settings.tsx`

This slice was extracted from `app.tsx` and is now a real component boundary.
That means Claude Design should design against a stable frontend surface, not a
prototype hidden in a monolithic file.

## What This Surface Represents

Conceptually, this page answers four operator questions:

1. Who is issuing?
2. How will numbering be assigned?
3. Is the electronic signature usable?
4. Is the tenant really ready to talk to the SRI?

Those four questions should be visible in the interaction model and in the
hierarchy of the design.

## Core Sections To Preserve

### 1. Issuer Profile

Keep support for:

- legal name
- commercial name
- RUC
- environment
- special taxpayer code
- RIMPE
- accounting obligated
- matrix address
- establishment address
- alignment with extracted certificate tax ID

### 2. Ecuador Numbering

Keep support for:

- `CodDoc`
- `Estab`
- `PtoEmi`
- next sequence
- preview / suggested next number

### 3. Electronic Signature

Keep support for:

- provider
- storage mode
- certificate label
- subject name
- fingerprint
- active toggle
- PKCS#12 references when provider requires them
- metadata hydration option
- inspection evidence
- certificate validity and crypto proof evidence

### 4. SRI Gateway

Keep support for:

- provider
- environment
- transmission mode
- timeout
- reception URL
- authorization URL
- credentials secret ref
- active toggle
- readiness summary
- blockers
- warnings
- document support matrix
- recommended next step

## UX Direction

The user should not feel forced to read every field at once.

The design should create a natural sequence:

1. readiness overview
2. recommended next action
3. the most important incomplete area
4. detailed technical evidence only where needed

Use progressive disclosure where it helps reduce intimidation, especially for:

- certificate inspection evidence
- gateway technical details
- support matrix
- blockers vs warnings vs deep evidence

## Design Priorities

Prioritize:

- very clear hierarchy
- one dominant action per area
- visible progress toward readiness
- friendly but serious language
- reduced abandonment risk
- calm error and warning treatment

Optimize for operators in Ecuador who may understand the business process but
not want to think in terms of certificates, transport modes, or infrastructure.

## Relationship To Other Slices

This slice sits between:

- `02-invoicing-workspace`
- `03-invoicing-sri-progressive-disclosure`

And it should prepare the path for:

- customer + draft invoice flow
- document lifecycle operation
- production-quality invoicing workspace

This is a supporting operational area, not the whole invoicing experience.

## Real Frontend / Backend Constraints

Backend is frozen.

Do not invent endpoints or fake automations.

Settings already correspond to real backend contracts used by frontend:

- issuer profile
- invoice numbering
- electronic signature settings
- signature material inspection
- electronic submission settings
- electronic document readiness

## Endpoints Behind This Surface

- `GET /api/invoicing/tenants/{slug}/electronic-profile`
- `PUT /api/invoicing/tenants/{slug}/electronic-profile`
- `GET /api/invoicing/tenants/{slug}/numbering/invoice`
- `PUT /api/invoicing/tenants/{slug}/numbering/invoice`
- `GET /api/invoicing/tenants/{slug}/electronic-signature`
- `PUT /api/invoicing/tenants/{slug}/electronic-signature`
- `POST /api/invoicing/tenants/{slug}/electronic-signature/sync-tax-id`
- `GET /api/invoicing/tenants/{slug}/electronic-signature/inspection`
- `GET /api/invoicing/tenants/{slug}/electronic-submission`
- `PUT /api/invoicing/tenants/{slug}/electronic-submission`
- `GET /api/invoicing/tenants/{slug}/electronic-document/readiness`

All design decisions must stay compatible with this contract.

## States To Design Explicitly

- healthy / ready
- issuer missing or incomplete
- numbering incomplete
- signature missing
- signature expiring / expired
- gateway incomplete
- sandbox blocked
- permission-limited
- backend unavailable
- loading / skeleton

## Mood System

Support the existing platform moods:

- comfort
- focus
- calm
- high-contrast
- night

The moods must visibly affect:

- cards
- borders
- banners
- form controls
- primary / secondary actions
- warning and blocker treatment

Not just the page background.

## Mobile Expectations

Do not simply shrink the desktop form.

On mobile, design for:

- one-hand review
- stacked readiness flow
- clear section entry points
- expandable evidence areas
- actions that remain obvious and not crowded

## Guardrails

- no invented products
- no invented endpoints
- no fake automatic SRI authorization
- no generic developer-tool look
- no giant wall of equal-weight fields
- no excessive decoration

Copy should feel:

- es-EC
- operational
- calm
- respectful
- guidance-first

## Suggested Claude Design Prompt Seed

Design the next frontend refinement for the Ecuador electronic invoicing
settings area inside the existing Invoicing workspace. The backend is frozen and
the frontend already has a real component boundary at
`workspace-settings.tsx`. Improve the UX/UI for issuer profile, Ecuador
numbering, electronic signature, and SRI gateway readiness so the experience
feels premium, corporate, approachable, and low-friction for Ecuador/LATAM
operators. Use progressive disclosure to reduce intimidation, preserve all real
backend fields and states, support desktop + mobile + all platform moods, and
do not invent endpoints or automatic compliance behavior.

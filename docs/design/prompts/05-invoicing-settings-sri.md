# Claude Design Prompt: Invoicing Settings / SRI

You are designing the next frontend slice for a multi-product SaaS platform.

Use these files as source of truth:

- `docs/project-freeze-handoff.md`
- `docs/frontend-handoff/README.md`
- `docs/frontend-handoff/02-invoicing.md`
- `docs/frontend-handoff/03-invoicing-sri-progressive-disclosure.md`
- `docs/frontend-handoff/05-invoicing-settings-sri.md`
- `docs/frontend-handoff/00-platform-shell.md`
- `docs/api/openapi.json`

## Product Context

The backend is frozen. Do not invent endpoints or backend behaviors.

The frontend already has a real extracted component for this surface:

- `apps/web-platform/src/features/invoicing/workspace-settings.tsx`

This slice is not the whole invoicing workspace. It is the operational settings
and readiness area for Ecuador electronic invoicing.

## Design Goal

Design a premium operational settings experience for Ecuador SRI preparation so
the user feels guided, safe, and in control without being overwhelmed by
technical density.

This area must help the operator answer:

1. who is issuing
2. how numbering is configured
3. whether the electronic signature is usable
4. whether the tenant is actually ready to submit to the SRI

## UX Intent

The current behavior is functionally correct, but the experience still risks
feeling too much like a raw form stack.

Your job is to turn it into a rich, professional, low-friction operational
surface that feels:

- corporate
- friendly
- aspirational
- trustworthy
- highly usable for Ecuador / LATAM businesses

Avoid:

- developer-console feeling
- giant wall of equally weighted fields
- technical intimidation
- decorative marketing layouts
- fake magic automation

## Existing Functional Sections

Keep these four areas as real sections of the experience:

1. issuer profile
2. Ecuador numbering
3. electronic signature
4. SRI gateway and readiness

## Required Behavioral Truth

Do not redesign this as a totally different product.

This surface already supports real data and actions for:

- issuer profile CRUD
- numbering CRUD
- signature configuration CRUD
- signature material inspection
- SRI gateway configuration CRUD
- readiness blockers / warnings / document support
- sync tax ID from certificate

Preserve compatibility with that behavior.

## Important UX Direction

The user should not have to read every field immediately.

Use hierarchy and progressive disclosure to create this rhythm:

1. readiness at a glance
2. recommended next action
3. most important incomplete area
4. deeper evidence only when needed

Make technical evidence feel available but not oppressive.

## Specific Areas To Improve

### Issuer Profile

Make it feel like a fiscal identity setup, not just a raw form.

The RUC alignment with extracted certificate tax ID should feel helpful and
reassuring.

### Ecuador Numbering

This must feel compact and easy, not like a cryptic accounting sub-form.

The relation between `CodDoc`, `Estab`, `PtoEmi`, and next sequence should be
clear without requiring prior expertise.

### Electronic Signature

This is the most intimidating area and needs the strongest design help.

The user should understand:

- what is configured
- whether it is usable
- whether it is expiring
- what needs attention next

Inspection evidence should use progressive disclosure and elegant grouping.

### SRI Gateway

This should feel like a controlled readiness lane, not infrastructure plumbing.

Blockers, warnings, support matrix, and recommended next step should be clearly
layered and easy to scan.

## States To Design Explicitly

Design desktop and mobile states for:

1. ready / healthy
2. issuer incomplete
3. numbering incomplete
4. signature missing
5. signature expiring
6. signature expired / blocked
7. gateway incomplete
8. readiness blocked
9. permission-limited
10. backend unavailable
11. loading

## Mood System

The platform already supports moods beyond light/dark.

Support:

- comfort
- focus
- calm
- high-contrast
- night

Mood changes must visibly affect:

- cards
- form controls
- warnings
- blockers
- banners
- navigation/context chrome if shown

Not just background color.

## Mobile Expectations

Do not just shrink the desktop layout.

Mobile should feel purpose-built:

- stacked readiness narrative
- compact section entry points
- controlled expansion of technical evidence
- strong action clarity

## Relationship To Existing Slices

This slice builds on:

- `00-platform-shell`
- `02-invoicing-workspace`
- `03-invoicing-sri-progressive-disclosure`

And should prepare the next integration work in:

- customer flow
- draft invoice flow
- broader invoicing workspace refinement

## Output Required

Return a complete design delivery in the same format as the previous slices:

1. desktop layout
2. mobile layout
3. explicit states
4. component hierarchy
5. interaction notes
6. accessibility notes
7. mood behavior
8. mock JSON where relevant
9. integration notes for React/Vite/TypeScript

Save the slice under:

```txt
docs/design/claude-design/05-invoicing-settings-sri/
```

## Constraints

- React + TypeScript + Vite target
- no invented backend endpoints
- no new products
- no fake compliance automation
- no marketing landing page
- no rewriting the shell from scratch

## Final Design Intent

The operator should feel:

- “this is professional”
- “I understand what is missing”
- “I know what to do next”
- “the system is helping me, not testing me”
- “this looks enterprise-grade but still friendly”

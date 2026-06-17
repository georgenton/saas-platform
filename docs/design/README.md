# Claude Design Integration Workflow

This folder stores design deliveries from Claude Design before they are
integrated into `apps/web-platform`.

## Working Agreement

Claude Design is the source of truth for the product presentation layer:
visual hierarchy, layout, spacing, typography treatment, mood behavior,
component composition, desktop/mobile patterns and interaction choreography.

The SaaS Platform backend, OpenAPI contract and frontend handoff docs remain
the source of truth for behavior: endpoints, data fields, permissions,
validations, state transitions and product guardrails.

When a current app component conflicts with an approved Claude Design slice,
prefer replacing the app presentation with a production React implementation of
the Claude Design surface. Keep existing API calls, TanStack Query bindings,
handlers and domain constraints behind that surface. The current app UI is not
the design authority once a Claude Design slice exists for that area.

Do not paste a Claude Design ZIP directly into the app source. Every delivery
must first land under `docs/design/claude-design/<slice>/` for review.

## Expected Delivery Structure

Use this structure for each Claude Design export:

```txt
docs/design/claude-design/
  00-platform-shell/
    source/
    mock-data/
    screenshots/
    assets/
    notes.md
    integration-plan.md
```

Recommended slice folders:

```txt
00-platform-shell
01-product-command-center
02-invoicing
03-ecommerce
04-tax-compliance-ec
05-accounting
06-ai-console
07-clinics
08-growth
```

## Integration Flow

1. Prepare a focused prompt from `docs/design/prompts`.
2. Attach only the required handoff files and `docs/api/openapi.json`.
3. Export Claude Design output as a ZIP.
4. Extract the ZIP into the matching `docs/design/claude-design/<slice>/`
   folder.
5. Review the design against OpenAPI and handoff guardrails.
6. Convert mock JSON to real API calls.
7. Rebuild production UI from the approved Claude Design components/patterns
   rather than cosmetically wrapping old app surfaces.
8. Run build, tests and browser checks.

## Review Checklist

- Does the design use only backend endpoints present in `docs/api/openapi.json`?
- Does it include desktop and mobile layouts?
- Does it include design moods beyond light/dark?
- Does it define loading, empty, error, ready, disabled and blocked states?
- Does it preserve tenant/product/permission context?
- Does it avoid inventing new products or backend behavior?
- Does it keep accounting, tax, clinical and AI guardrails visible?
- Are mock JSON files clearly replaceable by API calls?
- Are components reusable across future modules?
- Is the interaction model realistic for repeated operational use?

## Design Direction

The interface should feel corporate, trustworthy and friendly:

- clean enterprise structure
- calm information density
- warm but restrained visual tone
- clear hierarchy for operational work
- generous whitespace without becoming a marketing page
- professional financial/clinical/tax confidence
- accessible contrast and keyboard/touch targets
- polished mobile behavior, not desktop squeezed into a phone

## Design Moods

The frontend should support user comfort moods, not just light and dark themes.
This is a frontend-first UX layer inspired by cognitive comfort, emotional tone
and accessibility. Backend persistence is intentionally deferred until after the
frontend design is validated.

Required design moods:

- `comfort`: default corporate-friendly mode with balanced contrast and calm
  warmth
- `focus`: reduced visual noise, denser work surfaces and stronger hierarchy
  for deep operational work
- `calm`: softer contrast, gentler surfaces and less urgent visual treatment
  for long sessions or sensitive workflows
- `high-contrast`: accessibility-first contrast, clear borders and stronger
  focus states
- `night`: dark low-glare mode for late work, distinct from a simple color
  inversion

Claude Design should define tokens for each mood:

- background surfaces
- text colors
- borders and dividers
- primary and secondary accents
- status colors
- focus rings
- density/spacing adjustments when appropriate
- mobile navigation treatment

For now, moods may be represented in mock JSON and local UI state. Do not add
new backend endpoints for preferences in design deliverables.

Backlog for later backend implementation:

- tenant/user UI preference persistence
- default mood per user
- per-device or per-session override
- accessibility preference sync
- audit-safe handling for clinical/tax/accounting screens

Avoid:

- decorative landing-page sections inside the app
- oversized hero blocks for operational modules
- one-color monochrome palettes
- excessive gradients, ornamental blobs or visual noise
- hidden critical states
- ambiguous AI, tax, accounting or clinical promises

## Backend Contract

Use:

- `docs/api/openapi.json`
- `GET /api/openapi.json`
- `docs/frontend-handoff/*.md`
- `docs/project-freeze-handoff.md`

Any missing backend need should become a contract-hardening note, not a silent
frontend assumption.

# Claude Design Integration Workflow

This folder stores design deliveries from Claude Design before they are
integrated into `apps/web-platform`.

## Working Agreement

Claude Design produces visual/interface deliveries. The SaaS Platform backend,
OpenAPI contract and frontend handoff docs remain the source of truth for
behavior.

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
7. Integrate into `apps/web-platform` incrementally.
8. Run build, tests and browser checks.

## Review Checklist

- Does the design use only backend endpoints present in `docs/api/openapi.json`?
- Does it include desktop and mobile layouts?
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

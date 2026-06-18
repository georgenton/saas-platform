# Invoicing Operational Polish QA Handoff

## Goal

Prepare the final design pass for the Invoicing frontend after integrating the
main Claude Design slices.

This is not a new product slice and not a backend expansion. It is a quality
and coherence slice for the operator experience:

> "Can an Ecuador/LATAM operator move through Invoicing with confidence,
> without feeling overwhelmed, abandoned or punished by complexity?"

## Current Product State

Backend remains frozen. Invoicing already has real frontend surfaces for:

- workspace foundation;
- SRI settings;
- customer and draft invoice flow;
- invoice items;
- document review;
- SRI submission lifecycle;
- payment and email delivery closeout.

Recent closeout integration added:

- `apps/web-platform/src/features/invoicing/closeout.ts`
- closeout verdict, triad and recommended next step;
- delivery guardrails;
- payment settlement and decimal currency input;
- payment history and reversal guardrail;
- future Tax Compliance / Accounting evidence note.

## Source Of Truth

Claude Design remains the visual source of truth for frontend design.

Use these design references:

- `docs/design/claude-design/05-invoicing-settings-sri/`
- `docs/design/claude-design/06-invoicing-customer-draft-flow/`
- `docs/design/claude-design/07-invoicing-items-flow/`
- `docs/design/claude-design/08-invoicing-document-review/`
- `docs/design/claude-design/09-invoicing-sri-submission-lifecycle/`
- `docs/design/claude-design/10-invoicing-payment-email-delivery-closeout/`

Use these implementation references:

- `apps/web-platform/src/app/app.tsx`
- `apps/web-platform/src/app/app.module.css`
- `apps/web-platform/src/features/invoicing/`
- `apps/web-platform/src/app/api.ts`
- `apps/web-platform/src/app/types.ts`
- `docs/api/openapi.json`
- `docs/frontend-handoff/10-invoicing-vercel-qa-runbook.md`
- `docs/frontend-handoff/11-invoicing-payment-email-delivery-closeout.md`

## What This Slice Should Solve

The app is functional, but it needs a final professional design pass across
Invoicing:

- visual rhythm between sections;
- spacing consistency;
- mobile hierarchy;
- desktop scanability;
- relationship between workspace shell and product workspace;
- active subview focus;
- empty/loading/error states;
- copy hierarchy;
- mood consistency;
- places where current implementation still feels like old utility UI rather
  than the Claude Design system;
- places where buttons, cards or status pills are visually heavier than their
  real operational importance.

## Scope

Design only. Do not invent backend behavior.

Cover the existing Invoicing subviews:

- summary;
- SRI settings;
- customer and draft invoice;
- line items;
- document review;
- SRI lifecycle;
- delivery and payment closeout.

Include both:

- desktop;
- mobile.

Include all five moods:

- comfort;
- focus;
- calm;
- high contrast;
- night.

## Output Expected From Claude Design

Create a design slice folder:

```txt
docs/design/claude-design/11-invoicing-operational-polish-qa/
```

Use the same deliverable structure as prior slices:

- `index.html`
- `src/`
- `mock-data/`
- `README.md`
- `notes.md`
- `components.md`
- `integration-plan.md`

This slice can be more audit-oriented than previous slices, but it must still
include an interactive viewer with device, state and mood switches.

## Required Design Deliverables

### 1. Invoicing Experience Map

Show how an operator should move through:

```txt
Command Center -> Invoicing -> Configure SRI -> Customer/Draft -> Items
-> Document Review -> SRI Lifecycle -> Delivery/Payment Closeout
```

Call out where the UI should reduce choice, preserve context, or guide the
operator to the next safe action.

### 2. Visual Coherence Audit

Identify mismatches between current implementation and Claude Design source:

- typography;
- spacing;
- status treatment;
- card density;
- shell/product workspace relationship;
- mobile behavior;
- mood contrast;
- action hierarchy.

This audit should be actionable for Codex, not generic design commentary.

### 3. Final Polished Invoicing Shell

Design the ideal product workspace shell for Invoicing:

- product header;
- subview navigation;
- context rail or summary strip;
- active subview focus;
- secondary links;
- mood selector placement;
- mobile bottom/navigation behavior.

### 4. Cross-Subview States

Design at least these states:

- fully configured and operating;
- missing issuer/SRI setup;
- draft invoice in progress;
- issued invoice with pending SRI;
- authorized invoice;
- invoice with rejected/returned SRI status;
- open balance;
- fully paid;
- backend unavailable;
- permission-limited/read-only;
- loading/skeleton;
- empty workspace.

### 5. Mobile-First QA

Explicitly verify:

- no horizontal overflow;
- bottom navigation or product tabs remain usable;
- closeout triads stack cleanly;
- long recommended next steps wrap;
- status pills do not crush content;
- primary action remains reachable by thumb;
- technical traces are not front-and-center.

## Guardrails

- Do not add endpoints.
- Do not add product promises that backend cannot support.
- Do not imply automatic SRI filing beyond existing electronic lifecycle.
- Do not imply automatic tax declarations.
- Do not imply automatic accounting postings.
- Do not imply bank reconciliation.
- Preserve the product/plugin model.
- Keep UX rich and professional, but not decorative or marketing-like.
- Keep the user from feeling overwhelmed; guide one next action at a time.

## Codex Integration Expectation

After Claude Design delivers this slice, Codex should integrate it in small PRs:

1. shell/workspace layout polish;
2. cross-subview navigation and active state polish;
3. responsive/mobile fixes;
4. status/action hierarchy cleanup;
5. final Vercel QA runbook update.

Do not attempt a full rewrite in one PR unless the design package explicitly
requires a small, mechanical CSS/token change.

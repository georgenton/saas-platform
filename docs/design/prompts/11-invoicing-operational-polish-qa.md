# Claude Design Prompt: Invoicing Operational Polish QA

You are designing the next frontend design slice for a multi-product SaaS
platform.

This is slice 11:

```txt
docs/design/claude-design/11-invoicing-operational-polish-qa/
```

## Product Context

The platform is a modular multi-SaaS product for Ecuador/LATAM. Products are
enabled like add-ons/plugins per tenant. Invoicing is the current frontend
focus.

The backend is frozen. Do not invent endpoints, mutations, data fields,
delivery channels, tax filing, accounting posting, payment gateway behavior or
bank reconciliation.

Claude Design is the visual source of truth for frontend design.

The product must feel:

- corporate and professional;
- warm and friendly;
- aspirational for Ecuador/LATAM operators;
- simple enough to avoid abandonment caused by complexity;
- rich in UX, but not decorative or marketing-like.

## Read These Files First

Use these as source of truth:

- `docs/project-freeze-handoff.md`
- `docs/frontend-handoff/README.md`
- `docs/frontend-handoff/02-invoicing.md`
- `docs/frontend-handoff/03-invoicing-sri-progressive-disclosure.md`
- `docs/frontend-handoff/05-invoicing-settings-sri.md`
- `docs/frontend-handoff/06-invoicing-customer-draft-flow.md`
- `docs/frontend-handoff/07-invoicing-items-flow.md`
- `docs/frontend-handoff/08-invoicing-document-review.md`
- `docs/frontend-handoff/09-invoicing-sri-submission-lifecycle.md`
- `docs/frontend-handoff/10-invoicing-vercel-qa-runbook.md`
- `docs/frontend-handoff/11-invoicing-payment-email-delivery-closeout.md`
- `docs/frontend-handoff/12-invoicing-operational-polish-qa.md`
- `docs/frontend-handoff/00-platform-shell.md`
- `docs/api/openapi.json`
- `apps/web-platform/src/app/app.tsx`
- `apps/web-platform/src/app/app.module.css`
- `apps/web-platform/src/app/api.ts`
- `apps/web-platform/src/app/types.ts`
- `apps/web-platform/src/features/invoicing/`

Read these prior design packages as visual reference:

- `docs/design/claude-design/05-invoicing-settings-sri/`
- `docs/design/claude-design/06-invoicing-customer-draft-flow/`
- `docs/design/claude-design/07-invoicing-items-flow/`
- `docs/design/claude-design/08-invoicing-document-review/`
- `docs/design/claude-design/09-invoicing-sri-submission-lifecycle/`
- `docs/design/claude-design/10-invoicing-payment-email-delivery-closeout/`

## Design Goal

Create a final operational polish and QA slice for the full Invoicing frontend.

This slice should answer:

> "Does the whole Invoicing experience now feel like one coherent premium
> product, or do some areas still feel like stitched-together utility forms?"

The output should help Codex integrate the remaining visual improvements in
small, safe PRs.

## What To Design

Design a polished Invoicing workspace system that covers:

- product workspace shell;
- subview navigation;
- context summary;
- SRI settings;
- customer and draft invoice flow;
- items flow;
- document review;
- SRI submission lifecycle;
- delivery and payment closeout;
- empty/loading/error/read-only states;
- mobile behavior;
- five moods.

Do not redesign the entire SaaS platform. Focus on making Invoicing coherent
inside the existing platform shell.

## Required Deliverable Structure

Create:

```txt
docs/design/claude-design/11-invoicing-operational-polish-qa/
```

Include:

- `index.html`
- `src/`
- `mock-data/`
- `README.md`
- `notes.md`
- `components.md`
- `integration-plan.md`

The viewer must include:

- desktop/mobile toggle;
- state switcher;
- mood switcher for comfort, focus, calm, high-contrast and night;
- at least one full Invoicing journey preview;
- an audit/polish board that Codex can translate into small PRs.

## Required States

Design explicitly:

1. operating workspace;
2. missing issuer/SRI setup;
3. draft invoice in progress;
4. issued invoice with pending SRI;
5. submitted but not authorized;
6. authorized;
7. rejected/returned SRI;
8. open balance;
9. fully paid;
10. backend unavailable;
11. permission-limited/read-only;
12. loading/skeleton;
13. empty workspace;
14. mobile compact flow.

## UX Principles

Use these principles:

- one recommended next action at a time;
- legal/fiscal truth must be explicit;
- SRI, delivery and payment are separate truths;
- technical traces are secondary;
- helper copy should reduce anxiety, not add clutter;
- cards should feel operational, not like a landing page;
- mobile must be intentionally designed, not a compressed desktop;
- moods should noticeably re-theme chrome, cards, controls and feedback;
- status pills should clarify, not decorate.

## Audit Requirements

Include an actionable audit in `notes.md`:

- what currently matches Claude Design;
- what does not match yet;
- exact components or regions Codex should touch;
- which issues are cosmetic;
- which issues affect usability;
- which issues affect mobile QA;
- recommended PR order.

Avoid generic comments like "improve spacing". Be precise:

- "reduce this grid from 3 columns to 1 at mobile";
- "move this status into the header";
- "replace this raw form heading with a next-step card";
- "make this destructive action secondary";
- "wrap this long recommended step";
- "remove horizontal overflow".

## Guardrails

- Backend is frozen.
- Do not invent endpoints.
- Do not invent new product modules.
- Do not invent payment gateway, bank reconciliation or accounting posting.
- Do not invent tax filing or accountant replacement.
- Do not imply SRI authorization from payment or email delivery.
- Do not imply payment from SRI authorization.
- Preserve the multi-product add-on/plugin mental model.

## Output Tone

Use Spanish UX copy for the interface, suitable for Ecuador/LATAM.

Keep copy concise, warm and professional.

The operator should feel:

- "sé dónde estoy";
- "sé qué sigue";
- "entiendo qué está pendiente";
- "puedo avanzar sin miedo";
- "esto es un sistema profesional, no una demo técnica".

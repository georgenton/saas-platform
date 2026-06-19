# Integration plan — Slice 11, Invoicing Operational Polish QA

Target stack: **React + TypeScript + Vite**, `apps/web-platform`. This slice is a
**coherence + polish pass**, so integration is a sequence of small, reversible
PRs — not a rewrite. Land them in the order below (same as the audit's PR plan).
**Backend is frozen: no new endpoints, mutations, fields or behaviors.**

## Ground rules

- Every surface already has its data. This slice only changes **layout, markup,
  hierarchy and responsive behavior**.
- Read semantic tokens only (`--surface`, `--border`, `--text-*`, `--primary`,
  status tones, `--shadow-*`, density, `--sidebar-*` / `--topbar-*`). Never
  hard-code a color or a shadow — that's how moods break (finding C1).
- Keep the three-truths guardrail intact: `submitted` ≠ `authorized`; delivery
  and payment never imply legal authorization.

## PR 1 — Shell / workspace layout polish  (risk: low)

Findings **A1 · A2 · C1**.

1. Remove the duplicate `<h1>` rendered inside the Invoicing workspace; rely on
   the top-bar breadcrumb + a single one-line `ProductHeader`
   (`app.tsx` / `app.module.css`).
2. Wrap every subview in one container: `max-width: 1040px; margin: 0 auto;
   padding: var(--gutter)`.
3. Replace hard-coded `box-shadow` / background literals on workspace cards with
   `var(--surface)` / `var(--border)` / `var(--shadow-sm)` so high-contrast drops
   the shadow on its own.

_Mechanical CSS/markup; no data changes._

## PR 2 — Subview navigation + context strip  (risk: medium)

Findings **A3 · A4 · C2**.

1. Add a `SubviewNav` component (the seven stages, journey order) with the
   NavItem 3px active rail + `aria-current`. Drive it from the existing routing/
   tab state in `workspace-documents.tsx` / `workspace-commercial.tsx`.
2. Add a presentational `ContextStrip` fed by the already-loaded
   `InvoiceDetailResponse` (number, buyer, totals, `electronicStatus`,
   `settlement`) + the four readiness reads. No new fetches.
3. Move the mood selector into the shell top bar (icon `sliders`), removing it
   from the separate settings screen.

## PR 3 — Responsive / mobile fixes  (risk: medium)

Findings **M1 · M2 · M3 · M4**.

1. Closeout triad and any 3-up grids → `grid-template-columns: 1fr` below 480px.
2. Invoice queue → single-column cards on mobile (kill the horizontal table).
3. Recommended-step copy gets `text-wrap: pretty`; pin the primary action to the
   bottom of the mobile view (thumb-reach), not inline.
4. Subview navigation on mobile → the shell bottom tabs (Resumen · Facturas · SRI
   · Más) plus a horizontally-scrollable chip strip with no clipping.

_Verify against the §5 mobile QA checklist in `notes.md`._

## PR 4 — Status / action hierarchy cleanup  (risk: low)

Findings **A5 · A6 · A7 · A8 · A9**.

1. Demote destructive/secondary actions (Revertir pago, Intervención manual) to
   `variant="ghost" | "secondary"`; reserve `primary` for the single recommended
   next step.
2. Force `submitted` to `tone="warning"` + "Enviado al SRI"; green only for
   backend-confirmed `authorized`.
3. Consolidate all status chips onto the design-system `StatusPill`.
4. Collapse the technical trace (`InvoicingTechnicalTracePanel`) into a secondary
   disclosure at the bottom of the lifecycle view.
5. Apply `var(--font-mono)` + a copy button to clave de acceso / nº de
   autorización.

## PR 5 — Vercel QA runbook update  (risk: low)

Re-run `docs/frontend-handoff/10-invoicing-vercel-qa-runbook.md` across the five
moods × desktop/mobile after PRs 1–4. Confirm: no horizontal overflow, bottom
tabs usable, triad stacks, long steps wrap, pills don't crush content, primary
action thumb-reachable, technical traces not front-and-center.

## Endpoints touched

**None added.** The surfaces re-presented here already use only:

```
GET  /api/invoicing/tenants/{slug}/reports/summary
GET  /api/invoicing/tenants/{slug}/invoices            · /invoices/{id}
GET  /api/invoicing/tenants/{slug}/electronic-profile  · …/electronic-signature/inspection
GET  …/electronic-submission                            · …/numbering/invoice
POST …/invoices/{id}/send-email                         · …/invoices/{id}/payments
POST …/invoices/{id}/payments/{paymentId}/reverse
POST …/invoices/{id}/electronic-document/submit | submit-presigned | check-authorization
POST …/invoices/{id}/electronic-status
```

No gateway, reconciliation, WhatsApp, receipt PDF, accounting journal or tax
declaration is introduced. Mood selection stays **frontend-only** local state
(backend persistence is future backlog).

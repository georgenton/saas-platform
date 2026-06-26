# Claude Design vs production audit

Date: 2026-06-19
Last updated: 2026-06-26, Invoicing workspace overview parity pass.

Scope: compare Claude Design deliveries `00` through `11` with the production
frontend deployed at `https://saas-platform-api-platform.vercel.app/`.

This is an audit, not a new design direction. Claude Design remains the visual
source of truth. Backend/OpenAPI and `apps/web-platform/src/app/api.ts` remain
the behavioral source of truth.

## Current conclusion

Production is functional and follows many of the product guardrails, but it is
not visually identical to the Claude Design deliverables.

The current implementation is best described as a semantic integration:

- the main hashes/routes exist for Command Center and Invoicing;
- real API contracts are used for session, product access and Invoicing data;
- SRI/payment/delivery guardrails are mostly preserved;
- the UI is still a simplified React reconstruction, not a faithful component
  migration of the Claude Design layouts, spacing, typography, chrome and
  state systems.

Do not add more frontend surfaces until these mismatches are either accepted as
intentional or converted into explicit remediation slices.

## Latest parity pass: Platform Shell and Command Center

Reference checked:

- Claude Design slice: `docs/design/claude-design/01-product-command-center`
- Production/local route: `#platform-home`

Result after the latest pass:

- The shell now uses the Claude-style fixed sidebar plus independently
  scrollable main area.
- The topbar now exposes the assistant as an in-place panel trigger instead of
  a navigation shortcut.
- The mood control now matches the Claude Design contract: a 36px square
  sliders/equalizer button, `Design mood` popover, five mood options with
  swatch + description, active checkmark, and the frontend-only persistence
  note.
- The Command Center typography, cards and status pills were tightened toward
  the Claude Design scale: smaller headings/body type, gray eyebrows, white
  card surfaces, compact green pills with dots.

Important environment note: Vercel production only reflects these fixes after
the corresponding frontend PRs are merged and deployed. Local verification was
performed against the current branch preview.

## Latest parity pass: Invoicing workspace overview

Reference checked:

- Claude Design slice: `docs/design/claude-design/02-invoicing-workspace`
- Claude Design polish: `docs/design/claude-design/11-invoicing-operational-polish-qa`
- Production/local route: `#invoicing-domain`

Result after this pass:

- The Invoicing overview now follows the Claude workspace structure more
  closely: status hero, persistent SRI/delivery/payment context, metric cards,
  invoice queue and focused invoice detail.
- The queue uses the Claude filter vocabulary (`Todas`, `Borradores`,
  `Por autorizar`, `Autorizadas`, `Rechazadas`) while remaining backed by the
  existing `InvoiceSummaryResponse` contract.
- The detail panel shows the selected invoice, lifecycle steps
  (`Borrador`, `Generado`, `Enviado`, `Autorizado`) and the independent
  document/SRI/payment truths. It still avoids implying SRI authorization until
  the backend reports it.
- No new backend endpoints or invented write actions were added.

Verification performed:

```bash
corepack pnpm nx build web-platform
corepack pnpm design:validate:claude
corepack pnpm exec vite --host 127.0.0.1 --port 4195 dist/apps/web-platform
curl -sS http://127.0.0.1:4195/#invoicing-domain
```

The in-app browser connection timed out during this pass, so the compiled
bundle and local preview response were verified automatically. Final visual QA
still requires opening the local preview or Vercel deployment and comparing it
against the Claude Design viewer.

## Production routes verified

Authenticated production was verified through the browser against:

- `#platform-home`
- `#invoicing-domain`
- `#invoicing-settings-sri`
- `#invoicing-customer-draft`
- `#invoicing-items`
- `#invoicing-documents`
- `#invoicing-sri-lifecycle`
- `#invoicing-closeout`

All routes rendered a shell and content. None were blank during this audit.

## Design viewer health

The local Claude Design `index.html` files are executable design references when
served through a pure static server. Do not serve them with Vite: Vite treats
`.jsx` as application source and can transform the files before Babel
standalone runs, causing false runtime errors such as `require is not defined`.

The viewers now pin classic JSX execution through `transform-react-jsx` and
expose `window.__CLAUDE_VIEWER_ERRORS` so every slice can be checked directly in
the browser.

Validated on 2026-06-19 with:

```bash
python3 -m http.server 4189 --bind 127.0.0.1 --directory docs/design/claude-design
node tools/design/validate-claude-design-slices.mjs
```

Browser validation result: slices `00` through `11` rendered with visible
content, interactive controls, populated `#root`, and empty
`window.__CLAUDE_VIEWER_ERRORS`.

Detailed workflow: `docs/frontend/claude-design-validation.md`.

## Slice-by-slice status

| Slice                                          | Production status             | Notes                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `00-platform-shell`                            | Good, still not pixel-perfect | Production has shell/sidebar/topbar/product nav. Latest fixes align the fixed scrolling model, assistant panel trigger and mood equalizer popover. Remaining differences are mostly icon exactness, mobile shell completeness and the fact that production uses React/CSS modules rather than the raw Claude viewer implementation.                                                                        |
| `01-product-command-center`                    | Good, still not pixel-perfect | Production has the Command Center, domain sections, product access states and cards. Latest fixes align typography scale, gray labels, white card surfaces, compact status pills and topbar mood behavior. Remaining differences: exact card content values differ because production reads real/local backend data; some Claude demo details like Acme/José/Plan Growth are intentionally not hard-coded. |
| `02-invoicing-workspace`                       | Good, still not pixel-perfect | Production now has the core Claude workspace composition: status hero, context strip, metrics, invoice queue, filters and focused invoice detail. Remaining differences are exact spacing, icon geometry, demo copy/data values, and mobile bottom-sheet behavior.                                                                                                                                         |
| `03-invoicing-sri-progressive-disclosure`      | Partial                       | Guardrails are present in `#invoicing-sri-lifecycle` and `#invoicing-settings-sri`, but the strict progressive disclosure panel hierarchy from the slice is not fully reproduced.                                                                                                                                                                                                                          |
| `04-access-login-gateway`                      | Partial to good               | Production has a guided access gateway and advanced token path. It still exposes a desktop brand/action layout that is simpler than the design, and future access methods remain non-functional as intended.                                                                                                                                                                                               |
| `05-invoicing-settings-sri`                    | Partial                       | Production has SRI readiness, issuer/signature/gateway/numbering cards and blockers. It is not visually equal to the Claude Design readiness-spined surface with the full four-pillar detail hierarchy.                                                                                                                                                                                                    |
| `06-invoicing-customer-draft-flow`             | Partial                       | Production has buyer, fiscal identity and draft guardrails. The design's guided lane and mobile bottom-sheet behavior are only approximated.                                                                                                                                                                                                                                                               |
| `07-invoicing-items-flow`                      | Partial                       | Production has items/totals/guardrail content. The design's item composition lane, sticky/mobile totals and state set are not fully implemented.                                                                                                                                                                                                                                                           |
| `08-invoicing-document-review`                 | Partial                       | Production has document queue/detail, readiness facts and review guardrails. The artifact/RIDE/XML design hierarchy is only partially represented.                                                                                                                                                                                                                                                         |
| `09-invoicing-sri-submission-lifecycle`        | Partial                       | Production separates prepared/submitted/authorized and does not imply authorization too early. The complete 17-state design surface, manual/fallback/trace panels and copy interactions are incomplete.                                                                                                                                                                                                    |
| `10-invoicing-payment-email-delivery-closeout` | Partial                       | Production shows independent SRI/delivery/payment truths and closeout actions. The 20-state closeout lane, payment history depth and mobile sheets are not fully equal.                                                                                                                                                                                                                                    |
| `11-invoicing-operational-polish-qa`           | Partial                       | Some polish from this slice was integrated: product header, subview nav, context strip, active focus. The design's full Shell/Map/Audit viewer and exact final workspace composition are not in production.                                                                                                                                                                                                |

## Contract and endpoint audit

No new frontend surface should assume an endpoint that is not present in
OpenAPI/API client.

Confirmed available in OpenAPI and/or `api.ts`:

- `GET /api/auth/me`
- `PUT /api/auth/me/current-tenancy`
- platform/product/tenant product reads
- Invoicing issuer profile, signature, submission, readiness, numbering
- Invoicing customers, invoices, taxes and invoice detail
- Invoicing document, RIDE, XML/artifact reads
- Invoicing email delivery and payment endpoints

Important loose contract:

- `GET /api/tenancy/tenants/{slug}/command-center` is described by Claude
  Design as a proposed future BFF aggregate. It is not currently wired as a
  generic tenancy Command Center API in `apps/web-platform/src/app/api.ts`.
  Production correctly composes Command Center client-side from existing
  endpoints today.

## Technical debt to resolve before more product screens

1. Treat Claude Design as the visual source of truth, but keep backend/OpenAPI
   as the behavioral source of truth. Do not hard-code Claude demo data when
   production already has real tenant/product data.
2. Keep Claude Design viewer validation reproducible through the static-server
   workflow in `docs/frontend/claude-design-validation.md`.
3. Extract the large Invoicing implementation out of
   `features/platform/claude-platform-app.tsx` into slice-specific production
   components that mirror Claude Design names and hierarchy.
4. Replace simplified cards/buttons/spacing with shared design primitives that
   intentionally match the approved Claude Design tokens.
5. Add a production visual QA checklist per route and mood:
   `#platform-home`, all Invoicing subviews, desktop and mobile.
6. Keep the generic Command Center BFF as backlog unless/when backend work is
   unfrozen.

## Detailed Command Center parity checklist

The following items were compared against Claude Design slice `01`.

| Area                  | Status               | Notes                                                                                                                                                              |
| --------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Fixed shell scrolling | Matched              | Sidebar stays fixed; the main content scrolls independently.                                                                                                       |
| Sidebar groups        | Good                 | Grouping and active state match the design structure. Icons are equivalent but not always identical to the Claude SVG set.                                         |
| Topbar tenant chip    | Good                 | Tenant selector position, compact card shape and breadcrumb are aligned. Text values come from backend/local tenant, not the Claude Acme fixture.                  |
| Assistant button      | Matched for UI shell | Opens an in-place assistant panel. No conversational backend is invented.                                                                                          |
| Search box            | Good                 | Shape, icon and shortcut are aligned. Search remains non-functional shell UI for now.                                                                              |
| Mood button           | Matched              | Uses sliders/equalizer icon, 36px square button and popover menu with five moods.                                                                                  |
| Notification button   | Good                 | Bell + red dot present. Exact notification behavior remains future scope.                                                                                          |
| User avatar           | Good                 | Uses tenant/user initials from runtime instead of the Claude fixture.                                                                                              |
| Page headline         | Good                 | Size and copy are close; production greets the authenticated user/role from available data.                                                                        |
| Summary cards         | Matched structurally | Three cards: company/tenant, subscription, products. Values differ because production uses current tenant/subscription state.                                      |
| Product cards         | Good                 | White surfaces, icon tile, state pills and evidence rows are aligned. Remaining differences are content density and some copy/details from real backend contracts. |
| Mood reskinning       | Partial to good      | Mood tokens affect shell, cards and controls. A full cross-route/mood screenshot matrix is still needed before calling all slices visually complete.               |
| Mobile launcher       | Partial              | Production has responsive behavior, but the Claude mobile bottom-tab and sheet patterns are not fully audited in this pass.                                        |

## Recommended remediation order

1. Stabilize the design reference:
   keep slices `00` through `11` versioned, runnable and browser-checkable
   before each parity slice.
2. Platform Shell parity:
   align sidebar, topbar, mood behavior, iconography, typography and assistant
   affordance with slice `00`.
3. Invoicing workspace parity:
   visually verify `#invoicing-domain` against slice `02` and `11` on desktop
   and mobile, then close remaining pixel-level differences if needed.
4. Invoicing subview parity:
   align `settings`, `customer-draft`, `items`, `documents`, `sri-lifecycle`
   and `closeout` one by one against slices `05` through `10`.
5. Only after parity is intentionally accepted or completed, resume new product
   frontend work.

# Claude Design vs production audit

Date: 2026-06-19

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

| Slice | Production status | Notes |
| --- | --- | --- |
| `00-platform-shell` | Partial | Production has shell/sidebar/topbar/mood selector and product nav. It is not an exact match to the design shell: icons, spacing, topbar density, assistant affordance and mood personality are simplified. |
| `01-product-command-center` | Partial to good | Production has the Command Center, domain sections, product access states and cards. It does not fully match the design layout/mobile system. It currently composes existing endpoints client-side. |
| `02-invoicing-workspace` | Partial | Production has Invoicing overview, metrics, context strip, active invoice and nav. It is not identical to the Claude Design screenshot: the design queue/detail workspace is richer and more spatially refined. |
| `03-invoicing-sri-progressive-disclosure` | Partial | Guardrails are present in `#invoicing-sri-lifecycle` and `#invoicing-settings-sri`, but the strict progressive disclosure panel hierarchy from the slice is not fully reproduced. |
| `04-access-login-gateway` | Partial to good | Production has a guided access gateway and advanced token path. It still exposes a desktop brand/action layout that is simpler than the design, and future access methods remain non-functional as intended. |
| `05-invoicing-settings-sri` | Partial | Production has SRI readiness, issuer/signature/gateway/numbering cards and blockers. It is not visually equal to the Claude Design readiness-spined surface with the full four-pillar detail hierarchy. |
| `06-invoicing-customer-draft-flow` | Partial | Production has buyer, fiscal identity and draft guardrails. The design's guided lane and mobile bottom-sheet behavior are only approximated. |
| `07-invoicing-items-flow` | Partial | Production has items/totals/guardrail content. The design's item composition lane, sticky/mobile totals and state set are not fully implemented. |
| `08-invoicing-document-review` | Partial | Production has document queue/detail, readiness facts and review guardrails. The artifact/RIDE/XML design hierarchy is only partially represented. |
| `09-invoicing-sri-submission-lifecycle` | Partial | Production separates prepared/submitted/authorized and does not imply authorization too early. The complete 17-state design surface, manual/fallback/trace panels and copy interactions are incomplete. |
| `10-invoicing-payment-email-delivery-closeout` | Partial | Production shows independent SRI/delivery/payment truths and closeout actions. The 20-state closeout lane, payment history depth and mobile sheets are not fully equal. |
| `11-invoicing-operational-polish-qa` | Partial | Some polish from this slice was integrated: product header, subview nav, context strip, active focus. The design's full Shell/Map/Audit viewer and exact final workspace composition are not in production. |

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

1. Decide whether production must become pixel/component faithful to Claude
   Design or only semantically aligned. Current state is semantic alignment.
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

## Recommended remediation order

1. Stabilize the design reference:
   keep slices `00` through `11` versioned, runnable and browser-checkable
   before each parity slice.
2. Platform Shell parity:
   align sidebar, topbar, mood behavior, iconography, typography and assistant
   affordance with slice `00`.
3. Invoicing workspace parity:
   rebuild `#invoicing-domain` against slice `02` and `11` as the final
   workspace composition.
4. Invoicing subview parity:
   align `settings`, `customer-draft`, `items`, `documents`, `sri-lifecycle`
   and `closeout` one by one against slices `05` through `10`.
5. Only after parity is intentionally accepted or completed, resume new product
   frontend work.

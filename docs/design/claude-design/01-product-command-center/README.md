# Product Command Center — Slice 01

The post-login **workspace home** for the SaaS Platform. It replaces the old
workspace summary area with an operational command center: tenant context,
subscription/plan, and the tenant's products as **status cards** that make the
modular access model explicit and let the operator *enter* a product or *add*
one. It mounts inside the Platform Shell (slice 00) chrome — sidebar, top bar,
tenant badge, mood selector and assistant never disappear; this slice designs
the main content area only.

`index.html` is an **interactive viewer** — switch **device** (desktop /
mobile), **state** (6 states), and **design mood** (comfort / focus / calm /
high-contrast / night) from the top control strip. Selection persists in
`localStorage`.

## Files

```
index.html              Interactive viewer (loads everything below)
src/
  data.js               window.CC_DATA — mock data (mirrors mock-data/*.json)
  icons.jsx             window.Icon — Lucide-geometry line icons (+ arrowRight, creditCard, layers, refresh, sprout)
  components.jsx        window.UI — shared primitives (reused from slice 00)
  chrome.jsx            window.Chrome — Sidebar, TopBar, MobileTopBar, BottomTabs, Sheet (Platform Shell frame)
  command-center.jsx    window.CC — desktop: SummaryRail, DomainSection, ProductStatusCard, empty/loading/error
  mobile.jsx            window.MobileApp — compact product launcher (stacked summary, segmented filter, list)
  app.jsx               Viewer chrome + desktop/mobile orchestration
mock-data/              JSON fixtures, one per endpoint (see _endpoint field)
notes.md                Card system · access model · domain grouping · states · a11y
components.md           Design-system notes for the new components in this slice
integration-plan.md     React + TS + Vite integration path for Codex (mock JSON → API)
```

## What's on the screen

- **Summary rail** — three cards: **tenant** (name, RUC, role, environment,
  members), **subscription/plan** (plan, price, renewal, seat usage), and a
  **product-access overview** (counts per access state + legend, "Add products").
- **Domain sections** (operational grouping, not alphabetical):
  - **Finanzas y Cumplimiento** — Electronic Invoicing EC · Tax Compliance EC · Full Accounting
  - **Crecimiento y Comercio** — Growth · Ecommerce
  - **IA y Automatización** — AI Console
  - **Clínicas** — Medical Clinics · Psychology Clinics
- **Product status cards** — each shows purpose, access state, last known
  activity / evidence source, 2–3 readiness indicators, a primary **Entrar**
  action (or Activar / Ver plan Scale / Ver en Marketplace), an optional
  secondary action, and a blocker line when access is constrained.

## Access model (the card system)

Every product card renders one of five access states. Disabled and blocked
products stay **visible** — never hidden — because the platform is modular and
products are add-ons that depend on plan + permissions.

| accessState | Card treatment | Pill | Primary action |
|---|---|---|---|
| `enabled` | white, accent icon tile, readiness + evidence | Activo (green) | Entrar |
| `permission_limited` | white + amber blocker line | Permiso limitado (amber) | Entrar (solo lectura) + Solicitar permiso |
| `blocked_by_plan` | sunken, neutral tile, "Incluye" + lock blocker | Requiere Scale (blue, lock) | Ver plan Scale |
| `available` | sunken, neutral tile, "Incluye" + add-on price | Disponible (azure) | Activar add-on |
| `disabled` | sunken, muted, "Incluye" + neutral blocker | No habilitado (gray) | Ver en Marketplace |

Active products (enabled / permission_limited) sit on white surfaces and lead;
addable / blocked products recede to a sunken surface with a neutral icon tile —
visibly secondary but fully present and actionable, in the same domain grid.

## States covered

Authenticated Command Center · Permission-limited highlighted (info banner) ·
Empty workspace (new tenant, nothing activated) · Local/dev banner · Loading
(skeletons) · Backend unavailable (chrome preserved + retry). Tenant context is
present in every non-loading state.

## Mobile

Not a shrunk desktop grid — a **compact product launcher**: stacked tenant+plan
summary card, access-state chips, a horizontal **segmented domain filter**
(Todos · Finanzas · Comercio · IA · Clínicas) and a **single-column** list of
compact launcher cards (icon, name, state pill, purpose, up to 3 readiness chips,
evidence line, full-width Entrar). Bottom tabs + bottom sheets (product nav,
tenant switch, mood, assistant) come from the Platform Shell mobile frame.

## Endpoints (source of truth: `docs/api/openapi.json`)

```
GET /api/auth/me
GET /api/tenancy/tenants/{slug}
GET /api/tenancy/tenants/{slug}/subscription
GET /api/tenancy/tenants/{slug}/entitlements
GET /api/tenancy/tenants/{slug}/products
GET /api/platform/plans
GET /api/tenancy/tenants/{slug}/command-center   ← PROPOSED future BFF aggregate (does not exist yet)
```

**This slice integrates on the existing endpoints above.** Per-product
**readiness / evidence** signals come from each product's own summary surface;
the `command-center` aggregate is a **proposed future backend contract** (not an
assumed endpoint) that would compose them into a single post-login read once a
backend team builds it. See `mock-data/command-center.json` and
`integration-plan.md`. No checkout / product-install endpoints are invented —
**Activar add-on**, **Ver plan Scale** and **Gestionar plan** render as the
intended actions but are **future UI states** while no endpoint exists (wire to a
future-backlog no-op or a contact/upgrade flow, never to an invented endpoint).

## Guardrails honored

Tenant context always visible · disabled & blocked products stay visible · AI
surfaces stay in suggestion / approval / guarded-execution language (never
autonomous) · nothing implies automatic tax filing, accounting certification,
signature or clinical diagnosis · labels EN, body/state copy es-EC · no marketing
hero, no vanity metrics — only operational signals.

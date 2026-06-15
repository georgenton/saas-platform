# Product Command Center — Integration Plan (for Codex)

Target app: `apps/web-platform` (React + TypeScript + Vite). This slice is a
design delivery — land it under
`docs/design/claude-design/01-product-command-center/` for review, then integrate
incrementally on top of the already-integrated Platform Shell (slice 00). Do
**not** paste the prototype into app source wholesale.

The Command Center is the **new route the post-login redirect points to**. It
renders inside the existing shell `<main>`; the shell, mood system and tenant
context from slice 00 are reused unchanged.

## 0. Prerequisite — slice 00 is integrated

This builds on the Platform Shell. Reuse its `Sidebar`, `TopBar`, mobile frame,
mood plumbing, route guard and primitives. The only addition to the shell is a
**Command Center** nav item (Core group) made the active/landing route.

## 1. Routing

```
/                         → redirect to /{tenantSlug}/command-center   (was /dashboard)
/{slug}/command-center    Product Command Center   (this slice)
/{slug}/dashboard         Dashboard                (still available, entered from a card/nav)
/{slug}/{product}         per-product surfaces     (slice 00 route map)
```

Make `command-center` the post-login landing. `Dashboard` stays a normal product
route; the Command Center is the operational home above it.

## 2. Data — compose the screen

The screen needs tenant + subscription + entitlements + products, plus per-product
readiness. Two viable shapes:

**A. Client-composed — USE THIS FOR THIS SLICE (existing endpoints, works today):**

```ts
const slug = currentTenancy.slug;
useQuery(['me'],                  () => api.get('/auth/me'));
useQuery(['tenant', slug],        () => api.get(`/tenancy/tenants/${slug}`));
useQuery(['subscription', slug],  () => api.get(`/tenancy/tenants/${slug}/subscription`));
useQuery(['entitlements', slug],  () => api.get(`/tenancy/tenants/${slug}/entitlements`));
useQuery(['products', slug],      () => api.get(`/tenancy/tenants/${slug}/products`));
useQuery(['plans'],               () => api.get('/platform/plans'));
// per-product readiness from each product's own summary surface, e.g.:
useQuery(['inv-summary', slug],   () => api.get(`/invoicing/tenants/${slug}/summary`));
```

**B. BFF aggregate — RECOMMENDED FUTURE CONTRACT (does NOT exist yet):**

```ts
useQuery(['command-center', slug], () => api.get(`/tenancy/tenants/${slug}/command-center`));
```

`mock-data/command-center.json` documents the shape this aggregate *should*
return. It is a **proposed future backend contract**, not an assumed existing
endpoint — do not call it in this slice. **Integrate using (A)** with the
endpoints already in `openapi.json`; once a backend team builds the aggregate,
switch the data layer to (B) to collapse the fan-out on the hot post-login path.
Base URL from `VITE_API_BASE_URL`
(default `http://127.0.0.1:3000/api`).

> **Contract to harden:** the `readiness[]` / `evidence{}` fields per product are
> owned by each product domain — they are the design's expectation, not a frozen
> contract. Agree the exact fields with each product team; the card tolerates a
> missing `readiness`/`evidence` (renders without that block).

## 3. Derive accessState (reuse slice 00 helper)

The card system keys entirely off `accessState`. If `/products` doesn't return it,
derive from entitlements + plan + permissions (same helper as the shell nav):

```ts
function accessState(p, ents, perms, plan): AccessState {
  const e = ents[p.key];
  if (!e?.enabled) {
    if (e?.reason === 'plan')     return 'blocked_by_plan';
    if (e?.reason === 'disabled') return 'disabled';
    return 'available';                       // not added — can be installed
  }
  if (p.requiredPermission && !perms.includes(p.requiredPermission))
    return 'permission_limited';
  return 'enabled';
}
```

Keep `disabled` and `blocked_by_plan` products in the list — render them, don't
filter them (guardrail). The `accessOverview` counts are a `groupBy(accessState)`.

## 4. Componentization order

1. `ProductStatusCard` + its state→treatment map (the reusable core). Ship the
   `ReadinessRow` / `IncludesList` / `BlockerRow` subcomponents with it.
2. `SummaryRail` (TenantSummary · PlanSummary · AccessOverview) and the mobile
   `SummaryStack`.
3. `DomainSection` (grouping + responsive grid) and the mobile `DomainFilter` +
   `LauncherCard`.
4. The state branches: `loading` (skeletons), `empty`, `backend-unavailable`,
   and the `permission-limited` / `dev` banners. Reuse the shell's `Banner` and
   skeleton patterns.
5. Wire actions: `enter` → `navigate(product.route)`; `upgrade` → plan screen;
   `add` / `marketplace` → marketplace; `request-permission` → access-request
   flow. See §6 for which are real vs. future-backlog.

## 5. Responsiveness

- Desktop grid: `repeat(auto-fill, minmax(340px, 1fr))` — 2–3 cards/row at ≥1280,
  graceful 1-up when narrow. Don't force a fixed column count.
- Switch to the **mobile launcher** at the shell's existing breakpoint — it is a
  different layout (stacked summary + segmented filter + single-column list), not
  a reflowed desktop grid. Do not just shrink the desktop cards.

## 6. Guardrails to preserve in code

- Tenant context visible on every state (it lives in the reused shell top bar).
- Disabled & blocked products **rendered, not hidden**.
- AI Console copy stays suggestion / approval / guarded-execution — never
  "ejecutó por ti".
- No implied automatic tax filing, accounting certification, signature or
  clinical diagnosis. Tax/Accounting/Clinics cards describe readiness + handoff.
- **No invented endpoints.** `Activar add-on`, `Ver plan Scale` and `Gestionar
  plan` are UI states until subscription-change / product-install contracts
  exist — wire them to a future-backlog no-op or a contact/upgrade flow.
- Labels EN, body/state copy es-EC. No marketing hero, no vanity metrics.

## 7. Review checklist (from `docs/design/README.md`)

Endpoints only from `openapi.json` · desktop + mobile · moods affect nav/cards/
controls/feedback (not just bg) · loading/empty/error/permission-limited states ·
tenant/product/permission context preserved · no invented products · AI/tax/
clinical guardrails visible · mock JSON replaceable by API calls · components
reusable across modules · disabled/blocked products visible.

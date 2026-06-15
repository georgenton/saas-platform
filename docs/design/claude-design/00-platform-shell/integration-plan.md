# Platform Shell — Integration Plan (React + TypeScript + Vite)

Target app: `apps/web-platform` (React + Vite + TS). This kit is a design
delivery — land it under `docs/design/claude-design/00-platform-shell/` for
review first, then integrate incrementally. Do **not** paste the prototype into
app source wholesale.

## 1. Tokens first

Copy the design-system CSS into the app and import the single entry point:

```ts
// apps/web-platform/src/main.tsx
import '@saas-platform/design-system/styles.css';
```

`styles.css` is a manifest of `@import`s (fonts → palette → moods → typography →
spacing → base). The mood system is pure CSS custom properties scoped by
`[data-mood]`; no JS theming library is required.

Set the mood on a root element:

```tsx
<div data-mood={mood} className="ds-app"> … </div>
```

## 2. Mood state & the full-shell theming model

Each mood is a complete theme declared under `[data-mood="…"]` in
`tokens/moods.css` — pure CSS custom properties, no JS theming library. It has
**two token layers**:

1. **Content semantics** — `--app-bg`, `--surface`, `--surface-sunken`,
   `--text*`, `--primary*`, status (`--success/-warning/-danger/-info` +
   soft/on-soft), `--focus-ring(-shadow)`, `--shadow-sm/md/lg`, and density
   (`--control-h`, `--card-pad`, `--gutter`, `--row-h`).
2. **Chrome semantics** — `--sidebar-bg/-fg/-fg-strong/-muted/-border/-hover/`
   `-active-bg/-active-fg/-surface/-surface-border/-accent` and
   `--topbar-bg/-border`. This is what gives the **sidebar and top bar** their
   own per-mood personality (deep-ink, charcoal, sage, bordered-white, dark).

```ts
type Mood = 'comfort' | 'focus' | 'calm' | 'high-contrast' | 'night';
const [mood, setMood] = useState<Mood>(
  () => (localStorage.getItem('shell.mood') as Mood) ?? 'comfort',
);
useEffect(() => localStorage.setItem('shell.mood', mood), [mood]);
// …
<div data-mood={mood} className="ds-app"> {/* whole shell re-themes */} </div>
```

**Scoping chrome onto primitives.** So `Button`, `NavItem` etc. need no special
casing inside the sidebar, the sidebar element re-maps a few content tokens to
its chrome tokens for its own subtree (CSS variables cascade):

```tsx
<aside style={{
  background: 'var(--sidebar-bg)',
  borderRight: '1px solid var(--sidebar-border)',
  // re-point the tokens its children read:
  ['--text' as any]: 'var(--sidebar-fg)',
  ['--text-strong' as any]: 'var(--sidebar-fg-strong)',
  ['--text-muted' as any]: 'var(--sidebar-muted)',
  ['--surface-hover' as any]: 'var(--sidebar-hover)',
  ['--primary' as any]: 'var(--sidebar-accent)',
  ['--primary-soft' as any]: 'var(--sidebar-active-bg)',
  ['--on-primary-soft' as any]: 'var(--sidebar-active-fg)',
  ['--surface' as any]: 'var(--sidebar-surface)',
  ['--border' as any]: 'var(--sidebar-border)',
}}>
  {/* NavItem, Button etc. now read the sidebar palette automatically */}
</aside>
```

The mobile bottom-tab bar uses the same trick. Backend persistence (per-user
default, per-device override, accessibility sync) is **future backlog** — keep
it out of the API contract for now.

## 3. Replace mock data with real fetches

`src/data.js` (`window.SHELL_DATA`) maps 1:1 to `mock-data/*.json`. Swap each
block for its endpoint with React Query (or your data layer):

```ts
const slug = currentTenancy.slug;
useQuery(['me'],            () => api.get('/auth/me'));
useQuery(['products', slug],     () => api.get(`/tenancy/tenants/${slug}/products`));
useQuery(['subscription', slug], () => api.get(`/tenancy/tenants/${slug}/subscription`));
useQuery(['entitlements', slug], () => api.get(`/tenancy/tenants/${slug}/entitlements`));
useQuery(['flags', slug],        () => api.get(`/tenancy/tenants/${slug}/feature-flags`));
useQuery(['catalog'],            () => api.get('/platform/products'));
useQuery(['plans'],              () => api.get('/platform/plans'));
```

Base URL comes from `VITE_API_BASE_URL` (defaults to `http://127.0.0.1:3000/api`),
matching the existing shell.

## 4. Derive product access state

If the products endpoint does not already return a single `accessState`, compute
it from entitlements + plan + permissions:

```ts
function accessState(p, ents, perms, plan): AccessState {
  if (!ents[p.key]?.enabled) {
    if (ents[p.key]?.reason === 'plan') return 'blocked_by_plan';
    if (ents[p.key]?.reason === 'disabled') return 'disabled';
    return 'available'; // can be added
  }
  if (!perms.includes(`${p.key}.view`)) return 'permission_limited';
  return 'enabled';
}
```

The `NavItem` / `NavRow` `state` prop renders the right affordance. Keep disabled
and blocked products **visible** (guardrail).

## 5. Componentization order

1. Shell layout: `Sidebar`, `TopBar` (tenant switcher + mood), responsive
   breakpoint → `MobileShell` (bottom tabs + sheets).
2. Route guard that maps `accessState` → product view or shell state screen.
3. Global feedback: `Banner` (env / error), toast portal, loading skeletons.
4. Per-product screens mount inside `<main>` (implement product slices next, in
   the handoff order: invoicing → ecommerce → tax → … ).

## 6. Components & libraries

- Reuse the design-system React components (`Button`, `Card`, `StatusPill`,
  `Banner`, `Input`, `Switch`, `Avatar`, `NavItem`, `MoodSelector`).
- Icons: **lucide-react** (the kit standardizes on Lucide geometry). One import,
  tree-shakeable, matches the stroke weight used here.
- Routing: the existing app can adopt `react-router` for the route map in
  `notes.md`; not required to start.
- No full UI-framework migration is needed — tokens + these primitives are
  enough.

## 7. Guardrails to preserve in code

- Tenant context visible on every screen.
- AI surfaces: suggestion / approval / guarded-execution copy only.
- No implied automatic tax filing, accounting certification, signature or
  clinical diagnosis.
- Add-product / upgrade remain UI states until backend contracts exist — wire
  the buttons to a "future backlog" no-op or a contact/upgrade flow, not to
  invented endpoints.

## 8. Review checklist (from `docs/design/README.md`)

Endpoints only from `openapi.json` · desktop + mobile · moods beyond light/dark ·
loading/empty/error/ready/disabled/blocked states · tenant/product/permission
context preserved · no invented products · AI/tax/clinical guardrails visible ·
mock JSON replaceable by API calls · components reusable across modules.

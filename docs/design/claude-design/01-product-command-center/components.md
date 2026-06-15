# Command Center — New Component Specs

Design-system notes for the components introduced in this slice. They live in
`src/command-center.jsx` / `src/mobile.jsx` as inline-styled React so the
prototype runs standalone, but they are written to graduate into the
design-system `components/` library. All read mood tokens only — no hard-coded
color, spacing or radius. Reused primitives (`Button`, `StatusPill`, `Banner`,
`Avatar`, `NavItem`, `MoodSelector`, `Card`) are unchanged from slice 00.

---

## ProductStatusCard  (core — promote to `components/product/`)

The state machine that renders one product. **One input — `accessState` — drives
surface, icon tile, pill, body and actions.**

```ts
type AccessState =
  | 'enabled' | 'permission_limited' | 'blocked_by_plan' | 'available' | 'disabled';

interface ProductStatusCardProps {
  product: {
    key: string; name: string; icon: string; domain: string;
    accessState: AccessState;
    purpose: string;                                   // one line
    readiness?: { label: string; value: string; tone: 'success'|'warning'|'neutral' }[]; // active only
    evidence?:  { label: string; source: string; when: string; mono?: string };          // active only
    includes?:  string[];                              // available/blocked/disabled
    blocker?:   { tone: 'warning'|'info'|'primary'|'neutral'; text: string };
    primary:    { label: string; action: 'enter'|'upgrade'|'add'|'marketplace'|string };
    secondary?: { label: string; action: string } | null;
    addonPrice?: string;
  };
  onAction?: (action: string, productKey: string) => void;
}
```

**State → treatment** (single source of truth — keep in one map):

| accessState | surface | icon tile | pill tone | body | primary |
|---|---|---|---|---|---|
| enabled | `--surface` | `--primary-soft` | success "Activo" | readiness + evidence | primary, Entrar |
| permission_limited | `--surface` | `--primary-soft` | warning "Permiso limitado" | readiness + evidence + blocker | primary + ghost |
| blocked_by_plan | `--surface-sunken` | neutral | info+lock "Requiere Scale" | includes + blocker | primary "Ver plan Scale" |
| available | `--surface-sunken` | neutral | primary "Disponible" | includes + blocker + price | primary "Activar add-on" |
| disabled | `--surface-sunken` | neutral | neutral "No habilitado" | includes + blocker | secondary "Ver en Marketplace" |

Layout: `flex column`, fixed `--card-pad`, body `flex:1` so the footer pins to
the bottom and cards in a grid row align. Card radius `--radius-md` (8px ceiling),
`--shadow-sm` on white tier / none on sunken tier.

**Subcomponents**
- `ReadinessRow` — `label (muted, nowrap+ellipsis)` ↔ `dot + value (tabular, nowrap)`.
  Tone dot: success/warning/neutral → `--success` / `--warning` / `--text-subtle`.
- `IncludesList` — check-prefixed "what you'd get" rows for inactive products.
- `BlockerRow` — tinted inline row (icon + copy). Tone map:
  warning=eye/`--warning`, info=lock/`--info`, primary=sprout/`--primary`,
  neutral=eye/`--text-subtle`. Always states *why* + *what to do*.

---

## SummaryRail + cards  (promote to `components/workspace/`)

Three-up rail (`repeat(3, 1fr)`, gap `--gutter`) of `SummaryCardShell` (icon tile
+ eyebrow + body). Collapses to a stack on mobile (`SummaryStack`).

- **TenantSummary** — name (h3) + label/value rows: RUC (mono), Rol, Ambiente
  (StatusPill success/warning), Miembros.
- **PlanSummary** — "Plan {name}" + price, Renueva, Asientos used/included + a
  `--primary` seat-usage bar, "Gestionar plan" (secondary).
- **AccessOverview** — big total + a legend list (one row per access state: tone
  dot + label + tabular count), "Add products" (ghost). The legend is the key to
  the whole card system; tones match the pills on the cards exactly.

---

## DomainSection  (layout)

`section` = header (domain icon + name + "N activos · total" count chip + hairline
rule) followed by a responsive product grid
`repeat(auto-fill, minmax(340px, 1fr))`, gap `--gutter`. 340px min → 1-up when
cramped, 2–3-up at desktop width, never truncating labels at target sizes.

---

## Mobile: DomainFilter + LauncherCard  (promote to `components/mobile/`)

- **DomainFilter** — horizontal, scrollable segmented control (pill segments;
  selected = `--primary-soft` + `--primary` border). Options: Todos + one per
  domain (short label). Filters the single-column list. Use this pattern anywhere
  mobile needs to slice a list by category without a desktop sidebar.
- **LauncherCard** — compact `ProductStatusCard`: header (icon · name · pill),
  purpose, up to 3 readiness **chips** (sunken pill: dot + label + value, nowrap),
  a one-line evidence row (active) or a blocker box (inactive), and a full-width
  primary button. Same two-tier surface logic (white vs sunken) as desktop.

---

## Tokens & guardrails

- New icons added to the inline set: `arrowRight`, `creditCard`, `layers`,
  `refresh`, `sprout` (Lucide geometry, stroke 1.8). In production map to
  `lucide-react` (`ArrowRight`, `CreditCard`, `Layers`, `RefreshCw`, `Sprout`).
- No new color/spacing tokens — everything composes from the existing mood
  layer. The only "new" visual idea is the **white vs. sunken surface tier** to
  separate active from addable products, and it is expressed purely through
  `--surface` / `--surface-sunken`, so it re-skins per mood for free.
- Status is never color-only (dot + text everywhere). Disabled/blocked products
  stay visible. AI copy stays suggestion-first.

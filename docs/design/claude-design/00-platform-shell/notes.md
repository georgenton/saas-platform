# Platform Shell — Design Notes

## Visual rationale (revision)

The shell was tuned to feel **premium, professional, friendly and trustworthy**
for business owners, operators, accountants and clinics in Ecuador / LATAM —
not like a developer console.

- **Typography → Manrope.** One warm, modern, humanist SaaS family for all UI
  and headings; it reads professional but human. IBM Plex **Mono** is reserved
  strictly for technical data — SRI access keys, RUC, document numbers, XML, IDs,
  logs. No mono in everyday UI.
- **Moods reskin the whole shell, not just the content panel.** Each mood now
  carries a dedicated chrome layer (`--sidebar-*`, `--topbar-*`) so the
  navigation has its own personality: a **deep-ink premium sidebar** in comfort,
  a **charcoal operations sidebar** in focus, a **light sage** sidebar in calm,
  a **bordered white** sidebar in high-contrast, and a **fully dark** shell in
  night. App background, cards, buttons, status, borders, focus rings, shadows,
  mobile nav and density all shift too — each mood feels distinct yet on-brand.
- **One confident flat accent** (azure; a softer teal in calm, a darker blue in
  focus/high-contrast, a brighter blue at night). No gradients, no orbs.
- **AI assistant presence.** A tasteful “Asistente” entry sits in the top bar
  (and as a mobile spark button / bottom sheet). It opens a copilot panel that
  **suggests and explains** — labelled “suggestion mode” with an explicit
  guardrail line (“No envía, firma ni declara nada sin tu aprobación”). It never
  implies autonomous execution.

## Component hierarchy

```
App (viewer chrome: device · state · mood)
├─ DesktopView  [data-mood]
│  ├─ Sidebar            Brand · product nav (grouped) · Add products · user
│  │  └─ NavRow ×n       access states: enabled/available/locked/disabled/limited
│  ├─ TopBar             TenantSwitcher · breadcrumb · Asistente · search · MoodMenu · bell · avatar
│  ├─ AssistantPanel     copilot slide-over (suggestion mode, guardrail line)
│  └─ main
│     ├─ Dashboard       KPI strip · activity feed · AI suggestion · plan
│     ├─ Marketplace     product cards (add / upgrade / open)
│     └─ StateScreen     tenant-missing · permission-denied · product-disabled ·
│                        blocked-by-plan · backend-unavailable
└─ MobileShell  [data-mood]
   ├─ TopBar (compact)   brand · tenant chip · Asistente · mood · bell
   ├─ content            MobileDashboard / MobileMarketplace / StateScreen
   ├─ BottomTabs         Home · Invoicing · Growth · AI · More (one-hand reach; mood-chrome)
   └─ Sheet              product nav · tenant switch · mood selector · assistant
```

Shared primitives (`window.UI`): `Btn`, `Pill`, `Banner`, `Avatar`, `Brand`,
`NavRow`, `MoodMenu`, `MoodSwatch`, `StateScreen`. These mirror the design-system
components (`Button`, `StatusPill`, `Banner`, `Avatar`, `NavItem`,
`MoodSelector`, `Card`) and are inlined only so the prototype runs without the
compiled bundle.

## Route map (frontend)

```
/                         → redirect to /{tenantSlug}/dashboard
/{slug}/dashboard         Dashboard            (enabled)
/{slug}/invoicing         Invoicing            (enabled)
/{slug}/ecommerce         Ecommerce            (enabled)
/{slug}/growth            Growth               (enabled)
/{slug}/tax-compliance-ec Tax Compliance EC    (permission_limited → read-only)
/{slug}/ai-console        AI Console           (permission_limited)
/{slug}/parties           Parties              (enabled)
/{slug}/accounting        Accounting           (blocked_by_plan → upgrade screen)
/{slug}/medical           Medical Clinics      (available → marketplace detail)
/{slug}/psychology        Psychology Clinics   (disabled → disabled screen)
/{slug}/settings          Settings             (enabled)
/{slug}/marketplace       Add products
*                         Permission denied / not found
```

Route guards read `products[].accessState` (from the products endpoint, derived
from entitlements + permissions). `enabled` renders the product; everything else
renders the matching shell state inside the frame — the chrome never disappears.

## State matrix

| State | Trigger (data) | Chrome | Body | Primary action |
|---|---|---|---|---|
| Loading | `auth/me` pending | sidebar + topbar | skeletons | — |
| Authenticated | `auth/me` ok, tenant set | full | Dashboard | Nueva factura |
| Local/dev banner | `environment.isDev` | full | Dashboard + warning banner | dismiss |
| Tenant missing | no `currentTenancy` | topbar (chip = "Select") | StateScreen | Elegir / crear empresa |
| Product disabled | `accessState=disabled` | full | StateScreen (neutral) | Ver en Marketplace |
| Permission denied | route perm missing | full | StateScreen (warning) | Solicitar acceso |
| Permission-limited | `accessState=permission_limited` | full | product + info banner | Solicitar permiso |
| Blocked by plan | `accessState=blocked_by_plan` | full | upgrade screen + plans | Actualizar a Scale |
| Add product | catalog item not entitled | full | Marketplace cards | Add product |
| Backend unavailable | API 5xx / network | minimal (no nav) | danger banner + StateScreen | Reintentar |

## Interaction notes

- **Tenant switcher** opens a menu of memberships; current tenant is checked.
  Tenant context (name + role + RUC) is always visible in the top bar.
- **Mood switcher** lives in the top bar (desktop) and as a bottom sheet
  (mobile). Changing it sets `data-mood` on the shell root; all tokens re-resolve
  instantly — including the `--sidebar-*` / `--topbar-*` chrome layer, so the
  sidebar and top bar visibly change too. Density tokens shift (focus tightens
  rows to 36px; calm relaxes to 46px).
- **Assistant** opens from the top-bar “Asistente” button (desktop slide-over)
  or the spark button (mobile bottom sheet). It shows suggestions tied to real
  product surfaces with Revisar / Descartar actions and a standing guardrail
  line. It is suggestion-only — no autonomous execution.
- **Hover** shifts background only (no transforms) — calm and corporate.
- **Mobile** uses bottom tabs for one-hand reach and bottom sheets for nav,
  tenant switch and mood — never a shrunk desktop sidebar.
- Transitions are 180ms ease; respect `prefers-reduced-motion` when porting.

## Accessibility notes

- `high-contrast` mood: near-black text, strong dark borders, shadow→none,
  thick double focus ring (`0 0 0 3px #fff, 0 0 0 6px #07090c`).
- Focus is always visible via `.ds-focusable` → `--focus-ring-shadow`; every
  interactive element (nav rows, buttons, switches, selects) opts in.
- Mood switcher is a `radiogroup`; switch is `role="switch"` with Space/Enter.
- Status is never encoded by color alone — pills pair a dot/label with the hue;
  nav access states pair lock/dot icons with tone.
- Hit targets: controls use the mood `--control-h` (36–42px); mobile tab targets
  are full-width × 58px. Text floor is 12px (`--text-2xs`) for labels.
- `color-scheme` is set per mood so form controls and scrollbars match.

## Open design questions (contract-hardening, not assumptions)

1. Does `GET /…/products` return a single `accessState`, or must the frontend
   derive it from entitlements + plan + permissions? The kit assumes a derived
   value and documents the inputs.
2. Add-product / upgrade need backend support (subscription change, product
   install) that does not exist yet — flagged as **future backlog**.
3. Mood persistence (per user / per device) is **future backlog** — currently
   `localStorage` only.

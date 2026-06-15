# Product Command Center — Design Notes

## Intent

The post-login home had been a generic "workspace summary". This slice replaces
it with an **operational command center**: the first thing the operator sees is
*their company*, *their plan*, and *every product they have, could have, or are
blocked from* — each as a status card that answers "is this ready, what needs me,
and how do I get in". It is deliberately **not** a marketing landing or a vanity
dashboard. Every number on the screen is an operational signal tied to a real
product surface (por autorizar, evidencias, conversaciones, pedidos,
aprobaciones), never a decorative KPI.

It mounts inside the Platform Shell (slice 00). The sidebar, top bar, tenant
badge, mood selector and assistant are reused unchanged — this slice owns the
`<main>` content area only.

## The product-card system (new)

A single state machine drives every card. `accessState` is the one input; it
decides surface, icon tile, pill, body content and actions. This is the heart of
the slice and the reusable contract for future product surfaces.

```
enabled            white surface · accent icon tile · readiness rows + evidence strip
                   → Entrar (+ secondary: Ver evidencia / Invitar equipo / Ver pedidos)
permission_limited white surface · amber blocker line · readiness + evidence
                   → Entrar (solo lectura) + Solicitar <permiso>
blocked_by_plan    sunken surface · neutral tile · "Incluye" list + lock blocker
                   → Ver plan Scale (+ Comparar planes)
available          sunken surface · neutral tile · "Incluye" list + add-on price
                   → Activar add-on (+ Ver detalle)
disabled           sunken surface · muted · "Incluye" list + neutral blocker
                   → Ver en Marketplace
```

**Two visual tiers in one grid.** Active products (enabled / permission_limited)
sit on white cards with an accent icon tile and full operational readiness — they
lead the eye. Addable / blocked products recede onto a *sunken* surface with a
neutral icon tile and a "what you'd get" list instead of live readiness. They
stay in their domain section, fully visible and actionable (guardrail: never hide
disabled/blocked products), but clearly read as "not yet part of your workspace".
This is how the modular / plugin / add-on nature of the platform is communicated
without a separate marketing area.

**Anatomy of an active card**
- Header: icon tile · name + one-line purpose · access pill (top-right).
- Readiness block: 2–3 rows, each a muted label + a tone dot + a tabular value.
  Product-specific (issuer readiness & SRI mode for Invoicing; period & evidence
  completeness & accountant review for Tax; WhatsApp & open conversations for
  Growth; pending approvals & guarded execution for AI Console; …).
- Evidence strip: a sunken row with a clock icon — "last known activity / source"
  (document numbers in mono).
- Blocker line (limited only): amber, states *why* and *what to do*.
- Footer: primary **Entrar** (arrow) + optional ghost secondary.

## Component hierarchy

```
App (viewer chrome: device · state · mood)
├─ DesktopView  [data-mood]   (Platform Shell frame, reused)
│  ├─ Sidebar                 product nav · Command Center active · Add products
│  ├─ TopBar                  tenant switcher · breadcrumb · Asistente · mood · bell
│  ├─ AssistantPanel          copilot slide-over (suggestion mode, guardrail line)
│  └─ main → DesktopContent
│     ├─ CommandCenter        PageHeader · SummaryRail · DomainSection ×4
│     │  ├─ SummaryRail        TenantSummary · PlanSummary · AccessOverview
│     │  └─ DomainSection      header (count chip) · grid of ProductStatusCard
│     │     └─ ProductStatusCard  ReadinessRow · IncludesList · BlockerRow
│     ├─ EmptyWorkspace       summary rail + dashed onboarding panel
│     ├─ CommandCenterLoading skeleton rail + skeleton card grid
│     └─ CommandCenterError   danger banner + retry panel (chrome preserved)
└─ MobileShell  [data-mood]   (Platform Shell mobile frame, reused)
   ├─ MobileTopBar            brand · tenant chip · Asistente · mood · bell
   ├─ MobileCommandCenter     header · SummaryStack · DomainFilter · LauncherCard ×n
   ├─ BottomTabs              Inicio · Facturación · Growth · IA · Más
   └─ Sheet                   product nav · tenant switch · mood · assistant
```

Shared primitives (`window.UI`, reused from slice 00): `Btn`, `Pill`, `Banner`,
`Avatar`, `Brand`, `NavRow`, `MoodMenu`, `MoodSwatch`, `StateScreen`,
`AssistantPanel`. New building blocks are documented in `components.md`.

## Domain grouping

Products are grouped by **operational domain**, not alphabetically, so the screen
maps to how a business actually thinks about its work:

- **Finanzas y Cumplimiento** — Electronic Invoicing EC · Tax Compliance EC · Full Accounting
- **Crecimiento y Comercio** — Growth · Ecommerce
- **IA y Automatización** — AI Console
- **Clínicas** — Medical Clinics · Psychology Clinics

Each section header carries an "N activos · total" chip so the access mix is
legible at a glance. Finance & clinical domains stay separated (guardrail).

## State matrix

| State | Trigger (data) | Body | Chrome |
|---|---|---|---|
| Authenticated | products resolved | summary rail + domain grids | full |
| Permission-limited | ≥1 `permission_limited` | + info banner ("Solicitar permisos") | full |
| Empty workspace | no enabled products | summary rail + dashed onboarding panel | full |
| Local/dev banner | `environment ≠ production` | + warning banner | full |
| Loading | aggregate pending | skeleton rail + skeleton cards | full |
| Backend unavailable | API 5xx / network | danger banner + retry panel + correlationId | full (tenant context kept) |

On error the shell does **not** strip its chrome — the operator keeps tenant
context and navigation; only the product area shows the failure + Reintentar.

## Moods affect everything (not just background)

Switching `data-mood` re-resolves the whole slice through semantic tokens:

- **Navigation** — sidebar & bottom tabs re-skin via the `--sidebar-*` chrome
  layer (deep-ink → charcoal → sage → bordered-white → dark).
- **Cards** — `--surface` / `--surface-sunken` flip the active vs. addable tiers;
  `--shadow-sm` is soft in comfort, tighter in focus, **none** in high-contrast
  (borders carry it), deeper in night. `--card-pad` changes density.
- **Controls** — `--control-h` shifts (focus 36px → calm 42px); buttons, pills,
  the seat bar and the segmented filter all follow.
- **Feedback states** — status tones (success/warning/info + soft/on-soft) drive
  readiness dots, pills, blocker lines and banners; each mood ships its own tuned
  set (e.g. calm's gentler amber, high-contrast's near-black, night's brighter).
- **Focus** — `--focus-ring-shadow` (single ring → thick double ring in
  high-contrast) on every `.ds-focusable`.

## Accessibility

- Status is never color-only: every readiness value pairs a tone **dot** with a
  text value; pills pair a dot/lock with a label; blockers pair an icon with copy.
- `high-contrast` mood: near-black text, strong borders, shadow→none, thick
  double focus ring.
- Labels truncate gracefully (single line + ellipsis) only at extreme narrow
  widths; the design target (1440) shows 2–3 cards per row with full labels.
- Hit targets use the mood `--control-h`; mobile launcher buttons are full-width;
  segmented filter chips are ≥32px. Text floor 12px (`--text-2xs`).
- Hover shifts background one step only — no transforms/lifts. Respect
  `prefers-reduced-motion` when porting.

## Copy register

Labels English (`Electronic Invoicing EC`, `Tax Compliance EC`); body and state
copy es-EC, operational and calm ("esto es lo que tu espacio pide atender hoy",
"Solo lectura — necesitas el permiso tax.manage", "Incluido en el plan Scale").
AI stays suggestion-first ("preparó… requiere tu aprobación"). No marketing tone,
no exclamation, no emoji.

## Open questions (contract-hardening, not assumptions)

1. **Readiness source.** Each product's `readiness[]` + `evidence{}` belong to
   that product's domain. We assume a per-product summary surface and recommend an
   optional `GET /…/command-center` BFF aggregate to keep the post-login screen a
   single read. The exact fields per product are owned by each product team.
2. **Add-product / upgrade** need backend support (subscription change, product
   install) that does not exist yet — **future backlog**; buttons are no-ops/CTAs.
3. **Mood persistence** (per user / per device) is **future backlog** —
   `localStorage` only for now.

# Platform Shell — Design Delivery (slice `00-platform-shell`)

Revised Platform Shell for the SaaS Platform: a premium, friendly, trustworthy
modular SaaS operating system for Ecuador / LATAM, with a **five-mood** theming
system, an **AI assistant** presence, full **desktop + mobile** shells, and every
access / feedback state.

> **Open it:** unzip and open `index.html` in a browser (or serve the folder:
> `npx serve .`). It's fully self-contained — the design-system CSS is bundled
> under `design-system/`. Switch **device · state · mood** from the top strip.

## Package structure

```
platform-shell/
  index.html              Interactive viewer (open this)
  source/                 React/JSX source
    data.js               SHELL_DATA — mock data (mirrors mock-data/*.json)
    icons.jsx             Lucide-geometry line icons
    components.jsx        primitives: Btn, Pill, Banner, Avatar, NavRow,
                          MoodMenu, StateScreen, AssistantPanel
    desktop.jsx           Sidebar, TopBar, Dashboard, Marketplace
    mobile.jsx            MobileShell (bottom tabs + sheets)
    app.jsx               viewer chrome + desktop/mobile orchestration
  design-system/          Bundled tokens so the kit runs offline
    styles.css            entry (link this in production too)
    tokens/               fonts · palette · moods · typography · spacing · base
  mock-data/              JSON fixtures, one per endpoint (see _endpoint field)
  screenshots/            desktop + mobile previews across moods
  assets/                 favicon.ico (only first-party asset; icons → Lucide)
  notes.md                visual rationale · component hierarchy · route map ·
                          state matrix · interaction & accessibility notes
  integration-plan.md     React + TS + Vite integration (mock JSON → API, moods)
  README.md               this file
```

## Brief → deliverable map

| Required output | Where |
|---|---|
| Desktop layout (all moods) | `index.html` · `screenshots/desktop-*.png` |
| Mobile layout (all moods) | `index.html` (Mobile) · `screenshots/mobile-*.png` |
| Component hierarchy | `notes.md` |
| Route map · state matrix | `notes.md` |
| Product nav / add-product model | `source/desktop.jsx`, `mock-data/products.json`, `platform-products.json` |
| Design tokens + mood tokens | `design-system/tokens/` (`moods.css` = the 5 themes) |
| Updated typography | `design-system/tokens/fonts.css`, `typography.css` (Manrope) |
| Sidebar/topbar mood behavior | `--sidebar-*` / `--topbar-*` in `moods.css`; `source/desktop.jsx` |
| AI assistant presence | `source/components.jsx` (AssistantPanel), `mock-data/assistant.json` |
| Mock JSON (incl. selected mood) | `mock-data/*.json` |
| Interaction + accessibility notes | `notes.md` |
| Integration notes (React/Vite/TS) | `integration-plan.md` |
| Mood previews | `screenshots/` |

## Endpoints (source of truth: repo `docs/api/openapi.json`)

```
GET /api/auth/me
GET /api/tenancy/tenants/{slug}/products | subscription | entitlements | feature-flags
GET /api/platform/products | plans
```

Mood selection and the AI assistant are **frontend-only** for now (local state).
No checkout / product-install / AI-persistence endpoints are invented — add-product,
upgrade and mood persistence are UI states / future backlog.

## Guardrails honored

Tenant context always visible · financial and clinical modules grouped separately ·
AI stays in suggestion / approval / guarded-execution language (never autonomous) ·
nothing implies automatic tax filing, accounting certification, signature or
clinical diagnosis · disabled and plan-blocked products stay visible, never hidden.

## Review landing spot (per `docs/design/README.md`)

Intended to land under `docs/design/claude-design/00-platform-shell/` for review
before incremental integration into `apps/web-platform`.

# Access / Login Gateway — Slice 04

The **signed-out entry experience** for the SaaS Platform. It replaces the raw
JWT textarea that currently bootstraps the deployed app, and it **precedes** the
Platform Shell (slice 00) and Product Command Center (slice 01): nothing dense or
multi-product appears until access resolves. Driven by
`docs/frontend-handoff/00-access-login-gateway.md`.

`index.html` is an **interactive viewer** — switch **device** (desktop / mobile),
**state** (8 access states) and **design mood** (comfort / focus / calm /
high-contrast / night) from the top control strip. The flow is **live**:
`Continuar` → *verificando…* → resolved state. Selection persists in
`localStorage`.

## The core idea — "a calm front desk, not a security wall"

A first-time operator should feel *this product is serious*, *this is easy to
enter*, and *I know what happens next* — without having to understand the system
first. The gateway is a two-pane composition:

- **Left — brand & trust panel.** Wordmark, one confident line about what the
  platform is, and a quiet, **non-interactive** list of the work it supports
  (Facturación electrónica SRI · Contabilidad · Tax Compliance EC · Ecommerce ·
  Growth · Clínicas). Context and trust — not a marketing hero, not clickable
  products. It carries the active **mood's chrome** personality (sidebar tokens).
- **Right — one focused action card.** Brand-light surface with the single
  state-appropriate card. Only **one dominant action** is ever present.

## Honest about the backend contract

The backend exposes session inspection, current-tenancy selection and invitation
accept/detail — but **no public web credential login** (email/password, magic
link, SSO, password reset). So:

- The **dominant action is `Continuar`** — it inspects the session
  (`GET /api/auth/me`) and routes to the correct post-auth screen.
- **Future auth methods** (correo · enlace de acceso · SSO) render as
  **non-interactive structure** under a "PRÓXIMAMENTE" divider — dashed,
  disabled, tagged. Never fake working flows.
- The **Bearer-token bootstrap stays**, but behind a collapsed **"Acceso
  avanzado · ya tengo un token"** disclosure (a side panel on desktop, a bottom
  sheet on mobile) — explicit, secondary, never the hero.

## States covered (state switcher)

| State | What it shows |
|---|---|
| `gateway` | Signed-out access gateway — the primary card. |
| `checking` | Verifying session — calm spinner + `GET /api/auth/me`. |
| `backend-unavailable` | Identity service unreachable — retry + correlationId. |
| `invalid-token` | Advanced token rejected — error inside the advanced panel. |
| `invitation` | Pending invitation review — tenant, role, inviter, expiry → accept. |
| `workspace-select` | Multiple tenancies — pick where to work (PUT current-tenancy). |
| `no-tenant` | Session but no workspace — explains what's missing, no shell dump. |
| `ready` | Session resolved — calm handoff into the Command Center (slice 01). |

## Desired flow

```
signed-out gateway → checking session → (invitation review?) →
(workspace selection?) → session ready → hand off to Command Center
```

`Continuar`, `Usar token`, `Aceptar invitación` and choosing a workspace all run
the inline "verificando…" transition and resolve to the **ready** handoff, which
shows the resolved tenant and a single **Entrar al Command Center** action.

## Files

```
index.html              Interactive viewer (loads everything below)
src/
  data.js               window.ACCESS_DATA — brand/trust + session/invitation/tenancy scenarios
  icons.jsx             window.Icon — Lucide-geometry icons (+ logIn, globe, mapPin)
  components.jsx        window.UI — shared primitives (Btn, Pill, Banner, Avatar, MoodMenu, …)
  access.jsx            window.ACCESS — desktop: BrandPanel, GatewayCard, AdvancedToken,
                        Checking/Error/Invitation/Workspace/NoTenant/Ready cards, MoodControl
  access-mobile.jsx     window.MobileAccess — one-thumb screens + bottom sheets (token · mood)
  app.jsx               Viewer chrome + device/state/mood orchestration
mock-data/              JSON fixtures, one per endpoint (see _endpoint field)
notes.md                Rationale · hierarchy · honesty · mood · a11y · interaction
components.md           The reusable components this slice introduces
integration-plan.md     Extracting an `access` feature out of app.tsx (React/Vite/TS)
README.md               This file
```

## Endpoints (source of truth: `openapi.json`)

This slice **invents no endpoints** and no working auth providers. It uses only:

```
GET  /api/auth/me                                  ← session inspection (gateway, checking)
PUT  /api/auth/me/current-tenancy                  ← workspace selection
GET  /api/auth/invitations/{invitationId}          ← invitation review
POST /api/auth/invitations/{invitationId}/accept   ← accept invitation
```

The Bearer token bootstrap calls `GET /api/auth/me` with the pasted token. Mock
JSON shapes are illustrative — harden field names against `openapi.json` on
integration.

## Mobile

Not the desktop split. A single focused card per state behind a compact brand
bar; short copy; the **advanced token** and **mood** live in **bottom sheets**;
strong contrast and one-thumb hit targets. The workspace picker is a stacked
tappable list.

## Mood

Mood applies on this signed-out screen and is reachable from a corner
**Apariencia** control (desktop) / bottom sheet (mobile). It retunes the brand
panel chrome (sidebar tokens), the action card surface, inputs, buttons, banners
and focus rings — comfort / focus / calm / high-contrast / **night** (full dark).

## Guardrails honored

No raw textarea first · advanced token is secondary, behind disclosure · future
auth methods are non-interactive structure, never fake flows · no full product
shell before the session resolves · invitation acceptance & tenancy selection
are explicit and calm · one dominant action at a time · labels EN where product
nouns, body copy es-EC · no marketing landing.

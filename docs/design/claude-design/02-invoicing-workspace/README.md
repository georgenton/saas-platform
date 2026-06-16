# Invoicing Workspace — Slice 02

The **Ecuador electronic-invoicing workspace** for the SaaS Platform. It is the
operator's home for issuing and tracking electronic invoices: a calm, guided
`<main>` that mounts inside the Platform Shell (slice 00) chrome — sidebar, top
bar, tenant badge, mood selector and assistant never disappear. This slice
designs the content area only.

`index.html` is an **interactive viewer** — switch **device** (desktop /
mobile), **state** (7 states) and **design mood** (comfort / focus / calm /
high-contrast / night) from the top control strip. Selection persists in
`localStorage`.

## The core idea — "serious software made humane"

Electronic invoicing in Ecuador is legally serious and operationally anxious.
The workspace answers four operator questions on sight, in this order:

1. **"I know where to start."** A single contextual **status hero** leads every
   screen with one headline + one primary action (Revisar por autorizar · Renovar
   firma · Configurar emisor · Nueva factura). Never a wall of panels.
2. **"I understand what's ready and what's blocked."** A calm **readiness ribbon**
   under the hero shows the four SRI pillars (Emisor · Firma · Gateway ·
   Numeración) as colored dots — green/amber/red — with one line each. Full
   configuration is progressive-disclosure behind "Configuración SRI".
3. **"I can issue and monitor without fear."** The **invoice queue** is a
   light-scanning list (5 columns, segmented filter) — not a 12-column
   accountant spreadsheet. Selecting a row opens a **focused detail panel** with
   a document **lifecycle stepper** so the operator always sees where a document
   is.
4. **"The system helps but doesn't hide compliance truth."** The detail panel
   separates **system status** (document: draft / issued) from **legal status**
   (electronic: preview → generated → submitted → authorized / rejected) and
   never implies SRI authorization before the backend confirms it.

## Files

```
index.html            Interactive viewer (loads everything below)
src/
  data.js             window.INV_DATA — mock data (mirrors mock-data/*.json)
  icons.jsx           window.Icon — Lucide-geometry line icons (+ invoicing set)
  components.jsx      window.UI — shared primitives (reused from slice 00)
  chrome.jsx          window.Chrome — Sidebar, TopBar, mobile frame (Platform Shell)
  workspace.jsx       window.INV — desktop: StatusHero, Metrics, Queue, DetailPanel,
                      Stepper, ReadinessConfig + getReadiness/money helpers
  mobile.jsx          window.MobileInv — one-hand workspace (tabs, queue, detail sheet)
  app.jsx             Viewer chrome + device/state/mood orchestration
mock-data/            JSON fixtures, one per endpoint (see _endpoint field)
notes.md              Design system · lifecycle model · states · a11y · guardrails
components.md         The new reusable components this slice introduces
integration-plan.md   React + TS + Vite integration path for Codex (mock JSON → API)
```

## What's on the screen (operating state)

- **Status hero** — eyebrow (Operaciones · período), one headline, one
  plain-language paragraph, one primary action. Footer row = the four readiness
  pillars + "Configuración SRI" toggle.
- **Portfolio metrics** — Por autorizar · Autorizadas (mes) · Cartera del mes ·
  Por cobrar. Operational signals only, no vanity metrics.
- **Invoice queue** (left) — segmented filter (Todas · Borradores · Por
  autorizar · Autorizadas · Rechazadas) over a 5-field list: número (mono),
  cliente, total (tabular), estado pill. Click to select.
- **Detail panel** (right, sticky) — número + cliente + total, the **lifecycle
  stepper**, document vs electronic condition, contextual **next step**, labeled
  artifacts (RIDE preview vs XML), clave de acceso / nº de autorización (mono),
  rejection reason, and a quiet cross-product handoff strip (Accounting · Tax
  Compliance) once authorized.
- **Configuración electrónica SRI** (progressive disclosure) — four cards:
  Perfil del emisor · Firma electrónica · Envío / Gateway · Numeración, each
  with fields, status pill and an action. Blockers surface here as banners.

## Document lifecycle (the artifact ladder)

The slice makes the Ecuador artifact stages explicit and never collapses them:

| electronic | Stage shown | Pill | Stepper |
|---|---|---|---|
| `none` | Artefacto de previsualización | Borrador (neutral) | ● Borrador |
| `generated` | Artefacto generado · XML firmado | Generado (info) | ✓ Generado |
| `submitted` | Artefacto enviado · esperando autorización | En el SRI (warning) | ● Enviado — **not** authorized |
| `authorized` | Artefacto autorizado por el SRI | Autorizada (success) | ✓ Autorizado + nº autorización |
| `rejected` | Devuelta por el SRI con observaciones | Rechazada (danger) | ✗ on Enviado + reason (code/field) |

Submit / generate actions are **disabled** while electronic readiness is blocked.

## States covered (state switcher)

Al día (operando) · Sin perfil de emisor (onboarding "start here") · Sin facturas
· Firma caducada (readiness blocked) · Permiso limitado (read-only banner +
disabled actions) · Backend no disponible (chrome preserved + retry) · Cargando
(skeletons). Within "operando", selecting invoices walks the draft / generated /
submitted / authorized / rejected detail states. Tenant context is present in
every non-loading state.

## Mobile

Not a shrunk desktop. A one-hand experience behind bottom tabs **Resumen ·
Facturas · SRI · Más**: compact status hero, stacked readiness pills, 2×2
metrics, a "por autorizar" shortcut; the Facturas tab is a single-column card
list with a horizontal filter; tapping a card opens a **detail bottom sheet**
(stepper + condition rows + next step). SRI tab stacks the four readiness cards.
Tenant switch, mood and assistant are bottom sheets from the shell frame.

## Endpoints (source of truth: `docs/api/openapi.json`)

```
GET  /api/auth/me · /api/tenancy/tenants/{slug} · …/subscription · …/products
GET  /api/invoicing/tenants/{slug}/reports/summary        → portfolio metrics
GET  /api/invoicing/tenants/{slug}/invoices               → queue
GET  /api/invoicing/tenants/{slug}/invoices/{id}          → detail
GET  /api/invoicing/tenants/{slug}/electronic-profile     → issuer pillar
GET  /api/invoicing/tenants/{slug}/electronic-signature/inspection → firma pillar
GET  /api/invoicing/tenants/{slug}/electronic-submission  → gateway pillar
GET  /api/invoicing/tenants/{slug}/numbering/invoice      → numbering pillar
GET  …/invoices/{id}/electronic-document/xml | /ride      → artifacts
POST …/invoices/{id}/electronic-document/submit           → "Enviar al SRI"
POST …/invoices/{id}/electronic-document/check-authorization → "Consultar autorización"
POST /api/invoicing/tenants/{slug}/invoices               → "Nueva factura"
```

This slice composes the readiness ribbon **client-side** from the four
electronic-* / numbering endpoints (`ready` is derived, never assumed). No
endpoints are invented. See `integration-plan.md`.

## Guardrails honored

Tenant context always visible · preview / generated / submitted / authorized /
rejected artifacts visually distinct · **never implies SRI authorization before
the backend says so** (submitted stops at "Enviado") · signature inspection &
blockers shown *before* submit, which is disabled when readiness is blocked ·
AI stays suggestion-first ("preparé… requiere tu aprobación") · disabled/blocked
products stay visible in the nav · labels EN, body/state copy es-EC · no
marketing hero, no vanity metrics.

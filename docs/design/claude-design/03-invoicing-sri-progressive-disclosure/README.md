# Invoicing SRI Progressive Disclosure — Slice 03

The **premium refinement of the Ecuador SRI control area** that lives inside an
invoice's detail. This is **not a new product** — it is the next pass on the
surface already integrated in
`apps/web-platform/src/features/invoicing/workspace-electronic.tsx`
(`InvoicingElectronicStatusPanel` + `InvoicingTechnicalTracePanel`), driven by
`docs/frontend-handoff/03-invoicing-sri-progressive-disclosure.md`.

It builds directly on slice 02 (`02-invoicing-workspace`) — same Platform Shell
chrome, same design tokens, same lifecycle vocabulary — and zooms into the one
panel that most needed to stop feeling like a technical wall.

`index.html` is an **interactive viewer**: switch **device** (desktop / mobile),
**state** (the 9 SRI states + loading / backend error) and **design mood**
(comfort / focus / calm / high-contrast / night) from the top control strip.
Selection persists in `localStorage`.

## The core idea — "the SRI is a guided next step, not a wall"

The SRI area is legally serious and operationally anxious. The refinement
expresses a strict hierarchy of **decreasing urgency**, so the operator's eye
always lands on the one thing that matters now:

```
1  Immediate status     document / SRI / access-key readiness     (status triad)
2  Recommended step      what to do now + why · the loudest thing  (one cue)
3  Compact operation     dense controls hidden by default          (disclosure)
4  Intervention          opens on blocker / reconciliation         (manual form)
5  Advanced fallback     external signed XML · clearly secondary   (muted card)
6  Technical evidence     history + SOAP traces · visually quieter  (trace panel)
```

Only **one** thing is ever loud: the next-step primary button. Everything below
the "Controles avanzados" divider is collapsed, calm, and clearly optional.

## What's on the screen (desktop)

- **Invoice context** — a slim header (número · cliente · RUC · total · IVA) so
  the SRI panel is always grounded in a real document.
- **Autorización SRI** panel:
  - **Status triad** — three signal tiles that separate **Documento** (internal
    system condition) from **Estado SRI** (legal condition) from **Clave de
    acceso** (readiness). This is the compliance backbone, made visual.
  - **Lifecycle ladder** — Preparado → Enviado al SRI → Autorizado. It never
    lights *Autorizado* until the backend confirms; a rejection turns the
    *Enviado* node red.
  - **Authorized artifacts** — clave de acceso + nº de autorización with a
    one-tap **copy** affordance (operators paste these into the SRI portal).
  - **Next step** — one tonal cue: title (what) + plain-language paragraph (why)
    + one primary action contextual to the stage, disabled while readiness is
    blocked.
  - **Controles avanzados** — a quiet divider, then two compact disclosure cards
    (*Configuración y conciliación* · *Sandbox real / fallback técnico*) with a
    clear rotate-chevron affordance. The fallback card is visibly secondary
    (dashed border, sunken surface, "Avanzado" tag).
  - **Intervention** (manual SRI control) and **fallback** (external signed XML)
    panels expand in place. Intervention auto-opens on blocker / submitted /
    rejected; fallback auto-opens only when an XML is staged or the document
    path is unsupported.
- **Historial técnico SRI** — a separate, quieter card (no shadow, sunken
  header). Collapsed by default; expands to a timeline of events with SRI
  diagnostics and per-event **Ver payloads SOAP** reveals.

## States covered (state switcher)

| State | What it shows |
|---|---|
| `healthy / ready` | Base usable, nothing urgent. Compact by default; next step = enviar. |
| `blocked by readiness` | Firma caducada. Submit disabled, blocker explained, intervention opens. |
| `pending submission` | Access key prepared; next step = firmar y enviar. |
| `submitted / waiting SRI` | Stops at **Enviado** — never implies authorization. "Consultar autorización". |
| `authorized` | Clave + nº autorización (copyable), handoff to Accounting · Tax Compliance. |
| `rejected` | SRI code/field/message; intervention auto-opens; corregir y regenerar. |
| `unsupported document path` | `submitSupported:false`; compatibility notice, submit blocked, fallback surfaced. |
| `fallback XML bridge available` | Presigned XML staged; fallback open but still clearly secondary. |
| `technical trace with events` | Authorized doc with a rich event history; trace pre-expanded. |

Plus `loading` (skeletons) and `backend-unavailable` (chrome preserved + retry).

## Mobile

Not a shrunk desktop. A focused, scrollable SRI screen behind the shell top bar:
a sub-header with back + stage pill, an invoice mini, the **status triad stacked
as rows**, a slim lifecycle bar, one full-width next-step button, then the
**Controles avanzados** as stacked compact cards that open the dense controls in
**bottom sheets** (intervention · fallback) — deliberate, focused, one-hand. The
technical trace is an inline, quiet expand at the bottom.

## Files

```
index.html              Interactive viewer (loads everything below)
src/
  data.js               window.SRI_DATA — shell context + 9 scenarios (one per state)
  icons.jsx             window.Icon — Lucide-geometry icons (+ route/history/terminal/shield*)
  components.jsx        window.UI — shared shell primitives (reused from slice 00/02)
  chrome.jsx            window.Chrome — Sidebar, TopBar, mobile frame, bottom sheets
  sri-panel.jsx         window.SRI — desktop: SRIControlPanel, StatusTriad, StageStepper,
                        NextStep, InterventionPanel, FallbackPanel, TechnicalTrace, CopyValue
  sri-mobile.jsx        window.MobileSRI — one-hand SRI screen + bottom sheets
  app.jsx               Viewer chrome + device/state/mood orchestration
mock-data/              JSON fixtures, one per endpoint (see _endpoint field)
notes.md                Design rationale · hierarchy · guardrails · tensions · a11y
components.md           The reusable components this slice introduces
integration-plan.md     How Codex folds this into workspace-electronic.tsx (no prototype paste)
README.md               This file
```

## Endpoints (source of truth: `openapi.json`)

This slice **invents no endpoints**. It reads the same surfaces the panel
already uses:

```
GET  …/electronic-profile · …/electronic-document/readiness
GET  …/electronic-signature/inspection · …/electronic-submission · …/numbering/invoice
GET  …/invoices/{id}/electronic-document/xml | /ride
POST …/invoices/{id}/electronic-document/submit
POST …/invoices/{id}/electronic-document/check-authorization
```

`ready` is **derived** client-side; the stepper's highest lit node is taken
**only** from the persisted electronic status. See `integration-plan.md`.

## Guardrails honored

Document (internal) vs SRI (legal) condition always distinct · **never implies
SRI authorization before the backend confirms** (submitted stops at "Enviado") ·
dense controls hidden by default · fallback XML bridge reads as advanced /
secondary · technical trace is quiet evidence, not the workflow · submit disabled
when readiness is blocked or the document path is unsupported · tone profesional,
calmado, es-EC, suggestion-first · no marketing hero · no vanity content.

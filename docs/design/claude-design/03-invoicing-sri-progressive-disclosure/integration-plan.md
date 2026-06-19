# SRI Control Area — Integration Plan (for Codex)

Target app: `apps/web-platform` (React + TypeScript + Vite). This slice is a
**design refinement**, not a new surface. Land it under
`docs/design/claude-design/03-invoicing-sri-progressive-disclosure/` for review,
then refactor the existing panel toward it incrementally. Do **not** paste the
prototype into app source.

## 0. What you are refining (not replacing)

The exact files this redesigns already exist:

- `apps/web-platform/src/features/invoicing/workspace-electronic.tsx`
  - `InvoicingElectronicStatusPanel` → becomes `SRIControlPanel`
  - `InvoicingTechnicalTracePanel`   → becomes `TechnicalTrace`

Keep the existing props/handlers (`onSubmitElectronicDocument`,
`onCheckAuthorization`, `onUpdateElectronicStatus`,
`onSubmitPresignedInvoiceElectronicDocument`, `onLoadXmlPreview`,
`canSubmitElectronicDocument`, `selectedInvoiceDocumentSupport`, …). This is a
**presentational reorganization** of the same data and the same actions — the
behavioral contract is unchanged.

## 1. Componentization order

1. `StatusTriad` — pure presentational, reads `selectedInvoiceDetail.status` +
   `.electronicStatus` + access-key readiness. Replaces the three
   `invoicingSRIOverview` cards.
2. `StageStepper` — derive the lit node **only** from `electronicStatus`
   (see §3). Replaces the implicit stage text.
3. `NextStep` — fold `primaryGuidance` / `secondaryGuidance` into one tonal cue
   that owns the existing primary action per stage; disable when
   `!canSubmitElectronicDocument`.
4. `DisclosureCard` ×2 + the "Controles avanzados" divider — reuse the existing
   `showManualControl` / `showFallbackBridge` state; keep the auto-open seeds
   (submitted/rejected → manual; staged XML / unsupported → fallback).
5. `InterventionPanel` — the existing manual-control `<form>`, restyled.
6. `FallbackPanel` — the existing presigned-XML `<form>`, restyled as secondary.
7. `TechnicalTrace` — the existing trace panel, restyled as the quiet card; keep
   the per-event `<details>` for payloads.
8. `CopyValue` — new; wrap clave de acceso + nº autorización.
9. Mobile: the bottom-sheet recomposition at the shell breakpoint.

## 2. Data — reuse what the panel already receives

No new backend. The panel already gets `selectedInvoiceDetail`,
`selectedInvoiceDocumentSupport`, `canSubmitElectronicDocument` and the field
states. Compose the readiness blocker client-side from the same
electronic-* / numbering signals the workspace already derives (slice 02's
`deriveReadiness`). Endpoints behind this surface (all exist in `openapi.json`):

```
GET  …/electronic-profile · …/electronic-document/readiness
GET  …/electronic-signature/inspection · …/electronic-submission · …/numbering/invoice
GET  …/invoices/{id}/electronic-document/xml | /ride
POST …/invoices/{id}/electronic-document/submit
POST …/invoices/{id}/electronic-document/check-authorization
```

## 3. The one guardrail that must live in code

Centralize the stage map (`ELEC`) as the single source for pill tone + stepper
position:

```ts
type Electronic = 'none'|'pending_submission'|'submitted'|'authorized'|'rejected';
// pending → Preparado · submitted → Enviado (NOT authorized) · authorized → Autorizado
// rejected → Enviado node red
```

The `StageStepper`'s highest lit node must derive **only** from the persisted
`electronicStatus`. Optimistic UI on `POST submit` may show "Enviando…", but must
**not** light *Autorizado* until `check-authorization` returns an authorized
status. Never infer authorization from a successful submit.

## 4. Disclosure defaults (context-aware)

```ts
const interveneOpen = !readiness.ready
  || detail.electronicStatus === 'submitted'
  || detail.electronicStatus === 'rejected';
const fallbackOpen = Boolean(presignedXml.trim())
  || (documentSupport && !documentSupport.submitSupported);
```

These mirror the prototype and the existing `useState` seeds — keep them.

## 5. Actions (real endpoints — unchanged)

```
POST …/electronic-document/submit               ← NextStep "Enviar al SRI" (gate on readiness.ready)
POST …/electronic-document/check-authorization  ← NextStep "Consultar autorización"
       (after submit: refetch/poll; only then transition stepper to authorized|rejected)
GET  …/electronic-document/xml | /ride           ← "Ver XML" / "Ver RIDE"
onUpdateElectronicStatus                         ← InterventionPanel submit
onSubmitPresignedInvoiceElectronicDocument       ← FallbackPanel "Enviar XML prefirmado"
```

Gate `submit` behind `canSubmitElectronicDocument`. On `rejected`, surface the
SRI `code` / `field` / message verbatim plus the "corregir y regenerar" path.

## 6. Unsupported document path

When `selectedInvoiceDocumentSupport?.submitSupported === false`: render the
compatibility `Banner`, disable the primary submit, and surface the fallback card
open (it may be the only available route for that document type). Do **not** hide
the difference — the operator must see *why* the normal path is unavailable.

## 7. CopyValue

`navigator.clipboard.writeText` with a transient confirmation. Pure client; no
backend. Guard for `navigator.clipboard` being undefined (insecure contexts).

## 8. Responsiveness

- Desktop: the SRI panel is a single focused column (`max-width ~860px`) inside
  the invoice detail route. Disclosure panels expand in place.
- Mobile: bottom-sheet recomposition (intervention · fallback as `Sheet`s, trace
  inline) at the shell's existing breakpoint — a different layout, not a
  reflowed desktop grid.

## 9. Guardrails to preserve in code

- Document (internal) vs SRI (legal) condition stay visually distinct (the triad).
- **Never imply SRI authorization before the backend confirms** (see §3).
- Signature inspection + blockers shown *before* submit; submit/generate disabled
  when readiness is blocked or the document path is unsupported.
- Fallback XML bridge stays visually secondary (dashed / sunken / "Avanzado");
  never a `primary` button.
- Technical trace stays quiet evidence (separate card, no shadow, collapsed).
- AI copy stays suggestion / approval — never "envió" / "autorizó por ti".
- Labels EN, body/state copy es-EC. Mono + tabular for money / RUC / clave / nº.
- No invented endpoints — everything above exists in `openapi.json`.

## 10. Review checklist (from `docs/design/README.md`)

Endpoints only from `openapi.json` · desktop + mobile · moods affect
cards/controls/feedback · loading/empty/error states · tenant/permission context
preserved (reused shell) · AI/tax guardrails visible · mock JSON replaceable by
API calls · components reusable · disclosure defaults derived, not hard-coded.

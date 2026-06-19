# Invoicing SRI Submission Lifecycle — Slice 09

The Ecuador SRI lifecycle surface that sits after document review and before the
user treats an invoice as legally authorized. It answers:

> "What is the exact next safe step with the SRI, and what does the current
> electronic status legally mean?"

Refinement of the real extracted components
`apps/web-platform/src/features/invoicing/workspace-electronic.tsx`
(`InvoicingElectronicStatusPanel` + `InvoicingTechnicalTracePanel`), driven by
`docs/frontend-handoff/09-invoicing-sri-submission-lifecycle.md`. It follows
slices 06 / 07 / 08 and reuses the Platform Shell chrome, tokens and SRI
vocabulary.

> **Reconciled to the frozen contract.** Every field, enum and action maps 1:1 to
> the real types/handlers: `InvoiceDetailResponse` (incl. `electronicEvents` +
> `sriDiagnostics`), `ElectronicSandboxReadinessResponse.documentSupport`, and the
> existing handlers (`onLoadXmlPreview`, `onSubmitElectronicDocument`,
> `onSubmitPresignedInvoiceElectronicDocument`, `onCheckAuthorization`,
> `onUpdateElectronicStatus`, the `onInvoice*` / `onPresignedInvoice*` field
> setters). No endpoints, fields or behaviors invented.

`index.html` is an **interactive viewer**: switch **device** (desktop / mobile),
**state** (17 explicit states) and **design mood** (comfort / focus / calm /
high-contrast / night). Selection persists in `localStorage`.

## The critical guardrail — "Enviado" ≠ "Autorizado"

The single most important rule, enforced structurally (not just in copy):

- `electronicStatus === 'submitted'` means the SRI **received / is processing**
  the comprobante. The verdict reads "Enviado al SRI" with the explicit legal
  note *"Enviado NO significa autorizado — la validez legal llega solo con la
  autorización."* The recommended next step is **Consultar autorización**, never
  a success treatment.
- Only `electronicStatus === 'authorized'` (backend-confirmed) shows the green
  "Autorizado por el SRI" verdict, the authorized stepper node, and the
  authorization-number evidence as legally valid.
- The lifecycle stepper marks step 3 (Autorizado) complete **only** for
  `authorized`; `submitted` sits at step 2 "en curso"; `rejected` turns step 2
  into a red "Devuelto" node.

## Recommended hierarchy (handoff)

```
1  Legal verdict header     what the current status means legally
2  Lifecycle stepper        Preparado → Enviado al SRI → Autorizado
3  One recommended next step single primary action for the current state
4  Compact evidence         clave de acceso · No. autorización · enviado (copy-friendly)
5  Blocker / SRI message     readiness blocker or the returned SRI observation
6  Advanced: intervención manual   (disclosure, collapsed)
7  Advanced: fallback XML prefirmado (disclosure, collapsed)
8  Quiet technical trace      historial técnico (events + sriDiagnostics)
```

The primary lane uses only: view XML preview · sign & submit · check
authorization · copy access key / authorization number. Manual reconciliation,
presigned XML fallback and the technical trace are **secondary/advanced** and
stay collapsed until explicitly opened.

## One recommended action per state

The next-step cue mirrors the repo's `buildNextStep`: exactly one primary action
keyed to the state.

| State | Verdict | Recommended primary action |
|---|---|---|
| invoice still draft | Borrador | Ir a revisión del documento (emit first) |
| readiness blocked | Bloqueado | Revisar intervención (resolve firma/gateway) |
| unsupported document type | Compatibilidad | Ver fallback técnico |
| ready to submit | Listo para enviar | **Firmar y enviar al SRI** |
| submitted / pending | En seguimiento | **Consultar autorización** |
| authorized | Autorizado | Ver XML autorizado |
| rejected / returned | Rechazado | Revisar observación |

## States covered (17)

`no_invoice` · `loading` · `invoice_draft` · `readiness_blocked` ·
`unsupported_type` · `ready_to_submit` · `submitting` · `submitted_pending` ·
`checking_authorization` · `authorized` · `rejected` (with SRI message) ·
`xml_preview` (preliminary XML loaded) · `manual_open` (reconciliation) ·
`fallback_open` (presigned XML) · `trace_expanded` (technical events) ·
`permission_limited` (read-only) · `backend_unavailable`. Access key /
authorization number / submitted-at appear as evidence wherever the data is
present.

## Mobile (purpose-built)

Not a shrunk desktop: top legal-status verdict (tone-tinted), lifecycle stepper
fitting without horizontal scroll, **one thumb-friendly primary action pinned at
the bottom**, evidence as copy-friendly rows, and manual / fallback / trace each
behind a focused bottom sheet. SRI messages render readable, not as raw payloads.

## Files

```
index.html              Interactive viewer (loads everything below)
src/
  data.js               window.LIFECYCLE_DATA — shell context + 17 scenarios, contract-shaped
  icons.jsx             window.Icon — Lucide-geometry icons (+ send/refreshCw/wrench/gitBranch/clockHistory)
  components.jsx        window.UI — shared shell primitives (reused from slices 00/02/05–08)
  chrome.jsx            window.Chrome — Sidebar, TopBar, mobile frame, bottom sheets
  lifecycle-panel.jsx   window.Lifecycle — desktop: VerdictHeader, Stepper, NextStep, Evidence, SriMessage, ManualPanel, FallbackPanel, TracePanel + deriveNextStep
  lifecycle-mobile.jsx  window.MobileLifecycle — one-handed lifecycle + manual/fallback/trace sheets
  app.jsx               Viewer chrome + device/state/mood orchestration
mock-data/              JSON fixtures mapped to the real contracts (see _type/_endpoint)
notes.md                Design rationale · the guardrail · hierarchy · a11y
components.md           The reusable components this slice introduces
integration-plan.md     Handler mapping (primary/secondary/advanced/read-only) + no-backend integration
README.md               This file
```

## Endpoints (source of truth: `docs/api/openapi.json`)

This slice **invents no endpoints**. It uses only:

```
GET  /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/xml             fetchInvoiceElectronicXmlPreview()
POST /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/submit            submitInvoiceElectronicDocument()
POST /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/submit-presigned  submitPresignedInvoiceElectronicDocument()
POST /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/check-authorization checkInvoiceElectronicAuthorization()
POST /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-status                      updateInvoiceElectronicStatus()
```

No regenerate / re-sign / certify / legalize / accounting / filing / payment /
automatic tax declaration behavior.

## Guardrails honored

"submitted" never reads as authorized · authorized verdict/evidence only when the
backend confirms `authorized` · one primary action at a time · XML preview kept
separate from submission and authorization · the fallback path and manual
reconciliation are clearly secondary/advanced, never the main path · the UI never
implies it can certify/legalize/regenerate without a real endpoint · no
accountant-replacement or auto-filing language · tone calmado, legal, es-EC.

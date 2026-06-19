# Slice 09 — integration plan (React + TypeScript + Vite)

How Codex folds this design into the real `InvoicingElectronicStatusPanel` +
`InvoicingTechnicalTracePanel` in
`apps/web-platform/src/features/invoicing/workspace-electronic.tsx`. This is a
**presentation refactor inside the existing component boundary** — not a
prototype paste and not a backend change. The backend is frozen; invent nothing.

## 0 · Scope

Both panels already receive every prop and handler this design needs (see the
component signature). Keep all of them. This slice only restructures hierarchy,
language, mobile behavior and progressive disclosure. Do not move the customer,
items or document-review flows; do not redesign the workspace.

## 1 · Endpoints (unchanged — source of truth `docs/api/openapi.json`)

```
GET  …/invoices/{invoiceId}/electronic-document/xml              fetchInvoiceElectronicXmlPreview()
POST …/invoices/{invoiceId}/electronic-document/submit            submitInvoiceElectronicDocument()
POST …/invoices/{invoiceId}/electronic-document/submit-presigned  submitPresignedInvoiceElectronicDocument()
POST …/invoices/{invoiceId}/electronic-document/check-authorization checkInvoiceElectronicAuthorization()
POST …/invoices/{invoiceId}/electronic-status                     updateInvoiceElectronicStatus()
```

No regenerate / re-sign / certify / legalize / accounting / filing / payment /
auto-declaration endpoints.

## 2 · ⭐ Action → handler mapping (primary / secondary / advanced / read-only)

Every action in the design maps to an **existing** handler. Tier tells Codex
where it belongs in the refactor.

| Design action | Handler (existing) | Tier |
|---|---|---|
| Firmar y enviar al SRI | `onSubmitElectronicDocument` | **PRIMARY** (only when ready_to_submit) |
| Consultar autorización | `onCheckAuthorization` | **PRIMARY** (only when submitted) |
| Ver XML preliminar / autorizado | `onLoadXmlPreview` | **SECONDARY** (beside primary; kept separate from submit/auth) |
| Copiar clave de acceso | (client clipboard of `selectedInvoiceDetail.accessKey`) | SECONDARY / read-only evidence |
| Copiar No. autorización | (client clipboard of `authorizationNumber`) | SECONDARY / read-only (authorized only) |
| Actualizar estado electrónico | `onUpdateElectronicStatus` | **ADVANCED** (manual reconciliation disclosure) |
| Estado / clave / No. / fecha / mensaje fields | `onInvoiceElectronicStatusChange`, `onInvoiceAccessKeyChange`, `onInvoiceAuthorizationNumberChange`, `onInvoiceAuthorizedAtChange`, `onInvoiceElectronicStatusMessageChange` | **ADVANCED** (manual form inputs) |
| Enviar XML prefirmado | `onSubmitPresignedInvoiceElectronicDocument` | **ADVANCED** (presigned fallback disclosure) |
| Signer name / Signed XML fields | `onPresignedInvoiceSignerNameChange`, `onPresignedInvoiceXmlChange` | **ADVANCED** (fallback inputs) |
| Firmar y enviar (stub) / Consultar (stub) inside fallback | `onSubmitElectronicDocument` / `onCheckAuthorization` | ADVANCED (same handlers, fallback context) |
| Historial técnico (events, payloads, diagnostics) | render `selectedInvoiceDetail.electronicEvents` via `formatDate` | **READ-ONLY** (quiet trace) |

The recommended next step is computed by the existing `buildNextStep` — keep it,
and render its `primaryAction` / `secondaryAction` as the single dominant CTA pair
in block 3. The prototype's `deriveNextStep` is a faithful mirror; don't fork the
logic, reuse the component's.

## 3 · ⭐ The critical guardrail (repeat in code review)

**"submitted" is not "authorized".** Enforce in three places, none derived from
each other:

```ts
const isAuthorized = selectedInvoiceDetail.electronicStatus === 'authorized';
// verdict header tone/label/legal-line, stepper "Autorizado" node completion,
// and authorization-number evidence are ALL gated on isAuthorized — never on
// 'submitted', never on the presence of an access key or a submittedAt.
```

`submitted` → "Enviado al SRI" + explicit "no significa autorizado" + recommend
`onCheckAuthorization`. Authorization number stays "Disponible al autorizar"
until `authorized`. The access key may render earlier (it's derivable) but never
as proof of authorization.

## 4 · State → real conditions

Map the 17 viewer states onto the panel's real inputs (not new backend states):

- `no_invoice` ← no `selectedInvoiceDetail`
- `loading` ← detail query loading
- `invoice_draft` ← `selectedInvoiceDetail.status === 'draft'`
- `readiness_blocked` ← `!canSubmitElectronicDocument`
- `unsupported_type` ← `selectedInvoiceDocumentSupport && !submitSupported`
- `ready_to_submit` ← `electronicStatus === 'pending_submission'` && can submit
- `submitting` / `checking_authorization` / `submitting presigned` / `manual update` ← `actionLoading` value
- `submitted_pending` ← `electronicStatus === 'submitted'`
- `authorized` / `rejected` ← `electronicStatus`
- `xml_preview` ← XML preview loaded into local state
- `manual_open` / `fallback_open` ← `showManualControl` / `showFallbackBridge`
  (keep the component's auto-open defaults: manual for submitted/rejected,
  fallback for unsupported / presigned-present)
- `trace_expanded` ← `InvoicingTechnicalTracePanel` local `showTrace`
- `permission_limited` ← gate the mutating handlers behind `invoicing.manage`
- `backend_unavailable` ← detail query error boundary (preserve shell + retry)

## 5 · How to integrate without touching backend

1. Keep both component signatures and all props/handlers byte-for-byte.
2. Replace the JSX **structure** with the hierarchy in `README.md` §"hierarchy":
   verdict → stepper → single next step → evidence → SRI message → manual
   disclosure → fallback disclosure → trace. Move the existing forms inside the
   two advanced disclosures unchanged.
3. Reuse `buildNextStep`, `SRIStageStepper`, `StatusTriad`→(fold into evidence),
   `CopyValueCard`, and the trace renderer; restyle with design-system tokens
   only (no hard-coded color) so the five moods work. Verify in high-contrast and
   night.
4. Keep every disabled rule exactly: submit/manual/presigned disabled on
   `status === 'draft'`, `!canSubmitElectronicDocument`, matching `actionLoading`,
   and (presigned) empty `presignedInvoiceXml`; check-authorization only while
   `electronicStatus === 'submitted'`.
5. Do not add a "regenerate", "re-sign", "certify", "file" or "pay" control — none
   has an endpoint. The only writes are the five mapped handlers.

## 6 · Icons

Inline `window.Icon` maps to `lucide-react`: `Send`, `RefreshCw`, `Wrench`,
`GitBranch`, `History`/`ClockHistory`, `ShieldCheck`, `Ban`, `ScanLine`,
`FileCode2`, `Lock`, `Copy`, `AlertTriangle`, `ArrowRight`, `Check`. Swap at
import.

## 7 · Out of scope (do not build here)

- No SRI behavior beyond the five endpoints; no auto-declaration / filing.
- Manual reconciliation and presigned fallback stay advanced/secondary — never
  the main path, never framed as daily operation.
- XML preview stays separate from submission and authorization.
- No accountant-replacement language. Email delivery, payments and accounting
  handoff are later slices this one only prepares for.

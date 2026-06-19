# Invoicing Document Review — Slice 08

The **review desk** that sits after customer, draft and invoice items, and
**before** any XML/RIDE/SRI lifecycle action. The operator confirms a
commercial/fiscal document looks complete, understandable and ready to preview —
without ever feeling it has been submitted to the SRI. Refinement of the real
extracted component `apps/web-platform/src/features/invoicing/workspace-documents.tsx`
(exported `InvoicingDocumentPreviewPanel`), driven by
`docs/frontend-handoff/08-invoicing-document-review.md`.

It follows `06-invoicing-customer-draft-flow` and `07-invoicing-items-flow`, and
builds on `00-platform-shell` and `02-invoicing` — same Platform Shell chrome,
tokens and SRI vocabulary. It answers one question:

> "Is this invoice complete and ready to preview as a document?"

> **Reconciled to the frozen contract.** Every field maps 1:1 to the real types
> in `apps/web-platform/src/app/types.ts` and `api.ts`: `InvoiceDocumentResponse`,
> `InvoiceRideResponse`, `InvoiceElectronicArtifactsResponse`, and the
> fetch/download functions. No endpoints, fields or behaviors invented. **Nothing
> here generates, signs, submits, authorizes, regenerates, certifies, files,
> posts to accounting or takes payment.**

`index.html` is an **interactive viewer**: switch **device** (desktop / mobile),
**state** (14 explicit states) and **design mood** (comfort / focus / calm /
high-contrast / night). Selection persists in `localStorage`.

## The core idea — "a review desk, not a submission screen"

The current panel is two stacked blocks (a document-preview block + an
electronic-RIDE block with download buttons). The handoff's risk is that the
mixed artifact/legal language makes the operator think reviewing *is* emitting.
The refinement organizes it as a calm review desk with one rhythm:

```
1  Readiness at a glance   is this document complete & ready to preview? (4 checks)
2  Identity side-by-side    Emisor  |  Comprador  (missing fiscal data flagged)
3  Numbering & context      documento · serie · secuencial · fechas · ambiente
4  Lines + totals           easy to scan, money in currency terms
5  Artifacts (rail)         Imprimible · RIDE · XML — availability ≠ authorization
```

The single loudest truth, repeated in the header, the rail and (mobile) the
readiness chip: **revisar el documento no es enviar al SRI.**

## Three truths the design protects

1. **Reviewing ≠ submitting.** No generate/sign/submit/authorize action exists on
   this surface. The only actions are *open printable*, *open RIDE*, *download
   RIDE*, *download XML* — all read-only artifact actions from the real props.
2. **RIDE can be referential or authorized.** The RIDE card never claims
   authorization on its own. "Autorizado" appears **only** when
   `ride.canBePrintedAsAuthorized === true` **and** `invoice.electronicStatus`
   is `authorized`; otherwise it reads "Referencial / pendiente — no autorizado".
3. **XML/RIDE are preview/download artifacts here.** They are presented as files
   to open/download (gated by `artifacts.canDownloadRide` / `canDownloadXml`),
   never as autonomous compliance or filing.

## What's on the screen (desktop)

- **Header** — eyebrow + the invoice number (mono) + status pill + a one-line
  intent ("revisa que el documento esté completo… antes de previsualizarlo").
- **Readiness header** — verdict strip (ready / por revisar) with the environment
  chip and the **electronic-status chip as quiet context**, over four checks
  (issuer · buyer · numbering · lines+totals) derived from the document.
- **Emisor / Comprador** cards side-by-side — fiscal identity with each missing
  field flagged honestly (RUC, matriz, identificación, dirección…).
- **Numeración y contexto** — documentCode · serie (estab-ptoEmi) · secuencial ·
  emitida · vence.
- **Líneas del documento** — readable rows (qty × unit · tax · line total); empty
  → a clear "sin líneas, vuelve a la composición".
- **Right rail** — Totales (subtotal · IVA · total), then **Artefactos**:
  printable / RIDE / XML rows with availability state, the RIDE status block
  (authorized vs. referential), the **access-key chunks** (copy-friendly), and
  the "revisar no es enviar al SRI" reassurance.

## States covered (state switcher)

| # | State | What it shows |
|---|---|---|
| 1 | `no_document` | Empty desk — "selecciona una factura para revisar". |
| 2 | `loading` | Skeletons for the desk. |
| 3 | `draft_ready` | Full document, no electronic artifacts yet (review only). |
| 4 | `missing_issuer` | Issuer RUC / matriz / ambiente flagged; readiness "por revisar". |
| 5 | `missing_buyer` | Buyer identification + address missing; flagged. |
| 6 | `no_items` | Lines empty → warning + zero totals. |
| 7 | `totals_available` | Healthy full review, pre-electronic. |
| 8 | `ride_unavailable` | Artifacts present but `canDownload*` false; RIDE not generated. |
| 9 | `ride_referential` | RIDE + XML downloadable, **not authorized** (signed/referencial). |
| 10 | `ride_authorized` | `canBePrintedAsAuthorized` + authorized → "Autorizado" + evidence. |
| 11 | `xml_available` | XML downloadable, RIDE not; XML preliminar emphasis. |
| 12 | `artifacts_unavailable` | Document fine, artifacts null → "aún no generados". |
| 13 | `permission_limited` | Read-only banner; downloads may be limited. |
| 14 | `backend_unavailable` | Chrome preserved + retry + correlationId. |

## Mobile (purpose-built)

Not a shrunk desk. Status at top (number · status · electronic chip · environment),
a readiness chip + any blocking checks, **issuer/buyer cards stacked**, numbering,
readable line rows, a **sticky totals bar** near the bottom, and **all artifact
actions grouped in a focused bottom sheet** with the access-key chunks shown
copy-friendly. Mood switching is its own sheet.

## Files

```
index.html              Interactive viewer (loads everything below)
src/
  data.js               window.REVIEW_DATA — shell context + 14 scenarios, contract-shaped
  icons.jsx             window.Icon — Lucide-geometry icons (+ printer/fileCode/externalLink/scan)
  components.jsx        window.UI — shared shell primitives (reused from slices 00/02/05/06/07)
  chrome.jsx            window.Chrome — Sidebar, TopBar, mobile frame, bottom sheets
  review-panel.jsx      window.Review — desktop desk: ReadinessHeader, Issuer/BuyerCard, NumberingStrip, LinesCard, ArtifactsRail
  review-mobile.jsx     window.MobileReview — one-handed review + artifacts bottom sheet
  app.jsx               Viewer chrome + device/state/mood orchestration
mock-data/              JSON fixtures mapped to the real contracts (see _type/_endpoint)
notes.md                Design rationale · the three truths · hierarchy · a11y
components.md           The reusable components this slice introduces
integration-plan.md     How Codex folds this into InvoicingDocumentPreviewPanel
README.md               This file
```

## Endpoints (source of truth: `docs/api/openapi.json`)

This slice **invents no endpoints**. It uses only the read/download surfaces the
handoff names:

```
GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/document
GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/document/html
GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/ride
GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/ride/html
GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/ride/download
GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/artifacts
GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/xml
GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/xml/download
```

No generate / sign / submit / authorize / regenerate / certify / legalize /
payment / accounting endpoints. Email notification (the paired
`InvoicingNotificationsPanel`) stays adjacent and is intentionally **not** the
main review action.

## Guardrails honored

Reviewing never implies submission · "Autorizado" only when the backend confirms
(`canBePrintedAsAuthorized` + status authorized), otherwise referencial · RIDE/XML
are preview/download artifacts gated by `canDownload*` · electronic status shown
as quiet context, never an action · missing fiscal data flagged, never blocking
the review itself · access key shown in copy-friendly chunks only when present ·
email notification stays adjacent · disabled actions stay visible and say why ·
tone profesional, calmado, es-EC.

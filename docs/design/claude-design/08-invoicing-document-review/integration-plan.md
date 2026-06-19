# Slice 08 — integration plan (React + TypeScript + Vite)

How Codex folds this design into the real `InvoicingDocumentPreviewPanel` in
`apps/web-platform/src/features/invoicing/workspace-documents.tsx`. This is a
**presentation refactor inside the existing component boundary** — not a
prototype paste and not a backend change. The backend is frozen; invent nothing.

## 0 · Scope

`InvoicingDocumentPreviewPanel` already receives everything this design needs as
props: `selectedInvoiceDocument: InvoiceDocumentResponse | null`,
`selectedInvoiceRide: InvoiceRideResponse | null`,
`selectedInvoiceArtifacts: InvoiceElectronicArtifactsResponse | null`,
`actionLoading`, the formatters (`formatBuyerIdentificationType`,
`formatElectronicDocumentLabel`, `formatElectronicStatus`, `formatMoney`,
`formatPercentage`) and the four handlers (`onOpenPrintableInvoice`,
`onOpenElectronicRide`, `onDownloadElectronicRide`, `onDownloadElectronicXml`).
Keep all of it. This slice only restructures presentation (readiness header,
side-by-side identity, numbering strip, scannable lines, the artifacts rail with
authorization separated from availability, the mobile sheet). No route, store,
query or endpoint changes. The paired `InvoicingNotificationsPanel` stays
adjacent and is not promoted into the review actions.

## 1 · Endpoints (unchanged — source of truth `docs/api/openapi.json`)

```
GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/document            fetchInvoiceDocument()
GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/document/html        fetchInvoiceDocumentHtml()   → onOpenPrintableInvoice
GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/ride         fetchInvoiceElectronicRide()
GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/ride/html     → onOpenElectronicRide
GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/ride/download  downloadInvoiceElectronicRideHtml() → onDownloadElectronicRide
GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/artifacts      fetchInvoiceElectronicArtifacts()
GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/xml            fetchInvoiceElectronicXmlPreview()
GET /api/invoicing/tenants/{slug}/invoices/{invoiceId}/electronic-document/xml/download    downloadInvoiceElectronicXmlPreview() → onDownloadElectronicXml
```

All read/download. `mock-data/*.json` mirrors each response exactly. **Do not add
generate / sign / submit / authorize / regenerate / certify / legalize / payment
/ accounting endpoints.**

## 2 · ⭐ The authorization truth rule (most important)

Never present a RIDE as authorized based on the RIDE label alone. Derive it:

```ts
const isAuthorized =
  !!selectedInvoiceRide?.ride.canBePrintedAsAuthorized &&
  selectedInvoiceDocument?.invoice.electronicStatus === 'authorized';
```

- `isAuthorized === true` → show the "Autorizado" pill, "imprimible como
  comprobante autorizado", and the authorization number/date
  (`ride.authorizationNumber`, `ride.authorizedAt`).
- otherwise → "Referencial / pendiente — no autorizado" regardless of any other
  signal. The RIDE may still be openable/downloadable (it's a preview artifact),
  but it must not read as a legal authorization.

Mirror this in the readiness header's electronic-status chip via a tone map
(authorized → success, signed/submitted → info, returned/rejected → danger, else
neutral "aún no emitido"). Use `formatElectronicStatus` for the human label.

## 3 · Availability gating

Download actions are gated by the artifacts contract, exactly as the current
component already does for XML:

```ts
disabled={actionLoading === 'download-invoice-ride' || !selectedInvoiceArtifacts?.canDownloadRide}
disabled={actionLoading === 'download-invoice-xml'  || !selectedInvoiceArtifacts?.canDownloadXml}
```

The printable-invoice action is always available from the document/html endpoint;
RIDE open is available when `selectedInvoiceRide` exists. Never render a download
the backend won't serve — show the row as "no disponible" / "aún no generado".

## 4 · Readiness is client-derived (review aid, not a flag)

The contract has no document-level "ready" boolean. Compute four checks from the
document and present them as a review aid, not a compliance verdict
(`computeReadiness` in `review-panel.jsx`):

```ts
issuer:    !!(issuer.legalName && issuer.taxId && issuer.environment)
buyer:     !!(customer.name && (customer.identification || customer.taxId))
numbering: !!(invoice.documentCode && invoice.establishmentCode &&
              invoice.emissionPointCode && invoice.sequenceNumber != null)
items:     lines.length > 0
```

Missing checks flag fields amber but do **not** block the review or the artifact
actions. Lift this to `features/invoicing/documents/readiness.ts` and unit-test
it.

## 5 · Formatters

Use the real props, not the prototype stand-ins: `formatMoney(valueInCents,
currency)` for every money figure (lines, totals, access nothing), `formatPercentage`
for tax %, `formatBuyerIdentificationType` for the buyer type label,
`formatElectronicDocumentLabel` for the document label, `formatElectronicStatus`
for the electronic-status chip. The prototype's `money`/`pct`/`fmtDate` are
placeholders for these.

## 6 · Component mapping

| Prototype (`window.Review`) | Production target |
|---|---|
| `DesktopReview` | the refactored `InvoicingDocumentPreviewPanel` return |
| `ReadinessHeader` + `computeReadiness` | `<DocumentReadinessHeader>` + `readiness.ts` |
| `IssuerCard` / `BuyerCard` | identity cards over `selectedInvoiceDocument.issuer` / `.customer` |
| `NumberingStrip` | numbering/context strip over `.invoice` |
| `LinesCard` | the line list over `.lines` (replaces the flat line cards) |
| `ArtifactsRail` + `ArtifactRow` | `<DocumentArtifactsPanel>` (totals + artifacts + authorization + access key) |
| `isAuthorized` derivation | `features/invoicing/documents/authorization.ts` (unit-tested) |
| `MobileReviewScreen` + sheet | responsive variant — sticky totals + `<BottomSheet>` artifacts |

## 7 · States

Map the 14 viewer states onto real conditions (not new backend states):

- `no_document` ← `selectedInvoiceDocument === null`
- `loading` ← document query loading
- `draft_ready` / `totals_available` ← document present, `selectedInvoiceRide` /
  `selectedInvoiceArtifacts` null
- `missing_issuer` / `missing_buyer` / `no_items` ← derived from document fields
- `ride_unavailable` ← artifacts present, `canDownloadRide === false`, no ride
- `ride_referential` ← ride present, `canBePrintedAsAuthorized === false`
- `ride_authorized` ← the `isAuthorized` derivation true
- `xml_available` ← `artifacts.canDownloadXml === true`
- `artifacts_unavailable` ← `selectedInvoiceArtifacts === null`
- `permission_limited` ← gate downloads behind the read/permission as applicable
- `backend_unavailable` ← document query error boundary (preserve shell + retry)

## 8 · Tokens, moods, icons

- All color/spacing from design-system tokens — never hard-code — so the five
  moods work for free. Verify the access-key block, authorization block and
  artifact rows in `high-contrast` and `night`.
- Inline `window.Icon` maps to `lucide-react`: `ScanLine`, `Printer`, `FileText`,
  `FileCode2`, `ExternalLink`, `Download`, `Building2`, `User`, `Hash`,
  `Package`, `Calculator`, `ShieldCheck`/`Shield`, `Lock`, `Copy`,
  `AlertTriangle`. Swap at import.

## 9 · Out of scope (do not build here)

- **No SRI submission / signing / generation / authorization / regeneration /
  certification / filing** — the surface only reads and downloads preview
  artifacts; "Autorizado" reflects backend status, never an action.
- No payments, no accounting posting.
- Email notification stays in the adjacent `InvoicingNotificationsPanel` and must
  not become the main review action.
- No redesign of the shell — reuse `00-platform-shell`. Detailed XML/RIDE preview,
  the electronic submission lifecycle, and email refinement are later slices this
  one only prepares for.

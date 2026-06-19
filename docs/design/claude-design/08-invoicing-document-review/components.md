# Slice 08 — component hierarchy

Reusable pieces this slice introduces, on top of the shared Platform Shell
primitives (`window.UI`), chrome (`window.Chrome`) and icons (`window.Icon`)
carried over from slices 00 / 02 / 05 / 06 / 07. Names map to what a developer
would extract for `InvoicingDocumentPreviewPanel`; every data reference is the
real contract from `types.ts` / `api.ts`.

## Helpers — `window.Review`

```
money(cents, currency)   → "$1,200.00"   (cents/100, es-EC grouping)   ← maps to formatMoney prop
pct(value)               → "15"          (whole-number percentage)     ← maps to formatPercentage prop
fmtDate(iso)             → "17 jun 2026"
elecMeta(status)         → { tone, label }  electronic status → quiet-context chip
STATUS_PILL              → { draft|issued|paid|void → { tone, label } }
computeReadiness(s)      → { checks:[{key,label,ok,detail}], ready, blocking } — derived from the document
```

`computeReadiness` is the client-side review verdict (no backend "ready" flag
exists): issuer identity, buyer identity, numbering, lines+totals.

## Desktop — `window.Review.DesktopReview` (`src/review-panel.jsx`)

```
DesktopReview(s)
├─ NoDocument            (when s.document === null)
├─ header                eyebrow · invoice number (mono) · status pill · intent line
├─ read-only Banner      (permission_limited)
├─ ReadinessHeader(s, r) verdict strip + environment chip + electronic-status chip + 4 checks
└─ two-column body
    ├─ left
    │   ├─ [ IssuerCard | BuyerCard ]   fiscal identity side-by-side (Fact rows, missing flagged)
    │   ├─ NumberingStrip(inv)          documento · serie · secuencial · emitida · vence
    │   └─ LinesCard(doc)               line rows (or "sin líneas" warning) + notes
    └─ ArtifactsRail(s)
        ├─ Totales                      subtotal · IVA · total (InvoiceTotals)
        ├─ Artefactos                   printable / RIDE / XML rows (ArtifactRow), availability-gated
        │    └─ authorization block     authorized vs referential + access-key chunks (CopyValue)
        └─ reassurance                  "revisar no es enviar al SRI"
```

Building blocks:

- **ReadinessHeader** `{ s, r }` — verdict (ready / por revisar), environment chip,
  the **electronic-status chip as quiet context**, and the four derived checks.
- **IssuerCard / BuyerCard** — `InvoiceDocumentResponse.issuer` / `.customer`
  rendered as `Fact` rows; each missing fiscal field flagged amber.
- **NumberingStrip** `{ inv }` — documentCode · establishment-emissionPoint ·
  sequence (padded) · issued · due.
- **LinesCard** `{ doc }` — `doc.lines` rows with qty × unit · tax · line total;
  empty-state warning; notes footer.
- **ArtifactsRail** `{ s }` — totals + the artifacts (printable always; RIDE when
  `ride`; XML when `artifacts.canDownloadXml`), the **authorization evidence**
  block (only authorized when `canBePrintedAsAuthorized && status authorized`),
  and the access-key chunks.
- **ArtifactRow** / **Fact** / **CopyValue** — small presentational primitives.

## Mobile — `window.MobileReview.MobileReviewScreen` (`src/review-mobile.jsx`)

```
MobileReviewScreen(s, mood, onMood)
├─ MobileTopBar           (Chrome)
├─ status header          number · status pill · electronic chip · environment chip
├─ scroll body            readiness chip (+ blocking checks) · Emisor card · Comprador card ·
│                         Numeración card · line rows (or "sin líneas")
├─ sticky totals bar      subtotal · IVA · total  +  "Ver artefactos" (· autorizado)
├─ BottomTabs             (Chrome)
└─ Sheet (Chrome)         "Artefactos del documento" → ArtifactsSheetBody (printable/RIDE/XML + access key) · mood → MoodMenu
```

`MFact` and `Card` are the mobile counterparts of the desktop `Fact` / card
shell. Mobile reuses every `window.Review` helper (money, dates, status,
`computeReadiness`, the authorization derivation) so the truth rules are defined
once.

## Data vocabulary (matches the contract)

```
InvoiceDocumentResponse   issuer{legalName,taxId,environment,emissionType,accountingObligated,
                          specialTaxpayerCode,rimpeTaxpayerType,matrixAddress,…},
                          customer{name,email,taxId,identificationType,identification,billingAddress},
                          invoice{number,documentCode,establishmentCode,emissionPointCode,sequenceNumber,
                          electronicStatus,accessKey,authorizationNumber,authorizedAt,status,currency,…},
                          lines[{position,description,quantity,unitPriceInCents,lineSubtotalInCents,
                          taxRateName,taxRatePercentage,lineTaxInCents,lineTotalInCents}], totals
InvoiceRideResponse       ride{documentLabel,environmentLabel,emissionTypeLabel,sequenceDisplay,
                          electronicStatusLabel,canBePrintedAsAuthorized,accessKey,accessKeyChunks[],
                          authorizationNumber,authorizedAt,authorizationMessage,additionalInfoFields[]}
InvoiceElectronicArtifactsResponse  fileBaseName,rideHtmlFileName,xmlFileName,accessKey,
                          electronicStatus,canDownloadRide,canDownloadXml
actionLoading             'open-invoice-document'|'open-invoice-ride'|'download-invoice-ride'|'download-invoice-xml'|null
authorized (derived)      ride.canBePrintedAsAuthorized === true && invoice.electronicStatus === 'authorized'
```

The 14 viewer states in `app.jsx` are presentation conditions over these — in
production they collapse into which of `selectedInvoiceDocument` /
`selectedInvoiceRide` / `selectedInvoiceArtifacts` are present (any may be
`null`), plus `actionLoading`, permission and query error.

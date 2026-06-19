# Slice 08 — design notes

Rationale, the three truths, hierarchy, mood behavior and accessibility for the
Invoicing Document Review desk. Read alongside `README.md`. All field/enum
references are the real contract (`types.ts` / `api.ts` / `workspace-documents.tsx`).

## 1 · The problem we were handed

`InvoicingDocumentPreviewPanel` is functionally correct but presents as **two
stacked blocks**: a "Document preview" block (issuer/customer/numbering detail
cards + line cards) and an "Electronic RIDE" block (status + download buttons +
access key + artifact filenames). Two risks for an Ecuador operator:

1. The artifact/legal language is interleaved with review data, so it's easy to
   feel that opening the RIDE or seeing an access key means the document has been
   *emitted/authorized*.
2. There's no "is this complete?" answer — just data — so a user can't tell at a
   glance whether the document is review-ready.

The handoff is explicit: make it feel like a **review desk** — readiness at a
glance, issuer/buyer side-by-side, numbering visible, lines/totals scannable,
**artifact availability clearly separated from legal authorization**, one primary
action at a time, careful language, and never imply SRI submission.

## 2 · The three truths the design protects

These are encoded structurally, not just in copy:

- **Reviewing ≠ submitting.** The surface exposes only read/download actions
  (`onOpenPrintableInvoice`, `onOpenElectronicRide`, `onDownloadElectronicRide`,
  `onDownloadElectronicXml`). There is no generate/sign/submit/authorize control
  anywhere. The header and rail repeat "revisar no es enviar al SRI", and `shield`
  iconography is used only for reassurance, never as a submit affordance.
- **RIDE can be referential OR authorized.** Authorization is derived strictly:
  `authorized = ride.canBePrintedAsAuthorized === true && invoice.electronicStatus
  === 'authorized'`. Only then does the rail show the green "Autorizado" pill +
  "imprimible como comprobante autorizado" + the authorization number/date.
  Otherwise the RIDE is labeled "Referencial / pendiente — no autorizado". The
  electronic-status chip in the readiness header mirrors this with a tone map
  (authorized → success, signed/submitted → info, returned → danger, else
  neutral "aún no emitido").
- **XML/RIDE are preview/download artifacts here.** They appear as files with
  names (`rideHtmlFileName`, `xmlFileName`) and open/download actions gated by
  `canDownloadRide` / `canDownloadXml`. The "después" handoff text frames signing
  + submission + authorization as a later, separate screen.

## 3 · Hierarchy — readiness → identity → context → lines → artifacts

The desk reads top to bottom in the operator's question order:

1. **Readiness at a glance.** Four derived checks (issuer identity, buyer
   identity, numbering, lines+totals) over the document, with a verdict strip.
   This is the "is it complete?" answer the raw panel lacks. It is computed
   client-side from the document fields — never a backend "ready" flag.
2. **Identity side-by-side.** Emisor and Comprador cards in two columns, each
   missing fiscal field flagged with an amber "Falta…" affordance (RUC, matriz,
   identificación, dirección). Missing data informs the review; it does not block
   it.
3. **Numbering & context.** documentCode · serie (estab-ptoEmi) · secuencial
   (padded 9) · emitida · vence — the fiscal coordinates in one quiet strip.
4. **Lines + totals.** Readable rows (qty × unit · tax name+% · line IVA · line
   total) in currency terms; totals (subtotal · IVA · total) anchor the rail.
5. **Artifacts.** A clearly separated rail: printable / RIDE / XML availability,
   the authorization evidence block, and the access-key chunks.

## 4 · Access key, copy-friendly

`ride.accessKeyChunks` is the backend's pre-split access key; we render it as a
mono code block joined with " · " plus a copy affordance, and only when chunks
exist (otherwise the key area is omitted, matching "No generada"). This keeps a
49-digit clave legible and pasteable into the SRI portal — a real operator need —
without making it the visual focus.

## 5 · Mood behavior

Every surface reads semantic tokens only, so all five moods re-theme the desk:

- **Readiness & identity cards** use `--surface` / `--border` / `--shadow-sm`;
  the verdict strip and check medallions pull `--success` / `--warning` soft
  families, re-toned per mood.
- **Artifact availability** distinguishes available (`--primary-soft` icon tile,
  active buttons) vs. unavailable (`--surface-sunken`, disabled) in every mood;
  the **authorization block** is `--success-soft` when authorized, `--info-soft`
  when referential.
- **Warnings/blockers** (missing fiscal data, no lines) use `--warning-soft` +
  `--on-warning-soft`; **access-key / technical evidence** uses `--surface-sunken`
  mono so it reads as evidence in all moods (strong borders in high-contrast,
  luminous on dark in night).
- **Navigation / chrome** carries its own per-mood personality via the shell.

The mood switcher lives in the top bar (desktop) and a bottom sheet (mobile).

## 6 · Interaction notes

- **Read-only actions only.** Buttons map to the four real handlers; loading
  states swap labels ("Abriendo…", "Descargando RIDE…", "Descargando XML…")
  from `actionLoading` ('open-invoice-document' | 'open-invoice-ride' |
  'download-invoice-ride' | 'download-invoice-xml').
- **Download gating.** RIDE/XML download buttons are disabled when
  `!artifacts.canDownloadRide` / `!artifacts.canDownloadXml`, so the UI never
  offers a file the backend won't serve.
- **Missing data is informative, not blocking.** A document with gaps still
  renders fully and is reviewable; the readiness verdict and per-field flags just
  say what to fix for a faithful preview.
- **Mobile** keeps totals in a fixed bottom bar and groups all artifact actions
  in one sheet, so the access key and downloads are one tap away without burying
  the review.

## 7 · Accessibility

- Authorization and availability are never color-only — the authorized state
  pairs a green pill with "Autorizado" text + evidence; referential pairs an info
  tone with explicit "no autorizado" text; every missing field shows an icon +
  word.
- **High-contrast** is first-class (near-black text, hairline borders, no
  shadows, doubled focus ring) — verify the access-key block and artifact rows in
  it.
- All actions are real `<button>`s with visible focus rings and text labels that
  reflect loading/disabled; the access key is selectable text with a copy button.
- Mono is reserved for identifiers and money (number, RUC, access key, file
  names, totals); everything else is Manrope.
- Hit targets: desktop controls ≥ `--control-h`; mobile sheet rows and the
  sticky "Ver artefactos" action are full-width ≥ 46px.
- Motion is restrained (180ms color/background) and respects
  `prefers-reduced-motion`.

## 8 · Tensions & decisions

- **Authorization derivation.** The single most important call: never trust the
  RIDE label alone. We AND `canBePrintedAsAuthorized` with the invoice's
  `electronicStatus` so a "RIDE available" never reads as "authorized".
- **Readiness is client-derived.** The contract has no document-level "ready"
  flag, so we compute four checks from the real fields and label the result a
  review aid — not a compliance verdict.
- **Email stays adjacent.** The paired `InvoicingNotificationsPanel` is real but
  the handoff says it must not become the main review action; we reference it as
  adjacent and keep the review desk's primary actions about *seeing* the document.
- **Artifacts separated from the document.** Putting artifacts in the rail (not
  inline with the lines) is what visually enforces "availability ≠ authorization".
- **No filing / accounting / payment.** Every forward step (signing, submission,
  authorization lifecycle, email refinement) is described as a later surface,
  never actioned here.

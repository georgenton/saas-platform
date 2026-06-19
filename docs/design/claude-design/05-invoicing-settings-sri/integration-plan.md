# Slice 05 — integration plan (React + TypeScript + Vite)

How Codex folds this design into the real
`apps/web-platform/src/features/invoicing/workspace-settings.tsx`. This is a
**presentation refactor of an existing, already-extracted component boundary** —
not a prototype paste and not a backend change. The backend is frozen; invent
nothing.

## 0 · Scope

`workspace-settings.tsx` already receives four fully-wired form prop bundles —
`issuerForm`, `numberingForm`, `signatureForm`, `submissionForm` — plus
`extractedCertificateTaxId`, `canSyncIssuerTaxId`, `actionLoading`,
`handleSyncIssuerProfileTaxIdFromSignature` and `formatDate`. Keep all of that.
This slice only restructures how those bundles are presented and prioritized
(readiness-first hierarchy, progressive disclosure, the sandbox ladder, the
grouped inspection, the 5-column matrix). No route, store, query or endpoint
changes.

## 1 · Endpoints (unchanged — source of truth `docs/api/openapi.json`)

```
GET  /api/invoicing/tenants/{slug}/electronic-profile
PUT  /api/invoicing/tenants/{slug}/electronic-profile
GET  /api/invoicing/tenants/{slug}/numbering/invoice
PUT  /api/invoicing/tenants/{slug}/numbering/invoice
GET  /api/invoicing/tenants/{slug}/electronic-signature
PUT  /api/invoicing/tenants/{slug}/electronic-signature
POST /api/invoicing/tenants/{slug}/electronic-signature/sync-tax-id
GET  /api/invoicing/tenants/{slug}/electronic-signature/inspection
GET  /api/invoicing/tenants/{slug}/electronic-submission
PUT  /api/invoicing/tenants/{slug}/electronic-submission
GET  /api/invoicing/tenants/{slug}/electronic-document/readiness
```

`mock-data/*.json` mirrors each response shape exactly (each file carries
`_type` + `_endpoint`); the field names in `src/data.js` are the real ones from
`apps/web-platform/src/app/types.ts`, so the design maps onto the existing
queries with no renaming.

## 2 · Readiness is derived, never assumed

The headline verdict, the sandbox-tier chip, the checklist and the "qué falta"
list all read **only** from `ElectronicSandboxReadinessResponse`
(`GET …/electronic-document/readiness`) — the same object the component already
renders as `SandboxReadinessCard`. Specifically:

- **tier** = highest of `isReadyForLocalStubSubmission` →
  `isReadyForPresignedRemoteSandboxSubmission` →
  `isReadyForRemoteSandboxSubmission` (mirror the component's heading switch).
- **verdict** = `ready`/`warning` if a remote tier is reached (warning when
  `warnings.length`), else `blocked` if `blockers.length`, else `incomplete`.
- **checklist** = `checks[]`; **qué falta** = `blockers[]` then `warnings[]`.
- Never infer "ready" from the four section GETs; render per-section status pills
  from each section's own fields, but the legal "can we emit?" answer comes from
  the readiness object.

If readiness is still loading while sections have resolved, show the sections
with their own status pills and a neutral verdict skeleton — never a guessed
"Listo".

## 3 · Component mapping

| Prototype (`window.Settings`) | Production target |
|---|---|
| `deriveAll` + status helpers | `features/invoicing/settings/derive.ts` (pure, unit-testable) |
| `DesktopSettings` | `InvoicingWorkspaceSettings` container (replaces the flat `<>` stack) |
| `ReadinessHeader` + `PillarTile` | `<SriReadinessHeader>` over the readiness query |
| `NextStep` | `<SriRecommendedStep>` rendering `recommendedNextStep` |
| `IssuerSection` | wraps the existing `issuerForm` (incl. the `extractedCertificateTaxId` align block + sync) |
| `NumberingSection` + `NumberSegment` | wraps `numberingForm` (`previewNumber` display) |
| `SignatureSection` + `ValidityMeter` + `InspectGroup` | wraps `signatureForm` + its `inspection` |
| `GatewaySection` + `TierRung` + `SupportMatrix` | wraps `submissionForm` + its `readiness` |
| `ReadinessRail` | `<SriReadinessRail>` (`checks` + `blockers`/`warnings`) |
| `MobileSettingsScreen` + sheets | responsive variant — entry rows + `<BottomSheet>` per section |

Each `*Section` is presentation only — drop the **existing** form inputs,
validation and `onSubmit`/`onChange` handlers inside it. The cards add hierarchy,
status, the RUC-alignment row, the assembled-number display, the validity meter,
the grouped inspection, the sandbox ladder and the support matrix; they do not
change what gets saved. Preserve `actionLoading` button states
(`upsert-issuer-profile`, `upsert-invoice-numbering`,
`upsert-electronic-signature-settings`, `upsert-electronic-submission-settings`,
`sync-issuer-profile-tax-id`).

## 4 · Status + tokens

- Extract the status maps + `deriveAll` to `settings/derive.ts` + `status.ts` as
  the single source. Signature status comes from
  `inspection.certificateValidityStatus` + `materialConfigured` + `isActive`
  (don't recompute expiry client-side when the inspection already provides it).
- All color/spacing comes from design-system tokens — never hard-code — so the
  five moods work for free. Verify in `high-contrast` and `night`.

## 5 · Permissions

Gate every mutation control behind `invoicing.settings.manage`
(the `permission_limited` state). When absent: render the read-only banner,
replace each section action with the disabled "Solo lectura" lock, and keep the
recommended CTA visible-but-disabled. `canSyncIssuerTaxId` already encodes part
of this for the sync action. Read paths stay fully available.

## 6 · Icons

The prototype's inline `window.Icon` set maps directly to `lucide-react`
(`Building2`, `Hash`, `KeyRound`, `Server`, `ShieldCheck`, `ShieldAlert`, `Ban`,
`Clock`, `FileText`, `Copy`, `RefreshCw`, `Download`, `Layers`, `Route`,
`CircleDot`, `Lock`, `Zap`, `ArrowRight`). Swap at import; geometry matches.

## 7 · Out of scope (do not build here)

- No emission / signing / authorization on this screen — those live per-invoice
  in the workspace (slices 02 / 03). Copy already states this.
- No new "auto-fix" endpoints, no checkout/product-install, no mood-persistence
  API (frontend-only for now).
- No redesign of the shell — reuse `00-platform-shell`.
- Do not collapse the three sandbox tiers into a single boolean — the
  `sandbox_blocked` experience depends on them.

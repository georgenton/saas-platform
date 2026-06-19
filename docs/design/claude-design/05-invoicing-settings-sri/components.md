# Slice 05 — component hierarchy

Reusable pieces this slice introduces, on top of the shared Platform Shell
primitives (`window.UI`), chrome (`window.Chrome`) and icons (`window.Icon`)
carried over from slices 00 / 02 / 03. Names map to the React components a
developer would extract for `workspace-settings.tsx`, and every data reference is
the real contract from `types.ts`.

## Derivations — `window.Settings` (shared by desktop + mobile)

Pure functions exported for both files (and reusable in production as
`features/invoicing/settings/derive.ts`):

```
issuerStatus(issuer)        → 'complete' | 'incomplete'   (needs legalName+taxId+matrixAddress+establishmentAddress)
numberingStatus(numbering)  → 'complete' | 'incomplete'   (needs documentCode+establishmentCode+emissionPointCode+nextSequenceNumber)
signatureStatus(signature)  → 'missing' | 'expired' | 'invalid' | 'expiring' | 'not_yet' | 'inactive' | 'usable'
                              (from materialConfigured + inspection.certificateValidityStatus + inspection.status + isActive)
gatewayStatus(submission)   → 'complete' | 'incomplete'   (needs gatewayConfigured && isActive && authorizationUrl)
deriveAll(scenario)         → { st:{issuer,numbering,signature,gateway}, tier, verdict, rec }
fmt(isoDate)                → es-EC short date
```

`tier` ∈ `remote_internal | remote_presigned | local_stub | none` (highest
`isReadyFor*` reached). `verdict` ∈ `ready | warning | incomplete | blocked`
(from tier + `blockers`/`warnings`). `rec` = the section to highlight + drive the
next-step cue.

## Desktop — `window.Settings.DesktopSettings` (`src/settings-panel.jsx`)

```
DesktopSettings(d, stateKey)
├─ page header            title · subtitle · "Guía SRI"
├─ read-only Banner       (permission_limited only)
├─ ReadinessHeader(s, derived, onJump)     ── 1 · readiness at a glance
│   ├─ verdict strip      tone-tinted · environment pill · sandbox-tier chip
│   └─ PillarTile ×4      Emisor · Numeración · Firma · Gateway (click → jump)
├─ NextStep(s, derived, canManage)         ── 2 · recommendedNextStep (verbatim)
└─ two-column body
    ├─ left
    │   ├─ IssuerSection      FieldGrid + RUC↔cert alignment row (Usar/Alinear)
    │   ├─ NumberingSection   NumberSegment ×3 (assembled previewNumber) + otherPoints
    │   ├─ SignatureSection   health strip + ValidityMeter + Disclosure→InspectGroup ×4(+refs)
    │   └─ GatewaySection     FieldGrid + endpoints + Disclosure(sandbox ladder, TierRung ×3,
    │                         last SRI feedback) + Disclosure(SupportMatrix, 5 cols)
    └─ ReadinessRail(s, derived, onJump)   ── checklist (checks[]) + "Qué falta" (blockers/warnings)
```

Shared within the panel:

- **SectionCard** `{ skey, status, highlight, action, headerExtra }` — icon-tile +
  title + status-pill header, padded body, sunken footer action; `headerExtra`
  carries the firma/gateway **ActivePill** (`isActive`). `highlight` outlines +
  elevates the recommended section.
- **Disclosure** `{ label, sub, defaultOpen, icon }` — rotate-chevron block with
  `aria-expanded`.
- **Field / FieldGrid** — definition pairs; `missing` → *Por completar*.
- **CopyValue** — mono value + copy affordance with transient check.
- **ValidityMeter** `{ status, days }` — tone-colored certificate-runway bar.
- **InspectGroup** `{ title, rows }` — labelled cluster of inspection fields
  (drops empty/`null` rows automatically).
- **TierRung** `{ on, label }` — one rung of the sandbox readiness ladder.
- **SupportMatrix** `{ support }` — comprobante × 5-column grid
  (Num · XML · RIDE · XSD · Envío) from `documentSupport[]`.
- **ManageBtn / ActivePill** — collapse to a disabled "Solo lectura" lock when
  `!canManage`; ActivePill reflects `isActive`.

## Mobile — `window.MobileSettings.MobileSettingsScreen` (`src/settings-mobile.jsx`)

```
MobileSettingsScreen(d, stateKey, mood, onMood)
├─ MobileTopBar           (Chrome)
├─ sub-header             "Configuración SRI" + environment pill
├─ readiness narrative    verdict + sandbox-tier chip
├─ recommended next step  recommendedNextStep + full-width action
├─ "qué falta" list       blockers → warnings (tap → sheet)
├─ section entry rows ×4  icon · label · status pill · chevron (tap → sheet)
├─ BottomTabs             (Chrome) — SRI tab active
└─ Sheet (Chrome)         per-section detail
    ├─ IssuerSheet · NumberingSheet · SignatureSheet (grouped inspection) ·
    │  GatewaySheet (sandbox ladder + 5-col matrix)
    └─ mood Sheet → MoodMenu
```

`MRow` and `SheetAction` are the mobile counterparts of `Field` and `ManageBtn`.
Mobile reuses the desktop derivations via `window.Settings` so status logic is
defined once.

## Status vocabulary (matches the contract)

```
section          complete | incomplete
signature        missing | expired | invalid | expiring | not_yet | inactive | usable
                 (← inspection.certificateValidityStatus: valid|expiring_soon|expired|not_yet_valid|not_applicable|unknown)
sandbox tier     remote_internal | remote_presigned | local_stub | none
verdict          ready | warning | incomplete | blocked
check status     ready | warning | blocked                      (readiness.checks[].status)
support cell     boolean × {numberingConfigured,previewAvailable,rideAvailable,schemaValidationAvailable,submitSupported}
```

The `STATUS_PILL` / tone maps are duplicated across the desktop and mobile files
intentionally (each renders standalone without the compiled bundle); the
derivation functions are **not** duplicated — they live once in `window.Settings`.
In production these become `features/invoicing/settings/status.ts` + `derive.ts`.

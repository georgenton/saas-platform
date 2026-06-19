# Invoicing Settings · SRI Preparation — Slice 05

The **premium operational-settings & readiness area** for Ecuador electronic
invoicing. This is **not** the whole invoicing workspace and **not** a new
product — it is the next design pass on the surface already extracted as a real
component boundary at
`apps/web-platform/src/features/invoicing/workspace-settings.tsx`, driven by
`docs/frontend-handoff/05-invoicing-settings-sri.md`.

It builds on `00-platform-shell`, `02-invoicing` and
`03-invoicing-sri-progressive-disclosure` — same Platform Shell chrome, same
tokens, same SRI vocabulary — and turns a four-form stack into a guided,
trustworthy surface that answers the four operator questions the handoff names:

1. **who is issuing** → Perfil del emisor
2. **how numbering is assigned** → Numeración
3. **whether the electronic signature is usable** → Firma electrónica
4. **whether the tenant is really ready to talk to the SRI** → Gateway SRI + sandbox readiness

> **Reconciled to the frozen contract.** Every field, enum and derived status in
> this slice maps 1:1 to the real types in `apps/web-platform/src/app/types.ts`
> and the props of `workspace-settings.tsx` — `IssuerProfileResponse`,
> `InvoiceNumberingSettingsResponse`, `ElectronicSignatureSettingsResponse`,
> `ElectronicSignatureMaterialInspectionResponse`,
> `ElectronicSubmissionSettingsResponse`, `ElectronicSandboxReadinessResponse`.
> No endpoints, fields or automations are invented.

`index.html` is an **interactive viewer**: switch **device** (desktop / mobile),
**state** (9 explicit states + loading + backend error) and **design mood**
(comfort / focus / calm / high-contrast / night) from the top control strip.
Selection persists in `localStorage`.

## The core idea — "readiness is the spine, not a form stack"

The handoff's named risk is a *giant wall of equal-weight fields*. The refinement
imposes a strict, **decreasing-urgency** hierarchy so the operator's eye always
lands on the one thing that matters now:

```
1  Readiness at a glance     verdict + sandbox tier + four-pillar status   (header)
2  Recommended next action    recommendedNextStep · the one loud thing      (NextStep)
3  Most important area         the recommended section is outlined/elevated  (highlight)
4  Deeper evidence on demand   inspection · endpoints · matrix collapsed     (disclosure)
```

Only **one** thing is ever loud: the recommended next-step button. The four
sections sit calm and equal below it; their technical evidence (certificate
inspection, SOAP endpoints, the sandbox ladder, the support matrix, secondary
emission points) is collapsed by default and revealed with a rotate-chevron.

## Readiness is derived, with the real ladder

The readiness verdict is **derived** from `ElectronicSandboxReadinessResponse`,
never assumed — exactly as the backend models it. The three boolean tiers are
surfaced as a literal ladder and the header verdict is computed from them:

```
isReadyForLocalStubSubmission          → Validación local con stub
isReadyForPresignedRemoteSandboxSubmission → Sandbox remoto con XML prefirmado
isReadyForRemoteSandboxSubmission      → Sandbox remoto con firma interna   (top tier)
```

The header shows the **highest tier reached** as a chip, plus a verdict
(Listo / Listo con advertencia / Falta configurar / Emisión bloqueada) computed
from the tiers + `blockers` / `warnings`. The `checks[]` array feeds a readiness
checklist; `blockers[]` / `warnings[]` (real strings) feed the "Qué falta" rail.

## What's on the screen (desktop)

- **Page header** — `Configuración electrónica`, operational subtitle, a quiet
  "Guía SRI" link. No marketing hero.
- **Readiness header** — a verdict strip (tone-tinted, left-rail accent) with the
  environment pill **and the sandbox-tier chip**, over a four-pillar status row
  (Emisor · Numeración · Firma · Gateway), each clickable to scroll to its
  section.
- **Next step** — one tonal cue: eyebrow + derived title + `recommendedNextStep`
  (verbatim from the contract) + one contextual primary action. Disabled with a
  lock under permission limits.
- **Two-column body** — the four **section cards** (left) and a sticky right rail
  with a **readiness checklist** (`checks[]`) and a **"Qué falta"** list
  (`blockers[]` → `warnings[]`).

### The four sections (real fields)

1. **Perfil del emisor** — `legalName`, `commercialName`, `taxId`, `environment`,
   `specialTaxpayerCode`, `rimpeTaxpayerType`, `accountingObligated`,
   `emissionType`, `matrixAddress`, `establishmentAddress` (the last two are the
   submit-blocking required fields, flagged *Por completar* when empty). A
   reassuring **RUC↔certificate alignment** row reads `taxIdMatchesCertificate`
   against `extractedCertificateTaxId` and, on mismatch, offers the real
   *Usar RUC del certificado* / *Alinear y guardar* (sync-tax-id) actions.
2. **Numeración** — `documentCode` (CodDoc) · `establishmentCode` (Estab) ·
   `emissionPointCode` (PtoEmi) · `nextSequenceNumber`, rendered as the
   **assembled `previewNumber`** in three labelled segments so the relationship
   is self-evident. "Próxima factura sugerida: 001-001-000000148" mirrors the
   component's copy. Other comprobante types sit behind a disclosure.
3. **Firma electrónica** — the strongest design. `provider`
   (`stub_local`/`xades_pkcs12`), `storageMode`, `certificateLabel`,
   `subjectName`, `isActive`, `materialConfigured`. A **health strip** derives the
   status pill from `inspection.certificateValidityStatus`
   (valid → Vigente, expiring_soon → Por vencer, expired → Caducada) and shows a
   **validity meter** + `daysUntilExpiry`. The PKCS#12 **inspection** is grouped
   into four clusters — Identidad · Emisión · Validez · Prueba criptográfica —
   straight from `ElectronicSignatureMaterialInspectionResponse`
   (`extractedSubjectName`, `extractedTaxId`, `extractedIssuerName`, `probeMethod`,
   `encoding`, `cryptographicProofStatus`, `extractedFingerprint`, …) plus the
   `secret_ref` material refs when `provider === 'xades_pkcs12'`.
4. **Gateway SRI** (`electronic-submission`) — `provider`
   (`stub_sri`/`sri_offline_ws`), `environment`, `transmissionMode`
   (`sync_stub`/`offline`), `timeoutMs`, `receptionUrl`, `authorizationUrl`,
   `credentialsSecretRef`, `isActive`. Below: the **sandbox ladder** (three rungs),
   the **last remote SRI feedback**, and the **document-support matrix** with the
   real five columns — Numeración · XML · RIDE · XSD · Envío — per comprobante
   (`01`/`04`/`05`/`06`/`07`).

## States covered (state switcher)

| State | What it shows |
|---|---|
| `ready` | All four green, remote-internal sandbox tier. Verdict *Listo*; next step = ir a facturas. |
| `issuer_incomplete` | `matrixAddress` + `establishmentAddress` empty; issuer outlined; remote tier lost. |
| `numbering_incomplete` | No PtoEmi/secuencial; dashed segments; Factura row loses submit support. |
| `signature_missing` | `materialConfigured:false`, inspection `not_configured`; highest blocker. |
| `signature_expiring` | `certificateValidityStatus:'expiring_soon'`, 21 days; warning; renovación. |
| `signature_expired` | `'expired'`, cert no longer valid; remote tier blocked; renovar firma (danger). |
| `gateway_incomplete` | `gatewayConfigured:false`, no `authorizationUrl`, `isActive:false`; submit blocked. |
| `sandbox_blocked` | All sections complete but offline-compat failed + SRI returned `taxpayer_not_registered`; **local stub ready, remote blocked**. |
| `permission_limited` | Operator role; read-only banner; every action becomes a disabled lock. |

Plus `loading` (skeletons) and `backend-unavailable` (chrome preserved + retry).

## Mobile

Not a shrunk desktop. A focused, scrollable screen behind the shell top bar: a
sub-header (`Configuración SRI` + environment pill), a **stacked readiness
narrative** with the sandbox-tier chip, the `recommendedNextStep` as a
full-width button, the **"qué falta"** list, then the four sections as **compact
entry-point rows** (icon · label · status pill · chevron). Tapping a row — or the
recommended action, or a blocker — opens that section's detail in a **bottom
sheet** with controlled expansion of technical evidence (the signature sheet
keeps the same grouped inspection; the gateway sheet keeps the sandbox ladder +
support matrix). Mood switching is its own bottom sheet. One-hand, action-first.

## Files

```
index.html              Interactive viewer (loads everything below)
src/
  data.js               window.SETTINGS_DATA — shell context + 9 scenarios, contract-shaped
  icons.jsx             window.Icon — Lucide-geometry icons (reused from slice 03)
  components.jsx        window.UI — shared shell primitives (reused from slices 00/02/03)
  chrome.jsx            window.Chrome — Sidebar, TopBar, mobile frame, bottom sheets
  settings-panel.jsx    window.Settings — desktop sections + derivations (deriveAll, status helpers)
  settings-mobile.jsx   window.MobileSettings — one-hand screen + per-section bottom sheets
  app.jsx               Viewer chrome + device/state/mood orchestration
mock-data/              JSON fixtures, one per endpoint (real response shapes; see _type/_endpoint)
notes.md                Design rationale · hierarchy · guardrails · tensions · a11y
components.md           The reusable components this slice introduces
integration-plan.md     How Codex folds this into workspace-settings.tsx (no prototype paste)
README.md               This file
```

## Endpoints (source of truth: `docs/api/openapi.json`)

This slice **invents no endpoints**. It reads/writes exactly the surfaces
`workspace-settings.tsx` already uses:

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

`ready` and the verdict are **derived server-side** (sandbox-readiness tiers);
the client never assumes readiness. See `integration-plan.md`.

## Guardrails honored

Tenant context always visible · technical evidence available but never oppressive
(inspection / endpoints / matrix collapsed by default) · the signature area is the
strongest help, not the scariest wall · **no implied automation** — the surface
configures and explains; emission and SRI authorization happen per-invoice, not
here (copy says so) · the readiness ladder never claims a higher sandbox tier than
the backend reports · disabled actions stay visible under permission limits and
say why + what to do · tone profesional, calmado, es-EC, suggestion-first · no
marketing hero · no vanity stats.

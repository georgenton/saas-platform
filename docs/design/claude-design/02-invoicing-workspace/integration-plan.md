# Invoicing Workspace — Integration Plan (for Codex)

Target app: `apps/web-platform` (React + TypeScript + Vite). This slice is a
**design delivery** — land it under
`docs/design/claude-design/02-invoicing-workspace/` for review, then integrate
incrementally. Do **not** paste the prototype into app source wholesale.

## 0. Prerequisite — slices 00 + 01 are integrated

This builds on the Platform Shell (slice 00) and the existing Invoicing feature
foundation already extracted in
`apps/web-platform/src/features/invoicing/` (`model.ts`, `adapters.ts`,
`queries.ts`, `use-invoicing-workspace-model.ts`, `invoicing-workspace.tsx`).

That foundation already extracts the **top operational summary** (metrics +
readiness signals + next actions, client-composed). This slice is the **next UI
scope**: the full workspace around it — queue, detail panel, lifecycle stepper
and the SRI configuration panel. Treat the existing `invoicing-workspace.tsx`
summary as the seed of the new `StatusHero` + readiness ribbon, not as a
component to discard.

## 1. Routing

```
/{slug}/invoicing                 Invoicing workspace (this slice — the landing surface)
/{slug}/invoicing/invoices/{id}   deep-link to a selected invoice (drives DetailPanel)
/{slug}/invoicing/settings        Configuración electrónica SRI (the ReadinessConfig panel)
```

The workspace renders inside the existing shell `<main>`; sidebar, mood system,
tenant context and assistant from slice 00 are reused unchanged. Make the
selected-invoice and the config panel URL-addressable so the queue ⟷ detail and
the progressive-disclosure config survive refresh and deep links.

## 2. Data — reuse `queries.ts`, compose the readiness ribbon client-side

The existing `useInvoicingWorkspaceQuery` already fans out to the right
endpoints. Reuse it; this slice needs nothing new on the backend.

```ts
const { data } = useInvoicingWorkspaceQuery(token, slug, isEnabled);
// data: { customers, taxRates, invoices, invoicingReport,
//         issuerProfile, electronicSignatureMaterialInspection,
//         electronicSubmissionSettings, invoiceNumberingSettings, ... }
```

Endpoints (all already in `openapi.json` / `app/api.ts`):

```
GET /api/invoicing/tenants/{slug}/reports/summary            → portfolio metrics
GET /api/invoicing/tenants/{slug}/invoices                   → Queue
GET /api/invoicing/tenants/{slug}/invoices/{id}              → DetailPanel
GET /api/invoicing/tenants/{slug}/invoices/{id}/items        → line items (detail expand)
GET /api/invoicing/tenants/{slug}/electronic-profile         → Emisor pillar
GET /api/invoicing/tenants/{slug}/electronic-signature/inspection → Firma pillar
GET /api/invoicing/tenants/{slug}/electronic-submission      → Gateway pillar
GET /api/invoicing/tenants/{slug}/numbering/invoice          → Numeración pillar
```

## 3. Derive readiness — do NOT assume it

Mirror the prototype's `getReadiness()` as a typed selector beside the existing
`createInvoicingWorkspaceFoundationModel` adapter:

```ts
type Pillar = { key: string; label: string; value: string; sub: string;
                tone: 'success'|'warning'|'danger'|'neutral'; icon: string };
type Readiness = { ready: boolean; blockers: Blocker[]; pillars: Pillar[] };

function deriveReadiness(d: InvoicingWorkspaceQueryData): Readiness {
  const issuer    = Boolean(d.issuerProfile?.complete);
  const signature = d.electronicSignatureMaterialInspection?.status; // valid|expiring|expired|missing
  const gateway   = d.electronicSubmissionSettings;
  const numbering = d.invoiceNumberingSettings;
  // pillar tone + blockers computed from the above; ready = blockers.length === 0
}
```

`ready` and `blockers[]` are **computed from real status fields**, never
hard-coded. The generate / submit actions read `readiness.ready` to enable/disable.

## 4. Map electronic stage → UI (the lifecycle contract)

Centralize the stage map (prototype `ELEC`) as the single source for pill tone,
stepper position and artifact label:

```ts
type Electronic = 'none'|'generated'|'submitted'|'authorized'|'rejected';
// none → preview artifact · generated → signed XML · submitted → awaiting SRI
// authorized → SRI-authorized (has authorizationNumber) · rejected → returned (code/field)
```

**Guardrail in code:** the `Stepper` must derive its highest lit node *only*
from the persisted electronic status returned by the backend. Optimistic UI on
`POST submit` may show "Enviando…", but must **not** light *Autorizado* until
`check-authorization` returns an authorized status. Never infer authorization
from a successful submit.

## 5. Actions (real endpoints — these exist)

```
POST /api/invoicing/tenants/{slug}/invoices                              → Nueva factura
POST /api/invoicing/tenants/{slug}/invoices/{id}/electronic-document/submit              → Enviar al SRI
POST /api/invoicing/tenants/{slug}/invoices/{id}/electronic-document/check-authorization → Consultar autorización
GET  /api/invoicing/tenants/{slug}/invoices/{id}/electronic-document/xml | /ride         → Ver XML / RIDE
POST /api/invoicing/tenants/{slug}/invoices/{id}/payments                → add payment (payment panel, future scope)
```

Gate `submit` behind `readiness.ready`. After `submit`, poll / refetch and call
`check-authorization`; only then transition the stepper to authorized or
rejected. On rejected, surface the SRI `code` / `field` / message verbatim plus a
"corregir y regenerar" path.

## 6. Componentization order

1. `Stepper` + the `ELEC` stage map (the reusable lifecycle core).
2. `DetailPanel` (header · stepper · condition rows · `NextStep` · artifacts ·
   rejection · handoff) — keyed entirely off one invoice + readiness.
3. `Queue` + `matchFilter` + the segmented filter.
4. `StatusHero` + `deriveReadiness` + the readiness ribbon (seeded from the
   existing `invoicing-workspace.tsx` summary).
5. `ReadinessConfig` (four setting cards + blockers).
6. State branches: `loading` (skeletons), `no-issuer`, `no-invoices`,
   `readiness-blocked`, `permission-limited`, `backend-unavailable`. Reuse the
   shell's `Banner` / `StateScreen` / skeleton patterns.
7. Mobile recomposition (bottom tabs + detail sheet) at the shell breakpoint —
   a different layout, not a reflowed desktop grid.

## 7. Responsiveness

- Desktop: queue/detail as `minmax(0,1.65fr) minmax(340px,1fr)`; detail panel
  sticky. Collapse to a single column under ~1024px before switching to mobile.
- Mobile: the bottom-tab layout (Resumen · Facturas · SRI · Más) with a detail
  **bottom sheet** — switch at the shell's existing breakpoint.

## 8. Guardrails to preserve in code

- Tenant context visible on every state (reused shell top bar).
- **Never imply SRI authorization before the backend confirms** (see §4).
- Show signature inspection + blockers *before* submit; disable submit/generate
  when `readiness.ready` is false.
- Distinguish preview / generated / submitted / authorized / rejected artifacts
  in label and tone — don't collapse them.
- AI copy stays suggestion / approval — never "envió" / "autorizó por ti".
- Cross-product handoff (Accounting · Tax Compliance) stays a quiet signal, not a
  second dashboard. No automatic accounting certification or tax filing implied.
- Labels EN, body/state copy es-EC. Mono + tabular for money/RUC/keys/numbers.
- No invented endpoints — everything above exists in `openapi.json`.

## 9. Review checklist (from `docs/design/README.md`)

Endpoints only from `openapi.json` · desktop + mobile · moods affect
nav/cards/controls/feedback · loading/empty/error/permission-limited states ·
tenant/product/permission context preserved · no invented products ·
AI/tax/clinical guardrails visible · mock JSON replaceable by API calls ·
components reusable across modules · disabled/blocked products visible.

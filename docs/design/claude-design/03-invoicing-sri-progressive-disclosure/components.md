# SRI Control Area — New Components

The reusable pieces this slice introduces, on top of the slice 00/02 primitives
(`Btn`, `Pill`, `Banner`, `StateScreen`, `MoodMenu`, `AssistantPanel`) and chrome
(`Sidebar`, `TopBar`, mobile frame, `Sheet`). All read semantic mood tokens only
and carry no hard-coded color. Everything composes from one scenario object:

```
scenario = {
  invoice:   { number, customer, customerRuc, total/subtotal/iva, documentStatus,
               electronicStatus, accessKey, accessKeyReady, authorizationNumber,
               authorizedAt, rejection },
  readiness: { ready, blocker, pillars[] },
  support:   { submitSupported, label, detail },     // documentSupport
  fallbackXmlReady, presigned, lastCheckedLabel, events[]
}
```

## `SRIControlPanel`

The whole refined panel. Composes the triad → ladder → next step → advanced
disclosure in one card and owns the two disclosure-open states.

```
props: { s: scenario, stateKey }
```

Disclosure defaults are derived, not hard-coded: intervention opens when
`!readiness.ready || electronicStatus ∈ {submitted, rejected}`; fallback opens
when `fallbackXmlReady || !support.submitSupported`. **Contract to keep:** never
render more than one primary action; the fallback panel never carries a
`variant="primary"` button.

## `StatusTriad`

Three signal tiles separating **Documento** (internal) / **Estado SRI** (legal) /
**Clave de acceso** (readiness). Each = icon + label + tone dot + value + caption.
The compliance backbone; intentionally **action-free** so it reads as status, not
controls.

```
props: { s: scenario }
```

## `StageStepper`

The SRI lifecycle ladder: Preparado → Enviado al SRI → Autorizado. Derives its
highest lit node **only** from `electronicStatus`; `rejected` marks the Enviado
node red (×). The visual guarantee that we never imply authorization early. A
compact bar variant (`StepsBar`) is used on mobile.

```
props: { status: 'none'|'pending_submission'|'submitted'|'authorized'|'rejected' }
```

## `NextStep`

The single dominant cue: tonal callout with eyebrow + title (what) + paragraph
(why) + one contextual primary action + optional secondary + optional footnote.
The recommended action is contextual to the stage (Enviar → Consultar → Enviar al
cliente / Corregir) and **disabled** when readiness blocks an SRI-touching stage.
Handles the `unsupported` and `blocked` branches up front.

```
props: { s: scenario, onIntervene }
```

## `DisclosureCard`

The compact progressive-disclosure trigger: icon + title + summary + status pill
+ a rotate-chevron affordance. `advanced` switches it to the secondary treatment
(dashed border, sunken surface) used by the fallback card.

```
props: { icon, title, summary, pill, open, onToggle, advanced, openLabel, closeLabel }
```

## `InterventionPanel`

Detailed manual SRI control / reconciliation: estado · fecha · clave de acceso ·
nº de autorización · mensaje, plus the rejection block when present. Header reads
"Modo intervención"; submit is disabled while readiness is blocked. Opens in
place on desktop; a bottom `Sheet` on mobile.

## `FallbackPanel`

The external-signed-XML / sandbox bridge. **Always** subordinate: dashed border,
sunken surface, "Ruta avanzada · secundaria" eyebrow, bold "No es la ruta
principal del operador". Secondary buttons only. Surfaces a staged presigned XML
when `fallbackXmlReady`.

## `TechnicalTrace`

Quiet evidence card (no shadow, sunken header), collapsed by default. Expanded =
a `TraceEvent` timeline; each event pairs a tone pill + timestamp + message + SRI
diagnostics + a nested **Ver payloads SOAP** reveal (`requestPayload` /
`responsePayload`). Auto-expands only in the `trace` demo state.

```
props: { s: scenario, defaultOpen }
```

## `CopyValue`

One-tap copy for mono values (clave de acceso, nº de autorización). Renders the
value in IBM Plex Mono + `break-all` with a copy icon that flips to a check on
click (1.6s). The slice's signature operator microinteraction.

```
props: { value, ariaLabel }
```

## `InvoiceContext`

The slim grounding header above the panel: número · cliente · RUC · total · IVA.
Keeps the SRI panel anchored to a real document.

## Mobile-specific (`window.MobileSRI`)

`MobileSRIScreen`, `Triad` (stacked rows), `StepsBar`, `NextStep` (full-width),
`DiscloseCard` (opens sheets), `InterventionSheet`, `FallbackSheet`, `MTrace` —
compact recompositions sharing the same scenario model and `window.SRI` helpers
(`money`, `ELEC`, `toneColor`, `toneSoft`, `CopyValue`).

## Shared model (`window.SRI`)

- `ELEC` — electronic status → `{ label, tone, step }`; the single source for pill
  tone + stepper position.
- `money`, `toneColor`, `toneSoft` — formatting + tone helpers.
- `CopyValue` — exported so mobile reuses the exact copy affordance.

These are the contract surface a real React + TS implementation should mirror;
see `integration-plan.md`.

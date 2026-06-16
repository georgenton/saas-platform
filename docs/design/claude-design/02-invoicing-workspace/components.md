# Invoicing Workspace — New Components

Reusable components this slice introduces, on top of the slice 00 primitives
(`Btn`, `Pill`, `Banner`, `Avatar`, `StatusPill`, `MoodMenu`, `StateScreen`,
`AssistantPanel`) and chrome (`Sidebar`, `TopBar`, mobile frame). All read
semantic mood tokens only and carry no hard-coded color.

## `StatusHero`

The contextual "start here" leader. One icon lozenge + eyebrow + headline + one
plain-language paragraph + one primary action, with a footer row of readiness
pillars and the "Configuración SRI" toggle.

```
props: { state, readiness, onConfig, onReviewPending }
```

Its headline/tone/action switch on `state` (operating · no-issuer ·
readiness-blocked · no-invoices · permission-limited). **One** primary action
only — the loudest thing on the screen. Contract to keep: never render more than
one primary button here.

## `ReadinessRibbon` (inline in StatusHero footer) + `getReadiness()`

`getReadiness(data, state) → { ready, blockers[], pillars[], signature }`
composes the four SRI pillars (Emisor · Firma · Gateway · Numeración) from the
electronic-* / numbering surfaces and **derives** `ready`. Each pillar:
`{ key, label, value, sub, tone, icon }`. Tone drives a colored `Dot`. Reused at
three densities: ribbon (glance), mobile rows, config cards.

> Harden with backend: agree the exact fields each electronic-* endpoint returns;
> `getReadiness` tolerates nulls by emitting a warning/pending pillar.

## `Stepper`

The document lifecycle ladder: Borrador → Generado → Enviado → Autorizado.

```
props: { electronic: 'none'|'generated'|'submitted'|'authorized'|'rejected' }
```

Nodes render done (✓, success) / current (●, primary) / pending (hollow). A
`rejected` document marks the **Enviado** node red (×). The component **never**
advances past the stage the data reports — it is the visual guarantee that we
don't imply authorization early. A compact bar version (`Steps`) is used on
mobile.

## `Queue`

Light-scanning invoice list: a segmented filter (Todas · Borradores · Por
autorizar · Autorizadas · Rechazadas, each with a live count) over a 5-field
row (número mono · cliente + meta · total tabular · estado pill). Rows are
`<button>`s; the selected row gets a 3px accent rail + `--primary-soft`. Filter
logic lives in `matchFilter(inv, key)`, exported for reuse.

```
props: { invoices, selectedId, onSelect, filter, onFilter, readOnly }
```

## `DetailPanel`

The focused work panel (sticky on desktop, a bottom sheet on mobile). Composes:
header (número/cliente/RUC/total) · `Stepper` · `DetailField` rows splitting
**document condition** from **electronic condition** · `NextStep` callout ·
labeled artifact buttons (RIDE preview vs XML) · rejection block · cross-product
handoff chips when authorized.

```
props: { inv, readiness, readOnly }
```

### `NextStep`

A tonal callout (info/success/danger) with title, plain-language body and up to
two actions. The recommended action is **contextual** to the electronic stage
(Generar → Enviar → Consultar autorización → Enviar al cliente / Corregir) and is
**disabled** when `readiness.ready` is false for stages that touch the SRI.

### `DetailField`

Label–value row; `mono` switches the value to IBM Plex Mono + break-all for
access keys, authorization numbers and RUC.

## `ReadinessConfig`

Progressive-disclosure panel: four cards (Perfil del emisor · Firma electrónica ·
Envío / Gateway · Numeración) with field lists, status pill and one action each.
Blockers render as `Banner`s above the grid. Auto-opens for `no-issuer` /
`readiness-blocked`; otherwise toggled from the hero.

## Mobile-specific

`HeroMobile`, `ReadinessPills`, `MetricsMobile`, `InvoiceCard`, `DetailSheet`,
`ReadinessTab` — compact recompositions of the above for the one-hand layout,
sharing the same `getReadiness` / `money` / `ELEC` model from `window.INV`.

## Shared model (`window.INV`)

- `money(cents, currency)` — tabular Ecuador money formatting.
- `ELEC` — map of electronic stage → `{ label, tone, icon, step, artifact }`.
- `STEPS` / `FILTERS` / `matchFilter` — lifecycle + queue filtering.
- `getReadiness` — the derived readiness model (see above).

These are the contract surface a real React + TS implementation should mirror as
typed helpers; see `integration-plan.md`.

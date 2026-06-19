# Slice 06 — component hierarchy

Reusable pieces this slice introduces, on top of the shared Platform Shell
primitives (`window.UI`), chrome (`window.Chrome`) and icons (`window.Icon`)
carried over from slices 00 / 02 / 05. Names map to the React components a
developer would extract for `workspace-customer-draft-flow.tsx`, and every data
reference is the real contract from `types.ts` / `api.ts`.

## Derivations + helpers — `window.Flow`

```
deriveFlow(scenario, step) → { done:[stepKeys], current, reachable:[stepKeys] }
idType(code)               → the es-EC label/hint/placeholder for an identificationType
buyerIdLabel(customer)     → "RUC · 1791234567001" style summary line
```

`done` marks step 1 once a buyer is selected, step 2 once on/after the draft
step, step 3 once an invoice is created. `reachable` gates the stepper.

## Desktop — `window.Flow.DesktopFlow` (`src/flow-panel.jsx`)

```
DesktopFlow(s)
├─ page header            "Comprador y borrador" + subtitle + "Guía rápida"
├─ read-only Banner       (permission_limited only)
├─ Stepper(current, done, reachable, onGo)        three steps · click to navigate
└─ two-column body
    ├─ active step (left)
    │   ├─ BuyerStep        directory (BuyerCardRow ×n) + CustomerForm (empty-state first-run)
    │   ├─ IdentityStep     selected buyer fiscal confirmation (FactRow ×4) + confirm/back
    │   └─ DraftStep        invoice form  ·  disabled-no-buyer  ·  success confirmation
    └─ FlowRail(s, derived, invForm)              flow summary + draft preview + SRI reassurance
```

Building blocks in the panel:

- **StepCard** `{ icon, eyebrow, title, headerExtra, children }` — the step shell
  (icon tile + eyebrow + title + status pill header, padded body).
- **Stepper** `{ current, done, reachable, onGo }` — numbered/check medallions;
  done → green, current → primary; disabled when unreachable.
- **Input / Select / Textarea** — token-styled form controls with label, optional
  prefix icon, hint, required marker, mono mode; map directly to the customer and
  invoice form fields.
- **BuyerCardRow** `{ customer, selected, onSelect }` — selectable directory row
  (avatar · name · mono `buyerIdLabel` · type pill · radio).
- **CustomerForm** `{ s, form, set, canManage, onCreate }` — the `createCustomer`
  form: name, email, identificationType (friendly options), identification
  (type-adaptive placeholder/hint, `07` rule), billingAddress.
- **FactRow** `{ icon, label, value, mono, missing, empty }` — a labelled fact in
  the identity confirmation.
- **DraftStep** — the `createInvoice` form (customer / number+suggestion /
  currency / status / dueAt / notes), plus the locked-no-buyer and success
  variants.
- **FlowRail** — flow summary (buyer→identity→draft with done/current state), the
  "borrador a crear" preview (number · currency · status), and the permanent
  "esto no es una emisión al SRI" reassurance.

## Mobile — `window.MobileFlow.MobileFlowScreen` (`src/flow-mobile.jsx`)

```
MobileFlowScreen(s, mood, onMood)
├─ MobileTopBar           (Chrome)
├─ sub-header             title + StepPills (compact 1·2·3 with connectors)
├─ scroll body            the active step (single column)
│   ├─ buyer     empty state OR compact MBuyerRow list
│   ├─ identity  buyer summary card (MFact ×3) + teach note
│   └─ draft     stacked form  ·  locked-no-buyer  ·  success
├─ sticky footer          one thumb-friendly primary action (per step)
├─ BottomTabs             (Chrome) — Facturas tab active
└─ Sheet (Chrome)         "Nuevo comprador" → MCustomerForm  ·  mood → MoodMenu
```

`MInput` / `MSelect` / `MField` / `MFact` are the mobile counterparts of the
desktop form controls. Mobile reuses `window.Flow` derivations + `idType` /
`buyerIdLabel` so status and label logic are defined once.

## Status / enum vocabulary (matches the contract)

```
identificationType   04 RUC | 05 Cédula | 06 Pasaporte | 07 Consumidor final | 08 Exterior
invoice status        draft | issued | paid | void
actionLoading         'create-customer' | 'create-invoice' | null
flow step (UI only)   buyer | identity | draft        (a presentation concept, not a backend field)
```

The `STATES` list in `app.jsx` is the 14-state matrix the viewer switches; in
production these collapse into derived UI conditions over the real query/mutation
states (loading, empty, `actionLoading`, error, permission). The flow `step` and
the stepper are pure presentation — the backend has no notion of them.

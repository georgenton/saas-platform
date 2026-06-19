# Slice 07 — design notes

Rationale, hierarchy, guardrails, tensions and accessibility for the Invoicing
Items Flow. Read alongside `README.md`. All field/enum references are the real
contract (`types.ts` / `api.ts` / `workspace-commercial.tsx`).

## 1 · The problem we were handed

`InvoicingInvoiceItemsPanel` is functionally correct but reads as a **technical
row editor**: a stack of item cards over a flat form whose fields are literally
"Quantity", "Unit price (cents)", "Impuesto", with a muted footnote that the
backend computes line totals. For a small Ecuador operator this is intimidating
on two fronts — it asks them to *think in cents*, and it surfaces no sense of
"am I composing a real document and is it adding up?" The handoff is explicit:
make it "a guided composition lane", "totals always understandable", "no
intimidating accounting language at first glance", and express money in normal
currency terms (mapping back to cents only in integration notes).

## 2 · Hierarchy — context → lines → add → totals

The lane reads top to bottom as the operator's natural question order:

1. **Invoice context.** Which document am I working on, for whom, in what
   currency, and is it still a draft? The electronic status sits here as *quiet
   context only* — it answers "has this been emitted?" without inviting an SRI
   action that belongs to a later slice.
2. **The lines.** What's already on the invoice, in plain money terms. This is
   the "document" the operator is composing, so it comes before the form.
3. **Add a line.** One focused form with a single dominant action. The live
   **Estimado** preview turns the abstract "unit price × quantity + tax" into a
   number the operator can sanity-check before committing.
4. **Totals.** Subtotal · IVA / impuesto · Total, always visible (sticky on
   desktop rail and as a fixed bar on mobile), because "is it adding up?" should
   never require scrolling.

## 3 · Money in currency terms, cents at the boundary

The contract stores `unitPriceInCents`, `lineTotalInCents`, `lineTaxInCents`,
`totals.*InCents` — all integers in cents. The current form exposes that
directly ("Unit price (cents)", placeholder `2500`). We refuse to make the
operator think in cents:

- **Display** divides cents by 100 and formats with `es-EC` grouping → `$1,200.00`.
- **Input** "Precio unitario" is a normal currency field with a `$` prefix and a
  hint "En USD, impuestos aparte"; the operator types `120.00`.
- **At the API boundary** the human value is parsed and multiplied to integer
  cents (`Math.round(value * 100)`) and sent as `unitPriceInCents`.
  `integration-plan.md` specifies this mapping precisely (including rounding,
  comma/period handling, and validation) so the existing
  `newItemUnitPriceInCents` control keeps owning the real string.

## 4 · Preview vs. committed totals

Showing a live line total is helpful, but it must never masquerade as the
backend's authoritative figure. So:

- the preview is visually distinct (a dashed-border "Estimado de la línea" strip)
  and labeled as an estimate;
- the add button's helper text states "El total oficial lo calcula el backend al
  guardar";
- the **Totales** card carries "Totales calculados por el backend al guardar
  cada línea".

The client estimate uses the same arithmetic the backend will
(`qty × unitPriceInCents`, `+ round(sub × pct/100)`) so it matches on save, but
the design's contract with the user is "guide now, backend confirms".

## 5 · Tax impact, calm

Each item row shows its tax rate name + percentage and its line IVA inline, so
tax is *visible* without a dedicated tax column or accounting jargon. The
selector lists only `isActive` rates plus "Sin impuesto" (the `null` taxRateId).
The **no active tax rates** state is a first-class warning that still lets the
operator add a line as "Sin impuesto" — we never block composition on tax setup,
and we never give tax *advice* (which rate to pick), only the mechanics.

## 6 · Non-draft = intentionally constrained, not broken

When the invoice isn't a draft (issued/authorized/paid/void), the add-item form
is replaced by a calm explanation: the lines are fixed, and changing what's
billed is done via a credit/debit note in its own surface. This mirrors the
fiscal reality (you don't silently edit an authorized document) without faking
an edit/delete capability the backend doesn't offer here. The existing lines
stay readable; totals stay visible.

## 7 · Mood behavior

Every surface reads semantic tokens only, so all five moods re-theme the whole
lane:

- **Item rows & cards** use `--surface` / `--border` / `--shadow-sm`; **add form
  inputs** use `--border-strong` / `--control-h` with `--primary` focus borders
  and the mood's `--focus-ring-shadow`.
- **The preview strip** uses `--surface-sunken` + a dashed `--border-strong` so
  it reads as provisional in every mood; **totals** use `--text-strong` mono.
- **Empty state, warnings (no taxes), errors (create failed), disabled/read-only
  and the non-draft notice** use the status-soft families
  (`--info-soft`, `--warning-soft`, `--danger-soft` + their `--on-*`), so they
  re-tone correctly — strong in high-contrast, gentle in calm, luminous on dark
  in night.
- **Navigation / chrome** carries its own per-mood personality via the shell.

The mood switcher lives in the top bar (desktop) and a bottom sheet (mobile).

## 8 · Interaction notes

- **Live preview** recomputes as description/quantity/price/tax change; it shows
  `—` until quantity ≥ 1 and a valid non-negative price exist.
- **Add disabled rules** mirror the component: disabled unless description and
  unit price are non-empty (and a valid price), or while
  `actionLoading === 'create-invoice-item'`, or when the invoice isn't a draft,
  or without manage permission.
- **Errors** are inline danger banners above the form; the operator keeps their
  typed values.
- **Mobile** keeps totals in a fixed bottom bar and opens the add form in a
  bottom sheet, so one-handed entry never hides the running total.

## 9 · Accessibility

- All inputs are real `<label>` + control pairs with visible focus rings; the
  add button exposes its loading/disabled state in text, not just color.
- Tax and totals are never color-only — every figure is a labeled number; status
  uses pill + text.
- **High-contrast** is first-class (near-black text, hairline borders, no
  shadows, doubled focus ring) — verify the preview strip and totals in it.
- Mono is reserved for money and identifiers; everything else is Manrope.
- Hit targets: desktop controls ≥ `--control-h`; mobile inputs 46px, the sticky
  add action full-width ≥ 46px for thumb reach.
- Motion is restrained (180ms color/background) and respects
  `prefers-reduced-motion`.

## 10 · Tensions & decisions

- **Cents vs. currency.** The biggest call: we moved the cents concern entirely
  to the integration layer. Risk = a rounding/format mismatch; mitigated by a
  precise mapping spec and by using the same arithmetic for the preview.
- **Preview honesty.** A live total could be mistaken for the committed figure;
  we leaned hard on labeling + the "backend calculates" note rather than hiding
  the estimate (which operators want).
- **No edit/delete.** The handoff forbids item edit/delete here. We resisted
  adding row affordances that imply them; the non-draft state explains the
  fiscal-correct alternative (credit/debit note) instead.
- **Totals placement.** Sticky rail (desktop) / fixed bar (mobile) so "is it
  adding up?" is always answered — chosen over a totals block that scrolls away.
- **No tax advice / no SRI / no payments.** The lane composes the document and
  stops; every forward reference (review, XML/RIDE) is described as a later
  surface, never actioned here.

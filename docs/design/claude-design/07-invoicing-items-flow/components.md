# Slice 07 — component hierarchy

Reusable pieces this slice introduces, on top of the shared Platform Shell
primitives (`window.UI`), chrome (`window.Chrome`) and icons (`window.Icon`)
carried over from slices 00 / 02 / 05 / 06. Names map to what a developer would
extract for `InvoicingInvoiceItemsPanel`; every data reference is the real
contract from `types.ts` / `api.ts`.

## Money helpers — `window.Items`

```
money(cents, currency)   → "$1,200.00"   (cents/100, es-EC grouping; currency suffix if not USD)
pct(value)               → "15"          (whole-number percentage display)
priceToCents(str)        → integer cents  ("120.00"/"120,00" → 12000; null if invalid)
activeTaxRates(rates)    → rates.filter(isActive)
taxById(rates, id)       → TaxRateResponse | null
STATUS_PILL              → { draft|issued|paid|void → { tone, label } }
```

`priceToCents` is the single source of the "Precio unitario" → `unitPriceInCents`
mapping (see integration-plan.md).

## Desktop — `window.Items.DesktopItems` (`src/items-panel.jsx`)

```
DesktopItems(s)
├─ page header            "Líneas y totales" + subtitle + "Guía rápida"
├─ read-only Banner       (permission_limited only)
├─ InvoiceContext(inv)    number · status pill · buyer · currency · quiet electronic-status footer
└─ two-column body
    ├─ left
    │   ├─ ItemsCard(inv) → ItemList → ItemRow ×n   (empty state when items.length === 0)
    │   └─ AddItemForm(s, form, set)                 (or non-draft notice when status ≠ draft)
    │        ├─ Field/TextInput/SelectInput          descripción · cantidad · precio unitario · impuesto
    │        └─ live "Estimado de la línea" preview   subtotal · IVA · total (labeled estimate)
    └─ TotalsSummary(inv)  subtotal · IVA / impuesto · total (sticky) + "después de componer" handoff
```

Building blocks:

- **InvoiceContext** `{ inv }` — invoice header; electronic status rendered only
  as a quiet contextual footer, never an action.
- **ItemsCard / ItemList / ItemRow** — the composed lines; `ItemRow` shows
  position · description · `quantity × unitPrice` · tax name+% · line IVA · bold
  `lineTotalInCents`. Empty list → composition empty state.
- **AddItemForm** `{ s, form, set, canManage, onCreate }` — the `createInvoiceItem`
  form with the labeled client preview; collapses to a calm credit/debit-note
  explanation when `inv.status !== 'draft'`. Honors the exact disabled rules.
- **Field / TextInput / SelectInput** — token-styled controls; `TextInput`
  supports a `$` prefix and mono mode for the price.
- **TotalsSummary** `{ inv }` — backend-owned `InvoiceTotals` (subtotal / tax /
  total) + the "totals computed by backend" note + the forward-handoff card.

## Mobile — `window.MobileItems.MobileItemsScreen` (`src/items-mobile.jsx`)

```
MobileItemsScreen(s, mood, onMood)
├─ MobileTopBar            (Chrome)
├─ compact invoice context number · status · buyer · currency
├─ scroll body             "N líneas" + ItemRow list (or composition empty state)
├─ sticky totals bar       subtotal · IVA · total  +  thumb "Agregar línea"  (or disabled notice)
├─ BottomTabs              (Chrome)
└─ Sheet (Chrome)          "Agregar línea" → AddItemSheetBody (same labeled estimate) · mood → MoodMenu
```

`MField` / `MInput` / `MSelectInput` are the mobile counterparts of the desktop
controls. Mobile reuses every `window.Items` helper so money formatting, the
cents mapping and status logic are defined once.

## Data vocabulary (matches the contract)

```
InvoiceDetailResponse   id, number, status, currency, buyerName, buyerIdentification(Type),
                        electronicStatus (quiet context), items[], totals, settlement
InvoiceItemResponse     position, description, quantity, unitPriceInCents,
                        lineTotalInCents, taxRateId, taxRateName, taxRatePercentage, lineTaxInCents
TaxRateResponse         id, name, percentage (whole number), isActive
InvoiceTotals           subtotalInCents, taxInCents, totalInCents      (backend-owned)
createInvoiceItem body  { description, quantity, unitPriceInCents, taxRateId? }
actionLoading           'create-invoice-item' | null
invoice status          draft | issued | paid | void
```

The 11 viewer states in `app.jsx` are presentation conditions over these — in
production they collapse into the panel's real query/mutation states (loading,
empty, `actionLoading`, error, no active taxes, non-draft, permission, backend
error). The "flow" has no backend step concept; it's pure presentation.

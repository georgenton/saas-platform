# Slice 07 — integration plan (React + TypeScript + Vite)

How Codex folds this design into the real `InvoicingInvoiceItemsPanel` in
`apps/web-platform/src/features/invoicing/workspace-commercial.tsx`. This is a
**presentation refactor inside the existing component boundary** — not a
prototype paste and not a backend change. The backend is frozen; invent nothing.

## 0 · Scope

`InvoicingInvoiceItemsPanel` already receives everything this design needs as
props: `selectedInvoiceDetail: InvoiceDetailResponse`, `taxRates:
TaxRateResponse[]`, `actionLoading`, `formatMoney(valueInCents, currency)`,
`formatPercentage(value)`, the four `newItem*` form values
(`newItemDescription`, `newItemQuantity`, `newItemUnitPriceInCents`,
`newItemTaxRateId`), their `on*Change` handlers, and `onCreateInvoiceItem`. Keep
all of it. This slice only restructures presentation (context → lines → add →
totals, the labeled preview, the empty/constrained/error states, the mobile
sheet + sticky totals). No route, store, query or endpoint changes; data
ownership stays in the parent.

## 1 · Endpoints (unchanged — source of truth `docs/api/openapi.json`)

```
GET  /api/invoicing/tenants/{slug}/invoices/{invoiceId}          selectedInvoiceDetail
GET  /api/invoicing/tenants/{slug}/invoices/{invoiceId}/items    items (already in the detail)
POST /api/invoicing/tenants/{slug}/invoices/{invoiceId}/items    createInvoiceItem()
GET  /api/invoicing/tenants/{slug}/taxes                         taxRates
```

`createInvoiceItem` body (from `api.ts`):

```ts
createInvoiceItem(token, tenantSlug, invoiceId, body: {
  description: string;
  quantity: number;
  unitPriceInCents: number;
  taxRateId?: string | null;
})
```

After a successful create, **re-fetch the invoice detail** so `items`, `totals`
and `settlement` are the authoritative backend figures — do not keep the client
preview as state of record. `mock-data/*.json` mirrors each shape exactly.

## 2 · ⭐ Mapping "Precio unitario" (human) → `newItemUnitPriceInCents` (real)

This is the central translation. The design shows a friendly currency field; the
real control (`newItemUnitPriceInCents` + `onNewItemUnitPriceInCentsChange`) owns
a **string of integer cents**. Keep that prop as the source of truth and add a
thin presentation layer around it.

**Recommended approach — a display-only adapter, cents stays canonical:**

```ts
// cents string (canonical, what the prop holds)  ->  what the user sees in the field
function centsToInput(cents: string): string {
  if (!cents.trim()) return '';
  const n = Number(cents);
  if (!Number.isFinite(n)) return '';
  return (n / 100).toFixed(2);            // "12000" -> "120.00"
}

// what the user typed ("120,00" / "120.00" / "120") -> cents string for the prop
function inputToCents(input: string): string {
  const normalized = input.replace(/\s/g, '').replace(',', '.');   // es-EC comma decimals
  if (normalized === '') return '';
  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) return '';             // let validation reject
  return String(Math.round(value * 100));                          // 120.00 -> "12000"
}
```

Wire the visible input through the adapter while the prop stays in cents:

```tsx
<input
  inputMode="decimal"
  value={centsToInput(newItemUnitPriceInCents)}
  onChange={(e) => onNewItemUnitPriceInCentsChange(inputToCents(e.target.value))}
  placeholder="120.00"
/>
```

Rules to preserve:

- **Rounding** uses `Math.round(value * 100)` so `19.99 → 1999`, `0.1 → 10`. Do
  the multiply in one step to avoid float drift (`Math.round(parseFloat(x)*100)`).
- **Decimal separator**: accept both `.` and `,` (Ecuador keyboards) by
  normalizing comma → period before parsing; display always uses `.` + 2 dp.
- **Empty / invalid** maps to `''` so the existing disabled rule
  (`!newItemUnitPriceInCents.trim()`) still fires; never send `NaN`.
- **Quantity** stays an integer string (`newItemQuantity`); parse with
  `parseInt` and guard `≥ 1` for the preview only — the prop is unchanged.
- If the team prefers, store the human string in local state and convert to
  cents only inside `onCreateInvoiceItem` before calling `createInvoiceItem`;
  either way the cents value sent to the API is `inputToCents(...)`.

The **client preview** must use the same arithmetic the backend uses so it
matches on refresh:

```ts
const unitCents = Number(inputToCents(input));        // integer cents
const qty       = Math.max(0, parseInt(newItemQuantity, 10) || 0);
const lineSub   = qty * unitCents;
const rate      = taxRates.find(t => t.id === newItemTaxRateId);
const lineTax   = rate ? Math.round(lineSub * rate.percentage / 100) : 0;
const lineTotal = lineSub + lineTax;                  // PREVIEW ONLY — label it
```

Label it as an estimate and keep the "backend calculates on save" copy; never
write preview numbers into `selectedInvoiceDetail.totals`.

## 3 · `formatMoney` / `formatPercentage`

The prototype's `money()` and `pct()` are stand-ins for the props the component
already receives — use the real `formatMoney(valueInCents, currency)` and
`formatPercentage(value)` everywhere instead (item rows, totals, preview). Don't
introduce a second formatter; the design only assumes "cents in, currency
string out".

## 4 · Component mapping

| Prototype (`window.Items`) | Production target |
|---|---|
| `DesktopItems` | the refactored `InvoicingInvoiceItemsPanel` return |
| `InvoiceContext` | `<InvoiceContextHeader>` over `selectedInvoiceDetail` (electronic status = quiet only) |
| `ItemsCard` / `ItemList` / `ItemRow` | the items list, reading `selectedInvoiceDetail.items` |
| `AddItemForm` + preview | the existing add-item `<form>` + a `<LineEstimate>` presentational block |
| `TotalsSummary` | `<InvoiceTotalsCard>` reading `selectedInvoiceDetail.totals` |
| `centsToInput`/`inputToCents` | `features/invoicing/items/money.ts` (unit-tested) |
| `MobileItemsScreen` + sheet | responsive variant — sticky totals bar + `<BottomSheet>` add form |

Preserve the exact submit-disabled condition:
`!newItemDescription.trim() || !newItemUnitPriceInCents.trim() ||
actionLoading === 'create-invoice-item'` — and additionally gate on
`selectedInvoiceDetail.status === 'draft'` and `invoicing.manage` for the
constrained / read-only states.

## 5 · States

Map the 11 viewer states onto real conditions (not new backend states):

- `loading` ← detail/taxes query loading
- `draft_ready` / `no_items` ← `status === 'draft'` && `items.length === 0`
- `with_items` ← `items.length > 0`
- `form_partial` ← `newItem*` values present but incomplete
- `creating_item` ← `actionLoading === 'create-invoice-item'`
- `create_failed` ← caught mutation error (inline banner; keep typed values)
- `no_tax_rates` ← `taxRates.filter(isActive).length === 0` (allow "Sin impuesto")
- `non_draft_constrained` ← `status !== 'draft'` (show credit/debit-note guidance, no edit)
- `permission_limited` ← gate add behind `invoicing.manage`
- `backend_unavailable` ← detail query error boundary (preserve shell + retry)

## 6 · Tokens, moods, icons

- All color/spacing from design-system tokens — never hard-code — so the five
  moods work for free. Verify the preview strip and totals in `high-contrast`
  and `night`.
- Inline `window.Icon` maps to `lucide-react`: `Receipt`, `Package`, `ListPlus`,
  `Plus`, `Tag`, `Calculator`, `ShieldCheck`/`Shield`, `Lock`, `FileText`,
  `User`, `AlertTriangle`. Swap at import.

## 7 · Out of scope (do not build here)

- **No SRI submission / signing / authorization** — electronic status is quiet
  context only; the forward references (review, XML/RIDE, lifecycle) are later
  slices, never actioned here.
- No item edit/delete, product catalog, inventory, discounts, withholding,
  multi-tax per line, bulk import, autosave, payments or accounting posting —
  none have endpoints for this slice.
- No tax advice (which rate to choose) — only the mechanics of selecting a rate.
- No redesign of the shell — reuse `00-platform-shell`.

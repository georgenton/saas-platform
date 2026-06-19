# Slice 06 — integration plan (React + TypeScript + Vite)

How Codex folds this design into the real
`apps/web-platform/src/features/invoicing/workspace-customer-draft-flow.tsx`.
This is a **presentation refactor of an already-extracted component boundary** —
not a prototype paste and not a backend change. The backend is frozen; invent
nothing.

## 0 · Scope

`InvoicingCustomerDraftFlow` already receives everything this design needs as
props from the parent: `customers: CustomerResponse[]`, `customerForm` (name /
email / identificationType / taxId / billingAddress + onChange handlers +
onSubmit), `invoiceForm` (customerId / number / currency / status / dueAt / notes
+ handlers + onSubmit), `actionLoading`, `invoicingLoading`,
`nextInvoiceNumberSuggestion`, and `formatBuyerIdentificationType`. Keep all of
it. This slice only restructures presentation (the guided lane, the stepper, the
identity confirmation, the empty/success states, the rail). No route, store,
query or endpoint changes.

## 1 · Endpoints (unchanged — source of truth `docs/api/openapi.json`)

```
GET  /api/invoicing/tenants/{slug}/customers          listCustomers()
POST /api/invoicing/tenants/{slug}/customers          createCustomer()
GET  /api/invoicing/tenants/{slug}/invoices           (list context)
POST /api/invoicing/tenants/{slug}/invoices           createInvoice()
GET  /api/invoicing/tenants/{slug}/numbering/invoice  fetchInvoiceNumberingSettings() → previewNumber
```

`mock-data/*.json` mirrors each request/response shape exactly (each carries
`_type`/`_endpoint`/`_function`). The field names in `src/data.js` are the real
ones, so the design maps onto the existing props with no renaming.

### Exact body shapes (from `api.ts`)

```ts
createCustomer(body: {
  name: string;
  email?: string | null;
  taxId?: string | null;
  identificationType?: '04'|'05'|'06'|'07'|'08' | null;
  identification?: string | null;
  billingAddress?: string | null;
})
// createInvoice body mirrors invoiceForm: { customerId, number?, currency, status, dueAt?, notes? }
// number empty → backend autogenerates from numbering/invoice settings (previewNumber)
```

## 2 · The flow `step` is presentation-only

The three-step lane (`buyer` → `identity` → `draft`) and the stepper are a **UI
concept**, not a backend field. Implement `step` as local component state derived
from the existing data:

- start on `buyer`;
- selecting a customer (sets `invoiceForm.customerId`) → advance to `identity`;
- "Confirmar y crear borrador" → `draft`;
- a successful `createInvoice` → the success panel.

`deriveFlow()` in `flow-panel.jsx` shows the exact done/current/reachable logic;
lift it to a small pure helper (`settings`-style `derive.ts`) and unit-test it.
Do **not** add a backend "draft step" or "stage" — there is none.

## 3 · Component mapping

| Prototype (`window.Flow`) | Production target |
|---|---|
| `DesktopFlow` | the refactored `InvoicingCustomerDraftFlow` return |
| `Stepper` + `deriveFlow` | `<FirstInvoiceStepper>` + `useFirstInvoiceFlow()` (local step state) |
| `BuyerStep` → `BuyerCardRow` / `CustomerForm` | the customers card: directory list + `customerForm` |
| `IdentityStep` → `FactRow` | new presentational confirm card over the selected `CustomerResponse` |
| `DraftStep` | the create-invoice card: `invoiceForm` + numbering suggestion + success panel |
| `FlowRail` | a sticky summary aside (buyer/identity/draft + SRI reassurance) |
| `MobileFlowScreen` + sheets | responsive variant — step pills + `<BottomSheet>` for buyer creation |

Each step is presentation only — drop the **existing** form inputs, validation
and `onSubmit` handlers inside it. Preserve the disabled rules already in the
component: customer submit disabled when `!name.trim()` or
`actionLoading === 'create-customer'`; invoice submit disabled when
`customers.length === 0 || !customerId || !currency.trim() ||
actionLoading === 'create-invoice'`.

## 4 · Ecuador identification labels

The friendly `idType` table (label + hint + placeholder + length per `04`–`08`)
should live in `features/invoicing/customers/identification.ts` and back both the
select options and `formatBuyerIdentificationType` (the prop already passed in).
Keep the `07` Consumidor final → `9999999999999` rule as a single source there.

## 5 · States

Map the 14 viewer states onto real conditions — they are not new backend states:

- `loading` ← `invoicingLoading`
- `no_customers` ← `customers.length === 0`
- `customers_available` / `buyer_selected` ← directory + local `selectedCustomerId`
- `buyer_form_partial` ← `customerForm` values
- `customer_creating` / `invoice_creating` ← `actionLoading`
- `customer_failed` / `invoice_failed` ← caught mutation error (inline banner;
  keep the user's typed form values)
- `invoice_disabled_no_buyer` ← the existing disabled rule
- `invoice_created` ← successful `createInvoice` (show success, then allow "crear
  otro" / "agregar items")
- `permission_limited` ← gate create actions behind `invoicing.manage`
- `backend_unavailable` ← query error boundary (preserve shell + retry)

## 6 · Tokens, moods, icons

- All color/spacing comes from design-system tokens — never hard-code — so the
  five moods work for free. Verify in `high-contrast` and `night`.
- Inline `window.Icon` maps to `lucide-react`: `Users`, `UserPlus`, `UserCheck`,
  `IdCard`/`CreditCard`, `MapPin`, `Coins`, `Calendar`, `FileText`, `FileCheck`,
  `CheckCircle2`, `Hash`, `ArrowRight`, `ArrowLeft`, `Lock`, `ShieldCheck`,
  `HelpCircle`. Swap at import; geometry matches.

## 7 · Out of scope (do not build here)

- **No SRI submission / authorization / signing** anywhere in this flow — keep
  the "esto no es una emisión al SRI" reassurance; do not render electronic-status
  fields (they are `null` at draft creation).
- No customer search / edit / delete / merge / bulk import, no draft autosave, no
  tax validation, no payments — none have endpoints for this slice.
- No redesign of the shell — reuse `00-platform-shell`.
- Next surfaces (invoice items, document detail, XML/RIDE, electronic submission
  lifecycle) are separate slices — this lane only hands off toward them.

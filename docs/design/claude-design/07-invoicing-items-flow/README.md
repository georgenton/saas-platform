# Invoicing Items Flow — Slice 07

The **composition lane** where a draft invoice becomes a useful commercial
document: add line items, see each line's tax impact, and understand how
subtotal · IVA · total are formed — all before any XML/RIDE or SRI lifecycle
surface. This is the refinement of the real extracted component
`apps/web-platform/src/features/invoicing/workspace-commercial.tsx`
(exported `InvoicingInvoiceItemsPanel`), driven by
`docs/frontend-handoff/07-invoicing-items-flow.md`.

It follows `06-invoicing-customer-draft-flow` and builds on `00-platform-shell`
and `02-invoicing` — same Platform Shell chrome, tokens and SRI vocabulary. It
answers one question:

> "What am I charging, what tax applies, and is the draft ready to review?"

> **Reconciled to the frozen contract.** Every field maps 1:1 to the real types
> in `apps/web-platform/src/app/types.ts` and `api.ts`: `InvoiceDetailResponse`,
> `InvoiceItemResponse`, `TaxRateResponse`, `InvoiceTotals`, `InvoiceSettlement`,
> and `createInvoiceItem()` `{ description, quantity, unitPriceInCents,
> taxRateId? }`. No endpoints, fields or behaviors are invented. **Nothing here
> implies SRI submission/authorization, payments, accounting posting, item
> edit/delete, product catalog, inventory, discounts, withholding or tax advice.**

`index.html` is an **interactive viewer**: switch **device** (desktop / mobile),
**state** (11 explicit states) and **design mood** (comfort / focus / calm /
high-contrast / night). Selection persists in `localStorage`.

## The core idea — "compose a document, not edit DB rows"

The current panel is a list of `invoiceItemCard`s above a flat add-item form
(Descripción / Quantity / Unit price (cents) / Impuesto). The handoff's risk is
that it reads like a raw row editor that makes the operator think in cents. The
refinement turns it into a calm composition lane with a fixed rhythm:

```
1  Invoice context     number · status · buyer · currency (electronic = quiet context only)
2  The lines           item rows in normal currency terms — what you're charging
3  Add a line          descripción · cantidad · precio unitario · impuesto + a labeled PREVIEW
4  Totals              subtotal · IVA / impuesto · total — always visible, backend-owned
```

Money is expressed in **normal currency terms** ($1,200.00), never raw cents. A
live **client preview** of the line total is shown while typing, but it is
explicitly labeled *Estimado* and the UI repeats that the backend computes the
official totals on save — so we never imply committed numbers before
`createInvoiceItem` + refresh.

## What's on the screen (desktop)

- **Page header** — `Líneas y totales`, a friendly subtitle, a quiet "Guía
  rápida" link.
- **Invoice context** — the invoice number (mono), status pill, buyer name +
  identification, and currency; a quiet footer line carries the electronic
  status purely as context ("aún no emitido al SRI… la firma y el envío vienen
  después") — never as an action here.
- **Líneas de la factura** — each item as a readable row: position medallion ·
  description · `quantity × unitPrice` · tax-rate name + percentage · line IVA ·
  bold line total. Empty → a warm "empieza a componer la factura" state.
- **Agregar línea** — Descripción, Cantidad, **Precio unitario** (currency, `$`
  prefix), Impuesto (active rates + "Sin impuesto"), then a dashed **Estimado de
  la línea** preview (subtotal · IVA · total) and one dominant "Agregar línea".
- **Totales** (sticky right rail) — Subtotal · IVA / impuesto · Total, with a
  note that totals are backend-calculated, plus a calm "después de componer"
  handoff card pointing toward document review / XML/RIDE (not an action here).

## States covered (state switcher)

| # | State | What it shows |
|---|---|---|
| 1 | `loading` | Skeletons for context, list, form, totals. |
| 2 | `draft_ready` | Draft, zero items, clean entry ready for the first line. |
| 3 | `no_items` | Empty-list emphasis ("empieza a componer"). |
| 4 | `with_items` | Three real lines, totals formed. |
| 5 | `form_partial` | Add form partially filled; preview shows `—` until price is valid. |
| 6 | `creating_item` | Add button → "Agregando línea…", inputs disabled. |
| 7 | `create_failed` | Inline danger banner (price must be > 0), typed values kept. |
| 8 | `no_tax_rates` | No active rates → warning + "Sin impuesto" only in the selector. |
| 9 | `non_draft_constrained` | Issued/authorized invoice → add form replaced by a calm "ya no es borrador; usa nota de crédito/débito" explanation; lines read-only. |
| 10 | `permission_limited` | Read-only banner; add action becomes a disabled lock. |
| 11 | `backend_unavailable` | Chrome preserved + retry + correlationId. |

## Mobile (one-handed entry)

Not a shrunk panel. A compact invoice-context header, the items as readable
rows, a **sticky totals bar always visible** at the bottom with a large
thumb-friendly **"Agregar línea"** action, and the add-item form in a **focused
bottom sheet** with the same labeled estimate. Constrained/read-only states swap
the action for an explanatory disabled control. Mood switching is its own sheet.

## Files

```
index.html              Interactive viewer (loads everything below)
src/
  data.js               window.ITEMS_DATA — shell context + 11 scenarios, contract-shaped
  icons.jsx             window.Icon — Lucide-geometry icons (+ package/receipt/calculator/tag/listPlus)
  components.jsx        window.UI — shared shell primitives (reused from slices 00/02/05/06)
  chrome.jsx            window.Chrome — Sidebar, TopBar, mobile frame, bottom sheets
  items-panel.jsx       window.Items — desktop: InvoiceContext, ItemsCard, AddItemForm (+preview), TotalsSummary, money helpers
  items-mobile.jsx      window.MobileItems — one-handed screen + add-item bottom sheet + sticky totals
  app.jsx               Viewer chrome + device/state/mood orchestration
mock-data/              JSON fixtures mapped to the real contracts (see _type/_endpoint)
notes.md                Design rationale · hierarchy · guardrails · tensions · a11y
components.md           The reusable components this slice introduces
integration-plan.md     How Codex folds this into InvoicingInvoiceItemsPanel — incl. "Precio unitario" → unitPriceInCents
README.md               This file
```

## Endpoints (source of truth: `docs/api/openapi.json`)

This slice **invents no endpoints**. It uses only the surfaces the handoff names:

```
GET  /api/invoicing/tenants/{slug}/invoices/{invoiceId}          selected invoice detail
GET  /api/invoicing/tenants/{slug}/invoices/{invoiceId}/items    item list (within the detail)
POST /api/invoicing/tenants/{slug}/invoices/{invoiceId}/items    createInvoiceItem()
GET  /api/invoicing/tenants/{slug}/taxes                         active tax rates for the selector
```

No item edit/delete, product catalog, inventory, discount, withholding,
multi-tax, bulk import, autosave, SRI submission, payment or accounting posting.

## Guardrails honored

Invoice context first · one dominant add action · money in currency terms (cents
mapped only at the API boundary — see integration-plan) · tax impact visible but
calm · client totals always labeled a **preview**, backend owns the real numbers ·
electronic status shown as quiet context, never an action · non-draft invoices
make item-adding feel intentionally constrained (credit/debit note language, no
fake edit) · disabled actions stay visible under permission limits and say why ·
no accounting/SRI/payment language · tone profesional, calmado, es-EC.

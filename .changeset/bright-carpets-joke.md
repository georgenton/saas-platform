"api-platform": minor
---

Add invoicing tax rates, document previews, email delivery, reporting, lifecycle transitions, and invoice payments.

This change introduces `TaxRate` management endpoints for the `invoicing` product, lets invoice items reference an optional tenant tax rate, stores tax snapshots on each item, and updates invoice totals so `taxInCents` and `totalInCents` reflect real computed taxes instead of a fixed zero value. It also adds a tenant-scoped invoice document view, a printable HTML document endpoint, a first React document preview, an SMTP-backed invoice email delivery action that reuses the generated document as the notification body, and a reporting summary endpoint plus UI snapshot for invoice status mix, currency totals, paid totals, and monthly trends. Finally, it adds explicit invoice lifecycle transitions plus tenant-scoped payment registration and settlement tracking so invoices can move from `draft` to `issued`, receive payments, and expose `paidInCents`, `balanceDueInCents`, and `isFullyPaid` in API and web responses.

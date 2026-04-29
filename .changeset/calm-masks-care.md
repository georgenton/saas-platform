---
"api-platform": minor
---

Refine invoicing payment reconciliation with partial settlement and payment reversals.

This change introduces the `partially_paid` invoice lifecycle state, prevents manually marking invoices as `paid` until they are fully settled, and adds tenant-scoped payment reversal support with audit fields on each payment. It also updates invoice settlement and reporting so reversed payments no longer count toward `paidInCents`, and extends the web workspace with payment status visibility and a first reversal action for invoicing operators.

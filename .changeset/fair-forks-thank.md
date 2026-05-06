---
"api-platform": minor
---

Add a first Ecuador-oriented RIDE representation for electronic invoices.

This change introduces a dedicated electronic RIDE response and printable HTML endpoint derived from the current invoice document view, so tenants can inspect a more explicit `Representacion Impresa del Documento Electronico` with issuer data, buyer data, access key, authorization summary, and Ecuador numbering fields. It also exposes a first web action to open the printable RIDE directly from the invoicing workspace, extending the current `Electronic Invoicing EC` foundation beyond XML and technical submission flows.

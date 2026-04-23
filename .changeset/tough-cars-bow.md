---
"api-platform": minor
---

Add the first platform catalog slice for products and modules.

This change introduces `Product` and `PlatformModule` as core platform catalog concepts, seeds the initial multi-product catalog, and exposes read-only API endpoints to list products, inspect one product, and list the modules that belong to a product.

It establishes the first explicit bridge between the current tenancy/auth foundation and the broader multi-product SaaS platform model.

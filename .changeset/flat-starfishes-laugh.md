---
"api-platform": minor
---

Expose tenant-enabled product modules and enforce commercial product access in the backend.

This change adds a tenant-aware endpoint to list modules for an enabled product and introduces a reusable product access guard/decorator that resolves whether the tenant can actually use the requested product.

It strengthens the bridge from catalog and entitlements into real backend enforcement, preparing future product slices to rely on effective tenant commercial access instead of UI-only gating.

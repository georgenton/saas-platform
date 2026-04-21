---
'api-platform': minor
---

Add current-tenant session semantics to the authenticated session view.

This change enriches `GET /api/auth/me` so clients can resolve a `currentTenancy`
explicitly via `tenantSlug` or let the backend choose a default tenancy through a
deterministic priority rule.

It also keeps the tenant session selection logic outside the controller so
frontend session bootstrapping can evolve without coupling transport code to
selection rules.

---
'api-platform': minor
---

Persist the authenticated user's preferred tenant selection.

This change stores a `preferredTenantId` for the authenticated user and adds an
API to set or clear that preference through `/api/auth/me/current-tenancy`.

It also teaches `/api/auth/me` to honor the persisted tenant preference when no
explicit `tenantSlug` is provided, making multi-tenant frontend sessions feel
stable across requests.

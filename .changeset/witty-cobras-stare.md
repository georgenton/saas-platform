---
'api-platform': minor
---

Introduce JWT-backed authenticated user context for tenancy and RBAC flows.

This change replaces the development-only header authentication guard with a minimal
Bearer JWT guard, keeps the authenticated user context stable for tenancy access
resolution, and prepares the API boundary for later integration with a real identity
provider without changing the multi-tenant authorization layer.

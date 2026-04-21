---
'api-platform': minor
---

Add an authenticated session view for frontend-facing auth flows.

This change introduces `GET /api/auth/me`, returning the authenticated user
context together with a summarized view of the user's tenant memberships,
effective roles, and permissions.

It also extends tenancy application and Prisma persistence to list memberships
by user so session-oriented frontend experiences can be built on top of the
existing RBAC foundation.

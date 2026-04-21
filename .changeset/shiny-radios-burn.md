---
'api-platform': minor
---

Formalize tenant RBAC with persisted roles, permissions, membership role assignments,
and permission-based tenancy guards.

This change replaces the bootstrap owner/member heuristic with a real access model,
adds APIs to inspect effective tenant access and manage membership roles, and includes
the Prisma migrations needed to seed the first RBAC catalog.

---
'api-platform': minor
---

Introduce an authenticated user context for tenancy flows.

This change moves tenancy access checks off the raw `x-user-id` header and into
an explicit development authentication layer, so tenant guards and RBAC logic can
consume a reusable authenticated user context that is ready to be swapped later
for JWT or an external identity provider.

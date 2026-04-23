---
"api-platform": minor
---

Expose current subscription and effective entitlements inside `/api/auth/me`.

This change enriches the authenticated session response so the current tenancy now includes the active commercial subscription and effective entitlements for that tenant.

It connects the existing React session bootstrap flow with the new commercial access model, so frontend clients can make plan-aware and entitlement-aware decisions directly from the session payload.

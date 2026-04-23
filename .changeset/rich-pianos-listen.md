---
"api-platform": minor
---

Add the first commercial access slice with plans, subscriptions, and entitlements.

This change introduces the commercial core for `Plan`, `Subscription`, and `Entitlement`, seeds the initial plan catalog, and exposes read-only and tenant-managed endpoints to inspect plans, assign the current tenant plan, and read effective entitlements.

It establishes the first tenant-facing commercial bridge between the platform catalog and the future billing, access control, and feature gating model.

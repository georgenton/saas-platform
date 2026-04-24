---
"api-platform": minor
---

Add tenant feature flags and integrate them into effective product access resolution.

This change introduces tenant-scoped feature flags with read and manage APIs, plus the persistence and application layers needed to store them.

It also teaches the effective tenant product access snapshot to consider `product.<key>.enabled` flags so product availability can now be adjusted beyond raw entitlements alone.

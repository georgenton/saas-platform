---
'api-platform': minor
---

Add an authenticated user introspection endpoint.

This change exposes `GET /api/auth/me` so clients can inspect the resolved
authenticated user context behind Bearer JWT authentication, making it easier
to verify auth integration and bootstrap frontend session awareness.

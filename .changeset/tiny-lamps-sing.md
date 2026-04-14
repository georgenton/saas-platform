---
'api-platform': minor
---

Add validated identity and tenancy API endpoints backed by Prisma persistence.

This release introduces register-user and create-tenant flows, wires the first
transactional tenant provisioning path, and adds HTTP-level validation and
supertest coverage for the initial SaaS backend slices.

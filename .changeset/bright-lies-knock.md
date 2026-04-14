---
'api-platform': minor
---

Introduce the first core backend architecture slices for tenancy and identity.This change scaffolds separate domain and application layers for both modules,including base entities, enums, repository ports, and initial use cases.It also documents the layering approach that will guide future Prisma adapters,Nest modules, and multi-tenant business logic.

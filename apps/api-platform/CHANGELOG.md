# api-platform

## 0.3.0

### Minor Changes

- 0d0e952: Add tenant read endpoints and the first tenant access authorization flow.

  This release introduces user and tenant lookup routes, tenant membership query
  endpoints, and a first pass at tenant-context resolution with owner-only access
  control for sensitive tenancy resources.

## 0.2.0

### Minor Changes

- 434777b: Add validated identity and tenancy API endpoints backed by Prisma persistence.

  This release introduces register-user and create-tenant flows, wires the first
  transactional tenant provisioning path, and adds HTTP-level validation and
  supertest coverage for the initial SaaS backend slices.

## 0.1.0

### Minor Changes

- a7697e0: Introduce the first core backend architecture slices for tenancy and identity.This change scaffolds separate domain and application layers for both modules,including base entities, enums, repository ports, and initial use cases.It also documents the layering approach that will guide future Prisma adapters,Nest modules, and multi-tenant business logic.
- 15595d6: primer commit

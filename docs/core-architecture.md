# Core Architecture

## Initial backend slices

The monorepo now starts separating core business logic into:

- `packages/core/tenancy/domain`
- `packages/core/tenancy/application`
- `packages/core/identity/domain`
- `packages/core/identity/application`
- `packages/infra/prisma`

## Layer responsibilities

### Domain

Owns:

- entities
- enums
- invariants
- business state transitions

Examples:

- `Tenant`
- `Membership`
- `User`

### Application

Owns:

- use cases
- repository ports
- id generation ports
- orchestration of domain rules

Examples:

- `CreateTenantUseCase`
- `RegisterUserUseCase`

### Infrastructure

Owns:

- Prisma
- repository implementations
- external adapters
- persistence details

Current example:

- `packages/infra/prisma`

## Next recommended step

Implement infrastructure adapters for:

- `TenantRepository`
- `MembershipRepository`
- `UserRepository`

using Prisma-backed implementations under infrastructure libraries, and then expose application services through Nest modules in the API app.

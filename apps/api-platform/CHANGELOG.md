# api-platform

## 0.12.0

### Minor Changes

- 2ef41e4: Expose current subscription and effective entitlements inside `/api/auth/me`.

  This change enriches the authenticated session response so the current tenancy now includes the active commercial subscription and effective entitlements for that tenant.

  It connects the existing React session bootstrap flow with the new commercial access model, so frontend clients can make plan-aware and entitlement-aware decisions directly from the session payload.

## 0.11.0

### Minor Changes

- 3683c6a: Add the first commercial access slice with plans, subscriptions, and entitlements.

  This change introduces the commercial core for `Plan`, `Subscription`, and `Entitlement`, seeds the initial plan catalog, and exposes read-only and tenant-managed endpoints to inspect plans, assign the current tenant plan, and read effective entitlements.

  It establishes the first tenant-facing commercial bridge between the platform catalog and the future billing, access control, and feature gating model.

## 0.10.0

### Minor Changes

- 691685d: Add the first platform catalog slice for products and modules.

  This change introduces `Product` and `PlatformModule` as core platform catalog concepts, seeds the initial multi-product catalog, and exposes read-only API endpoints to list products, inspect one product, and list the modules that belong to a product.

  It establishes the first explicit bridge between the current tenancy/auth foundation and the broader multi-product SaaS platform model.

## 0.9.1

### Patch Changes

- 4764c35: Add a local manual-testing kit for the onboarding flows and enable browser-based API access.

  This change enables CORS for the API, adds a local JWT generator, documents the local API and web testing flow, and ships a starter Postman collection plus environment for identity, tenancy, auth session, and invitation onboarding requests.

## 0.9.0

### Minor Changes

- 90df2ac: Add the first React onboarding shell for authenticated session and invitation flows.

  This change introduces the new `web-platform` app to consume `/api/auth/me`, render session-driven onboarding states, review pending invitations, switch current tenancy, and manage tenant invitations from a visible UI.

  It also adds SMTP-backed invitation delivery so invitation creation and resend flows can send real email messages with deep links into the web onboarding experience when SMTP is configured.

## 0.8.0

### Minor Changes

- 8938054: Add invitation lifecycle management and frontend-friendly onboarding session flows, including tenant invitation listing and cancellation, pending invitation visibility in auth session responses, and authenticated invitation acceptance that returns a refreshed session.
- 900db5e: Extend invitation onboarding with resend and detail APIs plus frontend-oriented auth session state for invitation review and tenancy selection flows.

## 0.7.0

### Minor Changes

- 7cb975b: Persist the authenticated user's preferred tenant selection.

  This change stores a `preferredTenantId` for the authenticated user and adds an
  API to set or clear that preference through `/api/auth/me/current-tenancy`.

  It also teaches `/api/auth/me` to honor the persisted tenant preference when no
  explicit `tenantSlug` is provided, making multi-tenant frontend sessions feel
  stable across requests.

- 0725d93: Add multi-tenant invitation onboarding flows for inviting users, accepting invitations, and creating memberships from the invitation lifecycle.

## 0.6.0

### Minor Changes

- dccd72a: Add an authenticated session view for frontend-facing auth flows.

  This change introduces `GET /api/auth/me`, returning the authenticated user
  context together with a summarized view of the user's tenant memberships,
  effective roles, and permissions.

  It also extends tenancy application and Prisma persistence to list memberships
  by user so session-oriented frontend experiences can be built on top of the
  existing RBAC foundation.

- 4986a66: Add current-tenant session semantics to the authenticated session view.

  This change enriches `GET /api/auth/me` so clients can resolve a `currentTenancy`
  explicitly via `tenantSlug` or let the backend choose a default tenancy through a
  deterministic priority rule.

  It also keeps the tenant session selection logic outside the controller so
  frontend session bootstrapping can evolve without coupling transport code to
  selection rules.

- a5c5b60: Add an authenticated user introspection endpoint.

  This change exposes `GET /api/auth/me` so clients can inspect the resolved
  authenticated user context behind Bearer JWT authentication, making it easier
  to verify auth integration and bootstrap frontend session awareness.

## 0.5.0

### Minor Changes

- 7d4db62: Introduce provider-backed JWT verification with configurable verifier selection.

  This change separates JWT verification behind a dedicated contract, adds a provider-oriented
  RS256 verifier with issuer, audience, and temporal claim validation, and keeps a local verifier
  available as a development fallback. The authentication guard now depends on the verifier contract
  instead of embedding token verification logic directly.

- d1d8917: Introduce JWT-backed authenticated user context for tenancy and RBAC flows.

  This change replaces the development-only header authentication guard with a minimal
  Bearer JWT guard, keeps the authenticated user context stable for tenancy access
  resolution, and prepares the API boundary for later integration with a real identity
  provider without changing the multi-tenant authorization layer.

## 0.4.0

### Minor Changes

- 24fa946: Harden tenant RBAC role management by enforcing protected owner-role policies.

  This change prevents unsafe owner-role assignment and removal flows, ensures a tenant
  keeps at least one owner, and returns explicit forbidden responses for policy violations.

- 379b1fc: Formalize tenant RBAC with persisted roles, permissions, membership role assignments,
  and permission-based tenancy guards.

  This change replaces the bootstrap owner/member heuristic with a real access model,
  adds APIs to inspect effective tenant access and manage membership roles, and includes
  the Prisma migrations needed to seed the first RBAC catalog.

- 7ed7678: Introduce an authenticated user context for tenancy flows.

  This change moves tenancy access checks off the raw `x-user-id` header and into
  an explicit development authentication layer, so tenant guards and RBAC logic can
  consume a reusable authenticated user context that is ready to be swapped later
  for JWT or an external identity provider.

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

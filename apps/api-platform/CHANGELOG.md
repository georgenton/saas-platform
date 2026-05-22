# api-platform

## 0.39.0

### Minor Changes

- e4e82ef: Add explicit Growth Assist lead-warmth summaries and hints so the guided workspace can explain commercial heat, cadence, and risk in simpler business language.

## 0.38.0

### Minor Changes

- 18d6023: Add explicit Growth Assist next-action suggestions so the guided agenda can prioritize the top few business moves of the day with rationale and recommended action.

## 0.37.0

### Minor Changes

- b95a93b: Enrich the Growth Assist daily agenda with explicit reply suggestions, follow-up prompts, and step-based playbooks for non-expert operators.

## 0.36.0

### Minor Changes

- fa73cc2: Add a backend daily agenda contract for Growth Assist and wire the web workspace to consume assisted tasks, cues, and playbooks from that shared source.

## 0.35.0

### Minor Changes

- e3f7f14: Persist tenant-scoped default policy pack settings for Growth operational case auto-assignment and add a first guided Growth Assist workspace on top of the shared operational queue.

## 0.34.0

### Minor Changes

- 9c1f244: Add policy packs for Growth operational case auto-assignment so operators can run balanced, owner-queue-first, or follow-up-first routing from the API and web console with auditable outcome metrics.

## 0.33.0

### Minor Changes

- 409dd6b: Add first auto-assignment policies for Growth operational cases, including manual API/web triggers that inherit eligible thread owners or fall back to the least-loaded Growth operator.

## 0.32.0

### Minor Changes

- 7ce7be5: Add operational-case escalation review so overdue follow-up and ownership-routing work is promoted into an explicit escalation-review lane.

## 0.31.0

### Minor Changes

- b155cc7: Persist shared Growth operational cases for escalations, ownership routing, and follow-up workflow, including explicit follow-up state transitions.
- e0a6062: Add explicit routing-policy lanes for Growth operational cases, including grouped fleet and tenant queues for follow-up team and waiting-customer paths.

## 0.30.0

### Minor Changes

- b027b78: Add Growth fleet runbooks and ownership queues to the operational console.

## 0.29.0

### Minor Changes

- b4b8be0: Add a cross-tenant Growth fleet operations console on top of shared monitor state.

## 0.28.0

### Minor Changes

- 8601ae6: Persist shared Growth operational monitor history and alert acknowledgements, wire the dashboard consumer to shared backend state instead of browser-local memory, and add first-pass historical calibration analytics for operational thresholds.

## 0.27.0

### Minor Changes

- 34d7ef0: Expand the Growth operational dashboard consumer with local alert acknowledgements, drill-down inspection, and browser-local alert history for tenant operators.

## 0.26.0

### Minor Changes

- f4eefcd: Add the first web consumer for Growth operational workbench, WhatsApp alert summaries, provider taxonomy insights, and manual monitor execution from the workspace UI.

  Refine that consumer so Growth visibility follows effective permissions, adds an operator brief, improves workbench filter UX, and surfaces a clearer readout of the latest manual monitor execution.

## 0.25.0

### Minor Changes

- Add Growth conversation workbench, SLA analytics, real WhatsApp automation execution, deeper WhatsApp provider failure semantics, calibrated operational dashboard/alert thresholds, a tenant-scoped WhatsApp operational monitor plus runtime scheduler hook and external observability sink, local collector/smoke tooling, provider-aware operations/reporting foundations, persisted outbound template render snapshots, and both manual and tenant-scoped ready-now retry execution for failed WhatsApp messages.

## 0.24.0

### Minor Changes

- 99d2310: add Ecuador remote sandbox bootstrap tooling, introduce the first shared Party read model, start tenant lead capture plus first conversation, opportunity, assignment/ownership, assignment analytics/workload views, and WhatsApp inbox foundations for Growth, including message templates plus outbound intents, first provider-approved template semantics, first outbound reporting by intent/template, first WhatsApp automation rule plus suggestion foundation, richer provider delivery semantics, outbound, durable delivery events, Meta-like webhook rails, provider-authenticity plus tenant-routing, webhook envelope/idempotency plus inspection/replay, and the first outbound real/stub provider gateway foundation, and align the conceptual roadmap with the current platform state

## 0.23.0

### Minor Changes

- c37d26c: Harden PKCS#12 material inspection for Ecuador electronic invoicing readiness using an OpenSSL-backed probe, certificate metadata hydration, certificate validity checks, and an initial internal cryptographic signer rail.

## 0.22.0

### Minor Changes

- 0cf4eaf: Add Ecuador remission guide document foundation with numbering, draft creation, XML preview, RIDE, artifacts, readiness, and testing flows.

## 0.21.0

### Minor Changes

- fd50454: Add Ecuador withholding certificate (`07`) foundation with draft creation, document numbering, XML preview, RIDE, readiness visibility, and testing assets.

## 0.20.0

### Minor Changes

- 2a5681a: Add the first Ecuador debit-note (`05`) foundation with draft creation from source invoices, document-specific numbering, XML/RIDE preview scaffolding, readiness visibility, and updated Postman/manual testing flows.

## 0.19.0

### Minor Changes

- ae9d57b: Add multi-document Ecuador numbering support so tenants can manage independent numbering settings for invoices (`01`) and credit notes (`04`), and introduce a draft credit-note creation flow derived from a source invoice.

## 0.18.0

### Minor Changes

- 193cbb5: Add a first Ecuador-oriented RIDE representation for electronic invoices.

  This change introduces a dedicated electronic RIDE response and printable HTML endpoint derived from the current invoice document view, so tenants can inspect a more explicit `Representacion Impresa del Documento Electronico` with issuer data, buyer data, access key, authorization summary, and Ecuador numbering fields. It also exposes a first web action to open the printable RIDE directly from the invoicing workspace, extending the current `Electronic Invoicing EC` foundation beyond XML and technical submission flows.

## 0.17.0

### Minor Changes

- 02f0d70: Add the first Ecuador-oriented electronic invoicing settings, buyer semantics, and authorization state model on top of the current invoicing product.

  This change introduces tenant-scoped issuer profile management and invoice numbering settings for Ecuador-style invoice series. It also teaches invoice creation to auto-generate numbers such as `001-002-000000031` when numbering settings exist, persists document metadata on invoices, and exposes the new issuer and numbering data in API and web document views so the current invoicing foundation can evolve toward `Electronic Invoicing EC`.

  On top of that, it adds the first Ecuador buyer semantics by letting customers store identification type, identification number, and billing address, and by snapshotting those values into invoices when they are created. This gives invoice detail and document responses enough structure to model `tipoIdentificacionComprador`, `identificacionComprador`, `razonSocialComprador`, and `direccionComprador`.

  Finally, it introduces a first electronic authorization state model on invoices with `pending_submission`, `submitted`, `authorized`, and `rejected`, plus support for access key, authorization number, authorization timestamp, signed timestamp, submitted timestamp, submission reference, and SRI status message in API and web flows. The backend can now derive `claveAcceso` from issuer profile plus Ecuador numbering metadata, expose a first XML preview endpoint, validate the generated XML before signing with stricter Ecuador-oriented checks for key length/check digit, document codes, buyer identification semantics, totals consistency, XSD-like structural rules across `infoTributaria`, `infoFactura`, `pagos`, `totalConImpuestos`, and each `detalle/impuesto`, and a real `xmllint` pass against the official SRI `Factura 2.1.0` XSD, require tenant-scoped electronic signature settings before signing, resolve signature and submission secret references through an environment-backed secret boundary, split certificate metadata from secret references, configure tenant-scoped electronic submission settings for `stub_sri` or `sri_offline_ws`, persist a technical history of submission and authorization events per invoice, route signers and gateways by provider, move the offline gateway closer to the SRI flow by building reception and authorization SOAP-style envelopes with `RECIBIDA`/`DEVUELTA` and `AUTORIZADO`/`NO AUTORIZADO` mappings through a dedicated SRI offline client boundary that can switch between stub transport and a real HTTP/SOAP adapter according to the configured transmission mode, and wire the official XSD validation bundle plus `xmllint` into CI, delivery, and the runtime container, all without conflating commercial invoice lifecycle with electronic authorization lifecycle.

## 0.16.0

### Minor Changes

- 92b8100: Add invoicing tax rates, document previews, email delivery, reporting, lifecycle transitions, and invoice payments.

  This change introduces `TaxRate` management endpoints for the `invoicing` product, lets invoice items reference an optional tenant tax rate, stores tax snapshots on each item, and updates invoice totals so `taxInCents` and `totalInCents` reflect real computed taxes instead of a fixed zero value. It also adds a tenant-scoped invoice document view, a printable HTML document endpoint, a first React document preview, an SMTP-backed invoice email delivery action that reuses the generated document as the notification body, and a reporting summary endpoint plus UI snapshot for invoice status mix, currency totals, paid totals, and monthly trends. Finally, it adds explicit invoice lifecycle transitions plus tenant-scoped payment registration and settlement tracking so invoices can move from `draft` to `issued`, receive payments, and expose `paidInCents`, `balanceDueInCents`, and `isFullyPaid` in API and web responses.

- 41da065: Refine invoicing payment reconciliation with partial settlement and payment reversals.

  This change introduces the `partially_paid` invoice lifecycle state, prevents manually marking invoices as `paid` until they are fully settled, and adds tenant-scoped payment reversal support with audit fields on each payment. It also updates invoice settlement and reporting so reversed payments no longer count toward `paidInCents`, and extends the web workspace with payment status visibility and a first reversal action for invoicing operators.

## 0.15.0

### Minor Changes

- 37807f0: Add the first invoicing product domain slice with tenant-scoped customers, invoices, and invoice items protected by commercial product access.

## 0.14.0

### Minor Changes

- 93f9da9: Add tenant feature flags and integrate them into effective product access resolution.

  This change introduces tenant-scoped feature flags with read and manage APIs, plus the persistence and application layers needed to store them.

  It also teaches the effective tenant product access snapshot to consider `product.<key>.enabled` flags so product availability can now be adjusted beyond raw entitlements alone.

## 0.13.0

### Minor Changes

- 833b170: Expose tenant-enabled product modules and enforce commercial product access in the backend.

  This change adds a tenant-aware endpoint to list modules for an enabled product and introduces a reusable product access guard/decorator that resolves whether the tenant can actually use the requested product.

  It strengthens the bridge from catalog and entitlements into real backend enforcement, preparing future product slices to rely on effective tenant commercial access instead of UI-only gating.

- cdbaf4c: Expose tenant-enabled product access derived from effective entitlements.

  This change adds a tenant-aware API snapshot for the products currently enabled for a tenant based on its effective commercial entitlements.

  It creates the first backend bridge between platform catalog data and commercial access enforcement, preparing future module-level access resolution and product guards.

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

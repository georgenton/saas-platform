# Platform Shell

## Goal

Create the application frame Claude Design will reuse across every product:
authentication, tenant context, product navigation, permission-aware states and
global feedback.

## Primary User

Tenant owner or operator working across multiple SaaS products.

## Entry Point

Local app root after authentication.

## Endpoints

- `GET /api/auth/me`
- `GET /api/tenancy/tenants/:slug/products`
- `GET /api/tenancy/tenants/:slug/subscription`
- `GET /api/tenancy/tenants/:slug/entitlements`
- `GET /api/tenancy/tenants/:slug/feature-flags`
- `GET /api/platform/products`
- `GET /api/platform/plans`

## Primary Data

- current user
- active tenant
- membership and permissions
- enabled products
- plan/subscription/entitlements
- feature flags

## Required Screens

1. App shell with top-level product navigation.
2. Tenant/product access state.
3. Global loading/error state.
4. Permission or product-disabled state.
5. Lightweight environment banner for local/dev.

## States

- loading current user
- authenticated ready
- tenant missing
- product disabled
- permission denied
- backend unavailable

## Guardrails

- Do not hide unavailable products completely; show clear disabled states when
  access exists conceptually but is not enabled.
- Keep financial and clinical modules visibly separated.
- Make the tenant context obvious on every screen.

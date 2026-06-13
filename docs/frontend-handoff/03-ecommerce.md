# Ecommerce Handoff

## Goal

Design the ecommerce operating workflow from store setup through product
authoring, launch, order lifecycle, fulfillment, post-sale and invoice handoff.

## Primary User

Owner/operator launching and operating a small ecommerce channel.

## Core Endpoints

- `GET /api/ecommerce/tenants/:slug/store-setup-workspace`
- `GET /api/ecommerce/tenants/:slug/store-profile-workspace`
- `GET /api/ecommerce/tenants/:slug/product-authoring-workspace`
- `GET /api/ecommerce/tenants/:slug/product-workspaces`
- `GET /api/ecommerce/tenants/:slug/product-setups`
- `GET /api/ecommerce/tenants/:slug/product-entities`
- `GET /api/ecommerce/tenants/:slug/product-entities/:productEntityId`
- `GET /api/ecommerce/tenants/:slug/product-entities/:productEntityId/storefront-preview-workspace`
- `GET /api/ecommerce/tenants/:slug/product-entities/:productEntityId/channel-release-workbench`
- `GET /api/ecommerce/tenants/:slug/product-entities/:productEntityId/order-drafts`

## Launch And Post-sale Endpoints

- `POST /api/ecommerce/tenants/:slug/product-entities/:productEntityId/request-release-launch-packet`
- `POST /api/ecommerce/tenants/:slug/product-entities/:productEntityId/save-order-draft`
- Use OpenAPI for the full order lifecycle, fulfillment, delivery confirmation,
  dispute and reporting endpoints. They are grouped under the `Ecommerce` tag in
  `docs/api/openapi.json`.

## Required Screens

1. Ecommerce command center.
2. Store setup/profile workspace.
3. Product authoring workspace.
4. Product entity detail.
5. Asset/channel readiness workspace.
6. Storefront preview.
7. Release workbench.
8. Order draft/list/detail.
9. Fulfillment workspace.
10. Post-sale workspace.
11. Invoice handoff panel.

## Actions

- save product draft
- request authoring packet
- request launch packet
- save order draft
- request fulfillment packet
- request dispute resolution packet
- request delivery confirmation packet
- review reporting summary

## States

- setup incomplete
- authoring draft
- asset readiness blocked
- launch ready
- order draft
- fulfillment pending
- delivery confirmation pending
- post-sale needs review
- invoice handoff ready

## Guardrails

- Ecommerce should feel operational and workflow-driven.
- Do not mix launch content authoring with fulfillment/post-sale operations on
  one overloaded screen.
- Invoice handoff should clearly point to Invoicing as the source of truth for
  fiscal document issuance.

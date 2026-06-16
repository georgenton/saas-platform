# Product Command Center

## Goal

Give the operator a single first screen that shows what products are active,
which areas need attention and where to continue work.

## Primary User

Owner/operator who needs an at-a-glance operating console.

## Endpoints

Current implementation composes the screen client-side from existing endpoints:

- `GET /api/tenancy/tenants/:slug/products`
- `GET /api/invoicing/tenants/:slug/reports/summary`
- `GET /api/ecommerce/tenants/:slug/store-setup-workspace`
- `GET /api/growth/tenants/:slug/conversations/assist/daily-agenda`
- `GET /api/tax-compliance/tenants/:slug/ec/command-center`
- `GET /api/accounting/tenants/:slug/full-accounting-completion-closeout/closeout`
- `GET /api/ai/tenants/:slug/operations-summary`

Recommended future BFF aggregate:

- `GET /api/tenancy/tenants/:slug/command-center`

This aggregate does not exist yet. It should be read-only and should not
invent product behavior; it only summarizes access, readiness, evidence and
blockers that already belong to each product domain.

## Primary Data

- enabled product list
- product readiness/status
- next recommended action
- blocked or needs-review counts
- latest closeout/summary signal

## Required Sections

1. Product status grid.
2. Work queue / next actions.
3. Financial/tax/accounting summary strip.
4. AI operations summary.
5. Recently blocked workflows.

## States

- loading dashboard
- no products enabled
- product ready
- product needs review
- product blocked
- partial backend failure

## Guardrails

- This screen summarizes; it should not expose every endpoint.
- Avoid turning closeout states into legal/compliance claims.
- Show “needs review” and “blocked” as operational signals, not failures.

## BFF Aggregate Contract

The future aggregate should collapse the hot post-login fan-out into one
tenant-scoped read:

```http
GET /api/tenancy/tenants/:slug/command-center
Authorization: Bearer <token>
```

Response shape:

```ts
type CommandCenterBffResponse = {
  tenantSlug: string;
  generatedAt: string;
  accessOverview: {
    total: number;
    counts: Array<{
      state:
        | 'enabled'
        | 'permission_limited'
        | 'blocked_by_plan'
        | 'available'
        | 'disabled';
      label: string;
      value: number;
    }>;
  };
  domains: Array<{
    key: 'finance' | 'commerce' | 'ai' | 'clinics';
    name: string;
    summary?: string;
  }>;
  products: Array<{
    key: string;
    domain: 'finance' | 'commerce' | 'ai' | 'clinics';
    accessState:
      | 'enabled'
      | 'permission_limited'
      | 'blocked_by_plan'
      | 'available'
      | 'disabled';
    purpose: string;
    readiness?: Array<{
      label: string;
      value: string;
      tone: 'success' | 'warning' | 'neutral';
    }>;
    evidence?: {
      label: string;
      source: string;
      when: string;
      mono?: string;
    } | null;
    blocker?: {
      text: string;
      tone: 'info' | 'neutral' | 'primary' | 'warning';
    } | null;
    includes?: string[];
    addonPrice?: string;
    requiresPlan?: string;
  }>;
};
```

Contract rules:

- Keep disabled, available and blocked products visible.
- `accessState` is the canonical card driver.
- Product domains own their readiness and evidence fields.
- Missing `readiness`, `evidence` or `blocker` must be tolerated by the UI.
- The aggregate must not trigger actions, filing, signing, certification,
  clinical diagnosis, automatic AI execution or product installation.
- Product action endpoints remain separate future contracts.

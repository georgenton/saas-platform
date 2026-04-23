CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceInCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "billingCycle" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PlanEntitlement" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanEntitlement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Entitlement" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entitlement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Plan_key_key" ON "Plan"("key");
CREATE UNIQUE INDEX "PlanEntitlement_planId_key_key" ON "PlanEntitlement"("planId", "key");
CREATE UNIQUE INDEX "Subscription_tenantId_key" ON "Subscription"("tenantId");
CREATE UNIQUE INDEX "Entitlement_tenantId_key_key" ON "Entitlement"("tenantId", "key");

ALTER TABLE "PlanEntitlement"
ADD CONSTRAINT "PlanEntitlement_planId_fkey"
FOREIGN KEY ("planId") REFERENCES "Plan"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Subscription"
ADD CONSTRAINT "Subscription_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Subscription"
ADD CONSTRAINT "Subscription_planId_fkey"
FOREIGN KEY ("planId") REFERENCES "Plan"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Entitlement"
ADD CONSTRAINT "Entitlement_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "Permission" ("id", "key", "description", "createdAt", "updatedAt")
VALUES
  (
    'permission_tenant_subscription_read',
    'tenant.subscription.read',
    'Allows reading the current subscription assigned to a tenant.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'permission_tenant_subscription_manage',
    'tenant.subscription.manage',
    'Allows changing the plan and current subscription assigned to a tenant.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'permission_tenant_entitlements_read',
    'tenant.entitlements.read',
    'Allows reading the effective entitlements assigned to a tenant.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("key") DO NOTHING;

INSERT INTO "RolePermission" ("id", "roleId", "permissionId", "createdAt")
VALUES
  (
    'role_permission_owner_subscription_read',
    'role_tenant_owner',
    'permission_tenant_subscription_read',
    CURRENT_TIMESTAMP
  ),
  (
    'role_permission_owner_subscription_manage',
    'role_tenant_owner',
    'permission_tenant_subscription_manage',
    CURRENT_TIMESTAMP
  ),
  (
    'role_permission_owner_entitlements_read',
    'role_tenant_owner',
    'permission_tenant_entitlements_read',
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("roleId", "permissionId") DO NOTHING;

INSERT INTO "Plan" ("id", "key", "name", "description", "priceInCents", "currency", "billingCycle", "isActive", "createdAt", "updatedAt")
VALUES
  ('plan_starter_monthly', 'starter', 'Starter', 'Plan inicial para equipos pequenos y una operacion principal.', 2900, 'USD', 'monthly', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('plan_growth_monthly', 'growth', 'Growth', 'Plan para equipos en crecimiento con multiples capacidades activas.', 9900, 'USD', 'monthly', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('plan_enterprise_monthly', 'enterprise', 'Enterprise', 'Plan avanzado con acceso amplio a productos y limites elevados.', 29900, 'USD', 'monthly', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "priceInCents" = EXCLUDED."priceInCents",
  "currency" = EXCLUDED."currency",
  "billingCycle" = EXCLUDED."billingCycle",
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "PlanEntitlement" ("id", "planId", "key", "value", "createdAt", "updatedAt")
VALUES
  ('plan_entitlement_starter_products', 'plan_starter_monthly', 'products', '["invoicing"]'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('plan_entitlement_starter_max_users', 'plan_starter_monthly', 'max_users', '3'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('plan_entitlement_starter_ai_enabled', 'plan_starter_monthly', 'ai_enabled', 'false'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('plan_entitlement_starter_storage', 'plan_starter_monthly', 'storage_limit_gb', '5'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('plan_entitlement_growth_products', 'plan_growth_monthly', 'products', '["invoicing","learning"]'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('plan_entitlement_growth_max_users', 'plan_growth_monthly', 'max_users', '15'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('plan_entitlement_growth_ai_enabled', 'plan_growth_monthly', 'ai_enabled', 'true'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('plan_entitlement_growth_storage', 'plan_growth_monthly', 'storage_limit_gb', '50'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('plan_entitlement_enterprise_products', 'plan_enterprise_monthly', 'products', '["invoicing","psychology","learning","ecommerce"]'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('plan_entitlement_enterprise_max_users', 'plan_enterprise_monthly', 'max_users', '100'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('plan_entitlement_enterprise_ai_enabled', 'plan_enterprise_monthly', 'ai_enabled', 'true'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('plan_entitlement_enterprise_storage', 'plan_enterprise_monthly', 'storage_limit_gb', '500'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('plan_entitlement_enterprise_custom_domains', 'plan_enterprise_monthly', 'custom_domains', 'true'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("planId", "key") DO UPDATE
SET
  "value" = EXCLUDED."value",
  "updatedAt" = CURRENT_TIMESTAMP;

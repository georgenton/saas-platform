INSERT INTO "Product" ("id", "key", "name", "description", "isActive", "createdAt", "updatedAt")
VALUES
  (
    'product_accounting',
    'accounting',
    'Accounting',
    'Plan de cuentas, intake contable y futuros libros formales derivados de evidencia tributaria.',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("key") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "PlatformModule" ("id", "productId", "key", "name", "description", "isCore", "isActive", "createdAt", "updatedAt")
VALUES
  (
    'module_accounting_foundation',
    'product_accounting',
    'foundation',
    'Foundation',
    'Plan de cuentas, intake y readiness inicial para contabilidad formal.',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'module_accounting_tax_bridge',
    'product_accounting',
    'tax-bridge',
    'Tax Bridge',
    'Entrada contable desde Tax Compliance EC sin mover ownership tributario.',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("productId", "key") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "isCore" = EXCLUDED."isCore",
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "Permission" ("id", "key", "description", "createdAt", "updatedAt")
VALUES
  (
    'permission_accounting_read',
    'accounting.read',
    'Allows reading Accounting intake and foundation workspaces.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("key") DO UPDATE
SET
  "description" = EXCLUDED."description",
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "RolePermission" ("id", "roleId", "permissionId", "createdAt")
VALUES
  (
    'role_permission_owner_accounting_read',
    'role_tenant_owner',
    'permission_accounting_read',
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("roleId", "permissionId") DO NOTHING;

UPDATE "PlanEntitlement"
SET
  "value" =
    CASE
      WHEN NOT ("value" ? 'accounting')
        THEN "value" || '["accounting"]'::jsonb
      ELSE "value"
    END,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "key" = 'products'
  AND "planId" = 'plan_enterprise_monthly';

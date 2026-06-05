INSERT INTO "Product" ("id", "key", "name", "description", "isActive", "createdAt", "updatedAt")
VALUES
  (
    'product_tax_compliance_ec',
    'tax-compliance-ec',
    'Tax Compliance EC',
    'Obligaciones tributarias, evidencia fiscal, anexos y cierre operacional para Ecuador.',
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
    'module_tax_compliance_ec_periods',
    'product_tax_compliance_ec',
    'periods',
    'Tax Periods',
    'Workspaces, calendarios, readiness y cierre por periodo.',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'module_tax_compliance_ec_obligations',
    'product_tax_compliance_ec',
    'obligations',
    'Obligations',
    'Matriz y configuracion de obligaciones tributarias Ecuador.',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'module_tax_compliance_ec_evidence',
    'product_tax_compliance_ec',
    'evidence',
    'Evidence',
    'Carpeta fiscal, compras, ventas, retenciones y soportes.',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'module_tax_compliance_ec_closeout',
    'product_tax_compliance_ec',
    'closeout',
    'Closeout',
    'Aprobacion, handoff externo, asistente y reporte final.',
    false,
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
    'permission_tax_compliance_ec_read',
    'tax-compliance.ec.read',
    'Allows reading Ecuador tax compliance workspaces and reports.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'permission_tax_compliance_ec_manage',
    'tax-compliance.ec.manage',
    'Allows managing Ecuador tax compliance settings, evidence and transitions.',
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
    'role_permission_owner_tax_compliance_ec_read',
    'role_tenant_owner',
    'permission_tax_compliance_ec_read',
    CURRENT_TIMESTAMP
  ),
  (
    'role_permission_owner_tax_compliance_ec_manage',
    'role_tenant_owner',
    'permission_tax_compliance_ec_manage',
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("roleId", "permissionId") DO NOTHING;

UPDATE "PlanEntitlement"
SET
  "value" =
    CASE
      WHEN NOT ("value" ? 'tax-compliance-ec')
        THEN "value" || '["tax-compliance-ec"]'::jsonb
      ELSE "value"
    END,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "key" = 'products'
  AND "planId" IN ('plan_growth_monthly', 'plan_enterprise_monthly');

UPDATE "Entitlement"
SET
  "value" =
    CASE
      WHEN NOT ("value" ? 'tax-compliance-ec')
        THEN "value" || '["tax-compliance-ec"]'::jsonb
      ELSE "value"
    END,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "key" = 'products'
  AND "value" ? 'invoicing';

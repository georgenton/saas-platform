INSERT INTO "Permission" ("id", "key", "description", "createdAt", "updatedAt")
VALUES (
  'permission_invoicing_reports_read',
  'invoicing.reports.read',
  'Read invoicing reporting summaries and analytics snapshots.',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "RolePermission" ("id", "roleKey", "permissionKey", "createdAt")
VALUES (
  'role_permission_owner_invoicing_reports_read',
  'tenant_owner',
  'invoicing.reports.read',
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;

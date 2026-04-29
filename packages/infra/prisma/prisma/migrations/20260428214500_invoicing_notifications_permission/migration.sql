INSERT INTO "Permission" ("id", "key", "description", "createdAt", "updatedAt")
VALUES (
  'permission_invoicing_notifications_send',
  'invoicing.notifications.send',
  'Send invoicing notifications and invoice delivery emails.',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "RolePermission" ("id", "roleId", "permissionId", "createdAt")
VALUES (
  'role_permission_owner_invoicing_notifications_send',
  'role_tenant_owner',
  'permission_invoicing_notifications_send',
  CURRENT_TIMESTAMP
)
ON CONFLICT ("roleId", "permissionId") DO NOTHING;

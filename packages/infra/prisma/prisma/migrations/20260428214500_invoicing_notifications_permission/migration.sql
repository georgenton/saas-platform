INSERT INTO "Permission" ("id", "key", "description", "createdAt", "updatedAt")
VALUES (
  'permission_invoicing_notifications_send',
  'invoicing.notifications.send',
  'Send invoicing notifications and invoice delivery emails.',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "RolePermission" ("id", "roleKey", "permissionKey", "createdAt")
VALUES (
  'role_permission_owner_invoicing_notifications_send',
  'tenant_owner',
  'invoicing.notifications.send',
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;

-- Backfill invitation management permission for environments that applied
-- the invitation schema migration before the seed statements were added.
INSERT INTO "Permission" ("id", "key", "description", "createdAt", "updatedAt")
VALUES (
  'permission_tenant_invitations_manage',
  'tenant.invitations.manage',
  'Allows creating onboarding invitations for tenant members.',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("key") DO NOTHING;

INSERT INTO "RolePermission" ("id", "roleId", "permissionId", "createdAt")
VALUES (
  'role_permission_owner_invitations_manage',
  'role_tenant_owner',
  'permission_tenant_invitations_manage',
  CURRENT_TIMESTAMP
)
ON CONFLICT ("roleId", "permissionId") DO NOTHING;

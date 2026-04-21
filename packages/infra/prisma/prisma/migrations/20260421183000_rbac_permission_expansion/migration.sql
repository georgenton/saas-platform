-- SeedAdditionalPermissions
INSERT INTO "Permission" ("id", "key", "description", "createdAt", "updatedAt")
VALUES
  ('permission_tenant_memberships_access_read', 'tenant.memberships.access.read', 'Allows reading effective access for a tenant membership.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('permission_tenant_memberships_roles_manage', 'tenant.memberships.roles.manage', 'Allows assigning and removing roles for tenant memberships.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;

-- SeedAdditionalRolePermissions
INSERT INTO "RolePermission" ("id", "roleId", "permissionId", "createdAt")
VALUES
  ('role_permission_owner_memberships_access_read', 'role_tenant_owner', 'permission_tenant_memberships_access_read', CURRENT_TIMESTAMP),
  ('role_permission_owner_memberships_roles_manage', 'role_tenant_owner', 'permission_tenant_memberships_roles_manage', CURRENT_TIMESTAMP)
ON CONFLICT ("roleId", "permissionId") DO NOTHING;

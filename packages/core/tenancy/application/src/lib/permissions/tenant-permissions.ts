export const TENANCY_PERMISSION_CATALOG = {
  tenant: {
    read: 'tenant.read',
  },
  memberships: {
    read: 'tenant.memberships.read',
    accessRead: 'tenant.memberships.access.read',
    rolesManage: 'tenant.memberships.roles.manage',
  },
  invitations: {
    manage: 'tenant.invitations.manage',
  },
} as const;

export const TENANT_PERMISSIONS = {
  READ: TENANCY_PERMISSION_CATALOG.tenant.read,
  MEMBERSHIPS_READ: TENANCY_PERMISSION_CATALOG.memberships.read,
  MEMBERSHIP_ACCESS_READ:
    TENANCY_PERMISSION_CATALOG.memberships.accessRead,
  MEMBERSHIP_ROLES_MANAGE:
    TENANCY_PERMISSION_CATALOG.memberships.rolesManage,
  INVITATIONS_MANAGE: TENANCY_PERMISSION_CATALOG.invitations.manage,
} as const;

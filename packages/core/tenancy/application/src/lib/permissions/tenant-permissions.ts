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
  subscription: {
    read: 'tenant.subscription.read',
    manage: 'tenant.subscription.manage',
  },
  entitlements: {
    read: 'tenant.entitlements.read',
  },
  featureFlags: {
    read: 'tenant.feature-flags.read',
    manage: 'tenant.feature-flags.manage',
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
  SUBSCRIPTION_READ: TENANCY_PERMISSION_CATALOG.subscription.read,
  SUBSCRIPTION_MANAGE: TENANCY_PERMISSION_CATALOG.subscription.manage,
  ENTITLEMENTS_READ: TENANCY_PERMISSION_CATALOG.entitlements.read,
  FEATURE_FLAGS_READ: TENANCY_PERMISSION_CATALOG.featureFlags.read,
  FEATURE_FLAGS_MANAGE: TENANCY_PERMISSION_CATALOG.featureFlags.manage,
} as const;

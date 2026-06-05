export const TAX_COMPLIANCE_PERMISSION_CATALOG = {
  ec: {
    read: 'tax-compliance.ec.read',
    manage: 'tax-compliance.ec.manage',
  },
} as const;

export const TAX_COMPLIANCE_PERMISSIONS = {
  EC_READ: TAX_COMPLIANCE_PERMISSION_CATALOG.ec.read,
  EC_MANAGE: TAX_COMPLIANCE_PERMISSION_CATALOG.ec.manage,
} as const;

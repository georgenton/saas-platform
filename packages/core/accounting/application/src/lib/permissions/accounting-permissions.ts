export const ACCOUNTING_PERMISSION_CATALOG = {
  read: 'accounting.read',
  manage: 'accounting.manage',
} as const;

export const ACCOUNTING_PERMISSIONS = {
  READ: ACCOUNTING_PERMISSION_CATALOG.read,
  MANAGE: ACCOUNTING_PERMISSION_CATALOG.manage,
} as const;

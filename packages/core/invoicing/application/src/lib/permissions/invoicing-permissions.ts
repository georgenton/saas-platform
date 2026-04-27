export const INVOICING_PERMISSION_CATALOG = {
  customers: {
    read: 'invoicing.customers.read',
    manage: 'invoicing.customers.manage',
  },
  invoices: {
    read: 'invoicing.invoices.read',
    manage: 'invoicing.invoices.manage',
  },
} as const;

export const INVOICING_PERMISSIONS = {
  CUSTOMERS_READ: INVOICING_PERMISSION_CATALOG.customers.read,
  CUSTOMERS_MANAGE: INVOICING_PERMISSION_CATALOG.customers.manage,
  INVOICES_READ: INVOICING_PERMISSION_CATALOG.invoices.read,
  INVOICES_MANAGE: INVOICING_PERMISSION_CATALOG.invoices.manage,
} as const;

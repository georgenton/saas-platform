export const INVOICING_PERMISSION_CATALOG = {
  customers: {
    read: 'invoicing.customers.read',
    manage: 'invoicing.customers.manage',
  },
  invoices: {
    read: 'invoicing.invoices.read',
    manage: 'invoicing.invoices.manage',
  },
  taxes: {
    read: 'invoicing.taxes.read',
    manage: 'invoicing.taxes.manage',
  },
  notifications: {
    send: 'invoicing.notifications.send',
  },
  reports: {
    read: 'invoicing.reports.read',
  },
  payments: {
    read: 'invoicing.payments.read',
    manage: 'invoicing.payments.manage',
  },
} as const;

export const INVOICING_PERMISSIONS = {
  CUSTOMERS_READ: INVOICING_PERMISSION_CATALOG.customers.read,
  CUSTOMERS_MANAGE: INVOICING_PERMISSION_CATALOG.customers.manage,
  INVOICES_READ: INVOICING_PERMISSION_CATALOG.invoices.read,
  INVOICES_MANAGE: INVOICING_PERMISSION_CATALOG.invoices.manage,
  TAXES_READ: INVOICING_PERMISSION_CATALOG.taxes.read,
  TAXES_MANAGE: INVOICING_PERMISSION_CATALOG.taxes.manage,
  NOTIFICATIONS_SEND: INVOICING_PERMISSION_CATALOG.notifications.send,
  REPORTS_READ: INVOICING_PERMISSION_CATALOG.reports.read,
  PAYMENTS_READ: INVOICING_PERMISSION_CATALOG.payments.read,
  PAYMENTS_MANAGE: INVOICING_PERMISSION_CATALOG.payments.manage,
} as const;

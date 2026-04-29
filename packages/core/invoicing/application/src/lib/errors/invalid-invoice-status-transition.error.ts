import { InvoiceStatus } from '@saas-platform/invoicing-domain';

export class InvalidInvoiceStatusTransitionError extends Error {
  constructor(
    tenantSlug: string,
    invoiceId: string,
    currentStatus: InvoiceStatus,
    nextStatus: InvoiceStatus,
  ) {
    super(
      `Invoice "${invoiceId}" in tenant "${tenantSlug}" cannot transition from "${currentStatus}" to "${nextStatus}".`,
    );
  }
}

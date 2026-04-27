export class InvoiceNotFoundError extends Error {
  constructor(tenantSlug: string, invoiceId: string) {
    super(`Invoice "${invoiceId}" was not found for tenant "${tenantSlug}".`);
  }
}

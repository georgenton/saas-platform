export class InvoiceItemNotFoundError extends Error {
  constructor(tenantSlug: string, itemId: string) {
    super(
      `Invoice item "${itemId}" was not found for tenant "${tenantSlug}".`,
    );
  }
}

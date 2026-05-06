export class InvoiceNumberRequiredError extends Error {
  constructor(tenantSlug: string) {
    super(
      `Invoice number is required when no numbering settings exist for tenant "${tenantSlug}".`,
    );
  }
}

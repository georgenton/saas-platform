export class InvalidInvoiceElectronicStatusError extends Error {
  constructor(tenantSlug: string, invoiceId: string) {
    super(
      `Invoice "${invoiceId}" in tenant "${tenantSlug}" must be issued before electronic authorization can be updated.`,
    );
    this.name = 'InvalidInvoiceElectronicStatusError';
  }
}

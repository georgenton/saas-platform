export class InvalidInvoiceElectronicAuthorizationStateError extends Error {
  constructor(tenantSlug: string, invoiceId: string) {
    super(
      `Invoice "${invoiceId}" in tenant "${tenantSlug}" is not in a valid electronic state to check authorization.`,
    );
    this.name = 'InvalidInvoiceElectronicAuthorizationStateError';
  }
}

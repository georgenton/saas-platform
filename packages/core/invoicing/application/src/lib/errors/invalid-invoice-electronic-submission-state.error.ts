export class InvalidInvoiceElectronicSubmissionStateError extends Error {
  constructor(tenantSlug: string, invoiceId: string) {
    super(
      `Invoice "${invoiceId}" in tenant "${tenantSlug}" is not in a valid commercial state for electronic signing and submission.`,
    );
    this.name = 'InvalidInvoiceElectronicSubmissionStateError';
  }
}

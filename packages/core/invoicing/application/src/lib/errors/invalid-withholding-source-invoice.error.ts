export class InvalidWithholdingSourceInvoiceError extends Error {
  constructor(
    tenantSlug: string,
    sourceInvoiceId: string,
  ) {
    super(
      `Invoice "${sourceInvoiceId}" in tenant "${tenantSlug}" cannot be used as the support document for a withholding certificate.`,
    );
    this.name = 'InvalidWithholdingSourceInvoiceError';
  }
}

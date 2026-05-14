export class InvalidRemissionGuideSourceInvoiceError extends Error {
  constructor(tenantSlug: string, invoiceId: string) {
    super(
      `Invoice "${invoiceId}" in tenant "${tenantSlug}" cannot be used as the source document for an Ecuador remission guide.`,
    );

    this.name = 'InvalidRemissionGuideSourceInvoiceError';
  }
}

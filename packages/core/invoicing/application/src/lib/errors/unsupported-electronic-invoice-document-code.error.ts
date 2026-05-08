export class UnsupportedElectronicInvoiceDocumentCodeError extends Error {
  constructor(
    tenantSlug: string,
    invoiceId: string,
    documentCode: string | null,
    operation = 'electronic submission',
  ) {
    super(
      `Invoice "${invoiceId}" in tenant "${tenantSlug}" uses document code "${documentCode ?? 'unknown'}", which is not yet supported for ${operation}.`,
    );
    this.name = 'UnsupportedElectronicInvoiceDocumentCodeError';
  }
}

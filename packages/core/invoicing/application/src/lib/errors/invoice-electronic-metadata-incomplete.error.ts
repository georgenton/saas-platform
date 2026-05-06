export class InvoiceElectronicMetadataIncompleteError extends Error {
  constructor(tenantSlug: string, invoiceId: string) {
    super(
      `Invoice "${invoiceId}" in tenant "${tenantSlug}" is missing Ecuador electronic metadata required to generate the access key.`,
    );
    this.name = 'InvoiceElectronicMetadataIncompleteError';
  }
}

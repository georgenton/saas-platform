export class InvoiceElectronicSignatureMaterialIncompleteError extends Error {
  constructor(tenantSlug: string, invoiceId: string) {
    super(
      `Electronic signature material references are incomplete for tenant "${tenantSlug}" before signing invoice "${invoiceId}".`,
    );
  }
}

export class InvoiceElectronicSignatureNotConfiguredError extends Error {
  constructor(tenantSlug: string, invoiceId: string) {
    super(
      `Electronic signature settings are required before invoice "${invoiceId}" can be signed for tenant "${tenantSlug}".`,
    );
  }
}

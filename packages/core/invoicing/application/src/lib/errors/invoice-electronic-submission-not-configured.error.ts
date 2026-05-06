export class InvoiceElectronicSubmissionNotConfiguredError extends Error {
  constructor(tenantSlug: string, invoiceId: string) {
    super(
      `Electronic submission settings are required before invoice "${invoiceId}" can be sent for tenant "${tenantSlug}".`,
    );
  }
}

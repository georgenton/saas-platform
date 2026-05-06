export class InvoiceElectronicSubmissionGatewayIncompleteError extends Error {
  constructor(tenantSlug: string, invoiceId: string) {
    super(
      `Electronic submission gateway configuration is incomplete for tenant "${tenantSlug}" before sending invoice "${invoiceId}".`,
    );
  }
}

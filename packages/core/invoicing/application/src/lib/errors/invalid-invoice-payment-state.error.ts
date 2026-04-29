export class InvalidInvoicePaymentStateError extends Error {
  constructor(tenantSlug: string, invoiceId: string, status: string) {
    super(
      `Invoice "${invoiceId}" in tenant "${tenantSlug}" cannot receive payments while in "${status}" status.`,
    );
  }
}

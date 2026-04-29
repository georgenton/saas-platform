export class InvalidPaymentReversalStateError extends Error {
  constructor(tenantSlug: string, invoiceId: string, paymentId: string) {
    super(
      `Payment "${paymentId}" for invoice "${invoiceId}" in tenant "${tenantSlug}" can no longer be reversed.`,
    );
  }
}

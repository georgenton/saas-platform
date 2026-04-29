export class PaymentNotFoundError extends Error {
  constructor(tenantSlug: string, invoiceId: string, paymentId: string) {
    super(
      `Payment "${paymentId}" for invoice "${invoiceId}" in tenant "${tenantSlug}" was not found.`,
    );
  }
}

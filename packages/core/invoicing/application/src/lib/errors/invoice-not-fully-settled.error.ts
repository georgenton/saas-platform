export class InvoiceNotFullySettledError extends Error {
  constructor(tenantSlug: string, invoiceId: string, balanceDueInCents: number) {
    super(
      `Invoice "${invoiceId}" for tenant "${tenantSlug}" still has ${balanceDueInCents} cents pending and cannot be marked as paid.`,
    );
  }
}

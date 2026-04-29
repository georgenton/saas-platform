export class InvoicePaymentExceedsBalanceError extends Error {
  constructor(
    tenantSlug: string,
    invoiceId: string,
    amountInCents: number,
    balanceDueInCents: number,
  ) {
    super(
      `Payment amount ${amountInCents} exceeds the remaining balance ${balanceDueInCents} for invoice "${invoiceId}" in tenant "${tenantSlug}".`,
    );
  }
}

export class AccountingAccountantReviewNotFoundError extends Error {
  constructor(
    readonly tenantSlug: string,
    readonly reviewId: string,
  ) {
    super(
      `Accounting accountant review ${reviewId} was not found for tenant ${tenantSlug}.`,
    );
    this.name = 'AccountingAccountantReviewNotFoundError';
  }
}

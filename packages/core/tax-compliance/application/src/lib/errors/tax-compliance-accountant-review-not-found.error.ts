export class TaxComplianceAccountantReviewNotFoundError extends Error {
  constructor(
    readonly tenantSlug: string,
    readonly reviewId: string,
  ) {
    super(
      `Tax compliance accountant review "${reviewId}" was not found for tenant "${tenantSlug}".`,
    );
    this.name = 'TaxComplianceAccountantReviewNotFoundError';
  }
}

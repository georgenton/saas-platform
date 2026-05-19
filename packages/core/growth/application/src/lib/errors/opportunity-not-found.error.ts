export class OpportunityNotFoundError extends Error {
  constructor(
    readonly tenantSlug: string,
    readonly opportunityId: string,
  ) {
    super(
      `Opportunity "${opportunityId}" was not found for tenant "${tenantSlug}".`,
    );
  }
}

export class GrowthOperationalCaseNotFoundError extends Error {
  constructor(
    public readonly tenantSlug: string,
    public readonly caseId: string,
  ) {
    super(
      `Growth operational case "${caseId}" was not found for tenant "${tenantSlug}".`,
    );
  }
}

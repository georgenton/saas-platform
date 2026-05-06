export class ElectronicSubmissionSettingsNotFoundError extends Error {
  constructor(tenantSlug: string) {
    super(
      `Electronic submission settings were not found for tenant "${tenantSlug}".`,
    );
  }
}

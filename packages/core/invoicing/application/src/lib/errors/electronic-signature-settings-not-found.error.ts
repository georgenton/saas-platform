export class ElectronicSignatureSettingsNotFoundError extends Error {
  constructor(tenantSlug: string) {
    super(
      `Electronic signature settings were not found for tenant "${tenantSlug}".`,
    );
  }
}

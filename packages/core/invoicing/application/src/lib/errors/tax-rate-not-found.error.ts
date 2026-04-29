export class TaxRateNotFoundError extends Error {
  constructor(tenantSlug: string, taxRateId: string) {
    super(`Tax rate "${taxRateId}" was not found in tenant "${tenantSlug}".`);
  }
}

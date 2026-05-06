export class IssuerProfileNotFoundError extends Error {
  constructor(tenantSlug: string) {
    super(`Issuer profile was not found for tenant "${tenantSlug}".`);
  }
}

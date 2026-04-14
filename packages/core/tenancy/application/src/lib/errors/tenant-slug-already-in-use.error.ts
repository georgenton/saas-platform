export class TenantSlugAlreadyInUseError extends Error {
  constructor(slug: string) {
    super(`Tenant slug "${slug}" is already in use.`);
    this.name = 'TenantSlugAlreadyInUseError';
  }
}

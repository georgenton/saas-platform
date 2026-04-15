export class TenantNotFoundError extends Error {
  constructor(slug: string) {
    super(`Tenant "${slug}" was not found.`);
    this.name = 'TenantNotFoundError';
  }
}

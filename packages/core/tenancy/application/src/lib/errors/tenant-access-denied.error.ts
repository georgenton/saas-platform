export class TenantAccessDeniedError extends Error {
  constructor(slug: string, userId: string) {
    super(`User "${userId}" cannot access tenant "${slug}".`);
    this.name = 'TenantAccessDeniedError';
  }
}

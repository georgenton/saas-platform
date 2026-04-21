export class AuthenticatedSessionTenantNotFoundError extends Error {
  constructor(tenantSlug: string) {
    super(
      `Authenticated user does not have access to tenant "${tenantSlug}" in the current session.`,
    );
    this.name = 'AuthenticatedSessionTenantNotFoundError';
  }
}

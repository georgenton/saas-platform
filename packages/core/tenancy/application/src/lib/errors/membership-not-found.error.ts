export class MembershipNotFoundError extends Error {
  constructor(tenantSlug: string, userId: string) {
    super(`Membership for user "${userId}" was not found in tenant "${tenantSlug}".`);
    this.name = 'MembershipNotFoundError';
  }
}

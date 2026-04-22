export class MembershipAlreadyExistsError extends Error {
  constructor(tenantSlug: string, userId: string) {
    super(`User "${userId}" is already a member of tenant "${tenantSlug}".`);
    this.name = 'MembershipAlreadyExistsError';
  }
}

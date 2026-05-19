export class GrowthAssigneeMembershipNotFoundError extends Error {
  constructor(tenantSlug: string, userId: string) {
    super(
      `User "${userId}" is not an active member of tenant "${tenantSlug}" and cannot be assigned.`,
    );
  }
}

export interface MembershipRoleRepository {
  assignRole(
    membershipId: string,
    roleKey: string,
    assignedAt: Date,
  ): Promise<void>;
  countMembershipsWithRole(tenantId: string, roleKey: string): Promise<number>;
  hasRole(membershipId: string, roleKey: string): Promise<boolean>;
  removeRole(membershipId: string, roleKey: string): Promise<void>;
}

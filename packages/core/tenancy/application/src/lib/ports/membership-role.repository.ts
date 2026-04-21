export interface MembershipRoleRepository {
  assignRole(
    membershipId: string,
    roleKey: string,
    assignedAt: Date,
  ): Promise<void>;
  removeRole(membershipId: string, roleKey: string): Promise<void>;
}

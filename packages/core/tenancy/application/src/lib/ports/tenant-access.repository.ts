export interface TenantAccessRecord {
  membershipId: string;
  membershipStatus: string;
  roleKeys: string[];
  permissionKeys: string[];
}

export interface TenantAccessRepository {
  findByTenantAndUser(
    tenantId: string,
    userId: string,
  ): Promise<TenantAccessRecord | null>;
}

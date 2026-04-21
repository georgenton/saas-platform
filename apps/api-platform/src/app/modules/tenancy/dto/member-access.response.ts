import { TenantMemberAccessView } from '@saas-platform/tenancy-application';

export interface MemberAccessResponseDto {
  userId: string;
  membershipId: string;
  membershipStatus: string;
  roleKeys: string[];
  permissionKeys: string[];
}

export const toMemberAccessResponseDto = (
  access: TenantMemberAccessView,
): MemberAccessResponseDto => ({
  userId: access.userId,
  membershipId: access.membershipId,
  membershipStatus: access.membershipStatus,
  roleKeys: access.roleKeys,
  permissionKeys: access.permissionKeys,
});

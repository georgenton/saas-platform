import { Membership } from '@saas-platform/tenancy-domain';

export interface MembershipResponseDto {
  id: string;
  tenantId: string;
  userId: string;
  status: string;
  invitedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export function toMembershipResponseDto(
  membership: Membership,
): MembershipResponseDto {
  const data = membership.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    userId: data.userId,
    status: data.status,
    invitedBy: data.invitedBy ?? null,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
}

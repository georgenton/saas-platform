import { Invitation } from '@saas-platform/tenancy-domain';

export interface InvitationResponseDto {
  id: string;
  tenantId: string;
  email: string;
  roleKey: string;
  status: string;
  invitedByUserId: string;
  acceptedByUserId: string | null;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const toInvitationResponseDto = (
  invitation: Invitation,
): InvitationResponseDto => {
  const data = invitation.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    email: data.email,
    roleKey: data.roleKey,
    status: data.status,
    invitedByUserId: data.invitedByUserId,
    acceptedByUserId: data.acceptedByUserId ?? null,
    expiresAt: data.expiresAt.toISOString(),
    acceptedAt: data.acceptedAt?.toISOString() ?? null,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};

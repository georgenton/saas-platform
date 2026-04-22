import { AuthenticatedUserInvitationView } from '@saas-platform/tenancy-application';

export interface AuthenticatedInvitationResponse {
  invitation: {
    id: string;
    email: string;
    roleKey: string;
    status: string;
    invitedByUserId: string;
    acceptedByUserId: string | null;
    expiresAt: string;
    acceptedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  tenant: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
  canAccept: boolean;
}

export const toAuthenticatedInvitationResponse = (
  view: AuthenticatedUserInvitationView,
): AuthenticatedInvitationResponse => {
  const invitation = view.invitation.toPrimitives();

  return {
    invitation: {
      id: invitation.id,
      email: invitation.email,
      roleKey: invitation.roleKey,
      status: invitation.status,
      invitedByUserId: invitation.invitedByUserId,
      acceptedByUserId: invitation.acceptedByUserId ?? null,
      expiresAt: invitation.expiresAt.toISOString(),
      acceptedAt: invitation.acceptedAt?.toISOString() ?? null,
      createdAt: invitation.createdAt.toISOString(),
      updatedAt: invitation.updatedAt.toISOString(),
    },
    tenant: {
      id: view.tenant.id,
      name: view.tenant.name,
      slug: view.tenant.slug,
      status: view.tenant.status,
    },
    canAccept: view.canAccept,
  };
};

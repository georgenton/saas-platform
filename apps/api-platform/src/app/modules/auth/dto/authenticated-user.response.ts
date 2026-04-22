import { AuthenticatedSessionView } from '../resolve-authenticated-session.use-case';
import { AuthenticatedUserContext } from '../authenticated-user-context';

export interface AuthenticatedUserTenancyResponse {
  tenant: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
  membership: {
    id: string;
    status: string;
    invitedBy: string | null;
    createdAt: string;
    updatedAt: string;
  };
  roleKeys: string[];
  permissionKeys: string[];
}

export interface AuthenticatedUserPendingInvitationResponse {
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
}

export interface AuthenticatedUserResponse {
  id: string;
  email: string | null;
  provider: string | null;
  externalAuthId: string | null;
  currentTenancy: AuthenticatedUserTenancyResponse | null;
  pendingInvitations: AuthenticatedUserPendingInvitationResponse[];
  tenancies: AuthenticatedUserTenancyResponse[];
}

const toTenancyResponse = (
  tenancy: AuthenticatedSessionView['tenancies'][number],
): AuthenticatedUserTenancyResponse => {
  const membership = tenancy.membership.toPrimitives();

  return {
    tenant: {
      id: tenancy.tenant.id,
      name: tenancy.tenant.name,
      slug: tenancy.tenant.slug,
      status: tenancy.tenant.status,
    },
    membership: {
      id: membership.id,
      status: membership.status,
      invitedBy: membership.invitedBy ?? null,
      createdAt: membership.createdAt.toISOString(),
      updatedAt: membership.updatedAt.toISOString(),
    },
    roleKeys: tenancy.roleKeys,
    permissionKeys: tenancy.permissionKeys,
  };
};

export const toAuthenticatedUserResponse = (
  session: AuthenticatedSessionView,
): AuthenticatedUserResponse => ({
  id: session.authenticatedUser.id,
  email: session.authenticatedUser.email,
  provider: session.authenticatedUser.provider,
  externalAuthId: session.authenticatedUser.externalAuthId,
  currentTenancy: session.currentTenancy
    ? toTenancyResponse(session.currentTenancy)
    : null,
  pendingInvitations: session.pendingInvitations.map((view) => {
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
    };
  }),
  tenancies: session.tenancies.map((tenancy) => {
    const membership = tenancy.membership.toPrimitives();

    return {
      tenant: {
        id: tenancy.tenant.id,
        name: tenancy.tenant.name,
        slug: tenancy.tenant.slug,
        status: tenancy.tenant.status,
      },
      membership: {
        id: membership.id,
        status: membership.status,
        invitedBy: membership.invitedBy ?? null,
        createdAt: membership.createdAt.toISOString(),
        updatedAt: membership.updatedAt.toISOString(),
      },
      roleKeys: tenancy.roleKeys,
      permissionKeys: tenancy.permissionKeys,
    };
  }),
});

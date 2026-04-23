import { Entitlement, Subscription } from '@saas-platform/commercial-domain';
import { AuthenticatedSessionView } from '../resolve-authenticated-session.use-case';

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
  subscription?: AuthenticatedUserSubscriptionResponse | null;
  entitlements?: AuthenticatedUserEntitlementResponse[];
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
  sessionState: {
    canSelectTenancy: boolean;
    hasPendingInvitations: boolean;
    hasTenancies: boolean;
    recommendedFlow:
      | 'workspace'
      | 'select-tenancy'
      | 'accept-invitation'
      | 'empty';
  };
  tenancies: AuthenticatedUserTenancyResponse[];
}

export interface AuthenticatedUserSubscriptionResponse {
  id: string;
  tenantId: string;
  planId: string;
  status: string;
  startedAt: string;
  expiresAt: string | null;
  trialEndsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthenticatedUserEntitlementResponse {
  id: string;
  tenantId: string;
  key: string;
  value: unknown;
  source: string;
  createdAt: string;
  updatedAt: string;
}

const toSubscriptionResponse = (
  subscription: Subscription,
): AuthenticatedUserSubscriptionResponse => ({
  id: subscription.id,
  tenantId: subscription.tenantId,
  planId: subscription.planId,
  status: subscription.status,
  startedAt: subscription.startedAt.toISOString(),
  expiresAt: subscription.expiresAt?.toISOString() ?? null,
  trialEndsAt: subscription.trialEndsAt?.toISOString() ?? null,
  createdAt: subscription.createdAt.toISOString(),
  updatedAt: subscription.updatedAt.toISOString(),
});

const toEntitlementResponse = (
  entitlement: Entitlement,
): AuthenticatedUserEntitlementResponse => ({
  id: entitlement.id,
  tenantId: entitlement.tenantId,
  key: entitlement.key,
  value: entitlement.value,
  source: entitlement.source,
  createdAt: entitlement.createdAt.toISOString(),
  updatedAt: entitlement.updatedAt.toISOString(),
});

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

const toCurrentTenancyResponse = (
  tenancy: NonNullable<AuthenticatedSessionView['currentTenancy']>,
): AuthenticatedUserTenancyResponse => ({
  ...toTenancyResponse(tenancy),
  subscription: tenancy.subscription
    ? toSubscriptionResponse(tenancy.subscription)
    : null,
  entitlements: tenancy.entitlements.map((entitlement) =>
    toEntitlementResponse(entitlement),
  ),
});

export const toAuthenticatedUserResponse = (
  session: AuthenticatedSessionView,
): AuthenticatedUserResponse => ({
  id: session.authenticatedUser.id,
  email: session.authenticatedUser.email,
  provider: session.authenticatedUser.provider,
  externalAuthId: session.authenticatedUser.externalAuthId,
  currentTenancy: session.currentTenancy
    ? toCurrentTenancyResponse(session.currentTenancy)
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
  sessionState: session.sessionState,
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

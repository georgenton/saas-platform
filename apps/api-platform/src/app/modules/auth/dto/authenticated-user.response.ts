import { UserTenancyView } from '@saas-platform/tenancy-application';
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

export interface AuthenticatedUserResponse {
  id: string;
  email: string | null;
  provider: string | null;
  externalAuthId: string | null;
  tenancies: AuthenticatedUserTenancyResponse[];
}

export const toAuthenticatedUserResponse = (
  authenticatedUser: AuthenticatedUserContext,
  tenancies: UserTenancyView[],
): AuthenticatedUserResponse => ({
  id: authenticatedUser.id,
  email: authenticatedUser.email,
  provider: authenticatedUser.provider,
  externalAuthId: authenticatedUser.externalAuthId,
  tenancies: tenancies.map((tenancy) => {
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

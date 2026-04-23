import {
  Entitlement,
  Subscription,
} from '@saas-platform/commercial-domain';
import {
  EntitlementRepository,
  SubscriptionRepository,
} from '@saas-platform/commercial-application';
import {
  ListUserPendingInvitationsUseCase,
  ListUserTenanciesUseCase,
  TENANT_ROLES,
  UserPendingInvitationView,
  UserTenancyView,
} from '@saas-platform/tenancy-application';
import { UserRepository } from '@saas-platform/identity-application';
import { MembershipStatus } from '@saas-platform/tenancy-domain';
import { AuthenticatedUserContext } from './authenticated-user-context';
import { AuthenticatedSessionTenantNotFoundError } from './authenticated-session-tenant-not-found.error';

export interface ResolveAuthenticatedSessionCommand {
  authenticatedUser: AuthenticatedUserContext;
  tenantSlug?: string;
}

export interface AuthenticatedSessionView {
  authenticatedUser: AuthenticatedUserContext;
  currentTenancy: AuthenticatedSessionTenancyView | null;
  pendingInvitations: UserPendingInvitationView[];
  sessionState: AuthenticatedSessionState;
  tenancies: UserTenancyView[];
}

export interface AuthenticatedSessionTenancyView extends UserTenancyView {
  entitlements: Entitlement[];
  subscription: Subscription | null;
}

export interface AuthenticatedSessionState {
  canSelectTenancy: boolean;
  hasPendingInvitations: boolean;
  hasTenancies: boolean;
  recommendedFlow:
    | 'workspace'
    | 'select-tenancy'
    | 'accept-invitation'
    | 'empty';
}

export class ResolveAuthenticatedSessionUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly entitlementRepository: EntitlementRepository,
    private readonly listUserTenanciesUseCase: ListUserTenanciesUseCase,
    private readonly listUserPendingInvitationsUseCase: ListUserPendingInvitationsUseCase,
  ) {}

  async execute(
    command: ResolveAuthenticatedSessionCommand,
  ): Promise<AuthenticatedSessionView> {
    const user = await this.userRepository.findById(command.authenticatedUser.id);
    const tenancies = await this.listUserTenanciesUseCase.execute(
      command.authenticatedUser.id,
    );
    const [pendingInvitations, sortedTenancies] = await Promise.all([
      command.authenticatedUser.email
        ? this.listUserPendingInvitationsUseCase.execute(
            command.authenticatedUser.email,
          )
        : Promise.resolve([]),
      Promise.resolve(this.sortTenancies(tenancies)),
    ]);
    const currentTenancy = this.resolveCurrentTenancy(
      sortedTenancies,
      command.tenantSlug,
      user?.preferredTenantId ?? null,
    );
    const enrichedCurrentTenancy = await this.enrichCurrentTenancy(currentTenancy);

    return {
      authenticatedUser: command.authenticatedUser,
      currentTenancy: enrichedCurrentTenancy,
      pendingInvitations,
      sessionState: this.resolveSessionState(
        enrichedCurrentTenancy,
        sortedTenancies,
        pendingInvitations,
      ),
      tenancies: this.prioritizeCurrentTenancy(sortedTenancies, currentTenancy),
    };
  }

  private async enrichCurrentTenancy(
    currentTenancy: UserTenancyView | null,
  ): Promise<AuthenticatedSessionTenancyView | null> {
    if (!currentTenancy) {
      return null;
    }

    const [subscription, entitlements] = await Promise.all([
      this.subscriptionRepository.findByTenantId(currentTenancy.tenant.id),
      this.entitlementRepository.findByTenantId(currentTenancy.tenant.id),
    ]);

    return {
      ...currentTenancy,
      subscription,
      entitlements,
    };
  }

  private resolveSessionState(
    currentTenancy: AuthenticatedSessionTenancyView | null,
    tenancies: UserTenancyView[],
    pendingInvitations: UserPendingInvitationView[],
  ): AuthenticatedSessionState {
    const hasTenancies = tenancies.length > 0;
    const hasPendingInvitations = pendingInvitations.length > 0;
    const canSelectTenancy = tenancies.length > 1;

    if (!hasTenancies && hasPendingInvitations) {
      return {
        canSelectTenancy,
        hasPendingInvitations,
        hasTenancies,
        recommendedFlow: 'accept-invitation',
      };
    }

    if (canSelectTenancy) {
      return {
        canSelectTenancy,
        hasPendingInvitations,
        hasTenancies,
        recommendedFlow: 'select-tenancy',
      };
    }

    if (currentTenancy) {
      return {
        canSelectTenancy,
        hasPendingInvitations,
        hasTenancies,
        recommendedFlow: 'workspace',
      };
    }

    return {
      canSelectTenancy,
      hasPendingInvitations,
      hasTenancies,
      recommendedFlow: 'empty',
    };
  }

  private resolveCurrentTenancy(
    tenancies: UserTenancyView[],
    requestedTenantSlug?: string,
    preferredTenantId?: string | null,
  ): UserTenancyView | null {
    if (tenancies.length === 0) {
      return null;
    }

    if (requestedTenantSlug) {
      const requestedTenancy = tenancies.find(
        (tenancy) => tenancy.tenant.slug === requestedTenantSlug,
      );

      if (!requestedTenancy) {
        throw new AuthenticatedSessionTenantNotFoundError(requestedTenantSlug);
      }

      return requestedTenancy;
    }

    if (preferredTenantId) {
      const preferredTenancy = tenancies.find(
        (tenancy) => tenancy.tenant.id === preferredTenantId,
      );

      if (preferredTenancy) {
        return preferredTenancy;
      }
    }

    return tenancies[0] ?? null;
  }

  private prioritizeCurrentTenancy(
    tenancies: UserTenancyView[],
    currentTenancy: UserTenancyView | null,
  ): UserTenancyView[] {
    if (!currentTenancy) {
      return tenancies;
    }

    return [
      currentTenancy,
      ...tenancies.filter(
        (tenancy) => tenancy.tenant.id !== currentTenancy.tenant.id,
      ),
    ];
  }

  private sortTenancies(tenancies: UserTenancyView[]): UserTenancyView[] {
    return [...tenancies].sort((left, right) => {
      const priorityDelta =
        this.getPriority(right) - this.getPriority(left);

      if (priorityDelta !== 0) {
        return priorityDelta;
      }

      return left.tenant.slug.localeCompare(right.tenant.slug);
    });
  }

  private getPriority(tenancy: UserTenancyView): number {
    let priority = 0;

    if (tenancy.membership.status === MembershipStatus.Active) {
      priority += 10;
    }

    if (tenancy.roleKeys.includes(TENANT_ROLES.OWNER)) {
      priority += 100;
    }

    return priority;
  }
}

import { UserNotFoundError, UserRepository } from '@saas-platform/identity-application';
import {
  AcceptTenantInvitationUseCase,
  InvitationAlreadyProcessedError,
  InvitationEmailMismatchError,
  InvitationExpiredError,
  InvitationNotFoundError,
  MembershipAlreadyExistsError,
  MembershipNotFoundError,
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AuthenticatedUserContext } from './authenticated-user-context';
import {
  AuthenticatedSessionView,
  ResolveAuthenticatedSessionUseCase,
} from './resolve-authenticated-session.use-case';

export interface AcceptAuthenticatedUserInvitationCommand {
  invitationId: string;
  authenticatedUser: AuthenticatedUserContext;
}

export class AcceptAuthenticatedUserInvitationUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly acceptTenantInvitationUseCase: AcceptTenantInvitationUseCase,
    private readonly resolveAuthenticatedSessionUseCase: ResolveAuthenticatedSessionUseCase,
  ) {}

  async execute(
    command: AcceptAuthenticatedUserInvitationCommand,
  ): Promise<AuthenticatedSessionView> {
    const membership = await this.acceptTenantInvitationUseCase.execute({
      invitationId: command.invitationId,
      authenticatedUserId: command.authenticatedUser.id,
      authenticatedUserEmail: command.authenticatedUser.email ?? '',
    });

    const [user, tenant] = await Promise.all([
      this.userRepository.findById(command.authenticatedUser.id),
      this.tenantRepository.findById(membership.tenantId),
    ]);

    if (!user) {
      throw new UserNotFoundError(command.authenticatedUser.id);
    }

    if (!tenant) {
      throw new TenantNotFoundError(membership.tenantId);
    }

    await this.userRepository.save(
      user.setPreferredTenant(new Date(), membership.tenantId),
    );

    return this.resolveAuthenticatedSessionUseCase.execute({
      authenticatedUser: command.authenticatedUser,
      tenantSlug: tenant.slug,
    });
  }
}

export {
  InvitationAlreadyProcessedError,
  InvitationEmailMismatchError,
  InvitationExpiredError,
  InvitationNotFoundError,
  MembershipAlreadyExistsError,
  MembershipNotFoundError,
  UserNotFoundError,
};

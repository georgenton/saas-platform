import { Invitation, InvitationStatus, Tenant } from '@saas-platform/tenancy-domain';
import { InvitationNotFoundError } from '../errors/invitation-not-found.error';
import { InvitationRepository } from '../ports/invitation.repository';
import { TenantRepository } from '../ports/tenant.repository';

export interface AuthenticatedUserInvitationView {
  invitation: Invitation;
  tenant: Tenant;
  canAccept: boolean;
}

export interface GetAuthenticatedUserInvitationCommand {
  invitationId: string;
  authenticatedUserEmail: string;
}

export class GetAuthenticatedUserInvitationUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invitationRepository: InvitationRepository,
  ) {}

  async execute(
    command: GetAuthenticatedUserInvitationCommand,
  ): Promise<AuthenticatedUserInvitationView> {
    const invitation = await this.invitationRepository.findById(
      command.invitationId,
    );

    if (!invitation) {
      throw new InvitationNotFoundError(command.invitationId);
    }

    if (invitation.email !== command.authenticatedUserEmail.trim().toLowerCase()) {
      throw new InvitationNotFoundError(command.invitationId);
    }

    const normalizedInvitation = await this.expireIfNeeded(invitation);
    const tenant = await this.tenantRepository.findById(normalizedInvitation.tenantId);

    if (!tenant) {
      throw new InvitationNotFoundError(command.invitationId);
    }

    return {
      invitation: normalizedInvitation,
      tenant,
      canAccept: normalizedInvitation.status === InvitationStatus.Pending,
    };
  }

  private async expireIfNeeded(invitation: Invitation): Promise<Invitation> {
    if (invitation.status !== InvitationStatus.Pending) {
      return invitation;
    }

    const now = new Date();

    if (invitation.expiresAt.getTime() >= now.getTime()) {
      return invitation;
    }

    const expiredInvitation = invitation.expire(now);
    await this.invitationRepository.save(expiredInvitation);

    return expiredInvitation;
  }
}

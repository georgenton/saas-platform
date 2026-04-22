import { Invitation, InvitationStatus } from '@saas-platform/tenancy-domain';
import { InvitationNotFoundError } from '../errors/invitation-not-found.error';
import { InvitationRepository } from '../ports/invitation.repository';
import { TenantRepository } from '../ports/tenant.repository';
import { TenantNotFoundError } from '../errors/tenant-not-found.error';

export interface GetTenantInvitationByIdCommand {
  tenantSlug: string;
  invitationId: string;
}

export class GetTenantInvitationByIdUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invitationRepository: InvitationRepository,
  ) {}

  async execute(command: GetTenantInvitationByIdCommand): Promise<Invitation> {
    const tenant = await this.tenantRepository.findBySlug(command.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(command.tenantSlug);
    }

    const invitation = await this.invitationRepository.findById(
      command.invitationId,
    );

    if (!invitation || invitation.tenantId !== tenant.id) {
      throw new InvitationNotFoundError(command.invitationId);
    }

    return this.expireIfNeeded(invitation);
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

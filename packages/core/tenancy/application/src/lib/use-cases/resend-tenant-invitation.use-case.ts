import { InvitationStatus, Invitation } from '@saas-platform/tenancy-domain';
import { InvitationAlreadyProcessedError } from '../errors/invitation-already-processed.error';
import { InvitationNotFoundError } from '../errors/invitation-not-found.error';
import { InvitationRepository } from '../ports/invitation.repository';
import { TenantRepository } from '../ports/tenant.repository';
import { TenantNotFoundError } from '../errors/tenant-not-found.error';

export interface ResendTenantInvitationCommand {
  tenantSlug: string;
  invitationId: string;
}

export class ResendTenantInvitationUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invitationRepository: InvitationRepository,
  ) {}

  async execute(command: ResendTenantInvitationCommand): Promise<Invitation> {
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

    if (invitation.status === InvitationStatus.Accepted) {
      throw new InvitationAlreadyProcessedError(command.invitationId);
    }

    const now = new Date();
    const resentInvitation = invitation.resend(
      now,
      new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7),
    );

    await this.invitationRepository.save(resentInvitation);

    return resentInvitation;
  }
}

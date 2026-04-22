import { InvitationStatus } from '@saas-platform/tenancy-domain';
import { InvitationAlreadyProcessedError } from '../errors/invitation-already-processed.error';
import { InvitationNotFoundError } from '../errors/invitation-not-found.error';
import { InvitationRepository } from '../ports/invitation.repository';
import { TenantRepository } from '../ports/tenant.repository';
import { TenantNotFoundError } from '../errors/tenant-not-found.error';

export interface CancelTenantInvitationCommand {
  tenantSlug: string;
  invitationId: string;
}

export class CancelTenantInvitationUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invitationRepository: InvitationRepository,
  ) {}

  async execute(command: CancelTenantInvitationCommand): Promise<void> {
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

    const now = new Date();
    const normalizedInvitation =
      invitation.status === InvitationStatus.Pending &&
      invitation.expiresAt.getTime() < now.getTime()
        ? invitation.expire(now)
        : invitation;

    if (normalizedInvitation !== invitation) {
      await this.invitationRepository.save(normalizedInvitation);
    }

    if (normalizedInvitation.status !== InvitationStatus.Pending) {
      throw new InvitationAlreadyProcessedError(command.invitationId);
    }

    await this.invitationRepository.save(normalizedInvitation.cancel(now));
  }
}

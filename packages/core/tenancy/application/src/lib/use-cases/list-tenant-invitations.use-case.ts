import { Invitation, InvitationStatus } from '@saas-platform/tenancy-domain';
import { InvitationRepository } from '../ports/invitation.repository';
import { TenantRepository } from '../ports/tenant.repository';
import { TenantNotFoundError } from '../errors/tenant-not-found.error';

export class ListTenantInvitationsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invitationRepository: InvitationRepository,
  ) {}

  async execute(tenantSlug: string): Promise<Invitation[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const invitations = await this.invitationRepository.findByTenantId(tenant.id);
    const normalizedInvitations = await Promise.all(
      invitations.map((invitation) => this.expireIfNeeded(invitation)),
    );

    return normalizedInvitations.sort(
      (left, right) =>
        right.toPrimitives().createdAt.getTime() -
        left.toPrimitives().createdAt.getTime(),
    );
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

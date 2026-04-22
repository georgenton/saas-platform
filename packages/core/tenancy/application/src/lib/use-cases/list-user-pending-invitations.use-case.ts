import { Invitation, InvitationStatus, Tenant } from '@saas-platform/tenancy-domain';
import { InvitationRepository } from '../ports/invitation.repository';
import { TenantRepository } from '../ports/tenant.repository';

export interface UserPendingInvitationView {
  invitation: Invitation;
  tenant: Tenant;
}

export class ListUserPendingInvitationsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invitationRepository: InvitationRepository,
  ) {}

  async execute(email: string): Promise<UserPendingInvitationView[]> {
    const invitations = await this.invitationRepository.findPendingByEmail(email);
    const views = await Promise.all(
      invitations.map(async (invitation) => {
        const normalizedInvitation = await this.expireIfNeeded(invitation);

        if (normalizedInvitation.status !== InvitationStatus.Pending) {
          return null;
        }

        const tenant = await this.tenantRepository.findById(
          normalizedInvitation.tenantId,
        );

        if (!tenant) {
          return null;
        }

        return {
          invitation: normalizedInvitation,
          tenant,
        };
      }),
    );

    return views
      .filter(
        (view): view is UserPendingInvitationView =>
          view !== null,
      )
      .sort(
        (left, right) =>
          right.invitation.toPrimitives().createdAt.getTime() -
          left.invitation.toPrimitives().createdAt.getTime(),
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

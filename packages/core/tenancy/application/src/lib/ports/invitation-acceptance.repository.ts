import { Invitation, Membership } from '@saas-platform/tenancy-domain';

export interface InvitationAcceptanceRepository {
  acceptInvitation(
    invitation: Invitation,
    membership: Membership,
  ): Promise<void>;
}

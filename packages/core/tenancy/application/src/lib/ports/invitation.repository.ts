import { Invitation } from '@saas-platform/tenancy-domain';

export interface InvitationRepository {
  save(invitation: Invitation): Promise<void>;
  findById(id: string): Promise<Invitation | null>;
  findPendingByTenantAndEmail(
    tenantId: string,
    email: string,
  ): Promise<Invitation | null>;
}

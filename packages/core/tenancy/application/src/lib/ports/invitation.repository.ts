import { Invitation } from '@saas-platform/tenancy-domain';

export interface InvitationRepository {
  save(invitation: Invitation): Promise<void>;
  findById(id: string): Promise<Invitation | null>;
  findByTenantId(tenantId: string): Promise<Invitation[]>;
  findPendingByTenantAndEmail(
    tenantId: string,
    email: string,
  ): Promise<Invitation | null>;
  findPendingByEmail(email: string): Promise<Invitation[]>;
}

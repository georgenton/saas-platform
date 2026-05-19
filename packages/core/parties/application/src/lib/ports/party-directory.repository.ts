import { Party } from '@saas-platform/parties-domain';

export interface PartyDirectoryRepository {
  findByTenantId(tenantId: string): Promise<Party[]>;
  findByTenantIdAndId(tenantId: string, partyId: string): Promise<Party | null>;
}

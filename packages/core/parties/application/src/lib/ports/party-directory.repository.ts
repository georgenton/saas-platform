import { Party } from '@saas-platform/parties-domain';

export interface PartyDirectoryRepository {
  findByTenantId(tenantId: string): Promise<Party[]>;
  findByTenantIdAndId(tenantId: string, partyId: string): Promise<Party | null>;
  applyFiscalCorrection?(
    tenantId: string,
    partyId: string,
    correction: {
      taxpayerId?: string | null;
      identificationType?: string | null;
      fiscalAddress?: string | null;
      email?: string | null;
      taxpayerName?: string | null;
      appliedAt: Date;
    },
  ): Promise<Party | null>;
}

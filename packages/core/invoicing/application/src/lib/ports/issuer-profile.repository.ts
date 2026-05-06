import { IssuerProfile } from '@saas-platform/invoicing-domain';

export interface IssuerProfileRepository {
  save(profile: IssuerProfile): Promise<void>;
  findByTenantId(tenantId: string): Promise<IssuerProfile | null>;
}

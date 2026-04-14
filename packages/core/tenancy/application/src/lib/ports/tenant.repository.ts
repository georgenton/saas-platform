import { Tenant } from '@saas-platform/tenancy-domain';

export interface TenantRepository {
  save(tenant: Tenant): Promise<void>;
  findById(id: string): Promise<Tenant | null>;
  findBySlug(slug: string): Promise<Tenant | null>;
}

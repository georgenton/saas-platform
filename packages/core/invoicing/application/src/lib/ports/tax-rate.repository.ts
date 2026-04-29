import { TaxRate } from '@saas-platform/invoicing-domain';

export interface TaxRateRepository {
  save(taxRate: TaxRate): Promise<void>;
  findByTenantId(tenantId: string): Promise<TaxRate[]>;
  findByTenantIdAndId(tenantId: string, taxRateId: string): Promise<TaxRate | null>;
}

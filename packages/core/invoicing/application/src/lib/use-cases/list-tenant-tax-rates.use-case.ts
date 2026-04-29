import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { TaxRate } from '@saas-platform/invoicing-domain';
import { TaxRateRepository } from '../ports/tax-rate.repository';

export class ListTenantTaxRatesUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly taxRateRepository: TaxRateRepository,
  ) {}

  async execute(tenantSlug: string): Promise<TaxRate[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    return this.taxRateRepository.findByTenantId(tenant.id);
  }
}

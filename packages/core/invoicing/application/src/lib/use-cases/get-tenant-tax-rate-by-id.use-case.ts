import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { TaxRate } from '@saas-platform/invoicing-domain';
import { TaxRateNotFoundError } from '../errors/tax-rate-not-found.error';
import { TaxRateRepository } from '../ports/tax-rate.repository';

export class GetTenantTaxRateByIdUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly taxRateRepository: TaxRateRepository,
  ) {}

  async execute(tenantSlug: string, taxRateId: string): Promise<TaxRate> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const taxRate = await this.taxRateRepository.findByTenantIdAndId(
      tenant.id,
      taxRateId,
    );

    if (!taxRate) {
      throw new TaxRateNotFoundError(tenantSlug, taxRateId);
    }

    return taxRate;
  }
}

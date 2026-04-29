import { TaxRate } from '@saas-platform/invoicing-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { TaxRateIdGenerator } from '../ports/tax-rate-id.generator';
import { TaxRateRepository } from '../ports/tax-rate.repository';

export interface CreateTenantTaxRateInput {
  tenantSlug: string;
  name: string;
  percentage: number;
  isActive?: boolean;
}

export class CreateTenantTaxRateUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly taxRateRepository: TaxRateRepository,
    private readonly taxRateIdGenerator: TaxRateIdGenerator,
  ) {}

  async execute(input: CreateTenantTaxRateInput): Promise<TaxRate> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const now = new Date();
    const taxRate = TaxRate.create({
      id: this.taxRateIdGenerator.generate(),
      tenantId: tenant.id,
      name: input.name.trim(),
      percentage: input.percentage,
      isActive: input.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });

    await this.taxRateRepository.save(taxRate);

    return taxRate;
  }
}

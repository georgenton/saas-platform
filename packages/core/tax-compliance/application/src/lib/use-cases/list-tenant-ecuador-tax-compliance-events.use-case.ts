import { EcuadorTaxComplianceEventView } from '@saas-platform/tax-compliance-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { TaxComplianceEventRepository } from '../ports/tax-compliance-event.repository';

export class ListTenantEcuadorTaxComplianceEventsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly taxComplianceEventRepository: TaxComplianceEventRepository,
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    limit?: number;
  }): Promise<EcuadorTaxComplianceEventView[]> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    return this.taxComplianceEventRepository.listByTenantAndPeriod({
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      period: input.period,
      limit: input.limit,
    });
  }
}

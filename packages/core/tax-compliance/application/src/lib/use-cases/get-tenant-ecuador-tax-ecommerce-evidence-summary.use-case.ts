import { EcuadorTaxEcommerceEvidenceSummaryView } from '@saas-platform/tax-compliance-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { TaxComplianceEcommerceEvidenceRepository } from '../ports/tax-compliance-ecommerce-evidence.repository';

export class GetTenantEcuadorTaxEcommerceEvidenceSummaryUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly ecommerceEvidenceRepository: TaxComplianceEcommerceEvidenceRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
  }): Promise<EcuadorTaxEcommerceEvidenceSummaryView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    return this.ecommerceEvidenceRepository.summarizeTenantPeriod({
      tenantSlug: tenant.slug,
      period: input.period,
      generatedAt: this.nowProvider(),
    });
  }
}

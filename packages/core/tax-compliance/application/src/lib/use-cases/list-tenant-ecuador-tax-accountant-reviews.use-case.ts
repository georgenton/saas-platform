import { EcuadorTaxAccountantReviewView } from '@saas-platform/tax-compliance-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { TaxComplianceAccountantReviewRepository } from '../ports/tax-compliance-accountant-review.repository';

export class ListTenantEcuadorTaxAccountantReviewsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly reviewRepository: TaxComplianceAccountantReviewRepository,
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
  }): Promise<EcuadorTaxAccountantReviewView[]> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    return this.reviewRepository.listByTenantIdAndPeriod(
      tenant.id,
      input.period,
    );
  }
}

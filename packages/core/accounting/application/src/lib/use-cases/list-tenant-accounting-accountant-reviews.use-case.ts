import { TenantAccountingAccountantReviewView } from '@saas-platform/accounting-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AccountingAccountantReviewRepository } from '../ports/accounting-accountant-review.repository';

export class ListTenantAccountingAccountantReviewsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly reviewRepository: AccountingAccountantReviewRepository,
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
  }): Promise<TenantAccountingAccountantReviewView[]> {
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

import {
  AccountingAccountantReviewStatus,
  TenantAccountingAccountantReviewView,
} from '@saas-platform/accounting-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AccountingAccountantReviewNotFoundError } from '../errors/accounting-accountant-review-not-found.error';
import { AccountingAccountantReviewRepository } from '../ports/accounting-accountant-review.repository';

export class TransitionTenantAccountingAccountantReviewUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly reviewRepository: AccountingAccountantReviewRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    reviewId: string;
    status: AccountingAccountantReviewStatus;
    transitionedByUserId?: string | null;
    note?: string | null;
  }): Promise<TenantAccountingAccountantReviewView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const review = await this.reviewRepository.findByTenantIdAndId(
      tenant.id,
      input.reviewId,
    );

    if (!review) {
      throw new AccountingAccountantReviewNotFoundError(
        input.tenantSlug,
        input.reviewId,
      );
    }

    const transitionedAt = this.nowProvider();
    const transitioned: TenantAccountingAccountantReviewView = {
      ...review,
      status: input.status,
      transitionHistory: [
        ...review.transitionHistory,
        {
          status: input.status,
          transitionedAt,
          transitionedByUserId: input.transitionedByUserId ?? null,
          note: input.note ?? null,
        },
      ],
      updatedAt: transitionedAt,
    };

    await this.reviewRepository.save(transitioned);

    return transitioned;
  }
}

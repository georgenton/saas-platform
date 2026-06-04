import {
  EcuadorTaxAccountantReviewStatus,
  EcuadorTaxAccountantReviewView,
} from '@saas-platform/tax-compliance-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { TaxComplianceAccountantReviewNotFoundError } from '../errors/tax-compliance-accountant-review-not-found.error';
import { TaxComplianceAccountantReviewRepository } from '../ports/tax-compliance-accountant-review.repository';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class TransitionTenantEcuadorTaxAccountantReviewUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly reviewRepository: TaxComplianceAccountantReviewRepository,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    reviewId: string;
    status: EcuadorTaxAccountantReviewStatus;
    transitionedByUserId?: string | null;
    note?: string | null;
  }): Promise<EcuadorTaxAccountantReviewView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const review = await this.reviewRepository.findByTenantIdAndId(
      tenant.id,
      input.reviewId,
    );

    if (!review) {
      throw new TaxComplianceAccountantReviewNotFoundError(
        input.tenantSlug,
        input.reviewId,
      );
    }

    const transitionedAt = this.nowProvider();
    const transitioned: EcuadorTaxAccountantReviewView = {
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
    await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
      tenantSlug: input.tenantSlug,
      period: transitioned.period,
      year: transitioned.year,
      eventType: 'accountant_review_transitioned',
      source: 'accountant_review_transition',
      payload: {
        reviewId: transitioned.id,
        status: transitioned.status,
        note: input.note ?? null,
      },
    });

    return transitioned;
  }
}

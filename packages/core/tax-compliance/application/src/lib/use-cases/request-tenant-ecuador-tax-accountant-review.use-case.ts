import { EcuadorTaxAccountantReviewView } from '@saas-platform/tax-compliance-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { TaxComplianceAccountantReviewIdGenerator } from '../ports/id-generators';
import { TaxComplianceAccountantReviewRepository } from '../ports/tax-compliance-accountant-review.repository';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxAccountantReviewPacketUseCase } from './request-tenant-ecuador-tax-accountant-review-packet.use-case';

export class RequestTenantEcuadorTaxAccountantReviewUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly reviewRepository: TaxComplianceAccountantReviewRepository,
    private readonly reviewIdGenerator: TaxComplianceAccountantReviewIdGenerator,
    private readonly requestTenantEcuadorTaxAccountantReviewPacketUseCase: RequestTenantEcuadorTaxAccountantReviewPacketUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    requestedByUserId?: string | null;
    requestedByEmail?: string | null;
  }): Promise<EcuadorTaxAccountantReviewView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const packet =
      await this.requestTenantEcuadorTaxAccountantReviewPacketUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
      });
    const now = this.nowProvider();
    const review: EcuadorTaxAccountantReviewView = {
      id: this.reviewIdGenerator.generate(),
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      period: input.period,
      year: input.year,
      status: 'pending_accountant',
      requestedByUserId: input.requestedByUserId ?? null,
      requestedByEmail: input.requestedByEmail ?? null,
      summary: packet.executiveSummary,
      questions: [...packet.suggestedQuestions],
      evidenceSummary: packet.sourceEvidenceSummary,
      transitionHistory: [
        {
          status: 'pending_accountant',
          transitionedAt: now,
          transitionedByUserId: input.requestedByUserId ?? null,
          note: 'Accountant review requested.',
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    await this.reviewRepository.save(review);
    await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      eventType: 'accountant_packet_requested',
      source: 'accountant_review_lifecycle',
      payload: {
        reviewId: review.id,
        status: review.status,
        requestedByUserId: review.requestedByUserId,
      },
    });

    return review;
  }
}

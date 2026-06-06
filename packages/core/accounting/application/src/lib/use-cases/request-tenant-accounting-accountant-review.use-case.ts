import { TenantAccountingAccountantReviewView } from '@saas-platform/accounting-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AccountingAccountantReviewIdGenerator } from '../ports/id-generators';
import { AccountingAccountantReviewRepository } from '../ports/accounting-accountant-review.repository';
import { GetTenantAccountingAccountantHandoffWorkspaceUseCase } from './get-tenant-accounting-accountant-handoff-workspace.use-case';

export class RequestTenantAccountingAccountantReviewUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly reviewRepository: AccountingAccountantReviewRepository,
    private readonly reviewIdGenerator: AccountingAccountantReviewIdGenerator,
    private readonly getTenantAccountingAccountantHandoffWorkspaceUseCase: GetTenantAccountingAccountantHandoffWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    requestedByUserId?: string | null;
    requestedByEmail?: string | null;
  }): Promise<TenantAccountingAccountantReviewView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const handoff =
      await this.getTenantAccountingAccountantHandoffWorkspaceUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
      });
    const now = this.nowProvider();
    const review: TenantAccountingAccountantReviewView = {
      id: this.reviewIdGenerator.nextId(),
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      period: input.period,
      year: input.year,
      status: 'requested',
      requestedByUserId: input.requestedByUserId ?? null,
      requestedByEmail: input.requestedByEmail ?? null,
      summary: handoff.executiveSummary,
      questions: handoff.accountantQuestions,
      riskFlags: handoff.riskFlags,
      evidenceReferences: handoff.evidenceVault.artifacts.map(
        (artifact) => artifact.reference,
      ),
      transitionHistory: [
        {
          status: 'requested',
          transitionedAt: now,
          transitionedByUserId: input.requestedByUserId ?? null,
          note: 'Accounting accountant review requested.',
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    await this.reviewRepository.save(review);

    return review;
  }
}

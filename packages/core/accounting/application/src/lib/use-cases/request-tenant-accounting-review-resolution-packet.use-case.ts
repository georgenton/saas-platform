import {
  AccountingReadinessStatus,
  TenantAccountingReviewResolutionPacketView,
} from '@saas-platform/accounting-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AccountingAccountantReviewRepository } from '../ports/accounting-accountant-review.repository';
import { GetTenantAccountingAccountantHandoffWorkspaceUseCase } from './get-tenant-accounting-accountant-handoff-workspace.use-case';

export class RequestTenantAccountingReviewResolutionPacketUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly reviewRepository: AccountingAccountantReviewRepository,
    private readonly getTenantAccountingAccountantHandoffWorkspaceUseCase: GetTenantAccountingAccountantHandoffWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    reviewId?: string | null;
  }): Promise<TenantAccountingReviewResolutionPacketView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const [review, handoff] = await Promise.all([
      input.reviewId
        ? this.reviewRepository.findByTenantIdAndId(tenant.id, input.reviewId)
        : this.reviewRepository.findLatestByTenantIdAndPeriod(
            tenant.id,
            input.period,
          ),
      this.getTenantAccountingAccountantHandoffWorkspaceUseCase.execute(input),
    ]);
    const recommendedActions = buildRecommendedActions(review, handoff);
    const blockedActionCount = recommendedActions.filter(
      (action) => action.status === 'blocked',
    ).length;
    const blockers = [
      ...handoff.blockers,
      ...(!review ? ['accounting.review_resolution.no_accountant_review'] : []),
      ...(review && review.status !== 'changes_requested'
        ? ['accounting.review_resolution.no_changes_requested_review']
        : []),
    ];
    const resolutionStatus =
      !review || review.status !== 'changes_requested'
        ? 'no_review_changes_requested'
        : blockers.length > 0 || blockedActionCount > 0
          ? 'blocked'
          : recommendedActions.some((action) => action.status === 'needs_review')
            ? 'needs_review'
            : 'ready_to_resolve';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      resolutionStatus,
      review,
      handoff,
      recommendedActions,
      summary: {
        actionCount: recommendedActions.length,
        readyActionCount: recommendedActions.filter(
          (action) => action.status === 'ready',
        ).length,
        blockedActionCount,
        riskFlagCount: handoff.summary.riskFlagCount,
        accountantQuestionCount: handoff.summary.accountantQuestionCount,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        resolutionStatus === 'ready_to_resolve'
          ? 'Resolver observaciones del contador y volver a solicitar review.'
          : resolutionStatus === 'no_review_changes_requested'
            ? 'Esperar un review con cambios solicitados antes de resolver.'
            : 'Completar acciones bloqueadas antes de resolver el review.',
      guardrails: [
        'Resolution packet recomienda acciones; no aplica ajustes automaticamente.',
        'Usar adjusting journal entry o reopen packet solo con aprobacion humana.',
        'Mantener evidencia vinculada al handoff y audit trail.',
      ],
    };
  }
}

function buildRecommendedActions(
  review: TenantAccountingReviewResolutionPacketView['review'],
  handoff: TenantAccountingReviewResolutionPacketView['handoff'],
): TenantAccountingReviewResolutionPacketView['recommendedActions'] {
  const actions: TenantAccountingReviewResolutionPacketView['recommendedActions'] =
    [
      {
        key: 'review_questions',
        label: 'Responder preguntas del contador',
        status: review?.questions.length ? 'needs_review' : 'ready',
        detail: `${review?.questions.length ?? 0} preguntas en el review.`,
      },
      {
        key: 'evidence_vault',
        label: 'Actualizar evidence vault',
        status: handoff.evidenceVault.vaultStatus === 'ready'
          ? 'ready'
          : handoff.evidenceVault.vaultStatus === 'blocked'
            ? 'blocked'
            : 'needs_review',
        detail: `${handoff.evidenceVault.summary.readyArtifactCount}/${handoff.evidenceVault.summary.artifactCount} artifacts listos.`,
      },
      {
        key: 'financial_review',
        label: 'Reemitir review de estados',
        status:
          handoff.financialReviewPacket.reviewStatus === 'ready_for_approval'
            ? 'ready'
            : handoff.financialReviewPacket.reviewStatus === 'blocked'
              ? 'blocked'
              : 'needs_review',
        detail: `Review financiero en estado ${handoff.financialReviewPacket.reviewStatus}.`,
      },
    ];

  if (handoff.riskFlags.some((risk) => risk.severity === 'critical')) {
    actions.push({
      key: 'period_reopen_or_adjustment',
      label: 'Evaluar reopen o ajuste contable',
      status: 'needs_review' as AccountingReadinessStatus,
      detail: 'Hay riesgos criticos que pueden requerir ajuste o reopen.',
    });
  }

  return actions;
}

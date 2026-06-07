import {
  AccountingReadinessStatus,
  TenantAccountingCloseoutCertificationReadinessView,
} from '@saas-platform/accounting-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AccountingAccountantReviewRepository } from '../ports/accounting-accountant-review.repository';
import { GetTenantAccountingAccountantHandoffWorkspaceUseCase } from './get-tenant-accounting-accountant-handoff-workspace.use-case';
import { GetTenantAccountingOpeningBalanceWorkspaceUseCase } from './get-tenant-accounting-opening-balance-workspace.use-case';
import { RequestTenantAccountingReviewResolutionPacketUseCase } from './request-tenant-accounting-review-resolution-packet.use-case';

export class GetTenantAccountingCloseoutCertificationReadinessUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly reviewRepository: AccountingAccountantReviewRepository,
    private readonly getTenantAccountingAccountantHandoffWorkspaceUseCase: GetTenantAccountingAccountantHandoffWorkspaceUseCase,
    private readonly getTenantAccountingOpeningBalanceWorkspaceUseCase: GetTenantAccountingOpeningBalanceWorkspaceUseCase,
    private readonly requestTenantAccountingReviewResolutionPacketUseCase: RequestTenantAccountingReviewResolutionPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingCloseoutCertificationReadinessView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const [reviews, handoff, openingBalance, resolutionPacket] =
      await Promise.all([
        this.reviewRepository.listByTenantIdAndPeriod(tenant.id, input.period),
        this.getTenantAccountingAccountantHandoffWorkspaceUseCase.execute(
          input,
        ),
        this.getTenantAccountingOpeningBalanceWorkspaceUseCase.execute(input),
        this.requestTenantAccountingReviewResolutionPacketUseCase.execute(
          input,
        ),
      ]);
    const latestAccountantReview = reviews[0] ?? null;
    const checks: TenantAccountingCloseoutCertificationReadinessView['checks'] =
      [
        check(
          'opening_balances',
          'Opening balances',
          openingBalance.openingBalanceStatus === 'ready_for_review'
            ? 'ready'
            : openingBalance.openingBalanceStatus === 'blocked'
              ? 'blocked'
              : 'needs_review',
          `${openingBalance.summary.readyLineCount}/${openingBalance.summary.lineCount} saldos iniciales listos.`,
          openingBalance.blockers.length,
        ),
        check(
          'handoff',
          'Accountant handoff',
          handoff.handoffStatus === 'ready_for_accountant'
            ? 'ready'
            : handoff.handoffStatus === 'blocked'
              ? 'blocked'
              : 'needs_review',
          `Handoff en estado ${handoff.handoffStatus}.`,
          handoff.blockers.length,
        ),
        check(
          'evidence_vault',
          'Evidence vault',
          handoff.evidenceVault.vaultStatus === 'ready'
            ? 'ready'
            : handoff.evidenceVault.vaultStatus === 'blocked'
              ? 'blocked'
              : 'needs_review',
          `${handoff.evidenceVault.summary.readyArtifactCount}/${handoff.evidenceVault.summary.artifactCount} artifacts listos.`,
          handoff.evidenceVault.blockers.length,
        ),
        check(
          'financial_review',
          'Financial review packet',
          handoff.financialReviewPacket.reviewStatus === 'ready_for_approval'
            ? 'ready'
            : handoff.financialReviewPacket.reviewStatus === 'blocked'
              ? 'blocked'
              : 'needs_review',
          `Review financiero en estado ${handoff.financialReviewPacket.reviewStatus}.`,
          handoff.financialReviewPacket.blockers.length,
        ),
        check(
          'accountant_review',
          'Accountant review lifecycle',
          latestAccountantReview?.status === 'approved'
            ? 'ready'
            : latestAccountantReview?.status === 'changes_requested' ||
                latestAccountantReview?.status === 'rejected'
              ? 'blocked'
              : 'needs_review',
          latestAccountantReview
            ? `Ultimo review en estado ${latestAccountantReview.status}.`
            : 'Aun no existe review profesional solicitado.',
          latestAccountantReview ? 0 : 1,
        ),
        check(
          'review_resolution',
          'Review resolution packet',
          resolutionPacket.resolutionStatus === 'no_review_changes_requested' ||
            resolutionPacket.resolutionStatus === 'ready_to_resolve'
            ? 'ready'
            : resolutionPacket.resolutionStatus === 'blocked'
              ? 'blocked'
              : 'needs_review',
          `Resolution packet en estado ${resolutionPacket.resolutionStatus}.`,
          resolutionPacket.blockers.length,
        ),
      ];
    const blockers = [
      ...handoff.blockers,
      ...openingBalance.blockers,
      ...resolutionPacket.blockers,
      ...(latestAccountantReview
        ? []
        : ['accounting.certification.accountant_review_required']),
      ...(latestAccountantReview?.status === 'changes_requested'
        ? ['accounting.certification.review_changes_requested']
        : []),
      ...(latestAccountantReview?.status === 'rejected'
        ? ['accounting.certification.review_rejected']
        : []),
    ];
    const blockedCheckCount = checks.filter(
      (item) => item.status === 'blocked',
    ).length;
    const needsReviewCheckCount = checks.filter(
      (item) => item.status === 'needs_review',
    ).length;
    const certificationStatus =
      blockers.length > 0 || blockedCheckCount > 0
        ? 'blocked'
        : needsReviewCheckCount > 0
          ? 'needs_review'
          : 'ready_for_professional_closeout';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      certificationStatus,
      checks,
      latestAccountantReview,
      handoff,
      resolutionPacket,
      summary: {
        checkCount: checks.length,
        readyCheckCount: checks.filter((item) => item.status === 'ready')
          .length,
        needsReviewCheckCount,
        blockedCheckCount,
        accountantReviewCount: reviews.length,
        unresolvedResolutionCount:
          resolutionPacket.resolutionStatus === 'ready_to_resolve' ? 1 : 0,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        certificationStatus === 'ready_for_professional_closeout'
          ? 'Periodo listo para cierre profesional asistido.'
          : 'Completar review profesional y resoluciones antes del cierre asistido.',
      guardrails: [
        'Readiness indica preparacion operativa; no certifica estados financieros.',
        'El cierre profesional sigue dependiendo del contador.',
        'No presenta declaraciones ni cierra libros legales automaticamente.',
      ],
    };
  }
}

function check(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  detail: string,
  blockerCount: number,
): TenantAccountingCloseoutCertificationReadinessView['checks'][number] {
  return {
    key,
    label,
    status,
    detail,
    blockerCount,
  };
}

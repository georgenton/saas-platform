import {
  AccountingReadinessStatus,
  TenantAccountingPeriodCloseoutPacketView,
} from '@saas-platform/accounting-domain';
import { GetTenantAccountingPeriodCloseoutReadinessUseCase } from './get-tenant-accounting-period-closeout-readiness.use-case';
import { GetTenantAccountingTrialBalanceWorkspaceUseCase } from './get-tenant-accounting-trial-balance-workspace.use-case';

export class RequestTenantAccountingPeriodCloseoutPacketUseCase {
  constructor(
    private readonly getTenantAccountingPeriodCloseoutReadinessUseCase: GetTenantAccountingPeriodCloseoutReadinessUseCase,
    private readonly getTenantAccountingTrialBalanceWorkspaceUseCase: GetTenantAccountingTrialBalanceWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    decision: 'approve' | 'request_changes';
    reviewerUserId?: string | null;
    reviewerEmail?: string | null;
    note?: string | null;
  }): Promise<TenantAccountingPeriodCloseoutPacketView> {
    const [readiness, trialBalance] = await Promise.all([
      this.getTenantAccountingPeriodCloseoutReadinessUseCase.execute(input),
      this.getTenantAccountingTrialBalanceWorkspaceUseCase.execute(input),
    ]);
    const approvals = [
      {
        key: 'period_closeout_readiness',
        label: 'Readiness de cierre',
        status: toReadinessStatus(readiness.readinessStatus),
        detail: readiness.nextStep,
      },
      {
        key: 'trial_balance',
        label: 'Balance de comprobacion',
        status: trialBalance.readinessStatus,
        detail: trialBalance.nextStep,
      },
      {
        key: 'reviewer_decision',
        label: 'Decision del revisor',
        status:
          input.decision === 'approve'
            ? ('ready' as const)
            : ('needs_review' as const),
        detail:
          input.decision === 'approve'
            ? 'El revisor solicita aprobar el paquete de cierre.'
            : 'El revisor solicita cambios antes del cierre.',
      },
    ];
    const blockedApprovalCount = approvals.filter(
      (approval) => approval.status === 'blocked',
    ).length;
    const needsReviewApprovalCount = approvals.filter(
      (approval) => approval.status === 'needs_review',
    ).length;
    const blockers = [
      ...readiness.blockers,
      ...trialBalance.blockers,
      ...(input.decision === 'approve' && blockedApprovalCount > 0
        ? ['accounting.closeout_packet.blocked_approval']
        : []),
      ...(input.decision === 'approve' && !trialBalance.summary.balanced
        ? ['accounting.closeout_packet.unbalanced_trial_balance']
        : []),
    ];
    const closeoutStatus =
      input.decision === 'request_changes'
        ? 'changes_requested'
        : blockers.length > 0
          ? 'blocked'
          : needsReviewApprovalCount > 0
            ? 'needs_review'
            : 'approved_for_closeout';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      reviewerUserId: input.reviewerUserId ?? null,
      reviewerEmail: input.reviewerEmail ?? null,
      note: input.note ?? null,
      readiness,
      trialBalance,
      approvals,
      summary: {
        readyApprovalCount: approvals.filter(
          (approval) => approval.status === 'ready',
        ).length,
        needsReviewApprovalCount,
        blockedApprovalCount,
        journalEntryCount: readiness.summary.journalEntryCount,
        trialBalanceBalanced: trialBalance.summary.balanced,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        closeoutStatus === 'approved_for_closeout'
          ? 'Registrar cierre externo/manual del periodo cuando exista flujo formal de bloqueo.'
          : 'Resolver observaciones antes de aprobar el cierre contable interno.',
      guardrails: [
        'Paquete de cierre interno; no bloquea libros ni periodos automaticamente.',
        'No genera declaraciones tributarias ni estados financieros oficiales.',
        'La aprobacion requiere revision humana y evidencia fuente disponible.',
      ],
    };
  }
}

function toReadinessStatus(
  status: TenantAccountingPeriodCloseoutPacketView['readiness']['readinessStatus'],
): AccountingReadinessStatus {
  if (status === 'ready_for_closeout') {
    return 'ready';
  }

  return status === 'blocked' ? 'blocked' : 'needs_review';
}

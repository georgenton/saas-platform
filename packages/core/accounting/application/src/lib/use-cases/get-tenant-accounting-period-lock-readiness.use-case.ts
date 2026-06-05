import {
  AccountingReadinessStatus,
  TenantAccountingPeriodLockReadinessView,
} from '@saas-platform/accounting-domain';
import { GetTenantAccountingPeriodCloseoutReportUseCase } from './get-tenant-accounting-period-closeout-report.use-case';
import { GetTenantAccountingPeriodCloseoutReadinessUseCase } from './get-tenant-accounting-period-closeout-readiness.use-case';
import { GetTenantAccountingTrialBalanceWorkspaceUseCase } from './get-tenant-accounting-trial-balance-workspace.use-case';
import { ListTenantAccountingJournalRegistryUseCase } from './list-tenant-accounting-journal-registry.use-case';
import { RequestTenantAccountingPeriodCloseoutPacketUseCase } from './request-tenant-accounting-period-closeout-packet.use-case';

export class GetTenantAccountingPeriodLockReadinessUseCase {
  constructor(
    private readonly listTenantAccountingJournalRegistryUseCase: ListTenantAccountingJournalRegistryUseCase,
    private readonly getTenantAccountingTrialBalanceWorkspaceUseCase: GetTenantAccountingTrialBalanceWorkspaceUseCase,
    private readonly getTenantAccountingPeriodCloseoutReadinessUseCase: GetTenantAccountingPeriodCloseoutReadinessUseCase,
    private readonly requestTenantAccountingPeriodCloseoutPacketUseCase: RequestTenantAccountingPeriodCloseoutPacketUseCase,
    private readonly getTenantAccountingPeriodCloseoutReportUseCase: GetTenantAccountingPeriodCloseoutReportUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingPeriodLockReadinessView> {
    const [journalRegistry, trialBalance, closeoutReadiness, closeoutPacket, closeoutReport] =
      await Promise.all([
        this.listTenantAccountingJournalRegistryUseCase.execute(input),
        this.getTenantAccountingTrialBalanceWorkspaceUseCase.execute(input),
        this.getTenantAccountingPeriodCloseoutReadinessUseCase.execute(input),
        this.requestTenantAccountingPeriodCloseoutPacketUseCase.execute({
          ...input,
          decision: 'approve',
          reviewerUserId: null,
          reviewerEmail: null,
          note: 'Deterministic pre-lock readiness packet.',
        }),
        this.getTenantAccountingPeriodCloseoutReportUseCase.execute(input),
      ]);
    const checks: TenantAccountingPeriodLockReadinessView['checks'] = [
      {
        key: 'journal_registry',
        label: 'Journal registry',
        status: journalRegistry.registryStatus === 'ready' ? 'ready' : 'blocked',
        detail: `${journalRegistry.summary.entryCount} entries, ${journalRegistry.summary.balancedEntryCount} balanceados.`,
        blockerCount: journalRegistry.blockers.length,
      },
      {
        key: 'trial_balance',
        label: 'Balance de comprobacion',
        status: trialBalance.readinessStatus,
        detail: `${trialBalance.summary.accountCount} cuentas; balanced=${trialBalance.summary.balanced}.`,
        blockerCount: trialBalance.blockers.length,
      },
      {
        key: 'closeout_readiness',
        label: 'Readiness de cierre',
        status: toReadinessStatus(closeoutReadiness.readinessStatus),
        detail: closeoutReadiness.nextStep,
        blockerCount: closeoutReadiness.blockers.length,
      },
      {
        key: 'closeout_packet',
        label: 'Closeout packet',
        status: toPacketStatus(closeoutPacket.closeoutStatus),
        detail: closeoutPacket.nextStep,
        blockerCount: closeoutPacket.blockers.length,
      },
      {
        key: 'closeout_report',
        label: 'Closeout report',
        status: closeoutReport.reportStatus === 'ready'
          ? 'ready'
          : closeoutReport.reportStatus === 'blocked'
            ? 'blocked'
            : 'needs_review',
        detail: closeoutReport.nextStep,
        blockerCount: closeoutReport.blockers.length,
      },
    ];
    const blockedCheckCount = checks.filter(
      (check) => check.status === 'blocked',
    ).length;
    const needsReviewCheckCount = checks.filter(
      (check) => check.status === 'needs_review',
    ).length;
    const blockers = [
      ...journalRegistry.blockers,
      ...trialBalance.blockers,
      ...closeoutReadiness.blockers,
      ...closeoutPacket.blockers,
      ...closeoutReport.blockers,
    ];
    const lockReadinessStatus =
      blockedCheckCount > 0 || blockers.length > 0
        ? 'blocked'
        : needsReviewCheckCount > 0
          ? 'needs_review'
          : 'ready_to_lock';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      lockReadinessStatus,
      checks,
      summary: {
        checkCount: checks.length,
        readyCheckCount: checks.filter((check) => check.status === 'ready')
          .length,
        needsReviewCheckCount,
        blockedCheckCount,
        journalEntryCount: journalRegistry.summary.entryCount,
        trialBalanceBalanced: trialBalance.summary.balanced,
        closeoutReportStatus: closeoutReport.reportStatus,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        lockReadinessStatus === 'ready_to_lock'
          ? 'El periodo esta listo para un futuro bloqueo contable formal.'
          : 'Resolver los checks pendientes antes de bloquear el periodo.',
      guardrails: [
        'Pre-lock readiness no bloquea periodos ni libros en base de datos.',
        'No impide nuevos journal entries; solo informa si el cierre esta listo.',
        'El bloqueo formal requiere un futuro estado persistente y auditoria dedicada.',
      ],
    };
  }
}

function toReadinessStatus(
  status: 'ready_for_closeout' | 'needs_review' | 'blocked',
): AccountingReadinessStatus {
  if (status === 'ready_for_closeout') {
    return 'ready';
  }

  return status;
}

function toPacketStatus(
  status: 'approved_for_closeout' | 'needs_review' | 'blocked' | 'changes_requested',
): AccountingReadinessStatus {
  if (status === 'approved_for_closeout') {
    return 'ready';
  }

  return status === 'blocked' ? 'blocked' : 'needs_review';
}

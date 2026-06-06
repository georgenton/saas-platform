import {
  AccountingReadinessStatus,
  TenantAccountingPeriodCashCloseoutReadinessView,
} from '@saas-platform/accounting-domain';
import { GetTenantAccountingBankReconciliationWorkspaceUseCase } from './get-tenant-accounting-bank-reconciliation-workspace.use-case';
import { ListTenantAccountingBankReconciliationControlRegistryUseCase } from './list-tenant-accounting-bank-reconciliation-control-registry.use-case';
import { ListTenantAccountingBankStatementRegistryUseCase } from './list-tenant-accounting-bank-statement-registry.use-case';
import { RequestTenantAccountingReconciliationExceptionPacketUseCase } from './request-tenant-accounting-reconciliation-exception-packet.use-case';

export class GetTenantAccountingPeriodCashCloseoutReadinessUseCase {
  constructor(
    private readonly listTenantAccountingBankStatementRegistryUseCase: ListTenantAccountingBankStatementRegistryUseCase,
    private readonly getTenantAccountingBankReconciliationWorkspaceUseCase: GetTenantAccountingBankReconciliationWorkspaceUseCase,
    private readonly listTenantAccountingBankReconciliationControlRegistryUseCase: ListTenantAccountingBankReconciliationControlRegistryUseCase,
    private readonly requestTenantAccountingReconciliationExceptionPacketUseCase: RequestTenantAccountingReconciliationExceptionPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingPeriodCashCloseoutReadinessView> {
    const [
      statementRegistry,
      reconciliationWorkspace,
      controlRegistry,
      exceptionPacket,
    ] = await Promise.all([
      this.listTenantAccountingBankStatementRegistryUseCase.execute(input),
      this.getTenantAccountingBankReconciliationWorkspaceUseCase.execute(input),
      this.listTenantAccountingBankReconciliationControlRegistryUseCase.execute(input),
      this.requestTenantAccountingReconciliationExceptionPacketUseCase.execute(input),
    ]);
    const resolvedExceptionCount =
      controlRegistry.summary.exceptionResolvedCount;
    const checks: TenantAccountingPeriodCashCloseoutReadinessView['checks'] = [
      {
        key: 'statement_registry',
        label: 'Statement registry',
        status: statementRegistry.registryStatus === 'ready'
          ? 'ready'
          : statementRegistry.registryStatus === 'empty'
            ? 'blocked'
            : 'needs_review',
        detail: `${statementRegistry.summary.lineCount} lineas en ${statementRegistry.summary.batchCount} batches.`,
        blockerCount: statementRegistry.blockers.length,
      },
      {
        key: 'match_packet',
        label: 'Match packet aprobado',
        status:
          controlRegistry.summary.matchApprovedCount > 0
            ? 'ready'
            : reconciliationWorkspace.summary.exactMatchCount > 0
              ? 'needs_review'
              : 'blocked',
        detail: `${controlRegistry.summary.matchApprovedCount} controles de match aprobados.`,
        blockerCount:
          controlRegistry.summary.matchApprovedCount > 0
            ? 0
            : 1,
      },
      {
        key: 'exceptions',
        label: 'Excepciones resueltas',
        status: toExceptionStatus(
          exceptionPacket.summary.exceptionCount,
          resolvedExceptionCount,
        ),
        detail: `${resolvedExceptionCount}/${exceptionPacket.summary.exceptionCount} excepciones resueltas.`,
        blockerCount: Math.max(
          exceptionPacket.summary.exceptionCount - resolvedExceptionCount,
          0,
        ),
      },
      {
        key: 'differences',
        label: 'Diferencias criticas',
        status:
          exceptionPacket.summary.criticalCount > 0 ||
          reconciliationWorkspace.summary.totalDifferenceInCents > 0
            ? 'needs_review'
            : 'ready',
        detail: `Diferencia ${reconciliationWorkspace.summary.totalDifferenceInCents} centavos.`,
        blockerCount:
          exceptionPacket.summary.criticalCount +
          (reconciliationWorkspace.summary.totalDifferenceInCents > 0 ? 1 : 0),
      },
      {
        key: 'control_registry',
        label: 'Control registry',
        status:
          controlRegistry.registryStatus === 'ready'
            ? 'ready'
            : controlRegistry.registryStatus === 'empty'
              ? 'blocked'
              : controlRegistry.registryStatus,
        detail: `${controlRegistry.summary.controlCount} controles bancarios.`,
        blockerCount: controlRegistry.blockers.length,
      },
    ];
    const blockers = [
      ...statementRegistry.blockers,
      ...reconciliationWorkspace.blockers,
      ...controlRegistry.blockers,
      ...exceptionPacket.blockers,
      ...(controlRegistry.summary.matchApprovedCount === 0
        ? ['accounting.cash_closeout.match_packet_not_approved']
        : []),
      ...(exceptionPacket.summary.exceptionCount > resolvedExceptionCount
        ? ['accounting.cash_closeout.unresolved_exceptions']
        : []),
    ];
    const blockedCheckCount = checks.filter((check) => check.status === 'blocked')
      .length;
    const needsReviewCheckCount = checks.filter(
      (check) => check.status === 'needs_review',
    ).length;
    const readinessStatus =
      blockedCheckCount > 0 || blockers.length > 0
        ? 'blocked'
        : needsReviewCheckCount > 0
          ? 'needs_review'
          : 'ready_for_lock';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      checks,
      statementRegistry,
      reconciliationWorkspace,
      controlRegistry,
      exceptionPacket,
      summary: {
        checkCount: checks.length,
        readyCheckCount: checks.filter((check) => check.status === 'ready')
          .length,
        needsReviewCheckCount,
        blockedCheckCount,
        statementLineCount: statementRegistry.summary.lineCount,
        exactMatchCount: reconciliationWorkspace.summary.exactMatchCount,
        exceptionCount: exceptionPacket.summary.exceptionCount,
        resolvedExceptionCount,
        totalDifferenceInCents:
          reconciliationWorkspace.summary.totalDifferenceInCents,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        readinessStatus === 'ready_for_lock'
          ? 'Caja/bancos listos como compuerta de lock contable.'
          : 'Aprobar matches y resolver excepciones antes del lock.',
      guardrails: [
        'Cash closeout readiness es control operacional interno.',
        'No certifica bancos ni reemplaza conciliacion profesional.',
        'Las excepciones resueltas deben conservar evidencia externa.',
      ],
    };
  }
}

function toExceptionStatus(
  exceptionCount: number,
  resolvedExceptionCount: number,
): AccountingReadinessStatus {
  if (exceptionCount === 0 || resolvedExceptionCount >= exceptionCount) {
    return 'ready';
  }

  return resolvedExceptionCount > 0 ? 'needs_review' : 'blocked';
}

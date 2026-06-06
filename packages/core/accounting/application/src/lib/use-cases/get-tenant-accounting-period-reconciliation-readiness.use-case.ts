import { TenantAccountingPeriodReconciliationReadinessView } from '@saas-platform/accounting-domain';
import { GetTenantAccountingBankReconciliationWorkspaceUseCase } from './get-tenant-accounting-bank-reconciliation-workspace.use-case';

export class GetTenantAccountingPeriodReconciliationReadinessUseCase {
  constructor(
    private readonly getTenantAccountingBankReconciliationWorkspaceUseCase: GetTenantAccountingBankReconciliationWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingPeriodReconciliationReadinessView> {
    const workspace =
      await this.getTenantAccountingBankReconciliationWorkspaceUseCase.execute(
        input,
      );
    const checks: TenantAccountingPeriodReconciliationReadinessView['checks'] = [
      {
        key: 'bank_accounts',
        label: 'Cuentas bancarias',
        status: workspace.summary.bankAccountCount > 0 ? 'ready' : 'blocked',
        detail: `${workspace.summary.bankAccountCount} cuentas bancarias detectadas en ledger.`,
        blockerCount:
          workspace.summary.bankAccountCount > 0
            ? 0
            : 1,
      },
      {
        key: 'statement_lines',
        label: 'Lineas de extracto',
        status: workspace.summary.statementLineCount > 0 ? 'ready' : 'blocked',
        detail: `${workspace.summary.statementLineCount} lineas bancarias disponibles.`,
        blockerCount:
          workspace.summary.statementLineCount > 0
            ? 0
            : 1,
      },
      {
        key: 'match_coverage',
        label: 'Cobertura de matches',
        status:
          workspace.summary.unmatchedCount > 0
            ? 'needs_review'
            : workspace.summary.exactMatchCount > 0
              ? 'ready'
              : 'blocked',
        detail: `${workspace.summary.exactMatchCount} exactos, ${workspace.summary.unmatchedCount} sin match.`,
        blockerCount: workspace.summary.unmatchedCount,
      },
      {
        key: 'open_differences',
        label: 'Diferencias abiertas',
        status:
          workspace.summary.totalDifferenceInCents === 0
            ? 'ready'
            : 'needs_review',
        detail: `Diferencia total ${workspace.summary.totalDifferenceInCents} centavos.`,
        blockerCount: workspace.summary.totalDifferenceInCents === 0 ? 0 : 1,
      },
      {
        key: 'exception_packet',
        label: 'Exception packet',
        status:
          workspace.summary.unmatchedCount === 0 &&
          workspace.summary.needsReviewCount === 0
            ? 'ready'
            : 'needs_review',
        detail: `${workspace.summary.unmatchedCount} sin match, ${workspace.summary.needsReviewCount} por revisar.`,
        blockerCount:
          workspace.summary.unmatchedCount + workspace.summary.needsReviewCount,
      },
    ];
    const blockers = [
      ...workspace.blockers,
      ...(workspace.summary.unmatchedCount > 0
        ? ['accounting.period_reconciliation.unmatched_bank_lines']
        : []),
      ...(workspace.summary.needsReviewCount > 0
        ? ['accounting.period_reconciliation.exception_packet_required']
        : []),
    ];
    const blockedCheckCount = checks.filter((check) => check.status === 'blocked')
      .length;
    const needsReviewCheckCount = checks.filter(
      (check) => check.status === 'needs_review',
    ).length;
    const readinessStatus =
      blockedCheckCount > 0
        ? 'blocked'
        : needsReviewCheckCount > 0
          ? 'needs_review'
          : 'ready_for_closeout';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      checks,
      workspace,
      summary: {
        checkCount: checks.length,
        readyCheckCount: checks.filter((check) => check.status === 'ready')
          .length,
        needsReviewCheckCount,
        blockedCheckCount,
        bankAccountCount: workspace.summary.bankAccountCount,
        exactMatchCount: workspace.summary.exactMatchCount,
        unmatchedCount: workspace.summary.unmatchedCount,
        totalDifferenceInCents: workspace.summary.totalDifferenceInCents,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        readinessStatus === 'ready_for_closeout'
          ? 'Conciliacion bancaria lista para alimentar closeout contable.'
          : 'Resolver lineas bancarias, matches o diferencias antes del cierre.',
      guardrails: [
        'Readiness de conciliacion interna; no sustituye certificacion bancaria.',
        'Diferencias requieren ajustes o evidencia externa antes del lock.',
        'El cierre legal sigue requiriendo revision profesional.',
      ],
    };
  }
}

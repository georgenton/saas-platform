import {
  AccountingReadinessStatus,
  TenantAccountingPeriodCloseoutReadinessView,
} from '@saas-platform/accounting-domain';
import { GetTenantEcuadorTaxOperationalCloseoutUseCase } from '@saas-platform/tax-compliance-application';
import { GetTenantAccountingChartOfAccountsWorkspaceUseCase } from './get-tenant-accounting-chart-of-accounts-workspace.use-case';
import { GetTenantAccountingLedgerRegistryWorkspaceUseCase } from './get-tenant-accounting-ledger-registry-workspace.use-case';
import { GetTenantAccountingPeriodReconciliationReadinessUseCase } from './get-tenant-accounting-period-reconciliation-readiness.use-case';
import { ListTenantAccountingJournalRegistryUseCase } from './list-tenant-accounting-journal-registry.use-case';

export class GetTenantAccountingPeriodCloseoutReadinessUseCase {
  constructor(
    private readonly getTenantAccountingChartOfAccountsWorkspaceUseCase: GetTenantAccountingChartOfAccountsWorkspaceUseCase,
    private readonly listTenantAccountingJournalRegistryUseCase: ListTenantAccountingJournalRegistryUseCase,
    private readonly getTenantAccountingLedgerRegistryWorkspaceUseCase: GetTenantAccountingLedgerRegistryWorkspaceUseCase,
    private readonly getTenantAccountingPeriodReconciliationReadinessUseCase: GetTenantAccountingPeriodReconciliationReadinessUseCase,
    private readonly getTenantEcuadorTaxOperationalCloseoutUseCase: GetTenantEcuadorTaxOperationalCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingPeriodCloseoutReadinessView> {
    const [
      chartWorkspace,
      journalRegistry,
      ledgerRegistry,
      reconciliationReadiness,
      taxCloseout,
    ] = await Promise.all([
        this.getTenantAccountingChartOfAccountsWorkspaceUseCase.execute(input),
        this.listTenantAccountingJournalRegistryUseCase.execute(input),
        this.getTenantAccountingLedgerRegistryWorkspaceUseCase.execute(input),
        this.getTenantAccountingPeriodReconciliationReadinessUseCase.execute(input),
        this.getTenantEcuadorTaxOperationalCloseoutUseCase.execute(input),
      ]);
    const checks: TenantAccountingPeriodCloseoutReadinessView['checks'] = [
      {
        key: 'chart_mapping',
        label: 'Plan de cuentas mapeado',
        status: chartWorkspace.readinessStatus,
        detail: `${chartWorkspace.summary.mappedAccountCount}/${chartWorkspace.summary.sourceHintCount} hints mapeados.`,
        blockerCount: chartWorkspace.blockers.length,
      },
      {
        key: 'journal_registry',
        label: 'Journal registry',
        status: toReadinessStatus(
          journalRegistry.registryStatus === 'ready'
            ? 'ready'
            : journalRegistry.registryStatus === 'empty'
              ? 'blocked'
              : 'needs_review',
        ),
        detail: `${journalRegistry.summary.entryCount} entries, ${journalRegistry.summary.balancedEntryCount} balanceados.`,
        blockerCount: journalRegistry.blockers.length,
      },
      {
        key: 'ledger_registry',
        label: 'Ledger registry',
        status: ledgerRegistry.readinessStatus,
        detail: `${ledgerRegistry.summary.accountCount} cuentas, debito ${ledgerRegistry.summary.totalDebitInCents}, credito ${ledgerRegistry.summary.totalCreditInCents}.`,
        blockerCount: ledgerRegistry.blockers.length,
      },
      {
        key: 'bank_reconciliation',
        label: 'Conciliacion bancaria',
        status:
          reconciliationReadiness.readinessStatus === 'ready_for_closeout'
            ? 'ready'
            : reconciliationReadiness.readinessStatus,
        detail: `${reconciliationReadiness.summary.exactMatchCount} matches exactos, diferencia ${reconciliationReadiness.summary.totalDifferenceInCents}.`,
        blockerCount: reconciliationReadiness.blockers.length,
      },
      {
        key: 'tax_operational_closeout',
        label: 'Closeout tributario operacional',
        status: taxCloseout.blockers.length > 0 ? 'needs_review' : 'ready',
        detail: `Tax closeout ${taxCloseout.status}.`,
        blockerCount: taxCloseout.blockers.length,
      },
    ];
    const blockers = [
      ...chartWorkspace.blockers,
      ...journalRegistry.blockers,
      ...ledgerRegistry.blockers,
      ...reconciliationReadiness.blockers,
      ...taxCloseout.blockers.map(
        (blocker) => `tax_operational_closeout.${blocker}`,
      ),
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
      summary: {
        checkCount: checks.length,
        readyCheckCount: checks.filter((check) => check.status === 'ready')
          .length,
        needsReviewCheckCount,
        blockedCheckCount,
        journalEntryCount: journalRegistry.summary.entryCount,
        ledgerBalanced: ledgerRegistry.summary.balanced,
        taxCloseoutStatus: taxCloseout.status,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        readinessStatus === 'ready_for_closeout'
          ? 'Preparar closeout contable operacional con revision profesional.'
          : 'Resolver blockers de mapping, journals, ledger o tax closeout antes de cerrar.',
      guardrails: [
        'Readiness de cierre contable operacional; no presenta impuestos ni emite estados financieros.',
        'El cierre formal requiere contador y politicas contables aprobadas.',
        'Tax Compliance sigue siendo la fuente de evidencia fiscal, no de libros contables.',
      ],
    };
  }
}

function toReadinessStatus(
  value: AccountingReadinessStatus,
): AccountingReadinessStatus {
  return value;
}

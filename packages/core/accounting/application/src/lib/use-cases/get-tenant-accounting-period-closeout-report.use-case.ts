import {
  AccountingReadinessStatus,
  TenantAccountingPeriodCloseoutReportView,
} from '@saas-platform/accounting-domain';
import { GetTenantAccountingLedgerRegistryWorkspaceUseCase } from './get-tenant-accounting-ledger-registry-workspace.use-case';
import { GetTenantAccountingPeriodCloseoutReadinessUseCase } from './get-tenant-accounting-period-closeout-readiness.use-case';
import { GetTenantAccountingTrialBalanceWorkspaceUseCase } from './get-tenant-accounting-trial-balance-workspace.use-case';
import { ListTenantAccountingJournalRegistryUseCase } from './list-tenant-accounting-journal-registry.use-case';

export class GetTenantAccountingPeriodCloseoutReportUseCase {
  constructor(
    private readonly listTenantAccountingJournalRegistryUseCase: ListTenantAccountingJournalRegistryUseCase,
    private readonly getTenantAccountingLedgerRegistryWorkspaceUseCase: GetTenantAccountingLedgerRegistryWorkspaceUseCase,
    private readonly getTenantAccountingTrialBalanceWorkspaceUseCase: GetTenantAccountingTrialBalanceWorkspaceUseCase,
    private readonly getTenantAccountingPeriodCloseoutReadinessUseCase: GetTenantAccountingPeriodCloseoutReadinessUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingPeriodCloseoutReportView> {
    const [journalRegistry, ledgerRegistry, trialBalance, readiness] =
      await Promise.all([
        this.listTenantAccountingJournalRegistryUseCase.execute(input),
        this.getTenantAccountingLedgerRegistryWorkspaceUseCase.execute(input),
        this.getTenantAccountingTrialBalanceWorkspaceUseCase.execute(input),
        this.getTenantAccountingPeriodCloseoutReadinessUseCase.execute(input),
      ]);
    const sections: TenantAccountingPeriodCloseoutReportView['sections'] = [
      {
        key: 'journal_registry',
        title: 'Journal registry',
        status: toReadinessStatus(journalRegistry.registryStatus),
        metrics: [
          {
            key: 'entry_count',
            label: 'Asientos',
            value: journalRegistry.summary.entryCount,
          },
          {
            key: 'balanced_entry_count',
            label: 'Asientos balanceados',
            value: journalRegistry.summary.balancedEntryCount,
          },
          {
            key: 'total_debit',
            label: 'Debitos',
            value: journalRegistry.summary.totalDebitInCents,
          },
          {
            key: 'total_credit',
            label: 'Creditos',
            value: journalRegistry.summary.totalCreditInCents,
          },
        ],
        notes: [journalRegistry.nextStep],
      },
      {
        key: 'ledger_registry',
        title: 'Ledger registry',
        status: ledgerRegistry.readinessStatus,
        metrics: [
          {
            key: 'account_count',
            label: 'Cuentas',
            value: ledgerRegistry.summary.accountCount,
          },
          {
            key: 'balanced',
            label: 'Balanceado',
            value: ledgerRegistry.summary.balanced,
          },
          {
            key: 'unapproved_entry_count',
            label: 'Asientos sin aprobar',
            value: ledgerRegistry.summary.unapprovedEntryCount,
          },
        ],
        notes: [ledgerRegistry.nextStep],
      },
      {
        key: 'trial_balance',
        title: 'Balance de comprobacion',
        status: trialBalance.readinessStatus,
        metrics: [
          {
            key: 'account_count',
            label: 'Cuentas',
            value: trialBalance.summary.accountCount,
          },
          {
            key: 'total_debit_balance',
            label: 'Saldo deudor',
            value: trialBalance.summary.totalDebitBalanceInCents,
          },
          {
            key: 'total_credit_balance',
            label: 'Saldo acreedor',
            value: trialBalance.summary.totalCreditBalanceInCents,
          },
          {
            key: 'net_income',
            label: 'Resultado neto',
            value: trialBalance.summary.netIncomeInCents,
          },
        ],
        notes: [trialBalance.nextStep],
      },
      {
        key: 'period_closeout_readiness',
        title: 'Readiness de cierre',
        status: toCloseoutReadinessStatus(readiness.readinessStatus),
        metrics: [
          {
            key: 'ready_checks',
            label: 'Checks listos',
            value: readiness.summary.readyCheckCount,
          },
          {
            key: 'blocked_checks',
            label: 'Checks bloqueados',
            value: readiness.summary.blockedCheckCount,
          },
          {
            key: 'tax_closeout_status',
            label: 'Cierre tributario',
            value: readiness.summary.taxCloseoutStatus,
          },
        ],
        notes: [readiness.nextStep],
      },
    ];
    const blockedSectionCount = sections.filter(
      (section) => section.status === 'blocked',
    ).length;
    const needsReviewSectionCount = sections.filter(
      (section) => section.status === 'needs_review',
    ).length;
    const blockers = [
      ...journalRegistry.blockers,
      ...ledgerRegistry.blockers,
      ...trialBalance.blockers,
      ...readiness.blockers,
    ];
    const reportStatus =
      blockedSectionCount > 0
        ? 'blocked'
        : needsReviewSectionCount > 0
          ? 'needs_review'
          : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      reportStatus,
      sections,
      summary: {
        sectionCount: sections.length,
        readySectionCount: sections.filter(
          (section) => section.status === 'ready',
        ).length,
        needsReviewSectionCount,
        blockedSectionCount,
        journalEntryCount: journalRegistry.summary.entryCount,
        trialBalanceAccountCount: trialBalance.summary.accountCount,
        netIncomeInCents: trialBalance.summary.netIncomeInCents,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        reportStatus === 'ready'
          ? 'Usar este reporte como evidencia operativa del cierre interno.'
          : 'Resolver blockers antes de presentar el cierre como listo.',
      guardrails: [
        'Reporte operativo interno; no es estado financiero oficial.',
        'No reemplaza revision profesional ni cierre legal de libros.',
        'Debe mantenerse trazable a journal registry, ledger registry y evidencia tributaria.',
      ],
    };
  }
}

function toReadinessStatus(
  status: 'ready' | 'empty' | 'needs_review',
): AccountingReadinessStatus {
  if (status === 'ready') {
    return 'ready';
  }

  return status === 'empty' ? 'blocked' : 'needs_review';
}

function toCloseoutReadinessStatus(
  status: 'ready_for_closeout' | 'needs_review' | 'blocked',
): AccountingReadinessStatus {
  if (status === 'ready_for_closeout') {
    return 'ready';
  }

  return status;
}

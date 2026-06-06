import { TenantAccountingLegalBooksReadinessPacketView } from '@saas-platform/accounting-domain';
import { GetTenantAccountingFinancialStatementPreviewUseCase } from './get-tenant-accounting-financial-statement-preview.use-case';
import { GetTenantAccountingLedgerRegistryWorkspaceUseCase } from './get-tenant-accounting-ledger-registry-workspace.use-case';
import { GetTenantAccountingPeriodLockReadinessUseCase } from './get-tenant-accounting-period-lock-readiness.use-case';
import { ListTenantAccountingExternalCloseoutRecordsUseCase } from './list-tenant-accounting-external-closeout-records.use-case';
import { ListTenantAccountingJournalRegistryUseCase } from './list-tenant-accounting-journal-registry.use-case';
import { ListTenantAccountingPeriodLockRegistryUseCase } from './list-tenant-accounting-period-lock-registry.use-case';

export class GetTenantAccountingLegalBooksReadinessPacketUseCase {
  constructor(
    private readonly listTenantAccountingPeriodLockRegistryUseCase: ListTenantAccountingPeriodLockRegistryUseCase,
    private readonly listTenantAccountingJournalRegistryUseCase: ListTenantAccountingJournalRegistryUseCase,
    private readonly getTenantAccountingLedgerRegistryWorkspaceUseCase: GetTenantAccountingLedgerRegistryWorkspaceUseCase,
    private readonly getTenantAccountingFinancialStatementPreviewUseCase: GetTenantAccountingFinancialStatementPreviewUseCase,
    private readonly getTenantAccountingPeriodLockReadinessUseCase: GetTenantAccountingPeriodLockReadinessUseCase,
    private readonly listTenantAccountingExternalCloseoutRecordsUseCase: ListTenantAccountingExternalCloseoutRecordsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingLegalBooksReadinessPacketView> {
    const [
      lockRegistry,
      journalRegistry,
      ledgerRegistry,
      financialPreview,
      lockReadiness,
      externalRecords,
    ] = await Promise.all([
      this.listTenantAccountingPeriodLockRegistryUseCase.execute(input),
      this.listTenantAccountingJournalRegistryUseCase.execute(input),
      this.getTenantAccountingLedgerRegistryWorkspaceUseCase.execute(input),
      this.getTenantAccountingFinancialStatementPreviewUseCase.execute(input),
      this.getTenantAccountingPeriodLockReadinessUseCase.execute(input),
      this.listTenantAccountingExternalCloseoutRecordsUseCase.execute(input),
    ]);
    const externalCloseoutRecord = externalRecords[0] ?? null;
    const externalCloseoutRecorded =
      externalCloseoutRecord?.status === 'confirmed_by_accountant';
    const checks: TenantAccountingLegalBooksReadinessPacketView['checks'] = [
      {
        key: 'period_locked',
        label: 'Periodo bloqueado internamente',
        status: lockRegistry.registryStatus === 'locked' ? 'ready' : 'blocked',
        detail: lockRegistry.nextStep,
      },
      {
        key: 'journals_approved',
        label: 'Journals aprobados',
        status:
          journalRegistry.summary.entryCount > 0 &&
          journalRegistry.summary.approvedEntryCount ===
            journalRegistry.summary.entryCount
            ? 'ready'
            : 'needs_review',
        detail: journalRegistry.nextStep,
      },
      {
        key: 'ledger_balanced',
        label: 'Ledger balanceado',
        status: ledgerRegistry.summary.balanced ? 'ready' : 'blocked',
        detail: ledgerRegistry.nextStep,
      },
      {
        key: 'financial_preview_reviewed',
        label: 'Estados preview revisados',
        status:
          financialPreview.previewStatus === 'ready_for_review'
            ? 'ready'
            : 'needs_review',
        detail: financialPreview.nextStep,
      },
      {
        key: 'lock_readiness',
        label: 'Readiness de lock',
        status:
          lockReadiness.lockReadinessStatus === 'ready_to_lock'
            ? 'ready'
            : 'needs_review',
        detail: lockReadiness.nextStep,
      },
      {
        key: 'external_professional_closeout',
        label: 'Cierre profesional externo',
        status: externalCloseoutRecorded ? 'ready' : 'needs_review',
        detail: externalCloseoutRecorded
          ? 'Confirmacion externa registrada.'
          : 'Registrar confirmacion externa del contador.',
      },
    ];
    const blockers = [
      ...lockRegistry.blockers,
      ...journalRegistry.blockers,
      ...ledgerRegistry.blockers,
      ...financialPreview.blockers,
      ...lockReadiness.blockers,
      ...checks
        .filter((check) => check.status === 'blocked')
        .map((check) => `accounting.legal_books.${check.key}.blocked`),
    ];
    const readyCheckCount = checks.filter((check) => check.status === 'ready')
      .length;
    const blockedCheckCount = checks.filter((check) => check.status === 'blocked')
      .length;
    const readinessStatus =
      blockers.length > 0 || blockedCheckCount > 0
        ? 'blocked'
        : readyCheckCount === checks.length
          ? 'ready_for_legal_book_preparation'
          : 'needs_review';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      readinessStatus,
      checks,
      externalCloseoutRecord,
      summary: {
        checkCount: checks.length,
        readyCheckCount,
        blockedCheckCount,
        externalCloseoutRecorded,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        readinessStatus === 'ready_for_legal_book_preparation'
          ? 'Preparar libros legales fuera de la plataforma con contador.'
          : 'Completar checks antes de preparar libros legales.',
      guardrails: [
        'Readiness no genera ni firma libros legales oficiales.',
        'La preparacion legal debe realizarla un profesional autorizado.',
      ],
    };
  }
}

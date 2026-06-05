import {
  AccountingAccountCategory,
  TenantAccountingLedgerRegistryWorkspaceView,
} from '@saas-platform/accounting-domain';
import { GetTenantAccountingChartOfAccountsWorkspaceUseCase } from './get-tenant-accounting-chart-of-accounts-workspace.use-case';
import { ListTenantAccountingJournalRegistryUseCase } from './list-tenant-accounting-journal-registry.use-case';

export class GetTenantAccountingLedgerRegistryWorkspaceUseCase {
  constructor(
    private readonly listTenantAccountingJournalRegistryUseCase: ListTenantAccountingJournalRegistryUseCase,
    private readonly getTenantAccountingChartOfAccountsWorkspaceUseCase: GetTenantAccountingChartOfAccountsWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingLedgerRegistryWorkspaceView> {
    const [registry, chartWorkspace] = await Promise.all([
      this.listTenantAccountingJournalRegistryUseCase.execute(input),
      this.getTenantAccountingChartOfAccountsWorkspaceUseCase.execute(input),
    ]);
    const categoryByCode = new Map(
      chartWorkspace.accounts.map((account) => [account.code, account.category]),
    );
    const activeEntries = registry.entries.filter(
      (entry) => entry.status !== 'voided',
    );
    const balances = new Map<
      string,
      {
        accountCode: string;
        accountName: string;
        category: AccountingAccountCategory;
        debitInCents: number;
        creditInCents: number;
        sourceJournalEntryIds: Set<string>;
      }
    >();

    for (const entry of activeEntries) {
      for (const line of entry.lines) {
        const current =
          balances.get(line.accountCode) ??
          {
            accountCode: line.accountCode,
            accountName: line.accountName,
            category: categoryByCode.get(line.accountCode) ?? 'uncategorized',
            debitInCents: 0,
            creditInCents: 0,
            sourceJournalEntryIds: new Set<string>(),
          };

        current.debitInCents += line.debitInCents;
        current.creditInCents += line.creditInCents;
        current.sourceJournalEntryIds.add(entry.id);
        balances.set(line.accountCode, current);
      }
    }

    const accountBalances = [...balances.values()]
      .map((balance) => {
        const net = balance.debitInCents - balance.creditInCents;

        return {
          accountCode: balance.accountCode,
          accountName: balance.accountName,
          category: balance.category,
          debitInCents: balance.debitInCents,
          creditInCents: balance.creditInCents,
          netDebitInCents: net > 0 ? net : 0,
          netCreditInCents: net < 0 ? Math.abs(net) : 0,
          sourceJournalEntryIds: [...balance.sourceJournalEntryIds],
        };
      })
      .sort((left, right) => left.accountCode.localeCompare(right.accountCode));
    const totalDebitInCents = accountBalances.reduce(
      (total, account) => total + account.debitInCents,
      0,
    );
    const totalCreditInCents = accountBalances.reduce(
      (total, account) => total + account.creditInCents,
      0,
    );
    const unapprovedEntryCount = activeEntries.filter(
      (entry) => entry.status !== 'approved' && entry.status !== 'posted_preview',
    ).length;
    const blockers = [
      ...registry.blockers,
      ...(activeEntries.length === 0
        ? ['accounting.ledger_registry.no_journal_entries']
        : []),
      ...(unapprovedEntryCount > 0
        ? ['accounting.ledger_registry.unapproved_entries']
        : []),
      ...(totalDebitInCents !== totalCreditInCents
        ? ['accounting.ledger_registry.unbalanced_totals']
        : []),
    ];
    const ledgerStatus =
      blockers.length > 0
        ? 'blocked'
        : unapprovedEntryCount > 0
          ? 'needs_journal_review'
          : 'ready_for_review';
    const readinessStatus =
      ledgerStatus === 'blocked'
        ? 'blocked'
        : ledgerStatus === 'needs_journal_review'
          ? 'needs_review'
          : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      ledgerStatus,
      accountBalances,
      summary: {
        accountCount: accountBalances.length,
        journalEntryCount: activeEntries.length,
        approvedEntryCount: activeEntries.filter(
          (entry) => entry.status === 'approved' || entry.status === 'posted_preview',
        ).length,
        unapprovedEntryCount,
        totalDebitInCents,
        totalCreditInCents,
        balanced: totalDebitInCents === totalCreditInCents,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        ledgerStatus === 'ready_for_review'
          ? 'Usar ledger registry para evaluar closeout readiness.'
          : 'Crear y aprobar journal entries antes de evaluar cierre.',
      guardrails: [
        'Ledger registry se basa en journal entries internos; no es mayor oficial.',
        'No emite estados financieros ni reemplaza revision profesional.',
        'Cualquier posteo formal requiere flujo dedicado y auditoria adicional.',
      ],
    };
  }
}

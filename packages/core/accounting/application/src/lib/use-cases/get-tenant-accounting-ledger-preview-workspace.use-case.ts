import {
  AccountingAccountCategory,
  TenantAccountingLedgerPreviewWorkspaceView,
} from '@saas-platform/accounting-domain';
import { GetTenantAccountingChartOfAccountsWorkspaceUseCase } from './get-tenant-accounting-chart-of-accounts-workspace.use-case';
import { GetTenantAccountingJournalDraftPreviewUseCase } from './get-tenant-accounting-journal-draft-preview.use-case';

export class GetTenantAccountingLedgerPreviewWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingJournalDraftPreviewUseCase: GetTenantAccountingJournalDraftPreviewUseCase,
    private readonly getTenantAccountingChartOfAccountsWorkspaceUseCase: GetTenantAccountingChartOfAccountsWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingLedgerPreviewWorkspaceView> {
    const [journalPreview, chartWorkspace] = await Promise.all([
      this.getTenantAccountingJournalDraftPreviewUseCase.execute(input),
      this.getTenantAccountingChartOfAccountsWorkspaceUseCase.execute(input),
    ]);
    const categoryByCode = new Map(
      chartWorkspace.accounts.map((account) => [account.code, account.category]),
    );
    const approvedPreviewEntries = journalPreview.draftEntries.filter(
      (entry) => entry.blockers.length === 0 && entry.totals.balanced,
    );
    const balances = new Map<
      string,
      {
        accountCode: string;
        accountName: string;
        category: AccountingAccountCategory;
        debitInCents: number;
        creditInCents: number;
        sourceDraftEntryKeys: Set<string>;
      }
    >();

    for (const entry of approvedPreviewEntries) {
      for (const line of entry.lines) {
        if (!line.accountCode || !line.accountName) {
          continue;
        }

        const current =
          balances.get(line.accountCode) ??
          {
            accountCode: line.accountCode,
            accountName: line.accountName,
            category: categoryByCode.get(line.accountCode) ?? 'uncategorized',
            debitInCents: 0,
            creditInCents: 0,
            sourceDraftEntryKeys: new Set<string>(),
          };

        current.debitInCents += line.debitInCents;
        current.creditInCents += line.creditInCents;
        current.sourceDraftEntryKeys.add(entry.draftEntryKey);
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
          sourceDraftEntryKeys: [...balance.sourceDraftEntryKeys],
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
    const unreviewedDraftEntryCount =
      journalPreview.draftEntries.length - approvedPreviewEntries.length;
    const blockers = [
      ...journalPreview.blockers,
      ...(approvedPreviewEntries.length === 0
        ? ['accounting.ledger_preview.no_approved_preview_entries']
        : []),
      ...(totalDebitInCents !== totalCreditInCents
        ? ['accounting.ledger_preview.unbalanced_totals']
        : []),
    ];
    const ledgerStatus =
      blockers.length > 0
        ? 'blocked'
        : unreviewedDraftEntryCount > 0
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
        draftEntryCount: journalPreview.draftEntries.length,
        approvedPreviewEntryCount: approvedPreviewEntries.length,
        unreviewedDraftEntryCount,
        totalDebitInCents,
        totalCreditInCents,
        balanced: totalDebitInCents === totalCreditInCents,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        ledgerStatus === 'ready_for_review'
          ? 'Revisar saldos preview con contador antes de definir posteo formal.'
          : 'Completar mapping y approval de borradores antes de usar ledger preview.',
      guardrails: [
        'Ledger preview consolida borradores revisables; no es mayor oficial.',
        'No calcula estados financieros, impuestos finales ni cierre contable formal.',
        'Los saldos deben validarse contra politica contable y soportes externos.',
      ],
    };
  }
}

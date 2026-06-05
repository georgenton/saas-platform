import {
  AccountingAccountCategory,
  TenantAccountingTrialBalanceWorkspaceView,
} from '@saas-platform/accounting-domain';
import { GetTenantAccountingLedgerRegistryWorkspaceUseCase } from './get-tenant-accounting-ledger-registry-workspace.use-case';

const CATEGORY_ORDER: AccountingAccountCategory[] = [
  'asset',
  'liability',
  'equity',
  'income',
  'expense',
  'tax',
  'uncategorized',
];

export class GetTenantAccountingTrialBalanceWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingLedgerRegistryWorkspaceUseCase: GetTenantAccountingLedgerRegistryWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingTrialBalanceWorkspaceView> {
    const ledger =
      await this.getTenantAccountingLedgerRegistryWorkspaceUseCase.execute(
        input,
      );
    const accounts = ledger.accountBalances
      .map((account) => ({
        accountCode: account.accountCode,
        accountName: account.accountName,
        category: account.category,
        debitBalanceInCents: account.netDebitInCents,
        creditBalanceInCents: account.netCreditInCents,
        sourceJournalEntryIds: [...account.sourceJournalEntryIds],
      }))
      .sort((left, right) => left.accountCode.localeCompare(right.accountCode));
    const sections = CATEGORY_ORDER.map((category) => {
      const categoryAccounts = accounts.filter(
        (account) => account.category === category,
      );

      return {
        category,
        accountCount: categoryAccounts.length,
        debitBalanceInCents: categoryAccounts.reduce(
          (total, account) => total + account.debitBalanceInCents,
          0,
        ),
        creditBalanceInCents: categoryAccounts.reduce(
          (total, account) => total + account.creditBalanceInCents,
          0,
        ),
      };
    }).filter((section) => section.accountCount > 0);
    const totalDebitBalanceInCents = accounts.reduce(
      (total, account) => total + account.debitBalanceInCents,
      0,
    );
    const totalCreditBalanceInCents = accounts.reduce(
      (total, account) => total + account.creditBalanceInCents,
      0,
    );
    const incomeCreditInCents = accounts
      .filter((account) => account.category === 'income')
      .reduce((total, account) => total + account.creditBalanceInCents, 0);
    const expenseDebitInCents = accounts
      .filter((account) => account.category === 'expense')
      .reduce((total, account) => total + account.debitBalanceInCents, 0);
    const blockers = [
      ...ledger.blockers,
      ...(accounts.length === 0
        ? ['accounting.trial_balance.no_accounts']
        : []),
      ...(totalDebitBalanceInCents !== totalCreditBalanceInCents
        ? ['accounting.trial_balance.unbalanced']
        : []),
    ];
    const trialBalanceStatus =
      blockers.length > 0
        ? 'blocked'
        : ledger.ledgerStatus !== 'ready_for_review'
          ? 'needs_ledger_review'
          : 'ready_for_review';
    const readinessStatus =
      trialBalanceStatus === 'blocked'
        ? 'blocked'
        : trialBalanceStatus === 'needs_ledger_review'
          ? 'needs_review'
          : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      trialBalanceStatus,
      accounts,
      sections,
      summary: {
        accountCount: accounts.length,
        journalEntryCount: ledger.summary.journalEntryCount,
        totalDebitBalanceInCents,
        totalCreditBalanceInCents,
        balanced: totalDebitBalanceInCents === totalCreditBalanceInCents,
        netIncomeInCents: incomeCreditInCents - expenseDebitInCents,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        trialBalanceStatus === 'ready_for_review'
          ? 'Usar balance de comprobacion para preparar el cierre contable del periodo.'
          : 'Resolver blockers del ledger registry antes de cerrar el periodo.',
      guardrails: [
        'Balance de comprobacion interno; no reemplaza estados financieros formales.',
        'Los saldos nacen de journal entries internos y requieren revision profesional.',
        'No ejecuta cierres automaticos ni bloquea periodos contables.',
      ],
    };
  }
}

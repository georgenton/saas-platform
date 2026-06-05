import {
  AccountingAccountCategory,
  TenantAccountingFinancialStatementPreviewView,
  TenantAccountingTrialBalanceWorkspaceView,
} from '@saas-platform/accounting-domain';
import { GetTenantAccountingTrialBalanceWorkspaceUseCase } from './get-tenant-accounting-trial-balance-workspace.use-case';

export class GetTenantAccountingFinancialStatementPreviewUseCase {
  constructor(
    private readonly getTenantAccountingTrialBalanceWorkspaceUseCase: GetTenantAccountingTrialBalanceWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingFinancialStatementPreviewView> {
    const trialBalance =
      await this.getTenantAccountingTrialBalanceWorkspaceUseCase.execute(input);
    const revenue = sumCategory(trialBalance, 'income', 'credit');
    const expenses = sumCategory(trialBalance, 'expense', 'debit');
    const taxExpense = sumCategory(trialBalance, 'tax', 'debit');
    const netIncomeInCents = revenue - expenses - taxExpense;
    const assets = sumCategory(trialBalance, 'asset', 'debit');
    const liabilities = sumCategory(trialBalance, 'liability', 'credit');
    const equity = sumCategory(trialBalance, 'equity', 'credit');
    const balanceSheetBalanced =
      assets === liabilities + equity + netIncomeInCents;
    const blockers = [
      ...trialBalance.blockers,
      ...(trialBalance.summary.accountCount === 0
        ? ['accounting.financial_statement_preview.no_trial_balance_accounts']
        : []),
      ...(!trialBalance.summary.balanced
        ? ['accounting.financial_statement_preview.unbalanced_trial_balance']
        : []),
    ];
    const previewStatus =
      blockers.length > 0
        ? 'blocked'
        : trialBalance.trialBalanceStatus !== 'ready_for_review'
          ? 'needs_trial_balance_review'
          : 'ready_for_review';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      previewStatus,
      incomeStatement: {
        revenueInCents: revenue,
        expenseInCents: expenses,
        taxExpenseInCents: taxExpense,
        netIncomeInCents,
        sections: [
          buildSection(trialBalance, 'income', 'Ingresos', 'credit'),
          buildSection(trialBalance, 'expense', 'Gastos', 'debit'),
          buildSection(trialBalance, 'tax', 'Impuestos', 'debit'),
        ].filter((section) => section.accountCodes.length > 0),
      },
      balanceSheet: {
        assetsInCents: assets,
        liabilitiesInCents: liabilities,
        equityInCents: equity,
        retainedEarningsPreviewInCents: netIncomeInCents,
        balanced: balanceSheetBalanced,
        sections: [
          buildSection(trialBalance, 'asset', 'Activos', 'debit'),
          buildSection(trialBalance, 'liability', 'Pasivos', 'credit'),
          buildSection(trialBalance, 'equity', 'Patrimonio', 'credit'),
          {
            key: 'retained_earnings_preview',
            label: 'Resultado del periodo',
            amountInCents: netIncomeInCents,
            accountCodes: [],
          },
        ],
      },
      summary: {
        trialBalanceAccountCount: trialBalance.summary.accountCount,
        journalEntryCount: trialBalance.summary.journalEntryCount,
        netIncomeInCents,
        balanceSheetBalanced,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        previewStatus === 'ready_for_review'
          ? 'Revisar previews financieros con contador antes de emitir estados formales.'
          : 'Resolver trial balance antes de usar previews financieros.',
      guardrails: [
        'Preview financiero interno; no es estado financiero oficial.',
        'No reemplaza notas contables, politicas contables ni revision profesional.',
        'El resultado del periodo se muestra como retained earnings preview, no como cierre legal.',
      ],
    };
  }
}

function sumCategory(
  trialBalance: TenantAccountingTrialBalanceWorkspaceView,
  category: AccountingAccountCategory,
  side: 'debit' | 'credit',
): number {
  return trialBalance.accounts
    .filter((account) => account.category === category)
    .reduce(
      (total, account) =>
        total +
        (side === 'debit'
          ? account.debitBalanceInCents
          : account.creditBalanceInCents),
      0,
    );
}

function buildSection(
  trialBalance: TenantAccountingTrialBalanceWorkspaceView,
  category: AccountingAccountCategory,
  label: string,
  side: 'debit' | 'credit',
): TenantAccountingFinancialStatementPreviewView['incomeStatement']['sections'][number] {
  const accounts = trialBalance.accounts.filter(
    (account) => account.category === category,
  );

  return {
    key: category,
    label,
    amountInCents: accounts.reduce(
      (total, account) =>
        total +
        (side === 'debit'
          ? account.debitBalanceInCents
          : account.creditBalanceInCents),
      0,
    ),
    accountCodes: accounts.map((account) => account.accountCode),
  };
}

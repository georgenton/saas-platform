import {
  AccountingAccountCategory,
  AccountingReadinessStatus,
  TenantAccountingOpeningBalanceWorkspaceView,
} from '@saas-platform/accounting-domain';
import { GetTenantAccountingChartOfAccountsWorkspaceUseCase } from './get-tenant-accounting-chart-of-accounts-workspace.use-case';
import { GetTenantAccountingLedgerRegistryWorkspaceUseCase } from './get-tenant-accounting-ledger-registry-workspace.use-case';

const OPENING_BALANCE_CATEGORIES: AccountingAccountCategory[] = [
  'asset',
  'liability',
  'equity',
];

export class GetTenantAccountingOpeningBalanceWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingChartOfAccountsWorkspaceUseCase: GetTenantAccountingChartOfAccountsWorkspaceUseCase,
    private readonly getTenantAccountingLedgerRegistryWorkspaceUseCase: GetTenantAccountingLedgerRegistryWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingOpeningBalanceWorkspaceView> {
    const [chart, ledger] = await Promise.all([
      this.getTenantAccountingChartOfAccountsWorkspaceUseCase.execute(input),
      this.getTenantAccountingLedgerRegistryWorkspaceUseCase.execute(input),
    ]);
    const ledgerByCode = new Map(
      ledger.accountBalances.map((account) => [account.accountCode, account]),
    );
    const openingAccounts = chart.accounts.filter((account) =>
      OPENING_BALANCE_CATEGORIES.includes(account.category),
    );
    const balanceLines = openingAccounts
      .map((account) => {
        const ledgerBalance = ledgerByCode.get(account.code) ?? null;
        const debitInCents = ledgerBalance?.netDebitInCents ?? 0;
        const creditInCents = ledgerBalance?.netCreditInCents ?? 0;
        const hasLedgerSource = Boolean(ledgerBalance);
        const isMapped = account.status !== 'needs_mapping';
        const source: TenantAccountingOpeningBalanceWorkspaceView['balanceLines'][number]['source'] =
          hasLedgerSource
            ? 'current_ledger_baseline'
            : isMapped
              ? 'chart_account_placeholder'
              : 'manual_required';
        const reviewStatus: AccountingReadinessStatus =
          !isMapped || source === 'manual_required'
            ? 'blocked'
            : source === 'chart_account_placeholder'
              ? 'needs_review'
              : 'ready';

        return {
          lineKey: `opening:${account.code}`,
          accountCode: account.code,
          accountName: account.name,
          category: account.category,
          debitInCents,
          creditInCents,
          source,
          reviewStatus,
          sourceJournalEntryIds: ledgerBalance
            ? [...ledgerBalance.sourceJournalEntryIds]
            : [],
          notes: [
            ...(hasLedgerSource
              ? ['Saldo sugerido desde ledger registry del periodo actual.']
              : ['Cuenta de balance sin saldo ledger; requiere confirmacion.']),
            ...(isMapped
              ? []
              : ['Cuenta pendiente de mapping antes de aprobar apertura.']),
          ],
        };
      })
      .sort((left, right) => left.accountCode.localeCompare(right.accountCode));
    const totalDebitInCents = balanceLines.reduce(
      (total, line) => total + line.debitInCents,
      0,
    );
    const totalCreditInCents = balanceLines.reduce(
      (total, line) => total + line.creditInCents,
      0,
    );
    const blockedLineCount = balanceLines.filter(
      (line) => line.reviewStatus === 'blocked',
    ).length;
    const needsReviewLineCount = balanceLines.filter(
      (line) => line.reviewStatus === 'needs_review',
    ).length;
    const balanced = totalDebitInCents === totalCreditInCents;
    const blockers = [
      ...chart.blockers,
      ...(openingAccounts.length === 0
        ? ['accounting.opening_balance.no_balance_sheet_accounts']
        : []),
      ...(blockedLineCount > 0
        ? ['accounting.opening_balance.lines_blocked']
        : []),
      ...(!balanced ? ['accounting.opening_balance.unbalanced'] : []),
    ];
    const openingBalanceStatus =
      blockers.length > 0
        ? 'blocked'
        : needsReviewLineCount > 0
          ? 'needs_opening_review'
          : 'ready_for_review';
    const readinessStatus =
      openingBalanceStatus === 'blocked'
        ? 'blocked'
        : openingBalanceStatus === 'needs_opening_review'
          ? 'needs_review'
          : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      openingBalanceStatus,
      previousPeriod: resolvePreviousPeriod(input.period, input.year),
      balanceLines,
      suggestedAdjustment:
        balanceLines.length === 0
          ? null
          : {
              adjustmentKey: `opening-balance:${input.period}`,
              label: `Saldos iniciales ${input.period}`,
              currency: 'USD',
              lines: balanceLines.map((line) => ({
                lineKey: `opening-line:${line.accountCode}`,
                accountCode: line.accountCode,
                accountName: line.accountName,
                debitInCents: line.debitInCents,
                creditInCents: line.creditInCents,
                sourceEntryKey: line.lineKey,
                accountHint: line.accountName,
                notes: [...line.notes],
              })),
              totals: {
                debitInCents: totalDebitInCents,
                creditInCents: totalCreditInCents,
                balanced,
              },
            },
      summary: {
        lineCount: balanceLines.length,
        readyLineCount: balanceLines.filter(
          (line) => line.reviewStatus === 'ready',
        ).length,
        needsReviewLineCount,
        blockedLineCount,
        totalDebitInCents,
        totalCreditInCents,
        balanced,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        openingBalanceStatus === 'ready_for_review'
          ? 'Revisar saldos iniciales con contador antes de usarlos como base del periodo.'
          : 'Completar mapping y saldos manuales requeridos antes del cierre contable.',
      guardrails: [
        'Workspace de saldos iniciales; no registra automaticamente asientos.',
        'Los saldos deben aprobarse por revision humana antes de cierre profesional.',
        'No reemplaza migracion contable historica ni estados financieros auditados.',
      ],
    };
  }
}

function resolvePreviousPeriod(period: string, year: number): string {
  const [periodYear, periodMonth] = period.split('-').map(Number);
  const safeYear = Number.isFinite(periodYear) ? periodYear : year;
  const safeMonth = Number.isFinite(periodMonth) ? periodMonth : 1;
  const previousMonth = safeMonth === 1 ? 12 : safeMonth - 1;
  const previousYear = safeMonth === 1 ? safeYear - 1 : safeYear;

  return `${previousYear}-${String(previousMonth).padStart(2, '0')}`;
}

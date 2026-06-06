import { TenantAccountingBankReconciliationWorkspaceView } from '@saas-platform/accounting-domain';
import { GetTenantAccountingLedgerRegistryWorkspaceUseCase } from './get-tenant-accounting-ledger-registry-workspace.use-case';
import { ListTenantAccountingJournalRegistryUseCase } from './list-tenant-accounting-journal-registry.use-case';

export class GetTenantAccountingBankReconciliationWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingLedgerRegistryWorkspaceUseCase: GetTenantAccountingLedgerRegistryWorkspaceUseCase,
    private readonly listTenantAccountingJournalRegistryUseCase: ListTenantAccountingJournalRegistryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingBankReconciliationWorkspaceView> {
    const [ledger, journalRegistry] = await Promise.all([
      this.getTenantAccountingLedgerRegistryWorkspaceUseCase.execute(input),
      this.listTenantAccountingJournalRegistryUseCase.execute(input),
    ]);
    const bankBalances = ledger.accountBalances.filter((account) =>
      isBankAccount(account.accountCode, account.accountName),
    );
    const bankAccounts = bankBalances.map((account) => {
      const ledgerBalanceInCents =
        account.netDebitInCents - account.netCreditInCents;

      return {
        accountKey: `bank:${account.accountCode}`,
        accountCode: account.accountCode,
        accountName: account.accountName,
        currency: 'USD',
        ledgerBalanceInCents,
        statementBalanceInCents: ledgerBalanceInCents,
        differenceInCents: 0,
        sourceJournalEntryIds: [...account.sourceJournalEntryIds],
      };
    });
    const bankAccountKeyByCode = new Map(
      bankAccounts.map((account) => [account.accountCode, account.accountKey]),
    );
    const statementLines = journalRegistry.entries
      .filter((entry) => entry.status !== 'voided')
      .flatMap((entry) =>
        entry.lines
          .filter((line) => isBankAccount(line.accountCode, line.accountName))
          .map((line) => {
            const signedAmount = line.debitInCents - line.creditInCents;

            return {
              lineKey: `statement:${entry.id}:${line.lineKey}`,
              accountKey:
                bankAccountKeyByCode.get(line.accountCode) ??
                `bank:${line.accountCode}`,
              postedAt: entry.approvedAt ?? entry.createdAt,
              description: entry.label,
              direction: signedAmount >= 0 ? 'inflow' as const : 'outflow' as const,
              amountInCents: Math.abs(signedAmount),
              currency: entry.currency,
              reference: line.sourceEntryKey,
              sourceJournalEntryId: entry.id,
            };
          }),
      )
      .sort((left, right) => left.postedAt.getTime() - right.postedAt.getTime());
    const candidates: TenantAccountingBankReconciliationWorkspaceView['candidates'] =
      statementLines.map((line) => {
      const account = bankAccounts.find(
        (bankAccount) => bankAccount.accountKey === line.accountKey,
      );
      const matchStatus = line.sourceJournalEntryId
        ? 'exact_match' as const
        : 'unmatched' as const;

      return {
        candidateKey: `candidate:${line.lineKey}`,
        statementLineKey: line.lineKey,
        journalEntryId: line.sourceJournalEntryId,
        accountCode: account?.accountCode ?? line.accountKey.replace('bank:', ''),
        accountName: account?.accountName ?? 'Cuenta bancaria sin mapping',
        matchStatus,
        confidence: matchStatus === 'exact_match' ? 1 : 0,
        amountInCents: line.amountInCents,
        differenceInCents: 0,
        rationale:
          matchStatus === 'exact_match'
            ? 'Linea bancaria derivada de journal entry aprobado sobre cuenta bancaria.'
            : 'Linea bancaria requiere busqueda manual contra ledger.',
      };
    });
    const totalStatementAmountInCents = statementLines.reduce(
      (total, line) => total + line.amountInCents,
      0,
    );
    const totalLedgerBankAmountInCents = bankAccounts.reduce(
      (total, account) => total + Math.abs(account.ledgerBalanceInCents),
      0,
    );
    const totalDifferenceInCents = bankAccounts.reduce(
      (total, account) => total + Math.abs(account.differenceInCents),
      0,
    );
    const exactMatchCount = candidates.filter(
      (candidate) => candidate.matchStatus === 'exact_match',
    ).length;
    const needsReviewCount = candidates.filter(
      (candidate) => candidate.matchStatus === 'needs_review',
    ).length;
    const unmatchedCount = candidates.filter(
      (candidate) => candidate.matchStatus === 'unmatched',
    ).length;
    const blockers = [
      ...ledger.blockers,
      ...(bankAccounts.length === 0
        ? ['accounting.bank_reconciliation.no_bank_accounts']
        : []),
      ...(statementLines.length === 0
        ? ['accounting.bank_reconciliation.no_statement_lines']
        : []),
      ...(totalDifferenceInCents > 0
        ? ['accounting.bank_reconciliation.statement_ledger_difference']
        : []),
    ];
    const reconciliationStatus =
      blockers.length > 0
        ? 'blocked'
        : needsReviewCount > 0 || unmatchedCount > 0
          ? 'needs_review'
          : 'ready_for_review';
    const readinessStatus =
      reconciliationStatus === 'blocked'
        ? 'blocked'
        : reconciliationStatus === 'needs_review'
          ? 'needs_review'
          : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      reconciliationStatus,
      bankAccounts,
      statementLines,
      candidates,
      summary: {
        bankAccountCount: bankAccounts.length,
        statementLineCount: statementLines.length,
        candidateCount: candidates.length,
        exactMatchCount,
        needsReviewCount,
        unmatchedCount,
        totalStatementAmountInCents,
        totalLedgerBankAmountInCents,
        totalDifferenceInCents,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        reconciliationStatus === 'ready_for_review'
          ? 'Preparar match packet para aprobacion humana de conciliacion.'
          : 'Completar cuentas bancarias, extractos o diferencias antes de cierre.',
      guardrails: [
        'Workspace de conciliacion interna; no importa ni certifica extractos bancarios reales.',
        'Los matches sugeridos requieren revision humana antes de cierre.',
        'No muta journals ni saldos; solo organiza evidencia operacional.',
      ],
    };
  }
}

function isBankAccount(accountCode: string, accountName: string): boolean {
  const normalizedName = accountName.toLowerCase();

  return (
    accountCode.startsWith('101') ||
    normalizedName.includes('banco') ||
    normalizedName.includes('caja')
  );
}

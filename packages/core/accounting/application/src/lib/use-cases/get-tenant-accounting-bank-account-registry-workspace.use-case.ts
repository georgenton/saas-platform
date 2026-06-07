import { TenantAccountingBankAccountRegistryWorkspaceView } from '@saas-platform/accounting-domain';
import { GetTenantAccountingLedgerRegistryWorkspaceUseCase } from './get-tenant-accounting-ledger-registry-workspace.use-case';
import { GetTenantAccountingOpeningBalanceWorkspaceUseCase } from './get-tenant-accounting-opening-balance-workspace.use-case';
import { ListTenantAccountingBankStatementRegistryUseCase } from './list-tenant-accounting-bank-statement-registry.use-case';

export class GetTenantAccountingBankAccountRegistryWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingLedgerRegistryWorkspaceUseCase: GetTenantAccountingLedgerRegistryWorkspaceUseCase,
    private readonly listTenantAccountingBankStatementRegistryUseCase: ListTenantAccountingBankStatementRegistryUseCase,
    private readonly getTenantAccountingOpeningBalanceWorkspaceUseCase: GetTenantAccountingOpeningBalanceWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingBankAccountRegistryWorkspaceView> {
    const [ledger, statements, openingBalance] = await Promise.all([
      this.getTenantAccountingLedgerRegistryWorkspaceUseCase.execute(input),
      this.listTenantAccountingBankStatementRegistryUseCase.execute(input),
      this.getTenantAccountingOpeningBalanceWorkspaceUseCase.execute(input),
    ]);
    const byCode = new Map<
      string,
      TenantAccountingBankAccountRegistryWorkspaceView['accounts'][number]
    >();

    for (const account of ledger.accountBalances.filter((item) =>
      isBankAccount(item.accountCode, item.accountName),
    )) {
      byCode.set(account.accountCode, {
        accountKey: `bank:${account.accountCode}`,
        accountCode: account.accountCode,
        accountName: account.accountName,
        bankName: inferBankName(account.accountName),
        alias: account.accountName,
        currency: 'USD',
        isPrimary: byCode.size === 0,
        status: 'active',
        source: 'ledger_registry',
        ledgerBalanceInCents: account.netDebitInCents - account.netCreditInCents,
        statementLineCount: 0,
        notes: ['Detectada desde ledger registry.'],
      });
    }

    for (const line of statements.lines) {
      const existing = byCode.get(line.accountCode);

      if (existing) {
        existing.statementLineCount += 1;
        continue;
      }

      byCode.set(line.accountCode, {
        accountKey: line.accountKey,
        accountCode: line.accountCode,
        accountName: line.accountName,
        bankName: inferBankName(line.accountName),
        alias: line.accountName,
        currency: line.currency,
        isPrimary: byCode.size === 0,
        status: 'needs_review',
        source: 'bank_statement',
        ledgerBalanceInCents: 0,
        statementLineCount: 1,
        notes: ['Detectada desde extracto bancario importado.'],
      });
    }

    for (const line of openingBalance.balanceLines.filter((item) =>
      isBankAccount(item.accountCode, item.accountName),
    )) {
      if (byCode.has(line.accountCode)) {
        continue;
      }

      byCode.set(line.accountCode, {
        accountKey: `bank:${line.accountCode}`,
        accountCode: line.accountCode,
        accountName: line.accountName,
        bankName: inferBankName(line.accountName),
        alias: line.accountName,
        currency: 'USD',
        isPrimary: byCode.size === 0,
        status: line.reviewStatus === 'ready' ? 'active' : 'needs_review',
        source: 'opening_balance',
        ledgerBalanceInCents: line.debitInCents - line.creditInCents,
        statementLineCount: 0,
        notes: ['Detectada desde saldos iniciales.'],
      });
    }

    const accounts = [...byCode.values()].sort((left, right) =>
      left.accountCode.localeCompare(right.accountCode),
    );
    const blockers = [
      ...(accounts.length === 0
        ? ['accounting.bank_account_registry.no_bank_accounts']
        : []),
      ...(accounts.filter((account) => account.isPrimary).length === 0
        ? ['accounting.bank_account_registry.primary_required']
        : []),
    ];
    const registryStatus =
      blockers.length > 0
        ? 'blocked'
        : accounts.some((account) => account.status === 'needs_review')
          ? 'needs_review'
          : accounts.length > 0
            ? 'ready'
            : 'empty';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      registryStatus,
      accounts,
      summary: {
        accountCount: accounts.length,
        activeAccountCount: accounts.filter(
          (account) => account.status === 'active',
        ).length,
        needsReviewAccountCount: accounts.filter(
          (account) => account.status === 'needs_review',
        ).length,
        primaryAccountCount: accounts.filter((account) => account.isPrimary)
          .length,
        statementLinkedAccountCount: accounts.filter(
          (account) => account.statementLineCount > 0,
        ).length,
      },
      blockers,
      nextStep:
        registryStatus === 'ready'
          ? 'Usar registro bancario para perfiles de importacion y conciliacion.'
          : 'Confirmar cuentas bancarias antes de cash closeout.',
      guardrails: [
        'Registro operacional derivado; no conecta bancos reales.',
        'Cuenta principal es sugerida y requiere confirmacion humana.',
        'No certifica saldos bancarios contra feeds externos.',
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

function inferBankName(accountName: string): string | null {
  const normalizedName = accountName.toLowerCase();

  if (normalizedName.includes('pichincha')) {
    return 'Banco Pichincha';
  }

  if (normalizedName.includes('guayaquil')) {
    return 'Banco Guayaquil';
  }

  if (normalizedName.includes('produbanco')) {
    return 'Produbanco';
  }

  return normalizedName.includes('banco') ? accountName : null;
}

import {
  AccountingAccountCategory,
  TenantAccountingChartOfAccountsWorkspaceView,
} from '@saas-platform/accounting-domain';
import {
  GetTenantEcuadorTaxAccountingBridgeMappingUseCase,
  GetTenantEcuadorTaxAccountingBridgeSuggestedAccountsUseCase,
} from '@saas-platform/tax-compliance-application';

const SEED_ACCOUNTS = [
  {
    code: '101.01',
    name: 'Caja y bancos',
    category: 'asset' as const,
    notes: ['Cuenta semilla para contrapartidas de cobro/pago en previews.'],
  },
  {
    code: '301.01',
    name: 'Patrimonio',
    category: 'equity' as const,
    notes: ['Cuenta semilla informativa; no se usa para posteo automatico.'],
  },
];

export class GetTenantAccountingChartOfAccountsWorkspaceUseCase {
  constructor(
    private readonly getTenantEcuadorTaxAccountingBridgeMappingUseCase: GetTenantEcuadorTaxAccountingBridgeMappingUseCase,
    private readonly getTenantEcuadorTaxAccountingBridgeSuggestedAccountsUseCase: GetTenantEcuadorTaxAccountingBridgeSuggestedAccountsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingChartOfAccountsWorkspaceView> {
    const [mapping, suggestions] = await Promise.all([
      this.getTenantEcuadorTaxAccountingBridgeMappingUseCase.execute(input),
      this.getTenantEcuadorTaxAccountingBridgeSuggestedAccountsUseCase.execute(
        input,
      ),
    ]);
    const suggestionByHint = new Map(
      suggestions.rows.map((row) => [row.accountHint, row] as const),
    );
    const accounts = [
      ...SEED_ACCOUNTS.map((account) => ({
        accountKey: `seed:${account.code}`,
        code: account.code,
        name: account.name,
        category: account.category,
        source: 'accounting_seed' as const,
        mappedAccountHint: null,
        status: 'suggested' as const,
        appliesToEntryKeys: [],
        notes: account.notes,
      })),
      ...mapping.rows.map((row) => {
        const suggestion = suggestionByHint.get(row.accountHint) ?? null;
        const code = row.suggestedAccountCode ?? suggestion?.suggestedAccountCode;
        const name = row.suggestedAccountName ?? suggestion?.suggestedAccountName;
        const mapped = Boolean(row.suggestedAccountCode);

        return {
          accountKey: `tax-hint:${row.accountHint}`,
          code: code ?? `MAP-${slugify(row.accountHint)}`,
          name: name ?? row.accountHint,
          category: suggestion
            ? toAccountingCategory(suggestion.category)
            : ('uncategorized' as const),
          source: mapped
            ? ('tax_bridge_mapping' as const)
            : ('tax_bridge_suggestion' as const),
          mappedAccountHint: row.accountHint,
          status: mapped
            ? ('mapped' as const)
            : suggestion
              ? ('suggested' as const)
              : ('needs_mapping' as const),
          appliesToEntryKeys: suggestion?.appliesToEntryKeys ?? [],
          notes:
            suggestion?.notes ?? [
              'Cuenta pendiente de validacion contable antes de generar asientos.',
            ],
        };
      }),
    ];
    const needsMappingCount = accounts.filter(
      (account) => account.status === 'needs_mapping',
    ).length;
    const blockers =
      mapping.summary.hintCount === 0
        ? ['accounting.chart_of_accounts.no_tax_hints']
        : [];
    const readinessStatus =
      blockers.length > 0
        ? 'blocked'
        : needsMappingCount > 0
          ? 'needs_review'
          : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      accounts,
      summary: {
        accountCount: accounts.length,
        mappedAccountCount: accounts.filter(
          (account) => account.status === 'mapped',
        ).length,
        suggestedAccountCount: accounts.filter(
          (account) => account.status === 'suggested',
        ).length,
        needsMappingCount,
        sourceHintCount: mapping.summary.hintCount,
      },
      blockers,
      nextStep:
        readinessStatus === 'ready'
          ? 'Usar el plan de cuentas foundation para revisar borradores de asientos.'
          : 'Validar cuentas sugeridas y mapear hints pendientes antes de posteo formal.',
      guardrails: [
        'Foundation de plan de cuentas: no reemplaza catalogo contable aprobado.',
        'Las cuentas derivadas de Tax Compliance requieren revision de contador.',
        'No crea asientos oficiales, mayor, balance ni estados financieros.',
      ],
    };
  }
}

function toAccountingCategory(
  category: string,
): AccountingAccountCategory {
  if (category === 'sales') {
    return 'income';
  }

  if (category === 'purchase' || category === 'expense') {
    return 'expense';
  }

  if (category === 'vat' || category === 'withholding') {
    return 'tax';
  }

  return 'uncategorized';
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32)
    .toUpperCase();
}

import { EcuadorTaxAccountingBridgeSuggestedAccountsView } from '@saas-platform/tax-compliance-domain';
import { RequestTenantEcuadorTaxAccountingBridgePreviewUseCase } from './request-tenant-ecuador-tax-accounting-bridge-preview.use-case';

const SUGGESTED_ACCOUNTS = [
  {
    match: 'ingresos',
    accountHint: 'Ingresos por ventas',
    suggestedAccountCode: '401.01',
    suggestedAccountName: 'Ingresos por ventas locales',
    category: 'sales' as const,
    source: 'ecuador_tax_compliance_seed',
    notes: ['Cuenta sugerida para ingresos gravados derivados del libro de ventas.'],
  },
  {
    match: 'iva cobrado',
    accountHint: 'IVA cobrado',
    suggestedAccountCode: '213.01',
    suggestedAccountName: 'IVA débito fiscal por pagar',
    category: 'vat' as const,
    source: 'ecuador_tax_compliance_seed',
    notes: ['Cuenta sugerida para IVA generado en ventas.'],
  },
  {
    match: 'iva pagado',
    accountHint: 'IVA pagado',
    suggestedAccountCode: '113.01',
    suggestedAccountName: 'IVA crédito fiscal',
    category: 'vat' as const,
    source: 'ecuador_tax_compliance_seed',
    notes: ['Cuenta sugerida para IVA soportado en compras deducibles.'],
  },
  {
    match: 'retencion',
    accountHint: 'Retenciones',
    suggestedAccountCode: '213.02',
    suggestedAccountName: 'Retenciones por pagar',
    category: 'withholding' as const,
    source: 'ecuador_tax_compliance_seed',
    notes: ['Cuenta sugerida para obligaciones de retención pendientes.'],
  },
  {
    match: 'compras',
    accountHint: 'Compras y gastos',
    suggestedAccountCode: '501.01',
    suggestedAccountName: 'Compras y gastos deducibles',
    category: 'purchase' as const,
    source: 'ecuador_tax_compliance_seed',
    notes: ['Cuenta sugerida para soportes de compra o gasto revisados.'],
  },
];

export class GetTenantEcuadorTaxAccountingBridgeSuggestedAccountsUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxAccountingBridgePreviewUseCase: RequestTenantEcuadorTaxAccountingBridgePreviewUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAccountingBridgeSuggestedAccountsView> {
    const preview =
      await this.requestTenantEcuadorTaxAccountingBridgePreviewUseCase.execute({
        ...input,
        recordEvent: false,
      });
    const hints = new Map<string, string[]>();

    for (const entry of preview.entries) {
      if (!entry.accountHint) {
        continue;
      }

      const current = hints.get(entry.accountHint) ?? [];
      current.push(entry.key);
      hints.set(entry.accountHint, current);
    }

    const rows = Array.from(hints.entries()).map(([accountHint, entryKeys]) => {
      const suggestion =
        SUGGESTED_ACCOUNTS.find((candidate) =>
          accountHint.toLowerCase().includes(candidate.match),
        ) ?? null;

      return {
        accountHint,
        suggestedAccountCode: suggestion?.suggestedAccountCode ?? 'TAX-999',
        suggestedAccountName:
          suggestion?.suggestedAccountName ?? `Cuenta sugerida para ${accountHint}`,
        category: suggestion?.category ?? ('uncategorized' as const),
        source: suggestion?.source ?? 'tax_compliance_operator_hint',
        appliesToEntryKeys: [...entryKeys],
        notes: suggestion?.notes ?? [
          'Sugerencia generica; requiere validacion contable antes de usar.',
        ],
      };
    });
    const unmatchedHintCount = rows.filter(
      (row) => row.category === 'uncategorized',
    ).length;

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      rows,
      summary: {
        suggestionCount: rows.length,
        previewHintCount: hints.size,
        unmatchedHintCount,
      },
      nextStep:
        unmatchedHintCount > 0
          ? 'Validar hints sin match con contador antes de cerrar mapping.'
          : 'Usar sugerencias como punto de partida del mapping contable tributario.',
      guardrails: [
        'Catalogo sugerido: no crea plan de cuentas formal ni asientos contables.',
        'Los codigos deben revisarse contra el plan contable real de la empresa.',
      ],
    };
  }
}

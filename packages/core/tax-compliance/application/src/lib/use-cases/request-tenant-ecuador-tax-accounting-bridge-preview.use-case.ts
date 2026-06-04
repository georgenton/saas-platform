import {
  EcuadorTaxAccountingBridgePreviewView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase } from './get-tenant-ecuador-tax-purchase-expense-evidence-workspace.use-case';
import { GetTenantEcuadorTaxWithholdingRegistryUseCase } from './get-tenant-ecuador-tax-withholding-registry.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxSalesBookUseCase } from './request-tenant-ecuador-tax-sales-book.use-case';
import { RequestTenantEcuadorTaxVatDeclarationDraftUseCase } from './request-tenant-ecuador-tax-vat-declaration-draft.use-case';

export class RequestTenantEcuadorTaxAccountingBridgePreviewUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxSalesBookUseCase: RequestTenantEcuadorTaxSalesBookUseCase,
    private readonly getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase: GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
    private readonly getTenantEcuadorTaxWithholdingRegistryUseCase: GetTenantEcuadorTaxWithholdingRegistryUseCase,
    private readonly requestTenantEcuadorTaxVatDeclarationDraftUseCase: RequestTenantEcuadorTaxVatDeclarationDraftUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxAccountingBridgePreviewView> {
    const [salesBook, purchases, withholdings, vatDraft] = await Promise.all([
      this.requestTenantEcuadorTaxSalesBookUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxWithholdingRegistryUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.requestTenantEcuadorTaxVatDeclarationDraftUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const entries: EcuadorTaxAccountingBridgePreviewView['entries'] = [
      ...salesBook.totalsByCurrency.flatMap((total) => [
        {
          key: `sales_revenue_${total.currency}`,
          label: `Ingresos por ventas ${total.currency}`,
          source: 'tax_sales_book',
          debitInCents: 0,
          creditInCents: total.subtotalInCents,
          currency: total.currency,
          accountHint: 'Ingresos por ventas',
          requiresChartOfAccounts: true,
          notes: ['Derivado del libro tributario de ventas autorizado.'],
        },
        {
          key: `vat_output_${total.currency}`,
          label: `IVA causado ${total.currency}`,
          source: 'vat_declaration_draft',
          debitInCents: 0,
          creditInCents: total.taxInCents,
          currency: total.currency,
          accountHint: 'IVA ventas por pagar',
          requiresChartOfAccounts: true,
          notes: ['Debe cruzarse con casilleros IVA externos.'],
        },
      ]),
      ...purchases.totalsByCurrency.flatMap((total) => [
        {
          key: `purchase_expense_${total.currency}`,
          label: `Compras/gastos deducibles ${total.currency}`,
          source: 'purchase_expense_evidence',
          debitInCents: total.deductibleSubtotalInCents,
          creditInCents: 0,
          currency: total.currency,
          accountHint: 'Compras y gastos deducibles',
          requiresChartOfAccounts: true,
          notes: ['Categoria contable definitiva requiere plan de cuentas.'],
        },
        {
          key: `vat_input_${total.currency}`,
          label: `IVA credito tributario ${total.currency}`,
          source: 'vat_declaration_draft',
          debitInCents: total.vatInCents,
          creditInCents: 0,
          currency: total.currency,
          accountHint: 'IVA credito tributario',
          requiresChartOfAccounts: true,
          notes: ['Depende de deducibilidad y autorizacion del soporte.'],
        },
      ]),
      ...withholdings.rows.map((row) => ({
        key: `withholding_${row.key}`,
        label: `Retencion: ${row.label}`,
        source: 'withholding_registry',
        debitInCents: row.source === 'sales_candidate' ? row.amountInCents : 0,
        creditInCents:
          row.source === 'purchase_candidate' ? row.amountInCents : 0,
        currency: row.currency,
        accountHint:
          row.source === 'sales_candidate'
            ? 'Retenciones por cobrar'
            : 'Retenciones por pagar',
        requiresChartOfAccounts: true,
        notes: [row.nextStep],
      })),
    ].filter((entry) => entry.debitInCents > 0 || entry.creditInCents > 0);
    const blockers = [
      ...salesBook.blockers.map((blocker) => `sales.${blocker}`),
      ...purchases.blockers.map((blocker) => `purchases.${blocker}`),
      ...withholdings.blockers.map((blocker) => `withholding.${blocker}`),
      ...vatDraft.blockers.map((blocker) => `vat.${blocker}`),
    ];
    const readinessStatus = resolveReadinessStatus({
      blockers,
      hasEntries: entries.length > 0,
      hasNeedsReview:
        salesBook.readinessStatus === 'needs_review' ||
        purchases.readinessStatus === 'needs_review' ||
        withholdings.readinessStatus === 'needs_review' ||
        vatDraft.readinessStatus === 'needs_review',
    });
    const view: EcuadorTaxAccountingBridgePreviewView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      entries,
      summary: {
        entryCount: entries.length,
        requiresChartOfAccountsCount: entries.filter(
          (entry) => entry.requiresChartOfAccounts,
        ).length,
        salesDocuments: salesBook.documentRows.length,
        purchaseDocuments: purchases.documentRows.length,
        withholdingCandidates: withholdings.rows.length,
      },
      blockers,
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver blockers tributarios antes de enviar preview contable.'
          : 'Mapear hints contra plan de cuentas para crear un modulo contable completo.',
      guardrails: [
        'Preview contable no registra asientos ni sustituye contabilidad oficial.',
        'Plan de cuentas, diarios y cierres contables pertenecen a un producto de contabilidad posterior.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_accounting_bridge_preview_requested',
        source: 'tax_accounting_bridge_preview',
        payload: {
          readinessStatus,
          summary: view.summary,
          blockerCount: blockers.length,
        },
      });
    }

    return view;
  }
}

function resolveReadinessStatus(input: {
  blockers: string[];
  hasEntries: boolean;
  hasNeedsReview: boolean;
}): EcuadorTaxReadinessStatus {
  if (input.blockers.length > 0 || !input.hasEntries) {
    return 'blocked';
  }

  return input.hasNeedsReview ? 'needs_review' : 'ready';
}

import {
  EcuadorTaxIncomeTaxEvidencePacketView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxObligationCalendarUseCase } from './get-tenant-ecuador-tax-obligation-calendar.use-case';
import { GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase } from './get-tenant-ecuador-tax-purchase-expense-evidence-workspace.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxSalesBookUseCase } from './request-tenant-ecuador-tax-sales-book.use-case';

export class RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxSalesBookUseCase: RequestTenantEcuadorTaxSalesBookUseCase,
    private readonly getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase: GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
    private readonly getTenantEcuadorTaxObligationCalendarUseCase: GetTenantEcuadorTaxObligationCalendarUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxIncomeTaxEvidencePacketView> {
    const [salesBook, purchaseEvidence, calendar] = await Promise.all([
      this.requestTenantEcuadorTaxSalesBookUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxObligationCalendarUseCase.execute(
        input.tenantSlug,
        input.year,
      ),
    ]);
    const incomeObligation =
      calendar.entries.find(
        (entry) =>
          entry.obligationKey === 'income_tax' &&
          (entry.period === String(input.year) || input.period.startsWith(entry.period)),
      ) ?? null;
    const revenueByCurrency = salesBook.totalsByCurrency.map((total) => ({
      currency: total.currency,
      grossRevenueInCents: total.subtotalInCents,
      documentCount: total.documentCount,
    }));
    const expenseByCurrency = purchaseEvidence.totalsByCurrency.map((total) => ({
      currency: total.currency,
      deductibleExpenseInCents: total.deductibleSubtotalInCents,
      expenseDocumentCount: total.documentCount,
    }));
    const estimatedTaxableBaseByCurrency = mergeIncomeTotals(
      revenueByCurrency,
      expenseByCurrency,
    );
    const blockers = [
      ...salesBook.blockers,
      ...purchaseEvidence.blockers,
      ...(incomeObligation?.readinessStatus === 'blocked'
        ? ['income_tax_obligation.calendar_blocked']
        : []),
      ...(incomeObligation ? [] : ['income_tax_obligation.not_scheduled']),
    ];
    const readinessStatus = resolveReadinessStatus({
      blockers,
      salesBookStatus: salesBook.readinessStatus,
      purchaseStatus: purchaseEvidence.readinessStatus,
      incomeObligationStatus: incomeObligation?.readinessStatus ?? 'blocked',
    });
    const view: EcuadorTaxIncomeTaxEvidencePacketView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      incomeObligation,
      revenueByCurrency,
      expenseByCurrency,
      estimatedTaxableBaseByCurrency,
      blockers: [...new Set(blockers)],
      accountantQuestions: [
        'Que gastos del periodo son deducibles para impuesto a la renta?',
        'Existen ingresos no facturados, notas de credito o ajustes contables fuera de la plataforma?',
        'La obligacion de renta se revisara como corte mensual operacional o acumulado anual?',
      ],
      supportChecklist: [
        'Libro de ventas del periodo o acumulado.',
        'Compras y gastos categorizados con soporte.',
        'Terceros/proveedores con datos fiscales completos.',
        'Retenciones y anexos aplicables revisados por contador.',
        'Aprobacion humana antes de usar evidencia en declaracion externa.',
      ],
      nextStep:
        readinessStatus === 'blocked'
          ? 'Completar ventas autorizadas y compras/gastos antes de preparar evidencia de renta.'
          : readinessStatus === 'needs_review'
            ? 'Enviar evidencia de ingresos y gastos al contador para clasificacion fiscal.'
            : 'Usar packet como soporte de renta operacional y mantener aprobacion humana.',
      guardrails: [
        'Este packet no calcula impuesto a la renta final ni contabilidad oficial.',
        'Deducibilidad, conciliacion tributaria y casilleros oficiales requieren contador o producto contable dedicado.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'income_tax_evidence_packet_requested',
        source: 'income_tax_evidence_packet',
        payload: {
          readinessStatus,
          estimatedTaxableBaseByCurrency,
          blockerCount: view.blockers.length,
        },
      });
    }

    return view;
  }
}

function mergeIncomeTotals(
  revenueByCurrency: EcuadorTaxIncomeTaxEvidencePacketView['revenueByCurrency'],
  expenseByCurrency: EcuadorTaxIncomeTaxEvidencePacketView['expenseByCurrency'],
): EcuadorTaxIncomeTaxEvidencePacketView['estimatedTaxableBaseByCurrency'] {
  const currencies = new Set([
    ...revenueByCurrency.map((total) => total.currency),
    ...expenseByCurrency.map((total) => total.currency),
  ]);

  return Array.from(currencies).map((currency) => {
    const revenue =
      revenueByCurrency.find((total) => total.currency === currency)
        ?.grossRevenueInCents ?? 0;
    const expense =
      expenseByCurrency.find((total) => total.currency === currency)
        ?.deductibleExpenseInCents ?? 0;

    return {
      currency,
      revenueInCents: revenue,
      deductibleExpenseInCents: expense,
      estimatedTaxableBaseInCents: Math.max(revenue - expense, 0),
    };
  });
}

function resolveReadinessStatus(input: {
  blockers: string[];
  salesBookStatus: EcuadorTaxReadinessStatus;
  purchaseStatus: EcuadorTaxReadinessStatus;
  incomeObligationStatus: string;
}): EcuadorTaxReadinessStatus {
  if (
    input.blockers.length > 0 ||
    input.salesBookStatus === 'blocked' ||
    input.purchaseStatus === 'blocked' ||
    input.incomeObligationStatus === 'blocked'
  ) {
    return 'blocked';
  }

  if (
    input.salesBookStatus === 'needs_review' ||
    input.purchaseStatus === 'needs_review' ||
    input.incomeObligationStatus === 'needs_review'
  ) {
    return 'needs_review';
  }

  return 'ready';
}

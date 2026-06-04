import {
  EcuadorTaxReadinessStatus,
  EcuadorTaxVatInputOutputReconciliationPacketView,
} from '@saas-platform/tax-compliance-domain';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase } from './get-tenant-ecuador-tax-purchase-expense-evidence-workspace.use-case';
import { RequestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase } from './request-tenant-ecuador-tax-vat-declaration-readiness-packet.use-case';

export class RequestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase {
  constructor(
    private readonly getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase: GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
    private readonly requestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase: RequestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxVatInputOutputReconciliationPacketView> {
    const [purchaseEvidence, vatReadiness] = await Promise.all([
      this.getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.requestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const inputVatByCurrency = purchaseEvidence.totalsByCurrency.map((total) => ({
      currency: total.currency,
      creditableVatInCents: total.vatInCents,
      purchaseDocumentCount: total.documentCount,
    }));
    const netVatByCurrency = mergeVatTotals(
      vatReadiness.vatSummaryByCurrency,
      inputVatByCurrency,
    );
    const blockers = [
      ...vatReadiness.blockers,
      ...purchaseEvidence.blockers,
      ...(purchaseEvidence.documentRows.length === 0
        ? ['vat_input_output.purchase_evidence_empty']
        : []),
    ];
    const readinessStatus = resolveReadinessStatus({
      blockers,
      purchaseStatus: purchaseEvidence.readinessStatus,
      vatStatus: vatReadiness.readinessStatus,
    });
    const view: EcuadorTaxVatInputOutputReconciliationPacketView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      outputVatByCurrency: vatReadiness.vatSummaryByCurrency,
      inputVatByCurrency,
      netVatByCurrency,
      purchaseExpenseEvidenceStatus: purchaseEvidence.readinessStatus,
      vatReadinessStatus: vatReadiness.readinessStatus,
      blockers: [...new Set(blockers)],
      accountantQuestions: [
        'Que comprobantes de compra sustentan credito tributario IVA del periodo?',
        'Existen compras no deducibles o sin derecho a credito que deban excluirse?',
        'Hay retenciones recibidas o emitidas que deban cruzarse antes de declarar?',
      ],
      nextStep:
        readinessStatus === 'blocked'
          ? 'Completar evidencia de compras/gastos antes de estimar IVA neto.'
          : readinessStatus === 'needs_review'
            ? 'Revisar credito tributario con contador antes de preparar declaracion IVA.'
            : 'Usar conciliacion IVA output/input como soporte del packet del contador.',
      guardrails: [
        'IVA neto es una estimacion operacional; no reemplaza formulario SRI ni criterio contable.',
        'Credito tributario requiere comprobantes autorizados y validacion profesional.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'vat_input_output_reconciliation_requested',
        source: 'vat_input_output_reconciliation_packet',
        payload: {
          readinessStatus,
          netVatByCurrency,
          blockerCount: view.blockers.length,
        },
      });
    }

    return view;
  }
}

function mergeVatTotals(
  outputVatByCurrency: EcuadorTaxVatInputOutputReconciliationPacketView['outputVatByCurrency'],
  inputVatByCurrency: EcuadorTaxVatInputOutputReconciliationPacketView['inputVatByCurrency'],
): EcuadorTaxVatInputOutputReconciliationPacketView['netVatByCurrency'] {
  const currencies = new Set([
    ...outputVatByCurrency.map((total) => total.currency),
    ...inputVatByCurrency.map((total) => total.currency),
  ]);

  return Array.from(currencies).map((currency) => {
    const output =
      outputVatByCurrency.find((total) => total.currency === currency)
        ?.vatInCents ?? 0;
    const input =
      inputVatByCurrency.find((total) => total.currency === currency)
        ?.creditableVatInCents ?? 0;

    return {
      currency,
      outputVatInCents: output,
      inputVatInCents: input,
      estimatedVatPayableInCents: Math.max(output - input, 0),
    };
  });
}

function resolveReadinessStatus(input: {
  blockers: string[];
  purchaseStatus: EcuadorTaxReadinessStatus;
  vatStatus: string;
}): EcuadorTaxReadinessStatus {
  if (
    input.blockers.length > 0 ||
    input.purchaseStatus === 'blocked' ||
    input.vatStatus === 'blocked'
  ) {
    return 'blocked';
  }

  if (input.purchaseStatus === 'needs_review' || input.vatStatus === 'needs_review') {
    return 'needs_review';
  }

  return 'ready';
}

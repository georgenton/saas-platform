import {
  EcuadorTaxAccountingReadinessPacketView,
  EcuadorTaxReadinessStatus,
  EcuadorTaxReviewPriority,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountingBridgeMappingUseCase } from './get-tenant-ecuador-tax-accounting-bridge-mapping.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxPeriodCloseoutReportUseCase } from './request-tenant-ecuador-tax-period-closeout-report.use-case';
import { RequestTenantEcuadorTaxReviewAssistantPacketUseCase } from './request-tenant-ecuador-tax-review-assistant-packet.use-case';

export class RequestTenantEcuadorTaxAccountingReadinessPacketUseCase {
  constructor(
    private readonly getTenantEcuadorTaxAccountingBridgeMappingUseCase: GetTenantEcuadorTaxAccountingBridgeMappingUseCase,
    private readonly requestTenantEcuadorTaxPeriodCloseoutReportUseCase: RequestTenantEcuadorTaxPeriodCloseoutReportUseCase,
    private readonly requestTenantEcuadorTaxReviewAssistantPacketUseCase: RequestTenantEcuadorTaxReviewAssistantPacketUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxAccountingReadinessPacketView> {
    const [mapping, closeoutReport, assistantPacket] = await Promise.all([
      this.getTenantEcuadorTaxAccountingBridgeMappingUseCase.execute(input),
      this.requestTenantEcuadorTaxPeriodCloseoutReportUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.requestTenantEcuadorTaxReviewAssistantPacketUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const summary = {
      accountingMappedHints: mapping.summary.mappedHintCount,
      accountingUnmappedHints: mapping.summary.unmappedHintCount,
      closeoutBlockerCount: closeoutReport.blockers.length,
      assistantRiskSignalCount: assistantPacket.riskSignals.length,
      evidenceArtifactCount: closeoutReport.sections.reduce(
        (total, section) => total + section.artifactCount,
        0,
      ),
      auditEventCount: closeoutReport.totals.auditEventCount,
    };
    const decisionSignals = [
      buildDecisionSignal({
        key: 'accounting_bridge_depth',
        label: 'Bridge contable tributario',
        count:
          mapping.summary.mappedHintCount +
          mapping.summary.unmappedHintCount +
          mapping.summary.previewEntryCount,
        threshold: 8,
        rationale: `${mapping.summary.previewEntryCount} entradas y ${mapping.summary.hintCount} hints contables.`,
      }),
      buildDecisionSignal({
        key: 'period_closeout_pressure',
        label: 'Presion de cierre operacional',
        count: closeoutReport.blockers.length + closeoutReport.sections.length,
        threshold: 10,
        rationale: `${closeoutReport.sections.length} secciones y ${closeoutReport.blockers.length} blockers en cierre.`,
      }),
      buildDecisionSignal({
        key: 'assistant_review_pressure',
        label: 'Senales del asistente tributario',
        count:
          assistantPacket.riskSignals.length +
          assistantPacket.accountantQuestions.length,
        threshold: 8,
        rationale: `${assistantPacket.riskSignals.length} riesgos y ${assistantPacket.accountantQuestions.length} preguntas para contador.`,
      }),
      buildDecisionSignal({
        key: 'evidence_volume',
        label: 'Volumen de evidencia conservable',
        count:
          closeoutReport.totals.salesDocuments +
          closeoutReport.totals.purchaseDocuments +
          closeoutReport.totals.withholdingCandidates,
        threshold: 12,
        rationale: `${closeoutReport.totals.salesDocuments} ventas, ${closeoutReport.totals.purchaseDocuments} compras y ${closeoutReport.totals.withholdingCandidates} retenciones.`,
      }),
    ];
    const graduateSignalCount = decisionSignals.filter(
      (signal) => signal.severity !== 'normal',
    ).length;
    const recommendation =
      graduateSignalCount >= 2 || summary.accountingUnmappedHints > 0
        ? 'graduate_to_accounting'
        : 'stay_in_tax_compliance';
    const readinessStatus: EcuadorTaxReadinessStatus =
      closeoutReport.readinessStatus === 'blocked' ||
      assistantPacket.readinessStatus === 'blocked'
        ? 'blocked'
        : recommendation === 'graduate_to_accounting'
          ? 'needs_review'
          : 'ready';
    const view: EcuadorTaxAccountingReadinessPacketView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      recommendation,
      summary,
      decisionSignals,
      suggestedAccountingScope: buildSuggestedAccountingScope(mapping.summary),
      nextProductRecommendation: {
        productKey:
          recommendation === 'graduate_to_accounting'
            ? 'accounting'
            : 'tax-compliance-ec',
        rationale:
          recommendation === 'graduate_to_accounting'
            ? 'El periodo ya muestra suficiente presion de cuentas, evidencia y revision profesional para justificar un primer Accounting Foundation.'
            : 'Tax Compliance EC todavia cubre el cierre operativo sin abrir diarios, mayores ni estados financieros.',
      },
      blockers: [
        ...closeoutReport.blockers,
        ...assistantPacket.blockers,
        ...mapping.blockers,
      ],
      nextStep:
        recommendation === 'graduate_to_accounting'
          ? 'Preparar un primer slice de Accounting Foundation sin mover ownership tributario fuera de Tax Compliance EC.'
          : 'Mantener el cierre dentro de Tax Compliance EC y revisar nuevamente cuando aumente volumen o complejidad.',
      guardrails: [
        'Este packet decide readiness de producto; no crea asientos, mayor, balance ni estados financieros.',
        'Accounting debe nacer como producto separado si se requieren libros formales.',
        'Tax Compliance EC conserva ownership de obligaciones, evidencia y handoff externo.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_accounting_readiness_packet_requested',
        source: 'tax_accounting_readiness',
        payload: {
          readinessStatus,
          recommendation,
          summary,
          graduateSignalCount,
        },
      });
    }

    return view;
  }
}

function buildDecisionSignal(input: {
  key: string;
  label: string;
  count: number;
  threshold: number;
  rationale: string;
}): EcuadorTaxAccountingReadinessPacketView['decisionSignals'][number] {
  const severity: EcuadorTaxReviewPriority =
    input.count >= input.threshold * 2
      ? 'critical'
      : input.count >= input.threshold
        ? 'high'
        : 'normal';

  return {
    key: input.key,
    label: input.label,
    severity,
    rationale: input.rationale,
  };
}

function buildSuggestedAccountingScope(
  summary: { hintCount: number; mappedHintCount: number; unmappedHintCount: number },
): EcuadorTaxAccountingReadinessPacketView['suggestedAccountingScope'] {
  return [
    {
      key: 'chart_of_accounts',
      label: 'Plan de cuentas',
      reason: `${summary.mappedHintCount}/${summary.hintCount} hints tributarios ya tienen mapping inicial.`,
      source: 'tax_accounting_bridge_mapping',
    },
    {
      key: 'journal_entry_drafts',
      label: 'Borradores de asientos',
      reason: 'El bridge tributario ya separa ventas, IVA, compras y retenciones como candidatos contables.',
      source: 'tax_accounting_bridge_preview',
    },
    {
      key: 'accountant_close_review',
      label: 'Revision contable de cierre',
      reason:
        summary.unmappedHintCount > 0
          ? 'Todavia hay hints sin cuenta sugerida que requieren criterio contable.'
          : 'El mapping inicial permite revisar el cierre sin automatizar libros formales.',
      source: 'tax_period_closeout_report',
    },
  ];
}
